/**
 * Appointments Server Actions
 *
 * Handles appointment scheduling and management with comprehensive CRUD operations,
 * status transitions, reminders, and team assignment logic.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { ActionError, ERROR_CODES } from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  assertExists,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Validation Schemas
const createAppointmentSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),
  propertyId: z.string().uuid("Invalid property ID").optional(),
  jobId: z.string().uuid("Invalid job ID").optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional(),
  title: z.string().min(1, "Appointment title is required"),
  description: z.string().optional(),
  type: z
    .enum([
      "service",
      "consultation",
      "estimate",
      "follow_up",
      "maintenance",
      "emergency",
      "inspection",
    ])
    .optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  scheduledStart: z.string().min(1, "Start time is required"),
  scheduledEnd: z.string().min(1, "End time is required"),
  notes: z.string().optional(),
  travelTimeMinutes: z.number().int().min(0).optional(),
});

const updateAppointmentSchema = z.object({
  title: z.string().min(1, "Appointment title is required").optional(),
  description: z.string().optional(),
  status: z
    .enum([
      "scheduled",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "no_show",
      "rescheduled",
    ])
    .optional(),
  type: z
    .enum([
      "service",
      "consultation",
      "estimate",
      "follow_up",
      "maintenance",
      "emergency",
      "inspection",
    ])
    .optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
  actualStart: z.string().optional(),
  actualEnd: z.string().optional(),
  assignedTo: z.string().uuid("Invalid user ID").optional().nullable(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

const rescheduleAppointmentSchema = z.object({
  scheduledStart: z.string().min(1, "Start time is required"),
  scheduledEnd: z.string().min(1, "End time is required"),
  reason: z.string().optional(),
});

/**
 * Generate unique appointment number using database function
 */
async function generateAppointmentNumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const { data, error } = await supabase.rpc("generate_appointment_number", {
    p_company_id: companyId,
  });

  if (error || !data) {
    // Fallback to manual generation
    const { data: latestAppointment } = await supabase
      .from("appointments")
      .select("appointment_number")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!latestAppointment) {
      return "APT-000001";
    }

    const match = latestAppointment.appointment_number.match(/APT-(\d+)/);
    if (match) {
      const nextNumber = Number.parseInt(match[1]) + 1;
      return `APT-${nextNumber.toString().padStart(6, "0")}`;
    }

    return `APT-${Date.now().toString().slice(-6)}`;
  }

  return data;
}

/**
 * Calculate duration in minutes between two dates
 */
function calculateDuration(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.round((endDate.getTime() - startDate.getTime()) / 60_000);
}

/**
 * Validate appointment times
 */
function validateAppointmentTimes(start: string, end: string): void {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate <= startDate) {
    throw new ActionError(
      "End time must be after start time",
      ERROR_CODES.VALIDATION_FAILED
    );
  }

  if (startDate < new Date()) {
    throw new ActionError(
      "Cannot schedule appointments in the past",
      ERROR_CODES.VALIDATION_FAILED
    );
  }
}

/**
 * Create a new appointment
 */
export async function createAppointment(
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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Parse and validate form data
    const rawData = {
      customerId: formData.get("customerId") as string,
      propertyId: (formData.get("propertyId") as string) || undefined,
      jobId: (formData.get("jobId") as string) || undefined,
      assignedTo: (formData.get("assignedTo") as string) || undefined,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      type: (formData.get("type") as string) || undefined,
      priority: (formData.get("priority") as string) || "normal",
      scheduledStart: formData.get("scheduledStart") as string,
      scheduledEnd: formData.get("scheduledEnd") as string,
      notes: (formData.get("notes") as string) || undefined,
      travelTimeMinutes: formData.get("travelTimeMinutes")
        ? Number.parseInt(formData.get("travelTimeMinutes") as string)
        : undefined,
    };

    const validatedData = createAppointmentSchema.parse(rawData);

    // Validate appointment times
    validateAppointmentTimes(
      validatedData.scheduledStart,
      validatedData.scheduledEnd
    );

    // Calculate duration
    const duration = calculateDuration(
      validatedData.scheduledStart,
      validatedData.scheduledEnd
    );

    // Generate appointment number
    const appointmentNumber = await generateAppointmentNumber(
      supabase,
      companyId
    );

    // Create appointment
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        company_id: companyId,
        customer_id: validatedData.customerId,
        property_id: validatedData.propertyId,
        job_id: validatedData.jobId,
        assigned_to: validatedData.assignedTo,
        appointment_number: appointmentNumber,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        priority: validatedData.priority,
        scheduled_start: validatedData.scheduledStart,
        scheduled_end: validatedData.scheduledEnd,
        duration_minutes: duration,
        notes: validatedData.notes,
        travel_time_minutes: validatedData.travelTimeMinutes,
        status: "scheduled",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      throw new ActionError(
        `Failed to create appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/appointments");
    revalidatePath("/dashboard/schedule");
    if (validatedData.jobId) {
      revalidatePath(`/dashboard/work/${validatedData.jobId}`);
    }

    return appointment.id;
  });
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  appointmentId: string,
  formData: FormData
): Promise<ActionResult<boolean>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Verify appointment exists and belongs to company
    const { data: existingAppointment, error: fetchError } = await supabase
      .from("appointments")
      .select("id, company_id, status, scheduled_start, scheduled_end, job_id")
      .eq("id", appointmentId)
      .eq("company_id", companyId)
      .single();

    if (fetchError || !existingAppointment) {
      throw new ActionError(
        "Appointment not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    // Parse and validate form data
    const rawData: any = {};
    const fields = [
      "title",
      "description",
      "status",
      "type",
      "priority",
      "scheduledStart",
      "scheduledEnd",
      "actualStart",
      "actualEnd",
      "assignedTo",
      "notes",
      "cancellationReason",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null && value !== undefined && value !== "") {
        rawData[field] = value;
      }
    });

    const validatedData = updateAppointmentSchema.parse(rawData);

    // Validate times if both are provided
    if (validatedData.scheduledStart && validatedData.scheduledEnd) {
      validateAppointmentTimes(
        validatedData.scheduledStart,
        validatedData.scheduledEnd
      );
    }

    // Calculate new duration if times changed
    let duration: number | undefined;
    if (validatedData.scheduledStart && validatedData.scheduledEnd) {
      duration = calculateDuration(
        validatedData.scheduledStart,
        validatedData.scheduledEnd
      );
    }

    // Build update object
    const updateData: any = { ...validatedData };
    if (duration) {
      updateData.duration_minutes = duration;
    }

    // Convert camelCase to snake_case for database
    const dbUpdateData: any = {};
    Object.entries(updateData).forEach(([key, value]) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      dbUpdateData[snakeKey] = value;
    });

    // Update appointment
    const { error } = await supabase
      .from("appointments")
      .update(dbUpdateData)
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to update appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/appointments");
    revalidatePath(`/dashboard/work/appointments/${appointmentId}`);
    revalidatePath("/dashboard/schedule");
    if (existingAppointment.job_id) {
      revalidatePath(`/dashboard/work/${existingAppointment.job_id}`);
    }

    return true;
  });
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(
  appointmentId: string,
  formData: FormData
): Promise<ActionResult<boolean>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Parse and validate form data
    const rawData = {
      scheduledStart: formData.get("scheduledStart") as string,
      scheduledEnd: formData.get("scheduledEnd") as string,
      reason: (formData.get("reason") as string) || undefined,
    };

    const validatedData = rescheduleAppointmentSchema.parse(rawData);

    // Validate appointment times
    validateAppointmentTimes(
      validatedData.scheduledStart,
      validatedData.scheduledEnd
    );

    // Calculate new duration
    const duration = calculateDuration(
      validatedData.scheduledStart,
      validatedData.scheduledEnd
    );

    // Update appointment with rescheduled status
    const { error } = await supabase
      .from("appointments")
      .update({
        scheduled_start: validatedData.scheduledStart,
        scheduled_end: validatedData.scheduledEnd,
        duration_minutes: duration,
        status: "rescheduled",
        notes: validatedData.reason
          ? `Rescheduled: ${validatedData.reason}`
          : undefined,
      })
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to reschedule appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/appointments");
    revalidatePath(`/dashboard/work/appointments/${appointmentId}`);
    revalidatePath("/dashboard/schedule");

    return true;
  });
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string
): Promise<ActionResult<boolean>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Update appointment status to cancelled
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
        cancellation_reason: reason,
      })
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to cancel appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/appointments");
    revalidatePath(`/dashboard/work/appointments/${appointmentId}`);
    revalidatePath("/dashboard/schedule");

    return true;
  });
}

/**
 * Complete an appointment
 */
export async function completeAppointment(
  appointmentId: string,
  actualEnd?: string
): Promise<ActionResult<boolean>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Update appointment status to completed
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "completed",
        actual_end: actualEnd || new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to complete appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/appointments");
    revalidatePath(`/dashboard/work/appointments/${appointmentId}`);
    revalidatePath("/dashboard/schedule");

    return true;
  });
}

/**
 * Archive an appointment (soft delete)
 */
export async function archiveAppointment(
  appointmentId: string
): Promise<ActionResult<boolean>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Archive appointment (soft delete)
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("schedules")
      .update({
        archived_at: now,
        deleted_at: now,
        deleted_by: user.id,
        status: "cancelled", // Mark as cancelled when archived
      })
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to archive appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return true;
  });
}

/**
 * Delete an appointment (hard delete)
 */
export async function deleteAppointment(
  appointmentId: string
): Promise<ActionResult<boolean>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Delete appointment
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (error) {
      throw new ActionError(
        `Failed to delete appointment: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/work/appointments");
    revalidatePath("/dashboard/schedule");

    return true;
  });
}

/**
 * Search appointments
 */
export async function searchAppointments(
  searchQuery: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<ActionResult<any[]>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Use the RPC function for ranked search
    const { data, error } = await supabase.rpc("search_appointments_ranked", {
      p_company_id: companyId,
      p_search_query: searchQuery,
      p_limit: options?.limit || 50,
      p_offset: options?.offset || 0,
    });

    if (error) {
      throw new ActionError(
        `Search failed: ${error.message}`,
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return data || [];
  });
}

/**
 * Unlink appointment from job
 * Removes the job association (sets job_id to NULL)
 * Bidirectional operation - updates both appointment and job views
 */
export async function unlinkScheduleFromJob(
  appointmentId: string
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const companyId = await getActiveCompanyId();
    assertExists(companyId, "Company not found for user");

    // Get current appointment to verify exists and get job_id for revalidation
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("id, job_id")
      .eq("id", appointmentId)
      .eq("company_id", companyId)
      .single();

    if (fetchError || !appointment) {
      throw new ActionError(
        "Appointment not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    const previousJobId = appointment.job_id;

    // Unlink appointment from job (set job_id to NULL)
    const { error: unlinkError } = await supabase
      .from("appointments")
      .update({ job_id: null })
      .eq("id", appointmentId)
      .eq("company_id", companyId);

    if (unlinkError) {
      throw new ActionError(
        "Failed to unlink appointment from job",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate both pages
    revalidatePath(`/dashboard/work/appointments/${appointmentId}`);
    if (previousJobId) {
      revalidatePath(`/dashboard/work/${previousJobId}`);
    }
    revalidatePath("/dashboard/work/appointments");
    revalidatePath("/dashboard/schedule");
  });
}
