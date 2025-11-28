/**
 * Role Actions - Server Actions
 *
 * Server-side actions for role management and permission checks.
 * Uses Supabase RLS and database functions for security.
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
	getUserRole,
	hasPermission,
	hasRole,
	isCompanyOwner,
	type Permission,
	type UserRole,
} from "@/lib/auth/permissions";
import { requireCompanyMembership, withErrorHandling } from "@/lib/errors/with-error-handling";

// ============================================================================
// Validation Schemas
// ============================================================================

const updateRoleSchema = z.object({
	teamMemberId: z.string().uuid(),
	newRole: z.enum([
		"owner",
		"admin",
		"manager",
		"dispatcher",
		"technician",
		"csr",
	]),
	reason: z.string().optional(),
});

const updatePermissionsSchema = z.object({
	teamMemberId: z.string().uuid(),
	permissions: z.record(z.string(), z.boolean()),
});

// ============================================================================
// Query Actions
// ============================================================================

/**
 * Get current user's role in active company
 *
 * @returns User's role or null
 *
 * @example
 * ```typescript
 * const role = await getCurrentUserRole();
 * if (role.success && role.data === "manager") {
 *   // Show manager dashboard
 * }
 * ```
 */
export async function getCurrentUserRole() {
	return withErrorHandling(async () => {
		const { userId, companyId, supabase } = await requireCompanyMembership();

		const role = await getUserRole(supabase, userId, companyId);

		return role;
	});
}

/**
 * Check if current user has a specific permission
 *
 * @param permission - Permission to check
 * @returns true if user has permission
 *
 * @example
 * ```typescript
 * const result = await checkPermission("delete_jobs");
 * if (!result.success || !result.data) {
 *   return { error: "Access denied" };
 * }
 * ```
 */
async function checkPermission(permission: Permission) {
	return withErrorHandling(async () => {
		const { userId, companyId, supabase } = await requireCompanyMembership();

		const hasPerm = await hasPermission(
			supabase,
			userId,
			permission,
			companyId,
		);

		return hasPerm;
	});
}

/**
 * Check if current user has a specific role
 *
 * @param role - Role to check
 * @returns true if user has role
 *
 * @example
 * ```typescript
 * const result = await checkRole("manager");
 * if (!result.success || !result.data) {
 *   redirect("/dashboard");
 * }
 * ```
 */
async function checkRole(role: UserRole) {
	return withErrorHandling(async () => {
		const { userId, companyId, supabase } = await requireCompanyMembership();

		const hasRoleResult = await hasRole(supabase, userId, role, companyId);

		return hasRoleResult;
	});
}

/**
 * Check if current user is company owner
 *
 * @returns true if user is owner
 */
async function checkIsOwner() {
	return withErrorHandling(async () => {
		const { userId, companyId, supabase } = await requireCompanyMembership();

		const isOwner = await isCompanyOwner(supabase, userId, companyId);

		return isOwner;
	});
}

// ============================================================================
// Mutation Actions
// ============================================================================

/**
 * Update team member's role
 * Only owners and admins can change roles
 *
 * @param input - Team member ID, new role, and optional reason
 * @returns Updated team member
 *
 * @example
 * ```typescript
 * const result = await updateTeamMemberRole({
 *   teamMemberId: "123...",
 *   newRole: "manager",
 *   reason: "Promoted to management"
 * });
 * ```
 */
async function updateTeamMemberRole(input: z.infer<typeof updateRoleSchema>) {
	return withErrorHandling(async () => {
		// Validate input
		const validated = updateRoleSchema.parse(input);

		const { userId, companyId, supabase } = await requireCompanyMembership();

		// Check permission - only owners and admins can change roles
		const canManageRoles =
			(await isCompanyOwner(supabase, userId, companyId)) ||
			(await hasRole(supabase, userId, "admin", companyId));

		if (!canManageRoles) {
			throw new Error("Only owners and admins can change roles");
		}

		// Get current role for audit log
		const { data: currentMember } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("id", validated.teamMemberId)
			.eq("company_id", companyId)
			.single();

		if (!currentMember) {
			throw new Error("Team member not found");
		}

		// Update role
		const { data: updatedMember, error } = await supabase
			.from("company_memberships")
			.update({ role: validated.newRole })
			.eq("id", validated.teamMemberId)
			.eq("company_id", companyId)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		// Log role change
		await supabase.from("role_change_log").insert({
			team_member_id: validated.teamMemberId,
			changed_by: userId,
			old_role: currentMember.role,
			new_role: validated.newRole,
			reason: validated.reason,
		});

		revalidatePath("/dashboard/settings/team");
		revalidatePath(`/dashboard/settings/team/${validated.teamMemberId}`);

		return updatedMember;
	});
}

/**
 * Update team member's custom permissions
 * Only owners and admins can change permissions
 *
 * @param input - Team member ID and permissions object
 * @returns Updated team member
 *
 * @example
 * ```typescript
 * const result = await updateTeamMemberPermissions({
 *   teamMemberId: "123...",
 *   permissions: {
 *     "delete_jobs": true,
 *     "approve_estimates": true
 *   }
 * });
 * ```
 */
async function updateTeamMemberPermissions(
	input: z.infer<typeof updatePermissionsSchema>,
) {
	return withErrorHandling(async () => {
		// Validate input
		const validated = updatePermissionsSchema.parse(input);

		const { userId, companyId, supabase } = await requireCompanyMembership();

		// Check permission
		const canManagePermissions =
			(await isCompanyOwner(supabase, userId, companyId)) ||
			(await hasRole(supabase, userId, "admin", companyId));

		if (!canManagePermissions) {
			throw new Error("Only owners and admins can change permissions");
		}

		// Update permissions
		const { data: updatedMember, error } = await supabase
			.from("company_memberships")
			.update({ permissions: validated.permissions })
			.eq("id", validated.teamMemberId)
			.eq("company_id", companyId)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		revalidatePath("/dashboard/settings/team");
		revalidatePath(`/dashboard/settings/team/${validated.teamMemberId}`);

		return updatedMember;
	});
}

/**
 * Get team members with their roles
 *
 * @returns List of team members with roles
 */
async function getTeamMembersWithRoles() {
	return withErrorHandling(async () => {
		const { companyId, supabase } = await requireCompanyMembership();

		const { data, error } = await supabase
			.from("company_memberships")
			.select(
				`
        *,
        users (
          id,
          name,
          email,
          avatar
        )
      `,
			)
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new Error(error.message);
		}

		return data;
	});
}

// ============================================================================
// Owner Protection Actions
// ============================================================================

/**
 * Transfer company ownership to another team member
 * Requires password verification and extensive validation
 *
 * @param input - Transfer details including new owner, password, and reason
 * @returns Transfer ID for audit
 *
 * @example
 * ```typescript
 * const result = await transferOwnership({
 *   newOwnerId: "user-uuid",
 *   password: "current-password",
 *   reason: "Retiring from business"
 * });
 * ```
 */
async function transferOwnership(input: {
	newOwnerId: string;
	password: string;
	reason?: string;
	ipAddress?: string;
	userAgent?: string;
}) {
	return withErrorHandling(async () => {
		const { userId, companyId, supabase } = await requireCompanyMembership();

		// Verify user is current owner
		const isOwner = await isCompanyOwner(supabase, userId, companyId);
		if (!isOwner) {
			throw new Error("Only the current owner can transfer ownership");
		}

		// Get user email for password verification
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// Verify password
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: user?.email || "",
			password: input.password,
		});

		if (signInError) {
			throw new Error("Password verification failed");
		}

		// Call database function to transfer ownership
		const { data: transferId, error } = await supabase.rpc(
			"transfer_company_ownership",
			{
				p_company_id: companyId,
				p_current_owner_id: userId,
				p_new_owner_id: input.newOwnerId,
				p_reason: input.reason,
				p_ip_address: input.ipAddress,
				p_user_agent: input.userAgent,
			},
		);

		if (error) {
			throw new Error(error.message || "Failed to transfer ownership");
		}

		// Revalidate all relevant paths
		revalidatePath("/dashboard/settings/team");
		revalidatePath("/dashboard");

		return transferId;
	});
}

/**
 * Get ownership transfer history for the company
 * Shows audit trail of all ownership changes
 *
 * @returns List of ownership transfers
 */
async function getOwnershipTransferHistory() {
	return withErrorHandling(async () => {
		const { userId, companyId, supabase } = await requireCompanyMembership();

		// Only owners and admins can view transfer history
		const canView =
			(await isCompanyOwner(supabase, userId, companyId)) ||
			(await hasRole(supabase, userId, "admin", companyId));

		if (!canView) {
			throw new Error("Only owners and admins can view transfer history");
		}

		const { data, error } = await supabase
			.from("ownership_transfers")
			.select(
				`
        *,
        previous_owner:users!ownership_transfers_previous_owner_id_fkey(id, name, email),
        new_owner:users!ownership_transfers_new_owner_id_fkey(id, name, email),
        initiated_by_user:users!ownership_transfers_initiated_by_fkey(id, name, email)
      `,
			)
			.eq("company_id", companyId)
			.order("created_at", { ascending: false });

		if (error) {
			throw new Error(error.message);
		}

		return data;
	});
}

/**
 * Check if a team member can be deleted
 * Prevents deletion of company owner
 *
 * @param teamMemberId - Team member to check
 * @returns Object with canDelete boolean and reason if not allowed
 */
export async function canDeleteTeamMember(teamMemberId: string) {
	return withErrorHandling(async () => {
		const { companyId, supabase } = await requireCompanyMembership();

		// Get team member details
		const { data: teamMember, error } = await supabase
			.from("company_memberships")
			.select("user_id, role")
			.eq("id", teamMemberId)
			.eq("company_id", companyId)
			.single();

		if (error || !teamMember) {
			throw new Error("Team member not found");
		}

		// Check if user is company owner
		const { data: company } = await supabase
			.from("companies")
			.select("owner_id")
			.eq("id", companyId)
			.single();

		if (company && company.owner_id === teamMember.user_id) {
			return {
				canDelete: false,
				reason:
					"Cannot delete company owner. Transfer ownership first before removing this team member.",
			};
		}

		return {
			canDelete: true,
		};
	});
}
