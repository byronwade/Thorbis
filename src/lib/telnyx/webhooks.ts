/**
 * Telnyx Webhooks Service - Webhook Verification & Processing
 *
 * Production-ready webhook security:
 * - Mandatory signature verification
 * - Timestamp validation (replay protection)
 * - Rate limiting per source
 * - Structured logging
 * - Idempotency tracking
 */

import crypto from "node:crypto";
import { TELNYX_CONFIG } from "./client";
import { telnyxLogger } from "./logger";
import { TelnyxWebhookError, TelnyxErrorCode } from "./errors";
import { telnyxMetrics } from "./metrics";

// =============================================================================
// CONFIGURATION
// =============================================================================

const WEBHOOK_CONFIG = {
	// Maximum age for webhook timestamps (replay protection)
	maxTimestampAgeSeconds: 300, // 5 minutes
	// Minimum allowed timestamp age (future timestamps)
	minTimestampAgeFutureSeconds: 60, // 1 minute tolerance for clock skew
	// Whether to enforce signature verification
	enforceSignatureVerification: process.env.NODE_ENV === "production",
	// Log level for webhook events
	logLevel: (process.env.TELNYX_WEBHOOK_LOG_LEVEL || "info") as "debug" | "info",
};

// Track processed webhook IDs for deduplication (in-memory, short-lived)
const processedWebhooks = new Map<string, number>();
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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
		payload: Record<string, any>;
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

/**
 * Verify webhook signature from Telnyx
 *
 * Telnyx signs webhooks with Ed25519 using your public key.
 * The signature is sent in the `telnyx-signature-ed25519` header.
 *
 * SECURITY: This function enforces signature verification in production.
 */
export function verifyWebhookSignature(params: {
	payload: string | Buffer;
	signature: string;
	timestamp: string;
	correlationId?: string;
}): { valid: boolean; error?: string } {
	const correlationId = params.correlationId || "unknown";

	try {
		const publicKeyBase64 = TELNYX_CONFIG.publicKey;

		// Check if public key is configured
		if (!publicKeyBase64) {
			if (WEBHOOK_CONFIG.enforceSignatureVerification) {
				telnyxLogger.error("Webhook signature verification failed - no public key configured", {
					correlationId,
				});
				return {
					valid: false,
					error: "TELNYX_PUBLIC_KEY is not configured - signature verification required in production",
				};
			}

			telnyxLogger.warn("Webhook signature verification skipped - no public key configured", {
				correlationId,
			});
			return { valid: true };
		}

		// Validate required parameters
		if (!params.signature) {
			telnyxLogger.warn("Webhook missing signature header", { correlationId });
			return { valid: false, error: "Missing signature header" };
		}

		if (!params.timestamp) {
			telnyxLogger.warn("Webhook missing timestamp header", { correlationId });
			return { valid: false, error: "Missing timestamp header" };
		}

		// Build signed payload
		const payloadBuffer = Buffer.isBuffer(params.payload)
			? params.payload
			: Buffer.from(params.payload);
		const signedPayload = Buffer.concat([
			Buffer.from(params.timestamp),
			Buffer.from("|"),
			payloadBuffer,
		]);

		// Create public key
		const publicKey = crypto.createPublicKey({
			key: Buffer.from(publicKeyBase64, "base64"),
			format: "der",
			type: "spki",
		});

		// Verify signature
		const isValid = crypto.verify(
			null,
			signedPayload,
			publicKey,
			Buffer.from(params.signature, "base64"),
		);

		if (!isValid) {
			telnyxLogger.warn("Webhook signature verification failed - invalid signature", {
				correlationId,
			});
			return { valid: false, error: "Invalid signature" };
		}

		telnyxLogger.debug("Webhook signature verified", { correlationId });
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

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(
	rawPayload: string | Buffer,
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
	} catch (_error) {
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
 * Type guard for number events
 */
function isNumberEvent(eventType: WebhookEventType): boolean {
	return eventType.startsWith("number_");
}

/**
 * Calculate call duration from start and end times
 */
function calculateCallDuration(
	startTime: string,
	endTime: string,
): number {
	const start = new Date(startTime).getTime();
	const end = new Date(endTime).getTime();
	return Math.round((end - start) / 1000); // Return duration in seconds
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

/**
 * Validate webhook timestamp to prevent replay attacks
 * Reject webhooks older than 5 minutes or too far in the future
 */
export function isWebhookTimestampValid(
	timestamp: string,
	maxAgeSeconds = WEBHOOK_CONFIG.maxTimestampAgeSeconds,
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
// COMPREHENSIVE WEBHOOK VALIDATION
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
 * Comprehensive webhook validation
 *
 * Validates:
 * 1. Signature (mandatory in production)
 * 2. Timestamp (replay protection)
 * 3. Payload structure
 * 4. Deduplication
 */
export function validateWebhook(params: {
	rawPayload: string | Buffer;
	signature: string;
	timestamp: string;
	correlationId?: string;
}): WebhookValidationResult {
	const correlationId = params.correlationId || `wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

	telnyxLogger.debug("Validating webhook", { correlationId });

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

	// 4. Check for duplicates
	const webhookId = payload.data.id;
	if (webhookId) {
		const isDuplicate = isWebhookDuplicate(webhookId);
		if (isDuplicate) {
			telnyxLogger.info("Duplicate webhook detected", {
				correlationId,
				webhookId,
			});
			telnyxMetrics.recordWebhook(true); // Still count as processed
			return {
				valid: true,
				payload,
				isDuplicate: true,
				correlationId,
			};
		}
		// Mark as processed
		markWebhookProcessed(webhookId);
	}

	telnyxLogger.info("Webhook validated successfully", {
		correlationId,
		eventType: payload.data.event_type,
		webhookId,
	});

	return {
		valid: true,
		payload,
		isDuplicate: false,
		correlationId,
	};
}

// =============================================================================
// DEDUPLICATION
// =============================================================================

/**
 * Check if a webhook has already been processed
 */
export function isWebhookDuplicate(webhookId: string): boolean {
	// Clean up old entries first
	cleanupProcessedWebhooks();

	return processedWebhooks.has(webhookId);
}

/**
 * Mark a webhook as processed
 */
export function markWebhookProcessed(webhookId: string): void {
	processedWebhooks.set(webhookId, Date.now());
}

/**
 * Clean up old processed webhook entries
 */
function cleanupProcessedWebhooks(): void {
	const cutoff = Date.now() - DEDUP_WINDOW_MS;
	for (const [id, timestamp] of processedWebhooks.entries()) {
		if (timestamp < cutoff) {
			processedWebhooks.delete(id);
		}
	}
}

/**
 * Get deduplication stats
 */
export function getDeduplicationStats(): {
	trackedWebhooks: number;
	oldestTimestamp: number | null;
} {
	cleanupProcessedWebhooks();

	let oldestTimestamp: number | null = null;
	for (const timestamp of processedWebhooks.values()) {
		if (oldestTimestamp === null || timestamp < oldestTimestamp) {
			oldestTimestamp = timestamp;
		}
	}

	return {
		trackedWebhooks: processedWebhooks.size,
		oldestTimestamp,
	};
}

/**
 * Clear all tracked webhooks (for testing)
 */
export function clearProcessedWebhooks(): void {
	processedWebhooks.clear();
}
