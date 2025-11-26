/**
 * Telnyx Messaging Service - SMS & MMS
 *
 * Production-ready messaging with:
 * - 10DLC compliance verification (required for US A2P SMS as of Dec 2024)
 * - Per-company rate limiting
 * - Retry logic with exponential backoff
 * - Multi-tenant support
 * - Structured logging
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { telnyxLogger } from "./logger";
import { withRetry } from "./retry";

const TELNYX_API_BASE = "https://api.telnyx.com/v2";

// =============================================================================
// CONFIGURATION
// =============================================================================

const MESSAGING_CONFIG = {
	// Default rate limits per company (messages per minute)
	defaultRateLimitPerMinute: 60,
	// Max concurrent sends for bulk operations
	maxConcurrentSends: 5,
	// Warn if 10DLC not configured
	warnOn10DLCMissing: true,
	// Request timeout in milliseconds
	requestTimeoutMs: 30000,
};

// =============================================================================
// API CLIENT
// =============================================================================

function assertTelnyxApiKey(): string {
	const apiKey = process.env.TELNYX_API_KEY;
	if (!apiKey) {
		throw new Error("TELNYX_API_KEY is not configured");
	}
	return apiKey;
}

async function telnyxRequest<T = unknown>(
	path: string,
	init?: RequestInit & {
		query?: Record<string, string | number | undefined>;
		timeout?: number;
	},
): Promise<T> {
	const apiKey = assertTelnyxApiKey();
	const url = new URL(`${TELNYX_API_BASE}${path}`);

	if (init?.query) {
		for (const [key, value] of Object.entries(init.query)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	telnyxLogger.debug("Telnyx API request", {
		method: init?.method || "GET",
		path,
	});

	// Create abort controller for timeout
	const controller = new AbortController();
	const timeout = init?.timeout ?? MESSAGING_CONFIG.requestTimeoutMs;
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...init,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
				...(init?.headers || {}),
			},
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		const data = await response.json();

		if (!response.ok) {
			const detail = data?.errors?.[0]?.detail || response.statusText;
			const errorCode = data?.errors?.[0]?.code;
			telnyxLogger.error("Telnyx API error", {
				status: response.status,
				detail,
				errorCode,
				path,
			});
			throw new Error(`Telnyx ${response.status}: ${detail}`);
		}

		return data as T;
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof Error && error.name === "AbortError") {
			telnyxLogger.error("Telnyx API timeout", {
				path,
				timeoutMs: timeout,
			});
			throw new Error(`Request timeout after ${timeout}ms`);
		}

		throw error;
	}
}

async function telnyxMessageRequest(body: Record<string, unknown>) {
	return telnyxRequest<{ data: TelnyxMessage }>("/messages", {
		method: "POST",
		body: JSON.stringify(body),
	});
}

// =============================================================================
// TYPES
// =============================================================================

export type MessageType = "SMS" | "MMS";

export type MessageStatus =
	| "queued"
	| "sending"
	| "sent"
	| "delivered"
	| "sending_failed"
	| "delivery_failed"
	| "delivery_unconfirmed";

interface TelnyxMessage {
	id: string;
	status: MessageStatus;
	type: MessageType;
	from: { phone_number: string };
	to: Array<{ phone_number: string; status: string }>;
	text?: string;
	media?: Array<{ url: string; content_type: string }>;
	created_at: string;
}

interface SendSMSParams {
	companyId: string;
	to: string;
	from: string;
	text: string;
	webhookUrl?: string;
	webhookFailoverUrl?: string;
	useProfileWebhooks?: boolean;
	messagingProfileId?: string;
	skipRateLimit?: boolean;
	skip10DLCCheck?: boolean;
}

interface SendSMSResult {
	success: boolean;
	messageId?: string;
	data?: TelnyxMessage;
	error?: string;
	warnings?: string[];
}

// =============================================================================
// 10DLC COMPLIANCE CHECK
// =============================================================================

interface TenDLCStatus {
	isConfigured: boolean;
	brandId?: string;
	campaignId?: string;
	messagingProfileId?: string;
	warnings: string[];
}

/**
 * Check 10DLC compliance status for a company
 *
 * As of December 2024, ALL US A2P SMS traffic MUST be registered with 10DLC.
 * Messages sent without proper registration may be filtered or blocked by carriers.
 */
export async function check10DLCStatus(
	companyId: string,
): Promise<TenDLCStatus> {
	try {
		const supabase = await createServiceSupabaseClient();

		if (!supabase) {
			return {
				isConfigured: false,
				warnings: ["Database not available - cannot verify 10DLC status"],
			};
		}

		const { data: settings, error } = await supabase
			.from("company_telnyx_settings")
			.select(
				"ten_dlc_brand_id, ten_dlc_campaign_id, messaging_profile_id, status",
			)
			.eq("company_id", companyId)
			.maybeSingle();

		if (error) {
			telnyxLogger.error("Failed to check 10DLC status", {
				companyId,
				error: error.message,
			});
			return {
				isConfigured: false,
				warnings: ["Failed to verify 10DLC status"],
			};
		}

		if (!settings) {
			return {
				isConfigured: false,
				warnings: ["No Telnyx settings configured for company"],
			};
		}

		const warnings: string[] = [];

		if (!settings.ten_dlc_brand_id) {
			warnings.push("10DLC brand not registered - US SMS may be filtered");
		}

		if (!settings.ten_dlc_campaign_id) {
			warnings.push("10DLC campaign not registered - US SMS may be filtered");
		}

		if (!settings.messaging_profile_id) {
			warnings.push("Messaging profile not configured");
		}

		const isConfigured =
			!!settings.ten_dlc_brand_id &&
			!!settings.ten_dlc_campaign_id &&
			!!settings.messaging_profile_id;

		return {
			isConfigured,
			brandId: settings.ten_dlc_brand_id || undefined,
			campaignId: settings.ten_dlc_campaign_id || undefined,
			messagingProfileId: settings.messaging_profile_id || undefined,
			warnings,
		};
	} catch (error) {
		telnyxLogger.error("10DLC check error", {
			companyId,
			error: error instanceof Error ? error.message : "Unknown error",
		});
		return {
			isConfigured: false,
			warnings: ["Error checking 10DLC status"],
		};
	}
}

// =============================================================================
// RATE LIMITING
// =============================================================================

/**
 * Check and increment SMS rate limit for a company
 *
 * @returns true if under limit, false if rate limited
 */
export async function checkSMSRateLimit(
	companyId: string,
	identifier = "default",
): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
	try {
		const supabase = await createServiceSupabaseClient();

		if (!supabase) {
			// Allow in development without database
			return {
				allowed: true,
				currentCount: 0,
				limit: MESSAGING_CONFIG.defaultRateLimitPerMinute,
			};
		}

		// Use the database function for atomic increment
		const { data, error } = await supabase.rpc("increment_rate_limit", {
			p_company_id: companyId,
			p_resource: "sms",
			p_identifier: identifier,
			p_window_size_seconds: 60,
		});

		if (error) {
			telnyxLogger.error("Rate limit check failed", {
				companyId,
				error: error.message,
			});
			// Fail open on database errors
			return {
				allowed: true,
				currentCount: 0,
				limit: MESSAGING_CONFIG.defaultRateLimitPerMinute,
			};
		}

		const result = data?.[0] || { current_count: 1 };
		const currentCount = result.current_count as number;
		const limit = MESSAGING_CONFIG.defaultRateLimitPerMinute;
		const allowed = currentCount <= limit;

		if (!allowed) {
			telnyxLogger.warn("SMS rate limit exceeded", {
				companyId,
				currentCount,
				limit,
			});
		}

		return { allowed, currentCount, limit };
	} catch (error) {
		telnyxLogger.error("Rate limit error", {
			companyId,
			error: error instanceof Error ? error.message : "Unknown error",
		});
		// Fail open
		return {
			allowed: true,
			currentCount: 0,
			limit: MESSAGING_CONFIG.defaultRateLimitPerMinute,
		};
	}
}

// =============================================================================
// SMS SENDING
// =============================================================================

/**
 * Send an SMS message with production-ready features
 *
 * Includes:
 * - 10DLC compliance verification
 * - Rate limiting per company
 * - Retry logic with exponential backoff
 * - Structured logging
 */
export async function sendSMS(params: SendSMSParams): Promise<SendSMSResult> {
	const warnings: string[] = [];

	try {
		telnyxLogger.info("Sending SMS", {
			companyId: params.companyId,
			to: params.to.substring(0, 6) + "****", // Redact for logs
			textLength: params.text.length,
		});

		// 1. Check 10DLC compliance (unless skipped)
		if (!params.skip10DLCCheck && MESSAGING_CONFIG.warnOn10DLCMissing) {
			const tenDLCStatus = await check10DLCStatus(params.companyId);

			if (!tenDLCStatus.isConfigured) {
				warnings.push(...tenDLCStatus.warnings);
				telnyxLogger.warn("SMS sent without 10DLC registration", {
					companyId: params.companyId,
					warnings: tenDLCStatus.warnings,
				});
			}

			// Use company's messaging profile if not provided
			if (!params.messagingProfileId && tenDLCStatus.messagingProfileId) {
				params.messagingProfileId = tenDLCStatus.messagingProfileId;
			}
		}

		// 2. Check rate limit (unless skipped)
		if (!params.skipRateLimit) {
			const rateLimit = await checkSMSRateLimit(params.companyId);

			if (!rateLimit.allowed) {
				return {
					success: false,
					error: `Rate limit exceeded: ${rateLimit.currentCount}/${rateLimit.limit} messages per minute`,
					warnings,
				};
			}
		}

		// 3. Send with retry logic
		const result = await withRetry(
			async () => {
				const requestBody = {
					to: params.to,
					from: params.from,
					text: params.text,
					messaging_profile_id: params.messagingProfileId,
					webhook_url: params.webhookUrl,
					webhook_failover_url: params.webhookFailoverUrl,
					use_profile_webhooks: params.useProfileWebhooks ?? true,
				};

				return telnyxMessageRequest(requestBody);
			},
			{
				endpoint: "messaging:send_sms",
				config: {
					maxRetries: 3,
					baseDelayMs: 500,
					maxDelayMs: 5000,
				},
			},
		);

		telnyxLogger.info("SMS sent successfully", {
			companyId: params.companyId,
			messageId: result.data.id,
			status: result.data.status,
		});

		return {
			success: true,
			messageId: result.data.id,
			data: result.data,
			warnings: warnings.length > 0 ? warnings : undefined,
		};
	} catch (error) {
		telnyxLogger.error("SMS send failed", {
			companyId: params.companyId,
			error: error instanceof Error ? error.message : "Unknown error",
		});

		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send SMS",
			warnings: warnings.length > 0 ? warnings : undefined,
		};
	}
}

/**
 * Send an MMS message with media attachments
 */
export async function sendMMS(params: {
	companyId: string;
	to: string;
	from: string;
	text?: string;
	mediaUrls: string[];
	webhookUrl?: string;
	webhookFailoverUrl?: string;
	subject?: string;
	messagingProfileId?: string;
}): Promise<SendSMSResult> {
	try {
		// Check rate limit
		const rateLimit = await checkSMSRateLimit(params.companyId);
		if (!rateLimit.allowed) {
			return {
				success: false,
				error: `Rate limit exceeded: ${rateLimit.currentCount}/${rateLimit.limit} messages per minute`,
			};
		}

		const result = await withRetry(
			async () => {
				return telnyxMessageRequest({
					to: params.to,
					from: params.from,
					text: params.text,
					media_urls: params.mediaUrls,
					messaging_profile_id: params.messagingProfileId,
					webhook_url: params.webhookUrl,
					webhook_failover_url: params.webhookFailoverUrl,
					subject: params.subject,
					type: "MMS",
				});
			},
			{
				endpoint: "messaging:send_mms",
				config: {
					maxRetries: 3,
					baseDelayMs: 500,
				},
			},
		);

		telnyxLogger.info("MMS sent successfully", {
			companyId: params.companyId,
			messageId: result.data.id,
			mediaCount: params.mediaUrls.length,
		});

		return {
			success: true,
			messageId: result.data.id,
			data: result.data,
		};
	} catch (error) {
		telnyxLogger.error("MMS send failed", {
			companyId: params.companyId,
			error: error instanceof Error ? error.message : "Unknown error",
		});

		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send MMS",
		};
	}
}

// =============================================================================
// BULK SENDING (With Throttling)
// =============================================================================

interface BulkSMSResult {
	success: boolean;
	total: number;
	successful: number;
	failed: number;
	results: Array<{ to: string; result: SendSMSResult }>;
	error?: string;
}

/**
 * Send bulk SMS with proper throttling and rate limiting
 *
 * Unlike naive Promise.all, this:
 * - Limits concurrent sends to prevent overwhelming the API
 * - Respects per-company rate limits
 * - Provides detailed per-recipient results
 */
export async function sendBulkSMS(params: {
	companyId: string;
	to: string[];
	from: string;
	text: string;
	webhookUrl?: string;
	messagingProfileId?: string;
}): Promise<BulkSMSResult> {
	const results: Array<{ to: string; result: SendSMSResult }> = [];
	let successful = 0;
	let failed = 0;

	telnyxLogger.info("Starting bulk SMS", {
		companyId: params.companyId,
		recipientCount: params.to.length,
	});

	// Process in batches to respect rate limits
	const batchSize = MESSAGING_CONFIG.maxConcurrentSends;

	for (let i = 0; i < params.to.length; i += batchSize) {
		const batch = params.to.slice(i, i + batchSize);

		const batchResults = await Promise.all(
			batch.map(async (recipient) => {
				const result = await sendSMS({
					companyId: params.companyId,
					to: recipient,
					from: params.from,
					text: params.text,
					webhookUrl: params.webhookUrl,
					messagingProfileId: params.messagingProfileId,
					// Skip 10DLC check for each message in bulk (already checked once)
					skip10DLCCheck: i > 0,
				});

				return { to: recipient, result };
			}),
		);

		for (const r of batchResults) {
			results.push(r);
			if (r.result.success) {
				successful++;
			} else {
				failed++;
			}
		}

		// Small delay between batches to smooth out rate limiting
		if (i + batchSize < params.to.length) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	telnyxLogger.info("Bulk SMS completed", {
		companyId: params.companyId,
		total: params.to.length,
		successful,
		failed,
	});

	return {
		success: failed === 0,
		total: params.to.length,
		successful,
		failed,
		results,
	};
}

// =============================================================================
// MESSAGE RETRIEVAL
// =============================================================================

/**
 * Retrieve message by ID
 */
export async function getMessage(messageId: string) {
	try {
		const message = await telnyxRequest<{ data: TelnyxMessage }>(
			`/messages/${messageId}`,
		);

		return {
			success: true,
			data: message.data,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to retrieve message",
		};
	}
}

/**
 * List messages with optional filtering
 */
export async function listMessages(params?: {
	pageSize?: number;
	pageNumber?: number;
	filterFrom?: string;
	filterTo?: string;
	filterDirection?: "inbound" | "outbound";
}) {
	try {
		const messages = await telnyxRequest<{
			data: TelnyxMessage[];
			meta: { total_pages: number; total_results: number };
		}>("/messages", {
			query: {
				"page[size]": params?.pageSize ?? 20,
				"page[number]": params?.pageNumber ?? 1,
				"filter[from]": params?.filterFrom,
				"filter[to]": params?.filterTo,
				"filter[direction]": params?.filterDirection,
			},
		});

		return {
			success: true,
			data: messages.data,
			meta: messages.meta,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to list messages",
		};
	}
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Validate a phone number for SMS capability
 */
export function validatePhoneNumber(phoneNumber: string): {
	success: boolean;
	formattedNumber?: string;
	error?: string;
} {
	try {
		// Remove any formatting from phone number
		const cleanNumber = phoneNumber.replace(/\D/g, "");

		// Check if it's a valid length (10-15 digits)
		if (cleanNumber.length < 10 || cleanNumber.length > 15) {
			return {
				success: false,
				error: "Invalid phone number length (must be 10-15 digits)",
			};
		}

		// Format to E.164
		const formattedNumber = formatPhoneNumber(cleanNumber);

		return {
			success: true,
			formattedNumber,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to validate phone number",
		};
	}
}

/**
 * Format phone number to E.164 standard (+15551234567)
 */
export function formatPhoneNumber(phoneNumber: string): string {
	// Remove all non-digit characters except leading +
	const digits = phoneNumber.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");

	// Already has + prefix
	if (digits.startsWith("+")) {
		return digits;
	}

	// If it starts with 1 and is 11 digits, it's a US number
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}

	// If it's 10 digits, assume US and add +1
	if (digits.length === 10) {
		return `+1${digits}`;
	}

	// Otherwise, add + prefix
	return `+${digits}`;
}

/**
 * Check if a phone number is a US number
 */
export function isUSPhoneNumber(phoneNumber: string): boolean {
	const formatted = formatPhoneNumber(phoneNumber);
	return formatted.startsWith("+1") && formatted.length === 12;
}
