/**
 * Authorization Middleware & Helpers
 *
 * Centralized authorization utilities to prevent repetitive code and ensure
 * consistent security checks across all Server Actions.
 *
 * Performance optimizations:
 * - Single database query for company membership + permissions
 * - Results can be cached per request
 * - Type-safe with TypeScript
 *
 * Usage:
 * ```typescript
 * export async function updateCustomer(customerId: string, data: FormData) {
 *   return withErrorHandling(async () => {
 *     // Single line replaces 20+ lines of auth checking
 *     const membership = await requireResourceAccess("customers", customerId, "Customer");
 *
 *     // Your logic here - membership contains company_id, permissions, etc.
 *   });
 * }
 * ```
 */

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./session";

/**
 * Error class for authorization failures
 */
export class AuthorizationError extends Error {
  constructor(
    message: string,
    public code: string = "UNAUTHORIZED",
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Company Membership Data
 *
 * Contains all authorization context for the current user
 */
export type CompanyMembership = {
  companyId: string;
  userId: string;
  roleId: string | null;
  roleName: string | null;
  departmentId: string | null;
  status: string;
  permissions: string[];
};

/**
 * Get User's Company Membership
 *
 * Returns the user's active company membership with permissions.
 * Throws AuthorizationError if not authenticated or not a member.
 *
 * @returns CompanyMembership object with company_id, permissions, etc.
 * @throws AuthorizationError if user is not authenticated or not a company member
 */
export async function requireCompanyMembership(): Promise<CompanyMembership> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthorizationError(
      "You must be logged in to perform this action",
      "AUTH_REQUIRED",
      401
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    throw new AuthorizationError(
      "Database connection failed",
      "DB_ERROR",
      500
    );
  }

  // Get active company membership with role and permissions
  const { data: membership, error } = await supabase
    .from("team_members")
    .select(
      `
      company_id,
      user_id,
      role_id,
      department_id,
      status,
      custom_roles (
        name,
        permissions
      )
    `
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (error || !membership) {
    throw new AuthorizationError(
      "You must be part of a company to perform this action",
      "NO_COMPANY_ACCESS",
      403
    );
  }

  return {
    companyId: membership.company_id,
    userId: membership.user_id,
    roleId: membership.role_id,
    roleName: (membership.custom_roles as any)?.name || null,
    departmentId: membership.department_id,
    status: membership.status,
    permissions: (membership.custom_roles as any)?.permissions || [],
  };
}

/**
 * Verify Company Access
 *
 * Ensures the user has access to the specified company.
 * Throws AuthorizationError if not authorized.
 *
 * @param companyId - The company ID to verify access to
 * @returns CompanyMembership object
 * @throws AuthorizationError if user doesn't have access to this company
 */
export async function requireCompanyAccess(
  companyId: string
): Promise<CompanyMembership> {
  const membership = await requireCompanyMembership();

  if (membership.companyId !== companyId) {
    throw new AuthorizationError(
      "You don't have permission to access this company",
      "WRONG_COMPANY",
      403
    );
  }

  return membership;
}

/**
 * Verify Resource Access
 *
 * Ensures a resource belongs to the user's company.
 * Useful for verifying customers, jobs, invoices, etc.
 *
 * @param tableName - The table name (e.g., "customers", "jobs")
 * @param resourceId - The resource ID to verify
 * @param resourceName - Human-readable resource name for error messages
 * @returns CompanyMembership object
 * @throws AuthorizationError if resource doesn't exist or doesn't belong to user's company
 *
 * @example
 * ```typescript
 * const membership = await requireResourceAccess("customers", customerId, "Customer");
 * // Now you can safely access the customer - it belongs to user's company
 * ```
 */
export async function requireResourceAccess(
  tableName: string,
  resourceId: string,
  resourceName: string = "resource"
): Promise<CompanyMembership> {
  const membership = await requireCompanyMembership();
  const supabase = await createClient();

  if (!supabase) {
    throw new AuthorizationError(
      "Database connection failed",
      "DB_ERROR",
      500
    );
  }

  // Verify resource exists and belongs to user's company
  const { data: resource, error } = await supabase
    .from(tableName)
    .select("company_id")
    .eq("id", resourceId)
    .single();

  if (error || !resource) {
    throw new AuthorizationError(
      `${resourceName} not found`,
      "RESOURCE_NOT_FOUND",
      404
    );
  }

  if (resource.company_id !== membership.companyId) {
    throw new AuthorizationError(
      `You don't have permission to access this ${resourceName.toLowerCase()}`,
      "RESOURCE_FORBIDDEN",
      403
    );
  }

  return membership;
}

/**
 * Check Permission
 *
 * Verifies user has a specific permission.
 *
 * @param permission - The permission to check (e.g., "customers.edit")
 * @returns CompanyMembership object
 * @throws AuthorizationError if user doesn't have the permission
 *
 * @example
 * ```typescript
 * const membership = await requirePermission("customers.delete");
 * // User has permission to delete customers
 * ```
 */
export async function requirePermission(
  permission: string
): Promise<CompanyMembership> {
  const membership = await requireCompanyMembership();

  if (!membership.permissions.includes(permission)) {
    throw new AuthorizationError(
      "You don't have permission to perform this action",
      "INSUFFICIENT_PERMISSIONS",
      403
    );
  }

  return membership;
}

/**
 * Check Multiple Permissions (require all)
 *
 * @param permissions - Array of permissions to check
 * @returns CompanyMembership object
 * @throws AuthorizationError if user is missing any permission
 *
 * @example
 * ```typescript
 * const membership = await requireAllPermissions([
 *   "customers.edit",
 *   "customers.view_sensitive_data"
 * ]);
 * ```
 */
export async function requireAllPermissions(
  permissions: string[]
): Promise<CompanyMembership> {
  const membership = await requireCompanyMembership();

  const hasAllPermissions = permissions.every((permission) =>
    membership.permissions.includes(permission)
  );

  if (!hasAllPermissions) {
    const missingPermissions = permissions.filter(
      (p) => !membership.permissions.includes(p)
    );
    throw new AuthorizationError(
      `Missing permissions: ${missingPermissions.join(", ")}`,
      "INSUFFICIENT_PERMISSIONS",
      403
    );
  }

  return membership;
}

/**
 * Check Multiple Permissions (require any)
 *
 * @param permissions - Array of permissions to check
 * @returns CompanyMembership object
 * @throws AuthorizationError if user has none of the permissions
 *
 * @example
 * ```typescript
 * const membership = await requireAnyPermission([
 *   "customers.edit",
 *   "customers.admin"
 * ]);
 * // User has at least one of these permissions
 * ```
 */
export async function requireAnyPermission(
  permissions: string[]
): Promise<CompanyMembership> {
  const membership = await requireCompanyMembership();

  const hasAnyPermission = permissions.some((permission) =>
    membership.permissions.includes(permission)
  );

  if (!hasAnyPermission) {
    throw new AuthorizationError(
      `You need one of these permissions: ${permissions.join(", ")}`,
      "INSUFFICIENT_PERMISSIONS",
      403
    );
  }

  return membership;
}

/**
 * Check if User is Company Owner
 *
 * @returns CompanyMembership object
 * @throws AuthorizationError if user is not the company owner
 *
 * @example
 * ```typescript
 * const membership = await requireCompanyOwner();
 * // User is the owner of the company
 * ```
 */
export async function requireCompanyOwner(): Promise<CompanyMembership> {
  const membership = await requireCompanyMembership();
  const supabase = await createClient();

  if (!supabase) {
    throw new AuthorizationError(
      "Database connection failed",
      "DB_ERROR",
      500
    );
  }

  // Check if user is the owner
  const { data: company, error } = await supabase
    .from("companies")
    .select("owner_id")
    .eq("id", membership.companyId)
    .single();

  if (error || !company) {
    throw new AuthorizationError(
      "Company not found",
      "COMPANY_NOT_FOUND",
      404
    );
  }

  if (company.owner_id !== membership.userId) {
    throw new AuthorizationError(
      "Only the company owner can perform this action",
      "OWNER_REQUIRED",
      403
    );
  }

  return membership;
}

/**
 * Helper to check if user has permission (non-throwing)
 *
 * @param permission - Permission to check
 * @returns true if user has permission, false otherwise
 *
 * @example
 * ```typescript
 * if (await hasPermission("customers.delete")) {
 *   // Show delete button
 * }
 * ```
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    await requirePermission(permission);
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to get company membership without throwing (returns null if not a member)
 *
 * @returns CompanyMembership object or null
 *
 * @example
 * ```typescript
 * const membership = await getCompanyMembership();
 * if (membership) {
 *   // User is a company member
 * }
 * ```
 */
export async function getCompanyMembership(): Promise<CompanyMembership | null> {
  try {
    return await requireCompanyMembership();
  } catch {
    return null;
  }
}
