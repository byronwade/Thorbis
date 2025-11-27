/**
 * Twilio Messaging Service
 *
 * Handles SMS and MMS messaging for multi-tenant companies.
 * Features:
 * - SMS/MMS sending with media support
 * - Delivery status tracking
 * - Rate limiting awareness
 * - 10DLC compliance (A2P messaging)
 * - Message status callbacks
 */

import { createTwilioClient, formatE164, getCompanyTwilioSettings } from "./client";
import { createClient } from "@/lib/supabase/server";

export type SendSmsParams = {
	companyId: string;
	to: string;
	body: string;
	from?: string;
	mediaUrls?: string[];
	statusCallback?: string;
	customerId?: string;
};

export type SendSmsResult = {
	success: boolean;
	messageSid?: string;
	error?: string;
	status?: string;
};

/**
 * Send SMS/MMS message
 */
export async function sendSms(params: SendSmsParams): Promise<SendSmsResult> {
	const { companyId, to, body, from, mediaUrls, statusCallback, customerId } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured for this company" };
	}

	const settings = await getCompanyTwilioSettings(companyId);
	if (!settings) {
		return { success: false, error: "Twilio settings not found" };
	}

	// Determine the from number
	const fromNumber = from || settings.default_from_number;
	if (!fromNumber) {
		return { success: false, error: "No from number specified or configured" };
	}

	try {
		const messageParams: {
			to: string;
			from?: string;
			messagingServiceSid?: string;
			body: string;
			mediaUrl?: string[];
			statusCallback?: string;
		} = {
			to: formatE164(to),
			body,
		};

		// Use messaging service if available (recommended for 10DLC)
		if (settings.messaging_service_sid) {
			messageParams.messagingServiceSid = settings.messaging_service_sid;
		} else {
			messageParams.from = formatE164(fromNumber);
		}

		// Add media URLs for MMS
		if (mediaUrls && mediaUrls.length > 0) {
			messageParams.mediaUrl = mediaUrls;
		}

		// Add status callback
		if (statusCallback || settings.webhook_url) {
			messageParams.statusCallback = statusCallback || settings.webhook_url || undefined;
		}

		const message = await client.messages.create(messageParams);

		// Store in communications table
		await storeSmsRecord({
			companyId,
			messageSid: message.sid,
			from: message.from || fromNumber,
			to: message.to,
			body,
			direction: "outbound",
			status: message.status,
			customerId,
			mediaUrls,
		});

		return {
			success: true,
			messageSid: message.sid,
			status: message.status,
		};
	} catch (error) {
		console.error("Failed to send SMS:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send SMS",
		};
	}
}

/**
 * Store SMS record in communications table
 */
async function storeSmsRecord(params: {
	companyId: string;
	messageSid: string;
	from: string;
	to: string;
	body: string;
	direction: "inbound" | "outbound";
	status: string;
	customerId?: string;
	mediaUrls?: string[];
}): Promise<void> {
	const supabase = await createClient();
	if (!supabase) return;

	const { error } = await supabase.from("communications").insert({
		company_id: params.companyId,
		type: "sms",
		direction: params.direction,
		from_address: params.from,
		to_address: params.to,
		body: params.body,
		status: params.status,
		customer_id: params.customerId || null,
		twilio_message_sid: params.messageSid,
		channel: "twilio",
		provider_metadata: {
			media_urls: params.mediaUrls || [],
		},
		sent_at: new Date().toISOString(),
	});

	if (error) {
		console.error("Failed to store SMS record:", error);
	}
}

/**
 * Get SMS delivery status
 */
export async function getSmsStatus(
	companyId: string,
	messageSid: string,
): Promise<{ success: boolean; status?: string; error?: string }> {
	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		const message = await client.messages(messageSid).fetch();
		return {
			success: true,
			status: message.status,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get status",
		};
	}
}

/**
 * Handle incoming SMS webhook
 */
export async function handleIncomingSms(params: {
	companyId: string;
	messageSid: string;
	from: string;
	to: string;
	body: string;
	numMedia?: number;
	mediaUrls?: string[];
}): Promise<void> {
	const supabase = await createClient();
	if (!supabase) return;

	// Try to find customer by phone number
	const { data: customer } = await supabase
		.from("customers")
		.select("id")
		.eq("company_id", params.companyId)
		.or(`phone.eq.${params.from},phone.eq.${formatE164(params.from)}`)
		.single();

	await storeSmsRecord({
		companyId: params.companyId,
		messageSid: params.messageSid,
		from: params.from,
		to: params.to,
		body: params.body,
		direction: "inbound",
		status: "received",
		customerId: customer?.id,
		mediaUrls: params.mediaUrls,
	});
}

/**
 * Update SMS status from webhook
 */
export async function updateSmsStatus(
	messageSid: string,
	status: string,
	errorCode?: string,
	errorMessage?: string,
): Promise<void> {
	const supabase = await createClient();
	if (!supabase) return;

	const updateData: Record<string, unknown> = {
		status,
		updated_at: new Date().toISOString(),
	};

	if (status === "delivered") {
		updateData.delivered_at = new Date().toISOString();
	}

	if (errorCode || errorMessage) {
		updateData.provider_metadata = {
			error_code: errorCode,
			error_message: errorMessage,
		};
	}

	const { error } = await supabase
		.from("communications")
		.update(updateData)
		.eq("twilio_message_sid", messageSid);

	if (error) {
		console.error("Failed to update SMS status:", error);
	}
}

/**
 * Reply to an SMS (creates response in same thread)
 */
export async function replySms(params: {
	companyId: string;
	originalMessageSid: string;
	body: string;
	mediaUrls?: string[];
}): Promise<SendSmsResult> {
	const supabase = await createClient();
	if (!supabase) {
		return { success: false, error: "Database not available" };
	}

	// Get the original message to find recipient
	const { data: original, error } = await supabase
		.from("communications")
		.select("from_address, to_address, customer_id")
		.eq("twilio_message_sid", params.originalMessageSid)
		.single();

	if (error || !original) {
		return { success: false, error: "Original message not found" };
	}

	// Reply to the sender
	return sendSms({
		companyId: params.companyId,
		to: original.from_address,
		body: params.body,
		from: original.to_address,
		mediaUrls: params.mediaUrls,
		customerId: original.customer_id,
	});
}
