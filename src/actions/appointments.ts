/**
 * Appointment Server Actions
 *
 * Server-side operations for appointments/schedules
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

/**
 * Get appointment by ID with all related data
 */
export async function getAppointment(
  appointmentId: string
): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get appointment with related data
    const { data: appointment, error } = await supabase
      .from("schedules")
      .select(`
        *,
        customer:customers(*),
        property:properties(*),
        job:jobs(*),
        assigned_user:users!assigned_to(*),
        team_assignments:schedule_team_assignments(
          *,
          user:users(*)
        )
      `)
      .eq("id", appointmentId)
      .is("deleted_at", null)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    return { success: true, data: appointment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get appointment",
    };
  }
}

/**
 * Update appointment
 */
export async function updateAppointment(
  appointmentId: string,
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const updates: any = {};

    if (formData.has("status")) {
      updates.status = formData.get("status");
    }

    if (formData.has("start_time")) {
      updates.start_time = formData.get("start_time");
    }

    if (formData.has("end_time")) {
      updates.end_time = formData.get("end_time");
    }

    const { data, error } = await supabase
      .from("schedules")
      .update(updates)
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/appointments/${appointmentId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update appointment",
    };
  }
}
