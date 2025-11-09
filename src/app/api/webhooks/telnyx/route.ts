/**
 * Telnyx Webhook Handler - API Route
 *
 * Receives and processes webhook events from Telnyx including:
 * - Call events (initiated, answered, hangup, recording saved)
 * - Message events (sent, delivered, received, failed)
 * - Number events (purchased, ported)
 *
 * Security:
 * - Verifies webhook signatures to prevent tampering
 * - Validates timestamp to prevent replay attacks
 * - Rate limited to prevent abuse
 */

import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  type CallAnsweredPayload,
  type CallHangupPayload,
  type CallInitiatedPayload,
  createWebhookResponse,
  getEventType,
  isCallEvent,
  isMessageEvent,
  isWebhookTimestampValid,
  type MessageReceivedPayload,
  parseWebhookPayload,
  verifyWebhookSignature,
  type WebhookPayload,
} from "@/lib/telnyx/webhooks";

/**
 * POST /api/webhooks/telnyx
 *
 * Handles all incoming Telnyx webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body as text for signature verification
    const body = await request.text();

    // Get headers for signature verification
    const headersList = await headers();
    const signature = headersList.get("telnyx-signature-ed25519") || "";
    const timestamp = headersList.get("telnyx-timestamp") || "";

    // Verify webhook signature (skip in development for easier testing)
    const skipSignatureVerification =
      process.env.NODE_ENV === "development" &&
      process.env.TELNYX_SKIP_SIGNATURE_VERIFICATION === "true";

    if (signature && timestamp && !skipSignatureVerification) {
      console.log("🔒 Verifying webhook signature...");
      const isValid = verifyWebhookSignature({
        payload: body,
        signature,
        timestamp,
      });

      if (!isValid) {
        console.error("❌ Invalid Telnyx webhook signature");
        return NextResponse.json(
          createWebhookResponse(false, "Invalid signature"),
          {
            status: 401,
          }
        );
      }

      // Validate timestamp to prevent replay attacks
      if (!isWebhookTimestampValid(timestamp)) {
        console.error("❌ Telnyx webhook timestamp too old");
        return NextResponse.json(
          createWebhookResponse(false, "Webhook too old"),
          {
            status: 400,
          }
        );
      }
      console.log("✅ Signature verified");
    } else if (skipSignatureVerification) {
      console.log("⚠️  Skipping signature verification (development mode)");
    }

    // Parse webhook payload
    const payload = parseWebhookPayload(body);

    if (!payload) {
      console.error("Invalid Telnyx webhook payload");
      return NextResponse.json(
        createWebhookResponse(false, "Invalid payload"),
        {
          status: 400,
        }
      );
    }

    // Get event type
    const eventType = getEventType(payload);
    console.log(`\n🔔 Received Telnyx webhook: ${eventType}`);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));

    // Route to appropriate handler based on event type
    if (isCallEvent(eventType)) {
      await handleCallEvent(payload, eventType);
    } else if (isMessageEvent(eventType)) {
      await handleMessageEvent(payload, eventType);
    } else {
      console.log(`Unhandled Telnyx event type: ${eventType}`);
    }

    // Return success response
    return NextResponse.json(createWebhookResponse(true), { status: 200 });
  } catch (error) {
    console.error("Error processing Telnyx webhook:", error);
    return NextResponse.json(
      createWebhookResponse(
        false,
        error instanceof Error ? error.message : "Internal error"
      ),
      { status: 500 }
    );
  }
}

/**
 * Handle call-related webhook events
 */
async function handleCallEvent(payload: WebhookPayload, eventType: string) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  switch (eventType) {
    case "call.initiated": {
      const event = payload as CallInitiatedPayload;
      const callData = event.data.payload;

      console.log(`📞 Incoming call from ${callData.from} to ${callData.to}`);
      console.log(`📱 Call Control ID: ${callData.call_control_id}`);

      // Create or update communication record for this call
      const companyId = await getCompanyIdFromPhoneNumber(callData.to);
      console.log(
        `🏢 Company ID: ${companyId || "NOT FOUND - Check phone_numbers table"}`
      );

      await supabase.from("communications").upsert({
        company_id: companyId,
        type: "phone",
        direction: callData.direction === "incoming" ? "inbound" : "outbound",
        from_phone: callData.from,
        to_phone: callData.to,
        status: "queued",
        telnyx_call_control_id: callData.call_control_id,
        telnyx_call_session_id: callData.call_session_id,
        metadata: { start_time: callData.start_time, state: callData.state },
      });

      console.log("✅ Call saved to database");
      break;
    }

    case "call.answered": {
      const event = payload as CallAnsweredPayload;
      const callData = event.data.payload;

      // Update communication record
      await supabase
        .from("communications")
        .update({
          status: "delivered",
          call_answered_at: new Date().toISOString(),
          metadata: { start_time: callData.start_time, state: callData.state },
        })
        .eq("telnyx_call_control_id", callData.call_control_id);

      console.log(`Call answered: ${callData.call_control_id}`);
      break;
    }

    case "call.hangup": {
      const event = payload as CallHangupPayload;
      const callData = event.data.payload;

      // Calculate call duration
      const startTime = new Date(callData.start_time).getTime();
      const endTime = new Date(callData.end_time).getTime();
      const duration = Math.round((endTime - startTime) / 1000); // seconds

      // Update communication record
      await supabase
        .from("communications")
        .update({
          status: "sent",
          call_ended_at: callData.end_time,
          call_duration: duration,
          hangup_cause: callData.hangup_cause,
          hangup_source: callData.hangup_source,
          metadata: {
            start_time: callData.start_time,
            end_time: callData.end_time,
            state: callData.state,
            sip_hangup_cause: callData.sip_hangup_cause,
          },
        })
        .eq("telnyx_call_control_id", callData.call_control_id);

      console.log(
        `Call ended: ${callData.call_control_id}, duration: ${duration}s`
      );
      break;
    }

    case "call.recording.saved": {
      const recordingData = payload.data.payload as any;
      const recordingUrl =
        recordingData.recording_urls?.[0] || recordingData.public_recording_url;

      // Update communication with recording URL
      const { data: communication } = await supabase
        .from("communications")
        .update({
          call_recording_url: recordingUrl,
          metadata: {
            recording_id: recordingData.recording_id,
            channels: recordingData.channels,
            duration: recordingData.duration,
          },
        })
        .eq("telnyx_call_control_id", recordingData.call_control_id)
        .select("id")
        .single();

      console.log(`📼 Call recording saved: ${recordingData.call_control_id}`);

      // Automatically trigger transcription if recording URL exists
      if (recordingUrl && communication?.id) {
        console.log("📝 Triggering automatic transcription for recording...");

        // Import and call transcription action
        const { transcribeCallRecording } = await import("@/actions/telnyx");
        const transcriptionResult = await transcribeCallRecording({
          recordingUrl,
          communicationId: communication.id,
        });

        if (transcriptionResult.success) {
          console.log(
            `✅ Transcription job started: ${transcriptionResult.transcriptionId}`
          );
        } else {
          console.error(
            `❌ Failed to start transcription: ${transcriptionResult.error}`
          );
        }
      }

      break;
    }

    case "call.machine.detection.ended":
    case "call.machine.premium.detection.ended": {
      const machineData = payload.data.payload as any;

      // Update communication with machine detection result
      await supabase
        .from("communications")
        .update({
          answering_machine_detected: machineData.result !== "human",
          metadata: {
            machine_detection_result: machineData.result,
            machine_detection_confidence: machineData.confidence,
          },
        })
        .eq("telnyx_call_control_id", machineData.call_control_id);

      console.log(
        `Machine detection: ${machineData.call_control_id}, result: ${machineData.result}`
      );
      break;
    }

    default:
      console.log(`Unhandled call event: ${eventType}`);
  }
}

/**
 * Handle message-related webhook events
 */
async function handleMessageEvent(payload: WebhookPayload, eventType: string) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  switch (eventType) {
    case "message.received": {
      const event = payload as MessageReceivedPayload;
      const messageData = event.data.payload;

      // Create communication record for received message
      await supabase.from("communications").insert({
        company_id: await getCompanyIdFromPhoneNumber(
          messageData.to[0].phone_number
        ),
        type: "sms",
        direction: "inbound",
        from_phone: messageData.from.phone_number,
        to_phone: messageData.to[0].phone_number,
        body: messageData.text,
        status: "delivered",
        telnyx_message_id: messageData.id,
        received_at: messageData.received_at,
        metadata: {
          carrier: messageData.from.carrier,
          line_type: messageData.from.line_type,
          media: messageData.media,
        },
      });

      console.log(`Message received: ${messageData.id}`);
      break;
    }

    case "message.sent": {
      const messageData = payload.data.payload as any;

      // Update existing communication record
      await supabase
        .from("communications")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("telnyx_message_id", messageData.id);

      console.log(`Message sent: ${messageData.id}`);
      break;
    }

    case "message.delivered": {
      const messageData = payload.data.payload as any;

      // Update communication record
      await supabase
        .from("communications")
        .update({
          status: "delivered",
          delivered_at: new Date().toISOString(),
        })
        .eq("telnyx_message_id", messageData.id);

      console.log(`Message delivered: ${messageData.id}`);
      break;
    }

    case "message.sending_failed":
    case "message.delivery_failed": {
      const messageData = payload.data.payload as any;

      // Update communication record with failure
      await supabase
        .from("communications")
        .update({
          status: "failed",
          failed_at: new Date().toISOString(),
          failure_reason: messageData.errors?.[0]?.detail || "Unknown error",
        })
        .eq("telnyx_message_id", messageData.id);

      console.log(`Message failed: ${messageData.id}`);
      break;
    }

    default:
      console.log(`Unhandled message event: ${eventType}`);
  }
}

/**
 * Helper function to get company_id from phone number
 * Looks up the company that owns this phone number
 */
async function getCompanyIdFromPhoneNumber(
  phoneNumber: string
): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("phone_numbers")
    .select("company_id")
    .eq("phone_number", phoneNumber)
    .single();

  return data?.company_id || null;
}
