"use server";

/**
 * Server Actions for Job Time Entries
 *
 * Handles time clock in/out functionality with:
 * - Server-side validation using Zod
 * - GPS location capture
 * - Automatic labor hours calculation
 * - RLS-secured database operations
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  jobTimeEntryInsertSchema,
  jobTimeEntryUpdateSchema,
  type JobTimeEntryInsert,
  type JobTimeEntryUpdate,
} from "@/lib/validations/database-schemas";

// ============================================================================
// CLOCK IN
// ============================================================================

export async function clockIn(
  jobId: string,
  location?: { lat: number; lng: number; accuracy?: number }
): Promise<{ success: boolean; error?: string; entryId?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      return { success: false, error: "User not associated with a company" };
    }

    // Check if user already has an active time entry for this job
    const { data: activeEntry } = await supabase
      .from("job_time_entries")
      .select("id")
      .eq("job_id", jobId)
      .eq("user_id", user.id)
      .is("clock_out", null)
      .single();

    if (activeEntry) {
      return {
        success: false,
        error: "You already have an active time entry for this job",
      };
    }

    // Create time entry
    const timeEntry: Partial<JobTimeEntryInsert> = {
      job_id: jobId,
      company_id: teamMember.company_id,
      user_id: user.id,
      clock_in: new Date(),
      entry_type: location ? "gps" : "manual",
      clock_in_location: location
        ? {
            lat: location.lat,
            lng: location.lng,
            accuracy: location.accuracy,
          }
        : null,
      gps_verified: !!location,
    };

    const validated = jobTimeEntryInsertSchema.parse(timeEntry);

    const { data, error } = await supabase
      .from("job_time_entries")
      .insert(validated)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${jobId}`);
    return { success: true, entryId: data.id };
  } catch (error) {
    console.error("Clock in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clock in",
    };
  }
}

// ============================================================================
// CLOCK OUT
// ============================================================================

export async function clockOut(
  entryId: string,
  breakMinutes: number = 0,
  location?: { lat: number; lng: number; accuracy?: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify entry belongs to user
    const { data: entry } = await supabase
      .from("job_time_entries")
      .select("id, job_id, user_id")
      .eq("id", entryId)
      .single();

    if (!entry) {
      return { success: false, error: "Time entry not found" };
    }

    if (entry.user_id !== user.id) {
      return {
        success: false,
        error: "You can only clock out your own time entries",
      };
    }

    // Update time entry
    const update: Partial<JobTimeEntryUpdate> = {
      clock_out: new Date(),
      break_minutes: breakMinutes,
      clock_out_location: location
        ? {
            lat: location.lat,
            lng: location.lng,
            accuracy: location.accuracy,
          }
        : null,
    };

    const validated = jobTimeEntryUpdateSchema.parse(update);

    const { error } = await supabase
      .from("job_time_entries")
      .update(validated)
      .eq("id", entryId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${entry.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Clock out error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clock out",
    };
  }
}

// ============================================================================
// UPDATE TIME ENTRY
// ============================================================================

export async function updateTimeEntry(
  entryId: string,
  data: Partial<JobTimeEntryUpdate>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify entry belongs to user or user is admin
    const { data: entry } = await supabase
      .from("job_time_entries")
      .select("id, job_id, user_id, company_id")
      .eq("id", entryId)
      .single();

    if (!entry) {
      return { success: false, error: "Time entry not found" };
    }

    // Check if user is admin or owner of entry
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("company_id", entry.company_id)
      .single();

    const role = Array.isArray(teamMember?.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember?.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (entry.user_id !== user.id && !isAdmin) {
      return {
        success: false,
        error: "You can only edit your own time entries",
      };
    }

    const validated = jobTimeEntryUpdateSchema.parse(data);

    const { error } = await supabase
      .from("job_time_entries")
      .update(validated)
      .eq("id", entryId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${entry.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Update time entry error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update time entry",
    };
  }
}

// ============================================================================
// DELETE TIME ENTRY
// ============================================================================

export async function deleteTimeEntry(
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify entry belongs to user or user is admin
    const { data: entry } = await supabase
      .from("job_time_entries")
      .select("id, job_id, user_id, company_id")
      .eq("id", entryId)
      .single();

    if (!entry) {
      return { success: false, error: "Time entry not found" };
    }

    // Check if user is admin or owner of entry
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("company_id", entry.company_id)
      .single();

    const role = Array.isArray(teamMember?.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember?.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (entry.user_id !== user.id && !isAdmin) {
      return {
        success: false,
        error: "You can only delete your own time entries",
      };
    }

    const { error } = await supabase
      .from("job_time_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${entry.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Delete time entry error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete time entry",
    };
  }
}

// ============================================================================
// GET ACTIVE TIME ENTRY
// ============================================================================

export async function getActiveTimeEntry(
  jobId: string
): Promise<{
  success: boolean;
  error?: string;
  entry?: any;
}> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: entry, error } = await supabase
      .from("job_time_entries")
      .select("*")
      .eq("job_id", jobId)
      .eq("user_id", user.id)
      .is("clock_out", null)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" which is acceptable
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, entry: entry || null };
  } catch (error) {
    console.error("Get active time entry error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get active time entry",
    };
  }
}
