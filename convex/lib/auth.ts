/**
 * Authorization helpers for Convex
 * Replaces Supabase RLS policies with function-level authorization
 */
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";
import type { UserRole } from "./validators";

// ============================================================================
// TYPES
// ============================================================================

export interface AuthContext {
  userId: Id<"users">;
  user: Doc<"users">;
}

export interface CompanyAuthContext extends AuthContext {
  companyId: Id<"companies">;
  teamMember: Doc<"teamMembers">;
  role: UserRole;
  permissions: Record<string, boolean>;
}

// ============================================================================
// ROLE HIERARCHY
// ============================================================================

const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 100,
  admin: 90,
  manager: 70,
  dispatcher: 50,
  csr: 40,
  technician: 30,
};

// ============================================================================
// DEFAULT PERMISSIONS BY ROLE
// ============================================================================

const DEFAULT_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  owner: {
    // Owners have all permissions
    "*": true,
  },
  admin: {
    // Admins have almost all permissions
    "*": true,
    transfer_ownership: false,
    delete_company: false,
  },
  manager: {
    view_reports: true,
    manage_team: true,
    approve_estimates: true,
    handle_escalations: true,
    dispatch_jobs: true,
    manage_schedule: true,
    view_tech_locations: true,
    update_job_status: true,
    create_invoices: true,
    upload_photos: true,
    create_jobs: true,
    schedule_appointments: true,
    send_communications: true,
    view_customers: true,
    view_jobs: true,
    view_schedule: true,
    manage_customers: true,
    manage_jobs: true,
    delete_records: true,
    view_payments: true,
    process_payments: true,
    manage_equipment: true,
    manage_service_plans: true,
  },
  dispatcher: {
    view_reports: true,
    dispatch_jobs: true,
    manage_schedule: true,
    view_tech_locations: true,
    update_job_status: true,
    create_jobs: true,
    schedule_appointments: true,
    send_communications: true,
    view_customers: true,
    view_jobs: true,
    view_schedule: true,
    view_payments: true,
    manage_equipment: true,
  },
  csr: {
    create_invoices: true,
    create_jobs: true,
    schedule_appointments: true,
    send_communications: true,
    view_customers: true,
    view_jobs: true,
    view_schedule: true,
    manage_customers: true,
    view_payments: true,
    process_payments: true,
  },
  technician: {
    update_job_status: true,
    upload_photos: true,
    view_customers: true,
    view_jobs: true,
    view_schedule: true,
    view_assigned_only: true,
    manage_equipment: true,
  },
};

// ============================================================================
// CORE AUTH FUNCTIONS
// ============================================================================

/**
 * Get authenticated user from context
 * Throws if not authenticated
 */
export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx
): Promise<AuthContext> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw new Error("User account is deactivated");
  }

  return { userId: user._id, user };
}

/**
 * Get optional authenticated user (doesn't throw if not authenticated)
 */
export async function getOptionalUser(
  ctx: QueryCtx | MutationCtx
): Promise<AuthContext | null> {
  try {
    return await getAuthenticatedUser(ctx);
  } catch {
    return null;
  }
}

/**
 * Get user's membership in a specific company
 * Throws if user is not a member of the company
 */
export async function getCompanyMembership(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  companyId: Id<"companies">
): Promise<{ teamMember: Doc<"teamMembers">; company: Doc<"companies"> }> {
  const company = await ctx.db.get(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  if (company.deletedAt) {
    throw new Error("Company has been deleted");
  }

  const teamMember = await ctx.db
    .query("teamMembers")
    .withIndex("by_company_user", (q) =>
      q.eq("companyId", companyId).eq("userId", userId)
    )
    .filter((q) => q.eq(q.field("status"), "active"))
    .unique();

  if (!teamMember) {
    throw new Error("Not a member of this company");
  }

  if (teamMember.deletedAt) {
    throw new Error("Membership has been revoked");
  }

  return { teamMember, company };
}

/**
 * Verify user has access to a company and return auth context
 * This is the main function to use in queries/mutations
 */
export async function requireCompanyAccess(
  ctx: QueryCtx | MutationCtx,
  companyId: Id<"companies">
): Promise<CompanyAuthContext> {
  const { userId, user } = await getAuthenticatedUser(ctx);
  const { teamMember } = await getCompanyMembership(ctx, userId, companyId);

  return {
    userId,
    user,
    companyId,
    teamMember,
    role: teamMember.role as UserRole,
    permissions: (teamMember.permissions as Record<string, boolean>) || {},
  };
}

/**
 * Get all companies the user has access to
 */
export async function getUserCompanies(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Array<{ company: Doc<"companies">; membership: Doc<"teamMembers"> }>> {
  const memberships = await ctx.db
    .query("teamMembers")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(
        q.eq(q.field("status"), "active"),
        q.eq(q.field("deletedAt"), undefined)
      )
    )
    .collect();

  const results: Array<{ company: Doc<"companies">; membership: Doc<"teamMembers"> }> = [];

  for (const membership of memberships) {
    const company = await ctx.db.get(membership.companyId);
    if (company && !company.deletedAt) {
      results.push({ company, membership });
    }
  }

  return results;
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

/**
 * Check if user has a specific role
 */
export function hasRole(authCtx: CompanyAuthContext, role: UserRole): boolean {
  return authCtx.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(authCtx: CompanyAuthContext, roles: UserRole[]): boolean {
  return roles.includes(authCtx.role);
}

/**
 * Check if user's role is at least as high as the specified role
 * Can accept either a CompanyAuthContext or just a role string
 */
export function hasMinimumRole(
  authCtxOrRole: CompanyAuthContext | UserRole,
  minRole: UserRole
): boolean {
  const role = typeof authCtxOrRole === "string" ? authCtxOrRole : authCtxOrRole.role;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole];
}

/**
 * Require minimum role, throw if not met
 */
export function requireMinimumRole(authCtx: CompanyAuthContext, minRole: UserRole): void {
  if (!hasMinimumRole(authCtx, minRole)) {
    throw new Error(`Requires at least ${minRole} role`);
  }
}

/**
 * Check if user is company owner
 */
export async function isCompanyOwner(
  ctx: QueryCtx | MutationCtx,
  authCtx: CompanyAuthContext
): Promise<boolean> {
  const company = await ctx.db.get(authCtx.companyId);
  return (
    authCtx.role === "owner" ||
    (company !== null && company.ownerId === authCtx.userId)
  );
}

/**
 * Require company owner, throw if not
 */
export async function requireCompanyOwner(
  ctx: QueryCtx | MutationCtx,
  authCtx: CompanyAuthContext
): Promise<void> {
  const isOwner = await isCompanyOwner(ctx, authCtx);
  if (!isOwner) {
    throw new Error("Only company owners can perform this action");
  }
}

// ============================================================================
// PERMISSION-BASED ACCESS CONTROL
// ============================================================================

/**
 * Check if user has a specific permission
 */
export function hasPermission(authCtx: CompanyAuthContext, permission: string): boolean {
  // Check custom permissions first (override defaults)
  if (authCtx.permissions[permission] !== undefined) {
    return authCtx.permissions[permission];
  }

  // Check wildcard permission
  const roleDefaults = DEFAULT_PERMISSIONS[authCtx.role];
  if (roleDefaults["*"]) {
    // Check for explicit denials even with wildcard
    if (roleDefaults[permission] === false) {
      return false;
    }
    return true;
  }

  // Check specific permission
  return roleDefaults[permission] ?? false;
}

/**
 * Require a specific permission, throw if not allowed
 */
export function requirePermission(authCtx: CompanyAuthContext, permission: string): void {
  if (!hasPermission(authCtx, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

/**
 * Combined function to require company access and check permission in one call
 * This is a convenience wrapper for common mutation patterns
 * @param ctx - Query or Mutation context
 * @param companyId - Company ID to check access for
 * @param resource - Resource name (e.g., "invoices", "jobs")
 * @param action - Action name (e.g., "create", "update", "delete")
 * @returns Auth context with userId and membership
 */
export async function requirePermissionForAction(
  ctx: QueryCtx | MutationCtx,
  companyId: Id<"companies">,
  resource: string,
  action: string
): Promise<CompanyAuthContext & { membership: Doc<"teamMembers"> }> {
  const authCtx = await requireCompanyAccess(ctx, companyId);

  // Check permission using resource:action pattern
  const permission = `${resource}:${action}`;

  // Also check simplified permissions
  const simplifiedPermissions: Record<string, string[]> = {
    "create": [`create_${resource}`, `manage_${resource}`, "create_jobs", "manage_jobs"],
    "update": [`update_${resource}`, `manage_${resource}`, "manage_jobs"],
    "delete": [`delete_${resource}`, `manage_${resource}`, "delete_records"],
    "approve": [`approve_${resource}`, `manage_${resource}`, "approve_estimates"],
    "view": [`view_${resource}`, `view_jobs`, "view_customers"],
  };

  // Try the direct permission first
  if (hasPermission(authCtx, permission)) {
    return { ...authCtx, membership: authCtx.teamMember };
  }

  // Try simplified permissions
  const permissionsToCheck = simplifiedPermissions[action] || [];
  for (const p of permissionsToCheck) {
    if (hasPermission(authCtx, p)) {
      return { ...authCtx, membership: authCtx.teamMember };
    }
  }

  // Admins and owners always have permission
  if (hasMinimumRole(authCtx, "admin")) {
    return { ...authCtx, membership: authCtx.teamMember };
  }

  throw new Error(`Permission denied: ${resource}:${action}`);
}

/**
 * Require any of the specified permissions
 */
export function requireAnyPermission(
  authCtx: CompanyAuthContext,
  permissions: string[]
): void {
  const hasAny = permissions.some((p) => hasPermission(authCtx, p));
  if (!hasAny) {
    throw new Error(`Permission denied: requires one of ${permissions.join(", ")}`);
  }
}

/**
 * Require all of the specified permissions
 */
export function requireAllPermissions(
  authCtx: CompanyAuthContext,
  permissions: string[]
): void {
  for (const permission of permissions) {
    requirePermission(authCtx, permission);
  }
}

// ============================================================================
// ENTITY-LEVEL ACCESS CONTROL
// ============================================================================

/**
 * Check if user can access a specific entity based on assignment
 * Used for technician role that can only see assigned entities
 */
export function canAccessEntity<T extends { companyId: Id<"companies">; assignedTo?: Id<"users"> }>(
  authCtx: CompanyAuthContext,
  entity: T
): boolean {
  // Must be same company
  if (entity.companyId !== authCtx.companyId) {
    return false;
  }

  // Technicians can only see their assigned entities (if view_assigned_only is true)
  if (authCtx.role === "technician" && hasPermission(authCtx, "view_assigned_only")) {
    return entity.assignedTo === authCtx.userId;
  }

  return true;
}

/**
 * Filter entities based on access permissions
 */
export function filterAccessibleEntities<T extends { companyId: Id<"companies">; assignedTo?: Id<"users"> }>(
  authCtx: CompanyAuthContext,
  entities: T[]
): T[] {
  return entities.filter((entity) => canAccessEntity(authCtx, entity));
}

// ============================================================================
// SOFT DELETE HELPERS
// ============================================================================

/**
 * Check if entity is soft deleted
 */
export function isDeleted<T extends { deletedAt?: number }>(entity: T): boolean {
  return entity.deletedAt !== undefined && entity.deletedAt !== null;
}

/**
 * Check if entity is archived
 */
export function isArchived<T extends { archivedAt?: number }>(entity: T): boolean {
  return entity.archivedAt !== undefined && entity.archivedAt !== null;
}

/**
 * Filter out soft deleted entities
 */
export function excludeDeleted<T extends { deletedAt?: number }>(entities: T[]): T[] {
  return entities.filter((e) => !isDeleted(e));
}

/**
 * Filter out archived entities
 */
export function excludeArchived<T extends { archivedAt?: number }>(entities: T[]): T[] {
  return entities.filter((e) => !isArchived(e));
}

/**
 * Filter out both deleted and archived entities
 */
export function excludeDeletedAndArchived<T extends { deletedAt?: number; archivedAt?: number }>(
  entities: T[]
): T[] {
  return entities.filter((e) => !isDeleted(e) && !isArchived(e));
}

// ============================================================================
// AUDIT HELPERS
// ============================================================================

/**
 * Create audit log entry
 */
export async function createAuditLog(
  ctx: MutationCtx,
  params: {
    companyId: Id<"companies">;
    userId?: Id<"users">;
    action: string;
    entityType: string;
    entityId?: string | Id<"companies"> | Id<"users"> | Id<"customers"> | Id<"jobs"> | Id<"invoices"> | Id<"payments"> | Id<"estimates"> | Id<"properties"> | Id<"equipment"> | Id<"schedules"> | Id<"communications"> | Id<"servicePlans"> | Id<"priceBookItems"> | Id<"inventory"> | Id<"purchaseOrders"> | Id<"vendors"> | Id<"tags">;
    changes?: Record<string, { old: unknown; new: unknown }>;
    previousValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
): Promise<Id<"auditLogs">> {
  // Build changes object from previousValues and newValues if provided
  const changes = params.changes ?? (params.previousValues && params.newValues
    ? Object.keys(params.newValues).reduce((acc, key) => {
        acc[key] = { old: params.previousValues?.[key], new: params.newValues?.[key] };
        return acc;
      }, {} as Record<string, { old: unknown; new: unknown }>)
    : undefined);

  return await ctx.db.insert("auditLogs", {
    companyId: params.companyId,
    userId: params.userId as any, // Optional - may be undefined for customer actions
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId?.toString() ?? "",
    changes,
    metadata: params.metadata,
  });
}

/**
 * Track field changes for audit log
 * Returns changes in { old, new } format for each changed field
 */
export function trackChanges<T extends Record<string, unknown>>(
  original: T,
  updates: Partial<T>
): Record<string, { old: unknown; new: unknown }> {
  const changes: Record<string, { old: unknown; new: unknown }> = {};

  for (const [key, newValue] of Object.entries(updates)) {
    if (newValue !== undefined) {
      const oldValue = original[key];
      if (oldValue !== newValue) {
        changes[key] = { old: oldValue, new: newValue };
      }
    }
  }

  return changes;
}

/**
 * Get just the new values for changed fields (simpler version)
 */
export function getChangedValues<T extends Record<string, unknown>>(
  original: T,
  updates: Partial<T>
): Record<string, unknown> {
  const changes: Record<string, unknown> = {};

  for (const [key, newValue] of Object.entries(updates)) {
    if (newValue !== undefined) {
      const oldValue = original[key];
      if (oldValue !== newValue) {
        changes[key] = newValue;
      }
    }
  }

  return changes;
}
