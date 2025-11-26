/**
 * Team Assignment Actions
 *
 * Server actions for managing job team member assignments.
 * Handles adding, removing, and updating team member assignments.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	ActionError,
	type ActionResult,
	ERROR_CODES,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

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
async function getJobTeamAssignments(
	jobId: string,
): Promise<ActionResult<TeamMemberAssignment[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new ActionError("Unauthorized", ERROR_CODES.AUTH_UNAUTHORIZED, 401);
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"No active company selected",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		const serviceSupabase = await createServiceSupabaseClient();
		if (!serviceSupabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify job belongs to company
		const { data: job, error: jobError } = await serviceSupabase
			.from("jobs")
			.select("id")
			.eq("id", jobId)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.maybeSingle();

		if (jobError) {
			throw new ActionError(
				"Failed to load job",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: jobError.hint,
					details: jobError.details,
				},
			);
		}

		if (!job) {
			throw new ActionError(
				"Job not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// Get team assignments with member details
		const { data: assignments, error: assignmentsError } = await serviceSupabase
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
        company_memberships!inner (
          id,
          user_id,
          job_title,
          company_id
        )
      `,
			)
			.eq("job_id", jobId)
			.eq("company_memberships.company_id", companyId)
			.is("removed_at", null)
			.order("assigned_at", { ascending: true })
			.limit(50);

		if (assignmentsError) {
			throw new ActionError(
				"Failed to load team assignments",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: assignmentsError.hint,
					details: assignmentsError.details,
				},
			);
		}

		if (!assignments || assignments.length === 0) {
			return [];
		}

		// Get user details from public.users table
		const userIds = assignments
			.map((a: any) => a.company_memberships?.user_id)
			.filter(Boolean);
		const { data: users, error: usersError } = await serviceSupabase
			.from("profiles")
			.select("id, email, full_name, avatar_url, phone")
			.in("id", userIds);

		if (usersError) {
			throw new ActionError(
				"Failed to load user details",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: usersError.hint,
					details: usersError.details,
				},
			);
		}

		// Create a map of users by ID for quick lookup
		const usersMap = new Map((users || []).map((user) => [user.id, user]));

		// Transform to expected format
		const transformed = assignments.map((assignment: any) => {
			const memberUser = usersMap.get(assignment.company_memberships?.user_id);

			return {
				id: assignment.id,
				jobId: assignment.job_id,
				teamMemberId: assignment.team_member_id,
				role: assignment.role,
				assignedAt: assignment.assigned_at,
				assignedBy: assignment.assigned_by,
				notes: assignment.notes,
				teamMember: {
					id: assignment.company_memberships.id,
					userId: assignment.company_memberships.user_id,
					jobTitle: assignment.company_memberships.job_title,
					user: memberUser
						? {
								id: memberUser.id,
								email: memberUser.email,
								firstName: memberUser.full_name?.split(" ")[0] || null,
								lastName:
									memberUser.full_name?.split(" ").slice(1).join(" ") || null,
								avatarUrl: memberUser.avatar_url,
								phone: memberUser.phone,
							}
						: {
								id:
									assignment.company_memberships.user_id ??
									assignment.company_memberships.id,
								email: "",
								firstName: null,
								lastName: null,
								avatarUrl: null,
								phone: null,
							},
				},
			};
		});

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
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new ActionError("Unauthorized", ERROR_CODES.AUTH_UNAUTHORIZED, 401);
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"No active company selected",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		const serviceSupabase = await createServiceSupabaseClient();
		if (!serviceSupabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Get all active team members in company
		const { data: members, error: membersError } = await serviceSupabase
			.from("company_memberships")
			.select("id, user_id, job_title, status, company_id")
			.eq("company_id", companyId)
			.eq("status", "active")
			.limit(200);

		if (membersError) {
			throw new ActionError(
				"Failed to load team members",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: membersError.hint,
					details: membersError.details,
				},
			);
		}

		if (!members || members.length === 0) {
			return [];
		}

		// Get user details from public.users table
		const userIds = members.map((m) => m.user_id).filter(Boolean);
		const { data: users, error: usersError } = await serviceSupabase
			.from("profiles")
			.select("id, email, full_name, avatar_url, phone")
			.in("id", userIds);

		if (usersError) {
			throw new ActionError(
				"Failed to load user details",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: usersError.hint,
					details: usersError.details,
				},
			);
		}

		// Create a map of users by ID for quick lookup
		const usersMap = new Map((users || []).map((user) => [user.id, user]));

		// Transform to expected format
		const transformed = members.map((member) => {
			const memberUser = usersMap.get(member.user_id);

			return {
				id: member.id,
				userId: member.user_id,
				jobTitle: member.job_title,
				status: member.status,
				user: memberUser
					? {
							id: memberUser.id,
							email: memberUser.email,
							firstName: memberUser.full_name?.split(" ")[0] || null,
							lastName:
								memberUser.full_name?.split(" ").slice(1).join(" ") || null,
							avatarUrl: memberUser.avatar_url,
							phone: memberUser.phone,
						}
					: {
							id: member.user_id ?? member.id,
							email: "",
							firstName: null,
							lastName: null,
							avatarUrl: null,
							phone: null,
						},
			};
		});

		// Sort by user name
		transformed.sort((a, b) => {
			const nameA = [a.user.firstName, a.user.lastName]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			const nameB = [b.user.firstName, b.user.lastName]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return nameA.localeCompare(nameB);
		});

		return transformed;
	});
}

/**
 * Assign a team member to a job
 */
export async function assignTeamMemberToJob(
	input: z.infer<typeof assignTeamMemberSchema>,
): Promise<ActionResult<{ id: string }>> {
	return withErrorHandling(async () => {
		const validated = assignTeamMemberSchema.parse(input);
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new ActionError("Unauthorized", ERROR_CODES.AUTH_UNAUTHORIZED, 401);
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"No active company selected",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", validated.jobId)
			.eq("company_id", companyId)
			.maybeSingle();

		if (jobError) {
			throw new ActionError(
				"Failed to load job",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: jobError.hint,
					details: jobError.details,
				},
			);
		}

		if (!job) {
			throw new ActionError(
				"Job not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// Verify team member belongs to company
		// Note: job_team_assignments.team_member_id references team_members(id), not company_memberships(id)
		// So we need to check if the company_memberships.id corresponds to a team_members.id
		// First, get the company_membership to find the user_id
		const { data: companyMembership, error: membershipError } = await supabase
			.from("company_memberships")
			.select("id, user_id")
			.eq("id", validated.teamMemberId)
			.eq("company_id", companyId)
			.maybeSingle();

		if (membershipError) {
			throw new ActionError(
				"Failed to load team member",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: membershipError.hint,
					details: membershipError.details,
				},
			);
		}

		if (!companyMembership) {
			throw new ActionError(
				"Team member not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// Now find the corresponding team_members record
		const { data: targetMember, error: targetError } = await supabase
			.from("team_members")
			.select("id")
			.eq("user_id", companyMembership.user_id)
			.eq("company_id", companyId)
			.maybeSingle();

		if (targetError) {
			throw new ActionError(
				"Failed to load team member record",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: targetError.hint,
					details: targetError.details,
				},
			);
		}

		if (!targetMember) {
			throw new ActionError(
				"Team member record not found. Please ensure the team member has a corresponding team_members record.",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// Use the team_members.id for the assignment (not company_memberships.id)
		const actualTeamMemberId = targetMember.id;

		// If assigning as primary, remove other primary assignments
		if (validated.role === "primary") {
			const { error: demoteError } = await supabase
				.from("job_team_assignments")
				.update({ role: "crew" })
				.eq("job_id", validated.jobId)
				.eq("role", "primary")
				.is("removed_at", null);

			if (demoteError) {
				throw new ActionError(
					"Failed to update primary assignment",
					ERROR_CODES.DB_UPDATE_ERROR,
					500,
					{ hint: demoteError.hint, details: demoteError.details },
				);
			}
		}

		// Check if assignment already exists (active or soft-deleted)
		// Use actualTeamMemberId (team_members.id) not company_memberships.id
		const { data: existingAssignment } = await supabase
			.from("job_team_assignments")
			.select("id, removed_at")
			.eq("job_id", validated.jobId)
			.eq("team_member_id", actualTeamMemberId)
			.maybeSingle();

		let assignment: { id: string } | null = null;
		let error = null;
		const isReassignment = !!existingAssignment;

		if (existingAssignment) {
			// UPDATE existing assignment (handle re-assignments)
			const result = await supabase
				.from("job_team_assignments")
				.update({
					role: validated.role,
					assigned_by: user.id,
					notes: validated.notes || null,
					removed_at: null,
					assigned_at: new Date().toISOString(),
				})
				.eq("id", existingAssignment.id)
				.select("id")
				.single();

			assignment = result.data;
			error = result.error;
		} else {
			// INSERT new assignment
			// Use actualTeamMemberId (team_members.id) not company_memberships.id
			const result = await supabase
				.from("job_team_assignments")
				.insert({
					job_id: validated.jobId,
					team_member_id: actualTeamMemberId,
					role: validated.role,
					assigned_by: user.id,
					notes: validated.notes || null,
				})
				.select("id")
				.single();

			assignment = result.data;
			error = result.error;
		}

		if (error || !assignment) {
			console.error("Assignment error details:", {
				error,
				teamMemberId: validated.teamMemberId,
				jobId: validated.jobId,
				role: validated.role,
				existingAssignment,
			});
			throw new ActionError(
				error?.message || "Failed to assign team member",
				ERROR_CODES.DB_UPDATE_ERROR,
				500,
				{
					hint: error?.hint,
					details: error?.details,
					code: error?.code,
					message: error?.message,
				},
			);
		}

		// NOTE: We do NOT auto-assign to appointments anymore
		// Job-level assignments are for planning/oversight
		// Appointment-level assignments are explicit scheduling decisions
		// The UI will suggest job-level team members when creating appointments

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${validated.jobId}`);
		revalidatePath(`/dashboard/work/${validated.jobId}`);

		return { id: assignment.id, wasReassignment: isReassignment };
	});
}

/**
 * Remove a team member from a job (soft delete)
 */
export async function removeTeamMemberFromJob(
	input: z.infer<typeof removeTeamMemberSchema>,
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const validated = removeTeamMemberSchema.parse(input);
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new ActionError("Unauthorized", ERROR_CODES.AUTH_UNAUTHORIZED, 401);
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"No active company selected",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company before removing assignments
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", validated.jobId)
			.eq("company_id", companyId)
			.maybeSingle();

		if (jobError) {
			throw new ActionError(
				"Failed to load job",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: jobError.hint,
					details: jobError.details,
				},
			);
		}

		if (!job) {
			throw new ActionError(
				"Job not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
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

		if (error || !assignment) {
			throw new ActionError(
				"Failed to remove team member",
				ERROR_CODES.DB_UPDATE_ERROR,
				500,
				{
					hint: error.hint,
					details: error.details,
				},
			);
		}

		// NOTE: We do NOT remove from appointments when removing from job
		// Appointment assignments are independent - may want to keep scheduled team member
		// even if they're no longer on the job-level team

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${validated.jobId}`);
		revalidatePath(`/dashboard/work/${validated.jobId}`);
	});
}

/**
 * Bulk assign team members to a job
 */
async function bulkAssignTeamMembers(
	input: z.infer<typeof bulkAssignTeamMembersSchema>,
): Promise<ActionResult<{ assigned: number }>> {
	return withErrorHandling(async () => {
		const validated = bulkAssignTeamMembersSchema.parse(input);
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new ActionError("Unauthorized", ERROR_CODES.AUTH_UNAUTHORIZED, 401);
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"No active company selected",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", validated.jobId)
			.eq("company_id", companyId)
			.maybeSingle();

		if (jobError) {
			throw new ActionError(
				"Failed to load job",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: jobError.hint,
					details: jobError.details,
				},
			);
		}

		if (!job) {
			throw new ActionError(
				"Job not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// Create assignments in bulk
		const assignments = validated.teamMemberIds.map((teamMemberId) => ({
			job_id: validated.jobId,
			team_member_id: teamMemberId,
			role: validated.role,
			assigned_by: user.id,
		}));

		const { error, count } = await supabase
			.from("job_team_assignments")
			.upsert(assignments, {
				onConflict: "job_id,team_member_id",
			});

		if (error || !assignment) {
			throw new ActionError(
				"Failed to assign team members",
				ERROR_CODES.DB_UPDATE_ERROR,
				500,
				{
					hint: error.hint,
					details: error.details,
				},
			);
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
async function updateTeamMemberRole(
	jobId: string,
	teamMemberId: string,
	newRole: "primary" | "assistant" | "crew" | "supervisor",
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError(
				"Database connection failed",
				ERROR_CODES.DB_CONNECTION_ERROR,
			);
		}

		// Verify user authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			throw new ActionError("Unauthorized", ERROR_CODES.AUTH_UNAUTHORIZED, 401);
		}

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			throw new ActionError(
				"No active company selected",
				ERROR_CODES.AUTH_FORBIDDEN,
				403,
			);
		}

		// Verify job belongs to company
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select("id")
			.eq("id", jobId)
			.eq("company_id", companyId)
			.maybeSingle();

		if (jobError) {
			throw new ActionError(
				"Failed to load job",
				ERROR_CODES.DB_QUERY_ERROR,
				500,
				{
					hint: jobError.hint,
					details: jobError.details,
				},
			);
		}

		if (!job) {
			throw new ActionError(
				"Job not found",
				ERROR_CODES.DB_RECORD_NOT_FOUND,
				404,
			);
		}

		// If updating to primary, remove other primary assignments first
		if (newRole === "primary") {
			const { error: demoteError } = await supabase
				.from("job_team_assignments")
				.update({ role: "crew" })
				.eq("job_id", jobId)
				.eq("role", "primary")
				.is("removed_at", null);

			if (demoteError) {
				throw new ActionError(
					"Failed to update primary assignment",
					ERROR_CODES.DB_UPDATE_ERROR,
					500,
					{ hint: demoteError.hint, details: demoteError.details },
				);
			}
		}

		// Update the role
		const { error } = await supabase
			.from("job_team_assignments")
			.update({ role: newRole })
			.eq("job_id", jobId)
			.eq("team_member_id", teamMemberId)
			.is("removed_at", null);

		if (error || !assignment) {
			throw new ActionError(
				"Failed to update team member role",
				ERROR_CODES.DB_UPDATE_ERROR,
				500,
				{
					hint: error.hint,
					details: error.details,
				},
			);
		}

		// Revalidate paths
		revalidatePath("/dashboard/work");
		revalidatePath(`/dashboard/work/jobs/${jobId}`);
	});
}
