/**
 * Telnyx Messaging Service - SMS & MMS
 *
 * Handles all messaging operations including:
 * - Sending SMS/MMS messages
 * - Retrieving message status
 * - Managing messaging profiles
 */

import { telnyxClient } from "./client";

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
}) {
	try {
		const message = await (telnyxClient.messages as any).create({
			to: params.to,
			from: params.from,
			text: params.text,
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
}) {
	try {
		const message = await (telnyxClient.messages as any).create({
			to: params.to,
			from: params.from,
			text: params.text,
			media_urls: params.mediaUrls,
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
		const message = await (telnyxClient.messages as any).retrieve(messageId);

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
		const messages = await (telnyxClient.messages as any).list({
			page: {
				size: params?.pageSize || 20,
				number: params?.pageNumber || 1,
			},
			filter: {
				from: params?.filterFrom,
				to: params?.filterTo,
				direction: params?.filterDirection,
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
