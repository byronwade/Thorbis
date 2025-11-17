/**
 * Payroll Settings Server Actions
 *
 * Handles all payroll-related settings including overtime, bonuses, callbacks,
 * commissions, deductions, materials, and payroll schedule
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
// OVERTIME SETTINGS
// ============================================================================

const overtimeSettingsSchema = z.object({
	overtimeEnabled: z.boolean().default(true),
	dailyThresholdHours: z.coerce.number().default(8),
	weeklyThresholdHours: z.coerce.number().default(40),
	consecutiveDaysThreshold: z.coerce.number().default(7),
	dailyOvertimeMultiplier: z.coerce.number().default(1.5),
	weeklyOvertimeMultiplier: z.coerce.number().default(1.5),
	doubleTimeMultiplier: z.coerce.number().default(2.0),
	doubleTimeEnabled: z.boolean().default(false),
	doubleTimeAfterHours: z.coerce.number().default(12),
	doubleTimeOnSeventhDay: z.boolean().default(false),
	weekendOvertimeEnabled: z.boolean().default(false),
	saturdayMultiplier: z.coerce.number().default(1.5),
	sundayMultiplier: z.coerce.number().default(2.0),
	holidayMultiplier: z.coerce.number().default(2.5),
	requireOvertimeApproval: z.boolean().default(true),
	autoCalculateOvertime: z.boolean().default(true),
	trackByJob: z.boolean().default(true),
	trackByDay: z.boolean().default(true),
	notifyApproachingOvertime: z.boolean().default(true),
	overtimeThresholdNotificationHours: z.coerce.number().default(7.5),
	notifyManagersOnOvertime: z.boolean().default(true),
});

export async function updateOvertimeSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = overtimeSettingsSchema.parse({
			overtimeEnabled: formData.get("overtimeEnabled") !== "false",
			dailyThresholdHours: formData.get("dailyThresholdHours") || "8",
			weeklyThresholdHours: formData.get("weeklyThresholdHours") || "40",
			consecutiveDaysThreshold: formData.get("consecutiveDaysThreshold") || "7",
			dailyOvertimeMultiplier: formData.get("dailyOvertimeMultiplier") || "1.5",
			weeklyOvertimeMultiplier: formData.get("weeklyOvertimeMultiplier") || "1.5",
			doubleTimeMultiplier: formData.get("doubleTimeMultiplier") || "2.0",
			doubleTimeEnabled: formData.get("doubleTimeEnabled") === "true",
			doubleTimeAfterHours: formData.get("doubleTimeAfterHours") || "12",
			doubleTimeOnSeventhDay: formData.get("doubleTimeOnSeventhDay") === "true",
			weekendOvertimeEnabled: formData.get("weekendOvertimeEnabled") === "true",
			saturdayMultiplier: formData.get("saturdayMultiplier") || "1.5",
			sundayMultiplier: formData.get("sundayMultiplier") || "2.0",
			holidayMultiplier: formData.get("holidayMultiplier") || "2.5",
			requireOvertimeApproval: formData.get("requireOvertimeApproval") !== "false",
			autoCalculateOvertime: formData.get("autoCalculateOvertime") !== "false",
			trackByJob: formData.get("trackByJob") !== "false",
			trackByDay: formData.get("trackByDay") !== "false",
			notifyApproachingOvertime: formData.get("notifyApproachingOvertime") !== "false",
			overtimeThresholdNotificationHours:
				formData.get("overtimeThresholdNotificationHours") || "7.5",
			notifyManagersOnOvertime: formData.get("notifyManagersOnOvertime") !== "false",
		});

		const { error } = await supabase.from("payroll_overtime_settings").upsert({
			company_id: companyId,
			overtime_enabled: data.overtimeEnabled,
			daily_threshold_hours: data.dailyThresholdHours,
			weekly_threshold_hours: data.weeklyThresholdHours,
			consecutive_days_threshold: data.consecutiveDaysThreshold,
			daily_overtime_multiplier: data.dailyOvertimeMultiplier,
			weekly_overtime_multiplier: data.weeklyOvertimeMultiplier,
			double_time_multiplier: data.doubleTimeMultiplier,
			double_time_enabled: data.doubleTimeEnabled,
			double_time_after_hours: data.doubleTimeAfterHours,
			double_time_on_seventh_day: data.doubleTimeOnSeventhDay,
			weekend_overtime_enabled: data.weekendOvertimeEnabled,
			saturday_multiplier: data.saturdayMultiplier,
			sunday_multiplier: data.sundayMultiplier,
			holiday_multiplier: data.holidayMultiplier,
			require_overtime_approval: data.requireOvertimeApproval,
			auto_calculate_overtime: data.autoCalculateOvertime,
			track_by_job: data.trackByJob,
			track_by_day: data.trackByDay,
			notify_approaching_overtime: data.notifyApproachingOvertime,
			overtime_threshold_notification_hours: data.overtimeThresholdNotificationHours,
			notify_managers_on_overtime: data.notifyManagersOnOvertime,
			updated_by: user.id,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update overtime settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/payroll/overtime");
	});
}

export async function getOvertimeSettings(): Promise<ActionResult<any>> {
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
			.from("payroll_overtime_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch overtime settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// COMMISSION SETTINGS
// ============================================================================

const commissionRuleSchema = z.object({
	ruleName: z.string().min(1, "Rule name is required"),
	description: z.string().optional(),
	isActive: z.boolean().default(true),
	commissionBasis: z.enum([
		"job_revenue",
		"job_profit",
		"product_sales",
		"service_agreement_sales",
		"membership_sales",
		"upsells",
	]),
	rateType: z.enum(["flat_percentage", "tiered", "progressive"]),
	flatPercentage: z.coerce.number().optional(),
	eligibleRoles: z.string().optional(), // JSON string
	eligibleDepartments: z.string().optional(), // JSON string
	eligibleJobTypes: z.string().optional(), // JSON string
	minJobValue: z.coerce.number().optional(),
	payoutFrequency: z
		.enum(["per_job", "weekly", "biweekly", "monthly", "quarterly"])
		.default("monthly"),
	payoutTiming: z
		.enum(["on_job_completion", "on_invoice", "on_payment", "on_full_payment"])
		.default("on_payment"),
	allowCommissionSplits: z.boolean().default(true),
	primaryTechnicianPercentage: z.coerce.number().default(100),
	effectiveStartDate: z.string().optional(),
	effectiveEndDate: z.string().optional(),
});

export async function createCommissionRule(
	formData: FormData
): Promise<ActionResult<{ id: string }>> {
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

		const data = commissionRuleSchema.parse({
			ruleName: formData.get("ruleName"),
			description: formData.get("description") || undefined,
			isActive: formData.get("isActive") !== "false",
			commissionBasis: formData.get("commissionBasis"),
			rateType: formData.get("rateType"),
			flatPercentage: formData.get("flatPercentage") || undefined,
			eligibleRoles: formData.get("eligibleRoles") || undefined,
			eligibleDepartments: formData.get("eligibleDepartments") || undefined,
			eligibleJobTypes: formData.get("eligibleJobTypes") || undefined,
			minJobValue: formData.get("minJobValue") || undefined,
			payoutFrequency: formData.get("payoutFrequency") || "monthly",
			payoutTiming: formData.get("payoutTiming") || "on_payment",
			allowCommissionSplits: formData.get("allowCommissionSplits") !== "false",
			primaryTechnicianPercentage: formData.get("primaryTechnicianPercentage") || "100",
			effectiveStartDate: formData.get("effectiveStartDate") || undefined,
			effectiveEndDate: formData.get("effectiveEndDate") || undefined,
		});

		const { data: result, error } = await supabase
			.from("payroll_commission_rules")
			.insert({
				company_id: companyId,
				rule_name: data.ruleName,
				description: data.description,
				is_active: data.isActive,
				commission_basis: data.commissionBasis,
				rate_type: data.rateType,
				flat_percentage: data.flatPercentage,
				eligible_roles: data.eligibleRoles ? JSON.parse(data.eligibleRoles) : [],
				eligible_departments: data.eligibleDepartments ? JSON.parse(data.eligibleDepartments) : [],
				eligible_job_types: data.eligibleJobTypes ? JSON.parse(data.eligibleJobTypes) : [],
				min_job_value: data.minJobValue,
				payout_frequency: data.payoutFrequency,
				payout_timing: data.payoutTiming,
				allow_commission_splits: data.allowCommissionSplits,
				primary_technician_percentage: data.primaryTechnicianPercentage,
				effective_start_date: data.effectiveStartDate,
				effective_end_date: data.effectiveEndDate,
				created_by: user.id,
			})
			.select("id")
			.single();

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create commission rule"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/payroll/commission");
		return { id: result.id };
	});
}

export async function updateCommissionRule(
	ruleId: string,
	formData: FormData
): Promise<ActionResult<void>> {
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

		const data = commissionRuleSchema.parse({
			ruleName: formData.get("ruleName"),
			description: formData.get("description") || undefined,
			isActive: formData.get("isActive") !== "false",
			commissionBasis: formData.get("commissionBasis"),
			rateType: formData.get("rateType"),
			flatPercentage: formData.get("flatPercentage") || undefined,
			eligibleRoles: formData.get("eligibleRoles") || undefined,
			eligibleDepartments: formData.get("eligibleDepartments") || undefined,
			eligibleJobTypes: formData.get("eligibleJobTypes") || undefined,
			minJobValue: formData.get("minJobValue") || undefined,
			payoutFrequency: formData.get("payoutFrequency") || "monthly",
			payoutTiming: formData.get("payoutTiming") || "on_payment",
			allowCommissionSplits: formData.get("allowCommissionSplits") !== "false",
			primaryTechnicianPercentage: formData.get("primaryTechnicianPercentage") || "100",
			effectiveStartDate: formData.get("effectiveStartDate") || undefined,
			effectiveEndDate: formData.get("effectiveEndDate") || undefined,
		});

		const { error } = await supabase
			.from("payroll_commission_rules")
			.update({
				rule_name: data.ruleName,
				description: data.description,
				is_active: data.isActive,
				commission_basis: data.commissionBasis,
				rate_type: data.rateType,
				flat_percentage: data.flatPercentage,
				eligible_roles: data.eligibleRoles ? JSON.parse(data.eligibleRoles) : [],
				eligible_departments: data.eligibleDepartments ? JSON.parse(data.eligibleDepartments) : [],
				eligible_job_types: data.eligibleJobTypes ? JSON.parse(data.eligibleJobTypes) : [],
				min_job_value: data.minJobValue,
				payout_frequency: data.payoutFrequency,
				payout_timing: data.payoutTiming,
				allow_commission_splits: data.allowCommissionSplits,
				primary_technician_percentage: data.primaryTechnicianPercentage,
				effective_start_date: data.effectiveStartDate,
				effective_end_date: data.effectiveEndDate,
				updated_by: user.id,
			})
			.eq("id", ruleId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update commission rule"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/payroll/commission");
	});
}

export async function deleteCommissionRule(ruleId: string): Promise<ActionResult<void>> {
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
			.from("payroll_commission_rules")
			.delete()
			.eq("id", ruleId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("delete commission rule"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/payroll/commission");
	});
}

export async function getCommissionRules(): Promise<ActionResult<any[]>> {
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
			.from("payroll_commission_rules")
			.select("*")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch commission rules"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// Commission Tiers
const commissionTierSchema = z.object({
	tierLevel: z.coerce.number().min(1),
	minAmount: z.coerce.number().min(0),
	maxAmount: z.coerce.number().optional(),
	commissionPercentage: z.coerce.number().min(0).max(100),
});

export async function createCommissionTier(
	ruleId: string,
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const data = commissionTierSchema.parse({
			tierLevel: formData.get("tierLevel"),
			minAmount: formData.get("minAmount"),
			maxAmount: formData.get("maxAmount") || undefined,
			commissionPercentage: formData.get("commissionPercentage"),
		});

		const { error } = await supabase.from("payroll_commission_tiers").insert({
			commission_rule_id: ruleId,
			tier_level: data.tierLevel,
			min_amount: data.minAmount,
			max_amount: data.maxAmount,
			commission_percentage: data.commissionPercentage,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create commission tier"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/payroll/commission");
	});
}

export async function getCommissionTiers(ruleId: string): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data, error } = await supabase
			.from("payroll_commission_tiers")
			.select("*")
			.eq("commission_rule_id", ruleId)
			.order("tier_level", { ascending: true });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch commission tiers"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// ============================================================================
// BONUS SETTINGS (Similar structure to Commission)
// ============================================================================

export async function getBonusRules(): Promise<ActionResult<any[]>> {
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
			.from("payroll_bonus_rules")
			.select("*")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch bonus rules"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// ============================================================================
// CALLBACK SETTINGS
// ============================================================================

export async function getCallbackSettings(): Promise<ActionResult<any>> {
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
			.from("payroll_callback_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch callback settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// DEDUCTION TYPES
// ============================================================================

export async function getDeductionTypes(): Promise<ActionResult<any[]>> {
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
			.from("payroll_deduction_types")
			.select("*")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch deduction types"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// ============================================================================
// MATERIAL SETTINGS
// ============================================================================

export async function getMaterialSettings(): Promise<ActionResult<any>> {
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
			.from("payroll_material_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch material settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// PAYROLL SCHEDULE SETTINGS
// ============================================================================

const payrollScheduleSchema = z.object({
	payrollFrequency: z.enum(["weekly", "biweekly", "semi_monthly", "monthly"]),
	weeklyPayDay: z.string().optional(),
	biweeklyStartDate: z.string().optional(),
	semiMonthlyFirstDay: z.coerce.number().optional(),
	semiMonthlySecondDay: z.coerce.number().optional(),
	monthlyPayDay: z.coerce.number().optional(),
	payPeriodEndDay: z.string().default("sunday"),
	daysInArrears: z.coerce.number().default(0),
	autoProcessPayroll: z.boolean().default(false),
	requireManagerApproval: z.boolean().default(true),
	requireFinanceApproval: z.boolean().default(true),
	approvalDeadlineDays: z.coerce.number().default(2),
	timeTrackingMethod: z
		.enum(["clock_in_out", "job_based", "manual_entry", "gps_verified"])
		.default("clock_in_out"),
	roundTimeToNearestMinutes: z.coerce.number().default(15),
	overtimeCalculationPeriod: z.enum(["daily", "weekly", "pay_period"]).default("weekly"),
	paidHolidaysEnabled: z.boolean().default(true),
	holidayPayRateMultiplier: z.coerce.number().default(1.0),
	ptoAccrualEnabled: z.boolean().default(true),
	ptoAccrualRateHoursPerPayPeriod: z.coerce.number().default(3.08),
	ptoMaxAccrualHours: z.coerce.number().default(120),
	notifyTeamBeforePayrollDays: z.coerce.number().default(3),
	notifyOnTimesheetApproval: z.boolean().default(true),
	notifyOnPayrollProcessed: z.boolean().default(true),
});

export async function updatePayrollSchedule(formData: FormData): Promise<ActionResult<void>> {
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

		const data = payrollScheduleSchema.parse({
			payrollFrequency: formData.get("payrollFrequency"),
			weeklyPayDay: formData.get("weeklyPayDay") || undefined,
			biweeklyStartDate: formData.get("biweeklyStartDate") || undefined,
			semiMonthlyFirstDay: formData.get("semiMonthlyFirstDay") || undefined,
			semiMonthlySecondDay: formData.get("semiMonthlySecondDay") || undefined,
			monthlyPayDay: formData.get("monthlyPayDay") || undefined,
			payPeriodEndDay: formData.get("payPeriodEndDay") || "sunday",
			daysInArrears: formData.get("daysInArrears") || "0",
			autoProcessPayroll: formData.get("autoProcessPayroll") === "true",
			requireManagerApproval: formData.get("requireManagerApproval") !== "false",
			requireFinanceApproval: formData.get("requireFinanceApproval") !== "false",
			approvalDeadlineDays: formData.get("approvalDeadlineDays") || "2",
			timeTrackingMethod: formData.get("timeTrackingMethod") || "clock_in_out",
			roundTimeToNearestMinutes: formData.get("roundTimeToNearestMinutes") || "15",
			overtimeCalculationPeriod: formData.get("overtimeCalculationPeriod") || "weekly",
			paidHolidaysEnabled: formData.get("paidHolidaysEnabled") !== "false",
			holidayPayRateMultiplier: formData.get("holidayPayRateMultiplier") || "1.0",
			ptoAccrualEnabled: formData.get("ptoAccrualEnabled") !== "false",
			ptoAccrualRateHoursPerPayPeriod: formData.get("ptoAccrualRateHoursPerPayPeriod") || "3.08",
			ptoMaxAccrualHours: formData.get("ptoMaxAccrualHours") || "120",
			notifyTeamBeforePayrollDays: formData.get("notifyTeamBeforePayrollDays") || "3",
			notifyOnTimesheetApproval: formData.get("notifyOnTimesheetApproval") !== "false",
			notifyOnPayrollProcessed: formData.get("notifyOnPayrollProcessed") !== "false",
		});

		const { error } = await supabase.from("payroll_schedule_settings").upsert({
			company_id: companyId,
			payroll_frequency: data.payrollFrequency,
			weekly_pay_day: data.weeklyPayDay,
			biweekly_start_date: data.biweeklyStartDate,
			semi_monthly_first_day: data.semiMonthlyFirstDay,
			semi_monthly_second_day: data.semiMonthlySecondDay,
			monthly_pay_day: data.monthlyPayDay,
			pay_period_end_day: data.payPeriodEndDay,
			days_in_arrears: data.daysInArrears,
			auto_process_payroll: data.autoProcessPayroll,
			require_manager_approval: data.requireManagerApproval,
			require_finance_approval: data.requireFinanceApproval,
			approval_deadline_days: data.approvalDeadlineDays,
			time_tracking_method: data.timeTrackingMethod,
			round_time_to_nearest_minutes: data.roundTimeToNearestMinutes,
			overtime_calculation_period: data.overtimeCalculationPeriod,
			paid_holidays_enabled: data.paidHolidaysEnabled,
			holiday_pay_rate_multiplier: data.holidayPayRateMultiplier,
			pto_accrual_enabled: data.ptoAccrualEnabled,
			pto_accrual_rate_hours_per_pay_period: data.ptoAccrualRateHoursPerPayPeriod,
			pto_max_accrual_hours: data.ptoMaxAccrualHours,
			notify_team_before_payroll_days: data.notifyTeamBeforePayrollDays,
			notify_on_timesheet_approval: data.notifyOnTimesheetApproval,
			notify_on_payroll_processed: data.notifyOnPayrollProcessed,
			updated_by: user.id,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update payroll schedule"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/payroll/schedule");
	});
}

export async function getPayrollSchedule(): Promise<ActionResult<any>> {
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
			.from("payroll_schedule_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch payroll schedule"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}
