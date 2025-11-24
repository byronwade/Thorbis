/**
 * Twilio Webhook Handler
 *
 * Handles incoming webhooks from Twilio for:
 * - SMS delivery status updates
 * - Incoming SMS messages
 * - Call status updates
 * - Voice webhook events (TwiML responses)
 *
 * Security: Validates Twilio request signature
 */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Twilio from "twilio";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// CONFIGURATION
// =============================================================================

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";

// =============================================================================
// REQUEST VALIDATION
// =============================================================================

/**
 * Validate Twilio webhook request signature
 */
async function validateTwilioRequest(
	request: NextRequest,
	body: string
): Promise<boolean> {
	if (!TWILIO_AUTH_TOKEN) {
		console.warn("[TwilioWebhook] No auth token configured, skipping validation");
		return true; // Skip validation in development
	}

	const headersList = await headers();
	const signature = headersList.get("x-twilio-signature");

	if (!signature) {
		console.error("[TwilioWebhook] Missing X-Twilio-Signature header");
		return false;
	}

	const url = request.url;
	const params = Object.fromEntries(new URLSearchParams(body));

	try {
		return Twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, params);
	} catch (error) {
		console.error("[TwilioWebhook] Signature validation error:", error);
		return false;
	}
}

// =============================================================================
// POST HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();

		// Validate request in production
		if (process.env.NODE_ENV === "production") {
			const isValid = await validateTwilioRequest(request, body);
			if (!isValid) {
				console.error("[TwilioWebhook] Invalid request signature");
				return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
			}
		}

		// Parse form data
		const params = Object.fromEntries(new URLSearchParams(body));
		const eventType = determineEventType(params);

		console.log(`[TwilioWebhook] Received ${eventType} event`);

		switch (eventType) {
			case "sms_status":
				return await handleSmsStatusUpdate(params);
			case "incoming_sms":
				return await handleIncomingSms(params);
			case "call_status":
				return await handleCallStatusUpdate(params);
			case "voice_request":
				return await handleVoiceRequest(params);
			default:
				console.log("[TwilioWebhook] Unknown event type:", params);
				return NextResponse.json({ received: true });
		}
	} catch (error) {
		console.error("[TwilioWebhook] Error processing webhook:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// =============================================================================
// EVENT TYPE DETECTION
// =============================================================================

type TwilioEventType = "sms_status" | "incoming_sms" | "call_status" | "voice_request" | "unknown";

function determineEventType(params: Record<string, string>): TwilioEventType {
	// SMS status callback
	if (params.MessageStatus && params.MessageSid) {
		return "sms_status";
	}

	// Incoming SMS
	if (params.Body !== undefined && params.From && params.To && !params.CallSid) {
		return "incoming_sms";
	}

	// Call status callback
	if (params.CallStatus && params.CallSid) {
		return "call_status";
	}

	// Voice request (TwiML needed)
	if (params.CallSid && params.Called) {
		return "voice_request";
	}

	return "unknown";
}

// =============================================================================
// SMS HANDLERS
// =============================================================================

async function handleSmsStatusUpdate(params: Record<string, string>) {
	const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = params;

	console.log(`[TwilioWebhook] SMS status update: ${MessageSid} -> ${MessageStatus}`);

	// Map Twilio status to our status
	const statusMap: Record<string, string> = {
		queued: "queued",
		sending: "queued",
		sent: "sent",
		delivered: "delivered",
		undelivered: "failed",
		failed: "failed",
	};

	const mappedStatus = statusMap[MessageStatus] || MessageStatus;

	try {
		const supabase = createServiceSupabaseClient();

		// Find communication by Twilio message ID
		// Note: We store provider info in provider_metadata
		const { data: communication, error: fetchError } = await supabase
			.from("communications")
			.select("id")
			.eq("telnyx_message_id", MessageSid) // Reusing field for Twilio
			.maybeSingle();

		if (fetchError) {
			console.error("[TwilioWebhook] Error fetching communication:", fetchError);
		}

		if (communication) {
			const updateData: Record<string, unknown> = {
				status: mappedStatus,
			};

			if (mappedStatus === "delivered") {
				updateData.delivered_at = new Date().toISOString();
			}

			if (ErrorCode || ErrorMessage) {
				// Get existing metadata and merge
				const { data: existing } = await supabase
					.from("communications")
					.select("provider_metadata")
					.eq("id", communication.id)
					.single();

				updateData.provider_metadata = {
					...(existing?.provider_metadata as Record<string, unknown> || {}),
					twilio_error_code: ErrorCode,
					twilio_error_message: ErrorMessage,
				};
			}

			await supabase
				.from("communications")
				.update(updateData)
				.eq("id", communication.id);
		}
	} catch (error) {
		console.error("[TwilioWebhook] Error updating SMS status:", error);
	}

	return NextResponse.json({ received: true });
}

async function handleIncomingSms(params: Record<string, string>) {
	const {
		MessageSid,
		From,
		To,
		Body,
		NumMedia,
		MediaUrl0,
		MediaUrl1,
		MediaUrl2,
	} = params;

	console.log(`[TwilioWebhook] Incoming SMS from ${From} to ${To}`);

	try {
		const supabase = createServiceSupabaseClient();

		// Find company by phone number
		const { data: phoneNumber } = await supabase
			.from("phone_numbers")
			.select("company_id")
			.eq("phone_number", To)
			.maybeSingle();

		if (!phoneNumber) {
			console.warn(`[TwilioWebhook] No company found for number ${To}`);
			return NextResponse.json({ received: true });
		}

		// Build media attachments array
		const attachments: Array<{ url: string; type: string }> = [];
		const numMedia = parseInt(NumMedia || "0", 10);

		for (let i = 0; i < numMedia; i++) {
			const mediaUrl = params[`MediaUrl${i}`];
			const mediaType = params[`MediaContentType${i}`] || "image";
			if (mediaUrl) {
				attachments.push({ url: mediaUrl, type: mediaType });
			}
		}

		// Try to find customer by phone number
		const normalizedFrom = normalizePhoneNumber(From);
		const { data: customer } = await supabase
			.from("customers")
			.select("id")
			.eq("company_id", phoneNumber.company_id)
			.or(`phone.eq.${normalizedFrom},mobile_phone.eq.${normalizedFrom}`)
			.maybeSingle();

		// Create communication record
		await supabase.from("communications").insert({
			company_id: phoneNumber.company_id,
			customer_id: customer?.id || null,
			type: "sms",
			channel: "twilio",
			direction: "inbound",
			from_address: From,
			to_address: To,
			body: Body || "",
			status: "received",
			priority: "normal",
			is_archived: false,
			is_automated: false,
			is_internal: false,
			is_thread_starter: false,
			telnyx_message_id: MessageSid, // Reusing field
			attachments: attachments.length > 0 ? attachments : null,
			attachment_count: attachments.length,
			provider_metadata: {
				provider: "twilio",
				message_sid: MessageSid,
			},
		});

		console.log(`[TwilioWebhook] Created inbound SMS record for company ${phoneNumber.company_id}`);
	} catch (error) {
		console.error("[TwilioWebhook] Error processing incoming SMS:", error);
	}

	// Return empty TwiML response
	return new NextResponse(
		'<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
		{
			headers: { "Content-Type": "text/xml" },
		}
	);
}

// =============================================================================
// CALL HANDLERS
// =============================================================================

async function handleCallStatusUpdate(params: Record<string, string>) {
	const {
		CallSid,
		CallStatus,
		CallDuration,
		RecordingUrl,
		RecordingSid,
	} = params;

	console.log(`[TwilioWebhook] Call status update: ${CallSid} -> ${CallStatus}`);

	// Map Twilio call status to our status
	const statusMap: Record<string, string> = {
		queued: "queued",
		ringing: "ringing",
		"in-progress": "active",
		completed: "completed",
		busy: "busy",
		failed: "failed",
		"no-answer": "no_answer",
		canceled: "canceled",
	};

	const mappedStatus = statusMap[CallStatus] || CallStatus;

	try {
		const supabase = createServiceSupabaseClient();

		// Find communication by call SID
		const { data: communication } = await supabase
			.from("communications")
			.select("id, provider_metadata")
			.eq("telnyx_call_control_id", CallSid) // Reusing field
			.maybeSingle();

		if (communication) {
			const updateData: Record<string, unknown> = {
				status: mappedStatus,
			};

			if (CallDuration) {
				updateData.call_duration = parseInt(CallDuration, 10);
			}

			if (mappedStatus === "completed") {
				updateData.call_ended_at = new Date().toISOString();
			}

			// Store recording info if available
			if (RecordingUrl || RecordingSid) {
				updateData.provider_metadata = {
					...(communication.provider_metadata as Record<string, unknown> || {}),
					twilio_recording_sid: RecordingSid,
					twilio_recording_url: RecordingUrl,
				};

				if (RecordingUrl) {
					updateData.recording_url = RecordingUrl;
				}
			}

			await supabase
				.from("communications")
				.update(updateData)
				.eq("id", communication.id);
		}
	} catch (error) {
		console.error("[TwilioWebhook] Error updating call status:", error);
	}

	return NextResponse.json({ received: true });
}

async function handleVoiceRequest(params: Record<string, string>) {
	const { CallSid, From, To, Direction } = params;

	console.log(`[TwilioWebhook] Voice request: ${CallSid} from ${From} to ${To}`);

	// For incoming calls, return TwiML with instructions
	// This is a basic implementation - can be customized based on routing rules

	if (Direction === "inbound") {
		// Check for custom routing rules in database
		try {
			const supabase = createServiceSupabaseClient();

			// Find company by phone number
			const { data: phoneNumber } = await supabase
				.from("phone_numbers")
				.select("company_id, forward_to_number, voicemail_enabled")
				.eq("phone_number", To)
				.maybeSingle();

			if (phoneNumber?.forward_to_number) {
				// Forward the call
				const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="30">
    <Number>${phoneNumber.forward_to_number}</Number>
  </Dial>
  ${phoneNumber.voicemail_enabled ? '<Say>Please leave a message after the beep.</Say><Record maxLength="120" />' : ""}
</Response>`;

				return new NextResponse(twiml, {
					headers: { "Content-Type": "text/xml" },
				});
			}

			// Default: ring for 30 seconds then voicemail
			const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling. Please wait while we connect you.</Say>
  <Pause length="30"/>
  <Say>We're sorry, no one is available to take your call. Please leave a message after the beep.</Say>
  <Record maxLength="120" />
</Response>`;

			return new NextResponse(twiml, {
				headers: { "Content-Type": "text/xml" },
			});
		} catch (error) {
			console.error("[TwilioWebhook] Error processing voice request:", error);
		}
	}

	// For outbound calls or errors, return empty response
	return new NextResponse(
		'<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
		{
			headers: { "Content-Type": "text/xml" },
		}
	);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function normalizePhoneNumber(phone: string): string {
	const digits = phone.replace(/\D/g, "");
	if (digits.length === 10) {
		return `+1${digits}`;
	}
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}
	return phone.startsWith("+") ? phone : `+${phone}`;
}
