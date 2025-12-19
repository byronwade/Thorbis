"use server";

/**
 * Admin SMS Actions
 *
 * Server actions for sending SMS from the admin panel.
 * Uses the web app's Twilio messaging service.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface SendAdminSmsParams {
	companyId: string;
	to: string;
	body: string;
	from?: string;
}

export interface SendSmsResult {
	success: boolean;
	messageSid?: string;
	error?: string;
	status?: string;
}

/**
 * Send SMS message from admin panel
 *
 * This requires the target company to have Twilio configured.
 */
export async function sendAdminSms(params: SendAdminSmsParams): Promise<SendSmsResult> {
	const session = await getAdminSession();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	const { companyId, to, body, from } = params;

	if (!companyId || !to || !body) {
		return { success: false, error: "Missing required fields" };
	}

	try {
		const webDb = createWebClient();

		// Get company's Twilio settings
		const { data: twilioSettings, error: settingsError } = await webDb
			.from("company_twilio_settings")
			.select("account_sid, auth_token, default_from_number, messaging_service_sid")
			.eq("company_id", companyId)
			.eq("is_active", true)
			.single();

		if (settingsError || !twilioSettings) {
			return { success: false, error: "Company does not have Twilio configured" };
		}

		const fromNumber = from || twilioSettings.default_from_number;
		if (!fromNumber && !twilioSettings.messaging_service_sid) {
			return { success: false, error: "No from number or messaging service configured" };
		}

		// Format phone number to E.164
		const formattedTo = formatE164(to);

		// Build message parameters
		const messageParams: {
			To: string;
			Body: string;
			From?: string;
			MessagingServiceSid?: string;
		} = {
			To: formattedTo,
			Body: body,
		};

		if (twilioSettings.messaging_service_sid) {
			messageParams.MessagingServiceSid = twilioSettings.messaging_service_sid;
		} else if (fromNumber) {
			messageParams.From = formatE164(fromNumber);
		}

		// Send via Twilio API
		const twilioResponse = await fetch(
			`https://api.twilio.com/2010-04-01/Accounts/${twilioSettings.account_sid}/Messages.json`,
			{
				method: "POST",
				headers: {
					Authorization: `Basic ${Buffer.from(`${twilioSettings.account_sid}:${twilioSettings.auth_token}`).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(messageParams),
			},
		);

		const result = await twilioResponse.json();

		if (!twilioResponse.ok) {
			console.error("Twilio API error:", result);
			return {
				success: false,
				error: result.message || "Failed to send SMS",
			};
		}

		// Store the message in communications table
		await webDb.from("communications").insert({
			company_id: companyId,
			type: "sms",
			direction: "outbound",
			from_address: result.from || fromNumber,
			to_address: result.to || formattedTo,
			body: body,
			status: result.status,
			twilio_message_sid: result.sid,
			channel: "twilio",
			provider_metadata: {
				sent_by_admin: true,
				admin_user_id: session.user.id,
			},
			sent_at: new Date().toISOString(),
		});

		return {
			success: true,
			messageSid: result.sid,
			status: result.status,
		};
	} catch (error) {
		console.error("Failed to send admin SMS:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send SMS",
		};
	}
}

/**
 * Format phone number to E.164 format
 */
function formatE164(phoneNumber: string): string {
	// Remove all non-digit characters
	const digits = phoneNumber.replace(/\D/g, "");

	// If it starts with 1 and has 11 digits, assume US/Canada
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}

	// If it has 10 digits, assume US and add +1
	if (digits.length === 10) {
		return `+1${digits}`;
	}

	// Otherwise, just add + if not present
	if (!phoneNumber.startsWith("+")) {
		return `+${digits}`;
	}

	return phoneNumber;
}
