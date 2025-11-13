/**
 * Team Member Server Actions
 *
 * Server-side operations for team members
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

/**
 * Get team member by ID with all related data
 */
export async function getTeamMember(
  teamMemberId: string
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

    // Get team member with related data
    const { data: teamMember, error } = await supabase
      .from("team_members")
      .select(`
        *,
        user:users(*),
        company:companies(*)
      `)
      .eq("id", teamMemberId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!teamMember) {
      return { success: false, error: "Team member not found" };
    }

    return { success: true, data: teamMember };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get team member",
    };
  }
}

/**
 * Update team member
 */
export async function updateTeamMember(
  teamMemberId: string,
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const updates: any = {};

    if (formData.has("role")) {
      updates.role = formData.get("role");
    }

    if (formData.has("status")) {
      updates.status = formData.get("status");
    }

    if (formData.has("hourly_rate")) {
      updates.hourly_rate = Number.parseFloat(
        formData.get("hourly_rate") as string
      );
    }

    if (formData.has("phone")) {
      const value = formData.get("phone");
      updates.phone = value ? value.toString() : null;
    }

    if (formData.has("job_title")) {
      const value = formData.get("job_title");
      updates.job_title = value ? value.toString() : null;
    }

    const { data, error } = await supabase
      .from("team_members")
      .update(updates)
      .eq("id", teamMemberId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/team/${teamMemberId}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update team member",
    };
  }
}

/**
 * Get team member's assigned jobs
 */
export async function getTeamMemberJobs(
  teamMemberId: string
): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    // Get jobs assigned to this team member
    const { data: jobs, error } = await supabase
      .from("job_team_assignments")
      .select(`
        *,
        job:jobs(
          *,
          customer:customers(first_name, last_name)
        )
      `)
      .eq("team_member_id", teamMemberId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: jobs || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get jobs",
    };
  }
}

/**
 * Get team member's time entries
 */
export async function getTeamMemberTimeEntries(
  teamMemberId: string,
  limit = 50
): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { data: timeEntries, error } = await supabase
      .from("job_time_entries")
      .select(`
        *,
        job:jobs(id, job_number, title)
      `)
      .eq("user_id", teamMemberId)
      .order("clock_in", { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: timeEntries || [] };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get time entries",
    };
  }
}
