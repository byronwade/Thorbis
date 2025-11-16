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

import { type NextRequest, NextResponse } from "next/server";
import { formatTranscriptWithSpeakers } from "@/lib/assemblyai/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
	try {
		// Parse webhook payload
		const payload = await request.json();

		// Route based on transcription status
		if (payload.status === "completed") {
			await handleTranscriptionCompleted(payload);
		} else if (payload.status === "error") {
			await handleTranscriptionFailed(payload);
		} else {
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (_error) {
    console.error("Error:", _error);
		return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
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

	// Format transcript with speaker labels
	const formattedTranscript = formatTranscriptWithSpeakers(payload.utterances);

	// Find communication record by transcription ID
	const { data: communications } = await supabase
		.from("communications")
		.select("id, metadata")
		.eq("metadata->>assemblyai_transcription_id", payload.transcript_id);

	if (!communications || communications.length === 0) {
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
					transcription_speakers: payload.utterances ? new Set(payload.utterances.map((u: any) => u.speaker)).size : 0,
				},
			})
			.eq("id", communication.id);

		// Log first 200 chars of transcript
		const _preview = formattedTranscript?.substring(0, 200) || payload.text?.substring(0, 200) || "";
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

	// Find communication record by transcription ID
	const { data: communications } = await supabase
		.from("communications")
		.select("id, metadata")
		.eq("metadata->>assemblyai_transcription_id", payload.transcript_id);

	if (!communications || communications.length === 0) {
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
	}
}
