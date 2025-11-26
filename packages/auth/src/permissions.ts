/**
 * Permission System - Server-Side Utilities
 *
 * Provides type-safe permission checking for role-based access control (RBAC).
 * Uses database functions for secure, centralized permission logic.
 *
 * Performance optimizations:
 * - Database functions are cached by Postgres
 * - Single query permission checks
 * - Prepared statements for security
 *
 * @example
 * ```typescript
 * // Check if user can delete jobs
 * const canDelete = await hasPermission(supabase, userId, "delete_jobs", companyId);
 *
 * // Check if user has manager role
 * const isManager = await hasRole(supabase, userId, "manager", companyId);
 *
 * // Get user's role
 * const role = await getUserRole(supabase, userId, companyId);
 * ```
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// Types
// ============================================================================

/**
 * User roles in the system
 * Matches the user_role ENUM in database
 */
export type UserRole =
	| "owner"
	| "admin"
	| "manager"
	| "dispatcher"
	| "technician"
	| "csr";

/**
 * Permission keys for fine-grained access control
 */
export type Permission =
	// Manager permissions
	| "view_reports"
	| "manage_team"
	| "approve_estimates"
	| "handle_escalations"
	// Dispatcher permissions
	| "dispatch_jobs"
	| "manage_schedule"
	| "view_tech_locations"
	// Technician permissions
	| "update_job_status"
	| "create_invoices"
	| "upload_photos"
	// CSR permissions
	| "create_jobs"
	| "schedule_appointments"
	| "send_communications"
	// View permissions
	| "view_customers"
	| "view_jobs"
	| "view_schedule"
	// Delete permissions
	| "delete_jobs"
	| "delete_customers"
	| "delete_team_members";

/**
 * Role configuration with permissions and metadata
 */
export type RoleConfig = {
	id: UserRole;
	label: string;
	description: string;
	permissions: Permission[];
	dashboardFeatures: string[];
};

// ============================================================================
// Role Definitions
// ============================================================================

/**
 * Complete role configurations with their permissions
 * Used for UI display and permission reference
 */
const ROLES: Record<UserRole, RoleConfig> = {
	owner: {
		id: "owner",
		label: "Owner",
		description:
			"Full system access with focus on business financials and growth",
		permissions: [
			"view_reports",
			"manage_team",
			"approve_estimates",
			"handle_escalations",
			"dispatch_jobs",
			"manage_schedule",
			"view_tech_locations",
			"update_job_status",
			"create_invoices",
			"upload_photos",
			"create_jobs",
			"schedule_appointments",
			"send_communications",
			"view_customers",
			"view_jobs",
			"view_schedule",
			"delete_jobs",
			"delete_customers",
			"delete_team_members",
		],
		dashboardFeatures: [
			"financial-overview",
			"profit-margins",
			"cash-flow",
			"business-growth",
			"payroll-overview",
			"all-reports",
		],
	},
	admin: {
		id: "admin",
		label: "Admin",
		description: "System administration and configuration",
		permissions: [
			"view_reports",
			"manage_team",
			"approve_estimates",
			"handle_escalations",
			"dispatch_jobs",
			"manage_schedule",
			"view_tech_locations",
			"update_job_status",
			"create_invoices",
			"upload_photos",
			"create_jobs",
			"schedule_appointments",
			"send_communications",
			"view_customers",
			"view_jobs",
			"view_schedule",
			"delete_jobs",
			"delete_customers",
		],
		dashboardFeatures: [
			"system-settings",
			"user-management",
			"integrations",
			"audit-logs",
		],
	},
	manager: {
		id: "manager",
		label: "Manager",
		description:
			"Oversee team performance, customer satisfaction, and operations",
		permissions: [
			"view_reports",
			"manage_team",
			"approve_estimates",
			"handle_escalations",
			"dispatch_jobs",
			"manage_schedule",
			"view_tech_locations",
			"update_job_status",
			"create_invoices",
			"upload_photos",
			"create_jobs",
			"schedule_appointments",
			"send_communications",
			"view_customers",
			"view_jobs",
			"view_schedule",
			"delete_jobs",
		],
		dashboardFeatures: [
			"team-performance",
			"customer-satisfaction",
			"callback-queue",
			"review-alerts",
			"kpi-tracking",
			"inventory-management",
		],
	},
	dispatcher: {
		id: "dispatcher",
		label: "Dispatcher",
		description:
			"Manage technician schedules, job assignments, and real-time operations",
		permissions: [
			"view_reports",
			"dispatch_jobs",
			"manage_schedule",
			"view_tech_locations",
			"update_job_status",
			"create_jobs",
			"schedule_appointments",
			"send_communications",
			"view_customers",
			"view_jobs",
			"view_schedule",
		],
		dashboardFeatures: [
			"dispatch-map",
			"technician-locations",
			"unassigned-jobs",
			"emergency-queue",
			"quick-dispatch",
			"tech-status",
		],
	},
	technician: {
		id: "technician",
		label: "Technician",
		description:
			"View assigned jobs, update job status, and track personal performance",
		permissions: [
			"update_job_status",
			"create_invoices",
			"upload_photos",
			"view_customers",
			"view_jobs",
			"view_schedule",
		],
		dashboardFeatures: [
			"my-schedule",
			"active-job",
			"my-earnings",
			"my-performance",
			"parts-inventory",
			"time-tracking",
		],
	},
	csr: {
		id: "csr",
		label: "Customer Service Rep",
		description:
			"Handle customer calls, schedule appointments, and manage customer relationships",
		permissions: [
			"create_jobs",
			"schedule_appointments",
			"send_communications",
			"create_invoices",
			"view_customers",
			"view_jobs",
			"view_schedule",
		],
		dashboardFeatures: [
			"call-queue",
			"booking-calendar",
			"customer-search",
			"follow-up-queue",
			"estimate-pipeline",
			"call-scripts",
		],
	},
};

// ============================================================================
// Permission Check Functions
// ============================================================================

/**
 * Check if user has a specific role in a company
 *
 * @param supabase - Supabase client
 * @param userId - User ID to check
 * @param role - Role to check for
 * @param companyId - Company ID
 * @returns true if user has the role
 *
 * @example
 * ```typescript
 * const isManager = await hasRole(supabase, userId, "manager", companyId);
 * if (!isManager) {
 *   throw new Error("Access denied: Manager role required");
 * }
 * ```
 */
export async function hasRole(
	supabase: SupabaseClient,
	userId: string,
	role: UserRole,
	companyId: string,
): Promise<boolean> {
	const { data, error } = await supabase.rpc("has_role", {
		user_uuid: userId,
		required_role: role,
		company_uuid: companyId,
	});

	if (error) {
		return false;
	}

	return data === true;
}

/**
 * Check if user has ANY of the specified roles
 *
 * @param supabase - Supabase client
 * @param userId - User ID to check
 * @param roles - Array of roles to check
 * @param companyId - Company ID
 * @returns true if user has any of the roles
 *
 * @example
 * ```typescript
 * const canManage = await hasAnyRole(
 *   supabase,
 *   userId,
 *   ["owner", "manager", "admin"],
 *   companyId
 * );
 * ```
 */
async function hasAnyRole(
	supabase: SupabaseClient,
	userId: string,
	roles: UserRole[],
	companyId: string,
): Promise<boolean> {
	const { data, error } = await supabase.rpc("has_any_role", {
		user_uuid: userId,
		required_roles: roles,
		company_uuid: companyId,
	});

	if (error) {
		return false;
	}

	return data === true;
}

/**
 * Get user's role in a company
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param companyId - Company ID
 * @returns User's role or null if not found
 *
 * @example
 * ```typescript
 * const role = await getUserRole(supabase, userId, companyId);
 * console.log(`User role: ${role}`); // "manager"
 * ```
 */
export async function getUserRole(
	supabase: SupabaseClient,
	userId: string,
	companyId: string,
): Promise<UserRole | null> {
	const { data, error } = await supabase.rpc("get_user_role", {
		user_uuid: userId,
		company_uuid: companyId,
	});

	if (error) {
		return null;
	}

	return data as UserRole | null;
}

/**
 * Check if user has a specific permission
 *
 * @param supabase - Supabase client
 * @param userId - User ID to check
 * @param permission - Permission key to check
 * @param companyId - Company ID
 * @returns true if user has the permission
 *
 * @example
 * ```typescript
 * const canDelete = await hasPermission(supabase, userId, "delete_jobs", companyId);
 * if (!canDelete) {
 *   return { error: "You don't have permission to delete jobs" };
 * }
 * ```
 */
export async function hasPermission(
	supabase: SupabaseClient,
	userId: string,
	permission: Permission,
	companyId: string,
): Promise<boolean> {
	const { data, error } = await supabase.rpc("has_permission", {
		user_uuid: userId,
		permission_key: permission,
		company_uuid: companyId,
	});

	if (error) {
		return false;
	}

	return data === true;
}

/**
 * Check if user is the company owner
 *
 * @param supabase - Supabase client
 * @param userId - User ID to check
 * @param companyId - Company ID
 * @returns true if user is the owner
 *
 * @example
 * ```typescript
 * const isOwner = await isCompanyOwner(supabase, userId, companyId);
 * if (!isOwner) {
 *   throw new Error("Only company owner can perform this action");
 * }
 * ```
 */
export async function isCompanyOwner(
	supabase: SupabaseClient,
	userId: string,
	companyId: string,
): Promise<boolean> {
	const { data, error } = await supabase.rpc("is_company_owner", {
		user_uuid: userId,
		company_uuid: companyId,
	});

	if (error) {
		return false;
	}

	return data === true;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all permissions for a role
 *
 * @param role - Role to get permissions for
 * @returns Array of permission keys
 *
 * @example
 * ```typescript
 * const managerPerms = getRolePermissions("manager");
 * console.log(managerPerms); // ["view_reports", "manage_team", ...]
 * ```
 */
function getRolePermissions(role: UserRole): Permission[] {
	return ROLES[role]?.permissions || [];
}

/**
 * Check if a role has a specific permission (client-side check only)
 *
 * @param role - Role to check
 * @param permission - Permission to check for
 * @returns true if role has the permission
 *
 * @example
 * ```typescript
 * const canDelete = roleHasPermission("manager", "delete_jobs");
 * ```
 */
function roleHasPermission(role: UserRole, permission: Permission): boolean {
	return ROLES[role]?.permissions.includes(permission);
}

/**
 * Get role configuration
 *
 * @param role - Role to get config for
 * @returns Role configuration
 *
 * @example
 * ```typescript
 * const config = getRoleConfig("manager");
 * console.log(config.label); // "Manager"
 * ```
 */
function getRoleConfig(role: UserRole): RoleConfig {
	return ROLES[role];
}
