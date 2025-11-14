/**
 * Telnyx Server Actions
 *
 * Server-side actions for Telnyx VoIP operations:
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
import { createClient } from "@/lib/supabase/server";
import { ensureMessagingCampaign } from "./messaging-branding";
import {
  answerCall,
  hangupCall,
  initiateCall,
  rejectCall,
  startRecording,
  stopRecording,
} from "@/lib/telnyx/calls";
import { TELNYX_CONFIG } from "@/lib/telnyx/client";
import { formatPhoneNumber, sendMMS, sendSMS } from "@/lib/telnyx/messaging";
import {
  type NumberFeature,
  type NumberType,
  purchaseNumber,
  releaseNumber,
  searchAvailableNumbers,
} from "@/lib/telnyx/numbers";
import type { Database, Json } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;

function normalizePhoneNumber(phoneNumber: string): string {
  return formatPhoneNumber(phoneNumber);
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
const DEFAULT_MESSAGING_PROFILE_ID =
  process.env.TELNYX_DEFAULT_MESSAGING_PROFILE_ID ||
  process.env.NEXT_PUBLIC_TELNYX_MESSAGING_PROFILE_ID ||
  "";
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phoneNumber;
}

async function getPhoneNumberId(
  supabase: TypedSupabaseClient,
  phoneNumber: string
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

async function mergeProviderMetadata(
  supabase: TypedSupabaseClient,
  communicationId: string,
  patch: Record<string, Json>
): Promise<void> {
  const { data } = await supabase
    .from("communications")
    .select("provider_metadata")
    .eq("id", communicationId)
    .maybeSingle();

  const currentMetadata =
    (data?.provider_metadata as Record<string, Json> | null) ?? {};
  const mergedMetadata: Record<string, Json> = {
    ...currentMetadata,
    ...patch,
  };

  await supabase
    .from("communications")
    .update({
      provider_metadata: mergedMetadata,
    })
    .eq("id", communicationId);
}

// =====================================================================================
// PHONE NUMBER MANAGEMENT ACTIONS
// =====================================================================================

/**
 * Search for available phone numbers to purchase
 */
export async function searchPhoneNumbers(params: {
  areaCode?: string;
  numberType?: NumberType;
  features?: NumberFeature[];
  limit?: number;
}) {
  try {
    const result = await searchAvailableNumbers({
      countryCode: "US",
      areaCode: params.areaCode,
      numberType: params.numberType,
      features: params.features,
      limit: params.limit || 10,
    });

    return result;
  } catch (error) {
    console.error("Error searching phone numbers:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to search phone numbers",
    };
  }
}

/**
 * Purchase a phone number and associate it with the current company
 */
export async function purchasePhoneNumber(params: {
  phoneNumber: string;
  companyId: string;
  billingGroupId?: string;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const normalizedPhoneNumber = normalizePhoneNumber(params.phoneNumber);
    const formattedNumber = formatDisplayPhoneNumber(normalizedPhoneNumber);
    const areaCode = extractAreaCode(normalizedPhoneNumber);

    // Purchase number from Telnyx
    const messagingProfileId =
      DEFAULT_MESSAGING_PROFILE_ID || undefined;

    const result = await purchaseNumber({
      phoneNumber: normalizedPhoneNumber,
      connectionId: TELNYX_CONFIG.connectionId,
      messagingProfileId,
      billingGroupId: params.billingGroupId,
      customerReference: `company_${params.companyId}`,
    });

    if (!result.success) {
      return result;
    }

    // Store in database
    const { data, error } = await supabase
      .from("phone_numbers")
      .insert({
        company_id: params.companyId,
        telnyx_phone_number_id: result.orderId,
        telnyx_connection_id: TELNYX_CONFIG.connectionId,
        phone_number: normalizedPhoneNumber,
        formatted_number: formattedNumber,
        country_code: "US",
        area_code: areaCode,
        number_type: "local",
        features: ["voice", "sms"],
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/phone-numbers");

    try {
      await ensureMessagingCampaign(
        params.companyId,
        { id: data.id, e164: normalizedPhoneNumber },
        { supabase }
      );
    } catch (campaignError) {
      console.error(
        "Failed to ensure messaging campaign for phone number:",
        campaignError
      );
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error purchasing phone number:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to purchase phone number",
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

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error getting company phone numbers:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get phone numbers",
    };
  }
}

/**
 * Update phone number configuration
 */
export async function updatePhoneNumber(params: {
  phoneNumberId: string;
  routingRuleId?: string;
  forwardToNumber?: string;
  voicemailEnabled?: boolean;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const { data, error } = await supabase
      .from("phone_numbers")
      .update({
        call_routing_rule_id: params.routingRuleId,
        forward_to_number: params.forwardToNumber,
        voicemail_enabled: params.voicemailEnabled,
      })
      .eq("id", params.phoneNumberId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/phone-numbers");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating phone number:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update phone number",
    };
  }
}

/**
 * Release (delete) a phone number
 */
export async function deletePhoneNumber(phoneNumberId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    // Get phone number details
    const { data: phoneNumber } = await supabase
      .from("phone_numbers")
      .select("*")
      .eq("id", phoneNumberId)
      .single();

    if (!phoneNumber) {
      return { success: false, error: "Phone number not found" };
    }

    // Release from Telnyx if we have the ID
    if (phoneNumber.telnyx_phone_number_id) {
      await releaseNumber(phoneNumber.telnyx_phone_number_id);
    }

    // Soft delete in database
    const { error } = await supabase
      .from("phone_numbers")
      .update({
        deleted_at: new Date().toISOString(),
        status: "deleted",
      })
      .eq("id", phoneNumberId);

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/phone-numbers");

    return { success: true };
  } catch (error) {
    console.error("Error deleting phone number:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete phone number",
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
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const fromAddress = normalizePhoneNumber(params.from);
    const toAddress = normalizePhoneNumber(params.to);

    // Initiate call via Telnyx
    const result = await initiateCall({
      to: toAddress,
      from: fromAddress,
      connectionId: TELNYX_CONFIG.connectionId,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/telnyx`,
      answeringMachineDetection: "premium",
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
        type: "phone",
        channel: "telnyx",
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
        telnyx_call_control_id: result.callControlId,
        telnyx_call_session_id: result.callSessionId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      callControlId: result.callControlId,
      data,
    };
  } catch (error) {
    console.error("Error making call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to make call",
    };
  }
}

/**
 * Answer an incoming call
 */
export async function acceptCall(callControlId: string) {
  try {
    const result = await answerCall({
      callControlId,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/telnyx`,
    });

    return result;
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
export async function declineCall(callControlId: string) {
  try {
    const result = await rejectCall({
      callControlId,
      cause: "CALL_REJECTED",
    });

    return result;
  } catch (error) {
    console.error("Error rejecting call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject call",
    };
  }
}

/**
 * End an active call
 */
export async function endCall(callControlId: string) {
  try {
    const result = await hangupCall({ callControlId });

    return result;
  } catch (error) {
    console.error("Error ending call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to end call",
    };
  }
}

/**
 * Start recording a call
 */
export async function startCallRecording(callControlId: string) {
  try {
    const result = await startRecording({
      callControlId,
      format: "mp3",
      channels: "single",
    });

    return result;
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
 * Stop recording a call
 */
export async function stopCallRecording(callControlId: string) {
  try {
    const result = await stopRecording({ callControlId });

    return result;
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
 * Transfer an active call to another number
 */
export async function transferActiveCall(params: {
  callControlId: string;
  to: string;
  from: string;
}) {
  try {
    const { transferCall } = await import("@/lib/telnyx/calls");
    const result = await transferCall({
      callControlId: params.callControlId,
      to: params.to,
      from: params.from,
    });

    return result;
  } catch (error) {
    console.error("Error transferring call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to transfer call",
    };
  }
}

/**
 * Transcribe a call recording using AssemblyAI
 *
 * Submits the recording URL to AssemblyAI for post-call transcription.
 * AssemblyAI will process the audio and send the transcript via webhook.
 *
 * @param recordingUrl - URL of the call recording (from Telnyx)
 * @param communicationId - Database ID of the communication record
 * @returns Success/error response with transcription job ID
 */
export async function transcribeCallRecording(params: {
  recordingUrl: string;
  communicationId: string;
}) {
  try {
    const { submitTranscription } = await import("@/lib/assemblyai/client");
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    // Get base URL for webhook
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000";

    const webhookUrl = `${baseUrl}/api/webhooks/assemblyai`;

    console.log(
      `📝 Submitting call recording for transcription: ${params.recordingUrl}`
    );

    // Submit to AssemblyAI
    const result = await submitTranscription({
      audio_url: params.recordingUrl,
      speaker_labels: true, // Enable speaker diarization
      webhook_url: webhookUrl,
    });

    if (!(result.success && result.data)) {
      console.error("❌ Failed to submit transcription:", result.error);
      return {
        success: false,
        error: result.error || "Failed to submit transcription",
      };
    }

    // Store transcription job ID in database
    await mergeProviderMetadata(supabase, params.communicationId, {
      assemblyai_transcription_id: result.data.id,
      assemblyai_status: result.data.status,
    });

    console.log(
      `✅ Transcription job submitted: ${result.data.id}, status: ${result.data.status}`
    );

    return {
      success: true,
      transcriptionId: result.data.id,
      status: result.data.status,
    };
  } catch (error) {
    console.error("Error submitting transcription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to transcribe recording",
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
  from: string;
  text: string;
  companyId: string;
  customerId?: string;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const fromAddress = normalizePhoneNumber(params.from);
    const toAddress = normalizePhoneNumber(params.to);

    // Send SMS via Telnyx
    const result = await sendSMS({
      to: toAddress,
      from: fromAddress,
      text: params.text,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/telnyx`,
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
        type: "sms",
        channel: "telnyx",
        direction: "outbound",
        from_address: fromAddress,
        to_address: toAddress,
        body: params.text,
        status: "queued",
        priority: "normal",
        phone_number_id: phoneNumberId,
        is_archived: false,
        is_automated: false,
        is_internal: false,
        is_thread_starter: true,
        telnyx_message_id: result.messageId,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/communication");

    return {
      success: true,
      messageId: result.messageId,
      data,
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
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
  from: string;
  text?: string;
  mediaUrls: string[];
  companyId: string;
  customerId?: string;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const fromAddress = normalizePhoneNumber(params.from);
    const toAddress = normalizePhoneNumber(params.to);

    // Send MMS via Telnyx
    const result = await sendMMS({
      to: toAddress,
      from: fromAddress,
      text: params.text,
      mediaUrls: params.mediaUrls,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/telnyx`,
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
        type: "sms",
        channel: "telnyx",
        direction: "outbound",
        from_address: fromAddress,
        to_address: toAddress,
        body: params.text || "",
        attachments: params.mediaUrls.map((url) => ({ url, type: "image" })),
        attachment_count: params.mediaUrls.length,
        status: "queued",
        priority: "normal",
        phone_number_id: phoneNumberId,
        is_archived: false,
        is_automated: false,
        is_internal: false,
        is_thread_starter: true,
        telnyx_message_id: result.messageId,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/communication");

    return {
      success: true,
      messageId: result.messageId,
      data,
    };
  } catch (error) {
    console.error("Error sending MMS:", error);
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
 * Generate WebRTC credentials for browser calling
 */
export async function getWebRTCCredentials() {
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
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Generate WebRTC token
    const { generateWebRTCToken } = await import("@/lib/telnyx/webrtc");
    const result = await generateWebRTCToken({
      username: user.email || user.id,
      ttl: 86_400, // 24 hours
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      credential: result.credential,
    };
  } catch (error) {
    console.error("Error generating WebRTC credentials:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate WebRTC credentials",
    };
  }
}

// =====================================================================================
// VOICEMAIL OPERATIONS ACTIONS
// =====================================================================================

/**
 * Get all voicemails for a company
 */
export async function getVoicemails(companyId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const { data, error } = await supabase
      .from("voicemails")
      .select(`
        *,
        customer:customers(id, first_name, last_name, email, phone),
        phone_number:phone_numbers(phone_number, formatted_number)
      `)
      .eq("company_id", companyId)
      .is("deleted_at", null)
      .order("received_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error getting voicemails:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get voicemails",
    };
  }
}

/**
 * Mark voicemail as read
 */
export async function markVoicemailAsRead(voicemailId: string, userId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const { data, error } = await supabase
      .from("voicemails")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
        read_by: userId,
      })
      .eq("id", voicemailId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/communication");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error marking voicemail as read:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark voicemail as read",
    };
  }
}

/**
 * Delete voicemail
 */
export async function deleteVoicemail(voicemailId: string, userId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const { error } = await supabase
      .from("voicemails")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      })
      .eq("id", voicemailId);

    if (error) throw error;

    revalidatePath("/dashboard/communication");

    return { success: true };
  } catch (error) {
    console.error("Error deleting voicemail:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete voicemail",
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

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error getting call routing rules:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get call routing rules",
    };
  }
}

/**
 * Create a new call routing rule
 */
export async function createCallRoutingRule(params: {
  companyId: string;
  userId: string;
  name: string;
  description?: string;
  routingType:
    | "direct"
    | "round_robin"
    | "ivr"
    | "business_hours"
    | "conditional";
  priority?: number;
  businessHours?: Record<string, unknown>;
  timezone?: string;
  afterHoursAction?: "voicemail" | "forward" | "hangup";
  afterHoursForwardTo?: string;
  teamMembers?: string[];
  ringTimeout?: number;
  ivrMenu?: Record<string, unknown>;
  ivrGreetingUrl?: string;
  forwardToNumber?: string;
  forwardToUserId?: string;
  enableVoicemail?: boolean;
  voicemailGreetingUrl?: string;
  voicemailTranscriptionEnabled?: boolean;
  voicemailEmailNotifications?: boolean;
  recordCalls?: boolean;
}) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const { data, error } = await supabase
      .from("call_routing_rules")
      .insert({
        company_id: params.companyId,
        created_by: params.userId,
        name: params.name,
        description: params.description,
        routing_type: params.routingType,
        priority: params.priority || 0,
        business_hours: params.businessHours,
        timezone: params.timezone || "America/Los_Angeles",
        after_hours_action: params.afterHoursAction,
        after_hours_forward_to: params.afterHoursForwardTo,
        team_members: params.teamMembers,
        ring_timeout: params.ringTimeout || 20,
        ivr_menu: params.ivrMenu,
        ivr_greeting_url: params.ivrGreetingUrl,
        forward_to_number: params.forwardToNumber,
        forward_to_user_id: params.forwardToUserId,
        enable_voicemail: params.enableVoicemail !== false,
        voicemail_greeting_url: params.voicemailGreetingUrl,
        voicemail_transcription_enabled:
          params.voicemailTranscriptionEnabled !== false,
        voicemail_email_notifications:
          params.voicemailEmailNotifications !== false,
        record_calls: params.recordCalls,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/call-routing");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error creating call routing rule:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create call routing rule",
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
  businessHours?: Record<string, unknown>;
  timezone?: string;
  afterHoursAction?: "voicemail" | "forward" | "hangup";
  afterHoursForwardTo?: string;
  teamMembers?: string[];
  ringTimeout?: number;
  ivrMenu?: Record<string, unknown>;
  ivrGreetingUrl?: string;
  forwardToNumber?: string;
  forwardToUserId?: string;
  enableVoicemail?: boolean;
  voicemailGreetingUrl?: string;
  voicemailTranscriptionEnabled?: boolean;
  voicemailEmailNotifications?: boolean;
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
    if (params.description !== undefined)
      updateData.description = params.description;
    if (params.priority !== undefined) updateData.priority = params.priority;
    if (params.businessHours !== undefined)
      updateData.business_hours = params.businessHours;
    if (params.timezone !== undefined) updateData.timezone = params.timezone;
    if (params.afterHoursAction !== undefined)
      updateData.after_hours_action = params.afterHoursAction;
    if (params.afterHoursForwardTo !== undefined)
      updateData.after_hours_forward_to = params.afterHoursForwardTo;
    if (params.teamMembers !== undefined)
      updateData.team_members = params.teamMembers;
    if (params.ringTimeout !== undefined)
      updateData.ring_timeout = params.ringTimeout;
    if (params.ivrMenu !== undefined) updateData.ivr_menu = params.ivrMenu;
    if (params.ivrGreetingUrl !== undefined)
      updateData.ivr_greeting_url = params.ivrGreetingUrl;
    if (params.forwardToNumber !== undefined)
      updateData.forward_to_number = params.forwardToNumber;
    if (params.forwardToUserId !== undefined)
      updateData.forward_to_user_id = params.forwardToUserId;
    if (params.enableVoicemail !== undefined)
      updateData.enable_voicemail = params.enableVoicemail;
    if (params.voicemailGreetingUrl !== undefined)
      updateData.voicemail_greeting_url = params.voicemailGreetingUrl;
    if (params.voicemailTranscriptionEnabled !== undefined)
      updateData.voicemail_transcription_enabled =
        params.voicemailTranscriptionEnabled;
    if (params.voicemailEmailNotifications !== undefined)
      updateData.voicemail_email_notifications =
        params.voicemailEmailNotifications;
    if (params.recordCalls !== undefined)
      updateData.record_calls = params.recordCalls;
    if (params.isActive !== undefined) updateData.is_active = params.isActive;

    const { data, error } = await supabase
      .from("call_routing_rules")
      .update(updateData)
      .eq("id", params.ruleId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/call-routing");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating call routing rule:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update call routing rule",
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

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/call-routing");

    return { success: true };
  } catch (error) {
    console.error("Error deleting call routing rule:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete call routing rule",
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

    if (error) throw error;

    revalidatePath("/dashboard/settings/communications/call-routing");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error toggling call routing rule:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle call routing rule",
    };
  }
}

// =====================================================================================
// PHONE NUMBER USAGE STATISTICS ACTIONS
// =====================================================================================

/**
 * Get usage statistics for a phone number
 */
export async function getPhoneNumberUsageStats(
  phoneNumberId: string,
  days = 30
) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get call statistics
    const { data: callStats, error: callError } = await supabase
      .from("communications")
      .select("type, direction, status, call_duration, created_at")
      .eq("type", "phone")
      .eq("phone_number_id", phoneNumberId)
      .gte("created_at", startDate.toISOString());

    if (callError) throw callError;

    // Get SMS statistics
    const { data: smsStats, error: smsError } = await supabase
      .from("communications")
      .select("type, direction, status, created_at")
      .eq("type", "sms")
      .eq("phone_number_id", phoneNumberId)
      .gte("created_at", startDate.toISOString());

    if (smsError) throw smsError;

    // Calculate aggregates
    const calls = callStats || [];
    const sms = smsStats || [];

    const incomingCalls = calls.filter((c) => c.direction === "inbound").length;
    const outgoingCalls = calls.filter(
      (c) => c.direction === "outbound"
    ).length;
    const totalCallDuration = calls.reduce(
      (sum, c) => sum + (c.call_duration || 0),
      0
    );
    const incomingSms = sms.filter((s) => s.direction === "inbound").length;
    const outgoingSms = sms.filter((s) => s.direction === "outbound").length;

    return {
      success: true,
      data: {
        incomingCalls,
        outgoingCalls,
        totalCalls: incomingCalls + outgoingCalls,
        totalCallDuration,
        incomingSms,
        outgoingSms,
        totalSms: incomingSms + outgoingSms,
        dailyStats: aggregateDailyStats([...calls, ...sms], days),
      },
    };
  } catch (error) {
    console.error("Error getting phone number usage stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get usage statistics",
    };
  }
}

/**
 * Get company-wide usage statistics
 */
export async function getCompanyUsageStats(companyId: string, days = 30) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Service unavailable" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all communications for the company
    const { data: communications, error } = await supabase
      .from("communications")
      .select("type, direction, status, call_duration, created_at")
      .eq("company_id", companyId)
      .in("type", ["phone", "sms"])
      .gte("created_at", startDate.toISOString());

    if (error) throw error;

    const items = communications || [];
    const calls = items.filter((i) => i.type === "phone");
    const sms = items.filter((i) => i.type === "sms");

    const incomingCalls = calls.filter((c) => c.direction === "inbound").length;
    const outgoingCalls = calls.filter(
      (c) => c.direction === "outbound"
    ).length;
    const totalCallDuration = calls.reduce(
      (sum, c) => sum + (c.call_duration || 0),
      0
    );
    const incomingSms = sms.filter((s) => s.direction === "inbound").length;
    const outgoingSms = sms.filter((s) => s.direction === "outbound").length;

    return {
      success: true,
      data: {
        incomingCalls,
        outgoingCalls,
        totalCalls: incomingCalls + outgoingCalls,
        totalCallDuration,
        averageCallDuration:
          calls.length > 0 ? totalCallDuration / calls.length : 0,
        incomingSms,
        outgoingSms,
        totalSms: incomingSms + outgoingSms,
        dailyStats: aggregateDailyStats(items, days),
      },
    };
  } catch (error) {
    console.error("Error getting company usage stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get usage statistics",
    };
  }
}

/**
 * Helper function to aggregate daily statistics
 */
function aggregateDailyStats(
  items: Array<{ created_at: string; type: string; call_duration?: number }>,
  days: number
) {
  const dailyStats: Record<
    string,
    { date: string; calls: number; sms: number; duration: number }
  > = {};

  // Initialize all days
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    dailyStats[dateStr] = { date: dateStr, calls: 0, sms: 0, duration: 0 };
  }

  // Aggregate data
  items.forEach((item) => {
    const dateStr = item.created_at.split("T")[0];
    if (dailyStats[dateStr]) {
      if (item.type === "phone") {
        dailyStats[dateStr].calls += 1;
        dailyStats[dateStr].duration += item.call_duration || 0;
      } else if (item.type === "sms") {
        dailyStats[dateStr].sms += 1;
      }
    }
  });

  return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));
}
