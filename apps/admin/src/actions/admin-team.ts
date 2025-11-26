"use server";

/**
 * Admin Team Management Actions
 *
 * Server actions for managing team members in view-as mode.
 * Includes password resets, role changes, and access management.
 */

import {
	executeAdminAction,
	getBeforeData,
	logDetailedAction,
	validateCompanyOwnership,
	type ActionResult,
} from "@/lib/admin-actions/framework";
import { getImpersonatedCompanyId } from "@/lib/admin-context";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { revalidatePath } from "next/cache";

/**
 * Reset Team Member Password
 *
 * Sends a password reset email to a team member.
 * CRITICAL: This action has security implications.
 */
export async function resetTeamMemberPassword(
	teamMemberId: string,
	reason: string,
): Promise<ActionResult<{ passwordResetSent: boolean; email: string }>> {
	return executeAdminAction(
		{
			permission: "reset_password",
			action: "reset_team_member_password",
			resourceType: "team_member",
			resourceId: teamMemberId,
			reason: `Password reset requested: ${reason}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"team_members",
				teamMemberId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Team member does not belong to this company");
			}

			// Get team member with user data
			const { data: teamMember, error: fetchError } = await supabase
				.from("team_members")
				.select(
					`
          id,
          email,
          user_id,
          users!team_members_user_id_users_id_fk (
            email
          )
        `,
				)
				.eq("id", teamMemberId)
				.single();

			if (fetchError || !teamMember) {
				throw new Error("Team member not found");
			}

			// Get user email
			const users = Array.isArray(teamMember.users)
				? teamMember.users[0]
				: teamMember.users;
			const userEmail = users?.email || teamMember.email;

			if (!userEmail) {
				throw new Error("No email found for team member");
			}

			// Use admin client to send password reset email
			const adminSupabase = createAdminClient();
			const { error: resetError } = await adminSupabase.auth.resetPasswordForEmail(
				userEmail,
				{
					redirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}/reset-password`,
				},
			);

			if (resetError) {
				throw new Error(`Failed to send password reset: ${resetError.message}`);
			}

			// Log action
			await logDetailedAction(
				"reset_team_member_password",
				"team_member",
				teamMemberId,
				{ email: userEmail },
				{ password_reset_sent: true },
				reason,
			);

			return {
				passwordResetSent: true,
				email: userEmail,
			};
		},
	);
}

/**
 * Change Team Member Role
 *
 * Updates a team member's role in the company.
 */
export async function changeTeamMemberRole(
	teamMemberId: string,
	newRole: string,
	reason?: string,
): Promise<ActionResult<{ roleChanged: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_team",
			action: "change_team_member_role",
			resourceType: "team_member",
			resourceId: teamMemberId,
			reason: reason || `Changed role to ${newRole}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"team_members",
				teamMemberId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Team member does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"team_members",
				teamMemberId,
				"id, role",
			);

			// Update role
			const { error } = await supabase
				.from("team_members")
				.update({
					role: newRole,
					updated_at: new Date().toISOString(),
				})
				.eq("id", teamMemberId);

			if (error) {
				throw new Error(`Failed to change role: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"change_team_member_role",
				"team_member",
				teamMemberId,
				beforeData,
				{ role: newRole },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/team`);

			return { roleChanged: true };
		},
	);
}

/**
 * Update Team Member Status
 *
 * Activates, deactivates, or suspends a team member.
 */
export async function updateTeamMemberStatus(
	teamMemberId: string,
	newStatus: string,
	reason?: string,
): Promise<ActionResult<{ statusUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_team",
			action: "update_team_member_status",
			resourceType: "team_member",
			resourceId: teamMemberId,
			reason: reason || `Changed status to ${newStatus}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"team_members",
				teamMemberId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Team member does not belong to this company");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"team_members",
				teamMemberId,
				"id, status",
			);

			// Update status
			const { error } = await supabase
				.from("team_members")
				.update({
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq("id", teamMemberId);

			if (error) {
				throw new Error(`Failed to update status: ${error.message}`);
			}

			// Log with before/after data
			await logDetailedAction(
				"update_team_member_status",
				"team_member",
				teamMemberId,
				beforeData,
				{ status: newStatus },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/team`);

			return { statusUpdated: true };
		},
	);
}

/**
 * Update Team Member Email
 *
 * Changes a team member's email address.
 */
export async function updateTeamMemberEmail(
	teamMemberId: string,
	newEmail: string,
	reason: string,
): Promise<ActionResult<{ emailUpdated: boolean }>> {
	return executeAdminAction(
		{
			permission: "edit_team",
			action: "update_team_member_email",
			resourceType: "team_member",
			resourceId: teamMemberId,
			reason: `Updated email to ${newEmail}: ${reason}`,
		},
		async (supabase, sessionId) => {
			const companyId = await getImpersonatedCompanyId();
			if (!companyId) {
				throw new Error("Not in view-as mode");
			}

			const isOwned = await validateCompanyOwnership(
				"team_members",
				teamMemberId,
				companyId,
			);
			if (!isOwned) {
				throw new Error("Team member does not belong to this company");
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(newEmail)) {
				throw new Error("Invalid email format");
			}

			// Get before data
			const beforeData = await getBeforeData(
				"team_members",
				teamMemberId,
				"id, email, user_id",
			);

			// Update team member email
			const { error: teamError } = await supabase
				.from("team_members")
				.update({
					email: newEmail,
					updated_at: new Date().toISOString(),
				})
				.eq("id", teamMemberId);

			if (teamError) {
				throw new Error(`Failed to update team member email: ${teamError.message}`);
			}

			// If there's a linked user, update their email too
			if (beforeData?.user_id) {
				const adminSupabase = createAdminClient();
				const { error: userError } = await adminSupabase.auth.admin.updateUserById(
					beforeData.user_id,
					{
						email: newEmail,
					},
				);

				if (userError) {
					console.warn("Failed to update user email:", userError);
					// Don't fail the whole operation if user email update fails
				}
			}

			// Log with before/after data
			await logDetailedAction(
				"update_team_member_email",
				"team_member",
				teamMemberId,
				beforeData,
				{ email: newEmail },
				reason,
			);

			revalidatePath(`/admin/dashboard/view-as/${companyId}/work/team`);

			return { emailUpdated: true };
		},
	);
}
