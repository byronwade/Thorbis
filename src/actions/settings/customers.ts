/**
 * Customer Settings Server Actions
 *
 * Handles customer preferences, custom fields, loyalty, privacy, portal, and intake settings
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import { type ActionResult, assertAuthenticated, withErrorHandling } from "@/lib/errors/with-error-handling";
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
// CUSTOMER PREFERENCE SETTINGS
// ============================================================================

const customerPreferenceSchema = z.object({
	defaultContactMethod: z.enum(["email", "sms", "phone", "app"]).default("email"),
	allowMarketingEmails: z.boolean().default(true),
	allowMarketingSms: z.boolean().default(false),
	requestFeedback: z.boolean().default(true),
	feedbackDelayHours: z.coerce.number().default(24),
	sendAppointmentReminders: z.boolean().default(true),
	reminderHoursBefore: z.coerce.number().default(24),
	requireServiceAddress: z.boolean().default(true),
	autoTagCustomers: z.boolean().default(false),
});

export async function updateCustomerPreferences(formData: FormData): Promise<ActionResult<void>> {
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

		const data = customerPreferenceSchema.parse({
			defaultContactMethod: formData.get("defaultContactMethod") || "email",
			allowMarketingEmails: formData.get("allowMarketingEmails") !== "false",
			allowMarketingSms: formData.get("allowMarketingSms") === "true",
			requestFeedback: formData.get("requestFeedback") !== "false",
			feedbackDelayHours: formData.get("feedbackDelayHours") || "24",
			sendAppointmentReminders: formData.get("sendAppointmentReminders") !== "false",
			reminderHoursBefore: formData.get("reminderHoursBefore") || "24",
			requireServiceAddress: formData.get("requireServiceAddress") !== "false",
			autoTagCustomers: formData.get("autoTagCustomers") === "true",
		});

		const { error } = await supabase.from("customer_preference_settings").upsert({
			company_id: companyId,
			default_contact_method: data.defaultContactMethod,
			allow_marketing_emails: data.allowMarketingEmails,
			allow_marketing_sms: data.allowMarketingSms,
			request_feedback: data.requestFeedback,
			feedback_delay_hours: data.feedbackDelayHours,
			send_appointment_reminders: data.sendAppointmentReminders,
			reminder_hours_before: data.reminderHoursBefore,
			require_service_address: data.requireServiceAddress,
			auto_tag_customers: data.autoTagCustomers,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update customer preferences"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customers/preferences");
	});
}

export async function getCustomerPreferences(): Promise<ActionResult<any>> {
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
			.from("customer_preference_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch customer preferences"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// CUSTOM FIELDS
// ============================================================================

const customFieldSchema = z.object({
	fieldName: z.string().min(1, "Field name is required"),
	fieldKey: z.string().min(1, "Field key is required"),
	fieldType: z.enum(["text", "number", "date", "boolean", "select", "multi_select", "textarea"]),
	fieldOptions: z.string().optional(), // JSON string
	isRequired: z.boolean().default(false),
	showInList: z.boolean().default(false),
	displayOrder: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
});

export async function createCustomField(formData: FormData): Promise<ActionResult<string>> {
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

		const data = customFieldSchema.parse({
			fieldName: formData.get("fieldName"),
			fieldKey: formData.get("fieldKey"),
			fieldType: formData.get("fieldType"),
			fieldOptions: formData.get("fieldOptions") || undefined,
			isRequired: formData.get("isRequired") === "true",
			showInList: formData.get("showInList") === "true",
			displayOrder: formData.get("displayOrder") || "0",
			isActive: formData.get("isActive") !== "false",
		});

		// Parse field options if provided
		let fieldOptionsJson = null;
		if (data.fieldOptions) {
			try {
				fieldOptionsJson = JSON.parse(data.fieldOptions);
			} catch (_e) {
    console.error("Error:", _e);
				throw new ActionError("Invalid field options JSON", ERROR_CODES.VALIDATION_FAILED);
			}
		}

		const { data: newField, error } = await supabase
			.from("customer_custom_fields")
			.insert({
				company_id: companyId,
				field_name: data.fieldName,
				field_key: data.fieldKey,
				field_type: data.fieldType,
				field_options: fieldOptionsJson,
				is_required: data.isRequired,
				show_in_list: data.showInList,
				display_order: data.displayOrder,
				is_active: data.isActive,
			})
			.select("id")
			.single();

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("create custom field"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customers/custom-fields");
		return newField.id;
	});
}

export async function updateCustomField(fieldId: string, formData: FormData): Promise<ActionResult<void>> {
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

		const data = customFieldSchema.parse({
			fieldName: formData.get("fieldName"),
			fieldKey: formData.get("fieldKey"),
			fieldType: formData.get("fieldType"),
			fieldOptions: formData.get("fieldOptions") || undefined,
			isRequired: formData.get("isRequired") === "true",
			showInList: formData.get("showInList") === "true",
			displayOrder: formData.get("displayOrder") || "0",
			isActive: formData.get("isActive") !== "false",
		});

		let fieldOptionsJson = null;
		if (data.fieldOptions) {
			try {
				fieldOptionsJson = JSON.parse(data.fieldOptions);
			} catch (_e) {
    console.error("Error:", _e);
				throw new ActionError("Invalid field options JSON", ERROR_CODES.VALIDATION_FAILED);
			}
		}

		const { error } = await supabase
			.from("customer_custom_fields")
			.update({
				field_name: data.fieldName,
				field_key: data.fieldKey,
				field_type: data.fieldType,
				field_options: fieldOptionsJson,
				is_required: data.isRequired,
				show_in_list: data.showInList,
				display_order: data.displayOrder,
				is_active: data.isActive,
			})
			.eq("id", fieldId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update custom field"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customers/custom-fields");
	});
}

export async function deleteCustomField(fieldId: string): Promise<ActionResult<void>> {
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

		const { error } = await supabase
			.from("customer_custom_fields")
			.delete()
			.eq("id", fieldId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete custom field"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customers/custom-fields");
	});
}

export async function getCustomFields(): Promise<ActionResult<any[]>> {
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
			.from("customer_custom_fields")
			.select("*")
			.eq("company_id", companyId)
			.order("display_order", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch custom fields"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || [];
	});
}

// ============================================================================
// LOYALTY PROGRAM SETTINGS
// ============================================================================

const loyaltySettingsSchema = z.object({
	loyaltyEnabled: z.boolean().default(false),
	programName: z.string().default("Loyalty Rewards"),
	pointsPerDollarSpent: z.coerce.number().default(1.0),
	pointsPerReferral: z.coerce.number().default(100),
	pointsExpiryDays: z.coerce.number().optional(),
	rewardTiers: z.string().optional(), // JSON string
	autoApplyRewards: z.boolean().default(false),
	notifyOnPointsEarned: z.boolean().default(true),
});

export async function updateLoyaltySettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = loyaltySettingsSchema.parse({
			loyaltyEnabled: formData.get("loyaltyEnabled") === "true",
			programName: formData.get("programName") || "Loyalty Rewards",
			pointsPerDollarSpent: formData.get("pointsPerDollarSpent") || "1.0",
			pointsPerReferral: formData.get("pointsPerReferral") || "100",
			pointsExpiryDays: formData.get("pointsExpiryDays") || undefined,
			rewardTiers: formData.get("rewardTiers") || undefined,
			autoApplyRewards: formData.get("autoApplyRewards") === "true",
			notifyOnPointsEarned: formData.get("notifyOnPointsEarned") !== "false",
		});

		let rewardTiersJson = [];
		if (data.rewardTiers) {
			try {
				rewardTiersJson = JSON.parse(data.rewardTiers);
			} catch (_e) {
    console.error("Error:", _e);
				throw new ActionError("Invalid reward tiers JSON", ERROR_CODES.VALIDATION_FAILED);
			}
		}

		const { error } = await supabase.from("customer_loyalty_settings").upsert({
			company_id: companyId,
			loyalty_enabled: data.loyaltyEnabled,
			program_name: data.programName,
			points_per_dollar_spent: data.pointsPerDollarSpent,
			points_per_referral: data.pointsPerReferral,
			points_expiry_days: data.pointsExpiryDays,
			reward_tiers: rewardTiersJson,
			auto_apply_rewards: data.autoApplyRewards,
			notify_on_points_earned: data.notifyOnPointsEarned,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update loyalty settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customers/loyalty");
	});
}

export async function getLoyaltySettings(): Promise<ActionResult<any>> {
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
			.from("customer_loyalty_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch loyalty settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// PRIVACY SETTINGS
// ============================================================================

const privacySettingsSchema = z.object({
	dataRetentionYears: z.coerce.number().default(7),
	autoDeleteInactiveCustomers: z.boolean().default(false),
	inactiveThresholdYears: z.coerce.number().default(3),
	requireMarketingConsent: z.boolean().default(true),
	requireDataProcessingConsent: z.boolean().default(true),
	privacyPolicyUrl: z.string().url().optional().or(z.literal("")),
	termsOfServiceUrl: z.string().url().optional().or(z.literal("")),
	enableRightToDeletion: z.boolean().default(true),
	enableDataExport: z.boolean().default(true),
});

export async function updatePrivacySettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = privacySettingsSchema.parse({
			dataRetentionYears: formData.get("dataRetentionYears") || "7",
			autoDeleteInactiveCustomers: formData.get("autoDeleteInactiveCustomers") === "true",
			inactiveThresholdYears: formData.get("inactiveThresholdYears") || "3",
			requireMarketingConsent: formData.get("requireMarketingConsent") !== "false",
			requireDataProcessingConsent: formData.get("requireDataProcessingConsent") !== "false",
			privacyPolicyUrl: formData.get("privacyPolicyUrl") || undefined,
			termsOfServiceUrl: formData.get("termsOfServiceUrl") || undefined,
			enableRightToDeletion: formData.get("enableRightToDeletion") !== "false",
			enableDataExport: formData.get("enableDataExport") !== "false",
		});

		const { error } = await supabase.from("customer_privacy_settings").upsert({
			company_id: companyId,
			data_retention_years: data.dataRetentionYears,
			auto_delete_inactive_customers: data.autoDeleteInactiveCustomers,
			inactive_threshold_years: data.inactiveThresholdYears,
			require_marketing_consent: data.requireMarketingConsent,
			require_data_processing_consent: data.requireDataProcessingConsent,
			privacy_policy_url: data.privacyPolicyUrl,
			terms_of_service_url: data.termsOfServiceUrl,
			enable_right_to_deletion: data.enableRightToDeletion,
			enable_data_export: data.enableDataExport,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update privacy settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customers/privacy");
	});
}

export async function getPrivacySettings(): Promise<ActionResult<any>> {
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
			.from("customer_privacy_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch privacy settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// CUSTOMER PORTAL SETTINGS
// ============================================================================

const portalSettingsSchema = z.object({
	portalEnabled: z.boolean().default(false),
	requireAccountApproval: z.boolean().default(false),
	allowBooking: z.boolean().default(true),
	allowInvoicePayment: z.boolean().default(true),
	allowEstimateApproval: z.boolean().default(true),
	showServiceHistory: z.boolean().default(true),
	showInvoices: z.boolean().default(true),
	showEstimates: z.boolean().default(true),
	allowMessaging: z.boolean().default(true),
	portalLogoUrl: z.string().optional(),
	primaryColor: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.default("#3b82f6"),
	welcomeMessage: z.string().optional(),
	notifyOnNewInvoice: z.boolean().default(true),
	notifyOnNewEstimate: z.boolean().default(true),
	notifyOnAppointment: z.boolean().default(true),
});

export async function updatePortalSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = portalSettingsSchema.parse({
			portalEnabled: formData.get("portalEnabled") === "true",
			requireAccountApproval: formData.get("requireAccountApproval") === "true",
			allowBooking: formData.get("allowBooking") !== "false",
			allowInvoicePayment: formData.get("allowInvoicePayment") !== "false",
			allowEstimateApproval: formData.get("allowEstimateApproval") !== "false",
			showServiceHistory: formData.get("showServiceHistory") !== "false",
			showInvoices: formData.get("showInvoices") !== "false",
			showEstimates: formData.get("showEstimates") !== "false",
			allowMessaging: formData.get("allowMessaging") !== "false",
			portalLogoUrl: formData.get("portalLogoUrl") || undefined,
			primaryColor: formData.get("primaryColor") || "#3b82f6",
			welcomeMessage: formData.get("welcomeMessage") || undefined,
			notifyOnNewInvoice: formData.get("notifyOnNewInvoice") !== "false",
			notifyOnNewEstimate: formData.get("notifyOnNewEstimate") !== "false",
			notifyOnAppointment: formData.get("notifyOnAppointment") !== "false",
		});

		const { error } = await supabase.from("customer_portal_settings").upsert({
			company_id: companyId,
			portal_enabled: data.portalEnabled,
			require_account_approval: data.requireAccountApproval,
			allow_booking: data.allowBooking,
			allow_invoice_payment: data.allowInvoicePayment,
			allow_estimate_approval: data.allowEstimateApproval,
			show_service_history: data.showServiceHistory,
			show_invoices: data.showInvoices,
			show_estimates: data.showEstimates,
			allow_messaging: data.allowMessaging,
			portal_logo_url: data.portalLogoUrl,
			primary_color: data.primaryColor,
			welcome_message: data.welcomeMessage,
			notify_on_new_invoice: data.notifyOnNewInvoice,
			notify_on_new_estimate: data.notifyOnNewEstimate,
			notify_on_appointment: data.notifyOnAppointment,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update portal settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customer-portal");
	});
}

export async function getPortalSettings(): Promise<ActionResult<any>> {
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
			.from("customer_portal_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch portal settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// CUSTOMER INTAKE SETTINGS
// ============================================================================

const intakeSettingsSchema = z.object({
	requirePhone: z.boolean().default(true),
	requireEmail: z.boolean().default(true),
	requireAddress: z.boolean().default(true),
	requirePropertyType: z.boolean().default(false),
	customQuestions: z.string().optional(), // JSON string
	trackLeadSource: z.boolean().default(true),
	requireLeadSource: z.boolean().default(false),
	autoAssignTechnician: z.boolean().default(false),
	autoCreateJob: z.boolean().default(false),
	sendWelcomeEmail: z.boolean().default(true),
	welcomeEmailTemplateId: z.string().optional(),
});

export async function updateIntakeSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = intakeSettingsSchema.parse({
			requirePhone: formData.get("requirePhone") !== "false",
			requireEmail: formData.get("requireEmail") !== "false",
			requireAddress: formData.get("requireAddress") !== "false",
			requirePropertyType: formData.get("requirePropertyType") === "true",
			customQuestions: formData.get("customQuestions") || undefined,
			trackLeadSource: formData.get("trackLeadSource") !== "false",
			requireLeadSource: formData.get("requireLeadSource") === "true",
			autoAssignTechnician: formData.get("autoAssignTechnician") === "true",
			autoCreateJob: formData.get("autoCreateJob") === "true",
			sendWelcomeEmail: formData.get("sendWelcomeEmail") !== "false",
			welcomeEmailTemplateId: formData.get("welcomeEmailTemplateId") || undefined,
		});

		let customQuestionsJson = [];
		if (data.customQuestions) {
			try {
				customQuestionsJson = JSON.parse(data.customQuestions);
			} catch (_e) {
    console.error("Error:", _e);
				throw new ActionError("Invalid custom questions JSON", ERROR_CODES.VALIDATION_FAILED);
			}
		}

		const { error } = await supabase.from("customer_intake_settings").upsert({
			company_id: companyId,
			require_phone: data.requirePhone,
			require_email: data.requireEmail,
			require_address: data.requireAddress,
			require_property_type: data.requirePropertyType,
			custom_questions: customQuestionsJson,
			track_lead_source: data.trackLeadSource,
			require_lead_source: data.requireLeadSource,
			auto_assign_technician: data.autoAssignTechnician,
			auto_create_job: data.autoCreateJob,
			send_welcome_email: data.sendWelcomeEmail,
			welcome_email_template_id: data.welcomeEmailTemplateId,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update intake settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/customer-intake");
	});
}

export async function getIntakeSettings(): Promise<ActionResult<any>> {
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
			.from("customer_intake_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch intake settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}
