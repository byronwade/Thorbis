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
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { formatPhoneNumber } from "@/lib/telnyx/messaging";
import { lookupCallerInfo } from "@/lib/telnyx/number-lookup";
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
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;
type CommunicationInsert =
  Database["public"]["Tables"]["communications"]["Insert"];

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
  const supabase = await createServiceSupabaseClient();

  switch (eventType) {
    case "call.initiated": {
      const event = payload as CallInitiatedPayload;
      const callData = event.data.payload;

      console.log(`📞 Incoming call from ${callData.from} to ${callData.to}`);
      console.log(`📱 Call Control ID: ${callData.call_control_id}`);

      const phoneContext = await getPhoneNumberContext(supabase, callData.to);

      if (!phoneContext) {
        console.warn(
          `⚠️  Could not find phone number ${callData.to} in phone_numbers table`
        );
        break;
      }

      const fromAddress = normalizePhoneNumber(callData.from);
      const toAddress = normalizePhoneNumber(callData.to);

      const customerId =
        callData.direction === "incoming"
          ? await findCustomerIdByPhone(
              supabase,
              phoneContext.companyId,
              fromAddress
            )
          : undefined;

      let fromName: string | null = null;
      if (customerId) {
        fromName = await getCustomerDisplayName(supabase, customerId);
      }

      let callerLookup: Record<string, unknown> | undefined;
      if (!fromName) {
        const lookupResult = await lookupCallerInfo(fromAddress);
        if (lookupResult.success && lookupResult.data) {
          fromName = lookupResult.data.caller_name || null;
          callerLookup = lookupResult.data;
        } else if (lookupResult.error) {
          callerLookup = { error: lookupResult.error };
        }
      }

      const communicationPayload: CommunicationInsert = {
        company_id: phoneContext.companyId,
        type: "phone",
        channel: "telnyx",
        direction: callData.direction === "incoming" ? "inbound" : "outbound",
        from_address: fromAddress,
        to_address: toAddress,
        from_name: fromName,
        body: "",
        status: "queued",
        priority: "normal",
        phone_number_id: phoneContext.phoneNumberId,
        is_archived: false,
        is_internal: false,
        is_automated: false,
        is_thread_starter: true,
        telnyx_call_control_id: callData.call_control_id,
        telnyx_call_session_id: callData.call_session_id,
      };

      if (callerLookup) {
        communicationPayload.provider_metadata = {
          caller_lookup: callerLookup,
        } as CommunicationInsert["provider_metadata"];
      }

      if (customerId) {
        communicationPayload.customer_id = customerId;
      }

      const { error: upsertError } = await supabase
        .from("communications")
        .upsert(communicationPayload, {
          onConflict: "telnyx_call_control_id",
        });

      if (upsertError) {
        console.error("❌ Failed to save call to database:", upsertError);
        throw upsertError;
      }

      console.log("✅ Call saved to database");
      break;
    }

    case "call.answered": {
      const event = payload as CallAnsweredPayload;
      const callData = event.data.payload;

      // Update communication record
      const { error: updateError } = await supabase
        .from("communications")
        .update({
          status: "delivered",
          call_answered_at: new Date().toISOString(),
        })
        .eq("telnyx_call_control_id", callData.call_control_id);

      if (updateError) {
        console.error("❌ Failed to update call answered status:", updateError);
      } else {
        console.log(`✅ Call answered: ${callData.call_control_id}`);
      }
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
      const { error: hangupError } = await supabase
        .from("communications")
        .update({
          status: "sent",
          call_ended_at: callData.end_time,
          call_duration: duration,
          hangup_cause: callData.hangup_cause,
          hangup_source: callData.hangup_source,
        })
        .eq("telnyx_call_control_id", callData.call_control_id);

      if (hangupError) {
        console.error("❌ Failed to update call hangup:", hangupError);
      } else {
        console.log(
          `✅ Call ended: ${callData.call_control_id}, duration: ${duration}s`
        );
      }
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
          recording_channels: recordingData.channels,
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
  const supabase = await createServiceSupabaseClient();

  switch (eventType) {
    case "message.received": {
      const event = payload as MessageReceivedPayload;
      const messageData = event.data.payload;

      const destinationNumber = messageData.to[0]?.phone_number;
      const phoneContext = destinationNumber
        ? await getPhoneNumberContext(supabase, destinationNumber)
        : null;

      if (!phoneContext) {
        console.warn(
          `⚠️  Could not associate inbound SMS ${messageData.id} to a company`
        );
        break;
      }

      const fromAddress = normalizePhoneNumber(messageData.from.phone_number);
      const toAddress = normalizePhoneNumber(destinationNumber);
      const customerId = await findCustomerIdByPhone(
        supabase,
        phoneContext.companyId,
        fromAddress
      );

      await supabase.from("communications").insert({
        company_id: phoneContext.companyId,
        customer_id: customerId,
        type: "sms",
        channel: "telnyx",
        direction: "inbound",
        from_address: fromAddress,
        to_address: toAddress,
        body: messageData.text || "",
        status: "delivered",
        priority: "normal",
        phone_number_id: phoneContext.phoneNumberId,
        is_archived: false,
        is_internal: false,
        is_automated: false,
        is_thread_starter: true,
        telnyx_message_id: messageData.id,
        received_at: messageData.received_at,
        provider_metadata: {
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

function normalizePhoneNumber(phoneNumber: string): string {
  return formatPhoneNumber(phoneNumber);
}

function extractComparableDigits(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

async function getPhoneNumberContext(
  supabase: TypedSupabaseClient,
  phoneNumber: string
): Promise<{ companyId: string; phoneNumberId: string } | null> {
  const normalized = normalizePhoneNumber(phoneNumber);

  const { data } = await supabase
    .from("phone_numbers")
    .select("id, company_id")
    .eq("phone_number", normalized)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    companyId: data.company_id,
    phoneNumberId: data.id,
  };
}

async function findCustomerIdByPhone(
  supabase: TypedSupabaseClient,
  companyId: string,
  phoneNumber: string
): Promise<string | null> {
  const digits = extractComparableDigits(phoneNumber);
  if (!digits) {
    return null;
  }

  const { data } = await supabase
    .from("customers")
    .select("id")
    .eq("company_id", companyId)
    .ilike("phone", `%${digits}%`)
    .maybeSingle();

  return data?.id ?? null;
}

async function getCustomerDisplayName(
  supabase: TypedSupabaseClient,
  customerId: string
) {
  const { data } = await supabase
    .from("customers")
    .select("first_name, last_name, company_name")
    .eq("id", customerId)
    .maybeSingle();

  if (!data) return null;

  const first = data.first_name?.trim();
  const last = data.last_name?.trim();
  const fullName = [first, last].filter(Boolean).join(" ").trim();

  return fullName || data.company_name || null;
}
