module.exports = [
"[project]/packages/database/src/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.7.0_@supabase+supabase-js@2.81.0/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.7.0_@supabase+supabase-js@2.81.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
const createClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const supabaseUrl = ("TURBOPACK compile-time value", "https://togejqdwggezkxahomeh.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2VqcWR3Z2dlemt4YWhvbWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjAyOTUsImV4cCI6MjA3NzI5NjI5NX0.a74QOxiIcxeALZsTsNXNDiOls1MZDsFfyGFq992eBBM");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Dynamic import of next/headers to prevent bundling in client components
    const { cookies, headers } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    let cookieStore;
    // Check if we're in a prerendering context by looking at headers
    let headersStore;
    try {
        headersStore = await headers();
        // If we can get headers and there's no x-prerender header, we might be safe
        if (headersStore.get("x-prerender")) {
            return null;
        }
    } catch  {
        // If headers() fails, we're likely in prerendering
        return null;
    }
    try {
        cookieStore = await cookies();
    } catch (error) {
        // During prerendering, cookies() may reject - return null
        // This allows PPR to work correctly
        if (error instanceof Error && (error.message.includes("During prerendering") || error.message.includes("prerendering") || error.message.includes("cookies()"))) {
            return null;
        }
        // For other errors, rethrow
        throw error;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$7$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set(name, value, options);
                } catch  {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            },
            remove (name, _options) {
                try {
                    cookieStore.delete(name);
                } catch  {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
});
}),
"[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"005adb1d7e8dfb8147dcd7faf3f97a1fc6f745616b":"createServiceSupabaseClient"},"",""] */ __turbopack_context__.s([
    "createServiceSupabaseClient",
    ()=>createServiceSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.81.0/node_modules/@supabase/supabase-js/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function createServiceSupabaseClient() {
    // Prefer pooler URL for Transaction Mode (better performance)
    // WEB_SUPABASE_URL allows admin app to connect to web database for cross-app queries
    const supabaseUrl = process.env.SUPABASE_POOLER_URL || process.env.WEB_SUPABASE_URL || ("TURBOPACK compile-time value", "https://togejqdwggezkxahomeh.supabase.co");
    // Support multiple env var names for flexibility across apps
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.WEB_SUPABASE_SERVICE_ROLE_KEY || process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        console.error("[Service Client] Missing env vars:", {
            hasUrl: !!supabaseUrl,
            hasKey: !!serviceRoleKey
        });
        return null;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        },
        db: {
            schema: "public"
        },
        global: {
            headers: {
                "x-my-custom-header": "service-role"
            }
        }
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createServiceSupabaseClient
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createServiceSupabaseClient, "005adb1d7e8dfb8147dcd7faf3f97a1fc6f745616b", null);
}),
"[project]/packages/shared/src/onboarding.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utilities for determining onboarding completion across server components
 * and API routes. Keeps the logic centralized so we can evolve the rules
 * (e.g. adding new steps) without hunting down scattered checks.
 */ __turbopack_context__.s([
    "getCurrentOnboardingStep",
    ()=>getCurrentOnboardingStep,
    "getMissingRequiredSteps",
    ()=>getMissingRequiredSteps,
    "getOnboardingProgress",
    ()=>getOnboardingProgress,
    "isOnboardingComplete",
    ()=>isOnboardingComplete
]);
// Must match STEPS_ORDER from onboarding-store.ts
const REQUIRED_STEPS = [
    "welcome",
    "company"
];
const FINAL_STEP = "complete";
function isOnboardingComplete(options) {
    const { progress, completedAt } = options;
    // Primary check: completedAt timestamp from database
    if (completedAt) {
        return true;
    }
    if (!progress || typeof progress !== "object") {
        return false;
    }
    const progressRecord = progress;
    // Check onboardingCompleted flag
    if (progressRecord.onboardingCompleted === true) {
        return true;
    }
    // Check if completedSteps array includes the final step
    const completedSteps = progressRecord.completedSteps;
    if (Array.isArray(completedSteps) && completedSteps.includes(FINAL_STEP)) {
        return true;
    }
    return false;
}
function getOnboardingProgress(options) {
    const { progress } = options;
    if (!progress || typeof progress !== "object") {
        return 0;
    }
    const progressRecord = progress;
    const completedSteps = progressRecord.completedSteps;
    const skippedSteps = progressRecord.skippedSteps;
    if (!Array.isArray(completedSteps)) {
        return 0;
    }
    const totalSteps = 14; // Total steps in onboarding
    const finishedCount = completedSteps.length + (Array.isArray(skippedSteps) ? skippedSteps.length : 0);
    return Math.round(finishedCount / totalSteps * 100);
}
function getMissingRequiredSteps(options) {
    const { progress } = options;
    if (!progress || typeof progress !== "object") {
        return [
            ...REQUIRED_STEPS
        ];
    }
    const progressRecord = progress;
    const completedSteps = progressRecord.completedSteps;
    if (!Array.isArray(completedSteps)) {
        return [
            ...REQUIRED_STEPS
        ];
    }
    return REQUIRED_STEPS.filter((step)=>!completedSteps.includes(step));
}
function getCurrentOnboardingStep(options) {
    const { progress } = options;
    if (!progress || typeof progress !== "object") {
        return "welcome";
    }
    const progressRecord = progress;
    const currentStep = progressRecord.currentStep;
    if (typeof currentStep === "string" && currentStep.length > 0) {
        return currentStep;
    }
    return "welcome";
}
}),
"[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Session Management Utilities - Server Component Helpers
 *
 * Features:
 * - Get current authenticated user
 * - Get current session
 * - Require authentication (throw error if not authenticated)
 * - Check user permissions and roles
 * - Server Component compatible
 */ __turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "requireUser",
    ()=>requireUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
const getCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        // Use getUser() to authenticate with Supabase Auth server
        // This verifies the session is valid and not tampered with
        const { data: { user }, error } = await supabase.auth.getUser();
        // Handle error - could be AuthSessionMissingError or network error
        if (error) {
            // AuthSessionMissingError is expected when user is not authenticated
            // Don't log this as an error, just return null
            if (error.name === "AuthSessionMissingError") {
                return null;
            }
            return null;
        }
        return user;
    } catch (error) {
        // Catch any unexpected errors (network issues, etc.)
        // The error might be thrown instead of returned in some cases
        if (error && typeof error === "object" && "name" in error && error.name === "AuthSessionMissingError") {
            return null;
        }
        return null;
    }
});
/**
 * Get Session - Cached for performance
 *
 * Returns the current session or null if not authenticated.
 * Cached per request to avoid multiple database calls.
 */ const getSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            return null;
        }
        return session;
    } catch (_error) {
        return null;
    }
});
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Authentication required. Please log in to continue.");
    }
    return user;
}
/**
 * Require Session - Throw error if no session
 *
 * Use this when you need both user and session data (e.g., access token).
 */ async function requireSession() {
    const session = await getSession();
    if (!session) {
        throw new Error("Active session required. Please log in to continue.");
    }
    return session;
}
/**
 * Check if user is authenticated
 *
 * Returns true if user is authenticated, false otherwise.
 * Useful for conditional rendering in Server Components.
 */ async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}
/**
 * Get User Metadata
 *
 * Returns user metadata from Supabase Auth.
 * Useful for accessing additional user properties stored in auth.users.
 */ async function getUserMetadata() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    return user.user_metadata || null;
}
/**
 * Check User Email Verified
 *
 * Returns true if user's email is verified, false otherwise.
 */ async function isEmailVerified() {
    const user = await getCurrentUser();
    if (!user) {
        return false;
    }
    return user.email_confirmed_at !== undefined;
}
/**
 * Get User ID
 *
 * Returns the user's ID or null if not authenticated.
 * Convenient helper for getting just the user ID.
 */ async function getUserId() {
    const user = await getCurrentUser();
    return user?.id || null;
}
/**
 * Get User Email
 *
 * Returns the user's email or null if not authenticated.
 */ async function getUserEmail() {
    const user = await getCurrentUser();
    return user?.email || null;
}
/**
 * Get Access Token
 *
 * Returns the current access token for API calls.
 * Useful for calling external APIs that require authentication.
 */ async function getAccessToken() {
    const session = await getSession();
    return session?.access_token || null;
}
/**
 * Refresh Session
 *
 * Manually refresh the session to get a new access token.
 * Usually not needed as Supabase handles this automatically.
 */ async function refreshSession() {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return null;
        }
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) {
            return null;
        }
        return session;
    } catch (_error) {
        return null;
    }
}
}),
"[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Company Context Management
 *
 * Handles multi-tenancy by tracking and switching between companies
 * for users who may be members of multiple companies.
 *
 * Features:
 * - Active company stored in HTTP-only cookie
 * - Falls back to first available company
 * - Validates access before switching
 * - Server-side only (no client-side state)
 *
 * PERFORMANCE: All functions wrapped with React.cache() to prevent
 * redundant database queries across components in the same request.
 */ __turbopack_context__.s([
    "clearActiveCompany",
    ()=>clearActiveCompany,
    "getActiveCompany",
    ()=>getActiveCompany,
    "getActiveCompanyId",
    ()=>getActiveCompanyId,
    "getActiveTeamMemberId",
    ()=>getActiveTeamMemberId,
    "getUserCompanies",
    ()=>getUserCompanies,
    "isActiveCompanyOnboardingComplete",
    ()=>isActiveCompanyOnboardingComplete,
    "requireActiveCompany",
    ()=>requireActiveCompany,
    "setActiveCompany",
    ()=>setActiveCompany
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$onboarding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/src/onboarding.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/session.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const ACTIVE_COMPANY_COOKIE = "active_company_id";
const getActiveCompanyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    let cookieStore;
    try {
        cookieStore = await cookies();
    } catch (error) {
        // During prerendering, cookies() may reject - return null
        // This allows PPR to work correctly
        if (error instanceof Error && (error.message.includes("During prerendering") || error.message.includes("prerendering") || error.message.includes("cookies()"))) {
            return null;
        }
        throw error;
    }
    const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value;
    if (activeCompanyId) {
        // Verify user still has access to this company
        const hasAccess = await verifyCompanyAccess(activeCompanyId);
        if (hasAccess) {
            return activeCompanyId;
        }
    }
    // Fall back to first available company
    const companies = await getUserCompanies();
    return companies[0]?.id || null;
});
const getActiveCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const companyId = await getActiveCompanyId();
    if (!companyId) {
        return null;
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return null;
    }
    const { data: company } = await supabase.from("companies").select("id, name, logo, phone, email").eq("id", companyId).is("deleted_at", null) // Exclude archived companies
    .single();
    return company;
});
async function setActiveCompany(companyId) {
    // Verify access before switching
    const hasAccess = await verifyCompanyAccess(companyId);
    if (!hasAccess) {
        throw new Error("You don't have access to this company");
    }
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
    });
}
async function clearActiveCompany() {
    const { cookies } = await __turbopack_context__.A("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript, async loader)");
    const cookieStore = await cookies();
    cookieStore.delete(ACTIVE_COMPANY_COOKIE);
}
const getUserCompanies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return [];
    }
    // Use service role to bypass RLS recursion on JOIN
    // Query is safe: explicitly filtered to user's own records
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    if (!supabase) {
        return [];
    }
    const { data: memberships } = await supabase.from("company_memberships").select(`
      company_id,
      companies!inner (
        id,
        name,
        logo,
        deleted_at,
        onboarding_completed_at
      )
    `).eq("user_id", user.id).eq("status", "active").is("companies.deleted_at", null); // Exclude archived companies
    if (!memberships) {
        return [];
    }
    // Sort companies: prioritize completed onboarding over incomplete
    const sorted = memberships.sort((a, b)=>{
        const aCompleted = !!a.companies.onboarding_completed_at;
        const bCompleted = !!b.companies.onboarding_completed_at;
        // Completed companies first
        if (aCompleted && !bCompleted) return -1;
        if (!aCompleted && bCompleted) return 1;
        // Then by name alphabetically
        return a.companies.name.localeCompare(b.companies.name);
    });
    return sorted.map((m)=>({
            id: m.companies.id,
            name: m.companies.name,
            logo: m.companies.logo
        }));
});
/**
 * Verify Company Access
 *
 * Checks if user has access to a company.
 *
 * @param companyId - Company ID to verify
 * @returns true if user has access, false otherwise
 */ const verifyCompanyAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async (companyId)=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return false;
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return false;
    }
    // Parallel queries instead of sequential (saves 20-30ms)
    const [companyResult, memberResult] = await Promise.all([
        // Check if company exists and is not archived
        supabase.from("companies").select("id").eq("id", companyId).is("deleted_at", null).single(),
        // Check if user has active membership
        supabase.from("company_memberships").select("id").eq("user_id", user.id).eq("company_id", companyId).eq("status", "active").single()
    ]);
    // Both must succeed
    return !!(companyResult.data && memberResult.data);
});
const getActiveTeamMemberId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return null;
    }
    const companyId = await getActiveCompanyId();
    if (!companyId) {
        return null;
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return null;
    }
    const { data: teamMember } = await supabase.from("team_members").select("id").eq("user_id", user.id).eq("company_id", companyId).eq("status", "active").single();
    return teamMember?.id || null;
});
async function requireActiveCompany() {
    const companyId = await getActiveCompanyId();
    if (!companyId) {
        throw new Error("No active company selected. Please select a company.");
    }
    return companyId;
}
/**
 * Check if User Has Multiple Companies
 *
 * Useful for conditionally showing company switcher UI.
 *
 * @returns true if user has 2+ companies, false otherwise
 */ async function hasMultipleCompanies() {
    const companies = await getUserCompanies();
    return companies.length > 1;
}
async function isActiveCompanyOnboardingComplete() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return false;
    }
    const activeCompanyId = await getActiveCompanyId();
    if (!activeCompanyId) {
        return false;
    }
    // Use service role to bypass RLS recursion on JOIN
    // Query is safe: explicitly filtered to user's own record
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    if (!supabase) {
        return false;
    }
    // Check the ACTIVE company's payment status
    const { data: teamMember } = await supabase.from("company_memberships").select("company_id, companies!inner(stripe_subscription_status, onboarding_progress, onboarding_completed_at)").eq("user_id", user.id).eq("company_id", activeCompanyId).eq("status", "active").maybeSingle();
    if (!teamMember) {
        return false;
    }
    const companies = Array.isArray(teamMember.companies) ? teamMember.companies[0] : teamMember.companies;
    const subscriptionStatus = companies?.stripe_subscription_status;
    const subscriptionActive = subscriptionStatus === "active" || subscriptionStatus === "trialing";
    const onboardingProgress = companies?.onboarding_progress || null;
    const onboardingFinished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$src$2f$onboarding$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOnboardingComplete"])({
        progress: onboardingProgress,
        completedAt: companies?.onboarding_completed_at ?? null
    });
    return subscriptionActive && onboardingFinished || ("TURBOPACK compile-time value", "development") === "development";
}
}),
"[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/auth package for backwards compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
;
}),
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
"[project]/apps/web/src/lib/auth/permissions.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/auth package for backwards compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/permissions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/web/src/lib/errors/action-error.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Action Error Class & Error Codes
 *
 * Provides standardized error handling for Server Actions with:
 * - Error codes for categorization
 * - HTTP status codes for API responses
 * - Detailed error messages
 * - Optional error details/context
 */ /**
 * Error Code Constants
 *
 * Organized by category for easy management and consistent error handling
 */ __turbopack_context__.s([
    "ActionError",
    ()=>ActionError,
    "ERROR_CODES",
    ()=>ERROR_CODES,
    "ERROR_MESSAGES",
    ()=>ERROR_MESSAGES
]);
const ERROR_CODES = {
    // Authentication & Authorization
    AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
    AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
    AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
    AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
    AUTH_EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",
    // Validation
    VALIDATION_FAILED: "VALIDATION_FAILED",
    VALIDATION_REQUIRED_FIELD: "VALIDATION_REQUIRED_FIELD",
    VALIDATION_INVALID_FORMAT: "VALIDATION_INVALID_FORMAT",
    VALIDATION_OUT_OF_RANGE: "VALIDATION_OUT_OF_RANGE",
    // Database
    DB_RECORD_NOT_FOUND: "DB_RECORD_NOT_FOUND",
    DB_DUPLICATE_ENTRY: "DB_DUPLICATE_ENTRY",
    DB_CONSTRAINT_VIOLATION: "DB_CONSTRAINT_VIOLATION",
    DB_FOREIGN_KEY_VIOLATION: "DB_FOREIGN_KEY_VIOLATION",
    DB_CONNECTION_ERROR: "DB_CONNECTION_ERROR",
    DB_QUERY_ERROR: "DB_QUERY_ERROR",
    DB_INSERT_ERROR: "DB_INSERT_ERROR",
    DB_UPDATE_ERROR: "DB_UPDATE_ERROR",
    // Business Logic
    BUSINESS_RULE_VIOLATION: "BUSINESS_RULE_VIOLATION",
    INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
    OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
    RESOURCE_LOCKED: "RESOURCE_LOCKED",
    RESOURCE_DELETED: "RESOURCE_DELETED",
    // External Services
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    SERVICE_TIMEOUT: "SERVICE_TIMEOUT",
    SERVICE_RATE_LIMIT: "SERVICE_RATE_LIMIT",
    SERVICE_INTEGRATION_ERROR: "SERVICE_INTEGRATION_ERROR",
    EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
    // File Operations
    FILE_NOT_FOUND: "FILE_NOT_FOUND",
    FILE_TOO_LARGE: "FILE_TOO_LARGE",
    FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
    FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
    // Payment & Financial
    PAYMENT_FAILED: "PAYMENT_FAILED",
    PAYMENT_DECLINED: "PAYMENT_DECLINED",
    PAYMENT_INSUFFICIENT_FUNDS: "PAYMENT_INSUFFICIENT_FUNDS",
    PAYMENT_INVALID_AMOUNT: "PAYMENT_INVALID_AMOUNT",
    PAYMENT_ALREADY_REFUNDED: "PAYMENT_ALREADY_REFUNDED",
    PAYMENT_CANNOT_REFUND: "PAYMENT_CANNOT_REFUND",
    // Generic
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    BAD_REQUEST: "BAD_REQUEST",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
    UNAUTHORIZED: "UNAUTHORIZED",
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    EXPIRED: "EXPIRED",
    VALIDATION_ERROR: "VALIDATION_ERROR"
};
class ActionError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code = ERROR_CODES.UNKNOWN_ERROR, statusCode = 400, details){
        super(message), this.code = code, this.statusCode = statusCode, this.details = details;
        this.name = "ActionError";
        // Maintains proper stack trace for where error was thrown (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ActionError);
        }
    }
    /**
	 * Convert error to a plain object suitable for API responses
	 */ toJSON() {
        return {
            success: false,
            error: this.message,
            code: this.code,
            statusCode: this.statusCode,
            ...this.details && {
                details: this.details
            }
        };
    }
    /**
	 * Create ActionError from unknown error
	 */ static fromUnknown(error) {
        if (error instanceof ActionError) {
            return error;
        }
        if (error instanceof Error) {
            return new ActionError(error.message, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
        }
        return new ActionError("An unexpected error occurred", ERROR_CODES.UNKNOWN_ERROR, 500);
    }
}
const ERROR_MESSAGES = {
    // Authentication
    unauthorized: ()=>"You must be logged in to perform this action",
    forbidden: (resource)=>`You don't have permission to access this ${resource}`,
    emailNotVerified: ()=>"Please verify your email before continuing",
    // Validation
    requiredField: (field)=>`${field} is required`,
    invalidFormat: (field)=>`${field} has an invalid format`,
    outOfRange: (field, min, max)=>`${field} must be between ${min} and ${max}`,
    // Database
    notFound: (resource)=>`${resource} not found`,
    alreadyExists: (resource)=>`${resource} already exists`,
    cannotDelete: (resource, reason)=>`Cannot delete ${resource}: ${reason}`,
    // Business Logic
    insufficientFunds: ()=>"Insufficient funds for this transaction",
    cannotRefund: (reason)=>`Cannot process refund: ${reason}`,
    resourceLocked: (resource)=>`${resource} is currently being modified by another user`,
    // Generic
    operationFailed: (operation)=>`Failed to ${operation}`,
    serviceUnavailable: (service)=>`${service} is currently unavailable`
};
}),
"[project]/apps/web/src/lib/errors/with-error-handling.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Error Handling Wrapper for Server Actions
 *
 * Provides consistent error handling, logging, and response formatting
 * for all Server Actions in the application.
 */ __turbopack_context__.s([
    "assertAuthenticated",
    ()=>assertAuthenticated,
    "assertExists",
    ()=>assertExists,
    "assertSupabase",
    ()=>assertSupabase,
    "withErrorHandling",
    ()=>withErrorHandling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/errors/action-error.ts [app-rsc] (ecmascript)");
;
;
;
async function withErrorHandling(fn) {
    try {
        const data = await fn();
        return {
            success: true,
            data
        };
    } catch (error) {
        // Handle ActionError (our custom errors)
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]) {
            // Log authorization errors as warnings since they're expected in some cases
            // (e.g., user not part of a company, insufficient permissions)
            const isExpectedAuthError = error.code === __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN || error.code === __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_UNAUTHORIZED;
            if (isExpectedAuthError) {
                // Only log in development, or as a warning
                if ("TURBOPACK compile-time truthy", 1) {
                    console.debug(`[Auth] Expected auth error: ${error.code} - ${error.message}`);
                }
            } else {
                console.error(`[Action Error] ${error.code}: ${error.message}`);
            }
            return {
                success: false,
                error: error.message,
                code: error.code,
                ...error.details && {
                    details: error.details
                }
            };
        }
        // Handle Zod validation errors
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ZodError"]) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation failed",
                code: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].VALIDATION_FAILED,
                details: {
                    issues: error.issues.map((issue)=>({
                            field: issue.path.join("."),
                            message: issue.message
                        }))
                }
            };
        }
        // Handle standard JavaScript errors
        if (error instanceof Error) {
            return {
                success: false,
                error: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable",
                code: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].INTERNAL_SERVER_ERROR
            };
        }
        return {
            success: false,
            error: "An unexpected error occurred",
            code: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].UNKNOWN_ERROR
        };
    }
}
/**
 * Create a success result
 *
 * Helper to create consistent success responses
 */ function successResult(data, message) {
    return {
        success: true,
        data,
        ...message && {
            message
        }
    };
}
/**
 * Create an error result
 *
 * Helper to create consistent error responses
 */ function errorResult(error, code, details) {
    return {
        success: false,
        error,
        ...code && {
            code
        },
        ...details && {
            details
        }
    };
}
function assertSupabase(supabase) {
    if (!supabase) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("Database connection failed", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_CONNECTION_ERROR, 500);
    }
}
function assertAuthenticated(userId) {
    if (!userId) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"]("You must be logged in to perform this action", __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_UNAUTHORIZED, 401);
    }
}
function assertExists(resource, resourceName) {
    if (!resource) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](`${resourceName} not found`, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].DB_RECORD_NOT_FOUND, 404);
    }
}
/**
 * Assert user has permission
 *
 * Helper to check permissions and throw ActionError if not authorized
 */ function assertPermission(hasPermission, resourceName) {
    if (!hasPermission) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ActionError"](`You don't have permission to access this ${resourceName}`, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$errors$2f$action$2d$error$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ERROR_CODES"].AUTH_FORBIDDEN, 403);
    }
}
}),
"[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Role Actions - Server Actions
 *
 * Server-side actions for role management and permission checks.
 * Uses Supabase RLS and database functions for security.
 */ /* __next_internal_action_entry_do_not_use__ [{"009c286914ac93fa18d3cac3814f6b0541c533da31":"getCurrentUserRole","409e41270103fb45f1105fb5721c09fb5921f7de6f":"canDeleteTeamMember"},"",""] */ __turbopack_context__.s([
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrentUserRole, "009c286914ac93fa18d3cac3814f6b0541c533da31", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(canDeleteTeamMember, "409e41270103fb45f1105fb5721c09fb5921f7de6f", null);
}),
"[project]/apps/web/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/apps/web/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "009c286914ac93fa18d3cac3814f6b0541c533da31",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUserRole"],
    "409e41270103fb45f1105fb5721c09fb5921f7de6f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canDeleteTeamMember"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$roles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/actions/roles.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_94cf0785._.js.map