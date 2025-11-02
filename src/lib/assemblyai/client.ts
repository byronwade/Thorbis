/**
 * AssemblyAI Client - Post-Call Transcription
 *
 * Integrates with AssemblyAI API for call recording transcription.
 * Supports automatic transcription with speaker diarization.
 *
 * Features:
 * - Automatic transcription from recording URLs
 * - Speaker diarization (identify different speakers)
 * - Webhook notifications when transcription completes
 * - Cost: $0.25/hour of audio
 *
 * Documentation: https://www.assemblyai.com/docs
 *
 * @module assemblyai/client
 * @server-only This module should only be imported in server-side code
 */

import "server-only";

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_API_URL = "https://api.assemblyai.com/v2";

export type TranscriptionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "error";

export interface TranscriptionResponse {
  id: string;
  status: TranscriptionStatus;
  audio_url: string;
  text?: string;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: string;
  }>;
  utterances?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker: string;
  }>;
  error?: string;
}

export interface TranscriptionRequest {
  audio_url: string;
  speaker_labels?: boolean;
  webhook_url?: string;
  webhook_auth_header_name?: string;
  webhook_auth_header_value?: string;
}

/**
 * Submit audio URL for transcription
 *
 * @param params - Transcription request parameters
 * @returns Transcription job with ID and status
 *
 * @example
 * ```typescript
 * const result = await submitTranscription({
 *   audio_url: "https://cdn.telnyx.com/recording.mp3",
 *   speaker_labels: true, // Enable speaker diarization
 *   webhook_url: "https://yourapp.com/api/webhooks/assemblyai"
 * });
 * ```
 */
export async function submitTranscription(
  params: TranscriptionRequest
): Promise<{ success: boolean; data?: TranscriptionResponse; error?: string }> {
  try {
    if (!ASSEMBLYAI_API_KEY) {
      throw new Error("ASSEMBLYAI_API_KEY is not configured");
    }

    console.log("📝 Submitting audio for transcription:", params.audio_url);

    const response = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: params.audio_url,
        speaker_labels: params.speaker_labels ?? true, // Enable speaker diarization by default
        webhook_url: params.webhook_url,
        webhook_auth_header_name: params.webhook_auth_header_name,
        webhook_auth_header_value: params.webhook_auth_header_value,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ AssemblyAI transcription request failed:", error);
      throw new Error(`AssemblyAI API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as TranscriptionResponse;
    console.log(`✅ Transcription job created: ${data.id}, status: ${data.status}`);

    return { success: true, data };
  } catch (error) {
    console.error("Failed to submit transcription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get transcription status and result
 *
 * @param transcriptionId - AssemblyAI transcription ID
 * @returns Transcription with status and text (if completed)
 *
 * @example
 * ```typescript
 * const result = await getTranscription("abc123");
 * if (result.data?.status === "completed") {
 *   console.log(result.data.text);
 * }
 * ```
 */
export async function getTranscription(
  transcriptionId: string
): Promise<{ success: boolean; data?: TranscriptionResponse; error?: string }> {
  try {
    if (!ASSEMBLYAI_API_KEY) {
      throw new Error("ASSEMBLYAI_API_KEY is not configured");
    }

    const response = await fetch(
      `${ASSEMBLYAI_API_URL}/transcript/${transcriptionId}`,
      {
        headers: {
          Authorization: ASSEMBLYAI_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AssemblyAI API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as TranscriptionResponse;
    return { success: true, data };
  } catch (error) {
    console.error("Failed to get transcription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format transcription with speaker labels
 *
 * Converts raw utterances into human-readable transcript with speaker labels.
 *
 * @param utterances - Speaker-labeled utterances from AssemblyAI
 * @returns Formatted transcript string
 *
 * @example
 * ```typescript
 * const formatted = formatTranscriptWithSpeakers(transcription.utterances);
 * // Output:
 * // Speaker A: Hello, how can I help you?
 * // Speaker B: I need help with my account.
 * ```
 */
export function formatTranscriptWithSpeakers(
  utterances?: Array<{
    text: string;
    speaker: string;
  }>
): string {
  if (!utterances || utterances.length === 0) {
    return "";
  }

  return utterances
    .map((utterance) => `Speaker ${utterance.speaker}: ${utterance.text}`)
    .join("\n\n");
}

/**
 * Get transcription cost estimate
 *
 * @param durationSeconds - Audio duration in seconds
 * @returns Estimated cost in USD
 *
 * AssemblyAI Pricing: $0.25/hour = $0.004167/minute = $0.00006944/second
 */
export function estimateTranscriptionCost(durationSeconds: number): number {
  const COST_PER_SECOND = 0.00006944; // $0.25/hour
  return durationSeconds * COST_PER_SECOND;
}
