/**
 * Team Assignment Actions
 *
 * Server actions for managing job team member assignments.
 * Handles adding, removing, and updating team member assignments.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type ActionResult, withErrorHandling } from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const assignTeamMemberSchema = z.object({
	jobId: z.string().uuid(),
	teamMemberId: z.string().uuid(),
	role: z.enum(["primary", "assistant", "crew", "supervisor"]).default("crew"),
	notes: z.string().optional(),
});

const removeTeamMemberSchema = z.object({
	jobId: z.string().uuid(),
	teamMemberId: z.string().uuid(),
});

const bulkAssignTeamMembersSchema = z.object({
	jobId: z.string().uuid(),
	teamMemberIds: z.array(z.string().uuid()),
	role: z.enum(["primary", "assistant", "crew", "supervisor"]).default("crew"),
});

// ============================================================================
// TEAM MEMBER TYPES
// ============================================================================

export type TeamMemberAssignment = {
	id: string;
	jobId: string;
	teamMemberId: string;
	role: "primary" | "assistant" | "crew" | "supervisor";
	assignedAt: string;
	assignedBy: string | null;
	notes: string | null;
	teamMember: {
		id: string;
		userId: string;
		jobTitle: string | null;
		user: {
			id: string;
			email: string;
			firstName: string | null;
			lastName: string | null;
			avatarUrl: string | null;
			phone: string | null;
		};
	};
};

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Get team assignments for a job
 */
export async function getJobTeamAssignments(jobId: string): Promise<ActionResult<TeamMemberAssignment[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Server configuration error");
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			throw new Error("User is not a team member");
		}

		// Verify job belongs to company
		const { data: job } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", jobId)
			.eq("company_id", teamMember.company_id)
			.single();

		if (!job) {
			throw new Error("Job not found");
		}

		// Get team assignments with member details
		const { data: assignments, error } = await supabase
			.from("job_team_assignments")
			.select(
				`
        id,
        job_id,
        team_member_id,
        role,
        assigned_at,
        assigned_by,
        notes,
        team_members!inner (
          id,
          user_id,
          job_title,
          users!inner (
            id,
            email,
            first_name,
            last_name,
            avatar_url,
            phone
          )
        )
      `
			)
			.eq("job_id", jobId)
			.is("removed_at", null)
			.order("assigned_at", { ascending: true });

		if (error) {
			throw error;
		}

		// Transform to expected format
		const transformed = (assignments || []).map((assignment: any) => ({
			id: assignment.id,
			jobId: assignment.job_id,
			teamMemberId: assignment.team_member_id,
			role: assignment.role,
			assignedAt: assignment.assigned_at,
			assignedBy: assignment.assigned_by,
			notes: assignment.notes,
			teamMember: {
				id: assignment.team_members.id,
				userId: assignment.team_members.user_id,
				jobTitle: assignment.team_members.job_title,
				user: {
					id: assignment.team_members.users.id,
					email: assignment.team_members.users.email,
					firstName: assignment.team_members.users.first_name,
					lastName: assignment.team_members.users.last_name,
					avatarUrl: assignment.team_members.users.avatar_url,
					phone: assignment.team_members.users.phone,
				},
			},
		}));

		return transformed;
	});
}

/**
 * Get all team members available for assignment in the company
 */
export async function getAvailableTeamMembers(): Promise<
	ActionResult<
		Array<{
			id: string;
			userId: string;
			jobTitle: string | null;
			status: string;
			user: {
				id: string;
				email: string;
				firstName: string | null;
				lastName: string | null;
				avatarUrl: string | null;
				phone: string | null;
			};
		}>
	>
> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Server configuration error");
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			throw new Error("User is not a team member");
		}

		// Get all active team members in company
		const { data: members, error } = await supabase
			.from("team_members")
			.select(
				`
        id,
        user_id,
        job_title,
        status,
        users!inner (
          id,
          email,
          first_name,
          last_name,
          avatar_url,
          phone
        )
      `
			)
			.eq("company_id", teamMember.company_id)
			.eq("status", "active")
			.order("users(first_name)", { ascending: true });

		if (error) {
			throw error;
		}

		// Transform to expected format
		const transformed = (members || []).map((member: any) => ({
			id: member.id,
			userId: member.user_id,
			jobTitle: member.job_title,
			status: member.status,
			user: {
				id: member.users.id,
				email: member.users.email,
				firstName: member.users.first_name,
				lastName: member.users.last_name,
				avatarUrl: member.users.avatar_url,
				phone: member.users.phone,
			},
		}));

		return transformed;
	});
}

/**
 * Assign a team member to a job
 */
export async function assignTeamMemberToJob(
	input: z.infer<typeof assignTeamMemberSchema>
): Promise<ActionResult<{ id: string }>> {
	return withErrorHandling(async () => {
		const validated = assignTeamMemberSchema.parse(input);
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Server configuration error");
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			throw new Error("User is not a team member");
		}

		// Verify job belongs to company
		const { data: job } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", validated.jobId)
			.eq("company_id", teamMember.company_id)
			.single();

		if (!job) {
			throw new Error("Job not found");
		}

		// Verify team member belongs to company
		const { data: targetMember } = await supabase
			.from("team_members")
			.select("id")
			.eq("id", validated.teamMemberId)
			.eq("company_id", teamMember.company_id)
			.single();

		if (!targetMember) {
			throw new Error("Team member not found");
		}

		// If assigning as primary, remove other primary assignments
		if (validated.role === "primary") {
			await supabase
				.from("job_team_assignments")
				.update({ role: "crew" })
				.eq("job_id", validated.jobId)
				.eq("role", "primary")
				.is("removed_at", null);
		}

		// Create assignment (upsert to handle duplicates)
		const { data: assignment, error } = await supabase
			.from("job_team_assignments")
			.upsert(
				{
					job_id: validated.jobId,
					team_member_id: validated.teamMemberId,
					role: validated.role,
					assigned_by: user.id,
					notes: validated.notes || null,
					removed_at: null,
				},
				{
					onConflict: "job_id,team_member_id",
				}
			)
			.select("id")
			.single();

		if (error) {
			throw error;
		}

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${validated.jobId}`);

		return { id: assignment.id };
	});
}

/**
 * Remove a team member from a job (soft delete)
 */
export async function removeTeamMemberFromJob(
	input: z.infer<typeof removeTeamMemberSchema>
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const validated = removeTeamMemberSchema.parse(input);
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Server configuration error");
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			throw new Error("User is not a team member");
		}

		// Soft delete the assignment
		const { error } = await supabase
			.from("job_team_assignments")
			.update({
				removed_at: new Date().toISOString(),
				removed_by: user.id,
			})
			.eq("job_id", validated.jobId)
			.eq("team_member_id", validated.teamMemberId)
			.is("removed_at", null);

		if (error) {
			throw error;
		}

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${validated.jobId}`);
	});
}

/**
 * Bulk assign team members to a job
 */
export async function bulkAssignTeamMembers(
	input: z.infer<typeof bulkAssignTeamMembersSchema>
): Promise<ActionResult<{ assigned: number }>> {
	return withErrorHandling(async () => {
		const validated = bulkAssignTeamMembersSchema.parse(input);
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Server configuration error");
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember) {
			throw new Error("User is not a team member");
		}

		// Verify job belongs to company
		const { data: job } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", validated.jobId)
			.eq("company_id", teamMember.company_id)
			.single();

		if (!job) {
			throw new Error("Job not found");
		}

		// Create assignments in bulk
		const assignments = validated.teamMemberIds.map((teamMemberId) => ({
			job_id: validated.jobId,
			team_member_id: teamMemberId,
			role: validated.role,
			assigned_by: user.id,
		}));

		const { error, count } = await supabase.from("job_team_assignments").upsert(assignments, {
			onConflict: "job_id,team_member_id",
		});

		if (error) {
			throw error;
		}

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${validated.jobId}`);

		return { assigned: count || 0 };
	});
}

/**
 * Update team member role on a job
 */
export async function updateTeamMemberRole(
	jobId: string,
	teamMemberId: string,
	newRole: "primary" | "assistant" | "crew" | "supervisor"
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new Error("Server configuration error");
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		// If updating to primary, remove other primary assignments first
		if (newRole === "primary") {
			await supabase
				.from("job_team_assignments")
				.update({ role: "crew" })
				.eq("job_id", jobId)
				.eq("role", "primary")
				.is("removed_at", null);
		}

		// Update the role
		const { error } = await supabase
			.from("job_team_assignments")
			.update({ role: newRole })
			.eq("job_id", jobId)
			.eq("team_member_id", teamMemberId)
			.is("removed_at", null);

		if (error) {
			throw error;
		}

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${jobId}`);
	});
}
