/**
 * AssemblyAI Client - Stub
 *
 * Placeholder for AssemblyAI transcription service integration.
 * TODO: Implement actual AssemblyAI integration when needed.
 */

interface TranscriptionParams {
	audio_url: string;
	speaker_labels?: boolean;
	webhook_url?: string;
}

interface TranscriptionResult {
	id: string;
	status: string;
}

/**
 * Submit audio for transcription to AssemblyAI
 */
export async function submitTranscription(
	_params: TranscriptionParams,
): Promise<TranscriptionResult> {
	console.warn("AssemblyAI client not configured - transcription unavailable");
	return {
		id: "stub-transcription-id",
		status: "unavailable",
	};
}
