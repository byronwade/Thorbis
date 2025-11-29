/**
 * Twilio Voice/Calls Service
 *
 * Handles voice calling for multi-tenant companies.
 * Features:
 * - Outbound call initiation
 * - Inbound call handling
 * - Call control (mute, hold, transfer)
 * - Recording management
 * - Voicemail
 * - TwiML generation
 */

import { createTwilioClient, formatE164, getCompanyTwilioSettings, TWILIO_ADMIN_CONFIG } from "./client";
import { createClient } from "@/lib/supabase/server";

export type InitiateCallParams = {
	companyId: string;
	to: string;
	from?: string;
	statusCallback?: string;
	record?: boolean;
	machineDetection?: "Enable" | "DetectMessageEnd" | "Disable";
	timeout?: number;
	customerId?: string;
};

export type InitiateCallResult = {
	success: boolean;
	callSid?: string;
	error?: string;
	status?: string;
};

export type CallControlParams = {
	companyId: string;
	callSid: string;
};

/**
 * Initiate an outbound call
 */
export async function initiateCall(params: InitiateCallParams): Promise<InitiateCallResult> {
	const { companyId, to, from, statusCallback, record = false, machineDetection = "Disable", timeout = 30, customerId } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured for this company" };
	}

	const settings = await getCompanyTwilioSettings(companyId);
	if (!settings) {
		return { success: false, error: "Twilio settings not found" };
	}

	const fromNumber = from || settings.default_from_number;
	if (!fromNumber) {
		return { success: false, error: "No from number specified or configured" };
	}

	try {
		// Build webhook URL for TwiML
		const baseUrl = TWILIO_ADMIN_CONFIG.webhookBaseUrl;
		const twimlUrl = `${baseUrl}/api/webhooks/twilio/voice?companyId=${companyId}`;
		const statusUrl = statusCallback || settings.webhook_url || `${baseUrl}/api/webhooks/twilio/status`;

		const call = await client.calls.create({
			to: formatE164(to),
			from: formatE164(fromNumber),
			url: twimlUrl,
			statusCallback: statusUrl,
			statusCallbackMethod: "POST",
			statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
			record,
			machineDetection,
			timeout,
		});


		return {
			success: true,
			callSid: call.sid,
			status: call.status,
		};
	} catch (error) {
		console.error("Failed to initiate call:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to initiate call",
		};
	}
}

/**
 * Store call record in communications table
 */
async function storeCallRecord(params: {
	companyId: string;
	callSid: string;
	from: string;
	to: string;
	direction: "inbound" | "outbound";
	status: string;
	customerId?: string;
	duration?: number;
	recordingUrl?: string;
}): Promise<string | null> {
	const supabase = await createClient();
	if (!supabase) return null;

	const { data, error } = await supabase
		.from("communications")
		.insert({
			company_id: params.companyId,
			type: "call",
			direction: params.direction,
			from_address: params.from,
			to_address: params.to,
			status: params.status,
			customer_id: params.customerId || null,
			twilio_call_sid: params.callSid,
			channel: "twilio",
			provider_metadata: {
				duration: params.duration,
				recording_url: params.recordingUrl,
			},
			sent_at: new Date().toISOString(),
		})
		.select("id")
		.single();

	if (error) {
		console.error("Failed to store call record:", error);
		return null;
	}

	return data?.id || null;
}

/**
 * End an active call
 */
export async function endCall(params: CallControlParams): Promise<{ success: boolean; error?: string }> {
	const { companyId, callSid } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		await client.calls(callSid).update({ status: "completed" });
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to end call",
		};
	}
}

/**
 * Hold/unhold a call
 */
export async function holdCall(
	params: CallControlParams & { hold: boolean },
): Promise<{ success: boolean; error?: string }> {
	const { companyId, callSid, hold } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		// Use TwiML to play hold music or resume
		const baseUrl = TWILIO_ADMIN_CONFIG.webhookBaseUrl;
		const twimlUrl = hold
			? `${baseUrl}/api/webhooks/twilio/hold?companyId=${companyId}`
			: `${baseUrl}/api/webhooks/twilio/voice?companyId=${companyId}`;

		await client.calls(callSid).update({ url: twimlUrl, method: "POST" });
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update call",
		};
	}
}

/**
 * Transfer a call to another number
 */
export async function transferCall(
	params: CallControlParams & { transferTo: string },
): Promise<{ success: boolean; error?: string }> {
	const { companyId, callSid, transferTo } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		const baseUrl = TWILIO_ADMIN_CONFIG.webhookBaseUrl;
		const twimlUrl = `${baseUrl}/api/webhooks/twilio/transfer?companyId=${companyId}&transferTo=${encodeURIComponent(formatE164(transferTo))}`;

		await client.calls(callSid).update({ url: twimlUrl, method: "POST" });
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to transfer call",
		};
	}
}

/**
 * Start recording a call
 */
export async function startRecording(
	params: CallControlParams,
): Promise<{ success: boolean; recordingSid?: string; error?: string }> {
	const { companyId, callSid } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		const recording = await client.calls(callSid).recordings.create({
			recordingStatusCallback: `${TWILIO_ADMIN_CONFIG.webhookBaseUrl}/api/webhooks/twilio/recording`,
			recordingStatusCallbackMethod: "POST",
		});

		return { success: true, recordingSid: recording.sid };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to start recording",
		};
	}
}

/**
 * Stop recording a call
 */
export async function stopRecording(
	params: CallControlParams & { recordingSid: string },
): Promise<{ success: boolean; error?: string }> {
	const { companyId, callSid, recordingSid } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		await client.calls(callSid).recordings(recordingSid).update({ status: "stopped" });
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to stop recording",
		};
	}
}

/**
 * Get call details
 */
export async function getCallDetails(
	params: CallControlParams,
): Promise<{ success: boolean; call?: Record<string, unknown>; error?: string }> {
	const { companyId, callSid } = params;

	const client = await createTwilioClient(companyId);
	if (!client) {
		return { success: false, error: "Twilio client not configured" };
	}

	try {
		const call = await client.calls(callSid).fetch();
		return {
			success: true,
			call: {
				sid: call.sid,
				status: call.status,
				direction: call.direction,
				from: call.from,
				to: call.to,
				duration: call.duration,
				startTime: call.startTime,
				endTime: call.endTime,
				answeredBy: call.answeredBy,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get call details",
		};
	}
}

/**
 * Handle incoming call webhook
 */
export async function handleIncomingCall(params: {
	companyId: string;
	callSid: string;
	from: string;
	to: string;
	direction: string;
}): Promise<string | null> {
	const supabase = await createClient();
	if (!supabase) return null;

	// Try to find customer by phone number
	const { data: customer } = await supabase
		.from("customers")
		.select("id")
		.eq("company_id", params.companyId)
		.or(`phone.eq.${params.from},phone.eq.${formatE164(params.from)}`)
		.single();

	return storeCallRecord({
		companyId: params.companyId,
		callSid: params.callSid,
		from: params.from,
		to: params.to,
		direction: "inbound",
		status: "ringing",
		customerId: customer?.id,
	});
}

/**
 * Update call status from webhook
 */
export async function updateCallStatus(
	callSid: string,
	status: string,
	duration?: number,
	recordingUrl?: string,
): Promise<void> {
	const supabase = await createClient();
	if (!supabase) return;

	const updateData: Record<string, unknown> = {
		status,
		updated_at: new Date().toISOString(),
	};

	if (duration !== undefined) {
		updateData.provider_metadata = { duration };
	}

	if (recordingUrl) {
		updateData.provider_metadata = {
			...(updateData.provider_metadata as Record<string, unknown> || {}),
			recording_url: recordingUrl,
		};
	}

	if (status === "completed" || status === "answered") {
		updateData.delivered_at = new Date().toISOString();
	}

	const { error } = await supabase
		.from("communications")
		.update(updateData)
		.eq("twilio_call_sid", callSid);

	if (error) {
		console.error("Failed to update call status:", error);
	}
}

/**
 * Generate TwiML for connecting to browser (WebRTC)
 */
export function generateConnectTwiML(clientIdentity: string): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Client>${clientIdentity}</Client>
  </Dial>
</Response>`;
}

/**
 * Generate TwiML for hold music
 */
export function generateHoldTwiML(): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please hold while we connect your call.</Say>
  <Play loop="0">http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-B9.mp3</Play>
</Response>`;
}

/**
 * Generate TwiML for transfer
 */
export function generateTransferTwiML(transferTo: string): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Transferring your call. Please hold.</Say>
  <Dial>${formatE164(transferTo)}</Dial>
</Response>`;
}

/**
 * Generate TwiML for voicemail
 */
export function generateVoicemailTwiML(
	companyId: string,
	greeting?: string,
): string {
	const baseUrl = TWILIO_ADMIN_CONFIG.webhookBaseUrl;
	const defaultGreeting = "We're sorry we missed your call. Please leave a message after the beep.";

	return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${greeting || defaultGreeting}</Say>
  <Record
    maxLength="120"
    action="${baseUrl}/api/webhooks/twilio/voicemail?companyId=${companyId}"
    transcribe="true"
    transcribeCallback="${baseUrl}/api/webhooks/twilio/transcription?companyId=${companyId}"
  />
  <Say>We did not receive your message. Goodbye.</Say>
</Response>`;
}
