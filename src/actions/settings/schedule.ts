/**
 * Schedule Settings Server Actions
 *
 * Handles availability, calendar, dispatch, service areas, and team scheduling settings
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionError,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/lib/errors/action-error";
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
    throw new ActionError(
      "You must be part of a company",
      ERROR_CODES.AUTH_FORBIDDEN,
      403
    );
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

export async function updateAvailabilitySettings(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
    } catch (e) {
      throw new ActionError(
        "Invalid work hours JSON",
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    const { error } = await supabase
      .from("schedule_availability_settings")
      .upsert({
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update availability settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/schedule/availability");
  });
}

export async function getAvailabilitySettings(): Promise<ActionResult<any>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch availability settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
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

export async function updateCalendarSettings(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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

    const { error } = await supabase
      .from("schedule_calendar_settings")
      .upsert({
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update calendar settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/schedule/calendar");
  });
}

export async function getCalendarSettings(): Promise<ActionResult<any>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch calendar settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
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

export async function updateTeamSchedulingRules(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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

    const { error } = await supabase
      .from("schedule_team_rules")
      .upsert({
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update team scheduling rules"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/schedule/team-scheduling");
  });
}

export async function getTeamSchedulingRules(): Promise<ActionResult<any>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const companyId = await getCompanyId(supabase, user.id);

    const { data, error } = await supabase
      .from("schedule_team_rules")
      .select("*")
      .eq("company_id", companyId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch team scheduling rules"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return data || null;
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

export async function createServiceArea(
  formData: FormData
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
    const zipCodesArray = data.zipCodes
      ? data.zipCodes.split(",").map((z) => z.trim())
      : null;

    // Parse polygon coordinates
    let polygonJson = null;
    if (data.polygonCoordinates) {
      try {
        polygonJson = JSON.parse(data.polygonCoordinates);
      } catch (e) {
        throw new ActionError(
          "Invalid polygon coordinates JSON",
          ERROR_CODES.VALIDATION_FAILED
        );
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create service area"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/schedule/service-areas");
    return newArea.id;
  });
}

export async function updateServiceArea(
  areaId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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

    const zipCodesArray = data.zipCodes
      ? data.zipCodes.split(",").map((z) => z.trim())
      : null;

    let polygonJson = null;
    if (data.polygonCoordinates) {
      try {
        polygonJson = JSON.parse(data.polygonCoordinates);
      } catch (e) {
        throw new ActionError(
          "Invalid polygon coordinates JSON",
          ERROR_CODES.VALIDATION_FAILED
        );
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update service area"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/schedule/service-areas");
  });
}

export async function deleteServiceArea(areaId: string): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete service area"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/schedule/service-areas");
  });
}

export async function getServiceAreas(): Promise<ActionResult<any[]>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch service areas"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return data || [];
  });
}
