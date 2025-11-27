/**
 * Twilio Service Exports
 *
 * Multi-tenant Twilio integration for voice, SMS, and verification.
 */

// Client
export {
	createTwilioClient,
	createAdminTwilioClient,
	getCompanyTwilioSettings,
	clearTwilioClientCache,
	verifyTwilioWebhookSignature,
	formatE164,
	TWILIO_ADMIN_CONFIG,
	type CompanyTwilioSettings,
} from "./client";

// Messaging (SMS/MMS)
export {
	sendSms,
	getSmsStatus,
	handleIncomingSms,
	updateSmsStatus,
	replySms,
	type SendSmsParams,
	type SendSmsResult,
} from "./messaging";

// Voice/Calls
export {
	initiateCall,
	endCall,
	holdCall,
	transferCall,
	startRecording,
	stopRecording,
	getCallDetails,
	handleIncomingCall,
	updateCallStatus,
	generateConnectTwiML,
	generateHoldTwiML,
	generateTransferTwiML,
	generateVoicemailTwiML,
	type InitiateCallParams,
	type InitiateCallResult,
	type CallControlParams,
} from "./calls";
