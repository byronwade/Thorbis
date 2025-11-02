/**
 * AssemblyAI Webhook Handler - API Route
 *
 * Receives transcription completion notifications from AssemblyAI.
 * Updates the communications table with the completed transcript.
 *
 * Webhook events:
 * - transcript.completed - Transcription finished successfully
 * - transcript.failed - Transcription failed
 *
 * Documentation: https://www.assemblyai.com/docs/API%20reference/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatTranscriptWithSpeakers } from "@/lib/assemblyai/client";

export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const payload = await request.json();

    console.log("\n🔔 Received AssemblyAI webhook");
    console.log("📦 Event:", payload.status);
    console.log("📝 Transcription ID:", payload.transcript_id);

    // Route based on transcription status
    if (payload.status === "completed") {
      await handleTranscriptionCompleted(payload);
    } else if (payload.status === "error") {
      await handleTranscriptionFailed(payload);
    } else {
      console.log(`Unhandled AssemblyAI status: ${payload.status}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing AssemblyAI webhook:", error);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

/**
 * Handle completed transcription
 */
async function handleTranscriptionCompleted(payload: any) {
  const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

  try {
    console.log("✅ Transcription completed successfully");

    // Format transcript with speaker labels
    const formattedTranscript = formatTranscriptWithSpeakers(payload.utterances);

    // Find communication record by transcription ID
    const { data: communications } = await supabase
      .from("communications")
      .select("id, metadata")
      .eq("metadata->>assemblyai_transcription_id", payload.transcript_id);

    if (!communications || communications.length === 0) {
      console.error(
        `❌ No communication found for transcription ID: ${payload.transcript_id}`
      );
      return;
    }

    // Update all matching communications (should typically be just one)
    for (const communication of communications) {
      const existingMetadata = (communication.metadata as Record<string, any>) || {};

      await supabase
        .from("communications")
        .update({
          call_transcript: formattedTranscript || payload.text,
          metadata: {
            ...existingMetadata,
            assemblyai_transcription_id: payload.transcript_id,
            assemblyai_status: "completed",
            transcription_confidence: payload.confidence,
            transcription_words: payload.words?.length || 0,
            transcription_speakers: payload.utterances
              ? new Set(payload.utterances.map((u: any) => u.speaker)).size
              : 0,
          },
        })
        .eq("id", communication.id);

      console.log(`✅ Transcript saved to communication ${communication.id}`);
      console.log(
        `📊 Stats: ${payload.words?.length || 0} words, ${payload.utterances ? new Set(payload.utterances.map((u: any) => u.speaker)).size : 0} speakers`
      );

      // Log first 200 chars of transcript
      const preview =
        formattedTranscript?.substring(0, 200) || payload.text?.substring(0, 200) || "";
      console.log(`📄 Transcript preview: ${preview}${preview.length >= 200 ? "..." : ""}`);
    }
  } catch (error) {
    console.error("Error handling completed transcription:", error);
    throw error;
  }
}

/**
 * Handle failed transcription
 */
async function handleTranscriptionFailed(payload: any) {
  const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

  try {
    console.error("❌ Transcription failed");
    console.error("Error:", payload.error);

    // Find communication record by transcription ID
    const { data: communications } = await supabase
      .from("communications")
      .select("id, metadata")
      .eq("metadata->>assemblyai_transcription_id", payload.transcript_id);

    if (!communications || communications.length === 0) {
      console.error(
        `❌ No communication found for transcription ID: ${payload.transcript_id}`
      );
      return;
    }

    // Update metadata with error status
    for (const communication of communications) {
      const existingMetadata = (communication.metadata as Record<string, any>) || {};

      await supabase
        .from("communications")
        .update({
          metadata: {
            ...existingMetadata,
            assemblyai_transcription_id: payload.transcript_id,
            assemblyai_status: "error",
            transcription_error: payload.error || "Transcription failed",
          },
        })
        .eq("id", communication.id);

      console.log(`❌ Transcription error saved for communication ${communication.id}`);
    }
  } catch (error) {
    console.error("Error handling failed transcription:", error);
    throw error;
  }
}
