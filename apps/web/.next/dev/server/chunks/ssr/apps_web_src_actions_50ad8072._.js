module.exports = [
"[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Role Actions - Server Actions
 *
 * Server-side actions for role management and permission checks.
 * Uses Supabase RLS and database functions for security.
 */ /* __next_internal_action_entry_do_not_use__ [{"007ac1f2ec6b09cd36e4a3e4cc595b494ec49ec2d7":"getCurrentUserRole","40403f075dde1b08a909eead4279652620ac8d96b4":"canDeleteTeamMember"},"",""] */ __turbopack_context__.s([
    "canDeleteTeamMember",
    ()=>canDeleteTeamMember,
    "getCurrentUserRole",
    ()=>getCurrentUserRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/permissions.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/permissions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/with-error-handling.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
// ============================================================================
// Validation Schemas
// ============================================================================
const updateRoleSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    teamMemberId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    newRole: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "owner",
        "admin",
        "manager",
        "dispatcher",
        "technician",
        "csr"
    ]),
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const updatePermissionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    teamMemberId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    permissions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean())
});
async function getCurrentUserRole() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        const role = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserRole"])(supabase, user.id, companyId);
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
 */ async function checkPermission(permission) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        const hasPerm = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasPermission"])(supabase, user.id, permission, companyId);
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
 */ async function checkRole(role) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        const hasRoleResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasRole"])(supabase, user.id, role, companyId);
        return hasRoleResult;
    });
}
/**
 * Check if current user is company owner
 *
 * @returns true if user is owner
 */ async function checkIsOwner() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        const isOwner = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isCompanyOwner"])(supabase, user.id, companyId);
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
 */ async function updateTeamMemberRole(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        // Validate input
        const validated = updateRoleSchema.parse(input);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        // Check permission - only owners and admins can change roles
        const canManageRoles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isCompanyOwner"])(supabase, user.id, companyId) || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasRole"])(supabase, user.id, "admin", companyId);
        if (!canManageRoles) {
            throw new Error("Only owners and admins can change roles");
        }
        // Get current role for audit log
        const { data: currentMember } = await supabase.from("company_memberships").select("role").eq("id", validated.teamMemberId).eq("company_id", companyId).single();
        if (!currentMember) {
            throw new Error("Team member not found");
        }
        // Update role
        const { data: updatedMember, error } = await supabase.from("company_memberships").update({
            role: validated.newRole
        }).eq("id", validated.teamMemberId).eq("company_id", companyId).select().single();
        if (error) {
            throw new Error(error.message);
        }
        // Log role change
        await supabase.from("role_change_log").insert({
            team_member_id: validated.teamMemberId,
            changed_by: user.id,
            old_role: currentMember.role,
            new_role: validated.newRole,
            reason: validated.reason
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/team");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/settings/team/${validated.teamMemberId}`);
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
 */ async function updateTeamMemberPermissions(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        // Validate input
        const validated = updatePermissionsSchema.parse(input);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        // Check permission
        const canManagePermissions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isCompanyOwner"])(supabase, user.id, companyId) || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasRole"])(supabase, user.id, "admin", companyId);
        if (!canManagePermissions) {
            throw new Error("Only owners and admins can change permissions");
        }
        // Update permissions
        const { data: updatedMember, error } = await supabase.from("company_memberships").update({
            permissions: validated.permissions
        }).eq("id", validated.teamMemberId).eq("company_id", companyId).select().single();
        if (error) {
            throw new Error(error.message);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/team");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/settings/team/${validated.teamMemberId}`);
        return updatedMember;
    });
}
/**
 * Get team members with their roles
 *
 * @returns List of team members with roles
 */ async function getTeamMembersWithRoles() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        const { data, error } = await supabase.from("company_memberships").select(`
        *,
        users (
          id,
          name,
          email,
          avatar
        )
      `).eq("company_id", companyId).order("created_at", {
            ascending: false
        });
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
 */ async function transferOwnership(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        // Verify user is current owner
        const isOwner = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isCompanyOwner"])(supabase, user.id, companyId);
        if (!isOwner) {
            throw new Error("Only the current owner can transfer ownership");
        }
        // Verify password
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email || "",
            password: input.password
        });
        if (signInError) {
            throw new Error("Password verification failed");
        }
        // Call database function to transfer ownership
        const { data: transferId, error } = await supabase.rpc("transfer_company_ownership", {
            p_company_id: companyId,
            p_current_owner_id: user.id,
            p_new_owner_id: input.newOwnerId,
            p_reason: input.reason,
            p_ip_address: input.ipAddress,
            p_user_agent: input.userAgent
        });
        if (error) {
            throw new Error(error.message || "Failed to transfer ownership");
        }
        // Revalidate all relevant paths
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/team");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        return transferId;
    });
}
/**
 * Get ownership transfer history for the company
 * Shows audit trail of all ownership changes
 *
 * @returns List of ownership transfers
 */ async function getOwnershipTransferHistory() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("Not authenticated");
        }
        // Only owners and admins can view transfer history
        const canView = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isCompanyOwner"])(supabase, user.id, companyId) || await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasRole"])(supabase, user.id, "admin", companyId);
        if (!canView) {
            throw new Error("Only owners and admins can view transfer history");
        }
        const { data, error } = await supabase.from("ownership_transfers").select(`
        *,
        previous_owner:users!ownership_transfers_previous_owner_id_fkey(id, name, email),
        new_owner:users!ownership_transfers_new_owner_id_fkey(id, name, email),
        initiated_by_user:users!ownership_transfers_initiated_by_fkey(id, name, email)
      `).eq("company_id", companyId).order("created_at", {
            ascending: false
        });
        if (error) {
            throw new Error(error.message);
        }
        return data;
    });
}
async function canDeleteTeamMember(teamMemberId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Database connection not available");
        }
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            throw new Error("No active company");
        }
        // Get team member details
        const { data: teamMember, error } = await supabase.from("company_memberships").select("user_id, role").eq("id", teamMemberId).eq("company_id", companyId).single();
        if (error || !teamMember) {
            throw new Error("Team member not found");
        }
        // Check if user is company owner
        const { data: company } = await supabase.from("companies").select("owner_id").eq("id", companyId).single();
        if (company && company.owner_id === teamMember.user_id) {
            return {
                canDelete: false,
                reason: "Cannot delete company owner. Transfer ownership first before removing this team member."
            };
        }
        return {
            canDelete: true
        };
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCurrentUserRole,
    canDeleteTeamMember
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrentUserRole, "007ac1f2ec6b09cd36e4a3e4cc595b494ec49ec2d7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(canDeleteTeamMember, "40403f075dde1b08a909eead4279652620ac8d96b4", null);
}),
"[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"00a35b9d088292bb54d357cd06416e3d415487c89b":"checkTelnyxVerificationStatus","4017edba3139fb44e6e281ece4fc8cd9455c636be2":"registerCompanyFor10DLC","4023a6f3546ea5f35e67810da9438db269e6791107":"submitAutomatedVerification"},"",""] */ __turbopack_context__.s([
    "checkTelnyxVerificationStatus",
    ()=>checkTelnyxVerificationStatus,
    "registerCompanyFor10DLC",
    ()=>registerCompanyFor10DLC,
    "submitAutomatedVerification",
    ()=>submitAutomatedVerification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/account-verification.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/ten-dlc.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
async function registerCompanyFor10DLC(companyId) {
    const log = [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            success: false,
            error: "Failed to create Supabase client",
            log
        };
    }
    try {
        // 1. Fetch company data
        log.push("Fetching company data...");
        const { data: company, error: companyError } = await supabase.from("companies").select(`
				id,
				name,
				ein,
				website,
				industry,
				address,
				city,
				state,
				zip_code,
				phone,
				email,
				support_email,
				support_phone
			`).eq("id", companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`,
                log
            };
        }
        // Validate required fields
        if (!company.ein) {
            return {
                success: false,
                error: "Company EIN is required for 10DLC registration. Please add the company's Tax ID.",
                log
            };
        }
        if (!company.address || !company.city || !company.state || !company.zip_code) {
            return {
                success: false,
                error: "Company address is incomplete. Please add full address, city, state, and ZIP code.",
                log
            };
        }
        const contactEmail = company.email || company.support_email;
        const contactPhone = company.phone || company.support_phone;
        if (!contactEmail || !contactPhone) {
            return {
                success: false,
                error: "Company contact email and phone are required for 10DLC registration.",
                log
            };
        }
        // CRITICAL: Verify email domain before 10DLC registration
        log.push("Verifying company email domain...");
        const supabaseService = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabaseService) {
            return {
                success: false,
                error: "Database service client failed",
                log
            };
        }
        const { data: verifiedDomain } = await supabaseService.from("company_email_domains").select("*").eq("company_id", companyId).eq("status", "verified").single();
        if (!verifiedDomain) {
            return {
                success: false,
                error: "Company email domain must be verified before 10DLC registration. TCR (The Campaign Registry) requires a verified business email domain with proper SPF/DKIM/DMARC records. Please complete email domain setup in the onboarding steps.",
                log
            };
        }
        // Use domain email for TCR registration
        const fullDomain = verifiedDomain.subdomain ? `${verifiedDomain.subdomain}.${verifiedDomain.domain_name}` : verifiedDomain.domain_name;
        const domainEmail = `admin@${fullDomain}`;
        log.push(`Email domain verified: ${fullDomain}`);
        // Normalize phone to E.164 format (Telnyx requirement)
        const normalizeToE164 = (phone)=>{
            // Remove all non-digit characters
            const digits = phone.replace(/\D/g, "");
            // Ensure it starts with country code (default to US +1)
            if (digits.length === 10) {
                return `+1${digits}`;
            }
            if (digits.length === 11 && digits.startsWith("1")) {
                return `+${digits}`;
            }
            // Already has country code
            return `+${digits}`;
        };
        const normalizedPhone = normalizeToE164(contactPhone);
        // 2. Check if already registered
        log.push("Checking existing 10DLC registration...");
        const { data: settings } = await supabase.from("company_telnyx_settings").select("ten_dlc_brand_id, ten_dlc_campaign_id").eq("company_id", companyId).single();
        if (settings?.ten_dlc_brand_id && settings?.ten_dlc_campaign_id) {
            log.push("Company already has 10DLC registration");
            return {
                success: true,
                brandId: settings.ten_dlc_brand_id,
                campaignId: settings.ten_dlc_campaign_id,
                log
            };
        }
        // 3. Create 10DLC Brand
        log.push("Creating 10DLC brand with Telnyx...");
        const brandPayload = {
            entityType: "PRIVATE_PROFIT",
            displayName: company.name || "Unknown Company",
            companyName: company.name || "Unknown Company",
            firstName: "Business",
            lastName: "Owner",
            ein: company.ein,
            phone: normalizedPhone,
            street: company.address || "",
            city: company.city || "",
            state: company.state || "",
            postalCode: company.zip_code || "",
            country: "US",
            email: contactEmail,
            website: company.website,
            vertical: determineVertical(company.industry),
            businessContactEmail: contactEmail,
            // ISV/Reseller identification - Stratos is the platform
            isReseller: true
        };
        const brandResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTenDlcBrand"])(brandPayload);
        if (!brandResult.success || !brandResult.data?.brandId) {
            return {
                success: false,
                error: `Failed to create 10DLC brand: ${brandResult.error}`,
                log
            };
        }
        const brandId = brandResult.data.brandId;
        log.push(`Brand created: ${brandId}`);
        // 4. Poll brand status until approved (max 60 seconds)
        log.push("Waiting for brand approval...");
        const brandApprovalResult = await pollForApproval(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenDlcBrand"])(brandId), 60);
        if (!brandApprovalResult.approved) {
            log.push(`Brand approval failed: ${brandApprovalResult.failureReason || "Unknown reason"}`);
            // Check if failure was due to email validation (fail fast)
            if (brandApprovalResult.failureReason?.toLowerCase().includes("email")) {
                return {
                    success: false,
                    error: `Email validation failed: ${brandApprovalResult.failureReason}. ` + "TCR requires a verified business email domain (not personal/free providers). " + "Options: 1) Use toll-free numbers (bypasses TCR), " + "2) Set up Google Workspace/Microsoft 365, " + "3) See /TELNYX_10DLC_EMAIL_REQUIREMENTS.md",
                    brandId,
                    log
                };
            }
            // Save brand ID even if not approved yet
            await supabase.from("company_telnyx_settings").update({
                ten_dlc_brand_id: brandId
            }).eq("company_id", companyId);
            return {
                success: false,
                error: brandApprovalResult.failureReason || "Brand created but approval pending. Please check back in a few minutes.",
                brandId,
                log
            };
        }
        log.push("Brand approved");
        // 5. Create 10DLC Campaign
        log.push("Creating 10DLC campaign...");
        const campaignPayload = {
            brandId: brandId,
            usecase: "MIXED",
            description: `Business messaging for ${company.name}`,
            messageFlow: "Customers opt-in when providing phone number. Messages sent for appointments, invoices, and general updates.",
            helpMessage: "Reply HELP for assistance or call us.",
            helpKeywords: "HELP",
            optinKeywords: "START YES SUBSCRIBE",
            optinMessage: "You are now subscribed to messages from " + company.name + ". Reply STOP to unsubscribe.",
            optoutKeywords: "STOP END UNSUBSCRIBE CANCEL QUIT",
            optoutMessage: "You have been unsubscribed from " + company.name + " messages. Reply START to resubscribe.",
            sample1: "Your appointment is confirmed for tomorrow at 2 PM.",
            sample2: "Thank you for your payment. Receipt: #12345",
            sample3: "Reminder: Service scheduled for next week.",
            autoRenewal: true,
            termsAndConditions: true,
            termsAndConditionsLink: company.website ? `${company.website}/terms` : "https://stratos.thorbis.com/terms",
            subscriberHelp: true,
            subscriberOptin: true,
            subscriberOptout: true
        };
        const campaignResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTenDlcCampaign"])(campaignPayload);
        if (!campaignResult.success || !campaignResult.data?.campaignId) {
            return {
                success: false,
                error: `Failed to create 10DLC campaign: ${campaignResult.error}`,
                brandId,
                log
            };
        }
        const campaignId = campaignResult.data.campaignId;
        log.push(`Campaign created: ${campaignId}`);
        // 6. Poll campaign status
        log.push("Waiting for campaign approval...");
        const campaignApprovalResult = await pollForApproval(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenDlcCampaign"])(campaignId), 60);
        if (!campaignApprovalResult.approved) {
            log.push(`Campaign approval failed: ${campaignApprovalResult.failureReason || "Unknown reason"}`);
            await supabase.from("company_telnyx_settings").update({
                ten_dlc_brand_id: brandId,
                ten_dlc_campaign_id: campaignId
            }).eq("company_id", companyId);
            return {
                success: false,
                error: campaignApprovalResult.failureReason || "Campaign created but approval pending. Please check back in a few minutes.",
                brandId,
                campaignId,
                log
            };
        }
        log.push("Campaign approved");
        // 7. Attach all company phone numbers to campaign
        log.push("Attaching phone numbers to campaign...");
        const { data: phoneNumbers } = await supabase.from("phone_numbers").select("phone_number").eq("company_id", companyId).eq("status", "active");
        let attachedCount = 0;
        for (const phone of phoneNumbers || []){
            const attachResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["attachNumberToCampaign"])(campaignId, phone.phone_number);
            if (attachResult.success) {
                attachedCount++;
            } else {
                log.push(`Failed to attach ${phone.phone_number}: ${attachResult.error}`);
            }
        }
        log.push(`Attached ${attachedCount} phone numbers to campaign`);
        // 8. Update company settings
        log.push("Updating company Telnyx settings...");
        await supabase.from("company_telnyx_settings").update({
            ten_dlc_brand_id: brandId,
            ten_dlc_campaign_id: campaignId
        }).eq("company_id", companyId);
        return {
            success: true,
            brandId,
            campaignId,
            log
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            log
        };
    }
}
/**
 * Poll approval status until approved or timeout
 */ async function pollForApproval(fetcher, maxSeconds) {
    const startTime = Date.now();
    const pollInterval = 5000; // 5 seconds
    while(Date.now() - startTime < maxSeconds * 1000){
        const result = await fetcher();
        if (!result.success || !result.data) {
            return {
                approved: false,
                failureReason: "Failed to fetch status"
            };
        }
        const status = result.data.status.toLowerCase();
        if (status === "approved" || status === "active") {
            return {
                approved: true
            };
        }
        if (status === "rejected" || status === "failed" || status === "registration_failed") {
            // Extract failure reason from response
            const failureReason = result.data.failureReasons?.[0]?.description || `Registration ${status}`;
            return {
                approved: false,
                failureReason
            };
        }
        // Wait before polling again
        await new Promise((resolve)=>setTimeout(resolve, pollInterval));
    }
    return {
        approved: false,
        failureReason: "Timeout waiting for approval"
    };
}
/**
 * Map business type to 10DLC vertical
 */ function determineVertical(businessType) {
    if (!businessType) return "PROFESSIONAL";
    const type = businessType.toLowerCase();
    // Map to Telnyx's exact vertical values
    // Valid values from error: AGRICULTURE, COMMUNICATION, CONSTRUCTION, EDUCATION,
    // ENERGY, ENTERTAINMENT, FINANCIAL, GAMBLING, GOVERNMENT, HEALTHCARE, HOSPITALITY,
    // HUMAN_RESOURCES, INSURANCE, LEGAL, MANUFACTURING, NGO, POLITICAL, POSTAL,
    // PROFESSIONAL, REAL_ESTATE, RETAIL, TECHNOLOGY, TRANSPORTATION
    if (type.includes("healthcare") || type.includes("medical")) return "HEALTHCARE";
    if (type.includes("finance") || type.includes("banking")) return "FINANCIAL";
    if (type.includes("insurance")) return "INSURANCE";
    if (type.includes("real estate")) return "REAL_ESTATE";
    if (type.includes("retail") || type.includes("ecommerce")) return "RETAIL";
    if (type.includes("hospitality") || type.includes("restaurant") || type.includes("food") || type.includes("hotel")) return "HOSPITALITY";
    if (type.includes("education")) return "EDUCATION";
    if (type.includes("technology") || type.includes("software")) return "TECHNOLOGY";
    if (type.includes("nonprofit") || type.includes("charity") || type.includes("ngo")) return "NGO";
    if (type.includes("construction") || type.includes("plumbing") || type.includes("hvac") || type.includes("electrical") || type.includes("contractor")) return "CONSTRUCTION";
    if (type.includes("legal") || type.includes("law")) return "LEGAL";
    if (type.includes("manufacturing")) return "MANUFACTURING";
    if (type.includes("transportation") || type.includes("logistics")) return "TRANSPORTATION";
    if (type.includes("energy") || type.includes("utilities")) return "ENERGY";
    if (type.includes("agriculture") || type.includes("farming")) return "AGRICULTURE";
    if (type.includes("entertainment") || type.includes("media")) return "ENTERTAINMENT";
    // Default for service businesses
    return "PROFESSIONAL";
}
async function checkTelnyxVerificationStatus() {
    try {
        const statusResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkAccountVerificationStatus"])();
        if (!statusResult.success) {
            return {
                success: false,
                error: statusResult.error || "Failed to check verification status"
            };
        }
        const status = statusResult.data;
        const nextSteps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNextSteps"])(status);
        const requirements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVerificationRequirements"])(status.currentLevel);
        return {
            success: true,
            data: {
                ...status,
                nextSteps,
                requirements
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to check verification status"
        };
    }
}
async function submitAutomatedVerification(companyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const log = [];
    const normalizePhone = (value)=>{
        if (!value) return null;
        const digits = value.replace(/\D/g, "");
        if (!digits) return null;
        if (digits.length === 10) {
            return `+1${digits}`;
        }
        if (digits.length === 11 && digits.startsWith("1")) {
            return `+${digits}`;
        }
        return value.startsWith("+") ? value : `+${digits}`;
    };
    if (!supabase) {
        return {
            success: false,
            error: "Failed to create Supabase client",
            log
        };
    }
    try {
        // 1. Fetch company data
        const { data: company, error: companyError } = await supabase.from("companies").select(`
				id,
				name,
				ein,
				website,
				industry,
				address,
				city,
				state,
				zip_code,
				phone,
				email,
				support_email,
				support_phone
			`).eq("id", companyId).single();
        if (companyError || !company) {
            log.push("Company lookup failed");
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`,
                log
            };
        }
        log.push(`Company loaded: ${company.name} (${company.id})`);
        // Validate required fields
        if (!company.ein) {
            log.push("Missing EIN");
            return {
                success: false,
                error: "Company EIN is required for messaging verification. Please add your Tax ID in Step 1.",
                log
            };
        }
        if (!company.address || !company.city || !company.state || !company.zip_code) {
            log.push("Incomplete address");
            return {
                success: false,
                error: "Company address is incomplete. Please complete all address fields in Step 1.",
                log
            };
        }
        const companyPhone = normalizePhone(company.phone || company.support_phone);
        if (!companyPhone) {
            log.push("Missing company phone");
            return {
                success: false,
                error: "Company phone number is required for verification.",
                log
            };
        }
        // 2. Get company phone numbers
        const { data: phoneNumbers, error: phoneError } = await supabase.from("phone_numbers").select("phone_number, number_type").eq("company_id", companyId).eq("status", "active");
        if (phoneError || !phoneNumbers || phoneNumbers.length === 0) {
            log.push("No phone numbers found for company");
            return {
                success: false,
                error: "No phone numbers found. Please add a phone number before enabling messaging.",
                log
            };
        }
        // Separate toll-free and 10DLC numbers
        const tollFreeNumbers = phoneNumbers.filter((p)=>p.number_type === "toll-free");
        const dlcNumbers = phoneNumbers.filter((p)=>p.number_type === "local");
        log.push(`Detected toll-free numbers: ${tollFreeNumbers.length}, 10DLC numbers: ${dlcNumbers.length}`);
        // If no toll-free numbers, recommend using toll-free for immediate setup
        if (tollFreeNumbers.length === 0 && dlcNumbers.length > 0) {
            console.log("Note: Only local numbers found. Toll-free verification works immediately without Level 2. Consider adding toll-free numbers for faster setup.");
        }
        const contactPhone = companyPhone;
        const contactEmail = company.email || company.support_email || null;
        if (!contactEmail) {
            return {
                success: false,
                error: "A primary email is required for toll-free verification.",
                log
            };
        }
        // Get company owner's profile for business contact info
        const { data: ownerMembership } = await supabase.from("company_memberships").select("user_id, user_profiles!inner(first_name, last_name)").eq("company_id", companyId).eq("role", "owner").eq("status", "active").single();
        // Extract owner name, fallback to "Admin User" if not found
        const ownerProfile = ownerMembership?.user_profiles;
        const businessContactFirstName = ownerProfile?.first_name || "Admin";
        const businessContactLastName = ownerProfile?.last_name || "User";
        // 3. Submit toll-free verification if we have toll-free numbers
        let tollFreeRequestId;
        if (tollFreeNumbers.length > 0) {
            log.push("Preparing toll-free verification payload");
            const normalizedWebsite = company.website || `https://${company.name.toLowerCase().replace(/\s+/g, "")}.com`;
            const optInImageUrl = `${normalizedWebsite.replace(/\/$/, "")}/opt-in`;
            const additionalInfo = `${company.name} sends timely service notifications, scheduling updates, and customer support follow-ups for ${company.industry || "field service"} operations.`;
            const sanitizedEin = company.ein.replace(/[^\d]/g, "");
            const tollFreePayload = {
                businessName: company.name,
                corporateWebsite: normalizedWebsite,
                businessAddr1: company.address,
                businessCity: company.city,
                businessState: company.state,
                businessZip: company.zip_code,
                businessContactFirstName: businessContactFirstName,
                businessContactLastName: businessContactLastName,
                businessContactEmail: contactEmail,
                businessContactPhone: contactPhone,
                phoneNumbers: tollFreeNumbers.map((p)=>({
                        phoneNumber: p.phone_number
                    })),
                useCase: "Customer Support",
                useCaseSummary: `${company.industry} business communications including appointment reminders, service notifications, and customer support`,
                productionMessageContent: `Hi! This is ${company.name}. Your appointment is scheduled for tomorrow at 10 AM. Reply STOP to opt out.`,
                messageVolume: "10000",
                optInWorkflow: "Customers opt-in during service booking and account creation",
                optInWorkflowImageURLs: [
                    {
                        url: optInImageUrl || "https://dummyimage.com/600x400/cccccc/000000&text=Opt-In",
                        description: "Opt-in form screenshot"
                    }
                ],
                optInKeywords: "YES,START",
                optOutKeywords: "STOP,UNSUBSCRIBE",
                optOutMessage: `You have opted out of ${company.name} messages. Reply START to opt in again.`,
                helpKeywords: "HELP,INFO",
                businessRegistrationNumber: sanitizedEin,
                businessRegistrationType: "EIN",
                businessRegistrationCountry: "US",
                entityType: "PRIVATE_PROFIT",
                additionalInformation: additionalInfo,
                helpMessageResponse: `For help, reply HELP or call ${companyPhone}.`,
                optInConfirmationResponse: `Thanks for subscribing to ${company.name} updates.`
            };
            log.push("Submitting toll-free verification to Telnyx");
            const tollFreeResult = await submitTollFreeVerification(tollFreePayload);
            if (!tollFreeResult.success || !tollFreeResult.data) {
                log.push(`Toll-free verification failed: ${tollFreeResult.error || "unknown"}`);
                return {
                    success: false,
                    error: `Toll-free verification failed: ${tollFreeResult.error}`,
                    log
                };
            }
            tollFreeRequestId = tollFreeResult.data.id;
            log.push(`Toll-free verification request created: ${tollFreeRequestId}`);
            // Save toll-free request ID to database
            await supabase.from("company_telnyx_settings").upsert({
                company_id: companyId,
                toll_free_verification_request_id: tollFreeRequestId,
                toll_free_verification_status: "pending",
                toll_free_verification_submitted_at: new Date().toISOString()
            });
        }
        // 4. Submit 10DLC registration if we have regular numbers (OPTIONAL - won't block toll-free)
        let brandId;
        let campaignId;
        let dlcError;
        if (dlcNumbers.length > 0) {
            log.push("Attempting 10DLC registration");
            const registrationResult = await registerCompanyFor10DLC(companyId);
            if (!registrationResult.success) {
                // Check if this is a 403 error (account verification required)
                const is403Error = registrationResult.error?.includes("403") || registrationResult.error?.includes("verifications required");
                if (is403Error) {
                    // Platform account needs Level 2 verification
                    // Don't fail - just log the error and continue with toll-free
                    dlcError = "10DLC requires Level 2 verification (see /TELNYX_PLATFORM_SETUP.md). Toll-free verification will proceed.";
                    console.warn(dlcError);
                    log.push(dlcError);
                    // If we have toll-free numbers, continue (toll-free works without Level 2)
                    // If we ONLY have local numbers and no toll-free, then fail
                    if (tollFreeNumbers.length === 0) {
                        return {
                            success: false,
                            error: "Platform setup required: Your Telnyx account needs Level 2 verification to enable 10DLC registration for local numbers. Alternative: Add toll-free numbers which work immediately without Level 2 verification. See /TELNYX_PLATFORM_SETUP.md for details.",
                            requiresPlatformSetup: true,
                            log
                        };
                    }
                } else {
                    // Other error - log but don't fail if we have toll-free
                    dlcError = `10DLC registration failed: ${registrationResult.error}`;
                    console.error(dlcError);
                    log.push(dlcError);
                    if (tollFreeNumbers.length === 0) {
                        // No toll-free backup - fail
                        return {
                            success: false,
                            error: dlcError,
                            log
                        };
                    }
                }
            } else {
                brandId = registrationResult.brandId;
                campaignId = registrationResult.campaignId;
                log.push(`10DLC registration completed: brand=${brandId}, campaign=${campaignId}`);
            }
        }
        // 5. Send verification submitted email
        // Note: Don't block the response if email fails - verification was successful
        if (company.email) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendVerificationSubmittedEmail"])(companyId, company.email, {
                    hasTollFreeNumbers: tollFreeNumbers.length > 0,
                    has10DLCNumbers: dlcNumbers.length > 0,
                    tollFreeCount: tollFreeNumbers.length,
                    dlcCount: dlcNumbers.length
                });
                log.push("Verification submitted email sent");
            } catch (emailError) {
                // Log but don't fail - email is non-critical
                console.error("Failed to send verification email:", emailError);
                log.push(`Failed to send verification email: ${emailError instanceof Error ? emailError.message : emailError}`);
            }
        }
        // Build success message
        const messages = [];
        if (tollFreeRequestId) {
            messages.push(`✅ Toll-free verification submitted (${tollFreeNumbers.length} number${tollFreeNumbers.length > 1 ? "s" : ""}) - Approval in 5-7 business days`);
        }
        if (brandId && campaignId) {
            messages.push(`✅ 10DLC registration completed (${dlcNumbers.length} number${dlcNumbers.length > 1 ? "s" : ""}) - Active immediately`);
        }
        if (dlcError) {
            messages.push(`⚠️ ${dlcError}`);
        }
        log.push(...messages);
        return {
            success: true,
            tollFreeRequestId,
            brandId,
            campaignId,
            message: messages.join(". "),
            log
        };
    } catch (error) {
        log.push(`Unhandled verification error: ${error instanceof Error ? error.message : error}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to submit verification",
            log
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    registerCompanyFor10DLC,
    checkTelnyxVerificationStatus,
    submitAutomatedVerification
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerCompanyFor10DLC, "4017edba3139fb44e6e281ece4fc8cd9455c636be2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkTelnyxVerificationStatus, "00a35b9d088292bb54d357cd06416e3d415487c89b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitAutomatedVerification, "4023a6f3546ea5f35e67810da9438db269e6791107", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/actions/email-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00892ae3dc26e893f6e8f855ffbcbb3236013a3063":"getEmailFolderCountsAction","00b83d20602d045512eefed4896ab81b399955d9af":"getTotalUnreadCountAction","00dab49edd23516267827fa0cb35aa70601269c2d8":"syncInboundRoutesToResendAction","401256a4f4e40e272f500e766adff7e93ff02c384b":"markEmailAsReadAction","401ff8846eaa8841fda1655f09fd051af559f0f7c0":"toggleSpamEmailAction","403299458c55d95e2de8c629beee0ab5f85196999b":"bulkMoveToSpamAction","405ecad369a5a30b8ca4cb2d0bbd1cf0df8923d990":"toggleStarEmailAction","4067ebaccd899dae87d3a1ff6bae15161edc0331da":"getEmailByIdAction","40694f7d97e58fc9f3fec8029507a7317718f3dc2b":"bulkDeleteEmailsAction","406cb9ae57815889d2cc8268c1f6a293d241493f64":"bulkArchiveEmailsAction","40789366e3c8496828761b520f3893c8ce6fc5afe6":"saveDraftAction","40999f3a0443a8bc9a56c8a0ff2c0d66a29fb2437b":"getEmailsAction","409d9e6ffa4b31e342c9d764865d0b91d6e4e50493":"retryFailedEmailAction","40bdf331654aee787ae3ecd178d48a7d85efaf1507":"archiveAllEmailsAction","40be8f9b412e1975fa1c838655749c305ddf4ef119":"deleteDraftAction","40c7e57ac4b075750e42a77600d2d0687af67f9848":"getDraftAction","40d8ca342865680e3ec0586109e052711a8d4d6aa4":"archiveEmailAction","40db11cd1a2b7a716713f29752bc8b1284d60e2133":"unsnoozeEmailAction","60068956bf986d816dc4a486cd91c6afb7a224c098":"snoozeEmailAction","6053c463c64dcc743d1de1805950cd81913f806fa9":"bulkMarkReadUnreadAction","60cc3f085d8c0feb0fec31d830c58aae2364aa3564":"bulkStarEmailsAction","701f22a5defcdeafb177b203c595b4058846e45e06":"fetchEmailContentAction"},"",""] */ __turbopack_context__.s([
    "archiveAllEmailsAction",
    ()=>archiveAllEmailsAction,
    "archiveEmailAction",
    ()=>archiveEmailAction,
    "bulkArchiveEmailsAction",
    ()=>bulkArchiveEmailsAction,
    "bulkDeleteEmailsAction",
    ()=>bulkDeleteEmailsAction,
    "bulkMarkReadUnreadAction",
    ()=>bulkMarkReadUnreadAction,
    "bulkMoveToSpamAction",
    ()=>bulkMoveToSpamAction,
    "bulkStarEmailsAction",
    ()=>bulkStarEmailsAction,
    "deleteDraftAction",
    ()=>deleteDraftAction,
    "fetchEmailContentAction",
    ()=>fetchEmailContentAction,
    "getDraftAction",
    ()=>getDraftAction,
    "getEmailByIdAction",
    ()=>getEmailByIdAction,
    "getEmailFolderCountsAction",
    ()=>getEmailFolderCountsAction,
    "getEmailsAction",
    ()=>getEmailsAction,
    "getTotalUnreadCountAction",
    ()=>getTotalUnreadCountAction,
    "markEmailAsReadAction",
    ()=>markEmailAsReadAction,
    "retryFailedEmailAction",
    ()=>retryFailedEmailAction,
    "saveDraftAction",
    ()=>saveDraftAction,
    "snoozeEmailAction",
    ()=>snoozeEmailAction,
    "syncInboundRoutesToResendAction",
    ()=>syncInboundRoutesToResendAction,
    "toggleSpamEmailAction",
    ()=>toggleSpamEmailAction,
    "toggleStarEmailAction",
    ()=>toggleStarEmailAction,
    "unsnoozeEmailAction",
    ()=>unsnoozeEmailAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const getEmailsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(1).max(500).optional().default(50),
    offset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(0).optional().default(0),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "sent",
        "received",
        "all"
    ]).optional().default("all"),
    inboxType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "personal",
        "company"
    ]).optional(),
    folder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "inbox",
        "drafts",
        "sent",
        "archive",
        "snoozed",
        "spam",
        "trash",
        "bin",
        "starred",
        "all"
    ]).optional(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "support",
        "sales",
        "billing",
        "general"
    ]).optional(),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "created_at",
        "sent_at",
        "subject"
    ]).optional().default("created_at"),
    sortOrder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "asc",
        "desc"
    ]).optional().default("desc")
}).passthrough();
const getEmailThreadsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1).max(50).optional().default(20),
    offset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).optional().default(0),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const markEmailReadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    emailId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
async function getEmailsAction(input) {
    try {
        const parseResult = getEmailsSchema.safeParse(input);
        if (!parseResult.success) {
            console.error("❌ Zod validation error:", parseResult.error.issues);
            throw new Error(`Invalid input parameters: ${parseResult.error.issues.map((e)=>`${e.path.map(String).join('.')}: ${e.message}`).join(', ')}`);
        }
        const validatedInput = parseResult.data;
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            throw new Error("No active company found");
        }
        // Convert null to undefined for search field
        const sanitizedInput = {
            ...validatedInput,
            search: validatedInput.search ?? undefined
        };
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyEmails"])(companyId, sanitizedInput);
    } catch (error) {
        console.error("❌ getEmailsAction error:", error);
        throw error;
    }
}
/**
 * Get email threads for the active company
 */ async function getEmailThreadsAction(input) {
    try {
        const validatedInput = getEmailThreadsSchema.parse(input);
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            throw new Error("No active company found");
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmailThreads"])(companyId, validatedInput);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            throw new Error("Invalid input parameters");
        }
        throw error;
    }
}
async function getEmailByIdAction(emailId) {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const email = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmailById"])(companyId, emailId);
        if (!email) {
            return {
                success: false,
                error: "Email not found"
            };
        }
        return {
            success: true,
            email
        };
    } catch (error) {
        console.error("Error getting email by ID:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function markEmailAsReadAction(input) {
    try {
        const validatedInput = markEmailReadSchema.parse(input);
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markEmailAsRead"])(companyId, validatedInput.emailId);
        if (!result) {
            return {
                success: false,
                error: "Failed to mark email as read - check server logs for details"
            };
        }
        return {
            success: true
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: `Invalid input: ${error.issues.map((e)=>e.message).join(", ")}`
            };
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error marking email as read:", error);
        return {
            success: false,
            error: errorMessage
        };
    }
}
/**
 * Get email statistics for the active company
 */ async function getEmailStatsAction() {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            throw new Error("No active company found");
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmailStats"])();
    } catch (error) {
        console.error("Error getting email stats:", error);
        return {
            totalEmails: 0,
            sentEmails: 0,
            receivedEmails: 0,
            unreadEmails: 0,
            threadsCount: 0
        };
    }
}
async function getTotalUnreadCountAction() {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const stats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmailStats"])();
        return {
            success: true,
            count: stats.unreadEmails
        };
    } catch (error) {
        console.error("Error getting unread count:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function fetchEmailContentAction(emailId, _resendEmailId, providedContent) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        let html = null;
        let text = null;
        // If content is provided directly, use it
        if (providedContent) {
            html = providedContent.html || null;
            text = providedContent.text || null;
        } else {
            // First, try to get email from database to check for content in metadata
            const { data: email, error: emailError } = await supabase.from("communications").select("provider_message_id, provider_metadata, body, body_html").eq("id", emailId).eq("company_id", companyId).single();
            if (emailError) {
                // Don't return error for PGRST errors that might be expected
                if (emailError.code === 'PGRST116') {
                    return {
                        success: false,
                        error: "Email not found in database"
                    };
                }
                return {
                    success: false,
                    error: `Database error: ${emailError.message}`
                };
            }
            if (!email) {
                return {
                    success: false,
                    error: "Email not found in database"
                };
            }
            // Check if email already has content stored
            if (email.body_html || email.body) {
                html = email.body_html || null;
                text = email.body || null;
            } else if (email.provider_metadata) {
                // Try to extract content from provider_metadata
                const metadata = email.provider_metadata;
                // PRIORITY 1: Check webhook_content first (webhook payload - most reliable source)
                const webhookContent = metadata.webhook_content;
                if (webhookContent) {
                    const htmlValue = webhookContent.html || webhookContent.body_html;
                    const textValue = webhookContent.text || webhookContent.body;
                    if (htmlValue && typeof htmlValue === "string") {
                        const content = htmlValue.trim();
                        if (content.length > 0) {
                            html = content;
                        }
                    }
                    if (!html && textValue && typeof textValue === "string") {
                        const content = textValue.trim();
                        if (content.length > 0) {
                            text = content;
                        }
                    }
                }
                // PRIORITY 2: Check full_content (API response) if webhook didn't have content
                if (!html && !text) {
                    const fullContent = metadata.full_content;
                    if (fullContent) {
                        const htmlFields = [
                            "html",
                            "body_html",
                            "bodyHtml"
                        ];
                        const textFields = [
                            "text",
                            "body",
                            "plain_text",
                            "plainText"
                        ];
                        // Try HTML fields first
                        for (const field of htmlFields){
                            if (fullContent[field] && typeof fullContent[field] === "string") {
                                const content = fullContent[field].trim();
                                if (content.length > 0) {
                                    html = content;
                                    break;
                                }
                            }
                        }
                        // If no HTML, try text fields
                        if (!html) {
                            for (const field of textFields){
                                if (fullContent[field] && typeof fullContent[field] === "string") {
                                    const content = fullContent[field].trim();
                                    if (content.length > 0) {
                                        text = content;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                // PRIORITY 3: Check top-level metadata.data for content (webhook payload structure)
                if (!html && !text) {
                    const webhookData = metadata.data;
                    if (webhookData) {
                        const htmlValue = webhookData.html || webhookData.body_html;
                        const textValue = webhookData.text || webhookData.body;
                        if (htmlValue && typeof htmlValue === "string") {
                            const content = htmlValue.trim();
                            if (content.length > 0) {
                                html = content;
                            }
                        }
                        if (!html && textValue && typeof textValue === "string") {
                            const content = textValue.trim();
                            if (content.length > 0) {
                                text = content;
                            }
                        }
                    }
                }
                // PRIORITY 4: Check top-level metadata fields directly
                if (!html && !text) {
                    const htmlFields = [
                        "html",
                        "body_html"
                    ];
                    const textFields = [
                        "text",
                        "body"
                    ];
                    for (const field of htmlFields){
                        if (metadata[field] && typeof metadata[field] === "string") {
                            const content = metadata[field].trim();
                            if (content.length > 0) {
                                html = content;
                                break;
                            }
                        }
                    }
                    if (!html) {
                        for (const field of textFields){
                            if (metadata[field] && typeof metadata[field] === "string") {
                                const content = metadata[field].trim();
                                if (content.length > 0) {
                                    text = content;
                                    break;
                                }
                            }
                        }
                    }
                }
                // If we found content in metadata, use it and return early
                if (html || text) {
                    // Update database with extracted content
                    if ((html || text) && supabase) {
                        const { error: updateError } = await supabase.from("communications").update({
                            body: text || "",
                            body_html: html
                        }).eq("id", emailId).eq("company_id", companyId);
                        if (updateError) {
                            console.warn("⚠️  Failed to update email content in database:", updateError.message);
                        }
                    }
                    return {
                        success: true,
                        html,
                        text
                    };
                } else {
                    // No content found in metadata
                    return {
                        success: false,
                        error: "No email content available in metadata"
                    };
                }
            } else {
                // No metadata at all, can't fetch content
                return {
                    success: false,
                    error: "No email metadata available"
                };
            }
        }
        // Update the database with the content
        // Try to update, but don't fail if the email doesn't exist - we still return the content
        if (supabase) {
            const { error: updateError } = await supabase.from("communications").update({
                body: text || "",
                body_html: html
            }).eq("id", emailId).eq("company_id", companyId);
            if (updateError) {
                console.warn("⚠️  Failed to update email content in database (this is OK, content still returned):", updateError.message);
            }
        }
        return {
            success: true,
            html,
            text
        };
    } catch (error) {
        console.error("Error fetching email content:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function syncInboundRoutesToResendAction() {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { createInboundRoute } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/resend-domains.ts [app-rsc] (ecmascript, async loader)");
        const { createServiceSupabaseClient } = await __turbopack_context__.A("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript, async loader)");
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                synced: 0,
                errors: [
                    "Database connection failed"
                ]
            };
        }
        const serviceSupabase = await createServiceSupabaseClient();
        if (!serviceSupabase) {
            return {
                success: false,
                synced: 0,
                errors: [
                    "Service database connection failed"
                ]
            };
        }
        // Get all routes that don't have a resend_route_id
        // Note: This table may not be in the type definitions, so we use type assertion
        const { data: routes, error } = await serviceSupabase.from("communication_email_inbound_routes").select("id, company_id, route_address, name, enabled").is("resend_route_id", null).eq("enabled", true);
        if (error) {
            console.error("Failed to fetch routes:", error);
            return {
                success: false,
                synced: 0,
                errors: [
                    error.message
                ]
            };
        }
        if (!routes || routes.length === 0) {
            return {
                success: true,
                synced: 0,
                errors: []
            };
        }
        // Construct webhook URL
        let webhookUrl = ("TURBOPACK compile-time value", "http://localhost:3000");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        webhookUrl = `${webhookUrl}/api/webhooks/resend`;
        const errors = [];
        let synced = 0;
        for (const route of routes || []){
            try {
                // Handle catch-all routes (e.g., @biezru.resend.app)
                // Resend doesn't support true catch-all, so we'll create a route for the domain
                // For now, we'll skip catch-all routes and handle them differently
                if (route.route_address.startsWith("@")) {
                    errors.push(`Catch-all routes (${route.route_address}) need to be configured manually in Resend dashboard`);
                    continue;
                }
                // Create route in Resend
                const result = await createInboundRoute({
                    name: route.name || `Route for ${route.route_address}`,
                    recipients: [
                        route.route_address
                    ],
                    url: webhookUrl
                });
                if (!result.success) {
                    console.error(`❌ Failed to create Resend route for ${route.route_address}:`, result.error);
                    errors.push(`${route.route_address}: ${result.error}`);
                    continue;
                }
                // Update database with resend_route_id
                const { error: updateError } = await serviceSupabase.from("communication_email_inbound_routes").update({
                    resend_route_id: result.data.id,
                    signing_secret: result.data.secret || null,
                    last_synced_at: new Date().toISOString()
                }).eq("id", route.id);
                if (updateError) {
                    console.error(`❌ Failed to update route ${route.route_address}:`, updateError);
                    errors.push(`${route.route_address}: Database update failed`);
                    continue;
                }
                synced++;
            } catch (error) {
                console.error(`❌ Error syncing route ${route.route_address}:`, error);
                errors.push(`${route.route_address}: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }
        return {
            success: errors.length === 0,
            synced,
            errors
        };
    } catch (error) {
        console.error("Error syncing inbound routes:", error);
        return {
            success: false,
            synced: 0,
            errors: [
                error instanceof Error ? error.message : "Unknown error"
            ]
        };
    }
}
async function archiveEmailAction(emailId) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const { error } = await supabase.from("communications").update({
            is_archived: true
        }).eq("id", emailId).eq("company_id", companyId).eq("type", "email");
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function bulkArchiveEmailsAction(emailIds) {
    if (!emailIds || emailIds.length === 0) {
        return {
            success: false,
            archived: 0,
            error: "No email IDs provided"
        };
    }
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                archived: 0,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                archived: 0,
                error: "Database connection failed"
            };
        }
        const { data, error } = await supabase.from("communications").update({
            is_archived: true
        }).in("id", emailIds).eq("company_id", companyId).eq("type", "email").select("id");
        if (error) {
            return {
                success: false,
                archived: 0,
                error: error.message
            };
        }
        const archivedCount = data?.length ?? 0;
        return {
            success: true,
            archived: archivedCount
        };
    } catch (error) {
        return {
            success: false,
            archived: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function archiveAllEmailsAction(folder) {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                archived: 0,
                error: "No active company found"
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["archiveAllEmails"])(companyId, folder);
        if (!result.success) {
            return {
                success: false,
                archived: 0,
                error: result.error
            };
        }
        return {
            success: true,
            archived: result.count
        };
    } catch (error) {
        return {
            success: false,
            archived: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getEmailFolderCountsAction() {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Get counts for each folder type using parallel queries
        // All counts show UNREAD emails only (read_at IS NULL)
        const [allResult, inboxResult, draftsResult, sentResult, archiveResult, snoozedResult, spamResult, trashResult, starredResult] = await Promise.all([
            // All Mail: all non-deleted, unread emails
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").is("deleted_at", null).is("read_at", null),
            // Inbox: inbound, not archived, not deleted, not draft, not spam, unread
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").eq("direction", "inbound").eq("is_archived", false).is("deleted_at", null).is("read_at", null).neq("status", "draft").or("category.is.null,category.neq.spam").or("snoozed_until.is.null,snoozed_until.lt.now()"),
            // Drafts - always count all drafts (read_at not relevant for drafts)
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").eq("status", "draft").is("deleted_at", null),
            // Sent: outbound, not archived, not deleted, unread
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").eq("direction", "outbound").eq("is_archived", false).is("deleted_at", null).is("read_at", null).neq("status", "draft"),
            // Archive - unread archived emails
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").eq("is_archived", true).is("deleted_at", null).is("read_at", null),
            // Snoozed - unread snoozed emails
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").not("snoozed_until", "is", null).gt("snoozed_until", new Date().toISOString()).is("deleted_at", null).is("read_at", null),
            // Spam - fetch category, tags, and read_at to count unread spam
            supabase.from("communications").select("category, tags, read_at").eq("company_id", companyId).eq("type", "email").is("deleted_at", null).is("read_at", null),
            // Trash - unread deleted emails
            supabase.from("communications").select("*", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("type", "email").not("deleted_at", "is", null).is("read_at", null),
            // Starred - fetch tags and read_at, count unread starred in memory
            supabase.from("communications").select("tags, read_at").eq("company_id", companyId).eq("type", "email").is("deleted_at", null).is("read_at", null)
        ]);
        // Count spam emails in memory (category=spam OR spam tag)
        const spamCount = (spamResult.data ?? []).filter((email)=>{
            const tags = email.tags;
            const hasSpamTag = Array.isArray(tags) && tags.includes("spam");
            return email.category === "spam" || hasSpamTag;
        }).length;
        // Count starred emails in memory
        const starredCount = (starredResult.data ?? []).filter((email)=>{
            const tags = email.tags;
            return Array.isArray(tags) && tags.includes("starred");
        }).length;
        return {
            success: true,
            counts: {
                all: allResult.count ?? 0,
                inbox: inboxResult.count ?? 0,
                drafts: draftsResult.count ?? 0,
                sent: sentResult.count ?? 0,
                archive: archiveResult.count ?? 0,
                snoozed: snoozedResult.count ?? 0,
                spam: spamCount,
                trash: trashResult.count ?? 0,
                starred: starredCount
            }
        };
    } catch (error) {
        console.error("Error getting email folder counts:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function toggleStarEmailAction(emailId) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // First, get current tags
        const { data: email, error: fetchError } = await supabase.from("communications").select("tags").eq("id", emailId).eq("company_id", companyId).eq("type", "email").single();
        if (fetchError) {
            return {
                success: false,
                error: fetchError.message
            };
        }
        const currentTags = email?.tags || [];
        const isCurrentlyStarred = currentTags.includes("starred");
        // Toggle the starred tag
        const newTags = isCurrentlyStarred ? currentTags.filter((tag)=>tag !== "starred") : [
            ...currentTags,
            "starred"
        ];
        // Update the email
        const { error: updateError } = await supabase.from("communications").update({
            tags: newTags.length > 0 ? newTags : null
        }).eq("id", emailId).eq("company_id", companyId).eq("type", "email");
        if (updateError) {
            return {
                success: false,
                error: updateError.message
            };
        }
        return {
            success: true,
            isStarred: !isCurrentlyStarred
        };
    } catch (error) {
        console.error("Error toggling star on email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function toggleSpamEmailAction(emailId) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // First, get current tags and category
        const { data: email, error: fetchError } = await supabase.from("communications").select("tags, category").eq("id", emailId).eq("company_id", companyId).eq("type", "email").single();
        if (fetchError) {
            return {
                success: false,
                error: fetchError.message
            };
        }
        const currentTags = email?.tags || [];
        const isCurrentlySpam = currentTags.includes("spam") || email?.category === "spam";
        // Toggle the spam tag and category
        const newTags = isCurrentlySpam ? currentTags.filter((tag)=>tag !== "spam") : [
            ...currentTags,
            "spam"
        ];
        const newCategory = isCurrentlySpam ? null : "spam";
        // Update the email
        const { error: updateError } = await supabase.from("communications").update({
            tags: newTags.length > 0 ? newTags : null,
            category: newCategory
        }).eq("id", emailId).eq("company_id", companyId).eq("type", "email");
        if (updateError) {
            return {
                success: false,
                error: updateError.message
            };
        }
        return {
            success: true,
            isSpam: !isCurrentlySpam
        };
    } catch (error) {
        console.error("Error toggling spam on email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function snoozeEmailAction(emailId, snoozeUntil) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Update the snoozed_until field
        const { error: updateError } = await supabase.from("communications").update({
            snoozed_until: snoozeUntil
        }).eq("id", emailId).eq("company_id", companyId).eq("type", "email");
        if (updateError) {
            return {
                success: false,
                error: updateError.message
            };
        }
        return {
            success: true,
            snoozedUntil: snoozeUntil
        };
    } catch (error) {
        console.error("Error snoozing email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function unsnoozeEmailAction(emailId) {
    return snoozeEmailAction(emailId, null);
}
async function bulkMarkReadUnreadAction(emailIds, markAsRead) {
    if (!emailIds || emailIds.length === 0) {
        return {
            success: false,
            updated: 0,
            error: "No IDs provided"
        };
    }
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                updated: 0,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                updated: 0,
                error: "Database connection failed"
            };
        }
        const { data, error } = await supabase.from("communications").update({
            read_at: markAsRead ? new Date().toISOString() : null
        }).in("id", emailIds).eq("company_id", companyId).eq("type", "email").select("id");
        if (error) {
            return {
                success: false,
                updated: 0,
                error: error.message
            };
        }
        // Dispatch event to refresh counts
        return {
            success: true,
            updated: data?.length ?? 0
        };
    } catch (error) {
        console.error("Error bulk marking emails:", error);
        return {
            success: false,
            updated: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function bulkStarEmailsAction(emailIds, addStar) {
    if (!emailIds || emailIds.length === 0) {
        return {
            success: false,
            updated: 0,
            error: "No IDs provided"
        };
    }
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                updated: 0,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                updated: 0,
                error: "Database connection failed"
            };
        }
        // OPTIMIZED: Batch fetch all emails in ONE query (was N queries)
        const { data: emails } = await supabase.from("communications").select("id, tags").in("id", emailIds).eq("company_id", companyId);
        if (!emails || emails.length === 0) {
            return {
                success: true,
                updated: 0
            };
        }
        // Group emails by what changes need to be made
        const toUpdate = [];
        for (const email of emails){
            const currentTags = email.tags || [];
            const hasStarred = currentTags.includes("starred");
            let newTags;
            if (addStar && !hasStarred) {
                newTags = [
                    ...currentTags,
                    "starred"
                ];
            } else if (!addStar && hasStarred) {
                newTags = currentTags.filter((t)=>t !== "starred");
            } else {
                continue; // No change needed
            }
            toUpdate.push({
                id: email.id,
                newTags: newTags.length > 0 ? newTags : null
            });
        }
        if (toUpdate.length === 0) {
            return {
                success: true,
                updated: 0
            };
        }
        // Batch update using Promise.all (parallel updates)
        const results = await Promise.all(toUpdate.map(({ id, newTags })=>supabase.from("communications").update({
                tags: newTags
            }).eq("id", id).eq("company_id", companyId)));
        const updatedCount = results.filter((r)=>!r.error).length;
        return {
            success: true,
            updated: updatedCount
        };
    } catch (error) {
        console.error("Error bulk starring emails:", error);
        return {
            success: false,
            updated: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function bulkDeleteEmailsAction(emailIds) {
    if (!emailIds || emailIds.length === 0) {
        return {
            success: false,
            deleted: 0,
            error: "No IDs provided"
        };
    }
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                deleted: 0,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                deleted: 0,
                error: "Database connection failed"
            };
        }
        // Soft delete by setting deleted_at
        const { data, error } = await supabase.from("communications").update({
            deleted_at: new Date().toISOString()
        }).in("id", emailIds).eq("company_id", companyId).eq("type", "email").select("id");
        if (error) {
            return {
                success: false,
                deleted: 0,
                error: error.message
            };
        }
        return {
            success: true,
            deleted: data?.length ?? 0
        };
    } catch (error) {
        console.error("Error bulk deleting emails:", error);
        return {
            success: false,
            deleted: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function bulkMoveToSpamAction(emailIds) {
    if (!emailIds || emailIds.length === 0) {
        return {
            success: false,
            moved: 0,
            error: "No IDs provided"
        };
    }
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                moved: 0,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                moved: 0,
                error: "Database connection failed"
            };
        }
        // OPTIMIZED: Batch fetch all emails in ONE query (was N queries)
        const { data: emails } = await supabase.from("communications").select("id, tags").in("id", emailIds).eq("company_id", companyId);
        if (!emails || emails.length === 0) {
            return {
                success: true,
                moved: 0
            };
        }
        // Prepare updates with new tags
        const updates = emails.map((email)=>{
            const currentTags = email.tags || [];
            const newTags = currentTags.includes("spam") ? currentTags : [
                ...currentTags,
                "spam"
            ];
            return {
                id: email.id,
                newTags
            };
        });
        // Batch update using Promise.all (parallel updates)
        const results = await Promise.all(updates.map(({ id, newTags })=>supabase.from("communications").update({
                category: "spam",
                tags: newTags
            }).eq("id", id).eq("company_id", companyId)));
        const movedCount = results.filter((r)=>!r.error).length;
        return {
            success: true,
            moved: movedCount
        };
    } catch (error) {
        console.error("Error moving emails to spam:", error);
        return {
            success: false,
            moved: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
// ============================================================================
// DRAFT ACTIONS
// ============================================================================
const saveDraftSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email()).optional().default([]),
    cc: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email()).optional().default([]),
    bcc: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email()).optional().default([]),
    subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default(""),
    body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default(""),
    bodyHtml: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    attachments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        filename: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        contentType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    })).optional()
});
async function saveDraftAction(input) {
    try {
        const parseResult = saveDraftSchema.safeParse(input);
        if (!parseResult.success) {
            return {
                success: false,
                error: `Invalid input: ${parseResult.error.message}`
            };
        }
        const { id, to, cc, bcc, subject, body, bodyHtml, customerId, attachments } = parseResult.data;
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Get the company's default email address for from_address
        const { data: companySettings } = await supabase.from("company_communication_settings").select("email_from_address, email_from_name").eq("company_id", companyId).single();
        const fromAddress = companySettings?.email_from_address || "noreply@example.com";
        const fromName = companySettings?.email_from_name || "Draft";
        const draftData = {
            company_id: companyId,
            customer_id: customerId || null,
            type: "email",
            direction: "outbound",
            from_address: fromAddress,
            from_name: fromName,
            to_address: to.length > 0 ? to.join(", ") : "draft@placeholder.local",
            cc_address: cc.length > 0 ? cc.join(", ") : null,
            bcc_address: bcc.length > 0 ? bcc.join(", ") : null,
            subject: subject || "(No subject)",
            body: body || "",
            body_html: bodyHtml || null,
            attachments: attachments && attachments.length > 0 ? attachments : null,
            attachment_count: attachments?.length || 0,
            status: "draft",
            is_automated: false,
            is_internal: false,
            is_archived: false,
            is_thread_starter: true,
            priority: "normal",
            updated_at: new Date().toISOString()
        };
        if (id) {
            // Update existing draft
            const { error: updateError } = await supabase.from("communications").update(draftData).eq("id", id).eq("company_id", companyId).eq("status", "draft");
            if (updateError) {
                console.error("Error updating draft:", updateError);
                return {
                    success: false,
                    error: updateError.message
                };
            }
            return {
                success: true,
                draftId: id
            };
        } else {
            // Create new draft
            const { data: newDraft, error: insertError } = await supabase.from("communications").insert({
                ...draftData,
                created_at: new Date().toISOString()
            }).select("id").single();
            if (insertError) {
                console.error("Error creating draft:", insertError);
                return {
                    success: false,
                    error: insertError.message
                };
            }
            return {
                success: true,
                draftId: newDraft.id
            };
        }
    } catch (error) {
        console.error("Error saving draft:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getDraftAction(draftId) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const { data: draft, error: fetchError } = await supabase.from("communications").select("id, to_address, cc_address, bcc_address, subject, body, body_html, customer_id, attachments, updated_at").eq("id", draftId).eq("company_id", companyId).eq("status", "draft").single();
        if (fetchError) {
            return {
                success: false,
                error: fetchError.message
            };
        }
        if (!draft) {
            return {
                success: false,
                error: "Draft not found"
            };
        }
        // Parse addresses from comma-separated strings to arrays
        const parseAddresses = (addr)=>{
            if (!addr || addr === "draft@placeholder.local") return [];
            return addr.split(",").map((a)=>a.trim()).filter(Boolean);
        };
        return {
            success: true,
            draft: {
                id: draft.id,
                to: parseAddresses(draft.to_address),
                cc: parseAddresses(draft.cc_address),
                bcc: parseAddresses(draft.bcc_address),
                subject: draft.subject === "(No subject)" ? "" : draft.subject || "",
                body: draft.body || "",
                bodyHtml: draft.body_html,
                customerId: draft.customer_id,
                attachments: draft.attachments,
                updatedAt: draft.updated_at
            }
        };
    } catch (error) {
        console.error("Error getting draft:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function deleteDraftAction(draftId) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Hard delete drafts (they don't need to go to trash)
        const { error: deleteError } = await supabase.from("communications").delete().eq("id", draftId).eq("company_id", companyId).eq("status", "draft");
        if (deleteError) {
            return {
                success: false,
                error: deleteError.message
            };
        }
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting draft:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function retryFailedEmailAction(emailId) {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const { sendEmail } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript, async loader)");
        const { PlainTextEmail } = await __turbopack_context__.A("[project]/apps/web/src/emails/plain-text-email.tsx [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Get the failed email
        const { data: email, error: fetchError } = await supabase.from("communications").select("*").eq("id", emailId).eq("company_id", companyId).eq("type", "email").eq("status", "failed").single();
        if (fetchError) {
            return {
                success: false,
                error: fetchError.message
            };
        }
        if (!email) {
            return {
                success: false,
                error: "Failed email not found"
            };
        }
        // Reset status to queued
        const { error: updateError } = await supabase.from("communications").update({
            status: "queued",
            failure_reason: null
        }).eq("id", emailId).eq("company_id", companyId);
        if (updateError) {
            return {
                success: false,
                error: `Failed to reset email status: ${updateError.message}`
            };
        }
        // Parse recipients
        const parseAddresses = (addr)=>{
            if (!addr) return [];
            const addresses = addr.split(",").map((a)=>a.trim()).filter(Boolean);
            return addresses.length === 1 ? addresses[0] : addresses;
        };
        const to = parseAddresses(email.to_address);
        const cc = parseAddresses(email.cc_address);
        const bcc = parseAddresses(email.bcc_address);
        // Get attachments from metadata if stored (for scheduled emails)
        const metadata = email.provider_metadata;
        const attachments = metadata?.scheduled_attachments;
        // Attempt to resend
        const sendResult = await sendEmail({
            to,
            subject: email.subject || "(No subject)",
            template: PlainTextEmail({
                message: email.body || ""
            }),
            templateType: "generic",
            companyId,
            communicationId: emailId,
            cc: cc.length > 0 ? cc : undefined,
            bcc: bcc.length > 0 ? bcc : undefined,
            attachments
        });
        if (!sendResult.success) {
            // Update status back to failed
            await supabase.from("communications").update({
                status: "failed",
                failure_reason: sendResult.error || "Email send failed on retry"
            }).eq("id", emailId).eq("company_id", companyId);
            return {
                success: false,
                error: sendResult.error || "Failed to send email on retry"
            };
        }
        // Update status to sent
        await supabase.from("communications").update({
            status: "sent",
            sent_at: new Date().toISOString(),
            provider_message_id: sendResult.data?.id || null,
            failure_reason: null
        }).eq("id", emailId).eq("company_id", companyId);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error retrying failed email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getEmailsAction,
    getEmailByIdAction,
    markEmailAsReadAction,
    getTotalUnreadCountAction,
    fetchEmailContentAction,
    syncInboundRoutesToResendAction,
    archiveEmailAction,
    bulkArchiveEmailsAction,
    archiveAllEmailsAction,
    getEmailFolderCountsAction,
    toggleStarEmailAction,
    toggleSpamEmailAction,
    snoozeEmailAction,
    unsnoozeEmailAction,
    bulkMarkReadUnreadAction,
    bulkStarEmailsAction,
    bulkDeleteEmailsAction,
    bulkMoveToSpamAction,
    saveDraftAction,
    getDraftAction,
    deleteDraftAction,
    retryFailedEmailAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailsAction, "40999f3a0443a8bc9a56c8a0ff2c0d66a29fb2437b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailByIdAction, "4067ebaccd899dae87d3a1ff6bae15161edc0331da", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markEmailAsReadAction, "401256a4f4e40e272f500e766adff7e93ff02c384b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTotalUnreadCountAction, "00b83d20602d045512eefed4896ab81b399955d9af", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchEmailContentAction, "701f22a5defcdeafb177b203c595b4058846e45e06", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(syncInboundRoutesToResendAction, "00dab49edd23516267827fa0cb35aa70601269c2d8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(archiveEmailAction, "40d8ca342865680e3ec0586109e052711a8d4d6aa4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkArchiveEmailsAction, "406cb9ae57815889d2cc8268c1f6a293d241493f64", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(archiveAllEmailsAction, "40bdf331654aee787ae3ecd178d48a7d85efaf1507", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailFolderCountsAction, "00892ae3dc26e893f6e8f855ffbcbb3236013a3063", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleStarEmailAction, "405ecad369a5a30b8ca4cb2d0bbd1cf0df8923d990", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleSpamEmailAction, "401ff8846eaa8841fda1655f09fd051af559f0f7c0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(snoozeEmailAction, "60068956bf986d816dc4a486cd91c6afb7a224c098", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(unsnoozeEmailAction, "40db11cd1a2b7a716713f29752bc8b1284d60e2133", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkMarkReadUnreadAction, "6053c463c64dcc743d1de1805950cd81913f806fa9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkStarEmailsAction, "60cc3f085d8c0feb0fec31d830c58aae2364aa3564", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkDeleteEmailsAction, "40694f7d97e58fc9f3fec8029507a7317718f3dc2b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkMoveToSpamAction, "403299458c55d95e2de8c629beee0ab5f85196999b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveDraftAction, "40789366e3c8496828761b520f3893c8ce6fc5afe6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDraftAction, "40c7e57ac4b075750e42a77600d2d0687af67f9848", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteDraftAction, "40be8f9b412e1975fa1c838655749c305ddf4ef119", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(retryFailedEmailAction, "409d9e6ffa4b31e342c9d764865d0b91d6e4e50493", null);
}),
"[project]/apps/web/src/actions/notifications.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0038f75aa39d15eb18c5c68052266488d280f74485":"markAllAsRead","4022f0d1af58af357722d076fddfb622506d28aba1":"getNotifications","409fd913f4a9df89acb91012593a14f1e8b4179ca8":"deleteNotification","40c2b4df5c915e0d2dea73d2b793e09f294ca0427f":"markAsRead"},"",""] */ __turbopack_context__.s([
    "deleteNotification",
    ()=>deleteNotification,
    "getNotifications",
    ()=>getNotifications,
    "markAllAsRead",
    ()=>markAllAsRead,
    "markAsRead",
    ()=>markAsRead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Notifications Server Actions
 *
 * Server-side operations for the notifications system including:
 * - Fetching notifications with filtering and pagination
 * - Creating new notifications
 * - Marking notifications as read/unread
 * - Deleting notifications
 * - Managing notification preferences
 *
 * Performance optimizations:
 * - Server-side data fetching and validation
 * - Efficient database queries with proper indexes
 * - RLS policies for security
 * - Zod validation for all inputs
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$notifications$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/notifications/types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
// NOTE: Type re-exports removed to comply with Next.js 16 "use server" restrictions
// Import types directly from @/lib/notifications/types instead
const UpdateNotificationPreferencesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$notifications$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NotificationPreferenceSchema"]);
// =====================================================================================
// Helper Functions
// =====================================================================================
/**
 * Get authenticated user and company context
 */ async function getAuthContext() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error("Not authenticated");
    }
    // Get user's active company from team_members
    const { data: teamMember, error: teamError } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").maybeSingle();
    if (teamError) {
        throw new Error("Failed to fetch user company");
    }
    if (!teamMember) {
        throw new Error("No active company found");
    }
    return {
        userId: user.id,
        companyId: teamMember.company_id,
        supabase
    };
}
async function getNotifications(options) {
    try {
        // Notifications are user-specific, not company-specific
        // So we don't need the full auth context with company
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new Error("Supabase client not configured");
        }
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error("Not authenticated");
        }
        const userId = user.id;
        // Validate input
        const validatedOptions = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$notifications$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GetNotificationsSchema"].parse(options || {});
        // Build query
        let query = supabase.from("notifications").select("*", {
            count: "exact"
        }).eq("user_id", userId).order("created_at", {
            ascending: false
        });
        // Apply filters
        if (validatedOptions.unreadOnly) {
            query = query.eq("read", false);
        }
        if (validatedOptions.type) {
            query = query.eq("type", validatedOptions.type);
        }
        if (validatedOptions.priority) {
            query = query.eq("priority", validatedOptions.priority);
        }
        // Apply pagination
        query = query.range(validatedOptions.offset, validatedOptions.offset + validatedOptions.limit - 1);
        const { data, error, count } = await query;
        if (error) {
            return {
                success: false,
                error: "Failed to fetch notifications",
                data: [],
                count: 0
            };
        }
        return {
            success: true,
            data: data || [],
            count: count || 0
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation error",
                data: [],
                count: 0
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred",
            data: [],
            count: 0
        };
    }
}
/**
 * Get unread notification count for the current user
 *
 * @returns Number of unread notifications
 */ async function getUnreadCount() {
    try {
        const { userId, supabase } = await getAuthContext();
        // Use the database function for optimized counting
        const { data, error } = await supabase.rpc("get_unread_notification_count", {
            p_user_id: userId
        });
        if (error) {
            return {
                success: false,
                error: "Failed to fetch unread count",
                count: 0
            };
        }
        return {
            success: true,
            count: data || 0
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred",
            count: 0
        };
    }
}
/**
 * Create a new notification
 *
 * @param input - Notification data
 * @returns Created notification
 */ async function createNotification(input) {
    try {
        const { supabase } = await getAuthContext();
        // Validate input
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$notifications$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CreateNotificationSchema"].parse(input);
        const { data, error } = await supabase.from("notifications").insert({
            user_id: validatedData.userId,
            company_id: validatedData.companyId,
            type: validatedData.type,
            priority: validatedData.priority,
            title: validatedData.title,
            message: validatedData.message,
            action_url: validatedData.actionUrl,
            action_label: validatedData.actionLabel,
            metadata: validatedData.metadata || {}
        }).select().single();
        if (error) {
            return {
                success: false,
                error: "Failed to create notification"
            };
        }
        // Revalidate paths where notifications appear
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/notifications");
        return {
            success: true,
            data
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred"
        };
    }
}
async function markAsRead(notificationId) {
    try {
        const { userId, supabase } = await getAuthContext();
        // Validate UUID
        const idSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid notification ID");
        const validatedId = idSchema.parse(notificationId);
        const { error } = await supabase.from("notifications").update({
            read: true
        }).eq("id", validatedId).eq("user_id", userId); // Ensure user owns the notification
        if (error) {
            return {
                success: false,
                error: "Failed to mark notification as read"
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/notifications");
        return {
            success: true
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred"
        };
    }
}
async function markAllAsRead() {
    try {
        const { userId, supabase } = await getAuthContext();
        // Use the database function for bulk operation
        const { data, error } = await supabase.rpc("mark_all_notifications_read", {
            p_user_id: userId
        });
        if (error) {
            return {
                success: false,
                error: "Failed to mark all notifications as read",
                count: 0
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/notifications");
        return {
            success: true,
            count: data || 0
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred",
            count: 0
        };
    }
}
/**
 * Mark a notification as unread
 *
 * @param notificationId - ID of the notification to mark as unread
 * @returns Success status
 */ async function markAsUnread(notificationId) {
    try {
        const { userId, supabase } = await getAuthContext();
        // Validate UUID
        const idSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid notification ID");
        const validatedId = idSchema.parse(notificationId);
        const { error } = await supabase.from("notifications").update({
            read: false
        }).eq("id", validatedId).eq("user_id", userId); // Ensure user owns the notification
        if (error) {
            return {
                success: false,
                error: "Failed to mark notification as unread"
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/notifications");
        return {
            success: true
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred"
        };
    }
}
async function deleteNotification(notificationId) {
    try {
        const { userId, supabase } = await getAuthContext();
        // Validate UUID
        const idSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid notification ID");
        const validatedId = idSchema.parse(notificationId);
        const { error } = await supabase.from("notifications").delete().eq("id", validatedId).eq("user_id", userId); // Ensure user owns the notification
        if (error) {
            return {
                success: false,
                error: "Failed to delete notification"
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/notifications");
        return {
            success: true
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred"
        };
    }
}
// =====================================================================================
// Notification Preferences Operations
// =====================================================================================
/**
 * Get notification preferences for the current user
 *
 * @returns Array of notification preferences
 */ async function getNotificationPreferences() {
    try {
        const { userId, companyId, supabase } = await getAuthContext();
        const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).eq("company_id", companyId);
        if (error) {
            return {
                success: false,
                error: "Failed to fetch notification preferences",
                data: []
            };
        }
        return {
            success: true,
            data: data || []
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred",
            data: []
        };
    }
}
/**
 * Update notification preferences for the current user
 *
 * @param preferences - Array of notification preference settings
 * @returns Success status
 */ async function updateNotificationPreferences(preferences) {
    try {
        const { userId, companyId, supabase } = await getAuthContext();
        // Validate input
        const validatedPreferences = UpdateNotificationPreferencesSchema.parse(preferences);
        // Delete existing preferences
        await supabase.from("notification_preferences").delete().eq("user_id", userId).eq("company_id", companyId);
        // Insert new preferences
        const preferencesToInsert = validatedPreferences.map((pref)=>({
                user_id: userId,
                company_id: companyId,
                channel: pref.channel,
                event_type: pref.eventType,
                enabled: pref.enabled
            }));
        const { error } = await supabase.from("notification_preferences").insert(preferencesToInsert);
        if (error) {
            return {
                success: false,
                error: "Failed to update notification preferences"
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/profile/notifications");
        return {
            success: true
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNotifications, "4022f0d1af58af357722d076fddfb622506d28aba1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markAsRead, "40c2b4df5c915e0d2dea73d2b793e09f294ca0427f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markAllAsRead, "0038f75aa39d15eb18c5c68052266488d280f74485", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteNotification, "409fd913f4a9df89acb91012593a14f1e8b4179ca8", null);
}),
"[project]/apps/web/src/actions/emails.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Email Server Actions - Type-safe email sending functions
 *
 * Features:
 * - Server-side email sending via Resend
 * - Type-safe template rendering
 * - Error handling and logging
 * - Development mode support
 */ /* __next_internal_action_entry_do_not_use__ [{"6068dd5f6add321e280c7224c5d6ae959e0f46aaca":"sendEmailVerification","606cb7f12471ff76596ad458adc5217388e507a2e1":"sendWelcomeEmail","60a9befff045142cdb8d6f186067c4c3287a423a2f":"sendPasswordChanged","60f7f0d05f3433ee6321c7d4060b3a9315a19a9ff9":"sendPasswordReset"},"",""] */ __turbopack_context__.s([
    "sendEmailVerification",
    ()=>sendEmailVerification,
    "sendPasswordChanged",
    ()=>sendPasswordChanged,
    "sendPasswordReset",
    ()=>sendPasswordReset,
    "sendWelcomeEmail",
    ()=>sendWelcomeEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$email$2d$verification$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/auth/email-verification.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$magic$2d$link$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/auth/magic-link.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$password$2d$changed$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/auth/password-changed.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$password$2d$reset$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/auth/password-reset.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$welcome$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/auth/welcome.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$estimate$2d$sent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/billing/estimate-sent.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$invoice$2d$sent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/billing/invoice-sent.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$payment$2d$received$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/billing/payment-received.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$payment$2d$reminder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/billing/payment-reminder.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$review$2d$request$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/customer/review-request.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$service$2d$reminder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/customer/service-reminder.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$welcome$2d$customer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/customer/welcome-customer.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$appointment$2d$reminder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/jobs/appointment-reminder.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$job$2d$complete$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/jobs/job-complete.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$job$2d$confirmation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/jobs/job-confirmation.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$tech$2d$en$2d$route$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/jobs/tech-en-route.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
async function sendWelcomeEmail(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Welcome to Thorbis!",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$welcome$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].WELCOME
    });
}
async function sendEmailVerification(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Verify your email address",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$email$2d$verification$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].EMAIL_VERIFICATION
    });
}
async function sendPasswordReset(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Reset your password",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$password$2d$reset$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].PASSWORD_RESET
    });
}
async function sendPasswordChanged(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Your password has been changed",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$password$2d$changed$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].PASSWORD_CHANGED
    });
}
/**
 * Send magic link for passwordless authentication
 */ async function sendMagicLink(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Sign in to Thorbis",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$auth$2f$magic$2d$link$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].MAGIC_LINK
    });
}
// =============================================================================
// JOB LIFECYCLE EMAILS
// =============================================================================
/**
 * Send job confirmation email
 */ async function sendJobConfirmation(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: `Service Appointment Confirmed - ${props.jobType}`,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$job$2d$confirmation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].JOB_CONFIRMATION,
        tags: [
            {
                name: "job_number",
                value: props.jobNumber
            }
        ]
    });
}
/**
 * Send appointment reminder (24h before)
 */ async function sendAppointmentReminder(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Reminder: Your service appointment is tomorrow",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$appointment$2d$reminder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].APPOINTMENT_REMINDER
    });
}
/**
 * Send technician en route notification
 */ async function sendTechEnRoute(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: `${props.technicianName} is on the way!`,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$tech$2d$en$2d$route$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].TECH_EN_ROUTE
    });
}
/**
 * Send job completion notification
 */ async function sendJobComplete(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Your service is complete!",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$jobs$2f$job$2d$complete$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].JOB_COMPLETE,
        tags: [
            {
                name: "job_number",
                value: props.jobNumber
            }
        ]
    });
}
// =============================================================================
// BILLING EMAILS
// =============================================================================
/**
 * Send invoice to customer
 */ async function sendInvoice(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: `Invoice ${props.invoiceNumber} from Thorbis`,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$invoice$2d$sent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].INVOICE_SENT,
        tags: [
            {
                name: "invoice_number",
                value: props.invoiceNumber
            },
            {
                name: "amount",
                value: props.totalAmount
            }
        ]
    });
}
/**
 * Send payment confirmation
 */ async function sendPaymentReceived(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Payment received - Thank you!",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$payment$2d$received$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].PAYMENT_RECEIVED,
        tags: [
            {
                name: "invoice_number",
                value: props.invoiceNumber
            },
            {
                name: "amount",
                value: props.paymentAmount
            }
        ]
    });
}
/**
 * Send payment reminder for overdue invoice
 */ async function sendPaymentReminder(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: `Payment reminder: Invoice ${props.invoiceNumber}`,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$payment$2d$reminder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].PAYMENT_REMINDER,
        tags: [
            {
                name: "invoice_number",
                value: props.invoiceNumber
            },
            {
                name: "days_overdue",
                value: props.daysOverdue.toString()
            }
        ]
    });
}
/**
 * Send estimate/quote to customer
 */ async function sendEstimate(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: `Estimate ${props.estimateNumber} from Thorbis`,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$billing$2f$estimate$2d$sent$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].ESTIMATE_SENT,
        tags: [
            {
                name: "estimate_number",
                value: props.estimateNumber
            },
            {
                name: "amount",
                value: props.totalAmount
            }
        ]
    });
}
// =============================================================================
// CUSTOMER ENGAGEMENT EMAILS
// =============================================================================
/**
 * Send review request after job completion
 */ async function sendReviewRequest(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "How was your experience with Thorbis?",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$review$2d$request$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].REVIEW_REQUEST,
        tags: [
            {
                name: "job_number",
                value: props.jobNumber
            }
        ]
    });
}
/**
 * Send service/maintenance reminder
 */ async function sendServiceReminder(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: `Time for your ${props.serviceName} service`,
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$service$2d$reminder$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].SERVICE_REMINDER
    });
}
/**
 * Send welcome email to new customer
 */ async function sendWelcomeCustomer(to, props) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
        to,
        subject: "Welcome to Thorbis!",
        template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$welcome$2d$customer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(props),
        templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].WELCOME_CUSTOMER
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendWelcomeEmail,
    sendEmailVerification,
    sendPasswordReset,
    sendPasswordChanged
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendWelcomeEmail, "606cb7f12471ff76596ad458adc5217388e507a2e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendEmailVerification, "6068dd5f6add321e280c7224c5d6ae959e0f46aaca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendPasswordReset, "60f7f0d05f3433ee6321c7d4060b3a9315a19a9ff9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendPasswordChanged, "60a9befff045142cdb8d6f186067c4c3287a423a2f", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"005a48890fa7863395276cf2f0eee59386df8294ad":"signOut","007690b27fd877104cf6868f26556f5c264bca1028":"getCompanyIdAction","404fcb2756c461f7f3d3feb3d3cdd8c5a8ac7ef0f1":"signIn","405f58a531bc8d8038c2645e288e89c8a0078b14a1":"verifyEmail","408edc67a59f593e191adb25fb586dc16599ad27d0":"signInWithOAuth","40e13219efdc0b7711d9465d41ad4d15afbf47a197":"signUp","40ee4544030acaa2db04b235e12a7f1691b2c26d06":"completeProfile"},"",""] */ __turbopack_context__.s([
    "completeProfile",
    ()=>completeProfile,
    "getCompanyIdAction",
    ()=>getCompanyIdAction,
    "signIn",
    ()=>signIn,
    "signInWithOAuth",
    ()=>signInWithOAuth,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "verifyEmail",
    ()=>verifyEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$auth$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$auth$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+auth-js@2.81.0/node_modules/@supabase/auth-js/dist/module/lib/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
// import { checkBotId } from "botid/server";
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/tokens.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/tokens.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$csrf$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/security/csrf.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/security/rate-limit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/emails.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const COMPANY_NAME_MIN_LENGTH = 2;
const COMPANY_NAME_MAX_LENGTH = 200;
const PHONE_MIN_DIGITS = 10;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 100;
const CONFIRMATION_TOKEN_TTL_HOURS = 24;
const COUNTRY_CODE_US = "1";
const NATIONAL_NUMBER_DIGITS = 10;
const EXTENDED_US_NUMBER_DIGITS = 11;
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
const AVATAR_SIZE_LIMIT_MB = 5;
const MAX_AVATAR_FILE_SIZE = AVATAR_SIZE_LIMIT_MB * BYTES_PER_MEGABYTE;
/**
 * Authentication Server Actions - Supabase Auth + Resend Email Integration
 *
 * Performance optimizations:
 * - Server Actions for secure authentication
 * - Supabase Auth handles password hashing and session management
 * - Custom emails via Resend with branded templates
 * - Zod validation for input sanitization
 * - Proper error handling with user-friendly messages
 */ // Validation Schemas
const signUpSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(NAME_MIN_LENGTH, "Name must be at least 2 characters").max(NAME_MAX_LENGTH, "Name is too long"),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address"),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(PHONE_MIN_DIGITS, "Phone number is required").refine((value)=>value.replace(/\D/g, "").length >= PHONE_MIN_DIGITS, "Enter a valid phone number"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters").max(PASSWORD_MAX_LENGTH, "Password is too long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
    companyName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(COMPANY_NAME_MIN_LENGTH, "Company name must be at least 2 characters").max(COMPANY_NAME_MAX_LENGTH, "Company name is too long").optional(),
    terms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().refine((val)=>val === true, "You must accept the terms and conditions")
});
const signInSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Password is required")
});
const forgotPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address")
});
const resetPasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters").max(PASSWORD_MAX_LENGTH, "Password is too long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: [
        "confirmPassword"
    ]
});
const AVATAR_STORAGE_BUCKET = "avatars";
const SUPABASE_RATE_LIMIT_MAX_RETRIES = 3;
const SUPABASE_RATE_LIMIT_BACKOFF_MS = 200;
const delay = (ms)=>new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
const withSupabaseRateLimitRetry = async (operation)=>{
    for(let attempt = 1; attempt <= SUPABASE_RATE_LIMIT_MAX_RETRIES; attempt += 1){
        try {
            const result = await operation();
            if (result && typeof result === "object" && "error" in result && result.error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$auth$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$auth$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthApiError"] && result.error.code === "over_request_rate_limit") {
                if (attempt === SUPABASE_RATE_LIMIT_MAX_RETRIES) {
                    throw result.error;
                }
                await delay(SUPABASE_RATE_LIMIT_BACKOFF_MS * attempt);
                continue;
            }
            return result;
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$auth$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$auth$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthApiError"] && error.code === "over_request_rate_limit" && attempt < SUPABASE_RATE_LIMIT_MAX_RETRIES) {
                await delay(SUPABASE_RATE_LIMIT_BACKOFF_MS * attempt);
                continue;
            }
            throw error;
        }
    }
    throw new Error("Supabase auth operation failed after retries");
};
function normalizePhoneNumber(input) {
    const trimmed = input.trim();
    const digitsOnly = trimmed.replace(/\D/g, "");
    if (!digitsOnly) {
        return trimmed;
    }
    if (trimmed.startsWith("+")) {
        return `+${digitsOnly}`;
    }
    if (digitsOnly.length === EXTENDED_US_NUMBER_DIGITS && digitsOnly.startsWith(COUNTRY_CODE_US)) {
        return `+${digitsOnly}`;
    }
    if (digitsOnly.length === NATIONAL_NUMBER_DIGITS) {
        return `+${COUNTRY_CODE_US}${digitsOnly}`;
    }
    return `+${digitsOnly}`;
}
const reportAuthIssue = (_message, _error)=>{
// TODO: Integrate structured logging/monitoring
};
const getMetadataString = (metadata, key)=>{
    if (metadata && typeof metadata === "object") {
        const value = metadata[key];
        if (typeof value === "string") {
            return value;
        }
    }
    return;
};
async function uploadAvatarForNewUser(supabase, file, userId) {
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    if (!file.type.startsWith("image/")) {
        throw new Error("Avatar must be an image");
    }
    if (file.size > MAX_AVATAR_FILE_SIZE) {
        throw new Error(`Avatar must be smaller than ${AVATAR_SIZE_LIMIT_MB}MB`);
    }
    const arrayBuffer = await file.arrayBuffer();
    const extension = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["extname"])(file.name) || ".jpg";
    const filePath = `${userId}/profile${extension}`;
    const { error: uploadError } = await supabase.storage.from(AVATAR_STORAGE_BUCKET).upload(filePath, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(arrayBuffer), {
        cacheControl: "3600",
        contentType: file.type || "image/jpeg",
        upsert: true
    });
    if (uploadError) {
        throw new Error(uploadError.message);
    }
    const { data: { publicUrl } } = supabase.storage.from(AVATAR_STORAGE_BUCKET).getPublicUrl(filePath);
    return publicUrl;
}
const createServiceClientLoader = ()=>{
    let client = null;
    return async ()=>{
        if (client) {
            return client;
        }
        client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        return client;
    };
};
const parseSignUpFormData = (formData)=>{
    const companyNameEntry = formData.get("companyName");
    const normalizedCompanyName = typeof companyNameEntry === "string" && companyNameEntry.trim().length > 0 ? companyNameEntry : undefined;
    const rawData = {
        name: formData.get("name") ?? "",
        email: formData.get("email") ?? "",
        phone: formData.get("phone") ?? "",
        password: formData.get("password") ?? "",
        companyName: normalizedCompanyName,
        terms: formData.get("terms") === "on" || formData.get("terms") === "true"
    };
    const validated = signUpSchema.parse(rawData);
    const avatarEntry = formData.get("avatar");
    const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null;
    return {
        validated,
        normalizedPhone: normalizePhoneNumber(validated.phone),
        companyName: validated.companyName?.trim() || undefined,
        avatarFile
    };
};
const requireSupabaseBrowserClient = async ()=>{
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Authentication service is not configured. Please check your environment variables.");
    }
    return supabase;
};
const registerSupabaseUser = async ({ supabase, validated, normalizedPhone, companyName })=>{
    const { data, error } = await withSupabaseRateLimitRetry(()=>supabase.auth.signUp({
            email: validated.email,
            password: validated.password,
            options: {
                data: {
                    name: validated.name,
                    phone: normalizedPhone,
                    companyName: companyName ?? null
                },
                emailRedirectTo: `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].siteUrl}/auth/callback`
            }
        }));
    if (error) {
        throw new Error(error.message);
    }
    if (!data.user) {
        throw new Error("Failed to create user account");
    }
    return data;
};
const syncSignUpProfile = async ({ ensureServiceSupabase, userId, normalizedPhone, name, companyName, avatarFile })=>{
    let avatarUrl = null;
    if (avatarFile) {
        try {
            const adminClient = await ensureServiceSupabase();
            avatarUrl = await uploadAvatarForNewUser(adminClient, avatarFile, userId);
        } catch (avatarUploadError) {
            reportAuthIssue("Avatar upload failed", avatarUploadError);
        }
    }
    try {
        const adminClient = await ensureServiceSupabase();
        const updatePayload = {
            phone: normalizedPhone
        };
        if (avatarUrl) {
            updatePayload.avatar_url = avatarUrl;
        }
        if (!adminClient) {
            throw new Error("Admin client not configured");
        }
        await adminClient.from("profiles").update(updatePayload).eq("id", userId);
    } catch (profileUpdateError) {
        reportAuthIssue("Failed to update user profile", profileUpdateError);
    }
    if (!avatarUrl) {
        return;
    }
    try {
        const adminClient = await ensureServiceSupabase();
        if (!adminClient) {
            throw new Error("Admin client not configured");
        }
        await adminClient.auth.admin.updateUserById(userId, {
            user_metadata: {
                name,
                phone: normalizedPhone,
                companyName: companyName ?? null,
                avatarUrl
            }
        });
    } catch (metadataError) {
        reportAuthIssue("Failed to sync avatar metadata", metadataError);
    }
};
const handlePostSignUpEmails = async ({ email, name, requiresConfirmation, userId })=>{
    if (requiresConfirmation) {
        const { token, expiresAt } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(email, userId, CONFIRMATION_TOKEN_TTL_HOURS);
        const verificationUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].siteUrl}/auth/verify-email?token=${token}`;
        const verificationResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmailVerification"])(email, {
            name,
            verificationUrl
        });
        if (!verificationResult.success) {
            reportAuthIssue("Failed to send verification email", verificationResult.error);
        }
        return {
            success: true,
            data: {
                requiresEmailConfirmation: true,
                message: "Account created! Please check your email to verify your account.",
                expiresAt: expiresAt.toISOString()
            }
        };
    }
    const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendWelcomeEmail"])(email, {
        name,
        loginUrl: `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].siteUrl}/welcome`
    });
    if (!emailResult.success) {
        reportAuthIssue("Failed to send welcome email", emailResult.error);
    }
    return null;
};
const normalizeOptionalPhone = (phone)=>{
    if (!phone) {
        return null;
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < PHONE_MIN_DIGITS) {
        throw new Error("Please enter a valid phone number with at least 10 digits.");
    }
    return normalizePhoneNumber(phone);
};
const parseCompleteProfileForm = (formData)=>{
    const avatarEntry = formData.get("avatar");
    const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null;
    const name = formData.get("name") ?? null;
    const phone = formData.get("phone") ?? null;
    return {
        name,
        normalizedPhone: normalizeOptionalPhone(phone),
        avatarFile
    };
};
const requireAuthenticatedUser = async (supabase)=>{
    const { data: { user } } = await withSupabaseRateLimitRetry(()=>supabase.auth.getUser());
    if (!user) {
        throw new Error("You must be signed in to complete your profile.");
    }
    return user;
};
const uploadAvatarWithFallback = async ({ ensureServiceSupabase, avatarFile, userId, fallbackAvatar })=>{
    if (!avatarFile) {
        return fallbackAvatar;
    }
    try {
        const adminClient = await ensureServiceSupabase();
        return await uploadAvatarForNewUser(adminClient, avatarFile, userId);
    } catch (avatarUploadError) {
        reportAuthIssue("Avatar upload failed", avatarUploadError);
        return fallbackAvatar;
    }
};
const updateUserTableRecord = async ({ ensureServiceSupabase, userId, name, normalizedPhone, avatarUrl })=>{
    const updatePayload = {};
    if (name) {
        updatePayload.name = name;
    }
    if (normalizedPhone) {
        updatePayload.phone = normalizedPhone;
    }
    if (avatarUrl) {
        updatePayload.avatar = avatarUrl;
    }
    if (Object.keys(updatePayload).length === 0) {
        return null;
    }
    try {
        const adminClient = await ensureServiceSupabase();
        if (!adminClient) {
            throw new Error("Admin client not configured");
        }
        const { error } = await adminClient.from("profiles").update({
            full_name: name || undefined,
            phone: normalizedPhone || undefined,
            avatar_url: avatarUrl || undefined
        }).eq("id", userId);
        if (error) {
            reportAuthIssue("Failed to update user profile", error);
            return {
                success: false,
                error: `Failed to update your profile: ${error.message}`
            };
        }
    } catch (profileUpdateError) {
        reportAuthIssue("Failed to update user profile", profileUpdateError);
        return {
            success: false,
            error: "Failed to update your profile. Please try again."
        };
    }
    return null;
};
const syncUserMetadataProfile = async ({ ensureServiceSupabase, userId, name, normalizedPhone, avatarUrl, existingMetadata })=>{
    const hasMetadataChanges = Boolean(name || normalizedPhone || avatarUrl);
    if (!hasMetadataChanges) {
        return;
    }
    try {
        const adminClient = await ensureServiceSupabase();
        const metadata = {
            ...existingMetadata
        };
        if (name) {
            metadata.name = name;
        }
        if (normalizedPhone) {
            metadata.phone = normalizedPhone;
        }
        if (avatarUrl) {
            metadata.avatarUrl = avatarUrl;
        }
        if (!adminClient) {
            throw new Error("Admin client not configured");
        }
        await adminClient.auth.admin.updateUserById(userId, {
            user_metadata: metadata
        });
    } catch (metadataError) {
        reportAuthIssue("Failed to sync user metadata", metadataError);
    }
};
const updateCompleteProfileRecords = async ({ ensureServiceSupabase, userId, name, normalizedPhone, avatarFile, existingAvatar, existingMetadata })=>{
    const avatarUrl = await uploadAvatarWithFallback({
        ensureServiceSupabase,
        avatarFile,
        userId,
        fallbackAvatar: existingAvatar
    });
    const userUpdateResult = await updateUserTableRecord({
        ensureServiceSupabase,
        userId,
        name,
        normalizedPhone,
        avatarUrl
    });
    if (userUpdateResult) {
        return userUpdateResult;
    }
    await syncUserMetadataProfile({
        ensureServiceSupabase,
        userId,
        name,
        normalizedPhone,
        avatarUrl,
        existingMetadata
    });
    return null;
};
const resolveProfileRedirectPath = async ({ ensureServiceSupabase, userId })=>{
    const adminClient = await ensureServiceSupabase();
    if (!adminClient) {
        throw new Error("Admin client not configured");
    }
    const { data: hasCompany } = await adminClient.from("company_memberships").select("company_id").eq("user_id", userId).eq("status", "active").limit(1).maybeSingle();
    return hasCompany ? "/dashboard" : "/welcome";
};
async function signUp(formData) {
    try {
        // Bot protection check (Vercel BotID)
        /*
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}
		*/ const parsedForm = parseSignUpFormData(formData);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])(parsedForm.validated.email, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authRateLimiter"]);
        const supabase = await requireSupabaseBrowserClient();
        const authResult = await registerSupabaseUser({
            supabase,
            validated: parsedForm.validated,
            normalizedPhone: parsedForm.normalizedPhone,
            companyName: parsedForm.companyName
        });
        const userId = authResult.user?.id;
        if (!userId) {
            throw new Error("Failed to create user account");
        }
        const ensureServiceSupabase = createServiceClientLoader();
        await syncSignUpProfile({
            ensureServiceSupabase,
            userId,
            normalizedPhone: parsedForm.normalizedPhone,
            name: parsedForm.validated.name,
            companyName: parsedForm.companyName,
            avatarFile: parsedForm.avatarFile
        });
        const postSignUpResult = await handlePostSignUpEmails({
            email: parsedForm.validated.email,
            name: parsedForm.validated.name,
            requiresConfirmation: !authResult.session,
            userId
        });
        if (postSignUpResult) {
            return postSignUpResult;
        }
        // Revalidate and redirect to onboarding
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
    } catch (caughtError) {
        if (caughtError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: caughtError.issues[0]?.message || "Validation error"
            };
        }
        if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
            return {
                success: false,
                error: caughtError.message
            };
        }
        // Re-throw redirect errors
        throw caughtError;
    }
}
async function completeProfile(formData) {
    try {
        const supabase = await requireSupabaseBrowserClient();
        const user = await requireAuthenticatedUser(supabase);
        const parsedForm = parseCompleteProfileForm(formData);
        const ensureServiceSupabase = createServiceClientLoader();
        const profileUpdateResult = await updateCompleteProfileRecords({
            ensureServiceSupabase,
            userId: user.id,
            name: parsedForm.name,
            normalizedPhone: parsedForm.normalizedPhone,
            avatarFile: parsedForm.avatarFile,
            existingAvatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            existingMetadata: user.user_metadata
        });
        if (profileUpdateResult) {
            return profileUpdateResult;
        }
        const redirectPath = await resolveProfileRedirectPath({
            ensureServiceSupabase,
            userId: user.id
        }).catch((redirectError)=>{
            reportAuthIssue("Error checking company status", redirectError);
            return "/welcome";
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(redirectPath);
    } catch (caughtError) {
        if (caughtError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: caughtError.issues[0]?.message || "Validation error"
            };
        }
        if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
            return {
                success: false,
                error: caughtError.message
            };
        }
        throw caughtError;
    }
}
async function signIn(formData) {
    try {
        // Bot protection check (Vercel BotID)
        /*
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}
		*/ // Parse and validate form data
        const rawData = {
            email: formData.get("email"),
            password: formData.get("password")
        };
        const validatedData = signInSchema.parse(rawData);
        // Rate limit sign-in attempts by email
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])(validatedData.email, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authRateLimiter"]);
        } catch (rateLimitError) {
            if (rateLimitError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RateLimitError"]) {
                return {
                    success: false,
                    error: rateLimitError.message
                };
            }
            throw rateLimitError;
        }
        // Create Supabase client
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured. Please check your environment variables."
            };
        }
        // Sign in with Supabase Auth
        const { data, error: signInError } = await withSupabaseRateLimitRetry(()=>supabase.auth.signInWithPassword({
                email: validatedData.email,
                password: validatedData.password
            }));
        if (signInError) {
            return {
                success: false,
                error: signInError.message
            };
        }
        if (!data.session) {
            return {
                success: false,
                error: "Failed to create session. Please try again."
            };
        }
        // Revalidate and redirect to dashboard
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/dashboard");
    } catch (caughtError) {
        if (caughtError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: caughtError.issues[0]?.message || "Validation error"
            };
        }
        // Handle AuthUnknownError (usually network/service issues)
        if (caughtError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$auth$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$auth$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthUnknownError"]) {
            console.error("AuthUnknownError during sign in:", caughtError);
            return {
                success: false,
                error: "Unable to connect to authentication service. Please check your internet connection and try again."
            };
        }
        if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
            // Log non-redirect errors for debugging
            console.error("Sign in error:", caughtError);
            return {
                success: false,
                error: caughtError.message
            };
        }
        throw caughtError;
    }
}
async function signOut() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured."
            };
        }
        // Sign out from Supabase (clears auth cookies)
        const { error: signOutError } = await withSupabaseRateLimitRetry(()=>supabase.auth.signOut());
        if (signOutError) {
            return {
                success: false,
                error: signOutError.message
            };
        }
        // Clear all security-related cookies
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$csrf$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearCSRFToken"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearActiveCompany"])();
        // Revalidate and redirect to login
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
            return {
                success: false,
                error: caughtError.message
            };
        }
        throw caughtError;
    }
}
async function signInWithOAuth(provider) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured."
            };
        }
        const siteUrl = ("TURBOPACK compile-time value", "http://localhost:3000");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const { data, error: oauthError } = await withSupabaseRateLimitRetry(()=>supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${siteUrl}/auth/callback`
                }
            }));
        if (oauthError) {
            return {
                success: false,
                error: oauthError.message
            };
        }
        // Redirect to OAuth provider
        if (data.url) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(data.url);
        }
        return {
            success: true
        };
    } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.message !== "NEXT_REDIRECT") {
            return {
                success: false,
                error: caughtError.message
            };
        }
        throw caughtError;
    }
}
/**
 * Forgot Password - Send custom password reset email via Resend
 *
 * Features:
 * - Sends custom branded password reset email via Resend
 * - Secure token generation via Supabase
 * - Custom email template with security information
 */ async function forgotPassword(formData) {
    try {
        // Bot protection check (Vercel BotID)
        /*
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}
		*/ const rawData = {
            email: formData.get("email")
        };
        const validatedData = forgotPasswordSchema.parse(rawData);
        // Rate limit password reset requests by email (stricter limit)
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])(validatedData.email, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["passwordResetRateLimiter"]);
        } catch (rateLimitError) {
            if (rateLimitError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RateLimitError"]) {
                return {
                    success: false,
                    error: rateLimitError.message
                };
            }
            throw rateLimitError;
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured."
            };
        }
        // Generate password reset token via Supabase
        const { error: resetPasswordError } = await withSupabaseRateLimitRetry(()=>supabase.auth.resetPasswordForEmail(validatedData.email, {
                redirectTo: `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].siteUrl}/auth/reset-password`
            }));
        if (resetPasswordError) {
            return {
                success: false,
                error: resetPasswordError.message
            };
        }
        // Note: Supabase will send its own email with the reset link.
        // To use custom Resend email instead, you need to:
        // 1. Disable Supabase's password reset email in the dashboard
        // 2. Generate your own secure token
        // 3. Send custom email with that token
        // For now, we're using Supabase's reset flow but you can customize this
        // TODO: Replace with custom token generation + Resend email
        // For full custom implementation, see the commented code below:
        /*
    const resetToken = generateSecureToken(); // Implement your own token generation
    await storeResetToken(validatedData.email, resetToken); // Store in your database

    await sendPasswordReset(validatedData.email, {
      resetUrl: `${emailConfig.siteUrl}/auth/reset-password?token=${resetToken}`,
      expiresInMinutes: 60,
    });
    */ return {
            success: true,
            data: {
                message: "Password reset email sent. Please check your inbox."
            }
        };
    } catch (caughtError) {
        if (caughtError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: caughtError.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: caughtError instanceof Error ? caughtError.message : "Failed to send reset email"
        };
    }
}
/**
 * Reset Password - Update password with reset token + Send confirmation email
 *
 * Features:
 * - Updates user password
 * - Validates password strength
 * - Invalidates reset token after use
 * - Sends custom password changed confirmation via Resend
 */ async function resetPassword(formData) {
    try {
        // Bot protection check (Vercel BotID)
        /*
		const botCheck = await checkBotId();
		if (botCheck.isBot) {
			return {
				success: false,
				error: "Unable to process request. Please try again later.",
			};
		}
		*/ const rawData = {
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        };
        const validatedData = resetPasswordSchema.parse(rawData);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured."
            };
        }
        // Get current user before updating password
        const { data: { user } } = await withSupabaseRateLimitRetry(()=>supabase.auth.getUser());
        const { error: updateUserError } = await withSupabaseRateLimitRetry(()=>supabase.auth.updateUser({
                password: validatedData.password
            }));
        if (updateUserError) {
            return {
                success: false,
                error: updateUserError.message
            };
        }
        // Send password changed confirmation email via Resend
        if (user?.email) {
            const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendPasswordChanged"])(user.email, {
                name: user.user_metadata?.name || "User",
                changedAt: new Date()
            });
            // Log email send failure but don't block password reset
            if (!emailResult.success) {
                reportAuthIssue("Failed to send password changed email", emailResult.error);
            }
        }
        return {
            success: true,
            data: {
                message: "Password updated successfully. A confirmation email has been sent."
            }
        };
    } catch (caughtError) {
        if (caughtError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: caughtError.issues[0]?.message || "Validation error"
            };
        }
        return {
            success: false,
            error: caughtError instanceof Error ? caughtError.message : "Failed to reset password"
        };
    }
}
/**
 * Get Current User - Retrieve authenticated user data
 *
 * Features:
 * - Returns user session data
 * - Returns null if not authenticated
 * - Can be used in Server Components
 */ async function getCurrentUser() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        const { data: { user } } = await withSupabaseRateLimitRetry(()=>supabase.auth.getUser());
        return user;
    } catch (caughtError) {
        reportAuthIssue("Error getting current user", caughtError);
        return null;
    }
}
/**
 * Get Session - Retrieve current session
 *
 * Features:
 * - Returns session data including access token
 * - Returns null if no active session
 * - Can be used in Server Components
 */ async function getSession() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        const { data: { session } } = await withSupabaseRateLimitRetry(()=>supabase.auth.getSession());
        return session;
    } catch (caughtError) {
        reportAuthIssue("Error getting session", caughtError);
        return null;
    }
}
async function verifyEmail(token) {
    try {
        // Verify and consume the token
        const tokenRecord = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAndConsumeToken"])(token, "email_verification");
        if (!tokenRecord) {
            return {
                success: false,
                error: "Invalid or expired verification link. Please request a new one."
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured."
            };
        }
        // Update Supabase user to mark email as verified
        if (tokenRecord.userId) {
            // Note: profiles table doesn't have email_verified field
            // Email verification is handled through auth.users.email_confirmed_at
            // which is set automatically by Supabase Auth
            // We don't need to manually update profiles table
            // Send welcome email after successful verification
            const welcomeResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendWelcomeEmail"])(tokenRecord.email, {
                name: getMetadataString(tokenRecord.metadata, "name") || "User",
                loginUrl: `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].siteUrl}/login`
            });
            if (!welcomeResult.success) {
                reportAuthIssue("Failed to send welcome email", welcomeResult.error);
            }
        }
        return {
            success: true,
            data: {
                message: "Email verified successfully! You can now sign in.",
                email: tokenRecord.email
            }
        };
    } catch (caughtError) {
        reportAuthIssue("Error verifying email", caughtError);
        return {
            success: false,
            error: caughtError instanceof Error ? caughtError.message : "Failed to verify email"
        };
    }
}
/**
 * Resend Verification Email - Send a new verification email
 *
 * Features:
 * - Generates new verification token
 * - Deletes old tokens for the email
 * - Sends fresh verification email
 */ async function resendVerificationEmail(email) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Authentication service is not configured."
            };
        }
        // Check if user exists
        const { data: userData } = await supabase.from("profiles").select("id, full_name, email").eq("email", email).single();
        if (!userData) {
            // Don't reveal if user exists or not for security
            return {
                success: true,
                data: {
                    message: "If an account exists with this email, a verification link has been sent."
                }
            };
        }
        // Generate new verification token
        const { token, expiresAt } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(email, userData.id, CONFIRMATION_TOKEN_TTL_HOURS);
        // Send verification email
        const verificationUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].siteUrl}/auth/verify-email?token=${token}`;
        const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmailVerification"])(email, {
            name: userData.full_name || "User",
            verificationUrl
        });
        if (!emailResult.success) {
            reportAuthIssue("Failed to send verification email", emailResult.error);
            return {
                success: false,
                error: "Failed to send verification email. Please try again."
            };
        }
        return {
            success: true,
            data: {
                message: "A new verification link has been sent to your email.",
                expiresAt: expiresAt.toISOString()
            }
        };
    } catch (caughtError) {
        reportAuthIssue("Error resending verification email", caughtError);
        return {
            success: false,
            error: caughtError instanceof Error ? caughtError.message : "Failed to resend verification email"
        };
    }
}
async function getCompanyIdAction() {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        return {
            success: true,
            companyId
        };
    } catch (error) {
        console.error("Error getting company ID:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signUp,
    completeProfile,
    signIn,
    signOut,
    signInWithOAuth,
    verifyEmail,
    getCompanyIdAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUp, "40e13219efdc0b7711d9465d41ad4d15afbf47a197", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(completeProfile, "40ee4544030acaa2db04b235e12a7f1691b2c26d06", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signIn, "404fcb2756c461f7f3d3feb3d3cdd8c5a8ac7ef0f1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "005a48890fa7863395276cf2f0eee59386df8294ad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signInWithOAuth, "408edc67a59f593e191adb25fb586dc16599ad27d0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyEmail, "405f58a531bc8d8038c2645e288e89c8a0078b14a1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyIdAction, "007690b27fd877104cf6868f26556f5c264bca1028", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/actions/company-context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"406bce7fa085d3cdc2f5aebf07b01ac78a96de1c51":"switchCompany"},"",""] */ __turbopack_context__.s([
    "switchCompany",
    ()=>switchCompany
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Company Context Server Actions
 *
 * Server Actions for managing active company context.
 * Used by company switcher UI components.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function switchCompany(companyId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setActiveCompany"])(companyId);
        // Revalidate everything to ensure all company-scoped data is refreshed
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        return {
            success: true,
            message: "Company switched successfully"
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to switch company"
        };
    }
}
/**
 * Clear Active Company
 *
 * Removes the active company context.
 * Useful for logout or company removal flows.
 *
 * @returns ActionResult indicating success or failure
 */ async function clearCompany() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearActiveCompany"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        return {
            success: true,
            message: "Company context cleared"
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to clear company context"
        };
    }
}
/**
 * Get User's Companies
 *
 * Returns all companies the user has access to.
 * Useful for populating company switcher dropdowns.
 *
 * @returns ActionResult with array of companies
 */ async function getCompanies() {
    try {
        const companies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserCompanies"])();
        return {
            success: true,
            data: companies
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get companies"
        };
    }
}
/**
 * Get Active Company Details
 *
 * Returns details about the currently active company.
 *
 * @returns ActionResult with company details or null
 */ async function getActiveCompanyDetails() {
    try {
        const company = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompany"])();
        return {
            success: true,
            data: company
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get active company"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    switchCompany
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(switchCompany, "406bce7fa085d3cdc2f5aebf07b01ac78a96de1c51", null);
}),
"[project]/apps/web/src/actions/user-status.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4071d2fab292ee04db9b66589b9b28bb9e2a475117":"updateUserStatus"},"",""] */ __turbopack_context__.s([
    "updateUserStatus",
    ()=>updateUserStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function updateUserStatus(status) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return {
                success: false,
                error: "Unauthorized"
            };
        }
        // Update user status
        const { error: updateError } = await supabase.from("profiles").update({
            status
        }).eq("id", user.id);
        if (updateError) {
            return {
                success: false,
                error: "Failed to update status"
            };
        }
        // Revalidate all pages to reflect the new status
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/", "layout");
        return {
            success: true,
            status
        };
    } catch (_error) {
        return {
            success: false,
            error: "An unexpected error occurred"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateUserStatus
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserStatus, "4071d2fab292ee04db9b66589b9b28bb9e2a475117", null);
}),
"[project]/apps/web/src/actions/ai-approval.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Action Approval Server Actions
 *
 * Server actions for owner-only approval of destructive AI actions.
 * These actions wrap the action-approval service for use in React components.
 */ /* __next_internal_action_entry_do_not_use__ [{"00c272bd6e60ec535f4c74634320579f25a91a9234":"getPendingActionCounts","00db090f1561cd2d77f6fcc5f3c799a97aa1a51daf":"checkIsCompanyOwner","402d35cd010075a15bf434159773a7ec9bbf831054":"getPendingActionById","404d09adf2fb9f5cfb17315943fa77e053c340c75d":"getCompanyPendingActions","40728dee28044e99744d89471c4d25c5882738a125":"rejectAIAction","409934449f04afd07f8e18e61e8d34e1bab7ad530a":"approveAIAction","40d6b5a49526496d26f8f0860050ed9b122ddb4229":"getChatPendingActions"},"",""] */ __turbopack_context__.s([
    "approveAIAction",
    ()=>approveAIAction,
    "checkIsCompanyOwner",
    ()=>checkIsCompanyOwner,
    "getChatPendingActions",
    ()=>getChatPendingActions,
    "getCompanyPendingActions",
    ()=>getCompanyPendingActions,
    "getPendingActionById",
    ()=>getPendingActionById,
    "getPendingActionCounts",
    ()=>getPendingActionCounts,
    "rejectAIAction",
    ()=>rejectAIAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/action-error.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/with-error-handling.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/ai/action-approval.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
// ============================================================================
// Validation Schemas
// ============================================================================
const approveActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    actionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid action ID")
});
const rejectActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    actionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid action ID"),
    reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500, "Reason too long").optional()
});
const getPendingActionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "pending",
        "approved",
        "rejected",
        "expired"
    ]).optional(),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1).max(100).default(50)
});
const getChatActionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    chatId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid chat ID")
});
// ============================================================================
// Helper Functions
// ============================================================================
async function getAuthenticatedUserWithCompany() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
    }
    const { data: { user } } = await supabase.auth.getUser();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
    const { data: teamMember } = await supabase.from("company_memberships").select("company_id, role").eq("user_id", user.id).single();
    if (!teamMember?.company_id) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
    }
    return {
        userId: user.id,
        companyId: teamMember.company_id,
        role: teamMember.role
    };
}
async function approveAIAction(input) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const validated = approveActionSchema.parse(input);
        const { userId, companyId } = await getAuthenticatedUserWithCompany();
        // Verify user is owner (double-check even though DB function enforces this)
        const ownerCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isCompanyOwner"])(companyId, userId);
        if (!ownerCheck) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Only company owners can approve destructive AI actions", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Call the approval function (which calls the DB RPC)
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["approveAction"])(validated.actionId, userId);
        if (!result.success) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](result.error || "Failed to approve action", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].OPERATION_FAILED);
        }
        // Automatically execute the approved action
        let executionResult = null;
        try {
            const response = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000"}/api/ai/execute-approved`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    actionId: validated.actionId,
                    companyId
                })
            });
            executionResult = await response.json();
        } catch (execError) {
            console.error("Failed to auto-execute approved action:", execError);
        // Don't fail the approval - execution can be retried
        }
        // Revalidate AI-related paths
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/ai");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/ai");
        return {
            success: true,
            actionId: result.actionId,
            toolName: result.toolName,
            toolArgs: result.toolArgs,
            executed: executionResult?.success || false,
            executionResult: executionResult?.result,
            executionError: executionResult?.error
        };
    });
}
async function rejectAIAction(input) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const validated = rejectActionSchema.parse(input);
        const { userId, companyId } = await getAuthenticatedUserWithCompany();
        // Verify user is owner
        const ownerCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isCompanyOwner"])(companyId, userId);
        if (!ownerCheck) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Only company owners can reject destructive AI actions", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Call the rejection function
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["rejectAction"])(validated.actionId, userId, validated.reason);
        if (!result.success) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](result.error || "Failed to reject action", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].OPERATION_FAILED);
        }
        // Revalidate AI-related paths
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/ai");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/settings/ai");
        return {
            success: true,
            actionId: validated.actionId
        };
    });
}
async function getCompanyPendingActions(input) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const validated = input ? getPendingActionsSchema.parse(input) : {
            limit: 50
        };
        const { companyId } = await getAuthenticatedUserWithCompany();
        // Expire old actions first
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireOldActions"])(companyId);
        // Fetch pending actions
        const actions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getPendingActionsForCompany"])(companyId, {
            status: validated.status,
            limit: validated.limit
        });
        return actions;
    });
}
async function getChatPendingActions(input) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const validated = getChatActionsSchema.parse(input);
        const { companyId } = await getAuthenticatedUserWithCompany();
        // Expire old actions first
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireOldActions"])(companyId);
        // Fetch pending actions for the chat
        const actions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getPendingActionsForChat"])(companyId, validated.chatId);
        return actions;
    });
}
async function getPendingActionById(actionId) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const validated = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid action ID").parse(actionId);
        const { companyId } = await getAuthenticatedUserWithCompany();
        const action = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getPendingAction"])(companyId, validated);
        return action;
    });
}
async function checkIsCompanyOwner() {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const { userId, companyId } = await getAuthenticatedUserWithCompany();
        const isOwner = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isCompanyOwner"])(companyId, userId);
        return isOwner;
    });
}
async function getPendingActionCounts() {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const { companyId } = await getAuthenticatedUserWithCompany();
        // Expire old actions first
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireOldActions"])(companyId);
        // Fetch pending actions
        const actions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$action$2d$approval$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getPendingActionsForCompany"])(companyId, {
            status: "pending",
            limit: 100
        });
        // Group by risk level
        const byRiskLevel = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0
        };
        for (const action of actions){
            byRiskLevel[action.riskLevel] = (byRiskLevel[action.riskLevel] || 0) + 1;
        }
        return {
            total: actions.length,
            byRiskLevel
        };
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    approveAIAction,
    rejectAIAction,
    getCompanyPendingActions,
    getChatPendingActions,
    getPendingActionById,
    checkIsCompanyOwner,
    getPendingActionCounts
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveAIAction, "409934449f04afd07f8e18e61e8d34e1bab7ad530a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(rejectAIAction, "40728dee28044e99744d89471c4d25c5882738a125", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyPendingActions, "404d09adf2fb9f5cfb17315943fa77e053c340c75d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getChatPendingActions, "40d6b5a49526496d26f8f0860050ed9b122ddb4229", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPendingActionById, "402d35cd010075a15bf434159773a7ec9bbf831054", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkIsCompanyOwner, "00db090f1561cd2d77f6fcc5f3c799a97aa1a51daf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPendingActionCounts, "00c272bd6e60ec535f4c74634320579f25a91a9234", null);
}),
"[project]/apps/web/src/actions/customers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Customer Management Server Actions
 *
 * Comprehensive customer relationship management with:
 * - Customer CRUD operations
 * - Customer portal invitation and access
 * - Customer metrics tracking (revenue, jobs, invoices)
 * - Communication preferences
 * - Soft delete/archive support
 * - Customer search and filtering
 */ /* __next_internal_action_entry_do_not_use__ [{"00337bf9ccf6d7f5002dfdd1c39a50a1925fa9cd70":"getCustomersForDialer","40b277f535f8a989546d6c7e3a1af8abe77de6c459":"deleteCustomer","6048659199289e27e8a29c146dcc920a7afc8ad29e":"searchCustomers","604ac8c079e9497e74d11dd7c17f442078174db43f":"getCustomerByPhone"},"",""] */ __turbopack_context__.s([
    "deleteCustomer",
    ()=>deleteCustomer,
    "getCustomerByPhone",
    ()=>getCustomerByPhone,
    "getCustomersForDialer",
    ()=>getCustomersForDialer,
    "searchCustomers",
    ()=>searchCustomers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/action-error.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/with-error-handling.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$geocoding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/geocoding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$portal$2d$invitation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/customer/portal-invitation.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
const CUSTOMER_NAME_MAX_LENGTH = 100;
const CUSTOMER_COMPANY_MAX_LENGTH = 200;
const CUSTOMER_PHONE_MAX_LENGTH = 20;
const CUSTOMER_ADDRESS_MAX_LENGTH = 200;
const CUSTOMER_ADDRESS2_MAX_LENGTH = 100;
const CUSTOMER_CITY_MAX_LENGTH = 100;
const CUSTOMER_STATE_MAX_LENGTH = 50;
// HTTP Status codes
const HTTP_STATUS_FORBIDDEN = 403;
// Search defaults
const DEFAULT_SEARCH_LIMIT = 50;
const CUSTOMER_ZIP_MAX_LENGTH = 20;
const CUSTOMER_COUNTRY_MAX_LENGTH = 50;
const CUSTOMER_TAX_EXEMPT_NUMBER_MAX_LENGTH = 50;
const CENTS_PER_DOLLAR = 100;
function requireSiteUrl() {
    const siteUrl = ("TURBOPACK compile-time value", "http://localhost:3000");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return siteUrl.replace(/\/$/, "");
}
const customerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "residential",
        "commercial",
        "industrial"
    ]).default("residential"),
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "First name is required").max(CUSTOMER_NAME_MAX_LENGTH),
    lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Last name is required").max(CUSTOMER_NAME_MAX_LENGTH),
    companyName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_COMPANY_MAX_LENGTH).optional(),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address"),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Phone is required").max(CUSTOMER_PHONE_MAX_LENGTH),
    secondaryPhone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_PHONE_MAX_LENGTH).optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_ADDRESS_MAX_LENGTH).optional(),
    address2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_ADDRESS2_MAX_LENGTH).optional(),
    city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_CITY_MAX_LENGTH).optional(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_STATE_MAX_LENGTH).optional(),
    zipCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_ZIP_MAX_LENGTH).optional(),
    country: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_COUNTRY_MAX_LENGTH).default("USA"),
    source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "referral",
        "google",
        "facebook",
        "direct",
        "yelp",
        "other"
    ]).optional(),
    referredBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    preferredContactMethod: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "email",
        "phone",
        "sms"
    ]).default("email"),
    preferredTechnician: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    billingEmail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().nullable(),
    paymentTerms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "due_on_receipt",
        "net_15",
        "net_30",
        "net_60"
    ]).default("due_on_receipt"),
    creditLimit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).default(0),
    taxExempt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    taxExemptNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(CUSTOMER_TAX_EXEMPT_NUMBER_MAX_LENGTH).optional(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    internalNotes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const communicationPreferencesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    sms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    marketing: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false)
});
// ============================================================================
// CUSTOMER CRUD OPERATIONS
// ============================================================================
/**
 * Create a new customer with multiple contacts and properties
 */ async function createCustomer(formData) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        const { contacts, properties, tags } = parseCustomerContactsPropertiesAndTags(formData);
        const primaryContact = getPrimaryContactOrThrow(contacts);
        const primaryProperty = getPrimaryProperty(properties);
        await assertCustomerEmailNotDuplicate(supabase, teamMember.company_id, primaryContact.email);
        const customerType = formData.get("type") || "residential";
        const companyName = formData.get("companyName");
        const displayName = buildCustomerDisplayName(customerType, companyName, primaryContact);
        const communicationPreferences = buildDefaultCommunicationPreferences();
        const customerMetadata = buildCustomerMetadata(contacts);
        const { lat: customerLat, lon: customerLon } = await geocodePrimaryPropertyIfAvailable(primaryProperty);
        const customer = await insertCustomerRecord(supabase, {
            companyId: teamMember.company_id,
            customerType,
            primaryContact,
            companyNameValue: companyName,
            displayName,
            primaryProperty,
            customerLat,
            customerLon,
            formData,
            tags,
            communicationPreferences,
            customerMetadata
        });
        await insertAdditionalPropertiesIfAny(supabase, teamMember.company_id, customer.id, properties);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/customers");
        return customer.id;
    });
}
async function requireCustomerCompanyMembership(supabase, userId) {
    const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", userId).single();
    if (!teamMember?.company_id) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
    }
    return teamMember;
}
function parseCustomerContactsPropertiesAndTags(formData) {
    const contacts = parseContacts(formData.get("contacts"));
    const properties = parseProperties(formData.get("properties"));
    const tags = parseTagsField(formData.get("tags"));
    return {
        contacts,
        properties,
        tags
    };
}
function parseContacts(value) {
    if (!value || typeof value !== "string") {
        return [];
    }
    try {
        return JSON.parse(value);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Invalid contacts data", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].VALIDATION_FAILED);
    }
}
function parseProperties(value) {
    if (!value || typeof value !== "string") {
        return [];
    }
    try {
        return JSON.parse(value);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Invalid properties data", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].VALIDATION_FAILED);
    }
}
function parseTagsField(value) {
    if (!value || typeof value !== "string") {
        return;
    }
    try {
        return JSON.parse(value);
    } catch  {
        return value.split(",").map((t)=>t.trim());
    }
}
function getPrimaryContactOrThrow(contacts) {
    const primaryContact = contacts.find((c)=>c.isPrimary) || contacts[0];
    if (!primaryContact) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("At least one contact is required", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].VALIDATION_FAILED);
    }
    return primaryContact;
}
function getPrimaryProperty(properties) {
    return properties.find((p)=>p.isPrimary) || properties[0];
}
async function assertCustomerEmailNotDuplicate(supabase, companyId, email) {
    const { data: existingEmail } = await supabase.from("customers").select("id").eq("company_id", companyId).eq("email", email).is("deleted_at", null).single();
    if (existingEmail) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("A customer with this email already exists", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_DUPLICATE_ENTRY);
    }
}
function buildCustomerDisplayName(customerType, companyNameValue, primaryContact) {
    const companyName = companyNameValue ? String(companyNameValue) : null;
    if (customerType === "commercial" && companyName) {
        return companyName;
    }
    return `${primaryContact.firstName} ${primaryContact.lastName}`;
}
function buildDefaultCommunicationPreferences() {
    return {
        email: true,
        sms: true,
        phone: true,
        marketing: false
    };
}
function buildCustomerMetadata(contacts) {
    return {
        contacts: contacts.map((c)=>({
                firstName: c.firstName,
                lastName: c.lastName,
                email: c.email,
                phone: c.phone,
                role: c.role,
                isPrimary: c.isPrimary
            }))
    };
}
async function geocodePrimaryPropertyIfAvailable(primaryProperty) {
    if (!(primaryProperty?.address && primaryProperty.city && primaryProperty.state && primaryProperty.zipCode)) {
        return {
            lat: null,
            lon: null
        };
    }
    const geocodeResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$geocoding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["geocodeAddressSilent"])(primaryProperty.address, primaryProperty.city, primaryProperty.state, primaryProperty.zipCode, primaryProperty.country || "USA");
    if (!geocodeResult) {
        return {
            lat: null,
            lon: null
        };
    }
    return {
        lat: geocodeResult.lat,
        lon: geocodeResult.lon
    };
}
async function insertCustomerRecord(supabase, params) {
    const payload = buildCustomerInsertPayload(params);
    const { data: customer, error: createError } = await supabase.from("customers").insert(payload).select("id").single();
    if (createError || !customer) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("create customer"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
    }
    return customer;
}
function buildCustomerInsertPayload(params) {
    const { companyId, customerType, primaryContact, companyNameValue, displayName, primaryProperty, customerLat, customerLon, formData, tags, communicationPreferences, customerMetadata } = params;
    const companyName = companyNameValue ? String(companyNameValue) : null;
    return {
        company_id: companyId,
        type: String(customerType || "residential"),
        first_name: primaryContact.firstName,
        last_name: primaryContact.lastName,
        company_name: companyName,
        display_name: displayName,
        email: primaryContact.email,
        phone: primaryContact.phone,
        secondary_phone: null,
        address: primaryProperty?.address || null,
        address2: primaryProperty?.address2 || null,
        city: primaryProperty?.city || null,
        state: primaryProperty?.state || null,
        zip_code: primaryProperty?.zipCode || null,
        country: primaryProperty?.country || "USA",
        lat: customerLat,
        lon: customerLon,
        source: formData.get("source") ? String(formData.get("source")) : null,
        referred_by: formData.get("referredBy") ? String(formData.get("referredBy")) : null,
        preferred_contact_method: String(formData.get("preferredContactMethod")) || "email",
        preferred_technician: formData.get("preferredTechnician") ? String(formData.get("preferredTechnician")) : null,
        billing_email: formData.get("billingEmail") ? String(formData.get("billingEmail")) : null,
        payment_terms: String(formData.get("paymentTerms")) || "due_on_receipt",
        credit_limit: formData.get("creditLimit") ? Number(formData.get("creditLimit")) * CENTS_PER_DOLLAR : 0,
        tax_exempt: formData.get("taxExempt") === "on",
        tax_exempt_number: formData.get("taxExemptNumber") ? String(formData.get("taxExemptNumber")) : null,
        tags: tags || null,
        communication_preferences: communicationPreferences,
        notes: formData.get("notes") ? String(formData.get("notes")) : null,
        internal_notes: formData.get("internalNotes") ? String(formData.get("internalNotes")) : null,
        metadata: customerMetadata,
        status: "active",
        portal_enabled: false,
        total_revenue: 0,
        total_jobs: 0,
        total_invoices: 0,
        average_job_value: 0,
        outstanding_balance: 0
    };
}
async function insertAdditionalPropertiesIfAny(supabase, companyId, customerId, properties) {
    const additionalProperties = properties.filter((p)=>!p.isPrimary);
    if (additionalProperties.length === 0) {
        return;
    }
    const propertiesToInsert = await Promise.all(additionalProperties.map(async (prop)=>{
        let propLat = null;
        let propLon = null;
        if (prop.address && prop.city && prop.state && prop.zipCode) {
            const geocodeResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$geocoding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["geocodeAddressSilent"])(prop.address, prop.city, prop.state, prop.zipCode, prop.country || "USA");
            if (geocodeResult) {
                propLat = geocodeResult.lat;
                propLon = geocodeResult.lon;
            }
        }
        return {
            company_id: companyId,
            customer_id: customerId,
            name: prop.name || "Additional Property",
            address: prop.address,
            address2: prop.address2 || null,
            city: prop.city,
            state: prop.state,
            zip_code: prop.zipCode,
            country: prop.country || "USA",
            property_type: prop.propertyType || "residential",
            notes: prop.notes || null,
            lat: propLat,
            lon: propLon
        };
    }));
    await supabase.from("properties").insert(propertiesToInsert);
}
/**
 * Update existing customer
 */ async function updateCustomer(customerId, formData) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id, email").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer not found", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Parse tags if provided
        let tags;
        const tagsString = formData.get("tags");
        if (tagsString && typeof tagsString === "string") {
            try {
                tags = JSON.parse(tagsString);
            } catch  {
                tags = tagsString.split(",").map((t)=>t.trim());
            }
        }
        // Validate input
        const data = customerSchema.parse({
            type: formData.get("type") || "residential",
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            companyName: formData.get("companyName") || undefined,
            email: formData.get("email"),
            phone: formData.get("phone"),
            secondaryPhone: formData.get("secondaryPhone") || undefined,
            address: formData.get("address") || undefined,
            address2: formData.get("address2") || undefined,
            city: formData.get("city") || undefined,
            state: formData.get("state") || undefined,
            zipCode: formData.get("zipCode") || undefined,
            country: formData.get("country") || "USA",
            source: formData.get("source") || undefined,
            referredBy: formData.get("referredBy") || null,
            preferredContactMethod: formData.get("preferredContactMethod") || "email",
            preferredTechnician: formData.get("preferredTechnician") || null,
            billingEmail: formData.get("billingEmail") || null,
            paymentTerms: formData.get("paymentTerms") || "due_on_receipt",
            creditLimit: formData.get("creditLimit") ? Number(formData.get("creditLimit")) : 0,
            taxExempt: formData.get("taxExempt") === "true",
            taxExemptNumber: formData.get("taxExemptNumber") || undefined,
            tags,
            notes: formData.get("notes") || undefined,
            internalNotes: formData.get("internalNotes") || undefined
        });
        // Check if email already exists (excluding current customer)
        if (data.email !== customer.email) {
            const { data: existingEmail } = await supabase.from("customers").select("id").eq("company_id", teamMember.company_id).eq("email", data.email).neq("id", customerId).is("deleted_at", null).single();
            if (existingEmail) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("A customer with this email already exists", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_DUPLICATE_ENTRY);
            }
        }
        // Generate display name
        const displayName = data.type === "commercial" && data.companyName ? data.companyName : `${data.firstName} ${data.lastName}`;
        const companyName = data.companyName ? String(data.companyName) : null;
        // Update customer
        const { error: updateError } = await supabase.from("customers").update({
            type: data.type,
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: companyName,
            display_name: displayName,
            email: data.email,
            phone: data.phone,
            secondary_phone: data.secondaryPhone,
            address: data.address,
            address2: data.address2,
            city: data.city,
            state: data.state,
            zip_code: data.zipCode,
            country: data.country,
            source: data.source,
            referred_by: data.referredBy,
            preferred_contact_method: data.preferredContactMethod,
            preferred_technician: data.preferredTechnician,
            billing_email: data.billingEmail,
            payment_terms: data.paymentTerms,
            credit_limit: data.creditLimit,
            tax_exempt: data.taxExempt,
            tax_exempt_number: data.taxExemptNumber,
            tags: data.tags,
            notes: data.notes,
            internal_notes: data.internalNotes
        }).eq("id", customerId);
        if (updateError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("update customer"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/customers");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/customers/${customerId}`);
    });
}
async function deleteCustomer(customerId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id, outstanding_balance").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer not found", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Prevent deletion if customer has outstanding balance
        if (customer.outstanding_balance > 0) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Cannot delete customer with outstanding balance. Collect payment first.", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].BUSINESS_RULE_VIOLATION);
        }
        // Soft delete
        const { error: deleteError } = await supabase.from("customers").update({
            deleted_at: new Date().toISOString(),
            deleted_by: user.id,
            status: "archived"
        }).eq("id", customerId);
        if (deleteError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("delete customer"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/customers");
    });
}
// ============================================================================
// CUSTOMER STATUS & PREFERENCES
// ============================================================================
/**
 * Update customer status
 */ async function updateCustomerStatus(customerId, status) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer not found", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Update status
        const { error: updateError } = await supabase.from("customers").update({
            status
        }).eq("id", customerId);
        if (updateError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("update customer status"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/customers");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/customers/${customerId}`);
    });
}
/**
 * Update communication preferences
 */ async function updateCommunicationPreferences(customerId, formData) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer not found", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Validate input
        const preferences = communicationPreferencesSchema.parse({
            email: formData.get("email") === "true",
            sms: formData.get("sms") === "true",
            phone: formData.get("phone") === "true",
            marketing: formData.get("marketing") === "true"
        });
        // Update preferences
        const { error: updateError } = await supabase.from("customers").update({
            communication_preferences: preferences
        }).eq("id", customerId);
        if (updateError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("update communication preferences"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/customers/${customerId}`);
    });
}
// ============================================================================
// CUSTOMER PORTAL
// ============================================================================
/**
 * Invite customer to portal
 * Sends an email with a secure token-based invitation link.
 */ async function inviteToPortal(customerId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id, email, display_name, portal_enabled").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer not found", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        if (customer.portal_enabled) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer is already invited to portal", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].BUSINESS_RULE_VIOLATION);
        }
        // Generate secure portal invitation token
        const inviteToken = Buffer.from(`${customerId}:${Date.now()}:${Math.random()}`).toString("base64url");
        // Update customer
        const { error: updateError } = await supabase.from("customers").update({
            portal_enabled: true,
            portal_invited_at: new Date().toISOString()
        }).eq("id", customerId);
        if (updateError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("invite customer to portal"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        // Send invitation email
        const siteUrl = requireSiteUrl();
        const portalUrl = `${siteUrl}/portal/setup?token=${inviteToken}`;
        const emailResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: customer.email,
            subject: "You've been invited to your Customer Portal",
            template: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$customer$2f$portal$2d$invitation$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
                customerName: customer.display_name,
                portalUrl,
                expiresInHours: 168,
                supportEmail: process.env.RESEND_FROM_EMAIL || "support@thorbis.com",
                supportPhone: "(555) 123-4567"
            }),
            templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].PORTAL_INVITATION
        });
        if (!emailResult.success) {
            return;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/customers");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/customers/${customerId}`);
    });
}
/**
 * Revoke portal access
 */ async function revokePortalAccess(customerId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const teamMember = await requireCustomerCompanyMembership(supabase, user.id);
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Customer not found", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Revoke access
        const { error: updateError } = await supabase.from("customers").update({
            portal_enabled: false
        }).eq("id", customerId);
        if (updateError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("revoke portal access"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/customers");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/customers/${customerId}`);
    });
}
async function getCustomerByPhone(phoneNumber, companyId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        // Normalize phone number (remove formatting)
        const normalizedPhone = phoneNumber.replace(/\D/g, "");
        // Search by primary phone or secondary phone
        const { data: customer, error } = await supabase.from("customers").select(`
        *,
        properties:properties(*)
      `).eq("company_id", companyId).or(`phone.eq.${phoneNumber},phone.eq.${normalizedPhone},secondary_phone.eq.${phoneNumber},secondary_phone.eq.${normalizedPhone}`).single();
        if (error && error.code !== "PGRST116") {
            // PGRST116 = no rows found
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](`Failed to find customer: ${error.message}`, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        return customer || null;
    });
}
async function searchCustomers(searchTerm, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        // Use the active company ID helper (same as getAllCustomers)
        const activeCompanyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!activeCompanyId) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("No active company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Verify user has access to the active company
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("company_id", activeCompanyId).eq("status", "active").maybeSingle();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You don't have access to this company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Use full-text search with ranking for best matches
        // Searches across: first_name, last_name, display_name, email, phone,
        // secondary_phone, company_name, address, city, state
        // Returns results ordered by relevance (weighted: name > contact > address)
        const { searchCustomersFullText } = await __turbopack_context__.A("[project]/apps/web/src/lib/search/full-text-search.ts [app-rsc] (ecmascript, async loader)");
        const customers = await searchCustomersFullText(supabase, activeCompanyId, searchTerm, {
            limit: options?.limit || DEFAULT_SEARCH_LIMIT,
            offset: options?.offset || 0
        });
        return customers;
    });
}
/**
 * Get top customers by revenue
 */ async function getTopCustomers(limit = 10) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        const { data: customers, error } = await supabase.from("customers").select("*").eq("company_id", teamMember.company_id).eq("status", "active").is("deleted_at", null).order("total_revenue", {
            ascending: false
        }).limit(limit);
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("fetch top customers"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        return customers || [];
    });
}
async function getCustomersWithBalance() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        const { data: customers, error } = await supabase.from("customers").select("*").eq("company_id", teamMember.company_id).is("deleted_at", null).gt("outstanding_balance", 0).order("outstanding_balance", {
            ascending: false
        }).limit(100);
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("fetch customers with balance"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        return customers || [];
    });
}
async function getCustomersForDialer() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const activeCompanyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!activeCompanyId) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("No active company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Single lightweight query - no joins, no enrichment
        const { data: customers, error } = await supabase.from("customers").select("id, first_name, last_name, display_name, email, phone, secondary_phone, company_name, address, address2, city, state, zip_code").eq("company_id", activeCompanyId).is("deleted_at", null).order("display_name", {
            ascending: true
        });
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("fetch customers"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        return customers || [];
    });
}
/**
 * Get all customers for the current company (WITH ENRICHMENT)
 *
 * WARNING: This function does 151 database queries for 50 customers (N+1 pattern).
 * Expected time: 1200-2000ms
 *
 * DO NOT use in AppHeader or other frequently rendered components.
 * Use getCustomersForDialer() instead for lightweight contact info.
 *
 * Only use this on dedicated customer list pages where the enriched data is needed.
 */ async function getAllCustomers() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        // Get active company ID (from cookie or first available)
        const activeCompanyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        const FORBIDDEN_STATUS_CODE = 403;
        if (!activeCompanyId) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, FORBIDDEN_STATUS_CODE);
        }
        // Verify user has access to the active company
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("company_id", activeCompanyId).eq("status", "active").maybeSingle();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You don't have access to this company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, FORBIDDEN_STATUS_CODE);
        }
        const { data: customers, error } = await supabase.from("customers").select("*").eq("company_id", activeCompanyId).is("deleted_at", null).order("display_name", {
            ascending: true
        });
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("fetch customers"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        // PERFORMANCE OPTIMIZED: Use RPC function instead of N+1 queries
        // BEFORE: 151 queries for 50 customers (1 base + 50 × 3 queries each)
        // AFTER: 1 RPC call with efficient LATERAL joins
        // Performance gain: 5-10 seconds faster
        // Note: customers variable contains the base customer data from above query
        // We replace the enrichment logic with a single RPC call
        const { data: enrichedData, error: enrichError } = await supabase.rpc("get_enriched_customers_rpc", {
            p_company_id: activeCompanyId
        });
        if (enrichError) {
            // Fallback to base customers if enrichment fails
            console.error("Failed to enrich customers:", enrichError);
            return customers;
        }
        // Merge enriched data with base customer data
        const enrichedCustomers = (enrichedData || []).map((customer)=>({
                ...customer,
                // Override total_jobs and total_revenue with fresh aggregated values
                total_jobs: customer.enriched_total_jobs || customer.total_jobs || 0,
                total_revenue: customer.enriched_total_revenue || customer.total_revenue || 0
            }));
        return enrichedCustomers;
    });
}
/**
 * Update customer page content (Novel/Tiptap JSON)
 *
 * Saves the customer's editable page layout and content
 * Used by the Novel editor for auto-save functionality
 */ async function updateCustomerPageContent(customerId, pageContent) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Verify customer exists and belongs to company
        const { data: customer } = await supabase.from("customers").select("id, company_id").eq("id", customerId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(customer, "Customer");
        if (customer.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].forbidden("customer"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, HTTP_STATUS_FORBIDDEN);
        }
        // Update page content
        const { error: updateError } = await supabase.from("customers").update({
            page_content: pageContent,
            content_updated_by: user.id
        }).eq("id", customerId);
        if (updateError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].operationFailed("update customer page"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/customers/${customerId}`);
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    deleteCustomer,
    getCustomerByPhone,
    searchCustomers,
    getCustomersForDialer
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCustomer, "40b277f535f8a989546d6c7e3a1af8abe77de6c459", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCustomerByPhone, "604ac8c079e9497e74d11dd7c17f442078174db43f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchCustomers, "6048659199289e27e8a29c146dcc920a7afc8ad29e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCustomersForDialer, "00337bf9ccf6d7f5002dfdd1c39a50a1925fa9cd70", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/actions/email-folders.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"007e3ac5636eb12e5c32067b03bc3f57069cf25e65":"getEmailFoldersAction","40c47f4aacde57fa2d2f7b15353f5b7277f571d970":"deleteEmailFolderAction","40f3cc88585848239c5b2dd062369b4217c03e2854":"createEmailFolderAction"},"",""] */ __turbopack_context__.s([
    "createEmailFolderAction",
    ()=>createEmailFolderAction,
    "deleteEmailFolderAction",
    ()=>deleteEmailFolderAction,
    "getEmailFoldersAction",
    ()=>getEmailFoldersAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const createFolderSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(100),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const updateFolderSchema = createFolderSchema.partial().extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    sort_order: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional()
});
const deleteFolderSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid()
});
async function getEmailFoldersAction() {
    try {
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const { data, error } = await supabase.from("email_folders").select("*").eq("company_id", companyId).is("deleted_at", null).eq("is_active", true).order("sort_order", {
            ascending: true
        }).order("name", {
            ascending: true
        });
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            folders: data || []
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function createEmailFolderAction(input) {
    try {
        const validated = createFolderSchema.parse(input);
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                success: false,
                error: "Not authenticated"
            };
        }
        // Generate slug from name
        const slug = validated.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        // Check if slug already exists
        const { data: existing } = await supabase.from("email_folders").select("id").eq("company_id", companyId).eq("slug", slug).is("deleted_at", null).single();
        if (existing) {
            return {
                success: false,
                error: "A folder with this name already exists"
            };
        }
        // Get max sort_order
        const { data: maxOrder } = await supabase.from("email_folders").select("sort_order").eq("company_id", companyId).is("deleted_at", null).order("sort_order", {
            ascending: false
        }).limit(1).single();
        const { data, error } = await supabase.from("email_folders").insert({
            company_id: companyId,
            name: validated.name,
            slug,
            description: validated.description || null,
            color: validated.color || null,
            icon: validated.icon || null,
            sort_order: (maxOrder?.sort_order || 0) + 1,
            created_by: user.id
        }).select().single();
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            folder: data
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.errors.map((e)=>`${e.path.join(".")}: ${e.message}`).join(", ")
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
/**
 * Update an email folder
 * @deprecated Unused
 */ async function updateEmailFolderAction(input) {
    try {
        const validated = updateFolderSchema.parse(input);
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        // Check folder exists and belongs to company
        const { data: existing, error: fetchError } = await supabase.from("email_folders").select("id, is_system").eq("id", validated.id).eq("company_id", companyId).is("deleted_at", null).single();
        if (fetchError || !existing) {
            return {
                success: false,
                error: "Folder not found"
            };
        }
        if (existing.is_system) {
            return {
                success: false,
                error: "Cannot update system folders"
            };
        }
        // If name is being updated, regenerate slug
        const updateData = {};
        if (validated.name) {
            updateData.name = validated.name;
            updateData.slug = validated.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        }
        if (validated.description !== undefined) updateData.description = validated.description;
        if (validated.color !== undefined) updateData.color = validated.color;
        if (validated.icon !== undefined) updateData.icon = validated.icon;
        if (validated.sort_order !== undefined) updateData.sort_order = validated.sort_order;
        const { data, error } = await supabase.from("email_folders").update(updateData).eq("id", validated.id).eq("company_id", companyId).select().single();
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            folder: data
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.errors.map((e)=>`${e.path.join(".")}: ${e.message}`).join(", ")
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function deleteEmailFolderAction(input) {
    try {
        const validated = deleteFolderSchema.parse(input);
        const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                success: false,
                error: "Not authenticated"
            };
        }
        // Check folder exists and belongs to company
        const { data: existing, error: fetchError } = await supabase.from("email_folders").select("id, is_system").eq("id", validated.id).eq("company_id", companyId).is("deleted_at", null).single();
        if (fetchError || !existing) {
            return {
                success: false,
                error: "Folder not found"
            };
        }
        if (existing.is_system) {
            return {
                success: false,
                error: "Cannot delete system folders"
            };
        }
        // Soft delete
        const { error } = await supabase.from("email_folders").update({
            deleted_at: new Date().toISOString(),
            deleted_by: user.id,
            is_active: false
        }).eq("id", validated.id).eq("company_id", companyId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.errors.map((e)=>`${e.path.join(".")}: ${e.message}`).join(", ")
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getEmailFoldersAction,
    createEmailFolderAction,
    deleteEmailFolderAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailFoldersAction, "007e3ac5636eb12e5c32067b03bc3f57069cf25e65", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createEmailFolderAction, "40f3cc88585848239c5b2dd062369b4217c03e2854", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteEmailFolderAction, "40c47f4aacde57fa2d2f7b15353f5b7277f571d970", null);
}),
"[project]/apps/web/src/actions/sms-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00205bdcfa50bc0588da90d86d40b50a2b710c766d":"getSmsFolderCountsAction","0033bd725882e41a470c0826ddda97f92531fc5dc3":"getCompanyContextAction","40041208f2084f2a4c0898d17ce2e19083a9be5b1e":"markSmsAsReadAction","4032803f35cf010cfe038e07483505523affc388d9":"getSmsConversationAction","403e625999b6f3a13e61e8f0364fe1e27bfde882cc":"markSmsConversationAsReadAction","40c4f9116aa010e706dfbe45ecc600312954e45998":"getSmsAction","40c8068bb783ab2ad1f1c8f9375898b2de6830580c":"getSmsByIdAction","40f550083cd84483ed1bed77216394b81eeb646a85":"uploadSmsAttachments"},"",""] */ __turbopack_context__.s([
    "getCompanyContextAction",
    ()=>getCompanyContextAction,
    "getSmsAction",
    ()=>getSmsAction,
    "getSmsByIdAction",
    ()=>getSmsByIdAction,
    "getSmsConversationAction",
    ()=>getSmsConversationAction,
    "getSmsFolderCountsAction",
    ()=>getSmsFolderCountsAction,
    "markSmsAsReadAction",
    ()=>markSmsAsReadAction,
    "markSmsConversationAsReadAction",
    ()=>markSmsConversationAsReadAction,
    "uploadSmsAttachments",
    ()=>uploadSmsAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$communication$2f$sms$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/communication/sms-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const getSmsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(1).max(500).optional().default(50),
    offset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(0).optional().default(0),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "sent",
        "received",
        "all"
    ]).optional().default("all"),
    folder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "inbox",
        "sent",
        "archive",
        "trash",
        "bin"
    ]).optional(),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    sortBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "created_at",
        "sent_at"
    ]).optional().default("created_at"),
    sortOrder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "asc",
        "desc"
    ]).optional().default("desc")
}).passthrough();
const markSmsReadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    smsId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
async function getSmsAction(input) {
    try {
        const parseResult = getSmsSchema.safeParse(input);
        if (!parseResult.success) {
            throw new Error(`Invalid input parameters: ${parseResult.error.errors.map((e)=>`${e.path.join('.')}: ${e.message}`).join(', ')}`);
        }
        const validatedInput = parseResult.data;
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            throw new Error("No active company found");
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$communication$2f$sms$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanySms"])(companyId, validatedInput);
    } catch (error) {
        console.error("❌ getSmsAction error:", error);
        throw error;
    }
}
async function getSmsByIdAction(smsId) {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const sms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$communication$2f$sms$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSmsById"])(companyId, smsId);
        if (!sms) {
            return {
                success: false,
                error: "SMS not found"
            };
        }
        return {
            success: true,
            sms
        };
    } catch (error) {
        console.error("Error getting SMS by ID:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function markSmsAsReadAction(input) {
    try {
        const validatedInput = markSmsReadSchema.parse(input);
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            throw new Error("Invalid input parameters");
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$communication$2f$sms$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markSmsAsRead"])(companyId, validatedInput.smsId);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            throw new Error("Invalid input parameters");
        }
        throw error;
    }
}
async function markSmsConversationAsReadAction(phoneNumber) {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const success = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$communication$2f$sms$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markSmsConversationAsRead"])(companyId, phoneNumber);
        return {
            success
        };
    } catch (error) {
        console.error("Error marking SMS conversation as read:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getSmsConversationAction(phoneNumber) {
    try {
        const { getSmsConversation } = await (()=>{
            const e = new Error("Cannot find module '@/lib/sms/sms-service'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        })();
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const messages = await getSmsConversation(companyId, phoneNumber);
        return {
            success: true,
            messages
        };
    } catch (error) {
        console.error("Error fetching SMS conversation:", error);
        // Handle cookies() error gracefully
        if (error instanceof Error && error.message.includes("cookies")) {
            return {
                success: false,
                error: "Request context not available. Please refresh the page."
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getSmsFolderCountsAction() {
    try {
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const baseQuery = supabase.from("communications").select("*", {
            count: "exact",
            head: true
        }).eq("company_id", companyId).eq("type", "sms");
        // Get counts for each folder
        const [inboxResult, sentResult, archiveResult, trashResult] = await Promise.all([
            // Inbox
            baseQuery.eq("direction", "inbound").eq("is_archived", false).is("deleted_at", null).or("snoozed_until.is.null,snoozed_until.lt.now()"),
            // Sent
            baseQuery.eq("direction", "outbound").eq("is_archived", false).is("deleted_at", null),
            // Archive
            baseQuery.eq("is_archived", true).is("deleted_at", null),
            // Trash
            baseQuery.not("deleted_at", "is", null)
        ]);
        const counts = {
            inbox: inboxResult.count || 0,
            sent: sentResult.count || 0,
            archive: archiveResult.count || 0,
            trash: trashResult.count || 0
        };
        return {
            success: true,
            counts
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function uploadSmsAttachments(files) {
    try {
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const companyId = await getActiveCompanyId();
        if (!companyId) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        const { createClient } = await __turbopack_context__.A("[project]/packages/database/src/server.ts [app-rsc] (ecmascript, async loader)");
        const supabase = await createClient();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection failed"
            };
        }
        const urls = [];
        // Upload each file to Supabase Storage
        // Use company-files bucket which has proper RLS policies for company members
        for (const file of files){
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            // Path structure: companyId must be at index [0] for RLS policy (matches document-manager pattern)
            // Format: companyId/folder/filename (storage.foldername(name))[0] = companyId
            const filePath = `${companyId}/sms-attachments/${fileName}`;
            // Convert file to array buffer
            const arrayBuffer = await file.arrayBuffer();
            const { data, error: uploadError } = await supabase.storage.from('company-files') // Use company-files bucket with proper RLS
            .upload(filePath, arrayBuffer, {
                contentType: file.type,
                upsert: false
            });
            if (uploadError) {
                console.error("Upload error:", uploadError);
                return {
                    success: false,
                    error: `Failed to upload ${file.name}: ${uploadError.message}`
                };
            }
            // Get public URL (or signed URL for private bucket)
            const { data: { publicUrl } } = supabase.storage.from('company-files').getPublicUrl(filePath);
            urls.push(publicUrl);
        }
        return {
            success: true,
            urls
        };
    } catch (error) {
        console.error("Error uploading SMS attachments:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getCompanyContextAction() {
    try {
        const { getActiveCompany } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const company = await getActiveCompany();
        if (!company) {
            return {
                success: false,
                error: "No active company found"
            };
        }
        return {
            success: true,
            context: {
                companyName: company.name,
                companyPhone: company.phone || undefined,
                companyEmail: company.email || undefined
            }
        };
    } catch (error) {
        console.error("Error getting company context:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getSmsAction,
    getSmsByIdAction,
    markSmsAsReadAction,
    markSmsConversationAsReadAction,
    getSmsConversationAction,
    getSmsFolderCountsAction,
    uploadSmsAttachments,
    getCompanyContextAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSmsAction, "40c4f9116aa010e706dfbe45ecc600312954e45998", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSmsByIdAction, "40c8068bb783ab2ad1f1c8f9375898b2de6830580c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markSmsAsReadAction, "40041208f2084f2a4c0898d17ce2e19083a9be5b1e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markSmsConversationAsReadAction, "403e625999b6f3a13e61e8f0364fe1e27bfde882cc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSmsConversationAction, "4032803f35cf010cfe038e07483505523affc388d9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSmsFolderCountsAction, "00205bdcfa50bc0588da90d86d40b50a2b710c766d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadSmsAttachments, "40f550083cd84483ed1bed77216394b81eeb646a85", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyContextAction, "0033bd725882e41a470c0826ddda97f92531fc5dc3", null);
}),
"[project]/apps/web/src/actions/vendors.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Vendors Server Actions
 *
 * Handles vendor management with CRUD operations, search, and vendor selection.
 */ /* __next_internal_action_entry_do_not_use__ [{"4005887c8d295fa2d1c49e1909c9e33219857f0b1b":"archiveVendor","400caff3b7aa2d01f050d0c957d62d3a92e63f1504":"searchVendors","605dc47fe92469e853fcb6898c1bb1d820ecb2d539":"linkPurchaseOrderToVendor","60698a54a2b6c8ae1b86e73959395848d2ce978864":"updateVendor"},"",""] */ __turbopack_context__.s([
    "archiveVendor",
    ()=>archiveVendor,
    "linkPurchaseOrderToVendor",
    ()=>linkPurchaseOrderToVendor,
    "searchVendors",
    ()=>searchVendors,
    "updateVendor",
    ()=>updateVendor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/action-error.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/with-error-handling.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validations$2f$database$2d$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/validations/database-schemas.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
// Regex constants
const VENDOR_NUMBER_REGEX = /VND-\d{4}-(\d+)/;
;
;
;
/**
 * Generate unique vendor number
 */ async function generateVendorNumber(supabase, companyId) {
    const { data: latestVendor } = await supabase.from("vendors").select("vendor_number").eq("company_id", companyId).is("deleted_at", null).order("created_at", {
        ascending: false
    }).limit(1).single();
    if (!latestVendor) {
        return `VND-${new Date().getFullYear()}-001`;
    }
    const match = latestVendor.vendor_number.match(VENDOR_NUMBER_REGEX);
    if (match) {
        const nextNumber = Number.parseInt(match[1], 10) + 1;
        return `VND-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
    }
    return `VND-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}
/**
 * Create a new vendor
 */ async function createVendor(formData) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Generate vendor number if not provided
        const vendorNumber = formData.get("vendor_number")?.toString() || await generateVendorNumber(supabase, teamMember.company_id);
        // Validate input
        const data = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validations$2f$database$2d$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["vendorInsertSchema"].parse({
            company_id: teamMember.company_id,
            name: formData.get("name"),
            display_name: formData.get("display_name") || formData.get("name"),
            vendor_number: vendorNumber,
            email: formData.get("email") || undefined,
            phone: formData.get("phone") || undefined,
            secondary_phone: formData.get("secondary_phone") || undefined,
            website: formData.get("website") || undefined,
            address: formData.get("address") || undefined,
            address2: formData.get("address2") || undefined,
            city: formData.get("city") || undefined,
            state: formData.get("state") || undefined,
            zip_code: formData.get("zip_code") || undefined,
            country: formData.get("country") || "USA",
            tax_id: formData.get("tax_id") || undefined,
            payment_terms: formData.get("payment_terms") || "net_30",
            credit_limit: formData.get("credit_limit") ? Number.parseInt(formData.get("credit_limit"), 10) * 100 : 0,
            preferred_payment_method: formData.get("preferred_payment_method") || undefined,
            category: formData.get("category") || undefined,
            tags: formData.get("tags") ? JSON.parse(formData.get("tags")) : undefined,
            status: formData.get("status") || "active",
            notes: formData.get("notes") || undefined,
            internal_notes: formData.get("internal_notes") || undefined,
            custom_fields: formData.get("custom_fields") ? JSON.parse(formData.get("custom_fields")) : undefined
        });
        // Check if vendor number already exists
        const { data: existingVendor } = await supabase.from("vendors").select("id").eq("company_id", teamMember.company_id).eq("vendor_number", data.vendor_number).is("deleted_at", null).single();
        if (existingVendor) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Vendor number already exists", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].VALIDATION_FAILED);
        }
        // Insert vendor
        const { data: vendor, error } = await supabase.from("vendors").insert({
            company_id: data.company_id,
            name: data.name,
            display_name: data.display_name,
            vendor_number: data.vendor_number,
            email: data.email,
            phone: data.phone,
            secondary_phone: data.secondary_phone,
            website: data.website,
            address: data.address,
            address2: data.address2,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            country: data.country,
            tax_id: data.tax_id,
            payment_terms: data.payment_terms,
            credit_limit: data.credit_limit,
            preferred_payment_method: data.preferred_payment_method,
            category: data.category,
            tags: data.tags || [],
            status: data.status,
            notes: data.notes,
            internal_notes: data.internal_notes,
            custom_fields: data.custom_fields || {}
        }).select("id").single();
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to create vendor", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(vendor, "Vendor");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/inventory/vendors");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/inventory/vendors/${vendor.id}`);
        return vendor.id;
    });
}
async function updateVendor(vendorId, formData) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Verify vendor exists and belongs to company
        const { data: existingVendor } = await supabase.from("vendors").select("id, company_id, vendor_number").eq("id", vendorId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(existingVendor, "Vendor");
        if (existingVendor.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].forbidden("vendor"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Build update object from form data
        const updateData = {};
        if (formData.has("name")) {
            updateData.name = formData.get("name");
        }
        if (formData.has("display_name")) {
            updateData.display_name = formData.get("display_name");
        }
        if (formData.has("vendor_number")) {
            updateData.vendor_number = formData.get("vendor_number");
        }
        if (formData.has("email")) {
            updateData.email = formData.get("email") || undefined;
        }
        if (formData.has("phone")) {
            updateData.phone = formData.get("phone") || undefined;
        }
        if (formData.has("secondary_phone")) {
            updateData.secondary_phone = formData.get("secondary_phone") || undefined;
        }
        if (formData.has("website")) {
            updateData.website = formData.get("website") || undefined;
        }
        if (formData.has("address")) {
            updateData.address = formData.get("address") || undefined;
        }
        if (formData.has("address2")) {
            updateData.address2 = formData.get("address2") || undefined;
        }
        if (formData.has("city")) {
            updateData.city = formData.get("city") || undefined;
        }
        if (formData.has("state")) {
            updateData.state = formData.get("state") || undefined;
        }
        if (formData.has("zip_code")) {
            updateData.zip_code = formData.get("zip_code") || undefined;
        }
        if (formData.has("country")) {
            updateData.country = formData.get("country");
        }
        if (formData.has("tax_id")) {
            updateData.tax_id = formData.get("tax_id") || undefined;
        }
        if (formData.has("payment_terms")) {
            updateData.payment_terms = formData.get("payment_terms");
        }
        if (formData.has("credit_limit")) {
            updateData.credit_limit = Number.parseInt(formData.get("credit_limit"), 10) * 100;
        }
        if (formData.has("preferred_payment_method")) {
            updateData.preferred_payment_method = formData.get("preferred_payment_method");
        }
        if (formData.has("category")) {
            updateData.category = formData.get("category");
        }
        if (formData.has("tags")) {
            updateData.tags = JSON.parse(formData.get("tags"));
        }
        if (formData.has("status")) {
            updateData.status = formData.get("status");
        }
        if (formData.has("notes")) {
            updateData.notes = formData.get("notes") || undefined;
        }
        if (formData.has("internal_notes")) {
            updateData.internal_notes = formData.get("internal_notes") || undefined;
        }
        if (formData.has("custom_fields")) {
            updateData.custom_fields = JSON.parse(formData.get("custom_fields"));
        }
        // Validate update data
        const validated = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$validations$2f$database$2d$schemas$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["vendorUpdateSchema"].parse(updateData);
        // Check vendor number uniqueness if changed
        if (validated.vendor_number && validated.vendor_number !== existingVendor.vendor_number) {
            const { data: duplicate } = await supabase.from("vendors").select("id").eq("company_id", teamMember.company_id).eq("vendor_number", validated.vendor_number).neq("id", vendorId).is("deleted_at", null).single();
            if (duplicate) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Vendor number already exists", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].VALIDATION_FAILED);
            }
        }
        // Update vendor
        const { error } = await supabase.from("vendors").update(validated).eq("id", vendorId);
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to update vendor", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/inventory/vendors");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/inventory/vendors/${vendorId}`);
    });
}
/**
 * Delete (soft delete) a vendor
 */ async function deleteVendor(vendorId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Verify vendor exists and belongs to company
        const { data: vendor } = await supabase.from("vendors").select("id, company_id").eq("id", vendorId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(vendor, "Vendor");
        if (vendor.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].forbidden("vendor"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Soft delete vendor
        const { error } = await supabase.from("vendors").update({
            deleted_at: new Date().toISOString(),
            deleted_by: user.id
        }).eq("id", vendorId);
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to delete vendor", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/inventory/vendors");
    });
}
/**
 * Get a single vendor by ID
 */ async function getVendor(vendorId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        const { data: vendor, error } = await supabase.from("vendors").select("*").eq("id", vendorId).eq("company_id", teamMember.company_id).is("deleted_at", null).single();
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to fetch vendor", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(vendor, "Vendor");
        return vendor;
    });
}
/**
 * List all vendors for the company
 */ async function listVendors(options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        let query = supabase.from("vendors").select("*").eq("company_id", teamMember.company_id).is("deleted_at", null).order("name", {
            ascending: true
        });
        if (options?.status) {
            query = query.eq("status", options.status);
        }
        if (options?.category) {
            query = query.eq("category", options.category);
        }
        if (options?.search) {
            query = query.or(`name.ilike.%${options.search}%,display_name.ilike.%${options.search}%,vendor_number.ilike.%${options.search}%,email.ilike.%${options.search}%`);
        }
        const { data: vendors, error } = await query;
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to fetch vendors", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        return vendors || [];
    });
}
async function searchVendors(query) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        // Use the same approach as searchCustomers
        const { getActiveCompanyId } = await __turbopack_context__.A("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript, async loader)");
        const activeCompanyId = await getActiveCompanyId();
        if (!activeCompanyId) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("No active company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Verify user has access to the active company
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("company_id", activeCompanyId).eq("status", "active").maybeSingle();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You don't have access to this company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        const { data: vendors, error } = await supabase.from("vendors").select("id, name, display_name, vendor_number, email, phone, status").eq("company_id", activeCompanyId).eq("status", "active").is("deleted_at", null).or(`name.ilike.%${query}%,display_name.ilike.%${query}%,vendor_number.ilike.%${query}%,email.ilike.%${query}%`).limit(20);
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to search vendors", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        return vendors || [];
    });
}
async function linkPurchaseOrderToVendor(purchaseOrderId, vendorId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withErrorHandling"])(async ()=>{
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR);
        }
        const { data: { user } } = await supabase.auth.getUser();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertAuthenticated"])(user?.id);
        const { data: teamMember } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").single();
        if (!teamMember?.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be part of a company", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Verify purchase order exists and belongs to company
        const { data: po } = await supabase.from("purchase_orders").select("id, company_id").eq("id", purchaseOrderId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(po, "Purchase Order");
        if (po.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].forbidden("purchase order"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Verify vendor exists and belongs to company
        const { data: vendor } = await supabase.from("vendors").select("id, company_id").eq("id", vendorId).is("deleted_at", null).single();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$with$2d$error$2d$handling$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assertExists"])(vendor, "Vendor");
        if (vendor.company_id !== teamMember.company_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_MESSAGES"].forbidden("vendor"), __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
        }
        // Link purchase order to vendor
        const { error } = await supabase.from("purchase_orders").update({
            vendor_id: vendorId
        }).eq("id", purchaseOrderId);
        if (error) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Failed to link purchase order", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_QUERY_ERROR);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/work/vendors");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/work/vendors/${vendorId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/work/purchase-orders");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/work/purchase-orders/${purchaseOrderId}`);
    });
}
async function archiveVendor(vendorId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Database connection not available"
            };
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                success: false,
                error: "Unauthorized"
            };
        }
        const { error } = await supabase.from("vendors").update({
            deleted_at: new Date().toISOString()
        }).eq("id", vendorId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/work/vendors");
        return {
            success: true
        };
    } catch (_error) {
        return {
            success: false,
            error: "Failed to archive vendor"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateVendor,
    searchVendors,
    linkPurchaseOrderToVendor,
    archiveVendor
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateVendor, "60698a54a2b6c8ae1b86e73959395848d2ce978864", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(searchVendors, "400caff3b7aa2d01f050d0c957d62d3a92e63f1504", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(linkPurchaseOrderToVendor, "605dc47fe92469e853fcb6898c1bb1d820ecb2d539", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(archiveVendor, "4005887c8d295fa2d1c49e1909c9e33219857f0b1b", null);
}),
];

//# sourceMappingURL=apps_web_src_actions_50ad8072._.js.map