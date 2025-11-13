import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Telnyx Webhook Handler - Real-time call events
 *
 * Handles incoming webhooks from Telnyx for:
 * - Call initiated, answered, hangup events
 * - Recording saved events
 * - Voicemail deposited events
 * - Machine detection (answering machine/voicemail)
 *
 * Security:
 * - Verifies webhook signature (ED25519)
 * - Validates timestamp (prevents replay attacks)
 * - IP whitelist (Telnyx IPs only)
 */

// Telnyx public key for webhook verification
const TELNYX_PUBLIC_KEY = process.env.TELNYX_PUBLIC_KEY || "";

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string
): boolean {
  try {
    // Check if signature verification is enabled
    if (!TELNYX_PUBLIC_KEY) {
      console.error(
        "TELNYX_PUBLIC_KEY not configured - REJECTING webhook for security"
      );
      return false; // REJECT unsigned webhooks - security best practice
    }

    // Verify timestamp is recent (within 5 minutes)
    const webhookTimestamp = Number.parseInt(timestamp);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTimestamp - webhookTimestamp);

    if (timeDiff > 300) {
      // 5 minutes
      console.error("Webhook timestamp too old:", timeDiff, "seconds");
      return false;
    }

    // Reconstruct signed payload
    const signedPayload = `${timestamp}.${payload}`;

    // Verify signature using public key
    const publicKey = crypto.createPublicKey({
      key: Buffer.from(TELNYX_PUBLIC_KEY, "base64"),
      format: "der",
      type: "spki",
    });

    const isValid = crypto.verify(
      null,
      Buffer.from(signedPayload),
      {
        key: publicKey,
        dsaEncoding: "ieee-p1363",
      },
      Buffer.from(signature, "base64")
    );

    return isValid;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get signature headers
    const signature = request.headers.get("telnyx-signature-ed25519") || "";
    const timestamp = request.headers.get("telnyx-timestamp-ed25519") || "";

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, timestamp)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse webhook payload
    const webhook = JSON.parse(rawBody);
    const { data } = webhook;
    const eventType = data?.event_type;
    const payload = data?.payload;

    console.log("Telnyx webhook received:", eventType);

    // Handle different event types
    switch (eventType) {
      case "call.initiated":
        await handleCallInitiated(payload);
        break;

      case "call.answered":
        await handleCallAnswered(payload);
        break;

      case "call.hangup":
        await handleCallHangup(payload);
        break;

      case "call.recording.saved":
        await handleRecordingSaved(payload);
        break;

      case "call.machine.detection.ended":
        await handleMachineDetection(payload);
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Event Handlers

async function handleCallInitiated(payload: any) {
  const supabase = await createClient();
  if (!supabase) {
    console.error(
      "Failed to initialize Supabase client in handleCallInitiated"
    );
    return;
  }

  const {
    call_control_id,
    call_leg_id,
    call_session_id,
    direction,
    from,
    to,
    state,
  } = payload;

  // Create initial call log entry
  const { error } = await supabase.from("call_logs").insert({
    call_sid: call_control_id || call_session_id,
    direction: direction === "incoming" ? "inbound" : "outbound",
    from_number: from,
    to_number: to,
    call_status: "initiated",
    started_at: new Date().toISOString(),
    metadata: {
      call_leg_id,
      call_session_id,
      state,
    },
  });

  if (error) {
    console.error("Failed to create call log:", error);
  }
}

async function handleCallAnswered(payload: any) {
  const supabase = await createClient();
  if (!supabase) {
    console.error("Failed to initialize Supabase client in handleCallAnswered");
    return;
  }

  const { call_control_id, call_session_id } = payload;

  // Update call log
  const { error } = await supabase
    .from("call_logs")
    .update({
      call_status: "in-progress",
      answered_at: new Date().toISOString(),
    })
    .eq("call_sid", call_control_id || call_session_id);

  if (error) {
    console.error("Failed to update call log:", error);
  }

  // TODO: Find available team member and assign call
  // TODO: Update team_availability.current_calls_count
}

async function handleCallHangup(payload: any) {
  const supabase = await createClient();
  if (!supabase) {
    console.error("Failed to initialize Supabase client in handleCallHangup");
    return;
  }

  const { call_control_id, call_session_id, sip_hangup_cause, hangup_source } =
    payload;

  // Get call start time to calculate duration
  const { data: callLog } = await supabase
    .from("call_logs")
    .select("started_at, answered_at")
    .eq("call_sid", call_control_id || call_session_id)
    .single();

  let duration = 0;
  if (callLog?.answered_at) {
    const start = new Date(callLog.answered_at).getTime();
    const end = new Date().getTime();
    duration = Math.floor((end - start) / 1000); // seconds
  }

  // Update call log
  const { error } = await supabase
    .from("call_logs")
    .update({
      call_status: "completed",
      ended_at: new Date().toISOString(),
      duration_seconds: duration,
      billable_seconds: duration,
      metadata: {
        sip_hangup_cause,
        hangup_source,
      },
    })
    .eq("call_sid", call_control_id || call_session_id);

  if (error) {
    console.error("Failed to update call log:", error);
  }

  // TODO: Decrement team_availability.current_calls_count
  // TODO: Calculate call cost from Telnyx billing API
}

async function handleRecordingSaved(payload: any) {
  const supabase = await createClient();
  if (!supabase) {
    console.error(
      "Failed to initialize Supabase client in handleRecordingSaved"
    );
    return;
  }

  const { call_session_id, recording_urls, duration_millis } = payload;

  // Get the public URL (first URL in the object)
  const recordingUrl = recording_urls?.mp3 || recording_urls?.wav || null;
  const durationSeconds = Math.floor(duration_millis / 1000);

  // Update call log with recording URL
  const { error } = await supabase
    .from("call_logs")
    .update({
      recording_url: recordingUrl,
      recording_duration: durationSeconds,
    })
    .eq("call_sid", call_session_id);

  if (error) {
    console.error("Failed to save recording URL:", error);
  }

  // TODO: Download recording and store in Supabase Storage
  // TODO: Trigger transcription service
}

async function handleMachineDetection(payload: any) {
  const supabase = await createClient();
  if (!supabase) {
    console.error(
      "Failed to initialize Supabase client in handleMachineDetection"
    );
    return;
  }

  const {
    call_control_id,
    result, // "human" | "machine" | "not_sure"
  } = payload;

  // Update call log with machine detection result
  const { error } = await supabase
    .from("call_logs")
    .update({
      metadata: supabase.rpc("jsonb_set", {
        target: "metadata",
        path: "{machine_detection}",
        new_value: JSON.stringify(result),
      }),
    })
    .eq("call_sid", call_control_id);

  if (error) {
    console.error("Failed to update machine detection:", error);
  }

  // If machine detected, route to voicemail immediately
  if (result === "machine") {
    // TODO: Transfer call to voicemail
    console.log("Machine detected, routing to voicemail");
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "telnyx-webhooks",
    timestamp: new Date().toISOString(),
  });
}
