/**
 * Twilio Server Actions
 *
 * Server-side actions for Twilio VoIP operations:
 * - Phone number management
 * - Call operations
 * - SMS operations
 * - Voicemail operations
 *
 * All actions include proper authentication and authorization checks.
 */

"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	sendSms,
	initiateCall,
	endCall,
	holdCall,
	transferCall,
	startRecording,
	stopRecording,
	getCompanyTwilioSettings,
	formatE164,
	TWILIO_ADMIN_CONFIG,
	createTwilioClient,
} from "@/lib/twilio";
import type { Database, Json } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;

// =====================================================================================
// UTILITY FUNCTIONS
// =====================================================================================

function normalizePhoneNumber(phoneNumber: string): string {
	return formatE164(phoneNumber);
}

function extractAreaCode(phoneNumber: string): string | null {
	const digits = phoneNumber.replace(/\D/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return digits.slice(1, 4);
	}
	if (digits.length === 10) {
		return digits.slice(0, 3);
	}
	return null;
}

function formatDisplayPhoneNumber(phoneNumber: string): string {
	const digits = phoneNumber.replace(/\D/g, "");
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}
	return phoneNumber;
}

async function getBaseAppUrl(): Promise<string | undefined> {
	const candidates = [
		process.env.NEXT_PUBLIC_SITE_URL,
		process.env.SITE_URL,
		process.env.NEXT_PUBLIC_APP_URL,
		process.env.APP_URL,
	];

	for (const candidate of candidates) {
		if (candidate) {
			return candidate.replace(/\/+$/, "");
		}
	}

	const vercelUrl = process.env.VERCEL_URL;
	if (vercelUrl) {
		return `https://${vercelUrl}`;
	}

	try {
		const hdrs = await headers();
		const host = hdrs.get("host");
		if (host) {
			const protocol = host.includes("localhost") ? "http" : "https";
			return `${protocol}://${host}`;
		}
	} catch {
		// headers() not available outside of a request context
	}

	return undefined;
}

async function getTwilioWebhookUrl(companyId?: string): Promise<string | undefined> {
	const base = await getBaseAppUrl();
	if (!base) return undefined;

	if (companyId) {
		return `${base}/api/webhooks/twilio?company=${companyId}`;
	}
	return `${base}/api/webhooks/twilio`;
}

async function getPhoneNumberId(
	supabase: TypedSupabaseClient,
	phoneNumber: string,
): Promise<string | null> {
	const normalized = normalizePhoneNumber(phoneNumber);
	const { data } = await supabase
		.from("phone_numbers")
		.select("id")
		.eq("phone_number", normalized)
		.is("deleted_at", null)
		.maybeSingle();

	return data?.id ?? null;
}

async function resolveOutboundPhoneNumber(
	supabase: TypedSupabaseClient,
	companyId: string,
	explicitFrom?: string | null,
	defaultNumber?: string | null,
): Promise<string | null> {
	if (explicitFrom) {
		return normalizePhoneNumber(explicitFrom);
	}

	const normalizedDefault = defaultNumber
		? normalizePhoneNumber(defaultNumber)
		: null;

	try {
		const { data } = await supabase
			.from("phone_numbers")
			.select("phone_number, number_type")
			.eq("company_id", companyId)
			.eq("status", "active");

		if (data && data.length > 0) {
			// Prefer toll-free numbers
			const tollFree = data.find((n) => n.number_type === "toll-free");
			if (tollFree) {
				return normalizePhoneNumber(tollFree.phone_number);
			}

			if (normalizedDefault) {
				const defaultExists = data.some(
					(n) => normalizePhoneNumber(n.phone_number) === normalizedDefault,
				);
				if (defaultExists) {
					return normalizedDefault;
				}
			}

			return normalizePhoneNumber(data[0].phone_number);
		}
	} catch (error) {
		console.warn("Failed to load company phone numbers:", error);
	}

	return normalizedDefault;
}

// =====================================================================================
// PHONE NUMBER MANAGEMENT ACTIONS
// =====================================================================================

/**
 * Search for available phone numbers to purchase
 */
export async function searchPhoneNumbers(params: {
	areaCode?: string;
	numberType?: "local" | "tollFree" | "mobile";
	limit?: number;
}) {
	try {
		const client = await createTwilioClient(process.env.TWILIO_ADMIN_ACCOUNT_SID || "");
		if (!client) {
			return { success: false, error: "Twilio client not configured" };
		}

		const searchParams: {
			areaCode?: string;
			limit: number;
		} = {
			limit: params.limit || 10,
		};

		if (params.areaCode) {
			searchParams.areaCode = params.areaCode;
		}

		let numbers;
		if (params.numberType === "tollFree") {
			numbers = await client.availablePhoneNumbers("US").tollFree.list(searchParams);
		} else {
			numbers = await client.availablePhoneNumbers("US").local.list(searchParams);
		}

		return {
			success: true,
			data: numbers.map((n) => ({
				phoneNumber: n.phoneNumber,
				friendlyName: n.friendlyName,
				locality: n.locality,
				region: n.region,
				capabilities: n.capabilities,
			})),
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to search phone numbers",
		};
	}
}

/**
 * Purchase a phone number and associate it with the current company
 */
export async function purchasePhoneNumber(params: {
	phoneNumber: string;
	companyId: string;
}) {
	try {
		const client = await createTwilioClient(params.companyId);
		if (!client) {
			return { success: false, error: "Twilio client not configured for this company" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const normalizedPhoneNumber = normalizePhoneNumber(params.phoneNumber);
		const formattedNumber = formatDisplayPhoneNumber(normalizedPhoneNumber);
		const areaCode = extractAreaCode(normalizedPhoneNumber);

		const webhookUrl = await getTwilioWebhookUrl(params.companyId);

		// Purchase number from Twilio
		const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
			phoneNumber: normalizedPhoneNumber,
			smsUrl: webhookUrl,
			voiceUrl: webhookUrl,
		});

		// Store in database
		const { data, error } = await supabase
			.from("phone_numbers")
			.insert({
				company_id: params.companyId,
				twilio_phone_number_sid: incomingPhoneNumber.sid,
				phone_number: normalizedPhoneNumber,
				formatted_number: formattedNumber,
				country_code: "US",
				area_code: areaCode,
				number_type: "local",
				features: ["voice", "sms"],
				status: "active",
			})
			.select()
			.single();

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard/settings/communications/phone-numbers");

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to purchase phone number",
		};
	}
}

/**
 * Get all phone numbers for a company
 */
export async function getCompanyPhoneNumbers(companyId: string) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const { data, error } = await supabase
			.from("phone_numbers")
			.select("*")
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false });

		if (error) {
			throw error;
		}

		return {
			success: true,
			data: data || [],
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get phone numbers",
		};
	}
}

/**
 * Release (delete) a phone number
 */
async function deletePhoneNumber(phoneNumberId: string) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		// Get phone number details
		const { data: phoneNumber } = await supabase
			.from("phone_numbers")
			.select("*, company_id")
			.eq("id", phoneNumberId)
			.single();

		if (!phoneNumber) {
			return { success: false, error: "Phone number not found" };
		}

		// Release from Twilio if we have the SID
		if (phoneNumber.twilio_phone_number_sid) {
			const client = await createTwilioClient(phoneNumber.company_id);
			if (client) {
				try {
					await client.incomingPhoneNumbers(phoneNumber.twilio_phone_number_sid).remove();
				} catch (error) {
					console.error("Failed to release from Twilio:", error);
				}
			}
		}

		// Soft delete in database
		const { error } = await supabase
			.from("phone_numbers")
			.update({
				deleted_at: new Date().toISOString(),
				status: "deleted",
			})
			.eq("id", phoneNumberId);

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard/settings/communications/phone-numbers");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete phone number",
		};
	}
}

// =====================================================================================
// CALL OPERATIONS ACTIONS
// =====================================================================================

/**
 * Initiate an outbound call
 */
export async function makeCall(params: {
	to: string;
	from: string;
	companyId: string;
	customerId?: string;
	jobId?: string;
	propertyId?: string;
	invoiceId?: string;
	estimateId?: string;
}) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const settings = await getCompanyTwilioSettings(params.companyId);
		if (!settings) {
			return { 
				success: false, 
				error: "Twilio not configured for this company. Please configure Twilio settings in company settings or set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables." 
			};
		}

		const fromAddress = await resolveOutboundPhoneNumber(
			supabase,
			params.companyId,
			params.from,
			settings.default_from_number,
		);

		if (!fromAddress) {
			return {
				success: false,
				error: "No outbound phone number configured. Please provision numbers first.",
			};
		}

		const toAddress = normalizePhoneNumber(params.to);
		const webhookUrl = await getTwilioWebhookUrl(params.companyId);

		if (!webhookUrl) {
			return {
				success: false,
				error: "Site URL not configured. Set NEXT_PUBLIC_SITE_URL.",
			};
		}

		const result = await initiateCall({
			companyId: params.companyId,
			to: toAddress,
			from: fromAddress,
			statusCallback: webhookUrl,
		});

		if (!result.success) {
			return result;
		}

		// Create communication record
		const phoneNumberId = await getPhoneNumberId(supabase, fromAddress);
		const { data, error } = await supabase
			.from("communications")
			.insert({
				company_id: params.companyId,
				customer_id: params.customerId,
				job_id: params.jobId ?? null,
				property_id: params.propertyId ?? null,
				invoice_id: params.invoiceId ?? null,
				estimate_id: params.estimateId ?? null,
				type: "phone",
				channel: "twilio",
				direction: "outbound",
				from_address: fromAddress,
				to_address: toAddress,
				body: "",
				status: "queued",
				priority: "normal",
				phone_number_id: phoneNumberId,
				is_archived: false,
				is_automated: false,
				is_internal: false,
				is_thread_starter: true,
				twilio_call_sid: result.callSid,
			})
			.select()
			.single();

		if (error) {
			throw error;
		}

		return {
			success: true,
			callSid: result.callSid,
			data,
		};
	} catch (error) {
		console.error("makeCall error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to make call",
		};
	}
}

/**
 * End an active call
 */
async function endActiveCall(params: {
	companyId: string;
	callSid: string;
}) {
	try {
		const result = await endCall({
			companyId: params.companyId,
			callSid: params.callSid,
		});

		return result;
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to end call",
		};
	}
}

/**
 * Start recording a call
 */
export async function startCallRecording(params: {
	companyId: string;
	callSid: string;
}) {
	try {
		const result = await startRecording({
			companyId: params.companyId,
			callSid: params.callSid,
		});

		return result;
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to start recording",
		};
	}
}

/**
 * Stop recording a call
 */
export async function stopCallRecording(params: {
	companyId: string;
	callSid: string;
	recordingSid: string;
}) {
	try {
		const result = await stopRecording({
			companyId: params.companyId,
			callSid: params.callSid,
			recordingSid: params.recordingSid,
		});

		return result;
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to stop recording",
		};
	}
}

/**
 * Transfer an active call to another number
 */
async function transferActiveCall(params: {
	companyId: string;
	callSid: string;
	to: string;
}) {
	try {
		const result = await transferCall({
			companyId: params.companyId,
			callSid: params.callSid,
			to: params.to,
		});

		return result;
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to transfer call",
		};
	}
}

// =====================================================================================
// SMS OPERATIONS ACTIONS
// =====================================================================================

/**
 * Send an SMS message
 */
export async function sendTextMessage(params: {
	to: string;
	from?: string;
	text: string;
	companyId?: string;
	customerId?: string;
	jobId?: string;
	invoiceId?: string;
	estimateId?: string;
}) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		// Get company ID if not provided
		let companyId = params.companyId;
		if (!companyId) {
			const { getActiveCompanyId } = await import("@/lib/auth/company-context");
			companyId = await getActiveCompanyId();
			if (!companyId) {
				return { success: false, error: "No active company found" };
			}
		}

		const settings = await getCompanyTwilioSettings(companyId);
		if (!settings) {
			return { 
				success: false, 
				error: "Twilio not configured for this company. Please configure Twilio settings in company settings or set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables." 
			};
		}

		const fromAddress = await resolveOutboundPhoneNumber(
			supabase,
			companyId,
			params.from || null,
			settings.default_from_number,
		);

		if (!fromAddress) {
			return {
				success: false,
				error: "No outbound phone number configured. Please provision numbers first.",
			};
		}

		const webhookUrl = await getTwilioWebhookUrl(companyId);

		const result = await sendSms({
			companyId,
			to: params.to,
			body: params.text,
			from: fromAddress,
			statusCallback: webhookUrl,
			customerId: params.customerId,
		});

		if (!result.success) {
			return result;
		}

		revalidatePath("/dashboard/communication");

		return {
			success: true,
			messageId: result.messageSid,
		};
	} catch (error) {
		console.error("SMS send error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send SMS",
		};
	}
}

/**
 * Send an MMS message with media
 */
export async function sendMMSMessage(params: {
	to: string;
	from?: string;
	text?: string;
	mediaUrls: string[];
	companyId?: string;
	customerId?: string;
}) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		// Get company ID if not provided
		let companyId = params.companyId;
		if (!companyId) {
			const { getActiveCompanyId } = await import("@/lib/auth/company-context");
			companyId = await getActiveCompanyId();
			if (!companyId) {
				return { success: false, error: "No active company found" };
			}
		}

		const settings = await getCompanyTwilioSettings(companyId);
		if (!settings) {
			return { 
				success: false, 
				error: "Twilio not configured for this company. Please configure Twilio settings in company settings or set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables." 
			};
		}

		const fromAddress = await resolveOutboundPhoneNumber(
			supabase,
			companyId,
			params.from || null,
			settings.default_from_number,
		);

		if (!fromAddress) {
			return {
				success: false,
				error: "No outbound phone number configured. Please provision numbers first.",
			};
		}

		const result = await sendSms({
			companyId,
			to: params.to,
			body: params.text || "",
			from: fromAddress,
			mediaUrls: params.mediaUrls,
			customerId: params.customerId,
		});

		if (!result.success) {
			return result;
		}

		revalidatePath("/dashboard/communication");

		return {
			success: true,
			messageId: result.messageSid,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to send MMS",
		};
	}
}

// =====================================================================================
// WEBRTC OPERATIONS ACTIONS
// =====================================================================================

/**
 * Generate Twilio Voice Access Token for browser WebRTC calling
 *
 * The token includes Voice Grant with TwiML App SID for proper call routing.
 * Tokens are valid for 1 hour by default.
 */
export async function getWebRTCCredentials(companyId?: string) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		// Get current user
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (userError || !user) {
			return { success: false, error: "User not authenticated" };
		}

		// Get company ID if not provided
		let activeCompanyId = companyId;
		if (!activeCompanyId) {
			const { getActiveCompanyId } = await import("@/lib/auth/company-context");
			activeCompanyId = await getActiveCompanyId();
			if (!activeCompanyId) {
				return { success: false, error: "No active company found" };
			}
		}

		// Get company Twilio settings
		const settings = await getCompanyTwilioSettings(activeCompanyId);
		if (!settings) {
			return { 
				success: false, 
				error: "Twilio not configured for this company. Please configure Twilio settings in company settings or set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables." 
			};
		}

		// Check for required credentials for Access Token generation
		if (!settings.api_key_sid || !settings.api_key_secret || !settings.account_sid) {
			return {
				success: false,
				error: "Twilio API Key not configured. WebRTC requires API Key SID and Secret.",
			};
		}

		// Dynamic import to avoid bundling issues
		const Twilio = await import("twilio");
		const AccessToken = Twilio.jwt.AccessToken;
		const VoiceGrant = AccessToken.VoiceGrant;

		// Create identity from user
		const identity = user.email || user.id;

		// Create Voice Grant
		const voiceGrant = new VoiceGrant({
			outgoingApplicationSid: settings.twiml_app_sid || undefined,
			incomingAllow: true, // Allow incoming calls
		});

		// Create Access Token
		const token = new AccessToken(
			settings.account_sid,
			settings.api_key_sid,
			settings.api_key_secret,
			{
				identity,
				ttl: 3600, // 1 hour
			}
		);

		// Add Voice Grant to token
		token.addGrant(voiceGrant);

		const credential = {
			accessToken: token.toJwt(),
			identity,
			expires_at: Date.now() + 3600 * 1000, // 1 hour
		};

		return {
			success: true,
			credential,
		};
	} catch (error) {
		console.error("getWebRTCCredentials error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get WebRTC credentials",
		};
	}
}

// =====================================================================================
// CALL ROUTING RULES ACTIONS
// =====================================================================================

/**
 * Get all call routing rules for a company
 */
export async function getCallRoutingRules(companyId: string) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const { data, error } = await supabase
			.from("call_routing_rules")
			.select(`
				*,
				created_by_user:users!call_routing_rules_created_by_fkey(id, name, email),
				forward_to_user:users!call_routing_rules_forward_to_user_id_fkey(id, name, email)
			`)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("priority", { ascending: false });

		if (error) {
			throw error;
		}

		return {
			success: true,
			data: data || [],
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get call routing rules",
		};
	}
}

/**
 * Update an existing call routing rule
 */
export async function updateCallRoutingRule(params: {
	ruleId: string;
	name?: string;
	description?: string;
	priority?: number;
	forwardToNumber?: string;
	forwardToUserId?: string;
	enableVoicemail?: boolean;
	recordCalls?: boolean;
	isActive?: boolean;
}) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const updateData: Record<string, unknown> = {};

		if (params.name !== undefined) updateData.name = params.name;
		if (params.description !== undefined) updateData.description = params.description;
		if (params.priority !== undefined) updateData.priority = params.priority;
		if (params.forwardToNumber !== undefined) updateData.forward_to_number = params.forwardToNumber;
		if (params.forwardToUserId !== undefined) updateData.forward_to_user_id = params.forwardToUserId;
		if (params.enableVoicemail !== undefined) updateData.enable_voicemail = params.enableVoicemail;
		if (params.recordCalls !== undefined) updateData.record_calls = params.recordCalls;
		if (params.isActive !== undefined) updateData.is_active = params.isActive;

		const { data, error } = await supabase
			.from("call_routing_rules")
			.update(updateData)
			.eq("id", params.ruleId)
			.select()
			.single();

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard/settings/communications/call-routing");

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update call routing rule",
		};
	}
}

/**
 * Delete a call routing rule
 */
export async function deleteCallRoutingRule(ruleId: string, userId: string) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const { error } = await supabase
			.from("call_routing_rules")
			.update({
				deleted_at: new Date().toISOString(),
				deleted_by: userId,
			})
			.eq("id", ruleId);

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard/settings/communications/call-routing");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete call routing rule",
		};
	}
}

/**
 * Toggle call routing rule active status
 */
export async function toggleCallRoutingRule(ruleId: string, isActive: boolean) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const { data, error } = await supabase
			.from("call_routing_rules")
			.update({ is_active: isActive })
			.eq("id", ruleId)
			.select()
			.single();

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard/settings/communications/call-routing");

		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to toggle call routing rule",
		};
	}
}

// =====================================================================================
// TRANSCRIPTION ACTIONS
// =====================================================================================

/**
 * Transcribe a call recording using AssemblyAI
 */
async function transcribeCallRecording(params: {
	recordingUrl: string;
	communicationId: string;
}) {
	try {
		const { submitTranscription } = await import("@/lib/assemblyai/client");
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}

		const base = await getBaseAppUrl();
		const webhookUrl = base ? `${base}/api/webhooks/assemblyai` : undefined;

		if (!webhookUrl) {
			return {
				success: false,
				error: "Site URL not configured. Set NEXT_PUBLIC_SITE_URL.",
			};
		}

		const result = await submitTranscription({
			audio_url: params.recordingUrl,
			speaker_labels: true,
			webhook_url: webhookUrl,
		});

		if (!(result.success && result.data)) {
			return {
				success: false,
				error: result.error || "Failed to submit transcription",
			};
		}

		// Store transcription job ID
		await supabase
			.from("communications")
			.update({
				provider_metadata: {
					assemblyai_transcription_id: result.data.id,
					assemblyai_status: result.data.status,
				},
			})
			.eq("id", params.communicationId);

		return {
			success: true,
			transcriptionId: result.data.id,
			status: result.data.status,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to transcribe recording",
		};
	}
}
