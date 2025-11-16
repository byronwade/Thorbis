/**
 * Telnyx Calls Service - Call Control & Management
 *
 * Handles all call-related operations including:
 * - Initiating outbound calls
 * - Answering incoming calls
 * - Call control (mute, hold, transfer)
 * - Call recording
 * - Hangup operations
 */

const TELNYX_API_BASE = "https://api.telnyx.com/v2";

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
 * Make a direct HTTP request to Telnyx REST API
 */
async function telnyxCallRequest<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<{ success: boolean; data?: T; error?: string }> {
  const apiKey = process.env.TELNYX_API_KEY;
  if (!apiKey) {
    return { success: false, error: "TELNYX_API_KEY is not configured" };
  }

  try {
    const response = await fetch(`${TELNYX_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage =
        result?.errors?.[0]?.detail ||
        result?.errors?.[0] ||
        response.statusText;
      return {
        success: false,
        error: `Telnyx ${response.status}: ${errorMessage}`,
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
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
  try {
    const result = await telnyxCallRequest<{
      call_control_id: string;
      call_session_id: string;
    }>("/calls", {
      to: params.to,
      from: params.from,
      connection_id: params.connectionId,
      webhook_url: params.webhookUrl,
      answering_machine_detection:
        params.answeringMachineDetection || "disabled",
      custom_headers: params.customHeaders,
    });

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
  } catch (error) {
    console.error("Error initiating call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initiate call",
    };
  }
}

/**
 * Answer an incoming call
 */
export async function answerCall(params: {
  callControlId: string;
  webhookUrl?: string;
  clientState?: string;
}) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/answer`,
      {
        webhook_url: params.webhookUrl,
        client_state: params.clientState,
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error answering call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to answer call",
    };
  }
}

/**
 * Reject an incoming call
 */
export async function rejectCall(params: {
  callControlId: string;
  cause?: "CALL_REJECTED" | "USER_BUSY";
}) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/reject`,
      {
        cause: params.cause || "CALL_REJECTED",
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error rejecting call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject call",
    };
  }
}

/**
 * Hangup an active call
 */
export async function hangupCall(params: { callControlId: string }) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/hangup`,
      {}
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error hanging up call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to hangup call",
    };
  }
}

/**
 * Start call recording
 */
export async function startRecording(params: {
  callControlId: string;
  format?: "wav" | "mp3";
  channels?: "single" | "dual";
}) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/record_start`,
      {
        format: params.format || "mp3",
        channels: params.channels || "single",
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error starting recording:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to start recording",
    };
  }
}

/**
 * Stop call recording
 */
export async function stopRecording(params: { callControlId: string }) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/record_stop`,
      {}
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error stopping recording:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to stop recording",
    };
  }
}

/**
 * Play audio to the call
 */
export async function playAudio(params: {
  callControlId: string;
  audioUrl: string;
  loop?: number;
}) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/playback_start`,
      {
        audio_url: params.audioUrl,
        loop: params.loop,
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error playing audio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to play audio",
    };
  }
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
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/speak`,
      {
        payload: params.text,
        voice: params.voice || "female",
        language: params.language || "en-US",
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error speaking text:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to speak text",
    };
  }
}

/**
 * Transfer a call to another number
 */
export async function transferCall(params: {
  callControlId: string;
  to: string;
  from: string;
}) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/transfer`,
      {
        to: params.to,
        from: params.from,
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error transferring call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to transfer call",
    };
  }
}

/**
 * Send DTMF tones (phone keypad presses)
 */
export async function sendDTMF(params: {
  callControlId: string;
  digits: string;
}) {
  try {
    const result = await telnyxCallRequest(
      `/calls/${params.callControlId}/actions/send_dtmf`,
      {
        digits: params.digits,
      }
    );

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error sending DTMF:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send DTMF",
    };
  }
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
  try {
    const endpoint = params.audioUrl
      ? `/calls/${params.callControlId}/actions/gather_using_audio`
      : `/calls/${params.callControlId}/actions/gather_using_speak`;

    const body = params.audioUrl
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

    const result = await telnyxCallRequest(endpoint, body);

    return {
      success: result.success,
      data: result.data,
      error: result.error,
    };
  } catch (error) {
    console.error("Error gathering input:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to gather input",
    };
  }
}
