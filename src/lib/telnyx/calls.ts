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

import { telnyxClient } from "./client";

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
    const call = await (telnyxClient.calls as any).create({
      to: params.to,
      from: params.from,
      connection_id: params.connectionId,
      webhook_url: params.webhookUrl,
      answering_machine_detection: params.answeringMachineDetection || "disabled",
      custom_headers: params.customHeaders,
    });

    return {
      success: true,
      callControlId: call.data.call_control_id,
      callSessionId: call.data.call_session_id,
      data: call.data,
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
    const response = await (telnyxClient.calls as any).answer({
      call_control_id: params.callControlId,
      webhook_url: params.webhookUrl,
      client_state: params.clientState,
    });

    return {
      success: true,
      data: response.data,
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
    const response = await (telnyxClient.calls as any).reject({
      call_control_id: params.callControlId,
      cause: params.cause || "CALL_REJECTED",
    });

    return {
      success: true,
      data: response.data,
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
    const response = await (telnyxClient.calls as any).hangup({
      call_control_id: params.callControlId,
    });

    return {
      success: true,
      data: response.data,
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
    const response = await (telnyxClient.calls as any).record_start({
      call_control_id: params.callControlId,
      format: params.format || "mp3",
      channels: params.channels || "single",
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error starting recording:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start recording",
    };
  }
}

/**
 * Stop call recording
 */
export async function stopRecording(params: { callControlId: string }) {
  try {
    const response = await (telnyxClient.calls as any).record_stop({
      call_control_id: params.callControlId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error stopping recording:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to stop recording",
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
    const response = await (telnyxClient.calls as any).playback_start({
      call_control_id: params.callControlId,
      audio_url: params.audioUrl,
      loop: params.loop,
    });

    return {
      success: true,
      data: response.data,
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
    const response = await (telnyxClient.calls as any).speak({
      call_control_id: params.callControlId,
      payload: params.text,
      voice: params.voice || "female",
      language: params.language || "en-US",
    });

    return {
      success: true,
      data: response.data,
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
    const response = await (telnyxClient.calls as any).transfer({
      call_control_id: params.callControlId,
      to: params.to,
      from: params.from,
    });

    return {
      success: true,
      data: response.data,
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
export async function sendDTMF(params: { callControlId: string; digits: string }) {
  try {
    const response = await (telnyxClient.calls as any).send_dtmf({
      call_control_id: params.callControlId,
      digits: params.digits,
    });

    return {
      success: true,
      data: response.data,
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
    const response = params.audioUrl
      ? await (telnyxClient.calls as any).gather_using_audio({
          call_control_id: params.callControlId,
          audio_url: params.audioUrl,
          valid_digits: params.validDigits,
          max: params.maxDigits,
          min: params.minDigits,
          timeout_millis: params.timeout,
          terminating_digit: params.terminatingDigit || "#",
        })
      : await (telnyxClient.calls as any).gather_using_speak({
          call_control_id: params.callControlId,
          payload: params.speakText || "",
          valid_digits: params.validDigits,
          max: params.maxDigits,
          min: params.minDigits,
          timeout_millis: params.timeout,
          terminating_digit: params.terminatingDigit || "#",
        });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error gathering input:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to gather input",
    };
  }
}
