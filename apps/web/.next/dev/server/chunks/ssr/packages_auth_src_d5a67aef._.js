module.exports = [
"[project]/packages/auth/src/permissions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "getUserRole",
    ()=>getUserRole,
    "hasPermission",
    ()=>hasPermission,
    "hasRole",
    ()=>hasRole,
    "isCompanyOwner",
    ()=>isCompanyOwner
]);
// ============================================================================
// Role Definitions
// ============================================================================
/**
 * Complete role configurations with their permissions
 * Used for UI display and permission reference
 */ const ROLES = {
    owner: {
        id: "owner",
        label: "Owner",
        description: "Full system access with focus on business financials and growth",
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
            "delete_team_members"
        ],
        dashboardFeatures: [
            "financial-overview",
            "profit-margins",
            "cash-flow",
            "business-growth",
            "payroll-overview",
            "all-reports"
        ]
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
            "delete_customers"
        ],
        dashboardFeatures: [
            "system-settings",
            "user-management",
            "integrations",
            "audit-logs"
        ]
    },
    manager: {
        id: "manager",
        label: "Manager",
        description: "Oversee team performance, customer satisfaction, and operations",
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
            "delete_jobs"
        ],
        dashboardFeatures: [
            "team-performance",
            "customer-satisfaction",
            "callback-queue",
            "review-alerts",
            "kpi-tracking",
            "inventory-management"
        ]
    },
    dispatcher: {
        id: "dispatcher",
        label: "Dispatcher",
        description: "Manage technician schedules, job assignments, and real-time operations",
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
            "view_schedule"
        ],
        dashboardFeatures: [
            "dispatch-map",
            "technician-locations",
            "unassigned-jobs",
            "emergency-queue",
            "quick-dispatch",
            "tech-status"
        ]
    },
    technician: {
        id: "technician",
        label: "Technician",
        description: "View assigned jobs, update job status, and track personal performance",
        permissions: [
            "update_job_status",
            "create_invoices",
            "upload_photos",
            "view_customers",
            "view_jobs",
            "view_schedule"
        ],
        dashboardFeatures: [
            "my-schedule",
            "active-job",
            "my-earnings",
            "my-performance",
            "parts-inventory",
            "time-tracking"
        ]
    },
    csr: {
        id: "csr",
        label: "Customer Service Rep",
        description: "Handle customer calls, schedule appointments, and manage customer relationships",
        permissions: [
            "create_jobs",
            "schedule_appointments",
            "send_communications",
            "create_invoices",
            "view_customers",
            "view_jobs",
            "view_schedule"
        ],
        dashboardFeatures: [
            "call-queue",
            "booking-calendar",
            "customer-search",
            "follow-up-queue",
            "estimate-pipeline",
            "call-scripts"
        ]
    }
};
async function hasRole(supabase, userId, role, companyId) {
    const { data, error } = await supabase.rpc("has_role", {
        user_uuid: userId,
        required_role: role,
        company_uuid: companyId
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
 */ async function hasAnyRole(supabase, userId, roles, companyId) {
    const { data, error } = await supabase.rpc("has_any_role", {
        user_uuid: userId,
        required_roles: roles,
        company_uuid: companyId
    });
    if (error) {
        return false;
    }
    return data === true;
}
async function getUserRole(supabase, userId, companyId) {
    const { data, error } = await supabase.rpc("get_user_role", {
        user_uuid: userId,
        company_uuid: companyId
    });
    if (error) {
        return null;
    }
    return data;
}
async function hasPermission(supabase, userId, permission, companyId) {
    const { data, error } = await supabase.rpc("has_permission", {
        user_uuid: userId,
        permission_key: permission,
        company_uuid: companyId
    });
    if (error) {
        return false;
    }
    return data === true;
}
async function isCompanyOwner(supabase, userId, companyId) {
    const { data, error } = await supabase.rpc("is_company_owner", {
        user_uuid: userId,
        company_uuid: companyId
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
 */ function getRolePermissions(role) {
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
 */ function roleHasPermission(role, permission) {
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
 */ function getRoleConfig(role) {
    return ROLES[role];
}
}),
"[project]/packages/auth/src/tokens.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Authentication Token Utilities
 *
 * Features:
 * - Secure token generation for email verification
 * - Token storage and validation
 * - Expiration handling
 * - One-time use tokens
 *
 * Note: Uses Supabase directly instead of Drizzle ORM
 */ /* __next_internal_action_entry_do_not_use__ [{"60f2ec5d776deaa963813afec86ee6c0f5966f4718":"verifyAndConsumeToken","7091dacccc90ea4d4201e758d1bffea229b0251142":"createEmailVerificationToken"},"",""] */ __turbopack_context__.s([
    "createEmailVerificationToken",
    ()=>createEmailVerificationToken,
    "verifyAndConsumeToken",
    ()=>verifyAndConsumeToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
/**
 * Generate a secure random token
 */ function generateSecureToken() {
    // Generate 32 bytes of random data and convert to hex string (64 characters)
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("hex");
}
async function createEmailVerificationToken(email, userId, expiresInHours = 24) {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    const { error } = await supabase.from("verification_tokens").insert({
        token,
        email,
        type: "email_verification",
        user_id: userId,
        expires_at: expiresAt.toISOString(),
        used: false
    });
    if (error) {
        throw new Error(`Failed to create verification token: ${error.message}`);
    }
    return {
        token,
        expiresAt
    };
}
/**
 * Create a password reset token
 *
 * @param email - User's email address
 * @param expiresInHours - Token expiration in hours (default: 1)
 */ async function createPasswordResetToken(email, expiresInHours = 1) {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    const { error } = await supabase.from("verification_tokens").insert({
        token,
        email,
        type: "password_reset",
        expires_at: expiresAt.toISOString(),
        used: false
    });
    if (error) {
        throw new Error(`Failed to create password reset token: ${error.message}`);
    }
    return {
        token,
        expiresAt
    };
}
/**
 * Create a magic link token
 *
 * @param email - User's email address
 * @param expiresInMinutes - Token expiration in minutes (default: 15)
 */ async function createMagicLinkToken(email, expiresInMinutes = 15) {
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    const { error } = await supabase.from("verification_tokens").insert({
        token,
        email,
        type: "magic_link",
        expires_at: expiresAt.toISOString(),
        used: false
    });
    if (error) {
        throw new Error(`Failed to create magic link token: ${error.message}`);
    }
    return {
        token,
        expiresAt
    };
}
async function verifyAndConsumeToken(token, type) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    const now = new Date().toISOString();
    // Find unused, non-expired token
    const { data: tokenRecord, error: selectError } = await supabase.from("verification_tokens").select("*").eq("token", token).eq("type", type).eq("used", false).gt("expires_at", now).limit(1).single();
    if (selectError || !tokenRecord) {
        return null;
    }
    // Mark token as used
    const { error: updateError } = await supabase.from("verification_tokens").update({
        used: true,
        used_at: now
    }).eq("id", tokenRecord.id);
    if (updateError) {
        throw new Error(`Failed to consume token: ${updateError.message}`);
    }
    return tokenRecord;
}
/**
 * Delete expired tokens (cleanup)
 */ async function cleanupExpiredTokens() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    const now = new Date().toISOString();
    const { error } = await supabase.from("verification_tokens").delete().lt("expires_at", now);
    if (error) {
        throw new Error(`Failed to cleanup expired tokens: ${error.message}`);
    }
}
/**
 * Delete all tokens for an email
 *
 * @param email - User's email address
 * @param type - Optional: specific token type to delete
 */ async function deleteTokensForEmail(email, type) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        throw new Error("Supabase client not configured");
    }
    let query = supabase.from("verification_tokens").delete().eq("email", email);
    if (type) {
        query = query.eq("type", type);
    }
    const { error } = await query;
    if (error) {
        throw new Error(`Failed to delete tokens: ${error.message}`);
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createEmailVerificationToken,
    verifyAndConsumeToken
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createEmailVerificationToken, "7091dacccc90ea4d4201e758d1bffea229b0251142", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyAndConsumeToken, "60f2ec5d776deaa963813afec86ee6c0f5966f4718", null);
}),
];

//# sourceMappingURL=packages_auth_src_d5a67aef._.js.map