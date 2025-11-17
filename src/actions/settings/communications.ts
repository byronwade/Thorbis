/**
 * Communication Settings Server Actions
 *
 * Handles email, SMS, phone, and notification settings
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCompanyId(supabase: any, userId: string): Promise<string> {
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", userId)
		.eq("status", "active")
		.single();

	if (!teamMember?.company_id) {
		throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
	}

	return teamMember.company_id;
}

// ============================================================================
// EMAIL SETTINGS
// ============================================================================

const emailSettingsSchema = z.object({
	smtpEnabled: z.boolean().default(false),
	smtpHost: z.string().optional(),
	smtpPort: z.coerce.number().optional(),
	smtpUsername: z.string().optional(),
	smtpPassword: z.string().optional(),
	smtpFromEmail: z.string().email().optional().or(z.literal("")),
	smtpFromName: z.string().optional(),
	smtpUseTls: z.boolean().default(true),
	defaultSignature: z.string().optional(),
	autoCcEnabled: z.boolean().default(false),
	autoCcEmail: z.string().email().optional().or(z.literal("")),
	trackOpens: z.boolean().default(true),
	trackClicks: z.boolean().default(true),
	emailLogoUrl: z.string().optional(),
	primaryColor: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.default("#3b82f6"),
});

export async function updateEmailSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = emailSettingsSchema.parse({
			smtpEnabled: formData.get("smtpEnabled") === "true",
			smtpHost: formData.get("smtpHost") || undefined,
			smtpPort: formData.get("smtpPort") || undefined,
			smtpUsername: formData.get("smtpUsername") || undefined,
			smtpPassword: formData.get("smtpPassword") || undefined,
			smtpFromEmail: formData.get("smtpFromEmail") || undefined,
			smtpFromName: formData.get("smtpFromName") || undefined,
			smtpUseTls: formData.get("smtpUseTls") !== "false",
			defaultSignature: formData.get("defaultSignature") || undefined,
			autoCcEnabled: formData.get("autoCcEnabled") === "true",
			autoCcEmail: formData.get("autoCcEmail") || undefined,
			trackOpens: formData.get("trackOpens") !== "false",
			trackClicks: formData.get("trackClicks") !== "false",
			emailLogoUrl: formData.get("emailLogoUrl") || undefined,
			primaryColor: formData.get("primaryColor") || "#3b82f6",
		});

		// Encrypt password if provided (in a real app, use proper encryption)
		const encryptedPassword = data.smtpPassword
			? Buffer.from(data.smtpPassword).toString("base64")
			: null;

		const { error } = await supabase.from("communication_email_settings").upsert({
			company_id: companyId,
			smtp_enabled: data.smtpEnabled,
			smtp_host: data.smtpHost,
			smtp_port: data.smtpPort,
			smtp_username: data.smtpUsername,
			smtp_password_encrypted: encryptedPassword,
			smtp_from_email: data.smtpFromEmail,
			smtp_from_name: data.smtpFromName,
			smtp_use_tls: data.smtpUseTls,
			default_signature: data.defaultSignature,
			auto_cc_enabled: data.autoCcEnabled,
			auto_cc_email: data.autoCcEmail,
			track_opens: data.trackOpens,
			track_clicks: data.trackClicks,
			email_logo_url: data.emailLogoUrl,
			primary_color: data.primaryColor,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update email settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/communications/email");
	});
}

export async function getEmailSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("communication_email_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			// PGRST116 = no rows returned
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch email settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

export async function getEmailInfrastructure(): Promise<
	ActionResult<{
		domain: Record<string, unknown> | null;
		inboundRoute: Record<string, unknown> | null;
	}>
> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const [{ data: domain }, { data: inboundRoute }] = await Promise.all([
			supabase
				.from("communication_email_domains")
				.select("*")
				.eq("company_id", companyId)
				.order("created_at", { ascending: false })
				.maybeSingle(),
			supabase
				.from("communication_email_inbound_routes")
				.select("*")
				.eq("company_id", companyId)
				.maybeSingle(),
		]);

		return {
			domain: domain ?? null,
			inboundRoute: inboundRoute ?? null,
		};
	});
}

// ============================================================================
// SMS SETTINGS
// ============================================================================

const smsSettingsSchema = z.object({
	provider: z.enum(["telnyx", "twilio", "other"]).default("telnyx"),
	providerApiKey: z.string().optional(),
	senderNumber: z.string().optional(),
	autoReplyEnabled: z.boolean().default(false),
	autoReplyMessage: z.string().optional(),
	optOutMessage: z.string().default("Reply STOP to unsubscribe"),
	includeOptOut: z.boolean().default(true),
	consentRequired: z.boolean().default(true),
});

export async function updateSmsSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = smsSettingsSchema.parse({
			provider: formData.get("provider") || "telnyx",
			providerApiKey: formData.get("providerApiKey") || undefined,
			senderNumber: formData.get("senderNumber") || undefined,
			autoReplyEnabled: formData.get("autoReplyEnabled") === "true",
			autoReplyMessage: formData.get("autoReplyMessage") || undefined,
			optOutMessage: formData.get("optOutMessage") || "Reply STOP to unsubscribe",
			includeOptOut: formData.get("includeOptOut") !== "false",
			consentRequired: formData.get("consentRequired") !== "false",
		});

		// Encrypt API key if provided
		const encryptedApiKey = data.providerApiKey
			? Buffer.from(data.providerApiKey).toString("base64")
			: null;

		const { error } = await supabase.from("communication_sms_settings").upsert({
			company_id: companyId,
			provider: data.provider,
			provider_api_key_encrypted: encryptedApiKey,
			sender_number: data.senderNumber,
			auto_reply_enabled: data.autoReplyEnabled,
			auto_reply_message: data.autoReplyMessage,
			opt_out_message: data.optOutMessage,
			include_opt_out: data.includeOptOut,
			consent_required: data.consentRequired,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update SMS settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/communications/sms");
	});
}

export async function getSmsSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("communication_sms_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch SMS settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// PHONE SETTINGS
// ============================================================================

const phoneSettingsSchema = z.object({
	routingStrategy: z
		.enum(["round_robin", "skills_based", "priority", "simultaneous"])
		.default("round_robin"),
	fallbackNumber: z.string().optional(),
	businessHoursOnly: z.boolean().default(false),
	voicemailEnabled: z.boolean().default(true),
	voicemailGreetingUrl: z.string().optional(),
	voicemailEmailNotifications: z.boolean().default(true),
	voicemailTranscriptionEnabled: z.boolean().default(false),
	recordingEnabled: z.boolean().default(false),
	recordingAnnouncement: z.string().default("This call may be recorded for quality assurance"),
	recordingConsentRequired: z.boolean().default(true),
	ivrEnabled: z.boolean().default(false),
	ivrMenu: z.string().optional(),
});

export async function updatePhoneSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const ivrMenuStr = formData.get("ivrMenu") as string;
		let ivrMenuJson = {};
		if (ivrMenuStr) {
			try {
				ivrMenuJson = JSON.parse(ivrMenuStr);
			} catch (_e) {
				// Invalid JSON, use empty object
			}
		}

		const data = phoneSettingsSchema.parse({
			routingStrategy: formData.get("routingStrategy") || "round_robin",
			fallbackNumber: formData.get("fallbackNumber") || undefined,
			businessHoursOnly: formData.get("businessHoursOnly") === "true",
			voicemailEnabled: formData.get("voicemailEnabled") !== "false",
			voicemailGreetingUrl: formData.get("voicemailGreetingUrl") || undefined,
			voicemailEmailNotifications: formData.get("voicemailEmailNotifications") !== "false",
			voicemailTranscriptionEnabled: formData.get("voicemailTranscriptionEnabled") === "true",
			recordingEnabled: formData.get("recordingEnabled") === "true",
			recordingAnnouncement:
				formData.get("recordingAnnouncement") || "This call may be recorded for quality assurance",
			recordingConsentRequired: formData.get("recordingConsentRequired") !== "false",
			ivrEnabled: formData.get("ivrEnabled") === "true",
			ivrMenu: ivrMenuStr || undefined,
		});

		const { error } = await supabase.from("communication_phone_settings").upsert({
			company_id: companyId,
			routing_strategy: data.routingStrategy,
			fallback_number: data.fallbackNumber,
			business_hours_only: data.businessHoursOnly,
			voicemail_enabled: data.voicemailEnabled,
			voicemail_greeting_url: data.voicemailGreetingUrl,
			voicemail_email_notifications: data.voicemailEmailNotifications,
			voicemail_transcription_enabled: data.voicemailTranscriptionEnabled,
			recording_enabled: data.recordingEnabled,
			recording_announcement: data.recordingAnnouncement,
			recording_consent_required: data.recordingConsentRequired,
			ivr_enabled: data.ivrEnabled,
			ivr_menu: ivrMenuJson,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update phone settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/communications/phone");
	});
}

export async function getPhoneSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("communication_phone_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch phone settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

const notificationSettingsSchema = z.object({
	// Job Notifications
	notifyNewJobs: z.boolean().default(true),
	notifyJobUpdates: z.boolean().default(true),
	notifyJobCompletions: z.boolean().default(true),

	// Customer Notifications
	notifyNewCustomers: z.boolean().default(false),
	notifyCustomerUpdates: z.boolean().default(false),

	// Invoice Notifications
	notifyInvoiceSent: z.boolean().default(true),
	notifyInvoicePaid: z.boolean().default(true),
	notifyInvoiceOverdue: z.boolean().default(true),

	// Estimate Notifications
	notifyEstimateSent: z.boolean().default(true),
	notifyEstimateApproved: z.boolean().default(true),
	notifyEstimateDeclined: z.boolean().default(false),

	// Schedule Notifications
	notifyScheduleChanges: z.boolean().default(true),
	notifyTechnicianAssigned: z.boolean().default(true),

	// Communication Channels
	emailNotifications: z.boolean().default(true),
	smsNotifications: z.boolean().default(false),
	pushNotifications: z.boolean().default(true),
	inAppNotifications: z.boolean().default(true),
});

export async function updateNotificationSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = notificationSettingsSchema.parse({
			notifyNewJobs: formData.get("notifyNewJobs") !== "false",
			notifyJobUpdates: formData.get("notifyJobUpdates") !== "false",
			notifyJobCompletions: formData.get("notifyJobCompletions") !== "false",
			notifyNewCustomers: formData.get("notifyNewCustomers") === "true",
			notifyCustomerUpdates: formData.get("notifyCustomerUpdates") === "true",
			notifyInvoiceSent: formData.get("notifyInvoiceSent") !== "false",
			notifyInvoicePaid: formData.get("notifyInvoicePaid") !== "false",
			notifyInvoiceOverdue: formData.get("notifyInvoiceOverdue") !== "false",
			notifyEstimateSent: formData.get("notifyEstimateSent") !== "false",
			notifyEstimateApproved: formData.get("notifyEstimateApproved") !== "false",
			notifyEstimateDeclined: formData.get("notifyEstimateDeclined") === "true",
			notifyScheduleChanges: formData.get("notifyScheduleChanges") !== "false",
			notifyTechnicianAssigned: formData.get("notifyTechnicianAssigned") !== "false",
			emailNotifications: formData.get("emailNotifications") !== "false",
			smsNotifications: formData.get("smsNotifications") === "true",
			pushNotifications: formData.get("pushNotifications") !== "false",
			inAppNotifications: formData.get("inAppNotifications") !== "false",
		});

		const { error } = await supabase.from("communication_notification_settings").upsert({
			company_id: companyId,
			notify_new_jobs: data.notifyNewJobs,
			notify_job_updates: data.notifyJobUpdates,
			notify_job_completions: data.notifyJobCompletions,
			notify_new_customers: data.notifyNewCustomers,
			notify_customer_updates: data.notifyCustomerUpdates,
			notify_invoice_sent: data.notifyInvoiceSent,
			notify_invoice_paid: data.notifyInvoicePaid,
			notify_invoice_overdue: data.notifyInvoiceOverdue,
			notify_estimate_sent: data.notifyEstimateSent,
			notify_estimate_approved: data.notifyEstimateApproved,
			notify_estimate_declined: data.notifyEstimateDeclined,
			notify_schedule_changes: data.notifyScheduleChanges,
			notify_technician_assigned: data.notifyTechnicianAssigned,
			email_notifications: data.emailNotifications,
			sms_notifications: data.smsNotifications,
			push_notifications: data.pushNotifications,
			in_app_notifications: data.inAppNotifications,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update notification settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/communications/notifications");
	});
}

export async function getNotificationSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("communication_notification_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch notification settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}
