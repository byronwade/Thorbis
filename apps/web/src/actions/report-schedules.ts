"use server";

/**
 * Report Scheduling and Notification Preferences Actions
 *
 * Server actions for managing report schedules and notification alerts.
 */

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId, getCurrentUserId } from "@/lib/auth/company-context";

// Validation schemas
const alertConditionSchema = z.object({
	id: z.string(),
	metric: z.string(),
	operator: z.enum(["above", "below", "equals", "change"]),
	value: z.number(),
	isActive: z.boolean(),
});

const notificationPreferencesSchema = z.object({
	reportType: z.string(),
	reportTitle: z.string(),
	alerts: z.array(alertConditionSchema),
	channels: z.object({
		inApp: z.boolean(),
		email: z.boolean(),
		sms: z.boolean(),
	}),
	quietHours: z.object({
		enabled: z.boolean(),
		start: z.string(),
		end: z.string(),
	}),
});

const scheduleConfigSchema = z.object({
	reportType: z.string(),
	reportTitle: z.string(),
	frequency: z.enum(["daily", "weekly", "monthly", "quarterly"]),
	dayOfWeek: z.number().optional(),
	dayOfMonth: z.number().optional(),
	time: z.string(),
	timezone: z.string(),
	recipients: z.array(z.string().email()),
	format: z.enum(["pdf", "csv", "excel"]),
	includeCharts: z.boolean(),
	isActive: z.boolean(),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
export type ScheduleConfigInput = z.infer<typeof scheduleConfigSchema>;

/**
 * Save notification preferences for a report
 */
export async function saveNotificationPreferences(
	input: NotificationPreferencesInput
): Promise<{ success: boolean; error?: string; id?: string }> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const validated = notificationPreferencesSchema.parse(input);
		const supabase = await createClient();

		// Check if preferences already exist for this report type
		const { data: existing } = await supabase
			.from("report_notification_preferences")
			.select("id")
			.eq("company_id", companyId)
			.eq("user_id", userId)
			.eq("report_type", validated.reportType)
			.single();

		const preferencesData = {
			company_id: companyId,
			user_id: userId,
			report_type: validated.reportType,
			report_title: validated.reportTitle,
			alerts: validated.alerts,
			channels: validated.channels,
			quiet_hours: validated.quietHours,
			updated_at: new Date().toISOString(),
		};

		let result;
		if (existing) {
			// Update existing preferences
			result = await supabase
				.from("report_notification_preferences")
				.update(preferencesData)
				.eq("id", existing.id)
				.select("id")
				.single();
		} else {
			// Insert new preferences
			result = await supabase
				.from("report_notification_preferences")
				.insert({
					...preferencesData,
					created_at: new Date().toISOString(),
				})
				.select("id")
				.single();
		}

		if (result.error) {
			console.error("Failed to save notification preferences:", result.error);
			return { success: false, error: result.error.message };
		}

		return { success: true, id: result.data?.id };
	} catch (error) {
		console.error("Error saving notification preferences:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid preferences data" };
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save preferences",
		};
	}
}

/**
 * Get notification preferences for a report
 */
export async function getNotificationPreferences(
	reportType: string
): Promise<{ success: boolean; data?: NotificationPreferencesInput; error?: string }> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from("report_notification_preferences")
			.select("*")
			.eq("company_id", companyId)
			.eq("user_id", userId)
			.eq("report_type", reportType)
			.single();

		if (error) {
			// Not found is okay - return empty preferences
			if (error.code === "PGRST116") {
				return { success: true, data: undefined };
			}
			return { success: false, error: error.message };
		}

		return {
			success: true,
			data: {
				reportType: data.report_type,
				reportTitle: data.report_title,
				alerts: data.alerts || [],
				channels: data.channels || { inApp: true, email: true, sms: false },
				quietHours: data.quiet_hours || { enabled: false, start: "22:00", end: "08:00" },
			},
		};
	} catch (error) {
		console.error("Error getting notification preferences:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get preferences",
		};
	}
}

/**
 * Save a report schedule
 */
export async function saveReportSchedule(
	input: ScheduleConfigInput
): Promise<{ success: boolean; error?: string; id?: string }> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const validated = scheduleConfigSchema.parse(input);
		const supabase = await createClient();

		// Calculate next run time based on schedule
		const nextRunAt = calculateNextRunTime(validated);

		// Check if schedule already exists for this report type
		const { data: existing } = await supabase
			.from("report_schedules")
			.select("id")
			.eq("company_id", companyId)
			.eq("created_by", userId)
			.eq("report_type", validated.reportType)
			.single();

		const scheduleData = {
			company_id: companyId,
			created_by: userId,
			report_type: validated.reportType,
			report_title: validated.reportTitle,
			frequency: validated.frequency,
			day_of_week: validated.dayOfWeek,
			day_of_month: validated.dayOfMonth,
			time: validated.time,
			timezone: validated.timezone,
			recipients: validated.recipients,
			format: validated.format,
			include_charts: validated.includeCharts,
			is_active: validated.isActive,
			next_run_at: nextRunAt,
			updated_at: new Date().toISOString(),
		};

		let result;
		if (existing) {
			// Update existing schedule
			result = await supabase
				.from("report_schedules")
				.update(scheduleData)
				.eq("id", existing.id)
				.select("id")
				.single();
		} else {
			// Insert new schedule
			result = await supabase
				.from("report_schedules")
				.insert({
					...scheduleData,
					created_at: new Date().toISOString(),
				})
				.select("id")
				.single();
		}

		if (result.error) {
			console.error("Failed to save report schedule:", result.error);
			return { success: false, error: result.error.message };
		}

		return { success: true, id: result.data?.id };
	} catch (error) {
		console.error("Error saving report schedule:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid schedule data" };
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save schedule",
		};
	}
}

/**
 * Get report schedule
 */
export async function getReportSchedule(
	reportType: string
): Promise<{ success: boolean; data?: ScheduleConfigInput; error?: string }> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from("report_schedules")
			.select("*")
			.eq("company_id", companyId)
			.eq("created_by", userId)
			.eq("report_type", reportType)
			.single();

		if (error) {
			// Not found is okay - return empty schedule
			if (error.code === "PGRST116") {
				return { success: true, data: undefined };
			}
			return { success: false, error: error.message };
		}

		return {
			success: true,
			data: {
				reportType: data.report_type,
				reportTitle: data.report_title,
				frequency: data.frequency,
				dayOfWeek: data.day_of_week,
				dayOfMonth: data.day_of_month,
				time: data.time,
				timezone: data.timezone,
				recipients: data.recipients || [],
				format: data.format,
				includeCharts: data.include_charts,
				isActive: data.is_active,
			},
		};
	} catch (error) {
		console.error("Error getting report schedule:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get schedule",
		};
	}
}

/**
 * Delete a report schedule
 */
export async function deleteReportSchedule(
	reportType: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const supabase = await createClient();

		const { error } = await supabase
			.from("report_schedules")
			.delete()
			.eq("company_id", companyId)
			.eq("created_by", userId)
			.eq("report_type", reportType);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting report schedule:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete schedule",
		};
	}
}

/**
 * List all report schedules for a user
 */
export async function listReportSchedules(): Promise<{
	success: boolean;
	data?: Array<ScheduleConfigInput & { id: string; nextRunAt: string }>;
	error?: string;
}> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from("report_schedules")
			.select("*")
			.eq("company_id", companyId)
			.eq("created_by", userId)
			.order("created_at", { ascending: false });

		if (error) {
			return { success: false, error: error.message };
		}

		const schedules = (data || []).map((row) => ({
			id: row.id,
			reportType: row.report_type,
			reportTitle: row.report_title,
			frequency: row.frequency as "daily" | "weekly" | "monthly" | "quarterly",
			dayOfWeek: row.day_of_week,
			dayOfMonth: row.day_of_month,
			time: row.time,
			timezone: row.timezone,
			recipients: row.recipients || [],
			format: row.format as "pdf" | "csv" | "excel",
			includeCharts: row.include_charts,
			isActive: row.is_active,
			nextRunAt: row.next_run_at,
		}));

		return { success: true, data: schedules };
	} catch (error) {
		console.error("Error listing report schedules:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to list schedules",
		};
	}
}

/**
 * Calculate the next run time for a schedule
 */
function calculateNextRunTime(config: ScheduleConfigInput): string {
	const now = new Date();
	const [hours, minutes] = config.time.split(":").map(Number);

	let nextRun = new Date(now);
	nextRun.setHours(hours, minutes, 0, 0);

	// If time has passed today, start from tomorrow
	if (nextRun <= now) {
		nextRun.setDate(nextRun.getDate() + 1);
	}

	switch (config.frequency) {
		case "daily":
			// Already set to next occurrence
			break;

		case "weekly":
			if (config.dayOfWeek !== undefined) {
				// Move to the next occurrence of the target day
				const currentDay = nextRun.getDay();
				const targetDay = config.dayOfWeek;
				const daysUntilTarget = (targetDay - currentDay + 7) % 7;
				if (daysUntilTarget === 0 && nextRun <= now) {
					nextRun.setDate(nextRun.getDate() + 7);
				} else {
					nextRun.setDate(nextRun.getDate() + daysUntilTarget);
				}
			}
			break;

		case "monthly":
			if (config.dayOfMonth !== undefined) {
				// Move to the target day of the month
				nextRun.setDate(config.dayOfMonth);
				if (nextRun <= now) {
					nextRun.setMonth(nextRun.getMonth() + 1);
				}
			}
			break;

		case "quarterly":
			if (config.dayOfMonth !== undefined) {
				// Move to the target day of the quarter
				const currentMonth = nextRun.getMonth();
				const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
				nextRun.setMonth(quarterStartMonth);
				nextRun.setDate(config.dayOfMonth);
				if (nextRun <= now) {
					nextRun.setMonth(nextRun.getMonth() + 3);
				}
			}
			break;
	}

	return nextRun.toISOString();
}
