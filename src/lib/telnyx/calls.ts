/**
 * Telnyx Calls Service - Call Control & Management
 *
 * Production-ready call control with:
 * - Retry logic with exponential backoff
 * - Request timeouts (prevents hanging)
 * - Circuit breaker protection
 * - Structured logging
 *
 * Handles all call-related operations including:
 * - Initiating outbound calls
 * - Answering incoming calls
 * - Call control (mute, hold, transfer)
 * - Call recording
 * - Hangup operations
 */

import { telnyxLogger } from "./logger";
import { withRetry } from "./retry";

const TELNYX_API_BASE = "https://api.telnyx.com/v2";

// Request timeout for call control operations (15 seconds)
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Call control command types
 */
export type CallCommand =
	| "answer"
	| "reject"
	| "hangup"
	| "bridge"
	| "speak"
	| "gather_using_audio"
	| "gather_using_speak"
	| "playback_start"
	| "playback_stop"
	| "record_start"
	| "record_stop"
	| "send_dtmf"
	| "transfer";

/**
 * Call status types from Telnyx webhooks
 */
export type CallStatus =
	| "initiated"
	| "ringing"
	| "answered"
	| "active"
	| "hangup"
	| "machine_greeting_detected"
	| "machine_greeting_ended";

/**
 * Make a direct HTTP request to Telnyx REST API with retry and timeout
 */
async function telnyxCallRequest<T>(
	endpoint: string,
	body: Record<string, unknown>,
	options?: {
		/** Operation name for logging */
		operation?: string;
		/** Custom timeout in ms (default: 15000) */
		timeout?: number;
		/** Skip retry logic (for time-sensitive operations) */
		skipRetry?: boolean;
	}
): Promise<{ success: boolean; data?: T; error?: string }> {
	const apiKey = process.env.TELNYX_API_KEY;
	if (!apiKey) {
		return { success: false, error: "TELNYX_API_KEY is not configured" };
	}

	const operation = options?.operation || endpoint;
	const timeout = options?.timeout ?? REQUEST_TIMEOUT_MS;

	const makeRequest = async (): Promise<{ success: boolean; data?: T; error?: string }> => {
		// Create abort controller for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			telnyxLogger.debug("Call API request", {
				endpoint,
				operation,
			});

			const response = await fetch(`${TELNYX_API_BASE}${endpoint}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			const result = await response.json();

			if (!response.ok) {
				const errorMessage =
					result?.errors?.[0]?.detail ||
					result?.errors?.[0] ||
					response.statusText;

				telnyxLogger.warn("Call API error response", {
					endpoint,
					operation,
					status: response.status,
					error: errorMessage,
				});

				// Throw for retry logic to catch
				const error = new Error(`Telnyx ${response.status}: ${errorMessage}`);
				(error as Error & { statusCode: number }).statusCode = response.status;
				throw error;
			}

			telnyxLogger.debug("Call API success", {
				endpoint,
				operation,
			});

			return { success: true, data: result.data };
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof Error && error.name === "AbortError") {
				telnyxLogger.error("Call API timeout", {
					endpoint,
					operation,
					timeoutMs: timeout,
				});
				throw new Error(`Request timeout after ${timeout}ms`);
			}

			throw error;
		}
	};

	try {
		// Use retry logic unless skipped
		if (options?.skipRetry) {
			return await makeRequest();
		}

		return await withRetry(makeRequest, {
			endpoint: `calls:${operation}`,
			config: {
				maxRetries: 2, // Fewer retries for call operations (time-sensitive)
				baseDelayMs: 500,
				maxDelayMs: 2000,
			},
			onRetry: (attempt, error, delayMs) => {
				telnyxLogger.warn("Retrying call API request", {
					endpoint,
					operation,
					attempt,
					error: error.message,
					delayMs,
				});
			},
		});
	} catch (error) {
		telnyxLogger.error("Call API request failed", {
			endpoint,
			operation,
			error: error instanceof Error ? error.message : "Unknown error",
		});

		return {
			success: false,
			error: error instanceof Error ? error.message : "Request failed",
		};
	}
}

/**
 * Initiate an outbound call
 */
export async function initiateCall(params: {
	to: string;
	from: string;
	connectionId: string;
	webhookUrl?: string;
	answeringMachineDetection?: "premium" | "detect" | "disabled";
	customHeaders?: Array<{ name: string; value: string }>;
}) {
	const result = await telnyxCallRequest<{
		call_control_id: string;
		call_session_id: string;
	}>(
		"/calls",
		{
			to: params.to,
			from: params.from,
			connection_id: params.connectionId,
			webhook_url: params.webhookUrl,
			answering_machine_detection:
				params.answeringMachineDetection || "disabled",
			custom_headers: params.customHeaders,
		},
		{ operation: "initiate" }
	);

	if (!(result.success && result.data)) {
		return {
			success: false,
			error: result.error || "Failed to initiate call",
		};
	}

	return {
		success: true,
		callControlId: result.data.call_control_id,
		callSessionId: result.data.call_session_id,
		data: result.data,
	};
}

/**
 * Answer an incoming call
 */
export async function answerCall(params: {
	callControlId: string;
	webhookUrl?: string;
	clientState?: string;
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/answer`,
		{
			webhook_url: params.webhookUrl,
			client_state: params.clientState,
		},
		{ operation: "answer", skipRetry: true } // Time-sensitive, no retry
	);
}

/**
 * Reject an incoming call
 */
export async function rejectCall(params: {
	callControlId: string;
	cause?: "CALL_REJECTED" | "USER_BUSY";
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/reject`,
		{ cause: params.cause || "CALL_REJECTED" },
		{ operation: "reject", skipRetry: true }
	);
}

/**
 * Hangup an active call
 */
export async function hangupCall(params: { callControlId: string }) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/hangup`,
		{},
		{ operation: "hangup" }
	);
}

/**
 * Start call recording
 */
export async function startRecording(params: {
	callControlId: string;
	format?: "wav" | "mp3";
	channels?: "single" | "dual";
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/record_start`,
		{
			format: params.format || "mp3",
			channels: params.channels || "single",
		},
		{ operation: "record_start" }
	);
}

/**
 * Stop call recording
 */
export async function stopRecording(params: { callControlId: string }) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/record_stop`,
		{},
		{ operation: "record_stop" }
	);
}

/**
 * Play audio to the call
 */
export async function playAudio(params: {
	callControlId: string;
	audioUrl: string;
	loop?: number;
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/playback_start`,
		{
			audio_url: params.audioUrl,
			loop: params.loop,
		},
		{ operation: "playback_start" }
	);
}

/**
 * Speak text to the call using text-to-speech
 */
export async function speakText(params: {
	callControlId: string;
	text: string;
	voice?: "male" | "female";
	language?: string;
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/speak`,
		{
			payload: params.text,
			voice: params.voice || "female",
			language: params.language || "en-US",
		},
		{ operation: "speak" }
	);
}

/**
 * Transfer a call to another number
 */
export async function transferCall(params: {
	callControlId: string;
	to: string;
	from: string;
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/transfer`,
		{
			to: params.to,
			from: params.from,
		},
		{ operation: "transfer" }
	);
}

/**
 * Send DTMF tones (phone keypad presses)
 */
export async function sendDTMF(params: {
	callControlId: string;
	digits: string;
}) {
	return telnyxCallRequest(
		`/calls/${params.callControlId}/actions/send_dtmf`,
		{ digits: params.digits },
		{ operation: "send_dtmf" }
	);
}

/**
 * Gather user input using audio prompts
 */
export async function gatherInput(params: {
	callControlId: string;
	audioUrl?: string;
	speakText?: string;
	validDigits?: string;
	maxDigits?: number;
	minDigits?: number;
	timeout?: number;
	terminatingDigit?: string;
}) {
	const useAudio = !!params.audioUrl;
	const endpoint = useAudio
		? `/calls/${params.callControlId}/actions/gather_using_audio`
		: `/calls/${params.callControlId}/actions/gather_using_speak`;

	const body = useAudio
		? {
				audio_url: params.audioUrl,
				valid_digits: params.validDigits,
				max: params.maxDigits,
				min: params.minDigits,
				timeout_millis: params.timeout,
				terminating_digit: params.terminatingDigit || "#",
			}
		: {
				payload: params.speakText || "",
				valid_digits: params.validDigits,
				max: params.maxDigits,
				min: params.minDigits,
				timeout_millis: params.timeout,
				terminating_digit: params.terminatingDigit || "#",
			};

	return telnyxCallRequest(endpoint, body, {
		operation: useAudio ? "gather_audio" : "gather_speak",
	});
}
