/**
 * Telnyx Integration - Main Export
 *
 * Central export point for all Telnyx services and utilities.
 * Import from this file to access any Telnyx functionality.
 *
 * @example
 * import { sendSMS, initiateCall, searchAvailableNumbers } from "@/lib/telnyx";
 */

// Client
export { telnyxClient, TELNYX_CONFIG, type TelnyxClient } from "./client";

// Calls
export {
  initiateCall,
  answerCall,
  rejectCall,
  hangupCall,
  startRecording,
  stopRecording,
  playAudio,
  speakText,
  transferCall,
  sendDTMF,
  gatherInput,
  type CallCommand,
  type CallStatus,
} from "./calls";

// Messaging
export {
  sendSMS,
  sendMMS,
  getMessage,
  listMessages,
  sendBulkSMS,
  validatePhoneNumber,
  formatPhoneNumber,
  type MessageType,
  type MessageStatus,
} from "./messaging";

// Phone Numbers
export {
  searchAvailableNumbers,
  purchaseNumber,
  listOwnedNumbers,
  getNumberDetails,
  updateNumber,
  releaseNumber,
  initiatePorting,
  getPortingStatus,
  estimateNumberCost,
  validatePortability,
  type NumberType,
  type NumberFeature,
} from "./numbers";

// Webhooks
export {
  verifyWebhookSignature,
  parseWebhookPayload,
  getEventType,
  isCallEvent,
  isMessageEvent,
  isNumberEvent,
  calculateCallDuration,
  createWebhookResponse,
  isWebhookTimestampValid,
  type WebhookEventType,
  type WebhookPayload,
  type CallInitiatedPayload,
  type CallAnsweredPayload,
  type CallHangupPayload,
  type MessageReceivedPayload,
} from "./webhooks";

// WebRTC
export {
  generateWebRTCToken,
  isCredentialExpired,
  getCredentialTimeToLive,
  formatSIPUri,
  createWebRTCConfig,
  createReactNativeWebRTCConfig,
  createBrowserWebRTCConfig,
  testWebRTCConnectivity,
  type WebRTCConnectionOptions,
  type WebRTCCredential,
  type WebRTCClientConfig,
} from "./webrtc";
