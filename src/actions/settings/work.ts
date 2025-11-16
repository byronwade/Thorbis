// @ts-nocheck
/**
 * Work Settings Server Actions
 *
 * Handles job, estimate, invoice, service plan, and pricebook settings
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
// JOB SETTINGS
// ============================================================================

const jobSettingsSchema = z.object({
	jobNumberPrefix: z.string().default("JOB"),
	jobNumberFormat: z.string().default("{PREFIX}-{YYYY}{MM}{DD}-{XXXX}"),
	nextJobNumber: z.coerce.number().default(1),
	defaultJobStatus: z.string().default("scheduled"),
	defaultPriority: z.string().default("normal"),
	requireCustomerSignature: z.boolean().default(false),
	requirePhotoCompletion: z.boolean().default(false),
	autoInvoiceOnCompletion: z.boolean().default(false),
	autoSendCompletionEmail: z.boolean().default(true),
	trackTechnicianTime: z.boolean().default(true),
	requireArrivalConfirmation: z.boolean().default(false),
	requireCompletionNotes: z.boolean().default(true),
});

export async function updateJobSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = jobSettingsSchema.parse({
			jobNumberPrefix: formData.get("jobNumberPrefix") || "JOB",
			jobNumberFormat: formData.get("jobNumberFormat") || "{PREFIX}-{YYYY}{MM}{DD}-{XXXX}",
			nextJobNumber: formData.get("nextJobNumber") || "1",
			defaultJobStatus: formData.get("defaultJobStatus") || "scheduled",
			defaultPriority: formData.get("defaultPriority") || "normal",
			requireCustomerSignature: formData.get("requireCustomerSignature") === "true",
			requirePhotoCompletion: formData.get("requirePhotoCompletion") === "true",
			autoInvoiceOnCompletion: formData.get("autoInvoiceOnCompletion") === "true",
			autoSendCompletionEmail: formData.get("autoSendCompletionEmail") !== "false",
			trackTechnicianTime: formData.get("trackTechnicianTime") !== "false",
			requireArrivalConfirmation: formData.get("requireArrivalConfirmation") === "true",
			requireCompletionNotes: formData.get("requireCompletionNotes") !== "false",
		});

		const { error } = await supabase.from("job_settings").upsert({
			company_id: companyId,
			job_number_prefix: data.jobNumberPrefix,
			job_number_format: data.jobNumberFormat,
			next_job_number: data.nextJobNumber,
			default_job_status: data.defaultJobStatus,
			default_priority: data.defaultPriority,
			require_customer_signature: data.requireCustomerSignature,
			require_photo_completion: data.requirePhotoCompletion,
			auto_invoice_on_completion: data.autoInvoiceOnCompletion,
			auto_send_completion_email: data.autoSendCompletionEmail,
			track_technician_time: data.trackTechnicianTime,
			require_arrival_confirmation: data.requireArrivalConfirmation,
			require_completion_notes: data.requireCompletionNotes,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update job settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/jobs");
	});
}

export async function getJobSettings(): Promise<ActionResult<any>> {
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

		const { data, error } = await supabase.from("job_settings").select("*").eq("company_id", companyId).single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch job settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// ESTIMATE SETTINGS
// ============================================================================

const estimateSettingsSchema = z.object({
	estimateNumberPrefix: z.string().default("EST"),
	estimateNumberFormat: z.string().default("{PREFIX}-{YYYY}{MM}{DD}-{XXXX}"),
	nextEstimateNumber: z.coerce.number().default(1),
	defaultValidForDays: z.coerce.number().default(30),
	showExpiryDate: z.boolean().default(true),
	includeTermsAndConditions: z.boolean().default(true),
	defaultTerms: z.string().optional(),
	showPaymentTerms: z.boolean().default(true),
	allowDiscounts: z.boolean().default(true),
	showIndividualPrices: z.boolean().default(true),
	showSubtotals: z.boolean().default(true),
	showTaxBreakdown: z.boolean().default(true),
	requireApproval: z.boolean().default(false),
	autoConvertToJob: z.boolean().default(false),
	sendReminderEnabled: z.boolean().default(true),
	reminderDaysBeforeExpiry: z.coerce.number().default(7),
});

export async function updateEstimateSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = estimateSettingsSchema.parse({
			estimateNumberPrefix: formData.get("estimateNumberPrefix") || "EST",
			estimateNumberFormat: formData.get("estimateNumberFormat") || "{PREFIX}-{YYYY}{MM}{DD}-{XXXX}",
			nextEstimateNumber: formData.get("nextEstimateNumber") || "1",
			defaultValidForDays: formData.get("defaultValidForDays") || "30",
			showExpiryDate: formData.get("showExpiryDate") !== "false",
			includeTermsAndConditions: formData.get("includeTermsAndConditions") !== "false",
			defaultTerms: formData.get("defaultTerms") || undefined,
			showPaymentTerms: formData.get("showPaymentTerms") !== "false",
			allowDiscounts: formData.get("allowDiscounts") !== "false",
			showIndividualPrices: formData.get("showIndividualPrices") !== "false",
			showSubtotals: formData.get("showSubtotals") !== "false",
			showTaxBreakdown: formData.get("showTaxBreakdown") !== "false",
			requireApproval: formData.get("requireApproval") === "true",
			autoConvertToJob: formData.get("autoConvertToJob") === "true",
			sendReminderEnabled: formData.get("sendReminderEnabled") !== "false",
			reminderDaysBeforeExpiry: formData.get("reminderDaysBeforeExpiry") || "7",
		});

		const { error } = await supabase.from("estimate_settings").upsert({
			company_id: companyId,
			estimate_number_prefix: data.estimateNumberPrefix,
			estimate_number_format: data.estimateNumberFormat,
			next_estimate_number: data.nextEstimateNumber,
			default_valid_for_days: data.defaultValidForDays,
			show_expiry_date: data.showExpiryDate,
			include_terms_and_conditions: data.includeTermsAndConditions,
			default_terms: data.defaultTerms,
			show_payment_terms: data.showPaymentTerms,
			allow_discounts: data.allowDiscounts,
			show_individual_prices: data.showIndividualPrices,
			show_subtotals: data.showSubtotals,
			show_tax_breakdown: data.showTaxBreakdown,
			require_approval: data.requireApproval,
			auto_convert_to_job: data.autoConvertToJob,
			send_reminder_enabled: data.sendReminderEnabled,
			reminder_days_before_expiry: data.reminderDaysBeforeExpiry,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update estimate settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/estimates");
	});
}

export async function getEstimateSettings(): Promise<ActionResult<any>> {
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

		const { data, error } = await supabase.from("estimate_settings").select("*").eq("company_id", companyId).single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch estimate settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// INVOICE SETTINGS
// ============================================================================

const invoiceSettingsSchema = z.object({
	invoiceNumberPrefix: z.string().default("INV"),
	invoiceNumberFormat: z.string().default("{PREFIX}-{YYYY}{MM}{DD}-{XXXX}"),
	nextInvoiceNumber: z.coerce.number().default(1),
	defaultPaymentTerms: z.coerce.number().default(30),
	paymentTermsOptions: z.string().optional(), // JSON array
	lateFeeEnabled: z.boolean().default(false),
	lateFeeType: z.enum(["percentage", "flat"]).default("percentage"),
	lateFeeAmount: z.coerce.number().default(5.0),
	lateFeeGracePeriodDays: z.coerce.number().default(7),
	includeTermsAndConditions: z.boolean().default(true),
	defaultTerms: z.string().optional(),
	showPaymentInstructions: z.boolean().default(true),
	paymentInstructions: z.string().optional(),
	taxEnabled: z.boolean().default(true),
	defaultTaxRate: z.coerce.number().default(0),
	taxLabel: z.string().default("Sales Tax"),
	sendReminders: z.boolean().default(true),
	reminderSchedule: z.string().optional(), // JSON array
});

export async function updateInvoiceSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = invoiceSettingsSchema.parse({
			invoiceNumberPrefix: formData.get("invoiceNumberPrefix") || "INV",
			invoiceNumberFormat: formData.get("invoiceNumberFormat") || "{PREFIX}-{YYYY}{MM}{DD}-{XXXX}",
			nextInvoiceNumber: formData.get("nextInvoiceNumber") || "1",
			defaultPaymentTerms: formData.get("defaultPaymentTerms") || "30",
			paymentTermsOptions: formData.get("paymentTermsOptions") || undefined,
			lateFeeEnabled: formData.get("lateFeeEnabled") === "true",
			lateFeeType: formData.get("lateFeeType") || "percentage",
			lateFeeAmount: formData.get("lateFeeAmount") || "5.0",
			lateFeeGracePeriodDays: formData.get("lateFeeGracePeriodDays") || "7",
			includeTermsAndConditions: formData.get("includeTermsAndConditions") !== "false",
			defaultTerms: formData.get("defaultTerms") || undefined,
			showPaymentInstructions: formData.get("showPaymentInstructions") !== "false",
			paymentInstructions: formData.get("paymentInstructions") || undefined,
			taxEnabled: formData.get("taxEnabled") !== "false",
			defaultTaxRate: formData.get("defaultTaxRate") || "0",
			taxLabel: formData.get("taxLabel") || "Sales Tax",
			sendReminders: formData.get("sendReminders") !== "false",
			reminderSchedule: formData.get("reminderSchedule") || undefined,
		});

		// Parse JSON arrays
		let paymentTermsOptionsArray = [0, 15, 30, 60, 90];
		if (data.paymentTermsOptions) {
			try {
				paymentTermsOptionsArray = JSON.parse(data.paymentTermsOptions);
			} catch (_e) {
				// Use default
			}
		}

		let reminderScheduleArray = [7, 14, 30];
		if (data.reminderSchedule) {
			try {
				reminderScheduleArray = JSON.parse(data.reminderSchedule);
			} catch (_e) {
				// Use default
			}
		}

		const { error } = await supabase.from("invoice_settings").upsert({
			company_id: companyId,
			invoice_number_prefix: data.invoiceNumberPrefix,
			invoice_number_format: data.invoiceNumberFormat,
			next_invoice_number: data.nextInvoiceNumber,
			default_payment_terms: data.defaultPaymentTerms,
			payment_terms_options: paymentTermsOptionsArray,
			late_fee_enabled: data.lateFeeEnabled,
			late_fee_type: data.lateFeeType,
			late_fee_amount: data.lateFeeAmount,
			late_fee_grace_period_days: data.lateFeeGracePeriodDays,
			include_terms_and_conditions: data.includeTermsAndConditions,
			default_terms: data.defaultTerms,
			show_payment_instructions: data.showPaymentInstructions,
			payment_instructions: data.paymentInstructions,
			tax_enabled: data.taxEnabled,
			default_tax_rate: data.defaultTaxRate,
			tax_label: data.taxLabel,
			send_reminders: data.sendReminders,
			reminder_schedule: reminderScheduleArray,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update invoice settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/invoices");
	});
}

export async function getInvoiceSettings(): Promise<ActionResult<any>> {
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

		const { data, error } = await supabase.from("invoice_settings").select("*").eq("company_id", companyId).single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch invoice settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// SERVICE PLAN SETTINGS
// ============================================================================

const servicePlanSettingsSchema = z.object({
	allowMultiplePlansPerCustomer: z.boolean().default(false),
	requireContractSignature: z.boolean().default(true),
	autoRenewEnabled: z.boolean().default(true),
	renewalNoticeDays: z.coerce.number().default(30),
	autoInvoiceOnRenewal: z.boolean().default(true),
	autoScheduleServices: z.boolean().default(true),
	scheduleAdvanceDays: z.coerce.number().default(7),
	sendReminderBeforeService: z.boolean().default(true),
	reminderDays: z.coerce.number().default(3),
});

export async function updateServicePlanSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = servicePlanSettingsSchema.parse({
			allowMultiplePlansPerCustomer: formData.get("allowMultiplePlansPerCustomer") === "true",
			requireContractSignature: formData.get("requireContractSignature") !== "false",
			autoRenewEnabled: formData.get("autoRenewEnabled") !== "false",
			renewalNoticeDays: formData.get("renewalNoticeDays") || "30",
			autoInvoiceOnRenewal: formData.get("autoInvoiceOnRenewal") !== "false",
			autoScheduleServices: formData.get("autoScheduleServices") !== "false",
			scheduleAdvanceDays: formData.get("scheduleAdvanceDays") || "7",
			sendReminderBeforeService: formData.get("sendReminderBeforeService") !== "false",
			reminderDays: formData.get("reminderDays") || "3",
		});

		const { error } = await supabase.from("service_plan_settings").upsert({
			company_id: companyId,
			allow_multiple_plans_per_customer: data.allowMultiplePlansPerCustomer,
			require_contract_signature: data.requireContractSignature,
			auto_renew_enabled: data.autoRenewEnabled,
			renewal_notice_days: data.renewalNoticeDays,
			auto_invoice_on_renewal: data.autoInvoiceOnRenewal,
			auto_schedule_services: data.autoScheduleServices,
			schedule_advance_days: data.scheduleAdvanceDays,
			send_reminder_before_service: data.sendReminderBeforeService,
			reminder_days: data.reminderDays,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update service plan settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/service-plans");
	});
}

export async function getServicePlanSettings(): Promise<ActionResult<any>> {
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
			.from("service_plan_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch service plan settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// PRICEBOOK SETTINGS
// ============================================================================

const pricebookSettingsSchema = z.object({
	showCostPrices: z.boolean().default(true),
	markupDefaultPercentage: z.coerce.number().default(50.0),
	requireCategories: z.boolean().default(true),
	allowCustomItems: z.boolean().default(true),
	requireApprovalForCustom: z.boolean().default(false),
	showItemCodes: z.boolean().default(true),
	showItemDescriptions: z.boolean().default(true),
});

export async function updatePricebookSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = pricebookSettingsSchema.parse({
			showCostPrices: formData.get("showCostPrices") !== "false",
			markupDefaultPercentage: formData.get("markupDefaultPercentage") || "50.0",
			requireCategories: formData.get("requireCategories") !== "false",
			allowCustomItems: formData.get("allowCustomItems") !== "false",
			requireApprovalForCustom: formData.get("requireApprovalForCustom") === "true",
			showItemCodes: formData.get("showItemCodes") !== "false",
			showItemDescriptions: formData.get("showItemDescriptions") !== "false",
		});

		const { error } = await supabase.from("pricebook_settings").upsert({
			company_id: companyId,
			show_cost_prices: data.showCostPrices,
			markup_default_percentage: data.markupDefaultPercentage,
			require_categories: data.requireCategories,
			allow_custom_items: data.allowCustomItems,
			require_approval_for_custom: data.requireApprovalForCustom,
			show_item_codes: data.showItemCodes,
			show_item_descriptions: data.showItemDescriptions,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update pricebook settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/pricebook");
	});
}

export async function getPricebookSettings(): Promise<ActionResult<any>> {
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

		const { data, error } = await supabase.from("pricebook_settings").select("*").eq("company_id", companyId).single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch pricebook settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// BOOKING SETTINGS
// ============================================================================

const bookingSettingsSchema = z.object({
	onlineBookingEnabled: z.boolean().default(false),
	requireAccount: z.boolean().default(false),
	requireServiceSelection: z.boolean().default(true),
	showPricing: z.boolean().default(true),
	allowTimePreferences: z.boolean().default(true),
	requireImmediatePayment: z.boolean().default(false),
	sendConfirmationEmail: z.boolean().default(true),
	sendConfirmationSms: z.boolean().default(false),
	minBookingNoticeHours: z.coerce.number().default(24),
	maxBookingsPerDay: z.coerce.number().optional(),
});

export async function updateBookingSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = bookingSettingsSchema.parse({
			onlineBookingEnabled: formData.get("onlineBookingEnabled") === "true",
			requireAccount: formData.get("requireAccount") === "true",
			requireServiceSelection: formData.get("requireServiceSelection") !== "false",
			showPricing: formData.get("showPricing") !== "false",
			allowTimePreferences: formData.get("allowTimePreferences") !== "false",
			requireImmediatePayment: formData.get("requireImmediatePayment") === "true",
			sendConfirmationEmail: formData.get("sendConfirmationEmail") !== "false",
			sendConfirmationSms: formData.get("sendConfirmationSms") === "true",
			minBookingNoticeHours: formData.get("minBookingNoticeHours") || "24",
			maxBookingsPerDay: formData.get("maxBookingsPerDay") || undefined,
		});

		const { error } = await supabase.from("booking_settings").upsert({
			company_id: companyId,
			online_booking_enabled: data.onlineBookingEnabled,
			require_account: data.requireAccount,
			require_service_selection: data.requireServiceSelection,
			show_pricing: data.showPricing,
			allow_time_preferences: data.allowTimePreferences,
			require_immediate_payment: data.requireImmediatePayment,
			send_confirmation_email: data.sendConfirmationEmail,
			send_confirmation_sms: data.sendConfirmationSms,
			min_booking_notice_hours: data.minBookingNoticeHours,
			max_bookings_per_day: data.maxBookingsPerDay,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update booking settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/booking");
	});
}

export async function getBookingSettings(): Promise<ActionResult<any>> {
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

		const { data, error } = await supabase.from("booking_settings").select("*").eq("company_id", companyId).single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch booking settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}
