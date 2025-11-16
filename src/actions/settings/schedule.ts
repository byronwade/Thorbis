/**
 * Schedule Settings Server Actions
 *
 * Handles availability, calendar, dispatch, service areas, and team scheduling settings
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
// AVAILABILITY SETTINGS
// ============================================================================

const availabilitySettingsSchema = z.object({
	defaultWorkHours: z.string(), // JSON string
	defaultAppointmentDurationMinutes: z.coerce.number().default(60),
	bufferTimeMinutes: z.coerce.number().default(15),
	minBookingNoticeHours: z.coerce.number().default(24),
	maxBookingAdvanceDays: z.coerce.number().default(90),
	lunchBreakEnabled: z.boolean().default(true),
	lunchBreakStart: z.string().default("12:00"),
	lunchBreakDurationMinutes: z.coerce.number().default(60),
});

export async function updateAvailabilitySettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = availabilitySettingsSchema.parse({
			defaultWorkHours: formData.get("defaultWorkHours") as string,
			defaultAppointmentDurationMinutes: formData.get("defaultAppointmentDurationMinutes") || "60",
			bufferTimeMinutes: formData.get("bufferTimeMinutes") || "15",
			minBookingNoticeHours: formData.get("minBookingNoticeHours") || "24",
			maxBookingAdvanceDays: formData.get("maxBookingAdvanceDays") || "90",
			lunchBreakEnabled: formData.get("lunchBreakEnabled") !== "false",
			lunchBreakStart: formData.get("lunchBreakStart") || "12:00",
			lunchBreakDurationMinutes: formData.get("lunchBreakDurationMinutes") || "60",
		});

		let workHoursJson;
		try {
			workHoursJson = JSON.parse(data.defaultWorkHours);
		} catch (_e) {
			throw new ActionError("Invalid work hours JSON", ERROR_CODES.VALIDATION_FAILED);
		}

		const { error } = await supabase.from("schedule_availability_settings").upsert({
			company_id: companyId,
			default_work_hours: workHoursJson,
			default_appointment_duration_minutes: data.defaultAppointmentDurationMinutes,
			buffer_time_minutes: data.bufferTimeMinutes,
			min_booking_notice_hours: data.minBookingNoticeHours,
			max_booking_advance_days: data.maxBookingAdvanceDays,
			lunch_break_enabled: data.lunchBreakEnabled,
			lunch_break_start: data.lunchBreakStart,
			lunch_break_duration_minutes: data.lunchBreakDurationMinutes,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update availability settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/availability");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function getAvailabilitySettings(): Promise<ActionResult<any>> {
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
			.from("schedule_availability_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch availability settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// CALENDAR SETTINGS
// ============================================================================

const calendarSettingsSchema = z.object({
	defaultView: z.enum(["day", "week", "month", "timeline"]).default("week"),
	startDayOfWeek: z.coerce.number().min(0).max(6).default(0),
	timeSlotDurationMinutes: z.coerce.number().default(30),
	showTechnicianColors: z.boolean().default(true),
	showJobStatusColors: z.boolean().default(true),
	showTravelTime: z.boolean().default(true),
	showCustomerName: z.boolean().default(true),
	showJobType: z.boolean().default(true),
	syncWithGoogleCalendar: z.boolean().default(false),
	syncWithOutlook: z.boolean().default(false),
});

export async function updateCalendarSettings(formData: FormData): Promise<ActionResult<void>> {
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

		const data = calendarSettingsSchema.parse({
			defaultView: formData.get("defaultView") || "week",
			startDayOfWeek: formData.get("startDayOfWeek") || "0",
			timeSlotDurationMinutes: formData.get("timeSlotDurationMinutes") || "30",
			showTechnicianColors: formData.get("showTechnicianColors") !== "false",
			showJobStatusColors: formData.get("showJobStatusColors") !== "false",
			showTravelTime: formData.get("showTravelTime") !== "false",
			showCustomerName: formData.get("showCustomerName") !== "false",
			showJobType: formData.get("showJobType") !== "false",
			syncWithGoogleCalendar: formData.get("syncWithGoogleCalendar") === "true",
			syncWithOutlook: formData.get("syncWithOutlook") === "true",
		});

		const { error } = await supabase.from("schedule_calendar_settings").upsert({
			company_id: companyId,
			default_view: data.defaultView,
			start_day_of_week: data.startDayOfWeek,
			time_slot_duration_minutes: data.timeSlotDurationMinutes,
			show_technician_colors: data.showTechnicianColors,
			show_job_status_colors: data.showJobStatusColors,
			show_travel_time: data.showTravelTime,
			show_customer_name: data.showCustomerName,
			show_job_type: data.showJobType,
			sync_with_google_calendar: data.syncWithGoogleCalendar,
			sync_with_outlook: data.syncWithOutlook,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update calendar settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/calendar");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function getCalendarSettings(): Promise<ActionResult<any>> {
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
			.from("schedule_calendar_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch calendar settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// TEAM SCHEDULING RULES
// ============================================================================

const teamRulesSchema = z.object({
	maxJobsPerDay: z.coerce.number().default(8),
	maxJobsPerWeek: z.coerce.number().default(40),
	allowOvertime: z.boolean().default(false),
	preferSameTechnician: z.boolean().default(true),
	balanceWorkload: z.boolean().default(true),
	optimizeForTravelTime: z.boolean().default(true),
	maxTravelTimeMinutes: z.coerce.number().default(60),
	requireBreaks: z.boolean().default(true),
	breakAfterHours: z.coerce.number().default(4),
	breakDurationMinutes: z.coerce.number().default(15),
});

export async function updateTeamSchedulingRules(formData: FormData): Promise<ActionResult<void>> {
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

		const data = teamRulesSchema.parse({
			maxJobsPerDay: formData.get("maxJobsPerDay") || "8",
			maxJobsPerWeek: formData.get("maxJobsPerWeek") || "40",
			allowOvertime: formData.get("allowOvertime") === "true",
			preferSameTechnician: formData.get("preferSameTechnician") !== "false",
			balanceWorkload: formData.get("balanceWorkload") !== "false",
			optimizeForTravelTime: formData.get("optimizeForTravelTime") !== "false",
			maxTravelTimeMinutes: formData.get("maxTravelTimeMinutes") || "60",
			requireBreaks: formData.get("requireBreaks") !== "false",
			breakAfterHours: formData.get("breakAfterHours") || "4",
			breakDurationMinutes: formData.get("breakDurationMinutes") || "15",
		});

		const { error } = await supabase.from("schedule_team_rules").upsert({
			company_id: companyId,
			max_jobs_per_day: data.maxJobsPerDay,
			max_jobs_per_week: data.maxJobsPerWeek,
			allow_overtime: data.allowOvertime,
			prefer_same_technician: data.preferSameTechnician,
			balance_workload: data.balanceWorkload,
			optimize_for_travel_time: data.optimizeForTravelTime,
			max_travel_time_minutes: data.maxTravelTimeMinutes,
			require_breaks: data.requireBreaks,
			break_after_hours: data.breakAfterHours,
			break_duration_minutes: data.breakDurationMinutes,
		});

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update team scheduling rules"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/team-scheduling");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function getTeamSchedulingRules(): Promise<ActionResult<any>> {
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

		const { data, error } = await supabase.from("schedule_team_rules").select("*").eq("company_id", companyId).single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch team scheduling rules"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || null;
	});
}

// ============================================================================
// DISPATCH RULES
// ============================================================================

const dispatchRuleSchema = z.object({
	ruleName: z.string().min(1, "Rule name is required"),
	priority: z.coerce.number().default(0),
	isActive: z.boolean().default(true),
	assignmentMethod: z.enum(["auto", "manual", "round_robin", "closest_technician", "skill_based"]).default("auto"),
	conditions: z.string().optional(),
	actions: z.string().optional(),
});

function parseJsonField(value?: string | null) {
	if (!value) {
		return {};
	}
	try {
		return JSON.parse(value);
	} catch (_error) {
		throw new ActionError("Invalid JSON provided", ERROR_CODES.VALIDATION_FAILED);
	}
}

export async function createDispatchRule(formData: FormData): Promise<ActionResult<string>> {
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

		const data = dispatchRuleSchema.parse({
			ruleName: formData.get("ruleName"),
			priority: formData.get("priority") || "0",
			isActive: formData.get("isActive") !== "false",
			assignmentMethod: formData.get("assignmentMethod") || "auto",
			conditions: formData.get("conditions") || "{}",
			actions: formData.get("actions") || "{}",
		});

		const { data: newRule, error } = await supabase
			.from("schedule_dispatch_rules")
			.insert({
				company_id: companyId,
				rule_name: data.ruleName,
				priority: data.priority,
				is_active: data.isActive,
				assignment_method: data.assignmentMethod,
				conditions: parseJsonField(data.conditions),
				actions: parseJsonField(data.actions),
			})
			.select("id")
			.single();

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("create dispatch rule"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/dispatch-rules");
		revalidatePath("/dashboard/settings/schedule");
		return newRule.id;
	});
}

export async function updateDispatchRule(ruleId: string, formData: FormData): Promise<ActionResult<void>> {
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

		const data = dispatchRuleSchema.parse({
			ruleName: formData.get("ruleName"),
			priority: formData.get("priority") || "0",
			isActive: formData.get("isActive") !== "false",
			assignmentMethod: formData.get("assignmentMethod") || "auto",
			conditions: formData.get("conditions") || "{}",
			actions: formData.get("actions") || "{}",
		});

		const { error } = await supabase
			.from("schedule_dispatch_rules")
			.update({
				rule_name: data.ruleName,
				priority: data.priority,
				is_active: data.isActive,
				assignment_method: data.assignmentMethod,
				conditions: parseJsonField(data.conditions),
				actions: parseJsonField(data.actions),
			})
			.eq("id", ruleId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update dispatch rule"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/dispatch-rules");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function deleteDispatchRule(ruleId: string): Promise<ActionResult<void>> {
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
			.from("schedule_dispatch_rules")
			.delete()
			.eq("id", ruleId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete dispatch rule"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/dispatch-rules");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function getDispatchRules(): Promise<ActionResult<any[]>> {
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
			.from("schedule_dispatch_rules")
			.select("*")
			.eq("company_id", companyId)
			.order("priority", { ascending: false })
			.order("rule_name", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch dispatch rules"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data ?? [];
	});
}

// ============================================================================
// SERVICE AREAS
// ============================================================================

const serviceAreaSchema = z.object({
	areaName: z.string().min(1, "Area name is required"),
	areaType: z.enum(["zip_code", "radius", "polygon", "city", "state"]).default("zip_code"),
	zipCodes: z.string().optional(), // Comma-separated
	centerLat: z.coerce.number().optional(),
	centerLng: z.coerce.number().optional(),
	radiusMiles: z.coerce.number().optional(),
	polygonCoordinates: z.string().optional(), // JSON
	serviceFee: z.coerce.number().default(0),
	minimumJobAmount: z.coerce.number().optional(),
	estimatedTravelTimeMinutes: z.coerce.number().optional(),
	isActive: z.boolean().default(true),
});

export async function createServiceArea(formData: FormData): Promise<ActionResult<string>> {
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

		const data = serviceAreaSchema.parse({
			areaName: formData.get("areaName"),
			areaType: formData.get("areaType") || "zip_code",
			zipCodes: formData.get("zipCodes") || undefined,
			centerLat: formData.get("centerLat") || undefined,
			centerLng: formData.get("centerLng") || undefined,
			radiusMiles: formData.get("radiusMiles") || undefined,
			polygonCoordinates: formData.get("polygonCoordinates") || undefined,
			serviceFee: formData.get("serviceFee") || "0",
			minimumJobAmount: formData.get("minimumJobAmount") || undefined,
			estimatedTravelTimeMinutes: formData.get("estimatedTravelTimeMinutes") || undefined,
			isActive: formData.get("isActive") !== "false",
		});

		// Parse zip codes into array
		const zipCodesArray = data.zipCodes ? data.zipCodes.split(",").map((z) => z.trim()) : null;

		// Parse polygon coordinates
		let polygonJson = null;
		if (data.polygonCoordinates) {
			try {
				polygonJson = JSON.parse(data.polygonCoordinates);
			} catch (_e) {
				throw new ActionError("Invalid polygon coordinates JSON", ERROR_CODES.VALIDATION_FAILED);
			}
		}

		const { data: newArea, error } = await supabase
			.from("schedule_service_areas")
			.insert({
				company_id: companyId,
				area_name: data.areaName,
				area_type: data.areaType,
				zip_codes: zipCodesArray,
				center_lat: data.centerLat,
				center_lng: data.centerLng,
				radius_miles: data.radiusMiles,
				polygon_coordinates: polygonJson,
				service_fee: data.serviceFee,
				minimum_job_amount: data.minimumJobAmount,
				estimated_travel_time_minutes: data.estimatedTravelTimeMinutes,
				is_active: data.isActive,
			})
			.select("id")
			.single();

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("create service area"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/service-areas");
		revalidatePath("/dashboard/settings/schedule");
		return newArea.id;
	});
}

export async function updateServiceArea(areaId: string, formData: FormData): Promise<ActionResult<void>> {
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

		const data = serviceAreaSchema.parse({
			areaName: formData.get("areaName"),
			areaType: formData.get("areaType") || "zip_code",
			zipCodes: formData.get("zipCodes") || undefined,
			centerLat: formData.get("centerLat") || undefined,
			centerLng: formData.get("centerLng") || undefined,
			radiusMiles: formData.get("radiusMiles") || undefined,
			polygonCoordinates: formData.get("polygonCoordinates") || undefined,
			serviceFee: formData.get("serviceFee") || "0",
			minimumJobAmount: formData.get("minimumJobAmount") || undefined,
			estimatedTravelTimeMinutes: formData.get("estimatedTravelTimeMinutes") || undefined,
			isActive: formData.get("isActive") !== "false",
		});

		const zipCodesArray = data.zipCodes ? data.zipCodes.split(",").map((z) => z.trim()) : null;

		let polygonJson = null;
		if (data.polygonCoordinates) {
			try {
				polygonJson = JSON.parse(data.polygonCoordinates);
			} catch (_e) {
				throw new ActionError("Invalid polygon coordinates JSON", ERROR_CODES.VALIDATION_FAILED);
			}
		}

		const { error } = await supabase
			.from("schedule_service_areas")
			.update({
				area_name: data.areaName,
				area_type: data.areaType,
				zip_codes: zipCodesArray,
				center_lat: data.centerLat,
				center_lng: data.centerLng,
				radius_miles: data.radiusMiles,
				polygon_coordinates: polygonJson,
				service_fee: data.serviceFee,
				minimum_job_amount: data.minimumJobAmount,
				estimated_travel_time_minutes: data.estimatedTravelTimeMinutes,
				is_active: data.isActive,
			})
			.eq("id", areaId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update service area"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/service-areas");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function deleteServiceArea(areaId: string): Promise<ActionResult<void>> {
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
			.from("schedule_service_areas")
			.delete()
			.eq("id", areaId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete service area"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/schedule/service-areas");
		revalidatePath("/dashboard/settings/schedule");
	});
}

export async function getServiceAreas(): Promise<ActionResult<any[]>> {
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
			.from("schedule_service_areas")
			.select("*")
			.eq("company_id", companyId)
			.order("area_name", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch service areas"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return data || [];
	});
}

// ============================================================================
// SCHEDULE OVERVIEW SNAPSHOT
// ============================================================================

export type ScheduleOverviewSnapshot = {
	generatedAt: string;
	readinessScore: number;
	stepsCompleted: number;
	totalSteps: number;
	availability: {
		configured: boolean;
		updatedAt: string | null;
	};
	calendar: {
		configured: boolean;
		defaultView: string | null;
		updatedAt: string | null;
	};
	serviceAreas: {
		total: number;
		active: number;
	};
	dispatchRules: {
		total: number;
		active: number;
		updatedAt: string | null;
	};
	teamRules: {
		configured: boolean;
		maxJobsPerDay: number | null;
		maxJobsPerWeek: number | null;
		allowOvertime: boolean;
		requireBreaks: boolean;
	};
};

export async function getScheduleOverview(): Promise<ActionResult<ScheduleOverviewSnapshot>> {
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

		const [availabilityResult, calendarResult, teamRulesResult, serviceAreasResult, dispatchRulesResult] =
			await Promise.all([
				supabase.from("schedule_availability_settings").select("updated_at").eq("company_id", companyId).single(),
				supabase
					.from("schedule_calendar_settings")
					.select("default_view, updated_at")
					.eq("company_id", companyId)
					.single(),
				supabase
					.from("schedule_team_rules")
					.select("max_jobs_per_day, max_jobs_per_week, allow_overtime, require_breaks, updated_at")
					.eq("company_id", companyId)
					.single(),
				supabase.from("schedule_service_areas").select("id, is_active").eq("company_id", companyId),
				supabase
					.from("schedule_dispatch_rules")
					.select("id, is_active, updated_at")
					.eq("company_id", companyId)
					.order("updated_at", { ascending: false }),
			]);

		const availabilityError = availabilityResult.error;
		if (availabilityError && availabilityError.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch availability settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		const calendarError = calendarResult.error;
		if (calendarError && calendarError.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch calendar settings"), ERROR_CODES.DB_QUERY_ERROR);
		}

		const teamRulesError = teamRulesResult.error;
		if (teamRulesError && teamRulesError.code !== "PGRST116") {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch team scheduling rules"), ERROR_CODES.DB_QUERY_ERROR);
		}

		if (serviceAreasResult.error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch service areas"), ERROR_CODES.DB_QUERY_ERROR);
		}

		if (dispatchRulesResult.error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch dispatch rules"), ERROR_CODES.DB_QUERY_ERROR);
		}

		const availabilityData = availabilityResult.data ?? null;
		const calendarData = calendarResult.data ?? null;
		const teamRulesData = teamRulesResult.data ?? null;
		const serviceAreasData = serviceAreasResult.data ?? [];
		const dispatchRulesData = dispatchRulesResult.data ?? [];

		const availabilityConfigured = Boolean(availabilityData);
		const calendarConfigured = Boolean(calendarData);
		const teamRulesConfigured = Boolean(teamRulesData);
		const serviceAreasTotal = serviceAreasData.length;
		const serviceAreasActive = serviceAreasData.filter((area) => area.is_active).length;
		const dispatchRulesTotal = dispatchRulesData.length;
		const dispatchRulesActive = dispatchRulesData.filter((rule) => rule.is_active).length;

		const latestDispatchUpdate = dispatchRulesData.find((rule) => rule.updated_at)?.updated_at ?? null;

		const readinessSteps = [
			availabilityConfigured,
			calendarConfigured,
			serviceAreasTotal > 0,
			dispatchRulesTotal > 0,
			teamRulesConfigured,
		];
		const stepsCompleted = readinessSteps.filter(Boolean).length;
		const readinessScore = Math.round((stepsCompleted / readinessSteps.length) * 100);

		return {
			generatedAt: new Date().toISOString(),
			readinessScore,
			stepsCompleted,
			totalSteps: readinessSteps.length,
			availability: {
				configured: availabilityConfigured,
				updatedAt: availabilityData?.updated_at ?? null,
			},
			calendar: {
				configured: calendarConfigured,
				defaultView: calendarData?.default_view ?? null,
				updatedAt: calendarData?.updated_at ?? null,
			},
			serviceAreas: {
				total: serviceAreasTotal,
				active: serviceAreasActive,
			},
			dispatchRules: {
				total: dispatchRulesTotal,
				active: dispatchRulesActive,
				updatedAt: latestDispatchUpdate,
			},
			teamRules: {
				configured: teamRulesConfigured,
				maxJobsPerDay: teamRulesData?.max_jobs_per_day ?? null,
				maxJobsPerWeek: teamRulesData?.max_jobs_per_week ?? null,
				allowOvertime: teamRulesData?.allow_overtime ?? false,
				requireBreaks: teamRulesData?.require_breaks ?? false,
			},
		};
	});
}
