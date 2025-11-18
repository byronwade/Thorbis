/**
 * Telnyx Messaging Service - SMS & MMS
 *
 * Handles all messaging operations including:
 * - Sending SMS/MMS messages
 * - Retrieving message status
 * - Managing messaging profiles
 */

const TELNYX_API_BASE = "https://api.telnyx.com/v2";

function assertTelnyxApiKey() {
	const apiKey = process.env.TELNYX_API_KEY;
	if (!apiKey) {
		throw new Error("TELNYX_API_KEY is not configured");
	}
	return apiKey;
}

async function telnyxRequest(
	path: string,
	init?: RequestInit & { query?: Record<string, string | number | undefined> },
) {
	const apiKey = assertTelnyxApiKey();
	const url = new URL(`${TELNYX_API_BASE}${path}`);
	if (init?.query) {
		for (const [key, value] of Object.entries(init.query)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	const response = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
			...(init?.headers || {}),
		},
	});

	const data = await response.json();
	if (!response.ok) {
		const detail = data?.errors?.[0]?.detail || response.statusText;
		throw new Error(`Telnyx ${response.status}: ${detail}`);
	}

	return data;
}

async function telnyxMessageRequest(body: Record<string, unknown>) {
	return telnyxRequest("/messages", {
		method: "POST",
		body: JSON.stringify(body),
	});
}

/**
 * Message types
 */
export type MessageType = "SMS" | "MMS";

/**
 * Message status from Telnyx
 */
export type MessageStatus =
	| "queued"
	| "sending"
	| "sent"
	| "delivered"
	| "sending_failed"
	| "delivery_failed"
	| "delivery_unconfirmed";

/**
 * Send an SMS message
 */
export async function sendSMS(params: {
	to: string;
	from: string;
	text: string;
	webhookUrl?: string;
	webhookFailoverUrl?: string;
	useProfileWebhooks?: boolean;
	messagingProfileId?: string;
}) {
	try {
		const message = await telnyxMessageRequest({
			to: params.to,
			from: params.from,
			text: params.text,
			messaging_profile_id: params.messagingProfileId,
			webhook_url: params.webhookUrl,
			webhook_failover_url: params.webhookFailoverUrl,
			use_profile_webhooks: params.useProfileWebhooks ?? true,
		});

		return {
			success: true,
			messageId: message.data.id,
			data: message.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send SMS",
		};
	}
}

/**
 * Send an MMS message with media attachments
 */
export async function sendMMS(params: {
	to: string;
	from: string;
	text?: string;
	mediaUrls: string[];
	webhookUrl?: string;
	webhookFailoverUrl?: string;
	subject?: string;
	messagingProfileId?: string;
}) {
	try {
		const message = await telnyxMessageRequest({
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

		return {
			success: true,
			messageId: message.data.id,
			data: message.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send MMS",
		};
	}
}

/**
 * Retrieve message by ID
 */
export async function getMessage(messageId: string) {
	try {
		const message = await telnyxRequest(`/messages/${messageId}`);

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
		const messages = await telnyxRequest("/messages", {
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

/**
 * Send a bulk SMS message to multiple recipients
 */
export async function sendBulkSMS(params: {
	to: string[];
	from: string;
	text: string;
	webhookUrl?: string;
}) {
	try {
		const results = await Promise.allSettled(
			params.to.map((recipient) =>
				sendSMS({
					to: recipient,
					from: params.from,
					text: params.text,
					webhookUrl: params.webhookUrl,
				}),
			),
		);

		const successful = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;

		return {
			success: true,
			total: params.to.length,
			successful,
			failed,
			results,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send bulk SMS",
		};
	}
}

/**
 * Validate a phone number for SMS capability
 */
export async function validatePhoneNumber(phoneNumber: string) {
	try {
		// Remove any formatting from phone number
		const cleanNumber = phoneNumber.replace(/\D/g, "");

		// Check if it's a valid length (10-15 digits)
		if (cleanNumber.length < 10 || cleanNumber.length > 15) {
			return {
				success: false,
				error: "Invalid phone number length",
			};
		}

		// Ensure it starts with + for international format
		const formattedNumber = cleanNumber.startsWith("+")
			? cleanNumber
			: `+${cleanNumber}`;

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
	// Remove all non-digit characters
	const digits = phoneNumber.replace(/\D/g, "");

	// If it starts with 1 and is 11 digits, it's a US number
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}

	// If it's 10 digits, assume US and add +1
	if (digits.length === 10) {
		return `+1${digits}`;
	}

	// Otherwise, add + if not present
	return digits.startsWith("+") ? digits : `+${digits}`;
}
