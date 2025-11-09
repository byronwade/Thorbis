/**
 * Telnyx Integration - Main Export
 *
 * Central export point for all Telnyx services and utilities.
 * Import from this file to access any Telnyx functionality.
 *
 * @example
 * import { sendSMS, initiateCall, searchAvailableNumbers } from "@/lib/telnyx";
 */

// Calls
export {
  answerCall,
  type CallCommand,
  type CallStatus,
  gatherInput,
  hangupCall,
  initiateCall,
  playAudio,
  rejectCall,
  sendDTMF,
  speakText,
  startRecording,
  stopRecording,
  transferCall,
} from "./calls";
// Client
export { TELNYX_CONFIG, type TelnyxClient, telnyxClient } from "./client";

// Messaging
export {
  formatPhoneNumber,
  getMessage,
  listMessages,
  type MessageStatus,
  type MessageType,
  sendBulkSMS,
  sendMMS,
  sendSMS,
  validatePhoneNumber,
} from "./messaging";

// Phone Numbers
export {
  estimateNumberCost,
  getNumberDetails,
  getPortingStatus,
  initiatePorting,
  listOwnedNumbers,
  type NumberFeature,
  type NumberType,
  purchaseNumber,
  releaseNumber,
  searchAvailableNumbers,
  updateNumber,
  validatePortability,
} from "./numbers";

// Webhooks
export {
  type CallAnsweredPayload,
  type CallHangupPayload,
  type CallInitiatedPayload,
  calculateCallDuration,
  createWebhookResponse,
  getEventType,
  isCallEvent,
  isMessageEvent,
  isNumberEvent,
  isWebhookTimestampValid,
  type MessageReceivedPayload,
  parseWebhookPayload,
  verifyWebhookSignature,
  type WebhookEventType,
  type WebhookPayload,
} from "./webhooks";

// WebRTC
export {
  createBrowserWebRTCConfig,
  createReactNativeWebRTCConfig,
  createWebRTCConfig,
  formatSIPUri,
  generateWebRTCToken,
  getCredentialTimeToLive,
  isCredentialExpired,
  testWebRTCConnectivity,
  type WebRTCClientConfig,
  type WebRTCConnectionOptions,
  type WebRTCCredential,
} from "./webrtc";
