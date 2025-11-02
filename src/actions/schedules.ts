"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type ScheduleInsert,
  type ScheduleUpdate,
  scheduleInsertSchema,
  scheduleUpdateSchema,
} from "@/lib/validations/database-schemas";

/**
 * Server Actions for Schedule/Appointment Management
 *
 * Handles scheduling with:
 * - Server-side validation using Zod
 * - Supabase database operations
 * - Recurring event support
 * - Reminder tracking
 * - Company-based multi-tenancy via RLS
 */

// ============================================================================
// CREATE
// ============================================================================

export async function createSchedule(
  data: ScheduleInsert
): Promise<{ success: boolean; error?: string; scheduleId?: string }> {
  try {
    const validated = scheduleInsertSchema.parse(data);
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: schedule, error } = await supabase
      .from("schedules")
      .insert(validated)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/work/schedule");
    return { success: true, scheduleId: schedule.id };
  } catch (error) {
    console.error("Create schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create schedule" };
  }
}

// ============================================================================
// READ
// ============================================================================

export async function getSchedule(
  scheduleId: string
): Promise<{ success: boolean; error?: string; schedule?: any }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: schedule, error } = await supabase
      .from("schedules")
      .select(
        "*, customer:customers(first_name, last_name, phone), job:jobs(job_number, title)"
      )
      .eq("id", scheduleId)
      .is("deleted_at", null)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, schedule };
  } catch (error) {
    console.error("Get schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to get schedule" };
  }
}

export async function getSchedules(filters?: {
  type?: string;
  status?: string;
  assignedTo?: string;
  customerId?: string;
  jobId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ success: boolean; error?: string; schedules?: any[] }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    let query = supabase
      .from("schedules")
      .select(
        "*, customer:customers(first_name, last_name), job:jobs(job_number)"
      )
      .is("deleted_at", null)
      .order("start_time", { ascending: true });

    // Apply filters
    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters?.assignedTo) {
      query = query.eq("assigned_to", filters.assignedTo);
    }
    if (filters?.customerId) {
      query = query.eq("customer_id", filters.customerId);
    }
    if (filters?.jobId) {
      query = query.eq("job_id", filters.jobId);
    }
    if (filters?.startDate) {
      query = query.gte("start_time", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("start_time", filters.endDate);
    }

    const { data: schedules, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, schedules };
  } catch (error) {
    console.error("Get schedules error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to get schedules" };
  }
}

// ============================================================================
// UPDATE
// ============================================================================

export async function updateSchedule(
  scheduleId: string,
  data: ScheduleUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = scheduleUpdateSchema.parse(data);
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { error } = await supabase
      .from("schedules")
      .update(validated)
      .eq("id", scheduleId)
      .is("deleted_at", null);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/work/schedule");
    revalidatePath(`/dashboard/schedule/${scheduleId}`);
    return { success: true };
  } catch (error) {
    console.error("Update schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update schedule" };
  }
}

export async function updateScheduleStatus(
  scheduleId: string,
  status:
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show"
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { error } = await supabase
      .from("schedules")
      .update({ status })
      .eq("id", scheduleId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/work/schedule");
    return { success: true };
  } catch (error) {
    console.error("Update schedule status error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update schedule status" };
  }
}

// ============================================================================
// RECURRING SCHEDULES
// ============================================================================

export async function createRecurringSchedule(
  data: ScheduleInsert,
  recurrenceRule: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    count?: number;
    until?: Date;
    byDay?: number[];
  }
): Promise<{ success: boolean; error?: string; scheduleIds?: string[] }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Create parent schedule
    const parentData = {
      ...data,
      is_recurring: true,
      recurrence_rule: recurrenceRule,
    };

    const { data: parentSchedule, error: parentError } = await supabase
      .from("schedules")
      .insert(parentData)
      .select("id")
      .single();

    if (parentError) {
      console.error("Supabase error:", parentError);
      return { success: false, error: parentError.message };
    }

    // Generate recurring instances (simplified - in production use a library like rrule)
    const instances: ScheduleInsert[] = [];
    const startDate = new Date(data.start_time);
    const maxInstances = recurrenceRule.count || 52; // Default to 1 year of weekly events

    for (let i = 1; i < maxInstances; i++) {
      const instanceStart = new Date(startDate);
      const instanceEnd = new Date(data.end_time);

      // Calculate next occurrence based on frequency
      if (recurrenceRule.frequency === "daily") {
        instanceStart.setDate(
          instanceStart.getDate() + i * recurrenceRule.interval
        );
        instanceEnd.setDate(
          instanceEnd.getDate() + i * recurrenceRule.interval
        );
      } else if (recurrenceRule.frequency === "weekly") {
        instanceStart.setDate(
          instanceStart.getDate() + i * recurrenceRule.interval * 7
        );
        instanceEnd.setDate(
          instanceEnd.getDate() + i * recurrenceRule.interval * 7
        );
      } else if (recurrenceRule.frequency === "monthly") {
        instanceStart.setMonth(
          instanceStart.getMonth() + i * recurrenceRule.interval
        );
        instanceEnd.setMonth(
          instanceEnd.getMonth() + i * recurrenceRule.interval
        );
      }

      // Check until date
      if (recurrenceRule.until && instanceStart > recurrenceRule.until) {
        break;
      }

      instances.push({
        ...data,
        start_time: instanceStart,
        end_time: instanceEnd,
        is_recurring: false,
        parent_schedule_id: parentSchedule.id,
      });
    }

    // Insert all instances
    const { data: createdInstances, error: instancesError } = await supabase
      .from("schedules")
      .insert(instances)
      .select("id");

    if (instancesError) {
      console.error("Supabase error:", instancesError);
      return { success: false, error: instancesError.message };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/work/schedule");
    return {
      success: true,
      scheduleIds: [
        parentSchedule.id,
        ...(createdInstances?.map((s) => s.id) || []),
      ],
    };
  } catch (error) {
    console.error("Create recurring schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create recurring schedule" };
  }
}

// ============================================================================
// REMINDERS
// ============================================================================

export async function markReminderSent(
  scheduleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { error } = await supabase
      .from("schedules")
      .update({ reminder_sent: true })
      .eq("id", scheduleId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Mark reminder sent error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to mark reminder sent" };
  }
}

// ============================================================================
// DELETE
// ============================================================================

export async function deleteSchedule(
  scheduleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("schedules")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq("id", scheduleId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/schedule");
    revalidatePath("/dashboard/work/schedule");
    return { success: true };
  } catch (error) {
    console.error("Delete schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete schedule" };
  }
}
