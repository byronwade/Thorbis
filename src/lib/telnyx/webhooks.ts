/**
 * Telnyx Webhooks Service - Webhook Verification & Processing
 *
 * Production-ready webhook security:
 * - MANDATORY signature verification in production (fail-closed)
 * - Timestamp validation (replay protection)
 * - Database-backed deduplication (works across serverless instances)
 * - Multi-tenant support (company_id scoping)
 * - Structured logging
 */

import crypto from "node:crypto";
import { TELNYX_CONFIG } from "./client";
import { telnyxLogger } from "./logger";
import { TelnyxWebhookError, TelnyxErrorCode } from "./errors";
import { telnyxMetrics } from "./metrics";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// CONFIGURATION
// =============================================================================

const WEBHOOK_CONFIG = {
	// Maximum age for webhook timestamps (replay protection)
	maxTimestampAgeSeconds: 300, // 5 minutes
	// Minimum allowed timestamp age (future timestamps)
	minTimestampAgeFutureSeconds: 60, // 1 minute tolerance for clock skew
	// Deduplication window
	dedupWindowMinutes: 5,
	// Log level for webhook events
	logLevel: (process.env.TELNYX_WEBHOOK_LOG_LEVEL || "info") as "debug" | "info",
};

// In-memory fallback for development (NOT used in production)
const processedWebhooksInMemory = new Map<string, number>();
const DEDUP_WINDOW_MS = WEBHOOK_CONFIG.dedupWindowMinutes * 60 * 1000;

/**
 * Check if we're in production mode
 * IMPORTANT: Fail closed - if NODE_ENV is not explicitly 'development', treat as production
 */
function isProductionMode(): boolean {
	return process.env.NODE_ENV !== "development";
}

/**
 * Telnyx webhook event types
 */
export type WebhookEventType =
	// Call events
	| "call.initiated"
	| "call.answered"
	| "call.hangup"
	| "call.bridged"
	| "call.speak.ended"
	| "call.playback.started"
	| "call.playback.ended"
	| "call.dtmf.received"
	| "call.gather.ended"
	| "call.recording.saved"
	| "call.machine.detection.ended"
	| "call.machine.premium.detection.ended"
	// Message events
	| "message.sent"
	| "message.delivered"
	| "message.sending_failed"
	| "message.delivery_failed"
	| "message.received"
	| "message.finalized"
	// Fax events
	| "fax.received"
	| "fax.sent"
	| "fax.failed"
	// Number events
	| "number_reservation.created"
	| "number_reservation.deleted"
	| "number_order.created"
	| "number_order.updated"
	// Conference events
	| "conference.created"
	| "conference.ended"
	| "conference.participant.joined"
	| "conference.participant.left";

/**
 * Base webhook payload structure
 */
export type WebhookPayload = {
	data: {
		event_type: WebhookEventType;
		id: string;
		occurred_at: string;
		payload: Record<string, unknown>;
		record_type: string;
	};
	meta?: {
		attempt_number: number;
		delivered_to: string;
	};
};

/**
 * Call webhook payload types
 */
export interface CallInitiatedPayload extends WebhookPayload {
	data: {
		event_type: "call.initiated";
		payload: {
			call_control_id: string;
			call_leg_id: string;
			call_session_id: string;
			client_state: string | null;
			connection_id: string;
			direction: "incoming" | "outgoing";
			from: string;
			start_time: string;
			state: "parked";
			to: string;
		};
	} & WebhookPayload["data"];
}

export interface CallAnsweredPayload extends WebhookPayload {
	data: {
		event_type: "call.answered";
		payload: {
			call_control_id: string;
			call_leg_id: string;
			call_session_id: string;
			client_state: string | null;
			connection_id: string;
			from: string;
			start_time: string;
			state: "answered";
			to: string;
		};
	} & WebhookPayload["data"];
}

export interface CallHangupPayload extends WebhookPayload {
	data: {
		event_type: "call.hangup";
		payload: {
			call_control_id: string;
			call_leg_id: string;
			call_session_id: string;
			client_state: string | null;
			connection_id: string;
			end_time: string;
			from: string;
			hangup_cause: string;
			hangup_source: string;
			sip_hangup_cause: string;
			start_time: string;
			state: "hangup";
			to: string;
		};
	} & WebhookPayload["data"];
}

/**
 * Message webhook payload types
 */
export interface MessageReceivedPayload extends WebhookPayload {
	data: {
		event_type: "message.received";
		payload: {
			id: string;
			from: {
				phone_number: string;
				carrier: string;
				line_type: string;
			};
			to: Array<{
				phone_number: string;
				status: string;
			}>;
			text: string;
			media: Array<{
				url: string;
				content_type: string;
				size: number;
			}>;
			received_at: string;
			webhook_url: string;
			webhook_failover_url: string;
		};
	} & WebhookPayload["data"];
}

// =============================================================================
// SIGNATURE VERIFICATION (FAIL-CLOSED IN PRODUCTION)
// =============================================================================

/**
 * Verify webhook signature from Telnyx
 *
 * Telnyx signs webhooks with Ed25519 using your public key.
 * The signature is sent in the `telnyx-signature-ed25519` header.
 *
 * SECURITY: This function FAILS CLOSED in production.
 * - Production: Rejects ALL webhooks if public key is not configured
 * - Development: Allows skipping verification with warning
 */
export function verifyWebhookSignature(params: {
	payload: string | Buffer;
	signature: string;
	timestamp: string;
	correlationId?: string;
}): { valid: boolean; error?: string } {
	const correlationId = params.correlationId || "unknown";
	const isProduction = isProductionMode();

	try {
		const publicKeyBase64 = TELNYX_CONFIG.publicKey;

		// CRITICAL: Fail closed in production if no public key
		if (!publicKeyBase64) {
			if (isProduction) {
				telnyxLogger.error(
					"SECURITY: Webhook rejected - TELNYX_PUBLIC_KEY not configured in production",
					{ correlationId }
				);
				return {
					valid: false,
					error: "TELNYX_PUBLIC_KEY is required in production - webhook rejected",
				};
			}

			// Development only: allow with warning
			telnyxLogger.warn(
				"[DEV ONLY] Webhook signature verification skipped - TELNYX_PUBLIC_KEY not configured",
				{ correlationId }
			);
			return { valid: true };
		}

		// Validate required parameters
		if (!params.signature) {
			telnyxLogger.warn("Webhook missing signature header", { correlationId });
			return { valid: false, error: "Missing telnyx-signature-ed25519 header" };
		}

		if (!params.timestamp) {
			telnyxLogger.warn("Webhook missing timestamp header", { correlationId });
			return { valid: false, error: "Missing telnyx-timestamp header" };
		}

		// Build signed payload: timestamp|payload
		const payloadBuffer = Buffer.isBuffer(params.payload)
			? params.payload
			: Buffer.from(params.payload);
		const signedPayload = Buffer.concat([
			Buffer.from(params.timestamp),
			Buffer.from("|"),
			payloadBuffer,
		]);

		// Create public key from base64 DER format
		const publicKey = crypto.createPublicKey({
			key: Buffer.from(publicKeyBase64, "base64"),
			format: "der",
			type: "spki",
		});

		// Verify Ed25519 signature
		const isValid = crypto.verify(
			null, // Ed25519 doesn't use a separate hash algorithm
			signedPayload,
			publicKey,
			Buffer.from(params.signature, "base64")
		);

		if (!isValid) {
			telnyxLogger.warn("Webhook signature verification failed - invalid signature", {
				correlationId,
			});
			return { valid: false, error: "Invalid signature" };
		}

		telnyxLogger.debug("Webhook signature verified successfully", { correlationId });
		return { valid: true };
	} catch (error) {
		telnyxLogger.error("Webhook signature verification error", {
			correlationId,
			error: error instanceof Error ? error.message : "Unknown error",
		});
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Signature verification failed",
		};
	}
}

// =============================================================================
// PAYLOAD PARSING
// =============================================================================

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(
	rawPayload: string | Buffer
): WebhookPayload | null {
	try {
		const payload =
			typeof rawPayload === "string"
				? JSON.parse(rawPayload)
				: JSON.parse(rawPayload.toString());

		// Validate required fields
		if (!(payload.data?.event_type && payload.data.payload)) {
			return null;
		}

		return payload as WebhookPayload;
	} catch {
		return null;
	}
}

/**
 * Extract event type from webhook payload
 */
export function getEventType(payload: WebhookPayload): WebhookEventType {
	return payload.data.event_type;
}

/**
 * Type guard for call events
 */
export function isCallEvent(eventType: WebhookEventType): boolean {
	return eventType.startsWith("call.");
}

/**
 * Type guard for message events
 */
export function isMessageEvent(eventType: WebhookEventType): boolean {
	return eventType.startsWith("message.");
}

/**
 * Format webhook response for Telnyx
 */
export function createWebhookResponse(success: boolean, message?: string) {
	return {
		success,
		message:
			message ||
			(success
				? "Webhook processed successfully"
				: "Webhook processing failed"),
	};
}

// =============================================================================
// TIMESTAMP VALIDATION (REPLAY PROTECTION)
// =============================================================================

/**
 * Validate webhook timestamp to prevent replay attacks
 * Rejects webhooks older than 5 minutes or too far in the future
 */
export function isWebhookTimestampValid(
	timestamp: string,
	maxAgeSeconds = WEBHOOK_CONFIG.maxTimestampAgeSeconds
): { valid: boolean; error?: string; ageSeconds?: number } {
	try {
		if (!timestamp) {
			return { valid: false, error: "Missing timestamp" };
		}

		let webhookTimeMs: number;

		const numericTimestamp = Number(timestamp);
		if (Number.isFinite(numericTimestamp)) {
			// Telnyx sends UNIX seconds as the timestamp header
			webhookTimeMs = numericTimestamp * 1000;
		} else {
			const parsed = new Date(timestamp).getTime();
			if (Number.isNaN(parsed)) {
				return { valid: false, error: "Invalid timestamp format" };
			}
			webhookTimeMs = parsed;
		}

		const now = Date.now();
		const ageSeconds = (now - webhookTimeMs) / 1000;

		// Check if too old
		if (ageSeconds > maxAgeSeconds) {
			return {
				valid: false,
				error: `Timestamp too old: ${Math.round(ageSeconds)}s (max ${maxAgeSeconds}s)`,
				ageSeconds,
			};
		}

		// Check if too far in the future (clock skew tolerance)
		if (ageSeconds < -WEBHOOK_CONFIG.minTimestampAgeFutureSeconds) {
			return {
				valid: false,
				error: `Timestamp too far in future: ${Math.round(-ageSeconds)}s`,
				ageSeconds,
			};
		}

		return { valid: true, ageSeconds };
	} catch (error) {
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Timestamp validation failed",
		};
	}
}

// =============================================================================
// DATABASE-BACKED DEDUPLICATION (Multi-Tenant)
// =============================================================================

/**
 * Check if a webhook has already been processed (async, database-backed)
 *
 * @param companyId - The company ID for multi-tenant isolation
 * @param webhookId - The unique webhook ID from Telnyx
 * @param source - The webhook source (default: 'telnyx')
 */
export async function isWebhookDuplicateAsync(
	companyId: string,
	webhookId: string,
	source = "telnyx"
): Promise<boolean> {
	try {
		const supabase = await createServiceSupabaseClient();

		if (!supabase) {
			// Fallback to in-memory for development
			telnyxLogger.warn("Database not available, using in-memory deduplication");
			return isWebhookDuplicateInMemory(webhookId);
		}

		const { data, error } = await supabase
			.from("webhook_dedup_cache")
			.select("id")
			.eq("company_id", companyId)
			.eq("webhook_id", webhookId)
			.eq("source", source)
			.gt("expires_at", new Date().toISOString())
			.maybeSingle();

		if (error) {
			telnyxLogger.error("Database dedup check failed", { error: error.message, webhookId });
			// Fail open on database errors to not block webhooks
			return false;
		}

		return data !== null;
	} catch (error) {
		telnyxLogger.error("Deduplication check error", {
			error: error instanceof Error ? error.message : "Unknown error",
			webhookId,
		});
		// Fail open on errors
		return false;
	}
}

/**
 * Mark a webhook as processed (async, database-backed)
 *
 * @param companyId - The company ID for multi-tenant isolation
 * @param webhookId - The unique webhook ID from Telnyx
 * @param source - The webhook source (default: 'telnyx')
 */
export async function markWebhookProcessedAsync(
	companyId: string,
	webhookId: string,
	source = "telnyx"
): Promise<void> {
	try {
		const supabase = await createServiceSupabaseClient();

		if (!supabase) {
			// Fallback to in-memory for development
			markWebhookProcessedInMemory(webhookId);
			return;
		}

		const expiresAt = new Date(Date.now() + DEDUP_WINDOW_MS).toISOString();

		const { error } = await supabase.from("webhook_dedup_cache").upsert(
			{
				company_id: companyId,
				webhook_id: webhookId,
				source,
				processed_at: new Date().toISOString(),
				expires_at: expiresAt,
			},
			{
				onConflict: "company_id,webhook_id,source",
				ignoreDuplicates: false,
			}
		);

		if (error) {
			telnyxLogger.error("Failed to mark webhook as processed", {
				error: error.message,
				webhookId,
			});
		}
	} catch (error) {
		telnyxLogger.error("Mark webhook processed error", {
			error: error instanceof Error ? error.message : "Unknown error",
			webhookId,
		});
	}
}

/**
 * Cleanup expired webhook dedup entries
 * Call this periodically (e.g., via cron job or after processing)
 */
export async function cleanupExpiredWebhookDedup(): Promise<number> {
	try {
		const supabase = await createServiceSupabaseClient();

		if (!supabase) {
			cleanupProcessedWebhooksInMemory();
			return 0;
		}

		// Use the database function for atomic cleanup
		const { data, error } = await supabase.rpc("cleanup_expired_webhook_dedup");

		if (error) {
			telnyxLogger.error("Webhook dedup cleanup failed", { error: error.message });
			return 0;
		}

		const deletedCount = data as number;
		if (deletedCount > 0) {
			telnyxLogger.info(`Cleaned up ${deletedCount} expired webhook dedup entries`);
		}

		return deletedCount;
	} catch (error) {
		telnyxLogger.error("Webhook dedup cleanup error", {
			error: error instanceof Error ? error.message : "Unknown error",
		});
		return 0;
	}
}

// =============================================================================
// IN-MEMORY FALLBACK (Development Only)
// =============================================================================

function isWebhookDuplicateInMemory(webhookId: string): boolean {
	cleanupProcessedWebhooksInMemory();
	return processedWebhooksInMemory.has(webhookId);
}

function markWebhookProcessedInMemory(webhookId: string): void {
	processedWebhooksInMemory.set(webhookId, Date.now());
}

function cleanupProcessedWebhooksInMemory(): void {
	const cutoff = Date.now() - DEDUP_WINDOW_MS;
	for (const [id, timestamp] of processedWebhooksInMemory.entries()) {
		if (timestamp < cutoff) {
			processedWebhooksInMemory.delete(id);
		}
	}
}

// =============================================================================
// COMPREHENSIVE WEBHOOK VALIDATION (Async, Multi-Tenant)
// =============================================================================

export interface WebhookValidationResult {
	valid: boolean;
	error?: string;
	errorCode?: TelnyxErrorCode;
	payload?: WebhookPayload;
	isDuplicate?: boolean;
	correlationId: string;
}

/**
 * Comprehensive webhook validation (async, multi-tenant)
 *
 * Validates:
 * 1. Signature (MANDATORY in production - fail-closed)
 * 2. Timestamp (replay protection)
 * 3. Payload structure
 * 4. Deduplication (database-backed for serverless)
 *
 * @param params.companyId - Required for multi-tenant deduplication
 */
export async function validateWebhookAsync(params: {
	companyId: string;
	rawPayload: string | Buffer;
	signature: string;
	timestamp: string;
	correlationId?: string;
}): Promise<WebhookValidationResult> {
	const correlationId =
		params.correlationId ||
		`wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

	telnyxLogger.debug("Validating webhook", {
		correlationId,
		companyId: params.companyId,
	});

	// 1. Validate signature (FAIL-CLOSED in production)
	const signatureResult = verifyWebhookSignature({
		payload: params.rawPayload,
		signature: params.signature,
		timestamp: params.timestamp,
		correlationId,
	});

	if (!signatureResult.valid) {
		telnyxMetrics.recordWebhook(false);
		return {
			valid: false,
			error: signatureResult.error || "Invalid signature",
			errorCode: TelnyxErrorCode.WEBHOOK_SIGNATURE_INVALID,
			correlationId,
		};
	}

	// 2. Validate timestamp (replay protection)
	const timestampResult = isWebhookTimestampValid(params.timestamp);
	if (!timestampResult.valid) {
		telnyxLogger.warn("Webhook timestamp validation failed", {
			correlationId,
			error: timestampResult.error,
		});
		telnyxMetrics.recordWebhook(false);
		return {
			valid: false,
			error: timestampResult.error || "Invalid timestamp",
			errorCode: TelnyxErrorCode.WEBHOOK_TIMESTAMP_INVALID,
			correlationId,
		};
	}

	// 3. Parse payload
	const payload = parseWebhookPayload(params.rawPayload);
	if (!payload) {
		telnyxLogger.warn("Webhook payload parsing failed", { correlationId });
		telnyxMetrics.recordWebhook(false);
		return {
			valid: false,
			error: "Invalid webhook payload structure",
			errorCode: TelnyxErrorCode.WEBHOOK_VALIDATION_FAILED,
			correlationId,
		};
	}

	// 4. Check for duplicates (database-backed)
	const webhookId = payload.data.id;
	if (webhookId) {
		const isDuplicate = await isWebhookDuplicateAsync(
			params.companyId,
			webhookId
		);

		if (isDuplicate) {
			telnyxLogger.info("Duplicate webhook detected, skipping", {
				correlationId,
				webhookId,
				companyId: params.companyId,
			});
			telnyxMetrics.recordWebhook(true); // Count as processed
			return {
				valid: true,
				payload,
				isDuplicate: true,
				correlationId,
			};
		}

		// Mark as processed
		await markWebhookProcessedAsync(params.companyId, webhookId);
	}

	telnyxLogger.info("Webhook validated successfully", {
		correlationId,
		eventType: payload.data.event_type,
		webhookId,
		companyId: params.companyId,
	});

	telnyxMetrics.recordWebhook(true);

	return {
		valid: true,
		payload,
		isDuplicate: false,
		correlationId,
	};
}

// =============================================================================
// LEGACY SYNC API (Deprecated - use validateWebhookAsync)
// =============================================================================

/**
 * @deprecated Use validateWebhookAsync for production (supports database dedup)
 * Synchronous validation - only uses in-memory deduplication
 */
export function validateWebhook(params: {
	rawPayload: string | Buffer;
	signature: string;
	timestamp: string;
	correlationId?: string;
}): WebhookValidationResult {
	const correlationId =
		params.correlationId ||
		`wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

	telnyxLogger.warn(
		"Using deprecated sync validateWebhook - migrate to validateWebhookAsync",
		{ correlationId }
	);

	// 1. Validate signature
	const signatureResult = verifyWebhookSignature({
		payload: params.rawPayload,
		signature: params.signature,
		timestamp: params.timestamp,
		correlationId,
	});

	if (!signatureResult.valid) {
		telnyxMetrics.recordWebhook(false);
		return {
			valid: false,
			error: signatureResult.error || "Invalid signature",
			errorCode: TelnyxErrorCode.WEBHOOK_SIGNATURE_INVALID,
			correlationId,
		};
	}

	// 2. Validate timestamp
	const timestampResult = isWebhookTimestampValid(params.timestamp);
	if (!timestampResult.valid) {
		telnyxMetrics.recordWebhook(false);
		return {
			valid: false,
			error: timestampResult.error || "Invalid timestamp",
			errorCode: TelnyxErrorCode.WEBHOOK_TIMESTAMP_INVALID,
			correlationId,
		};
	}

	// 3. Parse payload
	const payload = parseWebhookPayload(params.rawPayload);
	if (!payload) {
		telnyxMetrics.recordWebhook(false);
		return {
			valid: false,
			error: "Invalid webhook payload structure",
			errorCode: TelnyxErrorCode.WEBHOOK_VALIDATION_FAILED,
			correlationId,
		};
	}

	// 4. Check for duplicates (in-memory only - not safe for serverless!)
	const webhookId = payload.data.id;
	if (webhookId) {
		const isDuplicate = isWebhookDuplicateInMemory(webhookId);
		if (isDuplicate) {
			telnyxMetrics.recordWebhook(true);
			return {
				valid: true,
				payload,
				isDuplicate: true,
				correlationId,
			};
		}
		markWebhookProcessedInMemory(webhookId);
	}

	telnyxMetrics.recordWebhook(true);

	return {
		valid: true,
		payload,
		isDuplicate: false,
		correlationId,
	};
}

// =============================================================================
// LEGACY EXPORTS (For backwards compatibility)
// =============================================================================

/** @deprecated Use isWebhookDuplicateAsync */
export function isWebhookDuplicate(webhookId: string): boolean {
	return isWebhookDuplicateInMemory(webhookId);
}

/** @deprecated Use markWebhookProcessedAsync */
export function markWebhookProcessed(webhookId: string): void {
	markWebhookProcessedInMemory(webhookId);
}

/** @deprecated Internal use only */
export function clearProcessedWebhooks(): void {
	processedWebhooksInMemory.clear();
}

/** Get deduplication stats (in-memory only) */
export function getDeduplicationStats(): {
	trackedWebhooks: number;
	oldestTimestamp: number | null;
} {
	cleanupProcessedWebhooksInMemory();

	let oldestTimestamp: number | null = null;
	for (const timestamp of processedWebhooksInMemory.values()) {
		if (oldestTimestamp === null || timestamp < oldestTimestamp) {
			oldestTimestamp = timestamp;
		}
	}

	return {
		trackedWebhooks: processedWebhooksInMemory.size,
		oldestTimestamp,
	};
}
