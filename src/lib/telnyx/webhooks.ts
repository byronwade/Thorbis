/**
 * Telnyx Webhooks Service - Webhook Verification & Processing
 *
 * Handles webhook security and verification:
 * - Signature verification
 * - Event type validation
 * - Webhook payload parsing
 */

import crypto from "node:crypto";
import { TELNYX_CONFIG } from "./client";

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
 * Telnyx signs webhooks with HMAC-SHA256 using your webhook secret.
 * The signature is sent in the `telnyx-signature-ed25519` header.
 */
export function verifyWebhookSignature(params: {
	payload: string | Buffer;
	signature: string;
	timestamp: string;
}): boolean {
	try {
		const publicKeyBase64 = TELNYX_CONFIG.publicKey;

		if (!publicKeyBase64) {
			return true;
		}

		const payloadBuffer = Buffer.isBuffer(params.payload)
			? params.payload
			: Buffer.from(params.payload);
		const signedPayload = Buffer.concat([
			Buffer.from(params.timestamp),
			Buffer.from("|"),
			payloadBuffer,
		]);

		const publicKey = crypto.createPublicKey({
			key: Buffer.from(publicKeyBase64, "base64"),
			format: "der",
			type: "spki",
		});

		return crypto.verify(null, signedPayload, publicKey, Buffer.from(params.signature, "base64"));
	} catch (_error) {
		return false;
	}
}

/**
 * Parse and validate webhook payload
 */
export function parseWebhookPayload(rawPayload: string | Buffer): WebhookPayload | null {
	try {
		const payload =
			typeof rawPayload === "string" ? JSON.parse(rawPayload) : JSON.parse(rawPayload.toString());

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
export function isNumberEvent(eventType: WebhookEventType): boolean {
	return eventType.startsWith("number_");
}

/**
 * Calculate call duration from start and end times
 */
export function calculateCallDuration(startTime: string, endTime: string): number {
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
		message: message || (success ? "Webhook processed successfully" : "Webhook processing failed"),
	};
}

/**
 * Validate webhook timestamp to prevent replay attacks
 * Reject webhooks older than 5 minutes
 */
export function isWebhookTimestampValid(timestamp: string, maxAgeSeconds = 300): boolean {
	try {
		let webhookTimeMs: number;

		if (!timestamp) {
			return false;
		}

		const numericTimestamp = Number(timestamp);
		if (Number.isFinite(numericTimestamp)) {
			// Telnyx sends UNIX seconds as the timestamp header
			webhookTimeMs = numericTimestamp * 1000;
		} else {
			const parsed = new Date(timestamp).getTime();
			if (Number.isNaN(parsed)) {
				return false;
			}
			webhookTimeMs = parsed;
		}

		const now = Date.now();
		const age = (now - webhookTimeMs) / 1000; // Age in seconds

		return age <= maxAgeSeconds;
	} catch (_error) {
		return false;
	}
}
