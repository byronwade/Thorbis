module.exports = [
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
"[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00c33d6af75b179c3e5fb2a253ea5a10b9f9653dff":"runHealthCheckForAllDomains","407f3abd7521af716b17126cab115727d0f9d2d93c":"getDomainHealth","40872808aec1a4f1b129010a366e6a68870ce0df8d":"processResendWebhookEvent","409c8641fcd4f7b2db25c834d3da962a5bd66b4798":"getCompanyDomainsHealth","40b125991185ef24f09bd02dc43e2aa44f415f71f9":"generateDeliverabilityReport","40c65805cd77cf6cd7eae148fa7901b55f8b6c304b":"recordDeliveryEvent"},"",""] */ __turbopack_context__.s([
    "generateDeliverabilityReport",
    ()=>generateDeliverabilityReport,
    "getCompanyDomainsHealth",
    ()=>getCompanyDomainsHealth,
    "getDomainHealth",
    ()=>getDomainHealth,
    "processResendWebhookEvent",
    ()=>processResendWebhookEvent,
    "recordDeliveryEvent",
    ()=>recordDeliveryEvent,
    "runHealthCheckForAllDomains",
    ()=>runHealthCheckForAllDomains
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function recordDeliveryEvent(event) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Use the database function to update reputation
    const { error } = await supabase.rpc("update_domain_reputation", {
        p_domain_id: event.domainId,
        p_event_type: event.eventType
    });
    if (error) {
        console.error("Error recording delivery event:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function processResendWebhookEvent(webhookData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Map Resend event types to our event types
    const eventTypeMap = {
        "email.delivered": "delivered",
        "email.bounced": "bounced",
        "email.complained": "complained",
        "email.opened": "opened",
        "email.clicked": "clicked",
        // Soft bounces might come as delivery_delayed in some providers
        "email.delivery_delayed": "soft_bounce"
    };
    const eventType = eventTypeMap[webhookData.type];
    if (!eventType) {
        // Not a delivery event we track
        return {
            success: true
        };
    }
    // Extract domain from the "from" address
    const fromEmail = webhookData.data.from;
    if (!fromEmail) {
        return {
            success: true
        };
    }
    const domain = fromEmail.includes("@") ? fromEmail.split("@")[1] : fromEmail;
    // Look up the domain in our database
    const { data: domainRecord } = await supabase.from("company_email_domains").select("id").eq("domain_name", domain).maybeSingle();
    if (!domainRecord) {
        // Domain not found in our system
        return {
            success: true
        };
    }
    // Record the event
    return recordDeliveryEvent({
        domainId: domainRecord.id,
        eventType,
        emailId: webhookData.data.email_id,
        metadata: webhookData.data
    });
}
async function getDomainHealth(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("company_email_domains").select("id, domain_name, reputation_score, bounce_rate, total_emails_sent, hard_bounces, soft_bounces, spam_complaints, is_suspended, last_health_check").eq("id", domainId).single();
    if (error || !data) {
        return null;
    }
    const totalEvents = data.total_emails_sent + data.hard_bounces + data.soft_bounces;
    const bounceRate = totalEvents > 0 ? (data.hard_bounces + data.soft_bounces) / totalEvents * 100 : 0;
    const complaintRate = data.total_emails_sent > 0 ? data.spam_complaints / data.total_emails_sent * 100 : 0;
    const deliveryRate = totalEvents > 0 ? data.total_emails_sent / totalEvents * 100 : 100;
    let status = "healthy";
    if (data.is_suspended) {
        status = "suspended";
    } else if (data.reputation_score < 30 || bounceRate > 10 || complaintRate > 0.5) {
        status = "critical";
    } else if (data.reputation_score < 60 || bounceRate > 5 || complaintRate > 0.2) {
        status = "warning";
    }
    return {
        domainId: data.id,
        domain: data.domain_name,
        reputationScore: Number(data.reputation_score),
        bounceRate: Number(bounceRate.toFixed(2)),
        complaintRate: Number(complaintRate.toFixed(3)),
        deliveryRate: Number(deliveryRate.toFixed(2)),
        status,
        totalEmailsSent: data.total_emails_sent,
        hardBounces: data.hard_bounces,
        softBounces: data.soft_bounces,
        complaints: data.spam_complaints,
        lastHealthCheck: data.last_health_check
    };
}
async function getCompanyDomainsHealth(companyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("company_email_domains").select("id, domain_name, reputation_score, bounce_rate, total_emails_sent, hard_bounces, soft_bounces, spam_complaints, is_suspended, last_health_check").eq("company_id", companyId);
    if (error || !data) {
        return [];
    }
    return data.map((d)=>{
        const totalEvents = d.total_emails_sent + d.hard_bounces + d.soft_bounces;
        const bounceRate = totalEvents > 0 ? (d.hard_bounces + d.soft_bounces) / totalEvents * 100 : 0;
        const complaintRate = d.total_emails_sent > 0 ? d.spam_complaints / d.total_emails_sent * 100 : 0;
        const deliveryRate = totalEvents > 0 ? d.total_emails_sent / totalEvents * 100 : 100;
        let status = "healthy";
        if (d.is_suspended) {
            status = "suspended";
        } else if (d.reputation_score < 30 || bounceRate > 10 || complaintRate > 0.5) {
            status = "critical";
        } else if (d.reputation_score < 60 || bounceRate > 5 || complaintRate > 0.2) {
            status = "warning";
        }
        return {
            domainId: d.id,
            domain: d.domain_name,
            reputationScore: Number(d.reputation_score),
            bounceRate: Number(bounceRate.toFixed(2)),
            complaintRate: Number(complaintRate.toFixed(3)),
            deliveryRate: Number(deliveryRate.toFixed(2)),
            status,
            totalEmailsSent: d.total_emails_sent,
            hardBounces: d.hard_bounces,
            softBounces: d.soft_bounces,
            complaints: d.spam_complaints,
            lastHealthCheck: d.last_health_check
        };
    });
}
async function runHealthCheckForAllDomains() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get all active domains
    const { data: domains } = await supabase.from("company_email_domains").select("id, reputation_score, hard_bounces, soft_bounces, spam_complaints, total_emails_sent").eq("is_suspended", false);
    if (!domains) {
        return {
            checked: 0,
            suspended: 0,
            warnings: 0
        };
    }
    let suspended = 0;
    let warnings = 0;
    for (const domain of domains){
        const totalEvents = domain.total_emails_sent + domain.hard_bounces + domain.soft_bounces;
        const bounceRate = totalEvents > 100 ? (domain.hard_bounces + domain.soft_bounces) / totalEvents * 100 : 0;
        const complaintRate = domain.total_emails_sent > 100 ? domain.spam_complaints / domain.total_emails_sent * 100 : 0;
        // Auto-suspend if reputation is critical
        if (domain.reputation_score < 20 || bounceRate > 15 || complaintRate > 1) {
            await supabase.from("company_email_domains").update({
                is_suspended: true,
                suspension_reason: `Auto-suspended: Reputation ${domain.reputation_score}, Bounce rate ${bounceRate.toFixed(1)}%, Complaint rate ${complaintRate.toFixed(2)}%`,
                suspended_at: new Date().toISOString(),
                last_health_check: new Date().toISOString()
            }).eq("id", domain.id);
            suspended++;
        } else if (domain.reputation_score < 50 || bounceRate > 8 || complaintRate > 0.3) {
            // Update health check timestamp for warning domains
            await supabase.from("company_email_domains").update({
                last_health_check: new Date().toISOString()
            }).eq("id", domain.id);
            warnings++;
        } else {
            // Healthy, just update timestamp
            await supabase.from("company_email_domains").update({
                last_health_check: new Date().toISOString()
            }).eq("id", domain.id);
        }
    }
    return {
        checked: domains.length,
        suspended,
        warnings
    };
}
async function generateDeliverabilityReport(domainId) {
    const health = await getDomainHealth(domainId);
    if (!health) {
        return null;
    }
    const recommendations = [];
    if (health.bounceRate > 5) {
        recommendations.push("High bounce rate detected. Clean your email list and remove invalid addresses.");
    }
    if (health.complaintRate > 0.1) {
        recommendations.push("Spam complaints detected. Ensure recipients have opted in and make unsubscribe easy.");
    }
    if (health.reputationScore < 70) {
        recommendations.push("Reputation score is below optimal. Reduce sending volume temporarily and focus on engagement.");
    }
    if (health.status === "warning" || health.status === "critical") {
        recommendations.push("Domain health is degraded. Review your email content and sending practices.");
    }
    if (recommendations.length === 0) {
        recommendations.push("Domain health is good. Continue monitoring and maintain current practices.");
    }
    return {
        domain: health.domain,
        period: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
        },
        metrics: {
            totalSent: health.totalEmailsSent,
            delivered: health.totalEmailsSent - health.hardBounces,
            bounced: health.hardBounces + health.softBounces,
            complained: health.complaints,
            deliveryRate: health.deliveryRate,
            bounceRate: health.bounceRate,
            complaintRate: health.complaintRate
        },
        reputation: {
            current: health.reputationScore,
            change: 0,
            status: health.status
        },
        recommendations
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    recordDeliveryEvent,
    processResendWebhookEvent,
    getDomainHealth,
    getCompanyDomainsHealth,
    runHealthCheckForAllDomains,
    generateDeliverabilityReport
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordDeliveryEvent, "40c65805cd77cf6cd7eae148fa7901b55f8b6c304b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(processResendWebhookEvent, "40872808aec1a4f1b129010a366e6a68870ce0df8d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDomainHealth, "407f3abd7521af716b17126cab115727d0f9d2d93c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyDomainsHealth, "409c8641fcd4f7b2db25c834d3da962a5bd66b4798", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(runHealthCheckForAllDomains, "00c33d6af75b179c3e5fb2a253ea5a10b9f9653dff", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generateDeliverabilityReport, "40b125991185ef24f09bd02dc43e2aa44f415f71f9", null);
}),
"[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Types - Type definitions for email templates
 *
 * Features:
 * - Type-safe email data
 * - Template props interfaces
 * - Email send result types
 * - Validation schemas
 */ __turbopack_context__.s([
    "EmailTemplate",
    ()=>EmailTemplate,
    "emailSendSchema",
    ()=>emailSendSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
// Validation Schemas
const emailAddressSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address").min(1, "Email is required");
const emailSendSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        emailAddressSchema,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(emailAddressSchema)
    ]),
    subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Subject is required").max(200),
    replyTo: emailAddressSchema.optional()
});
var EmailTemplate = /*#__PURE__*/ function(EmailTemplate) {
    // Auth
    EmailTemplate["WELCOME"] = "welcome";
    EmailTemplate["EMAIL_VERIFICATION"] = "email-verification";
    EmailTemplate["PASSWORD_RESET"] = "password-reset";
    EmailTemplate["PASSWORD_CHANGED"] = "password-changed";
    EmailTemplate["MAGIC_LINK"] = "magic-link";
    // Jobs
    EmailTemplate["JOB_CONFIRMATION"] = "job-confirmation";
    EmailTemplate["APPOINTMENT_REMINDER"] = "appointment-reminder";
    EmailTemplate["TECH_EN_ROUTE"] = "tech-en-route";
    EmailTemplate["JOB_COMPLETE"] = "job-complete";
    // Billing
    EmailTemplate["INVOICE"] = "invoice";
    EmailTemplate["ESTIMATE"] = "estimate";
    EmailTemplate["INVOICE_SENT"] = "invoice-sent";
    EmailTemplate["PAYMENT_RECEIVED"] = "payment-received";
    EmailTemplate["PAYMENT_REMINDER"] = "payment-reminder";
    EmailTemplate["ESTIMATE_SENT"] = "estimate-sent";
    // Customer
    EmailTemplate["REVIEW_REQUEST"] = "review-request";
    EmailTemplate["SERVICE_REMINDER"] = "service-reminder";
    EmailTemplate["WELCOME_CUSTOMER"] = "welcome-customer";
    EmailTemplate["PORTAL_INVITATION"] = "portal-invitation";
    // Team
    EmailTemplate["TEAM_INVITATION"] = "team-invitation";
    // Onboarding & Verification
    EmailTemplate["VERIFICATION_SUBMITTED"] = "verification-submitted";
    EmailTemplate["VERIFICATION_COMPLETE"] = "verification-complete";
    // Waitlist
    EmailTemplate["WAITLIST_SUBSCRIPTION"] = "waitlist-subscription";
    EmailTemplate["WAITLIST_ADMIN_NOTIFICATION"] = "waitlist-admin-notification";
    // Generic
    EmailTemplate["GENERIC"] = "generic";
    return EmailTemplate;
}({});
}),
"[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToGlobalBounceList",
    ()=>addToGlobalBounceList,
    "addToSuppressionList",
    ()=>addToSuppressionList,
    "calculateSpamScore",
    ()=>calculateSpamScore,
    "checkDomainWarmup",
    ()=>checkDomainWarmup,
    "checkSuppressionList",
    ()=>checkSuppressionList,
    "getSuppressionList",
    ()=>getSuppressionList,
    "removeFromSuppressionList",
    ()=>removeFromSuppressionList,
    "runPreSendChecks",
    ()=>runPreSendChecks,
    "verifyDomainStatus",
    ()=>verifyDomainStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
;
// Spam trigger words and patterns
const SPAM_TRIGGERS = {
    urgency: [
        "act now",
        "limited time",
        "urgent",
        "immediate",
        "expires",
        "hurry",
        "don't miss",
        "last chance",
        "final notice",
        "deadline"
    ],
    money: [
        "free",
        "$$$",
        "cash",
        "discount",
        "save big",
        "best price",
        "cheap",
        "bargain",
        "bonus",
        "prize",
        "winner",
        "congratulations"
    ],
    suspicious: [
        "click here",
        "click below",
        "buy now",
        "order now",
        "subscribe now",
        "sign up free",
        "no obligation",
        "risk free",
        "100% free",
        "act immediately"
    ],
    formatting: [
        "ALL CAPS WORDS",
        "!!!",
        "???",
        "$$$",
        "***",
        "###"
    ]
};
// Weight multipliers for spam scoring
const SPAM_WEIGHTS = {
    urgency: 2,
    money: 3,
    suspicious: 4,
    formatting: 1.5,
    excessiveLinks: 5,
    noUnsubscribe: 3,
    shortContent: 2,
    imageHeavy: 3
};
async function checkSuppressionList(companyId, recipientEmails) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const results = new Map();
    // Initialize all as not suppressed
    for (const email of recipientEmails){
        results.set(email.toLowerCase(), {
            suppressed: false
        });
    }
    // Check suppression list
    const { data: suppressions } = await supabase.from("email_suppressions").select("email, reason, created_at").eq("company_id", companyId).in("email", recipientEmails.map((e)=>e.toLowerCase()));
    if (suppressions) {
        for (const suppression of suppressions){
            results.set(suppression.email, {
                suppressed: true,
                reason: suppression.reason,
                suppressedAt: suppression.created_at
            });
        }
    }
    // Also check global hard bounces (cross-company)
    const { data: globalBounces } = await supabase.from("email_global_bounces").select("email, bounce_type, created_at").in("email", recipientEmails.map((e)=>e.toLowerCase())).eq("bounce_type", "hard");
    if (globalBounces) {
        for (const bounce of globalBounces){
            const existing = results.get(bounce.email);
            if (!existing?.suppressed) {
                results.set(bounce.email, {
                    suppressed: true,
                    reason: `Global hard bounce: ${bounce.bounce_type}`,
                    suppressedAt: bounce.created_at
                });
            }
        }
    }
    return results;
}
function calculateSpamScore(subject, htmlContent, textContent, hasUnsubscribeLink) {
    let score = 0;
    const issues = [];
    const fullText = `${subject} ${textContent}`.toLowerCase();
    const htmlLower = htmlContent.toLowerCase();
    // Check spam trigger words
    for (const [category, words] of Object.entries(SPAM_TRIGGERS)){
        const weight = SPAM_WEIGHTS[category] || 1;
        for (const word of words){
            const regex = new RegExp(word.toLowerCase(), "gi");
            const matches = fullText.match(regex);
            if (matches) {
                score += matches.length * weight;
                if (matches.length > 1) {
                    issues.push(`Contains "${word}" ${matches.length} times`);
                }
            }
        }
    }
    // Check for ALL CAPS in subject
    const capsWords = subject.split(" ").filter((w)=>w.length > 3 && w === w.toUpperCase());
    if (capsWords.length > 0) {
        score += capsWords.length * 3;
        issues.push(`Subject contains ${capsWords.length} ALL CAPS words`);
    }
    // Check excessive punctuation
    const exclamations = (subject.match(/!/g) || []).length;
    if (exclamations > 1) {
        score += exclamations * 2;
        issues.push(`Excessive exclamation marks in subject (${exclamations})`);
    }
    // Check link density
    const links = (htmlLower.match(/<a\s/gi) || []).length;
    const wordCount = textContent.split(/\s+/).length;
    if (wordCount > 0 && links / wordCount > 0.1) {
        score += SPAM_WEIGHTS.excessiveLinks;
        issues.push(`High link density (${links} links in ${wordCount} words)`);
    }
    // Check image-to-text ratio
    const images = (htmlLower.match(/<img\s/gi) || []).length;
    if (images > 0 && textContent.length < 200) {
        score += SPAM_WEIGHTS.imageHeavy;
        issues.push("Image-heavy email with little text");
    }
    // Check for unsubscribe link
    if (!hasUnsubscribeLink) {
        score += SPAM_WEIGHTS.noUnsubscribe;
        issues.push("Missing unsubscribe link (required for marketing emails)");
    }
    // Check content length (very short emails look suspicious)
    if (textContent.length < 50) {
        score += SPAM_WEIGHTS.shortContent;
        issues.push("Very short email content");
    }
    // Check for suspicious patterns
    if (htmlLower.includes("display:none") || htmlLower.includes("font-size:0")) {
        score += 10;
        issues.push("Contains hidden text (spam technique)");
    }
    // Check for deceptive link text
    const deceptiveLinkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    let match;
    while((match = deceptiveLinkPattern.exec(htmlContent)) !== null){
        const href = match[1].toLowerCase();
        const text = match[2].toLowerCase();
        if (text.includes("click here") || text.includes("click this") || text.startsWith("http") && !text.includes(new URL(href).hostname)) {
            score += 5;
            issues.push("Contains deceptive or vague link text");
            break;
        }
    }
    return {
        score: Math.min(score, 100),
        issues
    };
}
async function checkDomainWarmup(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data: domain } = await supabase.from("company_email_domains").select("created_at, emails_sent_today, total_emails_sent, warmup_completed").eq("id", domainId).single();
    if (!domain) {
        return {
            inWarmup: true,
            daysSinceCreation: 0,
            recommendedDailyLimit: 10,
            currentDaySent: 0,
            suggestions: [
                "Domain not found"
            ]
        };
    }
    const createdAt = new Date(domain.created_at);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    // Warm-up schedule (days -> max emails per day)
    // Gradual increase over 4-6 weeks for best deliverability
    const warmupSchedule = {
        0: 20,
        2: 50,
        4: 100,
        7: 200,
        14: 500,
        21: 1000,
        28: 2500,
        35: 5000,
        42: 10000
    };
    let recommendedLimit = 20;
    for (const [day, limit] of Object.entries(warmupSchedule)){
        if (daysSinceCreation >= parseInt(day)) {
            recommendedLimit = limit;
        }
    }
    const inWarmup = daysSinceCreation < 42 && !domain.warmup_completed;
    const suggestions = [];
    if (inWarmup) {
        suggestions.push(`Domain is in warm-up period (day ${daysSinceCreation}/42). Recommended daily limit: ${recommendedLimit} emails.`);
        if (domain.emails_sent_today >= recommendedLimit * 0.8) {
            suggestions.push("Approaching daily warm-up limit. Consider spreading sends across multiple days.");
        }
    }
    return {
        inWarmup,
        daysSinceCreation,
        recommendedDailyLimit: recommendedLimit,
        currentDaySent: domain.emails_sent_today || 0,
        suggestions
    };
}
async function verifyDomainStatus(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data: domain } = await supabase.from("company_email_domains").select("status, is_suspended, sending_enabled, spf_verified, dkim_verified, dmarc_verified").eq("id", domainId).single();
    if (!domain) {
        return {
            canSend: false,
            issues: [
                "Domain not found"
            ],
            dnsStatus: {
                spf: false,
                dkim: false,
                dmarc: false
            }
        };
    }
    const issues = [];
    if (domain.status !== "verified") {
        issues.push(`Domain not verified (status: ${domain.status})`);
    }
    if (domain.is_suspended) {
        issues.push("Domain is suspended");
    }
    if (!domain.sending_enabled) {
        issues.push("Sending is disabled for this domain");
    }
    if (!domain.spf_verified) {
        issues.push("SPF record not verified - emails may fail authentication");
    }
    if (!domain.dkim_verified) {
        issues.push("DKIM not verified - emails may fail authentication");
    }
    if (!domain.dmarc_verified) {
        issues.push("DMARC not configured - reduces deliverability");
    }
    return {
        canSend: issues.length === 0,
        issues,
        dnsStatus: {
            spf: domain.spf_verified || false,
            dkim: domain.dkim_verified || false,
            dmarc: domain.dmarc_verified || false
        }
    };
}
async function runPreSendChecks(companyId, domainId, recipientEmails, subject, htmlContent, textContent, isMarketingEmail = false) {
    const warnings = [];
    const errors = [];
    const suggestions = [];
    // 1. Check domain status
    const domainStatus = await verifyDomainStatus(domainId);
    if (!domainStatus.canSend) {
        errors.push(...domainStatus.issues);
    } else {
        // Add warnings for missing DNS records
        if (!domainStatus.dnsStatus.dmarc) {
            warnings.push("DMARC not configured - consider adding for better deliverability");
        }
    }
    // 2. Check suppression list
    const suppressions = await checkSuppressionList(companyId, recipientEmails);
    const recipientStatus = [];
    let suppressedCount = 0;
    for (const [email, status] of suppressions){
        recipientStatus.push({
            email,
            suppressed: status.suppressed,
            reason: status.reason
        });
        if (status.suppressed) {
            suppressedCount++;
        }
    }
    if (suppressedCount > 0) {
        warnings.push(`${suppressedCount} recipient(s) on suppression list and will be skipped`);
    }
    if (suppressedCount === recipientEmails.length) {
        errors.push("All recipients are on suppression list - no emails will be sent");
    }
    // 3. Calculate spam score
    const hasUnsubscribe = htmlContent.includes("unsubscribe") || htmlContent.includes("List-Unsubscribe");
    const spamAnalysis = calculateSpamScore(subject, htmlContent, textContent, hasUnsubscribe || !isMarketingEmail);
    if (spamAnalysis.score >= 60) {
        errors.push(`High spam score (${spamAnalysis.score}/100) - email likely to be filtered`);
        errors.push(...spamAnalysis.issues);
    } else if (spamAnalysis.score >= 30) {
        warnings.push(`Moderate spam score (${spamAnalysis.score}/100) - consider improvements`);
        warnings.push(...spamAnalysis.issues);
    }
    // 4. Check warm-up status
    const warmupStatus = await checkDomainWarmup(domainId);
    if (warmupStatus.inWarmup) {
        suggestions.push(...warmupStatus.suggestions);
        const activeRecipients = recipientEmails.length - suppressedCount;
        const remainingCapacity = warmupStatus.recommendedDailyLimit - warmupStatus.currentDaySent;
        if (activeRecipients > remainingCapacity) {
            warnings.push(`Sending ${activeRecipients} emails exceeds warm-up limit (${remainingCapacity} remaining today). ` + `Consider sending over multiple days.`);
        }
    }
    // 5. Content-specific suggestions
    if (!htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
        suggestions.push("Consider using proper HTML structure with DOCTYPE for better rendering");
    }
    if (textContent.length < 100) {
        suggestions.push("Consider adding more text content - very short emails may look suspicious");
    }
    if (isMarketingEmail && !hasUnsubscribe) {
        errors.push("Marketing emails MUST include an unsubscribe link (CAN-SPAM requirement)");
    }
    // Check for personalization
    if (!htmlContent.includes("{{") && !htmlContent.includes("{name}") && !subject.includes("{{")) {
        suggestions.push("Consider adding personalization (recipient name, company) for better engagement");
    }
    return {
        allowed: errors.length === 0,
        warnings,
        errors,
        suggestions,
        spamScore: spamAnalysis.score,
        recipientStatus
    };
}
async function addToSuppressionList(companyId, email, reason, details) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("email_suppressions").upsert({
        company_id: companyId,
        email: email.toLowerCase(),
        reason,
        details,
        created_at: new Date().toISOString()
    }, {
        onConflict: "company_id,email"
    });
    if (error) {
        console.error("Error adding to suppression list:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function addToGlobalBounceList(email, bounceType, bounceReason) {
    // Only track hard bounces globally
    if (bounceType !== "hard") {
        return {
            success: true
        };
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("email_global_bounces").upsert({
        email: email.toLowerCase(),
        bounce_type: bounceType,
        bounce_reason: bounceReason,
        bounce_count: 1,
        last_bounce_at: new Date().toISOString(),
        created_at: new Date().toISOString()
    }, {
        onConflict: "email"
    });
    if (error) {
        console.error("Error adding to global bounce list:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function removeFromSuppressionList(companyId, email) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("email_suppressions").delete().eq("company_id", companyId).eq("email", email.toLowerCase());
    if (error) {
        console.error("Error removing from suppression list:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function getSuppressionList(companyId, limit = 100, offset = 0) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, count, error } = await supabase.from("email_suppressions").select("email, reason, details, created_at", {
        count: "exact"
    }).eq("company_id", companyId).order("created_at", {
        ascending: false
    }).range(offset, offset + limit - 1);
    if (error) {
        console.error("Error fetching suppression list:", error);
        return {
            data: [],
            total: 0
        };
    }
    return {
        data: data || [],
        total: count || 0
    };
}
}),
"[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Rate Limiter
 *
 * Implements per-domain rate limiting for email sending to:
 * - Prevent spam/abuse
 * - Protect domain reputation
 * - Enforce plan-based limits
 * - Track daily/hourly email quotas
 */ /* __next_internal_action_entry_do_not_use__ [{"0020a1d15ae77f64582de2c225d74b37bc9b2a8829":"resetHourlyCounters","00465270d3bffebed3c4f6194507dd54b9dddb7ac3":"resetDailyCounters","403e591ad4fb452eef9adfd77242abc86364b2744d":"incrementEmailCounter","4061912faba61aa4780a560a519048767cb9ddc45c":"getCompanyActiveDomain","40eb9b5dc8fc719648117169eca131590fddc21657":"checkRateLimit"},"",""] */ __turbopack_context__.s([
    "checkRateLimit",
    ()=>checkRateLimit,
    "getCompanyActiveDomain",
    ()=>getCompanyActiveDomain,
    "incrementEmailCounter",
    ()=>incrementEmailCounter,
    "resetDailyCounters",
    ()=>resetDailyCounters,
    "resetHourlyCounters",
    ()=>resetHourlyCounters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
// =============================================================================
// RATE LIMIT CONFIGURATION
// =============================================================================
// Default rate limits (can be overridden per domain/plan)
const DEFAULT_LIMITS = {
    daily: 1000,
    hourly: 100,
    perMinute: 10
};
// In-memory cache for rate limit tracking (resets on server restart)
// For production, use Redis or database counters
const rateLimitCache = new Map();
async function getCompanyActiveDomain(companyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Query for the active sending domain
    const { data: domain, error } = await supabase.from("company_email_domains").select(`
			id,
			domain_name,
			reply_to_email,
			daily_limit,
			hourly_limit,
			emails_sent_today,
			emails_sent_this_hour,
			is_platform_subdomain
		`).eq("company_id", companyId).eq("status", "verified").eq("sending_enabled", true).eq("is_suspended", false).order("is_platform_subdomain", {
        ascending: true
    }) // Custom domains first
    .order("created_at", {
        ascending: false
    }).maybeSingle();
    if (error) {
        console.error("Error fetching company email domain:", error);
        return null;
    }
    if (!domain) {
        return null;
    }
    return {
        domainId: domain.id,
        domain: domain.domain_name,
        replyToEmail: domain.reply_to_email,
        dailyLimit: domain.daily_limit || DEFAULT_LIMITS.daily,
        hourlyLimit: domain.hourly_limit || DEFAULT_LIMITS.hourly,
        emailsSentToday: domain.emails_sent_today || 0,
        emailsSentThisHour: domain.emails_sent_this_hour || 0
    };
}
async function checkRateLimit(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get current domain stats
    const { data: domain, error } = await supabase.from("company_email_domains").select(`
			daily_limit,
			hourly_limit,
			emails_sent_today,
			emails_sent_this_hour,
			is_suspended,
			daily_limit_reset_at,
			hourly_limit_reset_at
		`).eq("id", domainId).single();
    if (error || !domain) {
        return {
            allowed: false,
            reason: "Domain not found or error fetching limits"
        };
    }
    // Check if domain is suspended
    if (domain.is_suspended) {
        return {
            allowed: false,
            reason: "Domain is suspended due to reputation issues"
        };
    }
    const dailyLimit = domain.daily_limit || DEFAULT_LIMITS.daily;
    const hourlyLimit = domain.hourly_limit || DEFAULT_LIMITS.hourly;
    const emailsSentToday = domain.emails_sent_today || 0;
    const emailsSentThisHour = domain.emails_sent_this_hour || 0;
    // Check daily limit
    if (emailsSentToday >= dailyLimit) {
        return {
            allowed: false,
            reason: `Daily email limit reached (${dailyLimit} emails/day)`,
            remaining: 0,
            resetAt: domain.daily_limit_reset_at || getNextMidnightUTC()
        };
    }
    // Check hourly limit
    if (emailsSentThisHour >= hourlyLimit) {
        return {
            allowed: false,
            reason: `Hourly email limit reached (${hourlyLimit} emails/hour)`,
            remaining: 0,
            resetAt: domain.hourly_limit_reset_at || getNextHourUTC()
        };
    }
    // Check per-minute limit (in-memory)
    const minuteKey = `${domainId}:minute`;
    const minuteWindow = getMinuteWindow();
    const minuteCache = rateLimitCache.get(minuteKey);
    if (minuteCache && minuteCache.windowStart === minuteWindow) {
        if (minuteCache.count >= DEFAULT_LIMITS.perMinute) {
            return {
                allowed: false,
                reason: `Rate limit: Too many emails per minute (${DEFAULT_LIMITS.perMinute}/min)`,
                remaining: 0
            };
        }
    }
    return {
        allowed: true,
        remaining: Math.min(dailyLimit - emailsSentToday, hourlyLimit - emailsSentThisHour)
    };
}
async function incrementEmailCounter(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Use a database function for atomic increment and validation
    // This prevents race conditions in high-concurrency scenarios
    const { data, error } = await supabase.rpc("increment_email_counter", {
        p_domain_id: domainId
    });
    if (error) {
        // If the RPC doesn't exist, fall back to manual increment
        if (error.code === "PGRST202" || error.message.includes("function")) {
            return await incrementEmailCounterFallback(domainId);
        }
        console.error("Error incrementing email counter:", error);
        return {
            allowed: false,
            reason: error.message
        };
    }
    // Handle RPC result
    if (data && typeof data === "object") {
        const result = data;
        return {
            allowed: result.allowed,
            reason: result.reason,
            remaining: result.remaining
        };
    }
    // Default: allowed if no error
    return {
        allowed: true
    };
}
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
/**
 * Fallback increment method when RPC function doesn't exist
 */ async function incrementEmailCounterFallback(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get current counts
    const { data: domain, error: fetchError } = await supabase.from("company_email_domains").select("emails_sent_today, emails_sent_this_hour, daily_limit, hourly_limit").eq("id", domainId).single();
    if (fetchError || !domain) {
        return {
            allowed: false,
            reason: "Domain not found"
        };
    }
    const dailyLimit = domain.daily_limit || DEFAULT_LIMITS.daily;
    const hourlyLimit = domain.hourly_limit || DEFAULT_LIMITS.hourly;
    // Check limits before incrementing
    if ((domain.emails_sent_today || 0) >= dailyLimit) {
        return {
            allowed: false,
            reason: "Daily limit reached"
        };
    }
    if ((domain.emails_sent_this_hour || 0) >= hourlyLimit) {
        return {
            allowed: false,
            reason: "Hourly limit reached"
        };
    }
    // Increment counters
    const { error: updateError } = await supabase.from("company_email_domains").update({
        emails_sent_today: (domain.emails_sent_today || 0) + 1,
        emails_sent_this_hour: (domain.emails_sent_this_hour || 0) + 1
    }).eq("id", domainId);
    if (updateError) {
        console.error("Error updating email counters:", updateError);
        return {
            allowed: false,
            reason: updateError.message
        };
    }
    // Update in-memory per-minute counter
    const minuteKey = `${domainId}:minute`;
    const minuteWindow = getMinuteWindow();
    const minuteCache = rateLimitCache.get(minuteKey);
    if (minuteCache && minuteCache.windowStart === minuteWindow) {
        minuteCache.count++;
    } else {
        rateLimitCache.set(minuteKey, {
            count: 1,
            windowStart: minuteWindow
        });
    }
    return {
        allowed: true,
        remaining: Math.min(dailyLimit - (domain.emails_sent_today || 0) - 1, hourlyLimit - (domain.emails_sent_this_hour || 0) - 1)
    };
}
/**
 * Get the current minute window (for per-minute rate limiting)
 */ function getMinuteWindow() {
    return Math.floor(Date.now() / 60000);
}
/**
 * Get the next midnight UTC timestamp
 */ function getNextMidnightUTC() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}
/**
 * Get the next hour UTC timestamp
 */ function getNextHourUTC() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setUTCHours(nextHour.getUTCHours() + 1, 0, 0, 0);
    return nextHour.toISOString();
}
async function resetDailyCounters() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("company_email_domains").update({
        emails_sent_today: 0,
        daily_limit_reset_at: getNextMidnightUTC()
    }).neq("id", ""); // Update all rows
    if (error) {
        console.error("Error resetting daily counters:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function resetHourlyCounters() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("company_email_domains").update({
        emails_sent_this_hour: 0,
        hourly_limit_reset_at: getNextHourUTC()
    }).neq("id", ""); // Update all rows
    if (error) {
        console.error("Error resetting hourly counters:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCompanyActiveDomain,
    checkRateLimit,
    incrementEmailCounter,
    resetDailyCounters,
    resetHourlyCounters
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyActiveDomain, "4061912faba61aa4780a560a519048767cb9ddc45c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkRateLimit, "40eb9b5dc8fc719648117169eca131590fddc21657", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(incrementEmailCounter, "403e591ad4fb452eef9adfd77242abc86364b2744d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetDailyCounters, "00465270d3bffebed3c4f6194507dd54b9dddb7ac3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetHourlyCounters, "0020a1d15ae77f64582de2c225d74b37bc9b2a8829", null);
}),
"[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resend Client - Email Service Configuration
 *
 * Features:
 * - Singleton Resend client instance
 * - Environment-based configuration
 * - Type-safe email sending
 * - Development mode support (logs instead of sending)
 */ __turbopack_context__.s([
    "emailConfig",
    ()=>emailConfig,
    "isResendConfigured",
    ()=>isResendConfigured,
    "resend",
    ()=>resend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$4$2e$2_$40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/resend@6.4.2_@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0_/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript)");
;
const requiredSiteUrl = ("TURBOPACK compile-time value", "http://localhost:3000");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const resend = process.env.RESEND_API_KEY ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$4$2e$2_$40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY) : null;
const emailConfig = {
    from: `${process.env.RESEND_FROM_NAME || "Thorbis"} <${process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com"}>`,
    // Enable production mode if RESEND_API_KEY is configured, even in development
    isDevelopment: !process.env.RESEND_API_KEY || ("TURBOPACK compile-time value", "development") === "development" && !process.env.RESEND_API_KEY,
    siteUrl: requiredSiteUrl,
    appUrl: ("TURBOPACK compile-time value", "http://localhost:3000") || requiredSiteUrl
};
function isResendConfigured() {
    if (!resend) {
        return false;
    }
    return true;
}
}),
"[project]/apps/web/src/lib/email/postmark-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Postmark Email Client
 *
 * This module provides integration with Postmark as a fallback email provider.
 * Postmark is known for excellent deliverability and is used when Resend fails.
 *
 * Features:
 * - Email sending with automatic retry
 * - Domain/sender signature management
 * - Webhook signature verification
 * - Delivery status tracking
 *
 * Environment Variables Required:
 * - POSTMARK_API_KEY: Your Postmark server API token
 * - POSTMARK_WEBHOOK_SECRET: Secret for verifying webhook signatures (optional)
 *
 * @see https://postmarkapp.com/developer
 */ __turbopack_context__.s([
    "checkPostmarkHealth",
    ()=>checkPostmarkHealth,
    "createPostmarkDomain",
    ()=>createPostmarkDomain,
    "deletePostmarkDomain",
    ()=>deletePostmarkDomain,
    "getPostmarkDNSRecords",
    ()=>getPostmarkDNSRecords,
    "getPostmarkDomain",
    ()=>getPostmarkDomain,
    "getPostmarkServerInfo",
    ()=>getPostmarkServerInfo,
    "isPostmarkConfigured",
    ()=>isPostmarkConfigured,
    "listPostmarkDomains",
    ()=>listPostmarkDomains,
    "postmarkConfig",
    ()=>postmarkConfig,
    "resendPostmarkConfirmation",
    ()=>resendPostmarkConfirmation,
    "sendPostmarkBatchEmails",
    ()=>sendPostmarkBatchEmails,
    "sendPostmarkEmail",
    ()=>sendPostmarkEmail,
    "verifyPostmarkDKIM",
    ()=>verifyPostmarkDKIM,
    "verifyPostmarkReturnPath",
    ()=>verifyPostmarkReturnPath,
    "verifyPostmarkWebhook",
    ()=>verifyPostmarkWebhook
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
// =============================================================================
// CONFIGURATION
// =============================================================================
const POSTMARK_API_BASE = "https://api.postmarkapp.com";
const postmarkConfig = {
    apiKey: process.env.POSTMARK_API_KEY || "",
    webhookSecret: process.env.POSTMARK_WEBHOOK_SECRET || "",
    // Default "from" address for Postmark (must be verified sender signature)
    from: process.env.POSTMARK_FROM_EMAIL || process.env.EMAIL_FROM || "notifications@stratos.app",
    // Is Postmark configured and ready to use?
    isConfigured: !!process.env.POSTMARK_API_KEY,
    // Provider name for logging/monitoring
    providerName: "postmark"
};
// =============================================================================
// API REQUEST HELPER
// =============================================================================
/**
 * Makes authenticated requests to Postmark API
 *
 * @param path - API endpoint path (e.g., "/email")
 * @param init - Fetch request options
 * @returns Typed response with success/error handling
 *
 * @example
 * const result = await postmarkRequest<PostmarkSendResponse>("/email", {
 *   method: "POST",
 *   body: JSON.stringify(emailData),
 * });
 */ async function postmarkRequest(path, init) {
    // Check if Postmark is configured
    if (!postmarkConfig.apiKey) {
        return {
            success: false,
            error: "Postmark API key is not configured. Set POSTMARK_API_KEY environment variable."
        };
    }
    try {
        const response = await fetch(`${POSTMARK_API_BASE}${path}`, {
            ...init,
            headers: {
                // Postmark uses X-Postmark-Server-Token for authentication
                "X-Postmark-Server-Token": postmarkConfig.apiKey,
                "Content-Type": "application/json",
                Accept: "application/json",
                ...init.headers
            }
        });
        // Parse response body
        const body = await response.json().catch(()=>({}));
        // Handle non-OK responses
        if (!response.ok) {
            return {
                success: false,
                error: body.Message || body.message || response.statusText,
                errorCode: body.ErrorCode
            };
        }
        return {
            success: true,
            data: body
        };
    } catch (error) {
        // Network or parsing error
        return {
            success: false,
            error: error instanceof Error ? error.message : "Postmark request failed"
        };
    }
}
async function sendPostmarkEmail(options) {
    const { to, subject, html, text, from = postmarkConfig.from, replyTo, tag, trackOpens = true, trackLinks = true, metadata, messageStream = "outbound" } = options;
    // Postmark requires single recipient per request for /email endpoint
    // For multiple recipients, we'd use /email/batch
    const recipient = Array.isArray(to) ? to.join(", ") : to;
    const request = {
        From: from,
        To: recipient,
        Subject: subject,
        HtmlBody: html,
        TextBody: text,
        ReplyTo: replyTo,
        Tag: tag,
        TrackOpens: trackOpens,
        TrackLinks: trackLinks ? "HtmlAndText" : "None",
        MessageStream: messageStream,
        Metadata: metadata
    };
    // Log send attempt for monitoring
    console.log(`[Postmark] Sending email to ${recipient}, subject: "${subject}"`);
    const result = await postmarkRequest("/email", {
        method: "POST",
        body: JSON.stringify(request)
    });
    // Log result for monitoring
    if (result.success) {
        console.log(`[Postmark] Email sent successfully, MessageID: ${result.data.MessageID}`);
    } else {
        console.error(`[Postmark] Email send failed: ${result.error}`);
    }
    return result;
}
async function sendPostmarkBatchEmails(emails) {
    if (emails.length > 500) {
        return {
            success: false,
            error: "Postmark batch limit is 500 emails per request"
        };
    }
    const requests = emails.map((email)=>({
            From: email.from || postmarkConfig.from,
            To: email.to,
            Subject: email.subject,
            HtmlBody: email.html,
            TextBody: email.text,
            ReplyTo: email.replyTo,
            Tag: email.tag,
            TrackOpens: true,
            TrackLinks: "HtmlAndText",
            Metadata: email.metadata
        }));
    console.log(`[Postmark] Sending batch of ${emails.length} emails`);
    return postmarkRequest("/email/batch", {
        method: "POST",
        body: JSON.stringify(requests)
    });
}
async function listPostmarkDomains() {
    console.log("[Postmark] Listing sender signatures");
    return postmarkRequest("/senders", {
        method: "GET"
    });
}
async function getPostmarkDomain(signatureId) {
    console.log(`[Postmark] Getting sender signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}`, {
        method: "GET"
    });
}
async function createPostmarkDomain(options) {
    const { fromEmail, name, replyToEmail } = options;
    console.log(`[Postmark] Creating sender signature for ${fromEmail}`);
    return postmarkRequest("/senders", {
        method: "POST",
        body: JSON.stringify({
            FromEmail: fromEmail,
            Name: name,
            ReplyToEmail: replyToEmail || fromEmail
        })
    });
}
async function deletePostmarkDomain(signatureId) {
    console.log(`[Postmark] Deleting sender signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}`, {
        method: "DELETE"
    });
}
async function resendPostmarkConfirmation(signatureId) {
    console.log(`[Postmark] Resending confirmation for signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}/resend`, {
        method: "POST"
    });
}
async function verifyPostmarkDKIM(signatureId) {
    console.log(`[Postmark] Verifying DKIM for signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}/verifyDkim`, {
        method: "PUT"
    });
}
async function verifyPostmarkReturnPath(signatureId) {
    console.log(`[Postmark] Verifying Return-Path for signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}/verifyReturnPath`, {
        method: "PUT"
    });
}
async function getPostmarkServerInfo() {
    console.log("[Postmark] Getting server info");
    return postmarkRequest("/server", {
        method: "GET"
    });
}
function verifyPostmarkWebhook(options) {
    const { token } = options;
    // If no secret configured, accept all webhooks (not recommended for production)
    if (!postmarkConfig.webhookSecret) {
        console.warn("[Postmark] No webhook secret configured - accepting webhook without verification");
        return true;
    }
    // Verify the token matches our secret
    if (!token) {
        console.error("[Postmark] Webhook missing token");
        return false;
    }
    // Use timing-safe comparison to prevent timing attacks
    try {
        const expected = Buffer.from(postmarkConfig.webhookSecret);
        const received = Buffer.from(token);
        if (expected.length !== received.length) {
            return false;
        }
        return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].timingSafeEqual(expected, received);
    } catch  {
        return false;
    }
}
async function checkPostmarkHealth() {
    const startTime = Date.now();
    try {
        const result = await getPostmarkServerInfo();
        const latencyMs = Date.now() - startTime;
        if (result.success) {
            console.log(`[Postmark] Health check passed in ${latencyMs}ms`);
            return {
                healthy: true,
                provider: "postmark",
                latencyMs
            };
        }
        console.error(`[Postmark] Health check failed: ${result.error}`);
        return {
            healthy: false,
            provider: "postmark",
            latencyMs,
            error: result.error
        };
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Postmark] Health check error: ${errorMessage}`);
        return {
            healthy: false,
            provider: "postmark",
            latencyMs,
            error: errorMessage
        };
    }
}
function isPostmarkConfigured() {
    return postmarkConfig.isConfigured;
}
function getPostmarkDNSRecords(domain) {
    const records = [];
    // DKIM record
    if (domain.DKIMHost && domain.DKIMTextValue) {
        records.push({
            type: "TXT",
            name: domain.DKIMHost,
            value: domain.DKIMTextValue,
            verified: domain.DKIMVerified
        });
    }
    // Return-Path CNAME
    if (domain.ReturnPathDomain && domain.ReturnPathDomainCNAMEValue) {
        records.push({
            type: "CNAME",
            name: domain.ReturnPathDomain,
            value: domain.ReturnPathDomainCNAMEValue,
            verified: domain.ReturnPathDomainVerified
        });
    }
    return records;
}
}),
"[project]/apps/web/src/lib/email/token-encryption.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Token Encryption Service
 *
 * Encrypts and decrypts OAuth refresh tokens before storing in database.
 * Uses AES-256-GCM for authenticated encryption.
 *
 * Security Features:
 * - AES-256-GCM authenticated encryption
 * - Unique IV (initialization vector) per token
 * - Authentication tag prevents tampering
 * - Key derivation from environment variable
 *
 * Environment Variables Required:
 * - TOKEN_ENCRYPTION_KEY: 32-byte hex string (64 characters)
 *
 * Generate key with: openssl rand -hex 32
 *
 * CRITICAL: Never commit encryption key to version control!
 */ __turbopack_context__.s([
    "decryptToken",
    ()=>decryptToken,
    "decryptTokenSafe",
    ()=>decryptTokenSafe,
    "encryptToken",
    ()=>encryptToken,
    "encryptTokenSafe",
    ()=>encryptTokenSafe,
    "isEncryptionConfigured",
    ()=>isEncryptionConfigured,
    "migrateTokensToEncrypted",
    ()=>migrateTokensToEncrypted,
    "testEncryption",
    ()=>testEncryption
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
// =============================================================================
// CONSTANTS
// =============================================================================
/** Encryption algorithm (AES-256-GCM) */ const ALGORITHM = "aes-256-gcm";
/** IV length in bytes (12 bytes = 96 bits, recommended for GCM) */ const IV_LENGTH = 12;
/** Auth tag length in bytes (16 bytes = 128 bits) */ const AUTH_TAG_LENGTH = 16;
/** Encoding for encrypted output */ const ENCODING = "base64";
// =============================================================================
// KEY MANAGEMENT
// =============================================================================
/**
 * Get encryption key from environment
 * Throws error if key is missing or invalid
 */ function getEncryptionKey() {
    const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
    if (!keyHex) {
        throw new Error("TOKEN_ENCRYPTION_KEY environment variable not set. Generate with: openssl rand -hex 32");
    }
    // Verify key is 32 bytes (64 hex characters)
    if (keyHex.length !== 64) {
        throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex characters). Generate with: openssl rand -hex 32");
    }
    // Convert hex string to buffer
    const key = Buffer.from(keyHex, "hex");
    if (key.length !== 32) {
        throw new Error("Invalid TOKEN_ENCRYPTION_KEY format");
    }
    return key;
}
function encryptToken(plaintext) {
    try {
        const key = getEncryptionKey();
        // Generate random IV (never reuse IVs!)
        const iv = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(IV_LENGTH);
        // Create cipher
        const cipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createCipheriv(ALGORITHM, key, iv);
        // Encrypt
        let ciphertext = cipher.update(plaintext, "utf8", ENCODING);
        ciphertext += cipher.final(ENCODING);
        // Get authentication tag
        const authTag = cipher.getAuthTag();
        // Return format: iv:authTag:ciphertext (all base64)
        return [
            iv.toString(ENCODING),
            authTag.toString(ENCODING),
            ciphertext
        ].join(":");
    } catch (error) {
        console.error("[Token Encryption] Encryption failed:", error);
        throw new Error("Failed to encrypt token");
    }
}
function decryptToken(encrypted) {
    try {
        const key = getEncryptionKey();
        // Parse encrypted format: iv:authTag:ciphertext
        const parts = encrypted.split(":");
        if (parts.length !== 3) {
            throw new Error("Invalid encrypted token format");
        }
        const [ivBase64, authTagBase64, ciphertext] = parts;
        // Convert from base64
        const iv = Buffer.from(ivBase64, ENCODING);
        const authTag = Buffer.from(authTagBase64, ENCODING);
        // Verify lengths
        if (iv.length !== IV_LENGTH) {
            throw new Error("Invalid IV length");
        }
        if (authTag.length !== AUTH_TAG_LENGTH) {
            throw new Error("Invalid auth tag length");
        }
        // Create decipher
        const decipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);
        // Decrypt
        let plaintext = decipher.update(ciphertext, ENCODING, "utf8");
        plaintext += decipher.final("utf8");
        return plaintext;
    } catch (error) {
        console.error("[Token Encryption] Decryption failed:", error);
        throw new Error("Failed to decrypt token");
    }
}
function isEncryptionConfigured() {
    try {
        getEncryptionKey();
        return true;
    } catch  {
        return false;
    }
}
function testEncryption() {
    try {
        const testToken = "test_token_" + __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString("hex");
        const encrypted = encryptToken(testToken);
        const decrypted = decryptToken(encrypted);
        return decrypted === testToken;
    } catch  {
        return false;
    }
}
async function migrateTokensToEncrypted() {
    // This would be implemented as a standalone migration script
    // NOT included here to prevent accidental execution
    console.warn("[Token Encryption] Migration must be run as standalone script");
    throw new Error("Use standalone migration script");
}
function encryptTokenSafe(plaintext) {
    if (!isEncryptionConfigured()) {
        console.warn("[Token Encryption] Encryption key not configured - storing plaintext (DEV ONLY)");
        return plaintext;
    }
    return encryptToken(plaintext);
}
function decryptTokenSafe(encrypted) {
    if (!isEncryptionConfigured()) {
        console.warn("[Token Encryption] Encryption key not configured - returning plaintext (DEV ONLY)");
        return encrypted;
    }
    // Check if token is already encrypted (contains colons)
    if (!encrypted.includes(":")) {
        console.warn("[Token Encryption] Token appears to be plaintext - returning as-is (MIGRATION MODE)");
        return encrypted;
    }
    try {
        return decryptToken(encrypted);
    } catch (error) {
        console.error("[Token Encryption] Decryption failed, returning plaintext:", error);
        return encrypted;
    }
}
}),
"[project]/apps/web/src/lib/email/gmail-rate-limiter.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Gmail API Rate Limiter
 *
 * Prevents Gmail API quota exhaustion and abuse by implementing rate limits
 * at multiple levels: per-user, per-company, and global.
 *
 * Gmail API Quotas (Google-imposed):
 * - 1 billion quota units per day (project-wide)
 * - 250 quota units/user/second
 * - messages.get = 5 units, messages.list = 5 units
 *
 * Our Limits:
 * - Per-user: 1 sync every 5 minutes (max 12 syncs/hour)
 * - Per-user: Max 100 messages per sync
 * - Global: Max 10 concurrent syncs
 * - API endpoints: 60 requests/minute per user
 *
 * Implementation:
 * - In-memory rate limiting with Map (resets on server restart)
 * - Redis for distributed rate limiting (optional, for multi-server)
 * - Automatic cleanup of stale entries
 *
 * @see https://developers.google.com/gmail/api/reference/quota
 */ // =============================================================================
// TYPES
// =============================================================================
__turbopack_context__.s([
    "RATE_LIMITS",
    ()=>RATE_LIMITS,
    "acquireSyncLock",
    ()=>acquireSyncLock,
    "checkApiRateLimit",
    ()=>checkApiRateLimit,
    "checkSyncRateLimit",
    ()=>checkSyncRateLimit,
    "getActiveSyncCount",
    ()=>getActiveSyncCount,
    "getRateLimiterStats",
    ()=>getRateLimiterStats,
    "releaseSyncLock",
    ()=>releaseSyncLock,
    "resetRateLimits",
    ()=>resetRateLimits,
    "startCleanup",
    ()=>startCleanup,
    "stopCleanup",
    ()=>stopCleanup,
    "validateSyncParams",
    ()=>validateSyncParams
]);
// =============================================================================
// CONSTANTS
// =============================================================================
/** Minimum time between syncs per user (5 minutes) */ const SYNC_COOLDOWN_MS = 5 * 60 * 1000;
/** Maximum messages per sync */ const MAX_MESSAGES_PER_SYNC = 100;
/** Maximum concurrent syncs globally */ const MAX_CONCURRENT_SYNCS = 10;
/** API rate limit: requests per window */ const API_RATE_LIMIT = 60;
/** API rate limit window (1 minute) */ const API_RATE_WINDOW_MS = 60 * 1000;
/** How long to keep rate limit entries in memory */ const RATE_LIMIT_CLEANUP_MS = 60 * 60 * 1000; // 1 hour
/** How long a sync lock is valid (30 minutes max) */ const SYNC_LOCK_TIMEOUT_MS = 30 * 60 * 1000;
// =============================================================================
// IN-MEMORY STORAGE
// =============================================================================
/** Per-user API rate limits */ const apiRateLimits = new Map();
/** Per-user last sync timestamps */ const lastSyncTimes = new Map();
/** Active sync locks */ const activeSyncLocks = new Set();
/** Cleanup interval */ let cleanupInterval = null;
function checkApiRateLimit(userId) {
    const now = Date.now();
    const entry = apiRateLimits.get(userId);
    if (!entry) {
        // First request - allow and record
        apiRateLimits.set(userId, {
            count: 1,
            firstRequest: now,
            lastRequest: now
        });
        return {
            allowed: true
        };
    }
    // Check if window has expired
    const windowAge = now - entry.firstRequest;
    if (windowAge > API_RATE_WINDOW_MS) {
        // Window expired - reset counter
        apiRateLimits.set(userId, {
            count: 1,
            firstRequest: now,
            lastRequest: now
        });
        return {
            allowed: true
        };
    }
    // Within window - check limit
    if (entry.count >= API_RATE_LIMIT) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.firstRequest + API_RATE_WINDOW_MS - now) / 1000);
        return {
            allowed: false,
            retryAfter
        };
    }
    // Increment counter
    entry.count++;
    entry.lastRequest = now;
    apiRateLimits.set(userId, entry);
    return {
        allowed: true
    };
}
function checkSyncRateLimit(teamMemberId) {
    const now = Date.now();
    // Check sync cooldown
    const lastSync = lastSyncTimes.get(teamMemberId);
    if (lastSync) {
        const timeSinceLastSync = now - lastSync;
        if (timeSinceLastSync < SYNC_COOLDOWN_MS) {
            const retryAfter = Math.ceil((SYNC_COOLDOWN_MS - timeSinceLastSync) / 1000);
            return {
                allowed: false,
                reason: "Sync cooldown active",
                retryAfter
            };
        }
    }
    // Check concurrent sync limit
    const activeCount = getActiveSyncCount();
    if (activeCount >= MAX_CONCURRENT_SYNCS) {
        return {
            allowed: false,
            reason: "Maximum concurrent syncs reached",
            retryAfter: 60
        };
    }
    // Check if user already has active sync
    const existingLock = Array.from(activeSyncLocks).find((lock)=>lock.teamMemberId === teamMemberId);
    if (existingLock) {
        // Check if lock is expired
        if (now > existingLock.expiresAt) {
            // Lock expired - remove it
            activeSyncLocks.delete(existingLock);
        } else {
            return {
                allowed: false,
                reason: "Sync already in progress",
                retryAfter: Math.ceil((existingLock.expiresAt - now) / 1000)
            };
        }
    }
    return {
        allowed: true
    };
}
function acquireSyncLock(teamMemberId) {
    const check = checkSyncRateLimit(teamMemberId);
    if (!check.allowed) {
        return null;
    }
    const now = Date.now();
    const lock = {
        teamMemberId,
        startedAt: now,
        expiresAt: now + SYNC_LOCK_TIMEOUT_MS
    };
    activeSyncLocks.add(lock);
    lastSyncTimes.set(teamMemberId, now);
    return lock;
}
function releaseSyncLock(lock) {
    activeSyncLocks.delete(lock);
}
function getActiveSyncCount() {
    // Clean up expired locks first
    const now = Date.now();
    for (const lock of activeSyncLocks){
        if (now > lock.expiresAt) {
            activeSyncLocks.delete(lock);
        }
    }
    return activeSyncLocks.size;
}
// =============================================================================
// CLEANUP
// =============================================================================
/**
 * Clean up stale rate limit entries
 */ function cleanup() {
    const now = Date.now();
    // Clean API rate limits
    for (const [userId, entry] of apiRateLimits.entries()){
        const age = now - entry.lastRequest;
        if (age > RATE_LIMIT_CLEANUP_MS) {
            apiRateLimits.delete(userId);
        }
    }
    // Clean last sync times
    for (const [userId, lastSync] of lastSyncTimes.entries()){
        const age = now - lastSync;
        if (age > RATE_LIMIT_CLEANUP_MS) {
            lastSyncTimes.delete(userId);
        }
    }
    // Clean expired sync locks
    for (const lock of activeSyncLocks){
        if (now > lock.expiresAt) {
            activeSyncLocks.delete(lock);
        }
    }
}
function startCleanup() {
    if (cleanupInterval) {
        return; // Already started
    }
    // Run cleanup every 5 minutes
    cleanupInterval = setInterval(cleanup, 5 * 60 * 1000);
    console.log("[Gmail Rate Limiter] Cleanup scheduled");
}
function stopCleanup() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
}
function validateSyncParams(maxResults) {
    if (maxResults <= 0) {
        return {
            valid: false,
            error: "maxResults must be positive"
        };
    }
    if (maxResults > MAX_MESSAGES_PER_SYNC) {
        return {
            valid: false,
            error: `maxResults cannot exceed ${MAX_MESSAGES_PER_SYNC}`
        };
    }
    return {
        valid: true
    };
}
function getRateLimiterStats() {
    return {
        apiRateLimits: apiRateLimits.size,
        lastSyncTimes: lastSyncTimes.size,
        activeSyncs: getActiveSyncCount(),
        maxConcurrentSyncs: MAX_CONCURRENT_SYNCS
    };
}
function resetRateLimits() {
    apiRateLimits.clear();
    lastSyncTimes.clear();
    activeSyncLocks.clear();
    console.warn("[Gmail Rate Limiter] All rate limits reset");
}
// =============================================================================
// INITIALIZATION
// =============================================================================
// Start cleanup on module load
startCleanup();
const RATE_LIMITS = {
    SYNC_COOLDOWN_MS,
    MAX_MESSAGES_PER_SYNC,
    MAX_CONCURRENT_SYNCS,
    API_RATE_LIMIT,
    API_RATE_WINDOW_MS
};
}),
"[project]/apps/web/src/lib/email/audit-logger.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Security Audit Logger
 *
 * Logs security-relevant events for compliance, investigation, and monitoring.
 * All logs are stored in the database with retention policies.
 *
 * Events Logged:
 * - Gmail connections/disconnections
 * - Token refresh failures
 * - Permission grants/revokes
 * - Sync errors
 * - Email access (optional, for compliance)
 *
 * Usage:
 * await logAuditEvent('gmail_connected', { teamMemberId, email });
 * await logAuditEvent('permission_granted', { grantedBy, grantedTo, category });
 *
 * Database Table: email_audit_log (to be created)
 *
 * @see /docs/email/SECURITY_AUDIT.md
 */ __turbopack_context__.s([
    "getAuditEventsForCompany",
    ()=>getAuditEventsForCompany,
    "getAuditEventsForUser",
    ()=>getAuditEventsForUser,
    "getCriticalSecurityEvents",
    ()=>getCriticalSecurityEvents,
    "logAuditEvent",
    ()=>logAuditEvent,
    "logGmailConnected",
    ()=>logGmailConnected,
    "logGmailDisconnected",
    ()=>logGmailDisconnected,
    "logPermissionGranted",
    ()=>logPermissionGranted,
    "logPermissionRevoked",
    ()=>logPermissionRevoked,
    "logRateLimitExceeded",
    ()=>logRateLimitExceeded,
    "logSyncFailed",
    ()=>logSyncFailed,
    "logTokenRefreshFailed",
    ()=>logTokenRefreshFailed,
    "logUnauthorizedAccess",
    ()=>logUnauthorizedAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
;
async function logAuditEvent(eventType, metadata = {}, severity = "info", message) {
    try {
        // Generate default message if not provided
        const defaultMessage = generateDefaultMessage(eventType, metadata);
        // In production, store in database
        // For now, log to console with structured format
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventType,
            severity,
            message: message || defaultMessage,
            metadata
        };
        // Console output with color coding
        const prefix = `[Email Audit]`;
        const severityEmoji = {
            info: "ℹ️",
            warning: "⚠️",
            error: "❌",
            critical: "🚨"
        }[severity];
        console.log(`${prefix} ${severityEmoji} [${severity.toUpperCase()}] ${logEntry.message}`, metadata);
        // Store in database
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
            if (supabase) {
                await supabase.from("email_audit_log").insert({
                    company_id: metadata.companyId || null,
                    event_type: eventType,
                    severity,
                    message: logEntry.message,
                    team_member_id: metadata.teamMemberId || null,
                    user_id: metadata.userId || null,
                    gmail_email: metadata.gmailEmail || null,
                    metadata,
                    ip_address: metadata.ipAddress || null,
                    user_agent: metadata.userAgent || null
                });
            }
        } catch (dbError) {
            // Don't fail the audit log if database write fails - console log is still captured
            console.error("[Email Audit] Failed to store in database:", dbError);
        }
        return {
            success: true
        };
    } catch (error) {
        console.error("[Email Audit] Failed to log event:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
/**
 * Generate default message for event type
 */ function generateDefaultMessage(eventType, metadata) {
    const name = metadata.userName || metadata.teamMemberId || "User";
    switch(eventType){
        case "gmail_connected":
            return `${name} connected Gmail account (${metadata.gmailEmail})`;
        case "gmail_disconnected":
            return `${name} disconnected Gmail account (${metadata.gmailEmail})`;
        case "gmail_token_refreshed":
            return `Gmail token refreshed for ${metadata.gmailEmail}`;
        case "gmail_token_refresh_failed":
            return `Failed to refresh Gmail token for ${metadata.gmailEmail}: ${metadata.error}`;
        case "gmail_token_revoked":
            return `Gmail token revoked for ${metadata.gmailEmail}`;
        case "permission_granted":
            return `${metadata.grantedBy} granted ${metadata.category} permissions to ${metadata.grantedTo}`;
        case "permission_revoked":
            return `${metadata.grantedBy} revoked ${metadata.category} permissions from ${metadata.grantedTo}`;
        case "permission_updated":
            return `${metadata.grantedBy} updated ${metadata.category} permissions for ${metadata.grantedTo}`;
        case "permission_check_failed":
            return `Permission check failed for ${name}: ${metadata.error}`;
        case "sync_started":
            return `${name} started inbox sync`;
        case "sync_completed":
            return `${name} completed inbox sync (${metadata.syncMessageCount} messages)`;
        case "sync_failed":
            return `Inbox sync failed for ${name}: ${metadata.error}`;
        case "sync_rate_limited":
            return `${name} sync rate limited (retry after ${metadata.retryAfter}s)`;
        case "email_accessed":
            return `${name} accessed email: ${metadata.emailSubject}`;
        case "email_sent":
            return `${name} sent email to ${metadata.toAddress}: ${metadata.emailSubject}`;
        case "email_assigned":
            return `${name} assigned email to ${metadata.grantedTo}`;
        case "unauthorized_access_attempt":
            return `Unauthorized access attempt by ${name}: ${metadata.error}`;
        case "permission_escalation_attempt":
            return `Permission escalation attempt by ${name}: ${metadata.error}`;
        case "invalid_oauth_state":
            return `Invalid OAuth state detected: ${metadata.error}`;
        case "token_cleanup_executed":
            return `Token cleanup executed: ${metadata.syncMessageCount} tokens removed`;
        case "rate_limit_exceeded":
            return `Rate limit exceeded for ${name} (${metadata.requestsPerMinute} req/min)`;
        default:
            return `${eventType} event for ${name}`;
    }
}
async function logGmailConnected(teamMemberId, userName, gmailEmail, companyId) {
    await logAuditEvent("gmail_connected", {
        teamMemberId,
        userName,
        gmailEmail,
        companyId
    }, "info");
}
async function logGmailDisconnected(teamMemberId, userName, gmailEmail, companyId) {
    await logAuditEvent("gmail_disconnected", {
        teamMemberId,
        userName,
        gmailEmail,
        companyId
    }, "info");
}
async function logTokenRefreshFailed(teamMemberId, gmailEmail, error) {
    await logAuditEvent("gmail_token_refresh_failed", {
        teamMemberId,
        gmailEmail,
        error
    }, "warning");
}
async function logPermissionGranted(grantedBy, grantedByName, grantedTo, grantedToName, category, companyId) {
    await logAuditEvent("permission_granted", {
        grantedBy,
        userName: grantedByName,
        grantedTo,
        category,
        companyId
    }, "info");
}
async function logPermissionRevoked(revokedBy, revokedByName, revokedFrom, revokedFromName, category, companyId) {
    await logAuditEvent("permission_revoked", {
        grantedBy: revokedBy,
        userName: revokedByName,
        grantedTo: revokedFrom,
        category,
        companyId
    }, "info");
}
async function logSyncFailed(teamMemberId, userName, gmailEmail, error) {
    await logAuditEvent("sync_failed", {
        teamMemberId,
        userName,
        gmailEmail,
        error
    }, "error");
}
async function logUnauthorizedAccess(userId, userName, resource, error) {
    await logAuditEvent("unauthorized_access_attempt", {
        userId,
        userName,
        error,
        communicationId: resource
    }, "warning");
}
async function logRateLimitExceeded(userId, userName, requestsPerMinute, retryAfter) {
    await logAuditEvent("rate_limit_exceeded", {
        userId,
        userName,
        requestsPerMinute,
        retryAfter
    }, "warning");
}
async function getAuditEventsForUser(teamMemberId, limit = 100) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from("email_audit_log").select("id, event_type, severity, message, metadata, created_at").eq("team_member_id", teamMemberId).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) {
            console.error("[Email Audit] Failed to query events for user:", error);
            return [];
        }
        return (data || []).map((row)=>({
                id: row.id,
                eventType: row.event_type,
                severity: row.severity,
                message: row.message,
                metadata: row.metadata || {},
                createdAt: row.created_at
            }));
    } catch (error) {
        console.error("[Email Audit] Failed to query events for user:", error);
        return [];
    }
}
async function getAuditEventsForCompany(companyId, limit = 100) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from("email_audit_log").select("id, event_type, severity, message, metadata, created_at").eq("company_id", companyId).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) {
            console.error("[Email Audit] Failed to query events for company:", error);
            return [];
        }
        return (data || []).map((row)=>({
                id: row.id,
                eventType: row.event_type,
                severity: row.severity,
                message: row.message,
                metadata: row.metadata || {},
                createdAt: row.created_at
            }));
    } catch (error) {
        console.error("[Email Audit] Failed to query events for company:", error);
        return [];
    }
}
async function getCriticalSecurityEvents(limit = 50) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from("email_audit_log").select("id, event_type, severity, message, metadata, created_at").in("severity", [
            "error",
            "critical"
        ]).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) {
            console.error("[Email Audit] Failed to query critical events:", error);
            return [];
        }
        return (data || []).map((row)=>({
                id: row.id,
                eventType: row.event_type,
                severity: row.severity,
                message: row.message,
                metadata: row.metadata || {},
                createdAt: row.created_at
            }));
    } catch (error) {
        console.error("[Email Audit] Failed to query critical events:", error);
        return [];
    }
}
}),
"[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Gmail API Client (Company-Level & Per-User / Multi-Tenant)
 *
 * CRITICAL: Reply-to addresses ALWAYS use the platform subdomain (mail.thorbis.com),
 * even when sending from personal Gmail. This ensures replies go to the company's
 * centralized inbox, not the personal Gmail account.
 *
 * Example:
 * - FROM: john@gmail.com (personal Gmail)
 * - REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform subdomain)
 *
 * See: /docs/email/REPLY_TO_ARCHITECTURE.md for full details
 *
 * This module provides Gmail API integration at two levels:
 * 1. Company-Level: One Gmail account for the entire company (sending only)
 * 2. Per-User: Individual team member Gmail accounts (inbox access + sending)
 *
 * Multi-Tenant Architecture:
 * - Each company can configure their own email provider
 * - Options: 'managed' (Resend/Postmark), 'gmail', or 'disabled'
 * - Company tokens stored in company_gmail_tokens table
 * - Per-user tokens stored in user_gmail_tokens table
 *
 * Key Features:
 * - Send emails via company's Gmail API
 * - Per-user inbox access and synchronization
 * - Automatic token refresh before expiration
 * - Token validation and error handling
 * - Integration with provider monitoring
 *
 * How It Works (Company-Level):
 * 1. Company admin connects Gmail via OAuth (grants gmail.send scope)
 * 2. Tokens stored in company_gmail_tokens table
 * 3. Before sending, we check/refresh tokens
 * 4. Use Gmail API to send email as company
 *
 * How It Works (Per-User):
 * 1. Team member connects their Gmail via OAuth (grants gmail.readonly + gmail.send)
 * 2. Tokens stored in user_gmail_tokens table
 * 3. Background sync job fetches inbox emails every 5-10 minutes
 * 4. Emails stored in communications table with mailbox_owner_id
 * 5. Role-based permissions control who can see which emails
 *
 * Rate Limits (Gmail API):
 * - Consumer accounts: 100 emails/day
 * - Google Workspace: 2,000 emails/day
 * - Per-minute limit: 100 messages
 *
 * Required Scopes:
 * - Company: https://www.googleapis.com/auth/gmail.send
 * - Per-User: https://www.googleapis.com/auth/gmail.readonly, gmail.send
 *
 * Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 *
 * @see https://developers.google.com/gmail/api/reference/rest
 */ /* __next_internal_action_entry_do_not_use__ [{"0077b5d695a6e4bd1ec48ffe0a639d5f7737bedd9a":"isGmailIntegrationEnabled","402e7af979456c6169a23490efd5611eedb77b7f8d":"getUserGmailTokens","40668734ac0715444771ef63df4ce2328f9e9144e1":"disconnectUserGmail","4093292a46f282093734eae84e8bdd79e58274f64f":"disconnectCompanyGmail","40b41f81fe9259fafce704bbd3935f68276fc4e2ca":"getCompanyEmailProvider","40f32c0cfb7780293a18cf77271d2770c0d61fe547":"getCompanyGmailTokens","6028c8a328b5f7616873329b038fce472d56c751d5":"checkCompanyGmailHealth","60666d082731fc0da1ea78000a7b22b3afbbc989b7":"sendCompanyGmailEmail","606b9ecbf77951fa1ec76cb2b2d919f43a5335a5f2":"syncUserInbox","607bbb8ec456319d6f212db11b0dad6d62ec6e5cdc":"refreshUserGmailToken","60afa4f94f55ff80042f81a76c673e75545d27872d":"refreshCompanyGmailToken","701eda529738b7cb8db9c89a5a499d69941ede094c":"setCompanyEmailProvider","70b8ccf02d177c82841b8a8e25abfece8615b480cf":"fetchUserInbox","78ce69226fb0c4303ba3e078a1534c86a000dbb744":"storeGmailMessage","7e684d0fcd64a86c227a3635ab611c4c140250b6fb":"storeUserGmailTokens","7fa9d4af88bd605b13c48fb4e2937bda4ef2ce0a20":"storeCompanyGmailTokens"},"",""] */ __turbopack_context__.s([
    "checkCompanyGmailHealth",
    ()=>checkCompanyGmailHealth,
    "disconnectCompanyGmail",
    ()=>disconnectCompanyGmail,
    "disconnectUserGmail",
    ()=>disconnectUserGmail,
    "fetchUserInbox",
    ()=>fetchUserInbox,
    "getCompanyEmailProvider",
    ()=>getCompanyEmailProvider,
    "getCompanyGmailTokens",
    ()=>getCompanyGmailTokens,
    "getUserGmailTokens",
    ()=>getUserGmailTokens,
    "isGmailIntegrationEnabled",
    ()=>isGmailIntegrationEnabled,
    "refreshCompanyGmailToken",
    ()=>refreshCompanyGmailToken,
    "refreshUserGmailToken",
    ()=>refreshUserGmailToken,
    "sendCompanyGmailEmail",
    ()=>sendCompanyGmailEmail,
    "setCompanyEmailProvider",
    ()=>setCompanyEmailProvider,
    "storeCompanyGmailTokens",
    ()=>storeCompanyGmailTokens,
    "storeGmailMessage",
    ()=>storeGmailMessage,
    "storeUserGmailTokens",
    ()=>storeUserGmailTokens,
    "syncUserInbox",
    ()=>syncUserInbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/token-encryption.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/gmail-rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/audit-logger.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
// =============================================================================
// CONSTANTS
// =============================================================================
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1";
const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const GMAIL_MODIFY_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
async function getCompanyEmailProvider(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data } = await supabase.from("companies").select("email_provider").eq("id", companyId).single();
        return data?.email_provider || "managed";
    } catch (error) {
        console.error("[Gmail] Error getting company email provider:", error);
        return "managed";
    }
}
async function setCompanyEmailProvider(companyId, provider, updatedByUserId) {
    try {
        // If switching to Gmail, verify tokens exist
        if (provider === "gmail") {
            const tokens = await getCompanyGmailTokens(companyId);
            if (!tokens || !tokens.isValid) {
                return {
                    success: false,
                    error: "Gmail is not connected. Please connect Gmail first."
                };
            }
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { error } = await supabase.from("companies").update({
            email_provider: provider,
            email_provider_updated_at: new Date().toISOString(),
            email_provider_updated_by: updatedByUserId || null
        }).eq("id", companyId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        console.log(`[Gmail] Company ${companyId} email provider set to: ${provider}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function getCompanyGmailTokens(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("company_gmail_tokens").select("*").eq("company_id", companyId).maybeSingle();
        if (error || !data) {
            return null;
        }
        const tokenData = {
            companyId: data.company_id,
            gmailEmail: data.gmail_email,
            gmailDisplayName: data.gmail_display_name,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: new Date(data.token_expires_at),
            isValid: data.is_valid,
            scopes: data.scopes || [
                GMAIL_SEND_SCOPE
            ],
            connectedBy: data.connected_by,
            connectedByName: data.connected_by_name
        };
        // Check if token needs refresh
        if (isTokenExpiringSoon(tokenData.tokenExpiresAt)) {
            console.log(`[Gmail] Token expiring soon for company ${companyId}, refreshing...`);
            const refreshed = await refreshCompanyGmailToken(companyId, tokenData.refreshToken);
            if (refreshed) {
                return refreshed;
            }
            console.warn("[Gmail] Token refresh failed, using existing token");
        }
        return tokenData;
    } catch (error) {
        console.error("[Gmail] Error getting company tokens:", error);
        return null;
    }
}
function isTokenExpiringSoon(expiresAt) {
    return expiresAt.getTime() - Date.now() < TOKEN_REFRESH_BUFFER_MS;
}
async function refreshCompanyGmailToken(companyId, refreshToken) {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            console.error("[Gmail] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
            return null;
        }
        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Gmail] Token refresh failed: ${response.status}`, errorText);
            if (response.status === 400 || response.status === 401) {
                await markCompanyTokenInvalid(companyId, `Refresh failed: ${response.status}`);
            }
            return null;
        }
        const tokenResponse = await response.json();
        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("company_gmail_tokens").update({
            access_token: tokenResponse.access_token,
            token_expires_at: expiresAt.toISOString(),
            ...tokenResponse.refresh_token && {
                refresh_token: tokenResponse.refresh_token
            },
            is_valid: true,
            last_error: null
        }).eq("company_id", companyId).select("*").single();
        if (error || !data) {
            console.error("[Gmail] Failed to update refreshed token:", error?.message);
            return null;
        }
        console.log(`[Gmail] Token refreshed for company ${companyId}`);
        return {
            companyId: data.company_id,
            gmailEmail: data.gmail_email,
            gmailDisplayName: data.gmail_display_name,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: new Date(data.token_expires_at),
            isValid: data.is_valid,
            scopes: data.scopes || [
                GMAIL_SEND_SCOPE
            ],
            connectedBy: data.connected_by,
            connectedByName: data.connected_by_name
        };
    } catch (error) {
        console.error("[Gmail] Token refresh error:", error);
        return null;
    }
}
async function markCompanyTokenInvalid(companyId, reason) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("company_gmail_tokens").update({
            is_valid: false,
            last_error: reason
        }).eq("company_id", companyId);
        console.log(`[Gmail] Marked token invalid for company ${companyId}: ${reason}`);
    } catch (error) {
        console.error("[Gmail] Failed to mark token invalid:", error);
    }
}
async function storeCompanyGmailTokens(companyId, gmailEmail, displayName, accessToken, refreshToken, expiresIn, scopes, connectedByUserId, connectedByName) {
    try {
        if (!scopes.includes(GMAIL_SEND_SCOPE)) {
            return {
                success: false,
                error: `Missing required scope: ${GMAIL_SEND_SCOPE}`
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        const { error } = await supabase.from("company_gmail_tokens").upsert({
            company_id: companyId,
            gmail_email: gmailEmail,
            gmail_display_name: displayName,
            access_token: accessToken,
            refresh_token: refreshToken,
            token_expires_at: expiresAt.toISOString(),
            scopes,
            is_valid: true,
            last_error: null,
            connected_by: connectedByUserId || null,
            connected_by_name: connectedByName || null
        }, {
            onConflict: "company_id"
        });
        if (error) {
            console.error("[Gmail] Failed to store tokens:", error.message);
            return {
                success: false,
                error: error.message
            };
        }
        console.log(`[Gmail] Stored tokens for company ${companyId} (${gmailEmail})`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function disconnectCompanyGmail(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get token to revoke
        const { data: tokenData } = await supabase.from("company_gmail_tokens").select("access_token").eq("company_id", companyId).single();
        // Delete from database
        const { error } = await supabase.from("company_gmail_tokens").delete().eq("company_id", companyId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        // Reset to managed provider
        await setCompanyEmailProvider(companyId, "managed");
        // Revoke token with Google (best effort)
        if (tokenData?.access_token) {
            try {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
                    method: "POST"
                });
            } catch  {
                console.warn("[Gmail] Token revocation request failed (non-critical)");
            }
        }
        console.log(`[Gmail] Disconnected Gmail for company ${companyId}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function sendCompanyGmailEmail(companyId, emailData) {
    try {
        const tokens = await getCompanyGmailTokens(companyId);
        if (!tokens) {
            return {
                success: false,
                error: "Gmail not connected for this company"
            };
        }
        if (!tokens.isValid) {
            return {
                success: false,
                error: `Gmail connection invalid: ${tokens.gmailEmail}`
            };
        }
        const mimeMessage = buildMimeMessage({
            from: tokens.gmailDisplayName ? `${tokens.gmailDisplayName} <${tokens.gmailEmail}>` : tokens.gmailEmail,
            to: Array.isArray(emailData.to) ? emailData.to.join(", ") : emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
            replyTo: emailData.replyTo,
            cc: emailData.cc ? Array.isArray(emailData.cc) ? emailData.cc.join(", ") : emailData.cc : undefined,
            bcc: emailData.bcc ? Array.isArray(emailData.bcc) ? emailData.bcc.join(", ") : emailData.bcc : undefined,
            headers: emailData.headers
        });
        const encodedMessage = base64UrlEncode(mimeMessage);
        const response = await fetch(`${GMAIL_API_URL}/users/me/messages/send`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                raw: encodedMessage
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            const errorMessage = errorData.error?.message || `Gmail API error: ${response.status}`;
            console.error(`[Gmail] Send failed: ${errorMessage}`);
            if (response.status === 401) {
                await markCompanyTokenInvalid(companyId, "Authentication failed");
            }
            return {
                success: false,
                error: errorMessage
            };
        }
        const result = await response.json();
        // Update last used timestamp
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("company_gmail_tokens").update({
            last_used_at: new Date().toISOString()
        }).eq("company_id", companyId);
        console.log(`[Gmail] Sent email for company ${companyId} (ID: ${result.id})`);
        return {
            success: true,
            messageId: result.id,
            threadId: result.threadId,
            labelIds: result.labelIds
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[Gmail] Send error:", message);
        return {
            success: false,
            error: message
        };
    }
}
function buildMimeMessage(parts) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const lines = [
        `From: ${parts.from}`,
        `To: ${parts.to}`,
        `Subject: =?UTF-8?B?${Buffer.from(parts.subject).toString("base64")}?=`,
        "MIME-Version: 1.0"
    ];
    if (parts.replyTo) lines.push(`Reply-To: ${parts.replyTo}`);
    if (parts.cc) lines.push(`Cc: ${parts.cc}`);
    if (parts.bcc) lines.push(`Bcc: ${parts.bcc}`);
    if (parts.headers) {
        for (const [key, value] of Object.entries(parts.headers)){
            lines.push(`${key}: ${value}`);
        }
    }
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push("");
    const textContent = parts.text || extractTextFromHtml(parts.html);
    lines.push(`--${boundary}`);
    lines.push("Content-Type: text/plain; charset=UTF-8");
    lines.push("Content-Transfer-Encoding: base64");
    lines.push("");
    lines.push(Buffer.from(textContent).toString("base64"));
    lines.push(`--${boundary}`);
    lines.push("Content-Type: text/html; charset=UTF-8");
    lines.push("Content-Transfer-Encoding: base64");
    lines.push("");
    lines.push(Buffer.from(parts.html).toString("base64"));
    lines.push(`--${boundary}--`);
    return lines.join("\r\n");
}
function extractTextFromHtml(html) {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function base64UrlEncode(str) {
    return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function checkCompanyGmailHealth(companyId, testApi = false) {
    try {
        const tokens = await getCompanyGmailTokens(companyId);
        if (!tokens) {
            return {
                connected: false,
                tokenValid: false
            };
        }
        const result = {
            connected: true,
            email: tokens.gmailEmail,
            displayName: tokens.gmailDisplayName,
            tokenValid: tokens.isValid,
            tokenExpiresAt: tokens.tokenExpiresAt,
            connectedBy: tokens.connectedByName,
            apiHealthy: undefined
        };
        if (testApi && tokens.isValid) {
            try {
                const response = await fetch(`${GMAIL_API_URL}/users/me/profile`, {
                    headers: {
                        Authorization: `Bearer ${tokens.accessToken}`
                    }
                });
                result.apiHealthy = response.ok;
            } catch  {
                result.apiHealthy = false;
            }
        }
        return result;
    } catch (error) {
        return {
            connected: false,
            tokenValid: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getUserGmailTokens(teamMemberId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("user_gmail_tokens").select("*, user_email_accounts!inner(email_address)").eq("team_member_id", teamMemberId).eq("sync_enabled", true).maybeSingle();
        if (error || !data) {
            return null;
        }
        // Decrypt tokens before using (CRITICAL SECURITY)
        const decryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.access_token);
        const decryptedRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.refresh_token);
        const tokenData = {
            teamMemberId: data.team_member_id,
            emailAccountId: data.user_email_account_id,
            gmailEmail: data.user_email_accounts.email_address,
            accessToken: decryptedAccessToken,
            refreshToken: decryptedRefreshToken,
            tokenExpiresAt: new Date(data.token_expiry),
            scopes: data.scopes || [],
            syncEnabled: data.sync_enabled,
            lastSyncedAt: data.last_synced_at ? new Date(data.last_synced_at) : undefined
        };
        // Check if token needs refresh
        if (isTokenExpiringSoon(tokenData.tokenExpiresAt)) {
            console.log(`[Gmail] Token expiring soon for user ${teamMemberId}, refreshing...`);
            const refreshed = await refreshUserGmailToken(teamMemberId, tokenData.refreshToken);
            if (refreshed) {
                return refreshed;
            }
            console.warn("[Gmail] User token refresh failed, using existing token");
        }
        return tokenData;
    } catch (error) {
        console.error("[Gmail] Error getting user tokens:", error);
        return null;
    }
}
async function refreshUserGmailToken(teamMemberId, refreshToken) {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            console.error("[Gmail] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
            return null;
        }
        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Gmail] User token refresh failed: ${response.status}`, errorText);
            // Log token refresh failure for audit trail
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logTokenRefreshFailed"])(teamMemberId, "Unknown", `Token refresh failed: ${response.status} - ${errorText}`);
            if (response.status === 400 || response.status === 401) {
                await markUserTokenInvalid(teamMemberId, `Refresh failed: ${response.status}`);
            }
            return null;
        }
        const tokenResponse = await response.json();
        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        // Encrypt refreshed tokens before storing (CRITICAL SECURITY)
        const encryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(tokenResponse.access_token);
        const encryptedRefreshToken = tokenResponse.refresh_token ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(tokenResponse.refresh_token) : undefined;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("user_gmail_tokens").update({
            access_token: encryptedAccessToken,
            token_expiry: expiresAt.toISOString(),
            ...encryptedRefreshToken && {
                refresh_token: encryptedRefreshToken
            }
        }).eq("team_member_id", teamMemberId).select("*, user_email_accounts!inner(email_address)").single();
        if (error || !data) {
            console.error("[Gmail] Failed to update refreshed user token:", error?.message);
            return null;
        }
        console.log(`[Gmail] User token refreshed for team member ${teamMemberId}`);
        // Decrypt tokens for return (already encrypted in DB)
        const decryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.access_token);
        const decryptedRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.refresh_token);
        return {
            teamMemberId: data.team_member_id,
            emailAccountId: data.user_email_account_id,
            gmailEmail: data.user_email_accounts.email_address,
            accessToken: decryptedAccessToken,
            refreshToken: decryptedRefreshToken,
            tokenExpiresAt: new Date(data.token_expiry),
            scopes: data.scopes || [],
            syncEnabled: data.sync_enabled,
            lastSyncedAt: data.last_synced_at ? new Date(data.last_synced_at) : undefined
        };
    } catch (error) {
        console.error("[Gmail] User token refresh error:", error);
        return null;
    }
}
async function markUserTokenInvalid(teamMemberId, reason) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("user_gmail_tokens").update({
            sync_enabled: false
        }).eq("team_member_id", teamMemberId);
        console.log(`[Gmail] Disabled sync for team member ${teamMemberId}: ${reason}`);
    } catch (error) {
        console.error("[Gmail] Failed to mark user token invalid:", error);
    }
}
async function storeUserGmailTokens(teamMemberId, emailAccountId, accessToken, refreshToken, expiresIn, scopes) {
    try {
        if (!scopes.includes(GMAIL_READONLY_SCOPE) && !scopes.includes(GMAIL_MODIFY_SCOPE)) {
            return {
                success: false,
                error: `Missing required scope: ${GMAIL_READONLY_SCOPE} or ${GMAIL_MODIFY_SCOPE}`
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        // Encrypt tokens before storing (CRITICAL SECURITY)
        const encryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(accessToken);
        const encryptedRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(refreshToken);
        const { error } = await supabase.from("user_gmail_tokens").upsert({
            team_member_id: teamMemberId,
            user_email_account_id: emailAccountId,
            access_token: encryptedAccessToken,
            refresh_token: encryptedRefreshToken,
            token_expiry: expiresAt.toISOString(),
            scopes,
            sync_enabled: true,
            last_synced_at: null
        }, {
            onConflict: "user_email_account_id"
        });
        if (error) {
            console.error("[Gmail] Failed to store user tokens:", error.message);
            return {
                success: false,
                error: error.message
            };
        }
        console.log(`[Gmail] Stored encrypted tokens for team member ${teamMemberId}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function disconnectUserGmail(teamMemberId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get token to revoke
        const { data: tokenData } = await supabase.from("user_gmail_tokens").select("access_token").eq("team_member_id", teamMemberId).single();
        // Delete from database
        const { error } = await supabase.from("user_gmail_tokens").delete().eq("team_member_id", teamMemberId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        // Revoke token with Google (best effort)
        if (tokenData?.access_token) {
            try {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
                    method: "POST"
                });
            } catch  {
                console.warn("[Gmail] User token revocation request failed (non-critical)");
            }
        }
        console.log(`[Gmail] Disconnected Gmail for team member ${teamMemberId}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function fetchUserInbox(teamMemberId, maxResults = 50, pageToken) {
    try {
        const tokens = await getUserGmailTokens(teamMemberId);
        if (!tokens) {
            return {
                messages: [],
                error: "Gmail not connected for this user"
            };
        }
        // Build query parameters
        const params = new URLSearchParams({
            maxResults: maxResults.toString(),
            q: "in:inbox",
            ...pageToken && {
                pageToken
            }
        });
        // List messages
        const listResponse = await fetch(`${GMAIL_API_URL}/users/me/messages?${params}`, {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            console.error(`[Gmail] Inbox fetch failed: ${listResponse.status}`, errorText);
            return {
                messages: [],
                error: `API error: ${listResponse.status}`
            };
        }
        const listData = await listResponse.json();
        const messageIds = listData.messages || [];
        const messages = [];
        // Fetch full message details for each message
        for (const msgRef of messageIds){
            const msgResponse = await fetch(`${GMAIL_API_URL}/users/me/messages/${msgRef.id}`, {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`
                }
            });
            if (msgResponse.ok) {
                const msgData = await msgResponse.json();
                messages.push(msgData);
            }
        }
        return {
            messages,
            nextPageToken: listData.nextPageToken
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[Gmail] Inbox fetch error:", message);
        return {
            messages: [],
            error: message
        };
    }
}
/**
 * Parse Gmail message to structured format
 */ function parseGmailMessage(message) {
    const headers = message.payload.headers;
    const getHeader = (name)=>headers.find((h)=>h.name.toLowerCase() === name.toLowerCase())?.value || "";
    const from = getHeader("From");
    const to = getHeader("To").split(",").map((e)=>e.trim()).filter(Boolean);
    const cc = getHeader("Cc")?.split(",").map((e)=>e.trim()).filter(Boolean);
    const subject = getHeader("Subject");
    // Extract body content
    let textBody;
    let htmlBody;
    const extractBody = (part)=>{
        if (part.mimeType === "text/plain" && part.body?.data) {
            textBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        } else if (part.mimeType === "text/html" && part.body?.data) {
            htmlBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
        if (part.parts) {
            part.parts.forEach(extractBody);
        }
    };
    if (message.payload.parts) {
        message.payload.parts.forEach(extractBody);
    } else if (message.payload.body?.data) {
        // Single part message
        if (message.payload.mimeType === "text/plain") {
            textBody = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
        } else if (message.payload.mimeType === "text/html") {
            htmlBody = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
        }
    }
    return {
        gmailMessageId: message.id,
        gmailThreadId: message.threadId,
        from,
        to,
        cc,
        subject,
        textBody,
        htmlBody,
        receivedAt: new Date(parseInt(message.internalDate)),
        hasAttachments: message.payload.parts?.some((p)=>p.body.size > 0 && p.mimeType.startsWith("attachment/")) || false,
        labels: message.labelIds
    };
}
async function storeGmailMessage(companyId, teamMemberId, emailAccountId, parsedMessage) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Check if message already exists
        const { data: existing } = await supabase.from("communications").select("id").eq("gmail_message_id", parsedMessage.gmailMessageId).maybeSingle();
        if (existing) {
            return {
                success: true,
                communicationId: existing.id
            };
        }
        // Extract customer email from "from" field
        const fromEmail = parsedMessage.from.match(/<(.+?)>/)?.[1] || parsedMessage.from;
        // Try to find customer by email
        const { data: customer } = await supabase.from("customers").select("id").eq("company_id", companyId).eq("email", fromEmail).maybeSingle();
        // Insert communication
        const { data: communication, error } = await supabase.from("communications").insert({
            company_id: companyId,
            type: "email",
            direction: "inbound",
            status: "received",
            from_address: fromEmail,
            to_address: parsedMessage.to[0] || "",
            subject: parsedMessage.subject,
            body: parsedMessage.htmlBody || parsedMessage.textBody || "",
            customer_id: customer?.id || null,
            mailbox_owner_id: teamMemberId,
            email_account_id: emailAccountId,
            visibility_scope: "private",
            gmail_message_id: parsedMessage.gmailMessageId,
            gmail_thread_id: parsedMessage.gmailThreadId
        }).select("id").single();
        if (error) {
            console.error("[Gmail] Failed to store message:", error.message);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            communicationId: communication.id
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function syncUserInbox(companyId, teamMemberId) {
    const startTime = new Date();
    let messagesFetched = 0;
    let messagesStored = 0;
    const errors = [];
    let syncLock = null;
    try {
        // Check rate limit before syncing (CRITICAL SAFEGUARD)
        const rateLimitCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkSyncRateLimit"])(teamMemberId);
        if (!rateLimitCheck.allowed) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_rate_limited", {
                teamMemberId,
                retryAfter: rateLimitCheck.retryAfter
            }, "warning");
            return {
                success: false,
                messagesFetched: 0,
                messagesStored: 0,
                errors: [
                    rateLimitCheck.reason || "Rate limit exceeded"
                ],
                lastSyncedAt: startTime
            };
        }
        // Acquire sync lock to prevent concurrent syncs
        syncLock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["acquireSyncLock"])(teamMemberId);
        if (!syncLock) {
            return {
                success: false,
                messagesFetched: 0,
                messagesStored: 0,
                errors: [
                    "Could not acquire sync lock - another sync may be in progress"
                ],
                lastSyncedAt: startTime
            };
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_started", {
            teamMemberId
        }, "info");
        const tokens = await getUserGmailTokens(teamMemberId);
        if (!tokens) {
            return {
                success: false,
                messagesFetched: 0,
                messagesStored: 0,
                errors: [
                    "Gmail not connected"
                ],
                lastSyncedAt: startTime
            };
        }
        // Fetch messages since last sync (or all if never synced)
        let pageToken;
        let hasMore = true;
        while(hasMore){
            const { messages, nextPageToken, error } = await fetchUserInbox(teamMemberId, 50, pageToken);
            if (error) {
                errors.push(error);
                break;
            }
            messagesFetched += messages.length;
            // Store each message
            for (const message of messages){
                const parsed = parseGmailMessage(message);
                const { success, error: storeError } = await storeGmailMessage(companyId, teamMemberId, tokens.emailAccountId, parsed);
                if (success) {
                    messagesStored++;
                } else if (storeError) {
                    errors.push(storeError);
                }
            }
            // Continue to next page if available
            pageToken = nextPageToken;
            hasMore = !!nextPageToken && messages.length > 0;
        }
        // Update last synced timestamp
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("user_gmail_tokens").update({
            last_synced_at: startTime.toISOString()
        }).eq("team_member_id", teamMemberId);
        console.log(`[Gmail] Synced ${messagesStored}/${messagesFetched} messages for team member ${teamMemberId}`);
        // Log successful sync
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_completed", {
            teamMemberId,
            syncMessageCount: messagesStored
        }, "info");
        return {
            success: errors.length === 0,
            messagesFetched,
            messagesStored,
            errors,
            lastSyncedAt: startTime
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errors.push(message);
        // Log failed sync
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_failed", {
            teamMemberId,
            error: message
        }, "error");
        return {
            success: false,
            messagesFetched,
            messagesStored,
            errors,
            lastSyncedAt: startTime
        };
    } finally{
        // Always release sync lock (CRITICAL)
        if (syncLock) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["releaseSyncLock"])(syncLock);
        }
    }
}
async function isGmailIntegrationEnabled() {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && ("TURBOPACK compile-time value", "http://localhost:3000"));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCompanyEmailProvider,
    setCompanyEmailProvider,
    getCompanyGmailTokens,
    refreshCompanyGmailToken,
    storeCompanyGmailTokens,
    disconnectCompanyGmail,
    sendCompanyGmailEmail,
    checkCompanyGmailHealth,
    getUserGmailTokens,
    refreshUserGmailToken,
    storeUserGmailTokens,
    disconnectUserGmail,
    fetchUserInbox,
    storeGmailMessage,
    syncUserInbox,
    isGmailIntegrationEnabled
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyEmailProvider, "40b41f81fe9259fafce704bbd3935f68276fc4e2ca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setCompanyEmailProvider, "701eda529738b7cb8db9c89a5a499d69941ede094c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyGmailTokens, "40f32c0cfb7780293a18cf77271d2770c0d61fe547", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(refreshCompanyGmailToken, "60afa4f94f55ff80042f81a76c673e75545d27872d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(storeCompanyGmailTokens, "7fa9d4af88bd605b13c48fb4e2937bda4ef2ce0a20", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(disconnectCompanyGmail, "4093292a46f282093734eae84e8bdd79e58274f64f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendCompanyGmailEmail, "60666d082731fc0da1ea78000a7b22b3afbbc989b7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkCompanyGmailHealth, "6028c8a328b5f7616873329b038fce472d56c751d5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserGmailTokens, "402e7af979456c6169a23490efd5611eedb77b7f8d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(refreshUserGmailToken, "607bbb8ec456319d6f212db11b0dad6d62ec6e5cdc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(storeUserGmailTokens, "7e684d0fcd64a86c227a3635ab611c4c140250b6fb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(disconnectUserGmail, "40668734ac0715444771ef63df4ce2328f9e9144e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchUserInbox, "70b8ccf02d177c82841b8a8e25abfece8615b480cf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(storeGmailMessage, "78ce69226fb0c4303ba3e078a1534c86a000dbb744", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(syncUserInbox, "606b9ecbf77951fa1ec76cb2b2d919f43a5335a5f2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isGmailIntegrationEnabled, "0077b5d695a6e4bd1ec48ffe0a639d5f7737bedd9a", null);
}),
"[project]/apps/web/src/lib/email/email-provider.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Provider Abstraction Layer
 *
 * This module provides a unified interface for sending emails through multiple
 * providers (Resend and Postmark) with automatic fallback support.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    Email Provider Layer                         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  1. Try Primary Provider (Resend)                               │
 * │     ├─ Success → Return result, log to monitor                  │
 * │     └─ Failure → Try Fallback                                   │
 * │  2. Try Fallback Provider (Postmark)                            │
 * │     ├─ Success → Return result, log to monitor                  │
 * │     └─ Failure → Return error with both provider failures       │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Features:
 * - Automatic fallback when primary provider fails
 * - Health monitoring for both providers
 * - Unified response format
 * - Comprehensive logging for debugging
 * - Provider-agnostic interface for email operations
 *
 * Usage:
 * ```typescript
 * import { sendEmailWithFallback } from "@/lib/email/email-provider";
 *
 * const result = await sendEmailWithFallback({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 * });
 * ```
 */ __turbopack_context__.s([
    "checkAllProvidersHealth",
    ()=>checkAllProvidersHealth,
    "getBestAvailableProvider",
    ()=>getBestAvailableProvider,
    "getConfiguredProviders",
    ()=>getConfiguredProviders,
    "getProviderSetupInfo",
    ()=>getProviderSetupInfo,
    "isProviderConfigured",
    ()=>isProviderConfigured,
    "logProviderConfiguration",
    ()=>logProviderConfiguration,
    "providerConfig",
    ()=>providerConfig,
    "sendEmailWithFallback",
    ()=>sendEmailWithFallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/postmark-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)");
;
;
;
const providerConfig = {
    /** Primary provider - tried first */ primary: "resend",
    /** Fallback provider - used if primary fails */ fallback: "postmark",
    /** Enable automatic fallback on failure */ enableFallback: true,
    /** Log all provider operations for monitoring */ enableLogging: true,
    /** Retry count before falling back (0 = immediate fallback) */ primaryRetries: 0
};
function isProviderConfigured(provider) {
    switch(provider){
        case "resend":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])();
        case "postmark":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPostmarkConfigured"])();
        default:
            return false;
    }
}
function getConfiguredProviders() {
    const providers = [];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])()) {
        providers.push("resend");
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPostmarkConfigured"])()) {
        providers.push("postmark");
    }
    return providers;
}
function getBestAvailableProvider() {
    if (isProviderConfigured(providerConfig.primary)) {
        return providerConfig.primary;
    }
    if (providerConfig.enableFallback && isProviderConfigured(providerConfig.fallback)) {
        return providerConfig.fallback;
    }
    return null;
}
// =============================================================================
// EMAIL SENDING
// =============================================================================
/**
 * Send email via Resend
 *
 * @param options - Email options
 * @returns Send result
 */ async function sendViaResend(options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"]) {
        return {
            success: false,
            error: "Resend is not configured"
        };
    }
    try {
        // Build tags array for Resend
        const tags = [];
        if (options.tags) {
            for (const [name, value] of Object.entries(options.tags)){
                tags.push({
                    name,
                    value
                });
            }
        }
        if (options.communicationId) {
            tags.push({
                name: "communication_id",
                value: options.communicationId
            });
        }
        // Send via Resend
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"].emails.send({
            from: options.from || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            replyTo: options.replyTo,
            tags: tags.length > 0 ? tags : undefined
        });
        if (error) {
            return {
                success: false,
                error: error.message || "Resend send failed"
            };
        }
        return {
            success: true,
            messageId: data?.id
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Resend send failed"
        };
    }
}
/**
 * Send email via Postmark
 *
 * @param options - Email options
 * @returns Send result
 */ async function sendViaPostmark(options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPostmarkConfigured"])()) {
        return {
            success: false,
            error: "Postmark is not configured"
        };
    }
    try {
        // Convert tags to Postmark metadata format
        const metadata = {
            ...options.tags
        };
        if (options.communicationId) {
            metadata.communication_id = options.communicationId;
        }
        if (options.companyId) {
            metadata.company_id = options.companyId;
        }
        // Determine tag (Postmark only supports one tag per email)
        const tag = options.tags?.template || options.tags?.type || "transactional";
        // Send via Postmark
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendPostmarkEmail"])({
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            from: options.from || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postmarkConfig"].from,
            replyTo: options.replyTo,
            tag,
            metadata
        });
        if (!result.success) {
            return {
                success: false,
                error: result.error
            };
        }
        return {
            success: true,
            messageId: result.data.MessageID
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Postmark send failed"
        };
    }
}
/**
 * Send email via Gmail (company's connected Gmail account)
 *
 * @param companyId - Company ID with connected Gmail
 * @param options - Email options
 * @returns Send result
 */ async function sendViaGmail(companyId, options) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendCompanyGmailEmail"])(companyId, {
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            replyTo: options.replyTo,
            cc: options.cc,
            bcc: options.bcc
        });
        if (!result.success) {
            return {
                success: false,
                error: result.error
            };
        }
        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Gmail send failed"
        };
    }
}
/**
 * Check if Gmail is available for a company
 *
 * @param companyId - Company ID to check
 * @returns Whether Gmail is available and configured
 */ async function isCompanyGmailAvailable(companyId) {
    try {
        // Check if Gmail integration is enabled globally
        if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isGmailIntegrationEnabled"])()) {
            return false;
        }
        const tokens = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyGmailTokens"])(companyId);
        return tokens !== null && tokens.isValid;
    } catch  {
        return false;
    }
}
async function sendEmailWithFallback(options) {
    const attempts = [];
    const recipient = Array.isArray(options.to) ? options.to.join(", ") : options.to;
    // Log the send attempt
    if (providerConfig.enableLogging) {
        console.log(`[EmailProvider] Sending email to ${recipient}, subject: "${options.subject}"`);
    }
    // ==========================================================================
    // COMPANY EMAIL PROVIDER CHECK (Multi-Tenant)
    // ==========================================================================
    // Each company (tenant) can choose:
    // - 'managed': Use our Resend/Postmark providers
    // - 'gmail': Use their connected Gmail account
    // - 'disabled': Email is disabled for this company
    if (options.companyId) {
        const companyPreference = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyEmailProvider"])(options.companyId);
        // Handle disabled - company has turned off email
        if (companyPreference === "disabled") {
            if (providerConfig.enableLogging) {
                console.log(`[EmailProvider] Company ${options.companyId} has email disabled`);
            }
            return {
                success: false,
                error: "Email is disabled for this company",
                usedFallback: false,
                attempts: []
            };
        }
        // Handle Gmail preference
        if (companyPreference === "gmail") {
            const gmailAvailable = await isCompanyGmailAvailable(options.companyId);
            if (gmailAvailable) {
                const startTime = Date.now();
                if (providerConfig.enableLogging) {
                    console.log(`[EmailProvider] Company ${options.companyId} prefers Gmail, attempting Gmail send...`);
                }
                const result = await sendViaGmail(options.companyId, options);
                const latencyMs = Date.now() - startTime;
                attempts.push({
                    provider: "gmail",
                    success: result.success,
                    messageId: result.messageId,
                    error: result.error,
                    latencyMs
                });
                if (result.success) {
                    if (providerConfig.enableLogging) {
                        console.log(`[EmailProvider] ✓ Gmail send succeeded in ${latencyMs}ms, messageId: ${result.messageId}`);
                    }
                    return {
                        success: true,
                        provider: "gmail",
                        messageId: result.messageId,
                        usedFallback: false,
                        attempts
                    };
                }
                // Gmail failed - fall through to managed providers
                if (providerConfig.enableLogging) {
                    console.warn(`[EmailProvider] ✗ Gmail send failed in ${latencyMs}ms: ${result.error}`);
                    console.log("[EmailProvider] Falling back to managed providers...");
                }
            } else {
                if (providerConfig.enableLogging) {
                    console.log(`[EmailProvider] Company ${options.companyId} prefers Gmail but no valid tokens, using managed providers`);
                }
            }
        }
    }
    // ==========================================================================
    // MANAGED PROVIDERS: Primary (Resend) → Fallback (Postmark)
    // ==========================================================================
    // ==========================================================================
    // ATTEMPT 1: Primary Provider (Resend)
    // ==========================================================================
    if (isProviderConfigured(providerConfig.primary)) {
        const startTime = Date.now();
        if (providerConfig.enableLogging) {
            console.log(`[EmailProvider] Trying primary provider: ${providerConfig.primary}`);
        }
        const result = providerConfig.primary === "resend" ? await sendViaResend(options) : await sendViaPostmark(options);
        const latencyMs = Date.now() - startTime;
        attempts.push({
            provider: providerConfig.primary,
            success: result.success,
            messageId: result.messageId,
            error: result.error,
            latencyMs
        });
        // If primary succeeded, return immediately
        if (result.success) {
            if (providerConfig.enableLogging) {
                console.log(`[EmailProvider] ✓ Primary provider succeeded in ${latencyMs}ms, messageId: ${result.messageId}`);
            }
            return {
                success: true,
                provider: providerConfig.primary,
                messageId: result.messageId,
                usedFallback: false,
                attempts
            };
        }
        // Primary failed
        if (providerConfig.enableLogging) {
            console.warn(`[EmailProvider] ✗ Primary provider failed in ${latencyMs}ms: ${result.error}`);
        }
    } else {
        if (providerConfig.enableLogging) {
            console.warn(`[EmailProvider] Primary provider (${providerConfig.primary}) not configured`);
        }
    }
    // ==========================================================================
    // ATTEMPT 2: Fallback Provider (Postmark)
    // ==========================================================================
    if (providerConfig.enableFallback && isProviderConfigured(providerConfig.fallback)) {
        const startTime = Date.now();
        if (providerConfig.enableLogging) {
            console.log(`[EmailProvider] Trying fallback provider: ${providerConfig.fallback}`);
        }
        const result = providerConfig.fallback === "postmark" ? await sendViaPostmark(options) : await sendViaResend(options);
        const latencyMs = Date.now() - startTime;
        attempts.push({
            provider: providerConfig.fallback,
            success: result.success,
            messageId: result.messageId,
            error: result.error,
            latencyMs
        });
        // If fallback succeeded, return
        if (result.success) {
            if (providerConfig.enableLogging) {
                console.log(`[EmailProvider] ✓ Fallback provider succeeded in ${latencyMs}ms, messageId: ${result.messageId}`);
            }
            return {
                success: true,
                provider: providerConfig.fallback,
                messageId: result.messageId,
                usedFallback: true,
                attempts
            };
        }
        // Fallback also failed
        if (providerConfig.enableLogging) {
            console.error(`[EmailProvider] ✗ Fallback provider also failed in ${latencyMs}ms: ${result.error}`);
        }
    } else if (providerConfig.enableFallback) {
        if (providerConfig.enableLogging) {
            console.warn(`[EmailProvider] Fallback provider (${providerConfig.fallback}) not configured`);
        }
    }
    // ==========================================================================
    // ALL PROVIDERS FAILED
    // ==========================================================================
    const errors = attempts.map((a)=>`${a.provider}: ${a.error}`).join("; ");
    if (providerConfig.enableLogging) {
        console.error(`[EmailProvider] ✗ All providers failed: ${errors}`);
    }
    return {
        success: false,
        error: `All email providers failed. ${errors}`,
        usedFallback: attempts.length > 1,
        attempts
    };
}
// =============================================================================
// HEALTH CHECKS
// =============================================================================
/**
 * Check health of Resend provider
 *
 * @returns Health status
 */ async function checkResendHealth() {
    const startTime = Date.now();
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"]) {
        return {
            provider: "resend",
            healthy: false,
            latencyMs: 0,
            lastChecked: new Date(),
            error: "Resend is not configured"
        };
    }
    try {
        // Resend doesn't have a dedicated health endpoint
        // We'll list domains as a health check (lightweight operation)
        const response = await fetch("https://api.resend.com/domains", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        const latencyMs = Date.now() - startTime;
        if (response.ok) {
            console.log(`[EmailProvider] Resend health check passed in ${latencyMs}ms`);
            return {
                provider: "resend",
                healthy: true,
                latencyMs,
                lastChecked: new Date()
            };
        }
        const error = await response.text();
        console.error(`[EmailProvider] Resend health check failed: ${error}`);
        return {
            provider: "resend",
            healthy: false,
            latencyMs,
            lastChecked: new Date(),
            error: `HTTP ${response.status}: ${error}`
        };
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[EmailProvider] Resend health check error: ${errorMessage}`);
        return {
            provider: "resend",
            healthy: false,
            latencyMs,
            lastChecked: new Date(),
            error: errorMessage
        };
    }
}
async function checkAllProvidersHealth() {
    console.log("[EmailProvider] Checking health of all providers...");
    const results = {
        primary: null,
        fallback: null,
        recommendedProvider: null
    };
    // Check primary (Resend)
    if (isProviderConfigured("resend")) {
        results.primary = await checkResendHealth();
    }
    // Check fallback (Postmark)
    if (isProviderConfigured("postmark")) {
        const postmarkHealth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkPostmarkHealth"])();
        results.fallback = {
            provider: "postmark",
            healthy: postmarkHealth.healthy,
            latencyMs: postmarkHealth.latencyMs,
            lastChecked: new Date(),
            error: postmarkHealth.error
        };
    }
    // Determine recommended provider based on health
    if (results.primary?.healthy) {
        results.recommendedProvider = "resend";
    } else if (results.fallback?.healthy) {
        results.recommendedProvider = "postmark";
    }
    console.log(`[EmailProvider] Health check complete. Primary: ${results.primary?.healthy ? "healthy" : "unhealthy"}, Fallback: ${results.fallback?.healthy ? "healthy" : "unhealthy"}, Recommended: ${results.recommendedProvider || "none"}`);
    return results;
}
function getProviderSetupInfo() {
    const primaryConfigured = isProviderConfigured(providerConfig.primary);
    const fallbackConfigured = isProviderConfigured(providerConfig.fallback);
    const configuredProviders = getConfiguredProviders();
    let status;
    if (primaryConfigured && fallbackConfigured) {
        status = "fully_configured";
    } else if (primaryConfigured) {
        status = "primary_only";
    } else if (fallbackConfigured) {
        status = "fallback_only";
    } else {
        status = "not_configured";
    }
    return {
        primaryConfigured,
        fallbackConfigured,
        fallbackEnabled: providerConfig.enableFallback,
        configuredProviders,
        status
    };
}
function logProviderConfiguration() {
    const info = getProviderSetupInfo();
    console.log("=".repeat(60));
    console.log("[EmailProvider] Configuration Summary");
    console.log("=".repeat(60));
    console.log(`Primary Provider: ${providerConfig.primary} (${info.primaryConfigured ? "✓ configured" : "✗ not configured"})`);
    console.log(`Fallback Provider: ${providerConfig.fallback} (${info.fallbackConfigured ? "✓ configured" : "✗ not configured"})`);
    console.log(`Fallback Enabled: ${info.fallbackEnabled ? "Yes" : "No"}`);
    console.log(`Status: ${info.status}`);
    console.log(`Configured Providers: ${info.configuredProviders.join(", ") || "none"}`);
    console.log("=".repeat(60));
}
}),
"[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00faa648440817b6eb791efa3ac3f6799aadfc9c34":"getProviderHealthDashboard","409b5721717e9390fdc0497fb59a8e8288ce7e42eb":"recordProviderEvent","40e70ff533f92b7e4f1d73f0ee5ca1fb5976d2a7b7":"checkProviderAlert","40f62a25c31b2883789933798d9582364eb2054b33":"cleanupOldEvents","600d8ab2284910a9b02d01729982f3d70069af430f":"getProviderStats","781dfc9673db486fe6aca86ae42d62ed8772859573":"recordFallbackTriggered","784c581679ff185a1c20eb49054e2d9cb65647d043":"recordSendSuccess","7856b878a603663b87a02cbc0e54b6231beee483cb":"recordSendFailure"},"",""] */ __turbopack_context__.s([
    "checkProviderAlert",
    ()=>checkProviderAlert,
    "cleanupOldEvents",
    ()=>cleanupOldEvents,
    "getProviderHealthDashboard",
    ()=>getProviderHealthDashboard,
    "getProviderStats",
    ()=>getProviderStats,
    "recordFallbackTriggered",
    ()=>recordFallbackTriggered,
    "recordProviderEvent",
    ()=>recordProviderEvent,
    "recordSendFailure",
    ()=>recordSendFailure,
    "recordSendSuccess",
    ()=>recordSendSuccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Email Provider Monitor
 *
 * This module tracks the health and performance of email providers (Resend & Postmark).
 * It records every email send attempt and provides analytics for monitoring.
 *
 * Features:
 * - Track success/failure rates per provider
 * - Record latency metrics
 * - Store detailed error information
 * - Provide real-time health dashboards
 * - Alert on provider degradation
 *
 * Database Tables Used:
 * - email_provider_events: Individual send attempts
 * - email_provider_health: Aggregated health metrics (updated periodically)
 *
 * Usage:
 * ```typescript
 * // Record a successful send
 * await recordProviderEvent({
 *   provider: "resend",
 *   eventType: "send_success",
 *   messageId: "abc123",
 *   latencyMs: 150,
 * });
 *
 * // Get provider health stats
 * const stats = await getProviderStats("resend", "24h");
 * ```
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function recordProviderEvent(event) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Log to console for immediate visibility
        const logPrefix = event.eventType.includes("success") ? "✓" : "✗";
        console.log(`[ProviderMonitor] ${logPrefix} ${event.provider}:${event.eventType}` + (event.latencyMs ? ` (${event.latencyMs}ms)` : "") + (event.error ? ` - ${event.error}` : ""));
        // Insert event into database
        const { error } = await supabase.from("email_provider_events").insert({
            provider: event.provider,
            event_type: event.eventType,
            message_id: event.messageId || null,
            latency_ms: event.latencyMs || null,
            error_message: event.error || null,
            metadata: event.metadata || null,
            company_id: event.companyId || null,
            domain_id: event.domainId || null,
            created_at: new Date().toISOString()
        });
        if (error) {
            // Don't fail the main operation if monitoring fails
            console.error(`[ProviderMonitor] Failed to record event: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true
        };
    } catch (error) {
        // Monitoring should never break the main flow
        console.error(`[ProviderMonitor] Error recording event: ${error instanceof Error ? error.message : "Unknown error"}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function recordSendSuccess(provider, messageId, latencyMs, options) {
    await recordProviderEvent({
        provider,
        eventType: "send_success",
        messageId,
        latencyMs,
        ...options
    });
}
async function recordSendFailure(provider, error, latencyMs, options) {
    await recordProviderEvent({
        provider,
        eventType: "send_failure",
        error,
        latencyMs,
        ...options
    });
}
async function recordFallbackTriggered(primaryProvider, fallbackProvider, primaryError, options) {
    await recordProviderEvent({
        provider: primaryProvider,
        eventType: "fallback_triggered",
        error: primaryError,
        metadata: {
            fallback_provider: fallbackProvider,
            ...options?.metadata
        },
        ...options
    });
}
async function getProviderStats(provider, period = "24h") {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Calculate start time based on period
        const now = new Date();
        const periodMs = {
            "1h": 60 * 60 * 1000,
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
            "30d": 30 * 24 * 60 * 60 * 1000
        };
        const startTime = new Date(now.getTime() - periodMs[period]).toISOString();
        // Query events for this provider and period
        const { data: events, error } = await supabase.from("email_provider_events").select("event_type, latency_ms, error_message, created_at").eq("provider", provider).gte("created_at", startTime).order("created_at", {
            ascending: false
        });
        if (error) {
            console.error(`[ProviderMonitor] Failed to get stats: ${error.message}`);
            return null;
        }
        if (!events || events.length === 0) {
            return {
                provider,
                period,
                totalEvents: 0,
                successCount: 0,
                failureCount: 0,
                successRate: 0,
                averageLatencyMs: 0,
                p95LatencyMs: 0,
                fallbackCount: 0,
                lastEventAt: null,
                lastError: null
            };
        }
        // Calculate statistics
        const sendEvents = events.filter((e)=>e.event_type === "send_success" || e.event_type === "send_failure");
        const successEvents = events.filter((e)=>e.event_type === "send_success");
        const failureEvents = events.filter((e)=>e.event_type === "send_failure");
        const fallbackEvents = events.filter((e)=>e.event_type === "fallback_triggered");
        // Calculate latency metrics
        const latencies = successEvents.map((e)=>e.latency_ms).filter((l)=>l !== null).sort((a, b)=>a - b);
        const avgLatency = latencies.length > 0 ? latencies.reduce((sum, l)=>sum + l, 0) / latencies.length : 0;
        const p95Index = Math.floor(latencies.length * 0.95);
        const p95Latency = latencies.length > 0 ? latencies[p95Index] || latencies[latencies.length - 1] : 0;
        // Find last error
        const lastFailure = failureEvents[0];
        return {
            provider,
            period,
            totalEvents: events.length,
            successCount: successEvents.length,
            failureCount: failureEvents.length,
            successRate: sendEvents.length > 0 ? successEvents.length / sendEvents.length * 100 : 0,
            averageLatencyMs: Math.round(avgLatency),
            p95LatencyMs: Math.round(p95Latency),
            fallbackCount: fallbackEvents.length,
            lastEventAt: events[0] ? new Date(events[0].created_at) : null,
            lastError: lastFailure?.error_message || null
        };
    } catch (error) {
        console.error(`[ProviderMonitor] Error getting stats: ${error instanceof Error ? error.message : "Unknown error"}`);
        return null;
    }
}
async function getProviderHealthDashboard() {
    console.log("[ProviderMonitor] Getting health dashboard data...");
    // Get stats for both providers
    const [resendStats, postmarkStats] = await Promise.all([
        getProviderStats("resend", "24h"),
        getProviderStats("postmark", "24h")
    ]);
    // Determine health status based on success rate
    const getStatus = (stats)=>{
        if (!stats || stats.totalEvents === 0) return "unknown";
        if (stats.successRate >= 99) return "healthy";
        if (stats.successRate >= 95) return "degraded";
        return "down";
    };
    // Calculate fallback rate
    const totalFallbacks = (resendStats?.fallbackCount || 0) + (postmarkStats?.fallbackCount || 0);
    const totalSends = (resendStats?.successCount || 0) + (resendStats?.failureCount || 0) + (postmarkStats?.successCount || 0) + (postmarkStats?.failureCount || 0);
    const fallbackRate = totalSends > 0 ? totalFallbacks / totalSends * 100 : 0;
    // Determine recommended action
    let recommendedAction;
    const resendStatus = getStatus(resendStats);
    const postmarkStatus = getStatus(postmarkStats);
    if (resendStatus === "down" && postmarkStatus === "down") {
        recommendedAction = "CRITICAL: Both providers are down. Check API keys and provider status.";
    } else if (resendStatus === "down") {
        recommendedAction = "Primary provider (Resend) is down. Traffic is using fallback.";
    } else if (fallbackRate > 10) {
        recommendedAction = "High fallback rate detected. Review primary provider health.";
    } else if (resendStatus === "degraded") {
        recommendedAction = "Primary provider showing degraded performance. Monitor closely.";
    }
    return {
        resend: {
            status: resendStatus,
            successRate24h: resendStats?.successRate || 0,
            avgLatencyMs: resendStats?.averageLatencyMs || 0,
            totalSent24h: resendStats?.successCount || 0,
            lastError: resendStats?.lastError || undefined,
            lastSuccessAt: resendStats?.lastEventAt || undefined
        },
        postmark: {
            status: postmarkStatus,
            successRate24h: postmarkStats?.successRate || 0,
            avgLatencyMs: postmarkStats?.averageLatencyMs || 0,
            totalSent24h: postmarkStats?.successCount || 0,
            lastError: postmarkStats?.lastError || undefined,
            lastSuccessAt: postmarkStats?.lastEventAt || undefined
        },
        overall: {
            primaryProvider: "resend",
            fallbackProvider: "postmark",
            fallbackRate24h: fallbackRate,
            recommendedAction
        }
    };
}
async function cleanupOldEvents(retentionDays = 30) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        const { data, error } = await supabase.from("email_provider_events").delete().lt("created_at", cutoffDate.toISOString()).select("id");
        if (error) {
            console.error(`[ProviderMonitor] Cleanup failed: ${error.message}`);
            return {
                deleted: 0,
                error: error.message
            };
        }
        const deletedCount = data?.length || 0;
        console.log(`[ProviderMonitor] Cleaned up ${deletedCount} events older than ${retentionDays} days`);
        return {
            deleted: deletedCount
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[ProviderMonitor] Cleanup error: ${errorMessage}`);
        return {
            deleted: 0,
            error: errorMessage
        };
    }
}
async function checkProviderAlert(provider) {
    const stats = await getProviderStats(provider, "1h");
    if (!stats) {
        return {
            shouldAlert: false,
            severity: "info"
        };
    }
    // No events in the last hour - might be expected during low traffic
    if (stats.totalEvents === 0) {
        return {
            shouldAlert: false,
            severity: "info"
        };
    }
    // Critical: Success rate below 90%
    if (stats.successRate < 90) {
        return {
            shouldAlert: true,
            severity: "critical",
            reason: `${provider} success rate is ${stats.successRate.toFixed(1)}% (below 90%)`
        };
    }
    // Warning: Success rate below 99%
    if (stats.successRate < 99) {
        return {
            shouldAlert: true,
            severity: "warning",
            reason: `${provider} success rate is ${stats.successRate.toFixed(1)}% (below 99%)`
        };
    }
    // Warning: High latency
    if (stats.averageLatencyMs > 5000) {
        return {
            shouldAlert: true,
            severity: "warning",
            reason: `${provider} average latency is ${stats.averageLatencyMs}ms (above 5s)`
        };
    }
    return {
        shouldAlert: false,
        severity: "info"
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    recordProviderEvent,
    recordSendSuccess,
    recordSendFailure,
    recordFallbackTriggered,
    getProviderStats,
    getProviderHealthDashboard,
    cleanupOldEvents,
    checkProviderAlert
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordProviderEvent, "409b5721717e9390fdc0497fb59a8e8288ce7e42eb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordSendSuccess, "784c581679ff185a1c20eb49054e2d9cb65647d043", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordSendFailure, "7856b878a603663b87a02cbc0e54b6231beee483cb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordFallbackTriggered, "781dfc9673db486fe6aca86ae42d62ed8772859573", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProviderStats, "600d8ab2284910a9b02d01729982f3d70069af430f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProviderHealthDashboard, "00faa648440817b6eb791efa3ac3f6799aadfc9c34", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cleanupOldEvents, "40f62a25c31b2883789933798d9582364eb2054b33", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkProviderAlert, "40e70ff533f92b7e4f1d73f0ee5ca1fb5976d2a7b7", null);
}),
"[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Email Sender - Type-safe email sending utilities
 *
 * CRITICAL RULE - Reply-To Addresses:
 * ====================================
 * Reply-to ALWAYS uses the company's platform subdomain (mail.thorbis.com),
 * regardless of which email provider or sending method is used.
 *
 * Examples:
 * - FROM: notifications@acme.mail.thorbis.com → REPLY-TO: support@acme.mail.thorbis.com
 * - FROM: notifications@acme-plumbing.com (custom) → REPLY-TO: support@acme.mail.thorbis.com
 * - FROM: john@gmail.com (personal) → REPLY-TO: support@acme.mail.thorbis.com
 *
 * See: /docs/email/REPLY_TO_ARCHITECTURE.md for full details
 *
 * Features:
 * - Type-safe email sending with validation
 * - Development mode logging
 * - Error handling and logging
 * - Email logging to database
 * - Retry logic for failed sends
 * - Per-company rate limiting
 * - Deliverability monitoring
 */ /* __next_internal_action_entry_do_not_use__ [{"4045fd66fd12d1ad15f17f3d1f2568de874cc6fe03":"sendEmail","60f3c70ab599823c9a6057a8809a3f49da02ad41ca":"handleComplaintWebhook","786c50dbddde0ade87252ff3556bd12a05815d3db8":"handleBounceWebhook"},"",""] */ __turbopack_context__.s([
    "handleBounceWebhook",
    ()=>handleBounceWebhook,
    "handleComplaintWebhook",
    ()=>handleComplaintWebhook,
    "sendEmail",
    ()=>sendEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@react-email/render/dist/node/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$pre$2d$send$2d$checks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
// =============================================================================
// MULTI-PROVIDER SUPPORT (Resend primary, Postmark fallback)
// =============================================================================
// Provider abstraction layer - handles automatic fallback when primary fails
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$provider$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-provider.ts [app-rsc] (ecmascript)");
// Provider monitoring - tracks success rates, latency for both providers
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
async function sendEmail({ to, subject, template, templateType, replyTo, tags = [], companyId, communicationId, fromOverride, cc, bcc, attachments, isMarketingEmail = false, skipPreSendChecks = false, textContent = "", unsubscribeUrl, listId }) {
    let activeDomainId = null;
    let companyReplyTo = null;
    let activeDomain = null;
    try {
        // In development, log email instead of sending
        if (__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].isDevelopment) {
            return {
                success: true,
                data: {
                    id: `dev-mode-${Date.now()}`,
                    message: "Email logged in development mode (not actually sent)"
                }
            };
        }
        // Check if at least one email provider is configured
        // We support Resend (primary) and Postmark (fallback)
        const providerInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$provider$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProviderSetupInfo"])();
        if (providerInfo.status === "not_configured") {
            return {
                success: false,
                error: "Email service not configured. Please add RESEND_API_KEY or POSTMARK_API_KEY to environment variables."
            };
        }
        console.log(`[EmailSender] Providers available: ${providerInfo.configuredProviders.join(", ")} (status: ${providerInfo.status})`);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Fetch company email domain to get reply-to configuration
        if (companyId) {
            activeDomain = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyActiveDomain"])(companyId);
            if (!activeDomain) {
                return {
                    success: false,
                    error: "No active email domain configured for this company. Please set up email in settings."
                };
            }
            activeDomainId = activeDomain.domainId;
            // Set reply-to from company's domain configuration
            // If not set, construct default using the company's domain (e.g., support@acme.mail.thorbis.com)
            // This ensures all replies go to the same branded subdomain as the FROM address
            if (activeDomain.replyToEmail) {
                companyReplyTo = activeDomain.replyToEmail;
            } else {
                // Default to support@{company-domain}
                companyReplyTo = `support@${activeDomain.domain}`;
            }
        }
        // Determine final reply-to address
        // Priority: 1) Explicit replyTo parameter, 2) Company's configured reply-to, 3) None
        const finalReplyTo = replyTo || companyReplyTo || undefined;
        // Validate email data (now with proper reply-to)
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailSendSchema"].parse({
            to,
            subject,
            replyTo: finalReplyTo
        });
        // Normalize recipient list
        const recipientEmails = Array.isArray(validatedData.to) ? validatedData.to : [
            validatedData.to
        ];
        // Check rate limits and run pre-send checks if companyId is provided
        if (companyId && activeDomainId) {
            // Check rate limit before incrementing
            const rateLimitCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])(activeDomain.domainId);
            if (!rateLimitCheck.allowed) {
                return {
                    success: false,
                    error: rateLimitCheck.reason || "Rate limit exceeded"
                };
            }
            // Run pre-send deliverability checks (unless skipped for system emails)
            if (!skipPreSendChecks) {
                // Render template early to get HTML for spam check
                const preCheckHtml = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["render"])(template);
                const plainText = textContent || extractTextFromHtml(preCheckHtml);
                const preSendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$pre$2d$send$2d$checks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runPreSendChecks"])(companyId, activeDomain.domainId, recipientEmails, subject, preCheckHtml, plainText, isMarketingEmail);
                // Block if there are critical errors
                if (!preSendResult.allowed) {
                    return {
                        success: false,
                        error: `Deliverability check failed: ${preSendResult.errors.join("; ")}`,
                        data: {
                            spamScore: preSendResult.spamScore,
                            warnings: preSendResult.warnings,
                            suggestions: preSendResult.suggestions
                        }
                    };
                }
                // Filter out suppressed recipients
                const activeRecipients = recipientEmails.filter((email)=>{
                    const status = preSendResult.recipientStatus?.find((r)=>r.email.toLowerCase() === email.toLowerCase());
                    return !status?.suppressed;
                });
                if (activeRecipients.length === 0) {
                    return {
                        success: false,
                        error: "All recipients are on suppression list - no emails sent"
                    };
                }
                // Update validated data with filtered recipients
                if (activeRecipients.length < recipientEmails.length) {
                    validatedData.to = activeRecipients.length === 1 ? activeRecipients[0] : activeRecipients;
                }
                // Log warnings if any (but still send)
                if (preSendResult.warnings.length > 0) {
                    console.warn("[Email Deliverability Warnings]", preSendResult.warnings);
                }
            } else {
                // Even for system emails, check suppression list
                const suppressions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$pre$2d$send$2d$checks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkSuppressionList"])(companyId, recipientEmails);
                const activeRecipients = recipientEmails.filter((email)=>{
                    const status = suppressions.get(email.toLowerCase());
                    return !status?.suppressed;
                });
                if (activeRecipients.length === 0) {
                    return {
                        success: false,
                        error: "All recipients are on suppression list"
                    };
                }
                if (activeRecipients.length < recipientEmails.length) {
                    validatedData.to = activeRecipients.length === 1 ? activeRecipients[0] : activeRecipients;
                }
            }
            // Increment the counter (this also validates limits atomically)
            const incrementResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementEmailCounter"])(activeDomain.domainId);
            if (!incrementResult.allowed) {
                return {
                    success: false,
                    error: incrementResult.reason || "Rate limit exceeded"
                };
            }
        }
        // Determine from identity
        let fromAddress = fromOverride || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].from;
        if (companyId && supabase) {
            const override = await getCompanyEmailIdentity(supabase, companyId);
            if (override) {
                fromAddress = override;
            }
        }
        // Render template to HTML
        let html = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["render"])(template);
        // Add email tracking if communicationId is provided
        if (communicationId) {
            const { addEmailTracking } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/email-tracking.ts [app-rsc] (ecmascript, async loader)");
            html = addEmailTracking(html, communicationId);
        }
        const sendTags = [
            ...tags,
            {
                name: "template",
                value: templateType
            },
            {
                name: "environment",
                value: ("TURBOPACK compile-time value", "development") || "development"
            }
        ];
        if (communicationId) {
            sendTags.push({
                name: "communication_id",
                value: communicationId
            });
        }
        // Add company_id tag for webhook suppression list tracking
        if (companyId) {
            sendTags.push({
                name: "company_id",
                value: companyId
            });
        }
        // Build enhanced headers for better deliverability
        const emailHeaders = {
            // Precedence helps identify transactional vs marketing
            "X-Priority": "3",
            "X-Mailer": "Stratos Email System"
        };
        // Add List-Unsubscribe header for marketing emails (RFC 2369 compliance)
        if (isMarketingEmail && unsubscribeUrl) {
            emailHeaders["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
            emailHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
        }
        // Add List-Id for mailing lists (helps with filtering)
        if (listId) {
            emailHeaders["List-Id"] = listId;
        }
        // Auto-Submitted header for transactional/automated emails
        if (!isMarketingEmail) {
            emailHeaders["Auto-Submitted"] = "auto-generated";
            emailHeaders["Precedence"] = "bulk"; // Prevents auto-replies
        }
        // =======================================================================
        // SEND EMAIL VIA PROVIDER LAYER (Resend → Postmark fallback)
        // =======================================================================
        // Convert tags to Record format for provider layer
        const tagsRecord = {};
        for (const tag of sendTags){
            tagsRecord[tag.name] = tag.value;
        }
        // Track timing for monitoring
        const sendStartTime = Date.now();
        // Send via provider layer (tries Resend first, then Postmark if Resend fails)
        const providerResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$provider$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmailWithFallback"])({
            to: validatedData.to,
            subject: validatedData.subject,
            html,
            text: textContent || extractTextFromHtml(html),
            from: fromAddress,
            replyTo: validatedData.replyTo,
            tags: tagsRecord,
            communicationId,
            companyId,
            cc,
            bcc,
            attachments
        });
        const sendLatencyMs = Date.now() - sendStartTime;
        // =======================================================================
        // RECORD PROVIDER MONITORING EVENTS
        // =======================================================================
        // Track success/failure for each provider attempt (for health dashboard)
        for (const attempt of providerResult.attempts){
            if (attempt.success) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordSendSuccess"])(attempt.provider, attempt.messageId || "", attempt.latencyMs, {
                    companyId,
                    domainId: activeDomainId || undefined,
                    metadata: {
                        template: templateType
                    }
                });
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordSendFailure"])(attempt.provider, attempt.error || "Unknown error", attempt.latencyMs, {
                    companyId,
                    domainId: activeDomainId || undefined,
                    metadata: {
                        template: templateType
                    }
                });
            }
        }
        // Record if fallback was triggered
        if (providerResult.usedFallback && providerResult.success) {
            const primaryAttempt = providerResult.attempts.find((a)=>a.provider === "resend");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordFallbackTriggered"])("resend", "postmark", primaryAttempt?.error || "Primary failed", {
                companyId,
                metadata: {
                    template: templateType
                }
            });
            console.log(`[EmailSender] Used Postmark fallback after Resend failed: ${primaryAttempt?.error}`);
        }
        // =======================================================================
        // HANDLE RESULT
        // =======================================================================
        if (providerResult.success) {
            // SUCCESS: Email sent via one of the providers
            console.log(`[EmailSender] ✓ Email sent via ${providerResult.provider}${providerResult.usedFallback ? " (fallback)" : ""} in ${sendLatencyMs}ms`);
            // Log successful email to database
            try {
                if (supabase) {
                    await supabase.from("email_logs").insert({
                        to: Array.isArray(validatedData.to) ? validatedData.to.join(", ") : validatedData.to,
                        from: fromAddress,
                        subject: validatedData.subject,
                        html_body: html,
                        status: "sent",
                        message_id: providerResult.messageId,
                        company_id: companyId || null,
                        metadata: {
                            template: templateType,
                            tags: sendTags,
                            provider: providerResult.provider,
                            usedFallback: providerResult.usedFallback,
                            latencyMs: sendLatencyMs
                        },
                        sent_at: new Date().toISOString()
                    });
                }
            } catch (_logError) {
            // Don't throw - email was sent successfully even if logging failed
            }
            // Record delivered event for deliverability tracking
            // Note: This is an optimistic record; actual delivery confirmation comes via webhook
            if (activeDomainId) {
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordDeliveryEvent"])({
                        domainId: activeDomainId,
                        eventType: "delivered",
                        emailId: providerResult.messageId,
                        metadata: {
                            template: templateType,
                            provider: providerResult.provider
                        }
                    });
                } catch (_deliverabilityError) {
                // Don't fail the overall operation
                }
            }
            return {
                success: true,
                data: {
                    id: providerResult.messageId,
                    message: `Email sent successfully via ${providerResult.provider}${providerResult.usedFallback ? " (fallback)" : ""}`
                }
            };
        } else {
            // FAILURE: All providers failed
            console.error(`[EmailSender] ✗ All providers failed: ${providerResult.error}`);
            // Log failed email to database for retry queue
            try {
                if (supabase) {
                    await supabase.from("email_logs").insert({
                        to: Array.isArray(validatedData.to) ? validatedData.to.join(", ") : validatedData.to,
                        from: fromAddress,
                        subject: validatedData.subject,
                        html_body: html,
                        status: "failed",
                        error_message: providerResult.error || "All providers failed",
                        company_id: companyId || null,
                        metadata: {
                            template: templateType,
                            tags: sendTags,
                            attempts: providerResult.attempts,
                            latencyMs: sendLatencyMs
                        },
                        retry_count: 0,
                        max_retries: 3,
                        next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
                    });
                }
            } catch (_logError) {}
            // Record bounce event for deliverability tracking
            if (activeDomainId) {
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordDeliveryEvent"])({
                        domainId: activeDomainId,
                        eventType: "bounced",
                        metadata: {
                            error: providerResult.error,
                            template: templateType,
                            attempts: providerResult.attempts.length
                        }
                    });
                } catch (_deliverabilityError) {
                // Don't fail the overall operation
                }
            }
            return {
                success: false,
                error: providerResult.error || "Failed to send email (all providers failed)"
            };
        }
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Invalid email data"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send email"
        };
    }
}
/**
 * Send batch emails (up to 100 at once per Resend limits)
 *
 * Features:
 * - Validates batch size
 * - Sends multiple emails
 * - Returns results for each email
 */ async function sendBatchEmails(emails) {
    if (emails.length > 100) {
        return [
            {
                success: false,
                error: "Cannot send more than 100 emails at once"
            }
        ];
    }
    const results = await Promise.all(emails.map((email)=>sendEmail(email)));
    return results;
}
/**
 * Test email configuration by sending a test email
 *
 * Features:
 * - Validates Resend configuration
 * - Sends test email to specified address
 * - Returns detailed error information
 */ async function testEmailConfiguration(testEmailAddress) {
    try {
        const validatedEmail = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailSendSchema"].shape.to.parse(testEmailAddress);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])()) {
            return {
                success: false,
                error: "Resend API key is not configured"
            };
        }
        // Create a simple test template
        const testTemplate = {
            type: "div",
            props: {
                children: [
                    {
                        type: "h1",
                        props: {
                            children: "Email Configuration Test"
                        }
                    },
                    {
                        type: "p",
                        props: {
                            children: "This is a test email from your Thorbis application."
                        }
                    },
                    {
                        type: "p",
                        props: {
                            children: "If you received this, your email configuration is working correctly!"
                        }
                    }
                ]
            }
        };
        return await sendEmail({
            to: validatedEmail,
            subject: "Test Email - Thorbis Email Configuration",
            template: testTemplate,
            templateType: "welcome",
            tags: [
                {
                    name: "type",
                    value: "test"
                }
            ]
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: "Invalid email address"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Configuration test failed"
        };
    }
}
async function getCompanyEmailIdentity(supabase, companyId) {
    // Get company name first
    const { data: company } = await supabase.from("companies").select("name").eq("id", companyId).single();
    const companyName = company?.name || "Notification";
    // Check company_email_domains table for active sending domain
    // Prioritizes custom domains over platform subdomains
    const { data: domain } = await supabase.from("company_email_domains").select("domain_name, is_platform_subdomain").eq("company_id", companyId).eq("status", "verified").eq("sending_enabled", true).eq("is_suspended", false).order("is_platform_subdomain", {
        ascending: true
    }) // Custom domains first
    .order("created_at", {
        ascending: false
    }).maybeSingle();
    if (domain?.domain_name) {
        // domain_name contains the full domain (e.g., company.mail.stratos.app or mail.custom.com)
        return formatFromAddress(companyName, `notifications@${domain.domain_name}`);
    }
    // Fallback: Check old communication_email_settings (legacy)
    const { data: settings } = await supabase.from("communication_email_settings").select("smtp_from_email, smtp_from_name").eq("company_id", companyId).maybeSingle();
    if (settings?.smtp_from_email) {
        return formatFromAddress(settings.smtp_from_name, settings.smtp_from_email);
    }
    return null;
}
function formatFromAddress(name, email) {
    if (name?.trim()) {
        return `${name} <${email}>`;
    }
    return email;
}
/**
 * Extract plain text from HTML for spam scoring and multipart emails
 */ function extractTextFromHtml(html) {
    // Remove script and style tags with their content
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // Replace block elements with newlines
    text = text.replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n");
    text = text.replace(/<(br|hr)\s*\/?>/gi, "\n");
    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, " ");
    // Decode common HTML entities
    text = text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&mdash;/gi, "—").replace(/&ndash;/gi, "–");
    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/\n\s*\n/g, "\n\n"); // Multiple newlines to double
    return text;
}
async function handleBounceWebhook(companyId, email, bounceType, bounceReason) {
    // Import here to avoid circular dependency
    const { addToSuppressionList, addToGlobalBounceList } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript, async loader)");
    // Add to company suppression list for hard bounces
    if (bounceType === "hard") {
        await addToSuppressionList(companyId, email, "bounce", bounceReason);
    }
    // Add to global bounce list (hard bounces only)
    await addToGlobalBounceList(email, bounceType, bounceReason);
}
async function handleComplaintWebhook(companyId, email) {
    const { addToSuppressionList } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript, async loader)");
    // Always suppress on complaint - user marked as spam
    await addToSuppressionList(companyId, email, "complaint", "User reported email as spam");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendEmail,
    handleBounceWebhook,
    handleComplaintWebhook
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendEmail, "4045fd66fd12d1ad15f17f3d1f2568de874cc6fe03", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleBounceWebhook, "786c50dbddde0ade87252ff3556bd12a05815d3db8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleComplaintWebhook, "60f3c70ab599823c9a6057a8809a3f49da02ad41ca", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Verification Email Utilities
 * Helper functions for sending onboarding verification emails
 *
 * Features:
 * - Send "verification submitted" email
 * - Send "verification complete" email
 * - Type-safe email sending
 * - Company-specific context
 */ /* __next_internal_action_entry_do_not_use__ [{"70ee6c0c90bbedfc55720dd1229b710f17eaa1141d":"sendVerificationSubmittedEmail"},"",""] */ __turbopack_context__.s([
    "sendVerificationSubmittedEmail",
    ()=>sendVerificationSubmittedEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$complete$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/onboarding/verification-complete.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$submitted$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
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
async function sendVerificationSubmittedEmail(companyId, recipientEmail, context) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Fetch company details
        const { data: company, error: companyError } = await supabase.from("companies").select("name").eq("id", companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`
            };
        }
        // Fetch user details (company owner)
        const { data: owner, error: ownerError } = await supabase.from("company_memberships").select("full_name").eq("company_id", companyId).eq("role", "owner").single();
        const contactName = owner?.full_name || "there";
        // Build dashboard URL
        const dashboardUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].appUrl}/dashboard`;
        // Create email template
        const emailTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$submitted$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            companyName: company.name,
            contactName,
            hasTollFreeNumbers: context.hasTollFreeNumbers,
            has10DLCNumbers: context.has10DLCNumbers,
            tollFreeCount: context.tollFreeCount || 0,
            dlcCount: context.dlcCount || 0,
            dashboardUrl
        });
        // Send email
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: recipientEmail,
            subject: `Messaging Verification Submitted - ${company.name}`,
            template: emailTemplate,
            templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].VERIFICATION_SUBMITTED,
            companyId,
            tags: [
                {
                    name: "type",
                    value: "onboarding"
                },
                {
                    name: "verification",
                    value: "submitted"
                }
            ]
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send verification submitted email"
        };
    }
}
/**
 * Send "Verification Complete" email
 * Called when toll-free verification is approved (or all verifications complete)
 *
 * @param companyId - Company UUID
 * @param recipientEmail - Email address to send to
 * @param verificationTypes - Array of verification types that completed (["toll-free", "10dlc"])
 */ async function sendVerificationCompleteEmail(companyId, recipientEmail, verificationTypes) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Fetch company details
        const { data: company, error: companyError } = await supabase.from("companies").select("name").eq("id", companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`
            };
        }
        // Fetch user details (company owner)
        const { data: owner } = await supabase.from("company_memberships").select("full_name").eq("company_id", companyId).eq("role", "owner").single();
        const contactName = owner?.full_name || "there";
        // Build URLs
        const dashboardUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].appUrl}/dashboard`;
        const messagingUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].appUrl}/dashboard/communications/messaging`;
        // Create email template
        const emailTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$complete$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            companyName: company.name,
            contactName,
            verificationTypes,
            dashboardUrl,
            messagingUrl
        });
        // Send email
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: recipientEmail,
            subject: `🎉 Messaging Approved - ${company.name}`,
            template: emailTemplate,
            templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].VERIFICATION_COMPLETE,
            companyId,
            tags: [
                {
                    name: "type",
                    value: "onboarding"
                },
                {
                    name: "verification",
                    value: "complete"
                }
            ]
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send verification complete email"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendVerificationSubmittedEmail
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendVerificationSubmittedEmail, "70ee6c0c90bbedfc55720dd1229b710f17eaa1141d", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/lib/telnyx/account-verification.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Account Verification
 *
 * Utilities for checking Telnyx account verification status.
 * Verification levels:
 * - Level 1: Basic identity verification (1-2 business days)
 * - Level 2: Business verification required for 10DLC (2-5 business days)
 */ __turbopack_context__.s([
    "checkAccountVerificationStatus",
    ()=>checkAccountVerificationStatus,
    "getNextSteps",
    ()=>getNextSteps,
    "getVerificationRequirements",
    ()=>getVerificationRequirements
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/api.ts [app-rsc] (ecmascript)");
;
async function checkAccountVerificationStatus() {
    try {
        // Try to get account verification info
        // Note: Telnyx may not have a direct endpoint for this
        const accountResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])("/account/verifications", {
            method: "GET"
        });
        if (accountResult.success && accountResult.data) {
            const { verifications } = accountResult.data;
            const level1Complete = verifications.identity_verification?.status === "verified";
            const level2Complete = verifications.business_verification?.status === "verified";
            const requirementsRemaining = [];
            let estimatedDays = 0;
            if (!level1Complete) {
                requirementsRemaining.push("Complete Level 1 verification (ID, payment method, contact info)");
                estimatedDays = Math.max(estimatedDays, 2);
            }
            if (!level2Complete) {
                requirementsRemaining.push("Complete Level 2 verification (EIN letter, business license, proof of address)");
                estimatedDays = Math.max(estimatedDays, 5);
            }
            const currentLevel = level2Complete ? "level_2" : level1Complete ? "level_1" : "none";
            return {
                success: true,
                data: {
                    currentLevel,
                    isLevel1Complete: level1Complete,
                    isLevel2Complete: level2Complete,
                    canCreate10DLC: level2Complete,
                    requirementsRemaining,
                    estimatedCompletionDays: requirementsRemaining.length > 0 ? estimatedDays : undefined
                }
            };
        }
        // If direct endpoint doesn't exist, try to infer from 10DLC brand creation
        // This will fail with 403 if not verified
        const brandTestResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])("/10dlc/brand", {
            method: "GET"
        });
        if (brandTestResult.success) {
            // If we can access brands, Level 2 is complete
            return {
                success: true,
                data: {
                    currentLevel: "level_2",
                    isLevel1Complete: true,
                    isLevel2Complete: true,
                    canCreate10DLC: true,
                    requirementsRemaining: []
                }
            };
        }
        // Check the error to determine verification level
        if (brandTestResult.error?.includes("403") || brandTestResult.error?.includes("verification")) {
            // 403 means account exists but not verified for 10DLC
            return {
                success: true,
                data: {
                    currentLevel: "level_1",
                    isLevel1Complete: true,
                    isLevel2Complete: false,
                    canCreate10DLC: false,
                    requirementsRemaining: [
                        "Complete Level 2 verification (EIN letter, business license, proof of address)"
                    ],
                    estimatedCompletionDays: 5
                }
            };
        }
        // Unknown state - assume no verification
        return {
            success: true,
            data: {
                currentLevel: "none",
                isLevel1Complete: false,
                isLevel2Complete: false,
                canCreate10DLC: false,
                requirementsRemaining: [
                    "Complete Level 1 verification (ID, payment method, contact info)",
                    "Complete Level 2 verification (EIN letter, business license, proof of address)"
                ],
                estimatedCompletionDays: 7
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to check verification status"
        };
    }
}
function getVerificationRequirements(currentLevel) {
    return {
        level1: {
            required: currentLevel === "none",
            items: [
                "Valid government-issued ID (Driver's License, Passport, etc.)",
                "Payment method (Credit card or bank account)",
                "Phone number verification",
                "Email verification",
                "Business address confirmation"
            ]
        },
        level2: {
            required: currentLevel === "none" || currentLevel === "level_1",
            items: [
                "IRS EIN Confirmation Letter (CP 575 or 147C)",
                "Business License or Articles of Incorporation",
                "Proof of Business Address (Utility bill, lease agreement)",
                "Government-issued ID for business representative",
                "Tax documents (W-9 or recent tax return)"
            ]
        }
    };
}
function getNextSteps(status) {
    const steps = [];
    if (!status.isLevel1Complete) {
        steps.push({
            step: "Complete Level 1 Verification",
            action: "Visit Telnyx Portal → Account → Public Profile and complete identity verification",
            url: "https://portal.telnyx.com/#/app/account/public-profile"
        });
    }
    if (!status.isLevel2Complete && status.isLevel1Complete) {
        steps.push({
            step: "Complete Level 2 Verification",
            action: "Visit Telnyx Portal → Account → Verifications and upload business documents",
            url: "https://portal.telnyx.com/#/app/account/verifications"
        });
    }
    if (status.canCreate10DLC) {
        steps.push({
            step: "Create 10DLC Brand & Campaign",
            action: "Run automated setup to create 10DLC brand and campaign (fully automated)",
            url: "/test-telnyx-setup"
        });
    }
    return steps;
}
}),
"[project]/apps/web/src/lib/email/email-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0062b36b81ca58cb911ded995003291ef525a90618":"getEmailStats","60123aa2b4520dbc887622c7e6fbbeded0b0b37cb6":"archiveAllEmails","6019495870073129044ac498316bd85aa19870b525":"getCompanyEmails","60259c44809bd76ff945bf89456318b8c3bac84310":"getEmailById","609ae8a078f2bcaa6205ed5538bb26566f062adc23":"getEmailThreads","60bbec0d4d11a4451d0b8d5fd7d29270357baf27b9":"markEmailAsRead"},"",""] */ __turbopack_context__.s([
    "archiveAllEmails",
    ()=>archiveAllEmails,
    "getCompanyEmails",
    ()=>getCompanyEmails,
    "getEmailById",
    ()=>getEmailById,
    "getEmailStats",
    ()=>getEmailStats,
    "getEmailThreads",
    ()=>getEmailThreads,
    "markEmailAsRead",
    ()=>markEmailAsRead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/company-context.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/company-context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getCompanyEmails(companyId, input = {}) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            emails: [],
            total: 0,
            hasMore: false
        };
    }
    const { limit = 50, offset = 0, type = "all", folder, label, search, sortBy = "created_at", sortOrder = "desc" } = input;
    // Build the query - get all emails, we'll filter by channel in memory
    // Note: Using left join for customer to avoid filtering out emails without customers
    let query = supabase.from("communications").select(`
			id,
			from_address,
			from_name,
			to_address,
			subject,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			opened_at,
			clicked_at,
			open_count,
			click_count,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags
		`, {
        count: "exact"
    }).eq("company_id", companyId).eq("type", "email");
    // Apply folder filtering
    if (folder) {
        switch(folder){
            case "inbox":
                // Inbox: inbound, not archived, not deleted, not draft, not spam, not snoozed (or snooze expired)
                query = query.eq("direction", "inbound").eq("is_archived", false).is("deleted_at", null).neq("status", "draft").or("category.is.null,category.neq.spam").or("snoozed_until.is.null,snoozed_until.lt.now()");
                break;
            case "drafts":
                // Drafts: status is draft, not deleted
                query = query.eq("status", "draft").is("deleted_at", null);
                break;
            case "sent":
                // Sent: outbound, not archived, not deleted
                query = query.eq("direction", "outbound").eq("is_archived", false).is("deleted_at", null).neq("status", "draft");
                break;
            case "archive":
                // Archive: is_archived = true, not deleted
                query = query.eq("is_archived", true).is("deleted_at", null);
                break;
            case "snoozed":
                // Snoozed: snoozed_until is not null and in the future, not deleted
                query = query.not("snoozed_until", "is", null).gt("snoozed_until", new Date().toISOString()).is("deleted_at", null);
                break;
            case "spam":
                // Spam: category = 'spam' or tags contains 'spam', not deleted
                // Use separate queries and combine in memory, or use OR with proper syntax
                query = query.or("category.eq.spam").is("deleted_at", null);
                break;
            case "trash":
            case "bin":
                // Trash/Bin: deleted_at is not null
                query = query.not("deleted_at", "is", null);
                break;
            case "starred":
                // Starred: tags contains 'starred', not deleted
                // Note: We'll filter by tags in memory after fetch due to JSONB query limitations
                query = query.is("deleted_at", null);
                break;
            default:
                // Custom folder or label filtering - will be done in memory after fetch
                // (JSONB array containment not supported by PostgREST cs operator)
                query = query.is("deleted_at", null);
                break;
        }
    } else {
        // Default: exclude deleted emails
        query = query.is("deleted_at", null);
    }
    // Filter by direction (if not already filtered by folder)
    if (!folder || folder !== "inbox" && folder !== "sent" && folder !== "drafts") {
        if (type === "sent") {
            query = query.eq("direction", "outbound");
        } else if (type === "received") {
            query = query.eq("direction", "inbound");
        }
    // Note: type === "all" doesn't filter by direction
    }
    // Search filter
    if (search) {
        query = query.or(`subject.ilike.%${search}%,body.ilike.%${search}%,from_address.ilike.%${search}%,to_address.ilike.%${search}%`);
    }
    // Sort
    query = query.order(sortBy, {
        ascending: sortOrder === "asc"
    });
    // Pagination
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) {
        console.error("❌ Error fetching emails:", error);
        console.error("   Company ID:", companyId);
        console.error("   Query filters:", {
            type: "email",
            direction: type
        });
        console.error("   Full error details:", JSON.stringify(error, null, 2));
        return {
            emails: [],
            total: 0,
            hasMore: false
        };
    }
    // Normalize customer data and filter out channel field
    let emails = (data || []).map((email)=>{
        const customer = Array.isArray(email.customer) ? email.customer[0] ?? null : email.customer ?? null;
        // Remove channel from the returned object as it's not part of CompanyEmail type
        const { channel, ...emailData } = email;
        return {
            ...emailData,
            customer
        };
    });
    // Post-process spam filtering
    if (folder === "spam") {
        // Show only spam emails
        emails = emails.filter((email)=>{
            const tags = email.tags || [];
            return email.category === "spam" || tags.includes("spam");
        });
        // Update count for spam after filtering
        const spamCount = emails.length;
        return {
            emails,
            total: spamCount,
            hasMore: spamCount >= limit
        };
    } else if (folder !== "archive") {
        // Exclude spam emails from all folders EXCEPT spam and archive
        // Archive should show ALL archived emails regardless of spam status
        emails = emails.filter((email)=>{
            const tags = email.tags || [];
            const isSpam = email.category === "spam" || tags.includes("spam");
            return !isSpam; // Exclude spam from non-spam, non-archive folders
        });
    }
    // Post-process starred filtering (if folder is starred)
    if (folder === "starred") {
        emails = emails.filter((email)=>{
            const tags = email.tags || [];
            return tags.includes("starred");
        });
        // Update count for starred after filtering
        const starredCount = emails.length;
        return {
            emails,
            total: starredCount,
            hasMore: starredCount >= limit
        };
    }
    // Post-process custom folder/label filtering (JSONB array containment not supported by PostgREST)
    const standardFolders = [
        "inbox",
        "spam",
        "starred",
        "sent",
        "drafts",
        "archive",
        "snoozed",
        "trash",
        "bin"
    ];
    const folderName = label || folder;
    if (folderName && !standardFolders.includes(folderName)) {
        emails = emails.filter((email)=>{
            const tags = email.tags || [];
            return tags.includes(folderName);
        });
        const customCount = emails.length;
        return {
            emails,
            total: customCount,
            hasMore: customCount >= limit
        };
    }
    return {
        emails,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
    };
}
async function getEmailThreads(companyId, input = {}) {
    // For now, return emails grouped by thread
    // This is a simplified implementation
    const result = await getCompanyEmails(companyId, {
        ...input,
        type: "all",
        sortBy: "created_at",
        sortOrder: "desc"
    });
    return {
        threads: result.emails,
        total: result.total,
        hasMore: result.hasMore
    };
}
async function getEmailById(companyId, emailId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase || !companyId) {
        return null;
    }
    const { data, error } = await supabase.from("communications").select(`
			id,
			from_address,
			from_name,
			to_address,
			subject,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status
		`).eq("id", emailId).eq("company_id", companyId).eq("channel", "resend").eq("type", "email").single();
    if (error || !data) {
        return null;
    }
    const customer = Array.isArray(data.customer) ? data.customer[0] ?? null : data.customer ?? null;
    return {
        ...data,
        customer
    };
}
async function markEmailAsRead(companyId, emailId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase || !companyId) {
        console.error("❌ markEmailAsRead: Missing supabase or companyId");
        return false;
    }
    // First, check if the email exists and get its current state
    const { data: existingEmail, error: checkError } = await supabase.from("communications").select("id, company_id, type, read_at").eq("id", emailId).single();
    if (checkError) {
        console.error("❌ markEmailAsRead: Email not found:", {
            emailId,
            error: checkError
        });
        return false;
    }
    if (!existingEmail) {
        console.error("❌ markEmailAsRead: Email not found:", emailId);
        return false;
    }
    // Verify company_id matches
    if (existingEmail.company_id !== companyId) {
        console.error("❌ markEmailAsRead: Company ID mismatch:", {
            emailId,
            emailCompanyId: existingEmail.company_id,
            requestedCompanyId: companyId
        });
        return false;
    }
    // Verify type is email
    if (existingEmail.type !== "email") {
        console.error("❌ markEmailAsRead: Type mismatch:", {
            emailId,
            type: existingEmail.type
        });
        return false;
    }
    // If already read, return success
    if (existingEmail.read_at) {
        return true;
    }
    const readAt = new Date().toISOString();
    // Try update without .single() first to see if it affects any rows
    const { data: updateData, error: updateError, count } = await supabase.from("communications").update({
        read_at: readAt
    }).eq("id", emailId).eq("company_id", companyId).eq("type", "email").select("id, read_at");
    if (updateError) {
        console.error("❌ markEmailAsRead update error:", {
            emailId,
            companyId,
            error: updateError,
            errorCode: updateError.code,
            errorMessage: updateError.message,
            errorDetails: updateError.details,
            errorHint: updateError.hint
        });
        return false;
    }
    if (!updateData || updateData.length === 0) {
        console.error("❌ markEmailAsRead: No rows updated", {
            emailId,
            companyId,
            count,
            existingEmail: existingEmail
        });
        // This could mean RLS policy blocked it or the filters didn't match
        return false;
    }
    return true;
}
async function getEmailStats() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const companyId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$company$2d$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getActiveCompanyId"])();
    if (!supabase || !companyId) {
        return {
            totalEmails: 0,
            sentEmails: 0,
            receivedEmails: 0,
            unreadEmails: 0,
            threadsCount: 0
        };
    }
    // Get total emails
    const { count: totalCount } = await supabase.from("communications").select("*", {
        count: "exact",
        head: true
    }).eq("company_id", companyId).eq("channel", "resend").eq("type", "email").is("deleted_at", null);
    // Get sent emails
    const { count: sentCount } = await supabase.from("communications").select("*", {
        count: "exact",
        head: true
    }).eq("company_id", companyId).eq("channel", "resend").eq("type", "email").eq("direction", "outbound").is("deleted_at", null);
    // Get received emails
    const { count: receivedCount } = await supabase.from("communications").select("*", {
        count: "exact",
        head: true
    }).eq("company_id", companyId).eq("channel", "resend").eq("type", "email").eq("direction", "inbound").is("deleted_at", null);
    // Get unread emails
    const { count: unreadCount } = await supabase.from("communications").select("*", {
        count: "exact",
        head: true
    }).eq("company_id", companyId).eq("channel", "resend").eq("type", "email").eq("direction", "inbound").is("read_at", null).is("deleted_at", null);
    // For threads, we'll use a simple count of unique subjects
    // This is a simplified implementation
    const threadsCount = totalCount || 0;
    return {
        totalEmails: totalCount || 0,
        sentEmails: sentCount || 0,
        receivedEmails: receivedCount || 0,
        unreadEmails: unreadCount || 0,
        threadsCount
    };
}
async function archiveAllEmails(companyId, folder) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            success: false,
            count: 0,
            error: "Database connection failed"
        };
    }
    if (!companyId) {
        return {
            success: false,
            count: 0,
            error: "Missing company ID"
        };
    }
    const buildArchiveQuery = ()=>supabase.from("communications").update({
            is_archived: true
        }).eq("company_id", companyId).eq("type", "email");
    const runArchive = async (queryBuilder)=>{
        const { data, error, count } = await queryBuilder.select("id", {
            count: "exact"
        });
        if (error) {
            throw error;
        }
        return data?.length ?? count ?? 0;
    };
    const folderName = folder?.trim();
    const normalizedFolder = folderName?.toLowerCase();
    try {
        switch(normalizedFolder || "inbox"){
            case "inbox":
                {
                    // Inbox: inbound, not archived, not draft, not spam, not snoozed (or snooze expired)
                    const archived = await runArchive(buildArchiveQuery().eq("direction", "inbound").eq("is_archived", false).neq("status", "draft").or("category.is.null,category.neq.spam").or(`snoozed_until.is.null,snoozed_until.lt.${new Date().toISOString()}`).is("deleted_at", null));
                    return {
                        success: true,
                        count: archived
                    };
                }
            case "drafts":
                {
                    const archived = await runArchive(buildArchiveQuery().eq("status", "draft").is("deleted_at", null));
                    return {
                        success: true,
                        count: archived
                    };
                }
            case "sent":
                {
                    const archived = await runArchive(buildArchiveQuery().eq("direction", "outbound").eq("is_archived", false).is("deleted_at", null).neq("status", "draft"));
                    return {
                        success: true,
                        count: archived
                    };
                }
            case "archive":
                {
                    const archived = await runArchive(buildArchiveQuery().eq("is_archived", true).is("deleted_at", null));
                    return {
                        success: true,
                        count: archived
                    };
                }
            case "snoozed":
                {
                    const archived = await runArchive(buildArchiveQuery().not("snoozed_until", "is", null).gt("snoozed_until", new Date().toISOString()).is("deleted_at", null));
                    return {
                        success: true,
                        count: archived
                    };
                }
            case "spam":
                {
                    const categorized = await runArchive(buildArchiveQuery().eq("category", "spam").is("deleted_at", null));
                    // For spam tagged emails, fetch IDs first then update (JSONB filtering not supported)
                    const { data: spamTaggedEmails } = await supabase.from("communications").select("id, tags").eq("company_id", companyId).eq("type", "email").neq("category", "spam").is("deleted_at", null);
                    const spamTaggedIds = (spamTaggedEmails ?? []).filter((e)=>Array.isArray(e.tags) && e.tags.includes("spam")).map((e)=>e.id);
                    let taggedCount = 0;
                    if (spamTaggedIds.length > 0) {
                        const { data } = await supabase.from("communications").update({
                            is_archived: true
                        }).in("id", spamTaggedIds).select("id");
                        taggedCount = data?.length ?? 0;
                    }
                    return {
                        success: true,
                        count: categorized + taggedCount
                    };
                }
            case "trash":
            case "bin":
                {
                    const archived = await runArchive(buildArchiveQuery().not("deleted_at", "is", null));
                    return {
                        success: true,
                        count: archived
                    };
                }
            case "starred":
                {
                    // Fetch starred email IDs first then update (JSONB filtering not supported)
                    const { data: starredEmails } = await supabase.from("communications").select("id, tags").eq("company_id", companyId).eq("type", "email").is("deleted_at", null);
                    const starredIds = (starredEmails ?? []).filter((e)=>Array.isArray(e.tags) && e.tags.includes("starred")).map((e)=>e.id);
                    let starredCount = 0;
                    if (starredIds.length > 0) {
                        const { data } = await supabase.from("communications").update({
                            is_archived: true
                        }).in("id", starredIds).select("id");
                        starredCount = data?.length ?? 0;
                    }
                    return {
                        success: true,
                        count: starredCount
                    };
                }
            default:
                {
                    // Custom folder - fetch IDs first then update (JSONB filtering not supported)
                    const { data: customEmails } = await supabase.from("communications").select("id, tags").eq("company_id", companyId).eq("type", "email").is("deleted_at", null);
                    const customIds = (customEmails ?? []).filter((e)=>Array.isArray(e.tags) && folderName && e.tags.includes(folderName)).map((e)=>e.id);
                    let customCount = 0;
                    if (customIds.length > 0) {
                        const { data } = await supabase.from("communications").update({
                            is_archived: true
                        }).in("id", customIds).select("id");
                        customCount = data?.length ?? 0;
                    }
                    return {
                        success: true,
                        count: customCount
                    };
                }
        }
    } catch (error) {
        console.error("❌ archiveAllEmails error:", {
            companyId,
            folder,
            error
        });
        return {
            success: false,
            count: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCompanyEmails,
    getEmailThreads,
    getEmailById,
    markEmailAsRead,
    getEmailStats,
    archiveAllEmails
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyEmails, "6019495870073129044ac498316bd85aa19870b525", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailThreads, "609ae8a078f2bcaa6205ed5538bb26566f062adc23", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailById, "60259c44809bd76ff945bf89456318b8c3bac84310", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markEmailAsRead, "60bbec0d4d11a4451d0b8d5fd7d29270357baf27b9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmailStats, "0062b36b81ca58cb911ded995003291ef525a90618", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(archiveAllEmails, "60123aa2b4520dbc887622c7e6fbbeded0b0b37cb6", null);
}),
"[project]/apps/web/src/lib/notifications/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Notification Types and Schemas
 *
 * Zod schemas and TypeScript types for the notifications system.
 * Separated from server actions to comply with Next.js "use server" restrictions.
 */ __turbopack_context__.s([
    "CreateNotificationSchema",
    ()=>CreateNotificationSchema,
    "GetNotificationsSchema",
    ()=>GetNotificationsSchema,
    "NotificationPreferenceSchema",
    ()=>NotificationPreferenceSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
// ============================================================================
// SCHEMAS
// ============================================================================
const NotificationTypeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "message",
    "alert",
    "payment",
    "job",
    "team",
    "system"
]);
const NotificationPrioritySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "low",
    "medium",
    "high",
    "urgent"
]);
const CreateNotificationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid user ID"),
    companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid("Invalid company ID"),
    type: NotificationTypeSchema,
    priority: NotificationPrioritySchema.default("medium"),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Title is required").max(200),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Message is required").max(500),
    actionUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("")),
    actionLabel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional()
});
const GetNotificationsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(100).default(50),
    offset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).default(0),
    unreadOnly: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    type: NotificationTypeSchema.optional(),
    priority: NotificationPrioritySchema.optional()
});
const NotificationPreferenceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    channel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "in_app",
        "email",
        "sms",
        "push"
    ]),
    eventType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean()
});
}),
"[project]/apps/web/src/lib/auth/tokens.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/auth package for backwards compatibility
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$auth$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/auth/src/tokens.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/web/src/lib/security/csrf.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CSRF Protection
 *
 * Cross-Site Request Forgery (CSRF) protection for Server Actions.
 * Generates and validates tokens to prevent unauthorized form submissions.
 *
 * How it works:
 * 1. Server generates a random CSRF token and stores it in HTTP-only cookie
 * 2. Token is also included in form as hidden field or header
 * 3. On form submission, server compares cookie token with submitted token
 * 4. Tokens must match exactly or request is rejected
 *
 * Usage in Server Actions:
 * ```typescript
 * export async function updateSettings(formData: FormData) {
 *   await verifyCSRFToken(formData);
 *   // Your logic here
 * }
 * ```
 *
 * Usage in Forms:
 * ```tsx
 * <form action={updateSettings}>
 *   <CSRFTokenInput />
 *   <input name="setting" />
 *   <button type="submit">Save</button>
 * </form>
 * ```
 */ __turbopack_context__.s([
    "clearCSRFToken",
    ()=>clearCSRFToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
const CSRF_TOKEN_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const CSRF_FORM_FIELD = "csrf_token";
/**
 * CSRF Error
 */ class CSRFError extends Error {
    constructor(message){
        super(message);
        this.name = "CSRFError";
    }
}
/**
 * Generate CSRF Token
 *
 * Creates a secure random token and stores it in an HTTP-only cookie.
 * Call this in Server Components or Server Actions to initialize CSRF protection.
 *
 * @returns The generated CSRF token (for including in forms)
 */ async function generateCSRFToken() {
    const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("hex");
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(CSRF_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/"
    });
    return token;
}
/**
 * Get Current CSRF Token
 *
 * Gets the CSRF token from cookies without generating a new one.
 * Generates a new token if none exists.
 *
 * @returns Current CSRF token or new token if none exists
 */ async function getCSRFToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const existingToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value;
    if (existingToken) {
        return existingToken;
    }
    // Generate new token if none exists
    return generateCSRFToken();
}
/**
 * Verify CSRF Token
 *
 * Validates the CSRF token from request against the cookie.
 * Supports both header-based and form field-based tokens.
 *
 * @param formData - Optional FormData containing the CSRF token
 * @throws CSRFError if validation fails
 *
 * @example
 * // In Server Action
 * export async function updateUser(formData: FormData) {
 *   await verifyCSRFToken(formData);
 *   // Your logic here
 * }
 */ async function verifyCSRFToken(formData) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const headersList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])();
    const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value;
    // Get token from header or form field
    let submittedToken = null;
    // Check header first (for fetch requests)
    submittedToken = headersList.get(CSRF_HEADER);
    // Fall back to form field (for form submissions)
    if (!submittedToken && formData) {
        submittedToken = formData.get(CSRF_FORM_FIELD);
    }
    // Validate
    if (!cookieToken) {
        throw new CSRFError("CSRF token missing from cookies. Please refresh the page and try again.");
    }
    if (!submittedToken) {
        throw new CSRFError("CSRF token missing from request. Please ensure the form includes a CSRF token.");
    }
    // Constant-time comparison to prevent timing attacks
    if (!constantTimeCompare(cookieToken, submittedToken)) {
        throw new CSRFError("Invalid CSRF token. This request may be forged. Please refresh the page and try again.");
    }
}
/**
 * Constant-Time String Comparison
 *
 * Compares two strings in constant time to prevent timing attacks.
 * Always compares the full length even if strings don't match.
 *
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal, false otherwise
 */ function constantTimeCompare(a, b) {
    // If lengths don't match, still do comparison to prevent timing leak
    if (a.length !== b.length) {
        return false;
    }
    let result = 0;
    for(let i = 0; i < a.length; i++){
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
/**
 * CSRF Protection Wrapper for Server Actions
 *
 * Wraps a Server Action to automatically verify CSRF token.
 *
 * @param fn - Server Action function to wrap
 * @returns Wrapped function with CSRF protection
 *
 * @example
 * ```typescript
 * export const updateSettings = withCSRFProtection(
 *   async (formData: FormData) => {
 *     // Your logic here - CSRF already verified
 *   }
 * );
 * ```
 */ function withCSRFProtection(fn) {
    return async (...args)=>{
        // Check if first argument is FormData
        const formData = args[0] instanceof FormData ? args[0] : undefined;
        await verifyCSRFToken(formData);
        return fn(...args);
    };
}
/**
 * Rotate CSRF Token
 *
 * Generates a new CSRF token, invalidating the old one.
 * Use this after successful form submission or periodically for extra security.
 *
 * @returns New CSRF token
 */ async function rotateCSRFToken() {
    return generateCSRFToken();
}
async function clearCSRFToken() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(CSRF_TOKEN_COOKIE);
}
}),
"[project]/apps/web/src/lib/security/rate-limit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Rate Limiting Utilities
 *
 * Provides rate limiting for authentication and API endpoints to prevent:
 * - Brute force password attacks
 * - Account enumeration
 * - Email spam/flooding
 * - DDoS attacks
 *
 * Implementation:
 * - Uses in-memory LRU cache for development/small scale
 * - Can be easily swapped with Redis/Upstash for production
 * - Sliding window algorithm for accurate rate limiting
 * - Per-identifier tracking (email, IP, user ID)
 */ // Simple in-memory rate limiter using LRU cache
// For production, replace with @upstash/ratelimit + @upstash/redis
__turbopack_context__.s([
    "RateLimitError",
    ()=>RateLimitError,
    "authRateLimiter",
    ()=>authRateLimiter,
    "checkRateLimit",
    ()=>checkRateLimit,
    "passwordResetRateLimiter",
    ()=>passwordResetRateLimiter
]);
class InMemoryRateLimiter {
    requests;
    maxRequests;
    windowMs;
    constructor(maxRequests, windowMs){
        this.requests = new Map();
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        // Cleanup old entries every minute
        setInterval(()=>this.cleanup(), 60_000);
    }
    async limit(identifier) {
        const now = Date.now();
        const key = identifier;
        let record = this.requests.get(key);
        // Initialize if doesn't exist
        if (!record) {
            record = {
                count: 0,
                resetAt: now + this.windowMs,
                requests: []
            };
            this.requests.set(key, record);
        }
        // Remove requests outside the sliding window
        record.requests = record.requests.filter((timestamp)=>timestamp > now - this.windowMs);
        // Check if limit exceeded
        if (record.requests.length >= this.maxRequests) {
            return {
                success: false,
                limit: this.maxRequests,
                remaining: 0,
                reset: Math.min(...record.requests) + this.windowMs
            };
        }
        // Add new request
        record.requests.push(now);
        record.count = record.requests.length;
        return {
            success: true,
            limit: this.maxRequests,
            remaining: this.maxRequests - record.count,
            reset: now + this.windowMs
        };
    }
    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.requests.entries()){
            record.requests = record.requests.filter((timestamp)=>timestamp > now - this.windowMs);
            if (record.requests.length === 0) {
                this.requests.delete(key);
            }
        }
    }
    reset(identifier) {
        this.requests.delete(identifier);
    }
    clear() {
        this.requests.clear();
    }
}
// Rate limiter instances for different operations
const authRateLimiterInstance = new InMemoryRateLimiter(5, 15 * 60 * 1000);
const apiRateLimiterInstance = new InMemoryRateLimiter(100, 60 * 1000);
const passwordResetRateLimiterInstance = new InMemoryRateLimiter(3, 60 * 60 * 1000);
const authRateLimiter = {
    limit: (identifier)=>authRateLimiterInstance.limit(identifier),
    reset: (identifier)=>authRateLimiterInstance.reset(identifier)
};
/**
 * API Rate Limiter
 *
 * Use for: General API endpoints
 * Limit: 100 requests per minute per identifier
 */ const apiRateLimiter = {
    limit: (identifier)=>apiRateLimiterInstance.limit(identifier),
    reset: (identifier)=>apiRateLimiterInstance.reset(identifier)
};
const passwordResetRateLimiter = {
    limit: (identifier)=>passwordResetRateLimiterInstance.limit(identifier),
    reset: (identifier)=>passwordResetRateLimiterInstance.reset(identifier)
};
class RateLimitError extends Error {
    limit;
    remaining;
    reset;
    constructor(message, limit, remaining, reset){
        super(message), this.limit = limit, this.remaining = remaining, this.reset = reset;
        this.name = "RateLimitError";
    }
}
async function checkRateLimit(identifier, limiter = apiRateLimiter) {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    if (!success) {
        const resetDate = new Date(reset);
        throw new RateLimitError(`Too many requests. Please try again after ${resetDate.toLocaleTimeString()}.`, limit, remaining, reset);
    }
}
/**
 * Get Client IP Address
 *
 * Extracts IP from request headers for rate limiting.
 * Supports various proxy headers.
 */ function getClientIP(request) {
    const headers = new Headers(request.headers);
    // Check common proxy headers
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIP = headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }
    const cfIP = headers.get("cf-connecting-ip"); // Cloudflare
    if (cfIP) {
        return cfIP;
    }
    // Fallback to unknown
    return "unknown";
} /**
 * Production Setup Instructions
 *
 * For production, replace in-memory limiter with Redis:
 *
 * 1. Install dependencies:
 *    ```bash
 *    pnpm add @upstash/ratelimit @upstash/redis
 *    ```
 *
 * 2. Update this file:
 *    ```typescript
 *    import { Ratelimit } from "@upstash/ratelimit";
 *    import { Redis } from "@upstash/redis";
 *
 *    const redis = new Redis({
 *      url: process.env.UPSTASH_REDIS_REST_URL!,
 *      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
 *    });
 *
 *    export const authRateLimiter = new Ratelimit({
 *      redis,
 *      limiter: Ratelimit.slidingWindow(5, "15 m"),
 *      analytics: true,
 *      prefix: "ratelimit:auth",
 *    });
 *    ```
 *
 * 3. Add environment variables:
 *    ```
 *    UPSTASH_REDIS_REST_URL=https://...
 *    UPSTASH_REDIS_REST_TOKEN=...
 *    ```
 */ 
}),
"[project]/apps/web/src/lib/search/full-text-search.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Full-Text Search Utilities
 *
 * Provides enterprise-grade PostgreSQL full-text search with:
 * - Weighted ranking (ts_rank) for best match results
 * - Multi-field search across all relevant columns
 * - Fuzzy matching with pg_trgm for typo tolerance
 * - Company-scoped security (RLS enforced)
 *
 * Performance:
 * - Uses GIN indexes for sub-millisecond search
 * - Searches millions of records efficiently
 * - Returns top 50 results by default (configurable)
 *
 * Search Features:
 * - Multi-word queries: "john plumber" matches both words
 * - Phrase search: Use quotes for exact phrases
 * - Fuzzy matching: Handles typos and variations
 * - Weighted fields: Name matches rank higher than notes
 */ __turbopack_context__.s([
    "searchAllEntities",
    ()=>searchAllEntities,
    "searchCustomersFullText",
    ()=>searchCustomersFullText,
    "searchJobsFullText",
    ()=>searchJobsFullText
]);
async function searchCustomersFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, minSimilarity = 0.3, useFullTextSearch = true, useFuzzyMatch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_customers_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search if full-text search not available or fails
    const { data } = await supabase.from("customers").select("*").eq("company_id", companyId).is("deleted_at", null).or(`display_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,company_name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`).order("display_name", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
async function searchJobsFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_jobs_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("jobs").select("*").eq("company_id", companyId).is("deleted_at", null).or(`job_number.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`).order("created_at", {
        ascending: false
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
/**
 * Search properties with full-text search and ranking
 *
 * Searches across: name, address, city, state, zip_code, notes
 * Returns results ordered by relevance
 */ async function searchPropertiesFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_properties_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("properties").select("*").eq("company_id", companyId).or(`name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,zip_code.ilike.%${query}%`).order("address", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
/**
 * Search price book items with full-text search and ranking
 *
 * Searches across: name, sku, supplier_sku, description, category, subcategory
 * Returns results ordered by relevance
 */ async function searchPriceBookItemsFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 100, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_price_book_items_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("price_book_items").select("*").eq("company_id", companyId).or(`name.ilike.%${query}%,sku.ilike.%${query}%,supplier_sku.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`).order("name", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
/**
 * Search equipment with full-text search and ranking
 *
 * Searches across: equipment_number, name, type, manufacturer, model, serial_number
 * Returns results ordered by relevance
 */ async function searchEquipmentFullText(supabase, companyId, searchTerm, options = {}) {
    const { limit = 50, offset = 0, useFullTextSearch = true } = options;
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }
    const query = searchTerm.trim();
    // Use full-text search with ranking
    if (useFullTextSearch) {
        const { data, error } = await supabase.rpc("search_equipment_ranked", {
            company_id_param: companyId,
            search_query: query,
            result_limit: limit,
            result_offset: offset
        });
        if (!error && data) {
            return data;
        }
    }
    // Fallback to ILIKE search
    const { data } = await supabase.from("equipment").select("*").eq("company_id", companyId).is("deleted_at", null).or(`equipment_number.ilike.%${query}%,name.ilike.%${query}%,type.ilike.%${query}%,manufacturer.ilike.%${query}%,model.ilike.%${query}%,serial_number.ilike.%${query}%`).order("name", {
        ascending: true
    }).limit(limit).range(offset, offset + limit - 1);
    return data || [];
}
async function searchAllEntities(supabase, companyId, searchTerm, options = {}) {
    const defaultLimit = options.limit || 10; // Limit per entity
    const [customers, jobs, properties, equipment, priceBookItems] = await Promise.all([
        searchCustomersFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchJobsFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchPropertiesFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchEquipmentFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        }),
        searchPriceBookItemsFullText(supabase, companyId, searchTerm, {
            ...options,
            limit: defaultLimit
        })
    ]);
    return {
        customers,
        jobs,
        properties,
        equipment,
        priceBookItems
    };
}
}),
"[project]/apps/web/src/lib/services/google-custom-search-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Google Custom Search Service
 *
 * Provides web search capabilities for the AI agent:
 * - General web search
 * - News search
 * - Image search
 * - Site-specific search
 *
 * API: Google Custom Search JSON API
 * Free Tier: 100 queries/day free, then $5/1000 queries
 * Docs: https://developers.google.com/custom-search/v1/overview
 *
 * Setup:
 * 1. Enable Custom Search API in Google Cloud Console
 * 2. Create a Programmable Search Engine at https://programmablesearchengine.google.com/
 * 3. Get your Search Engine ID (cx parameter)
 * 4. Set GOOGLE_SEARCH_ENGINE_ID in environment
 */ __turbopack_context__.s([
    "googleCustomSearchService",
    ()=>googleCustomSearchService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";
// Zod schemas for type safety
const SearchResultSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    link: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
    snippet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    displayLink: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    formattedUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    pagemap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        cse_thumbnail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            src: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            width: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            height: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
        })).optional(),
        metatags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())).optional()
    }).optional()
});
const SearchResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    results: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(SearchResultSchema),
    totalResults: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    searchTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    searchType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "web",
        "news",
        "image"
    ]),
    nextPageToken: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes
// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleCustomSearchService {
    apiKey;
    searchEngineId;
    cache = new Map();
    cacheTTL = CACHE_TTL_MS;
    constructor(){
        // Use unified GOOGLE_API_KEY for all Google services
        this.apiKey = process.env.GOOGLE_API_KEY || ("TURBOPACK compile-time value", "AIzaSyCVKN0pddG230vvjT0EMP9sSIR31j1q2t0") || process.env.GOOGLE_MAPS_API_KEY;
        this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || process.env.GOOGLE_CSE_ID || process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID;
    }
    /**
	 * Perform a web search
	 */ async search(query, options = {}) {
        if (!this.apiKey || !this.searchEngineId) {
            console.warn("Google Custom Search not configured: missing API key or Search Engine ID");
            return null;
        }
        const cacheKey = this.getCacheKey(query, options, "web");
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.data;
        }
        try {
            const params = this.buildParams(query, options);
            const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
            const response = await fetch(url, {
                headers: {
                    "User-Agent": USER_AGENT
                }
            });
            if (!response.ok) {
                const error = await response.json();
                console.error("Google Custom Search error:", error);
                return null;
            }
            const data = await response.json();
            const searchResponse = this.parseResponse(data, query, "web");
            this.cache.set(cacheKey, {
                data: searchResponse,
                timestamp: Date.now()
            });
            return searchResponse;
        } catch (error) {
            console.error("Google Custom Search failed:", error);
            return null;
        }
    }
    /**
	 * Search for news articles
	 * Uses date restriction to get recent results
	 */ async searchNews(query, options = {}) {
        const { daysBack = 7, ...searchOptions } = options;
        // Add date restriction for recent news
        const newsOptions = {
            ...searchOptions,
            dateRestrict: `d${daysBack}`,
            sort: "date"
        };
        const cacheKey = this.getCacheKey(query, newsOptions, "news");
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.data;
        }
        const result = await this.search(query, newsOptions);
        if (result) {
            result.searchType = "news";
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
        }
        return result;
    }
    /**
	 * Search for images
	 */ async searchImages(query, options = {}) {
        if (!this.apiKey || !this.searchEngineId) {
            console.warn("Google Custom Search not configured");
            return null;
        }
        const cacheKey = this.getCacheKey(query, options, "image");
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.data;
        }
        try {
            const params = this.buildParams(query, options);
            params.set("searchType", "image");
            const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
            const response = await fetch(url, {
                headers: {
                    "User-Agent": USER_AGENT
                }
            });
            if (!response.ok) {
                const error = await response.json();
                console.error("Google Image Search error:", error);
                return null;
            }
            const data = await response.json();
            const searchResponse = this.parseImageResponse(data, query);
            this.cache.set(cacheKey, {
                data: searchResponse,
                timestamp: Date.now()
            });
            return searchResponse;
        } catch (error) {
            console.error("Google Image Search failed:", error);
            return null;
        }
    }
    /**
	 * Search within a specific site
	 */ async searchSite(query, site, options = {}) {
        return this.search(query, {
            ...options,
            siteSearch: site
        });
    }
    /**
	 * Search for technical/documentation content
	 * Focuses on official docs, Stack Overflow, GitHub
	 */ async searchTechnical(query, options = {}) {
        // Append technical terms to improve results
        const technicalQuery = `${query} documentation OR tutorial OR guide`;
        return this.search(technicalQuery, options);
    }
    /**
	 * Build URL params for API request
	 */ buildParams(query, options) {
        const params = new URLSearchParams({
            key: this.apiKey,
            cx: this.searchEngineId,
            q: query
        });
        if (options.num) params.set("num", String(Math.min(options.num, 10)));
        if (options.start) params.set("start", String(options.start));
        if (options.siteSearch) params.set("siteSearch", options.siteSearch);
        if (options.siteSearchExclude) {
            params.set("siteSearch", options.siteSearchExclude);
            params.set("siteSearchFilter", "e");
        }
        if (options.dateRestrict) params.set("dateRestrict", options.dateRestrict);
        if (options.safe) params.set("safe", options.safe);
        if (options.filter) params.set("filter", options.filter);
        if (options.gl) params.set("gl", options.gl);
        if (options.lr) params.set("lr", options.lr);
        if (options.sort === "date") params.set("sort", "date");
        return params;
    }
    /**
	 * Parse API response into our schema
	 */ parseResponse(data, query, searchType) {
        const items = data.items || [];
        const searchInfo = data.searchInformation;
        return {
            results: items.map((item)=>({
                    title: item.title || "",
                    link: item.link || "",
                    snippet: item.snippet || "",
                    displayLink: item.displayLink || "",
                    formattedUrl: item.formattedUrl,
                    pagemap: item.pagemap
                })),
            totalResults: Number.parseInt(searchInfo?.totalResults || "0", 10),
            searchTime: searchInfo?.searchTime || 0,
            query,
            searchType,
            nextPageToken: data.queries ? data.queries.nextPage?.[0]?.startIndex?.toString() : undefined
        };
    }
    /**
	 * Parse image search response
	 */ parseImageResponse(data, query) {
        const items = data.items || [];
        const searchInfo = data.searchInformation;
        return {
            results: items.map((item)=>({
                    title: item.title || "",
                    link: item.link || "",
                    snippet: item.snippet || "",
                    displayLink: item.displayLink || "",
                    formattedUrl: item.image?.contextLink,
                    pagemap: {
                        cse_thumbnail: [
                            {
                                src: item.image?.thumbnailLink || item.link,
                                width: String(item.image?.thumbnailWidth || ""),
                                height: String(item.image?.thumbnailHeight || "")
                            }
                        ]
                    }
                })),
            totalResults: Number.parseInt(searchInfo?.totalResults || "0", 10),
            searchTime: searchInfo?.searchTime || 0,
            query,
            searchType: "image"
        };
    }
    /**
	 * Generate cache key
	 */ getCacheKey(query, options, type) {
        return `search:${type}:${query}:${JSON.stringify(options)}`;
    }
    /**
	 * Check if service is configured
	 */ isConfigured() {
        return !!this.apiKey && !!this.searchEngineId;
    }
    /**
	 * Get configuration status details
	 */ getConfigStatus() {
        return {
            configured: this.isConfigured(),
            hasApiKey: !!this.apiKey,
            hasSearchEngineId: !!this.searchEngineId
        };
    }
    /**
	 * Clear the cache
	 */ clearCache() {
        this.cache.clear();
    }
}
const googleCustomSearchService = new GoogleCustomSearchService();
}),
"[project]/apps/web/src/lib/ai/agent-tools.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * AI Agent Tools - Comprehensive tool definitions for the AI Manager
 * Integrates with database, Resend, Telnyx, and financial systems
 */ __turbopack_context__.s([
    "aiAgentTools",
    ()=>aiAgentTools,
    "analyzeRecentCommunicationsTool",
    ()=>analyzeRecentCommunicationsTool,
    "buildCustomerProfileTool",
    ()=>buildCustomerProfileTool,
    "calculateEstimateTool",
    ()=>calculateEstimateTool,
    "cancelReminderTool",
    ()=>cancelReminderTool,
    "checkEquipmentWarrantyTool",
    ()=>checkEquipmentWarrantyTool,
    "checkPartsAvailabilityTool",
    ()=>checkPartsAvailabilityTool,
    "checkWeatherForJobTool",
    ()=>checkWeatherForJobTool,
    "createAppointmentTool",
    ()=>createAppointmentTool,
    "createCustomerTool",
    ()=>createCustomerTool,
    "createInvoiceTool",
    ()=>createInvoiceTool,
    "destructiveTools",
    ()=>destructiveTools,
    "extractCommunicationInsightsTool",
    ()=>extractCommunicationInsightsTool,
    "findNearbySuppliersTool",
    ()=>findNearbySuppliersTool,
    "findTechniciansBySkillsTool",
    ()=>findTechniciansBySkillsTool,
    "geocodeAddressTool",
    ()=>geocodeAddressTool,
    "getARAgingReportTool",
    ()=>getARAgingReportTool,
    "getAvailableSlotsTool",
    ()=>getAvailableSlotsTool,
    "getCallTranscriptTool",
    ()=>getCallTranscriptTool,
    "getCodeComplianceChecklistTool",
    ()=>getCodeComplianceChecklistTool,
    "getCommunicationHistoryTool",
    ()=>getCommunicationHistoryTool,
    "getCompanyOverviewTool",
    ()=>getCompanyOverviewTool,
    "getCustomerCommunicationHistoryTool",
    ()=>getCustomerCommunicationHistoryTool,
    "getCustomerDetailsTool",
    ()=>getCustomerDetailsTool,
    "getCustomerLifetimeValueTool",
    ()=>getCustomerLifetimeValueTool,
    "getDashboardMetricsTool",
    ()=>getDashboardMetricsTool,
    "getDestructiveToolMetadata",
    ()=>getDestructiveToolMetadata,
    "getDestructiveToolNames",
    ()=>getDestructiveToolNames,
    "getEntityMemoriesTool",
    ()=>getEntityMemoriesTool,
    "getEquipmentServiceHistoryTool",
    ()=>getEquipmentServiceHistoryTool,
    "getFinancialSummaryTool",
    ()=>getFinancialSummaryTool,
    "getJobCostingReportTool",
    ()=>getJobCostingReportTool,
    "getLowStockAlertsTool",
    ()=>getLowStockAlertsTool,
    "getMaintenanceDueTool",
    ()=>getMaintenanceDueTool,
    "getPermitRequirementsTool",
    ()=>getPermitRequirementsTool,
    "getProactiveInsightsTool",
    ()=>getProactiveInsightsTool,
    "getPropertyConditionsTool",
    ()=>getPropertyConditionsTool,
    "getPropertyDetailsTool",
    ()=>getPropertyDetailsTool,
    "getPropertyEquipmentTool",
    ()=>getPropertyEquipmentTool,
    "getRecordByIdTool",
    ()=>getRecordByIdTool,
    "getRelatedRecordsTool",
    ()=>getRelatedRecordsTool,
    "getRevenueBreakdownTool",
    ()=>getRevenueBreakdownTool,
    "getRouteTool",
    ()=>getRouteTool,
    "getScheduledRemindersTool",
    ()=>getScheduledRemindersTool,
    "getTeamMemberDetailsTool",
    ()=>getTeamMemberDetailsTool,
    "getTeamPerformanceReportTool",
    ()=>getTeamPerformanceReportTool,
    "getTechnicianWorkloadTool",
    ()=>getTechnicianWorkloadTool,
    "getTrafficConditionsTool",
    ()=>getTrafficConditionsTool,
    "getVendorDetailsTool",
    ()=>getVendorDetailsTool,
    "getVirtualBucketsTool",
    ()=>getVirtualBucketsTool,
    "getWeatherAlertsTool",
    ()=>getWeatherAlertsTool,
    "getWeatherForLocationTool",
    ()=>getWeatherForLocationTool,
    "initiateCallTool",
    ()=>initiateCallTool,
    "isDestructiveTool",
    ()=>isDestructiveTool,
    "learnFromCompletedJobsTool",
    ()=>learnFromCompletedJobsTool,
    "listDatabaseTablesTool",
    ()=>listDatabaseTablesTool,
    "optimizeJobOrderTool",
    ()=>optimizeJobOrderTool,
    "queryDatabaseTool",
    ()=>queryDatabaseTool,
    "recallContextTool",
    ()=>recallContextTool,
    "scheduleReminderTool",
    ()=>scheduleReminderTool,
    "searchAllEntitesTool",
    ()=>searchAllEntitesTool,
    "searchBuildingCodesTool",
    ()=>searchBuildingCodesTool,
    "searchCommunicationsFullTextTool",
    ()=>searchCommunicationsFullTextTool,
    "searchContractsTool",
    ()=>searchContractsTool,
    "searchCustomersTool",
    ()=>searchCustomersTool,
    "searchEquipmentTool",
    ()=>searchEquipmentTool,
    "searchEstimatesTool",
    ()=>searchEstimatesTool,
    "searchInventoryTool",
    ()=>searchInventoryTool,
    "searchInvoicesTool",
    ()=>searchInvoicesTool,
    "searchJobsTool",
    ()=>searchJobsTool,
    "searchMemoriesTool",
    ()=>searchMemoriesTool,
    "searchPriceBookTool",
    ()=>searchPriceBookTool,
    "searchPropertiesTool",
    ()=>searchPropertiesTool,
    "searchTeamMembersTool",
    ()=>searchTeamMembersTool,
    "searchVendorsTool",
    ()=>searchVendorsTool,
    "searchVoicemailTranscriptsTool",
    ()=>searchVoicemailTranscriptsTool,
    "sendEmailTool",
    ()=>sendEmailTool,
    "sendImmediateNotificationTool",
    ()=>sendImmediateNotificationTool,
    "sendSmsTool",
    ()=>sendSmsTool,
    "sendTeamEmailTool",
    ()=>sendTeamEmailTool,
    "sendTeamSmsTool",
    ()=>sendTeamSmsTool,
    "sendVendorEmailTool",
    ()=>sendVendorEmailTool,
    "sendVendorSmsTool",
    ()=>sendVendorSmsTool,
    "storeMemoryTool",
    ()=>storeMemoryTool,
    "suggestTechnicianForJobTool",
    ()=>suggestTechnicianForJobTool,
    "toolCategories",
    ()=>toolCategories,
    "transferToBucketTool",
    ()=>transferToBucketTool,
    "updateCustomerTool",
    ()=>updateCustomerTool,
    "webSearchNewsTool",
    ()=>webSearchNewsTool,
    "webSearchSiteTool",
    ()=>webSearchSiteTool,
    "webSearchTechnicalTool",
    ()=>webSearchTechnicalTool,
    "webSearchTool",
    ()=>webSearchTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+provider-utils@3.0.17_zod@4.1.12/node_modules/@ai-sdk/provider-utils/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$search$2f$full$2d$text$2d$search$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/search/full-text-search.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/google-custom-search-service.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const listDatabaseTablesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "List all available database tables and their purposes. Use this to understand what data is available.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: async ()=>{
        return {
            success: true,
            tables: [
                {
                    name: "customers",
                    description: "Customer records with contact info, revenue, and status"
                },
                {
                    name: "team_members",
                    description: "Employee/staff records with roles, contact info, and assignments"
                },
                {
                    name: "vendors",
                    description: "Supplier/vendor records with contact and payment info"
                },
                {
                    name: "jobs",
                    description: "Work orders and service jobs with status, scheduling, and costs"
                },
                {
                    name: "appointments",
                    description: "Scheduled appointments and service calls"
                },
                {
                    name: "invoices",
                    description: "Customer invoices with line items and payment status"
                },
                {
                    name: "estimates",
                    description: "Price estimates/quotes for customers"
                },
                {
                    name: "contracts",
                    description: "Service contracts and agreements"
                },
                {
                    name: "payments",
                    description: "Payment records and transactions"
                },
                {
                    name: "properties",
                    description: "Customer properties/service locations"
                },
                {
                    name: "equipment",
                    description: "Equipment and assets at properties"
                },
                {
                    name: "communications",
                    description: "Email, SMS, and call history"
                },
                {
                    name: "price_book_items",
                    description: "Service and product pricing catalog"
                },
                {
                    name: "materials",
                    description: "Materials and parts inventory"
                },
                {
                    name: "purchase_orders",
                    description: "Orders placed with vendors"
                },
                {
                    name: "time_entries",
                    description: "Time tracking for jobs and employees"
                },
                {
                    name: "expenses",
                    description: "Business expenses and costs"
                },
                {
                    name: "service_agreements",
                    description: "Recurring service agreements"
                },
                {
                    name: "maintenance_plans",
                    description: "Equipment maintenance schedules"
                },
                {
                    name: "notes",
                    description: "Notes attached to various records"
                },
                {
                    name: "tags",
                    description: "Tags/labels for organizing records"
                },
                {
                    name: "finance_virtual_buckets",
                    description: "Financial savings goals and allocations"
                },
                {
                    name: "scheduled_notifications",
                    description: "Scheduled reminders and notifications"
                }
            ]
        };
    }
});
const queryDatabaseTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Query any database table to retrieve records. Use this for flexible data access when specific tools don't cover your needs.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        table: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Table name to query (e.g., 'customers', 'jobs', 'invoices')"),
        select: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default("*").describe("Columns to select (comma-separated or * for all)"),
        filters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            column: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            operator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
                "eq",
                "neq",
                "gt",
                "gte",
                "lt",
                "lte",
                "like",
                "ilike",
                "in",
                "is"
            ]),
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].null(),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
            ])
        })).optional().describe("Filters to apply"),
        orderBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            column: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            ascending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false)
        }).optional().describe("Sort order"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(50).describe("Max records to return"),
        offset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(0).describe("Records to skip for pagination")
    }),
    execute: async ({ table, select, filters, orderBy, limit, offset }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Security: Only allow access to business tables
        const allowedTables = [
            "customers",
            "team_members",
            "vendors",
            "jobs",
            "appointments",
            "invoices",
            "estimates",
            "contracts",
            "payments",
            "properties",
            "equipment",
            "communications",
            "price_book_items",
            "materials",
            "purchase_orders",
            "time_entries",
            "expenses",
            "service_agreements",
            "maintenance_plans",
            "notes",
            "tags",
            "finance_virtual_buckets",
            "scheduled_notifications",
            "job_line_items",
            "invoice_line_items",
            "estimate_line_items"
        ];
        if (!allowedTables.includes(table)) {
            return {
                success: false,
                error: `Table '${table}' is not accessible. Available: ${allowedTables.join(", ")}`
            };
        }
        let query = supabase.from(table).select(select);
        // Always filter by company_id for security
        query = query.eq("company_id", companyId);
        // Apply filters
        if (filters) {
            for (const filter of filters){
                switch(filter.operator){
                    case "eq":
                        query = query.eq(filter.column, filter.value);
                        break;
                    case "neq":
                        query = query.neq(filter.column, filter.value);
                        break;
                    case "gt":
                        query = query.gt(filter.column, filter.value);
                        break;
                    case "gte":
                        query = query.gte(filter.column, filter.value);
                        break;
                    case "lt":
                        query = query.lt(filter.column, filter.value);
                        break;
                    case "lte":
                        query = query.lte(filter.column, filter.value);
                        break;
                    case "like":
                        query = query.like(filter.column, filter.value);
                        break;
                    case "ilike":
                        query = query.ilike(filter.column, filter.value);
                        break;
                    case "in":
                        query = query.in(filter.column, filter.value);
                        break;
                    case "is":
                        query = query.is(filter.column, filter.value);
                        break;
                }
            }
        }
        // Apply ordering
        if (orderBy) {
            query = query.order(orderBy.column, {
                ascending: orderBy.ascending
            });
        }
        // Apply pagination
        query = query.range(offset, offset + limit - 1);
        const { data, error, count } = await query;
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            data,
            count: data?.length || 0,
            table
        };
    }
});
const getRecordByIdTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get a specific record by its ID from any table. Use when you need full details of a known record.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        table: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Table name"),
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Record UUID"),
        select: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default("*").describe("Columns to select")
    }),
    execute: async ({ table, id, select }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const allowedTables = [
            "customers",
            "team_members",
            "vendors",
            "jobs",
            "appointments",
            "invoices",
            "estimates",
            "contracts",
            "payments",
            "properties",
            "equipment",
            "communications",
            "price_book_items",
            "materials",
            "purchase_orders",
            "time_entries",
            "expenses",
            "service_agreements",
            "maintenance_plans",
            "notes",
            "finance_virtual_buckets"
        ];
        if (!allowedTables.includes(table)) {
            return {
                success: false,
                error: `Table '${table}' is not accessible`
            };
        }
        const { data, error } = await supabase.from(table).select(select).eq("id", id).eq("company_id", companyId).single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            record: data,
            table
        };
    }
});
const getRelatedRecordsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get records related to a specific entity (e.g., all jobs for a customer, all invoices for a job).",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        parentTable: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Parent table (e.g., 'customers')"),
        parentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Parent record ID"),
        childTable: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Related table to query (e.g., 'jobs')"),
        foreignKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Foreign key column in child table (e.g., 'customer_id')"),
        select: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default("*"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(50)
    }),
    execute: async ({ parentTable, parentId, childTable, foreignKey, select, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from(childTable).select(select).eq(foreignKey, parentId).eq("company_id", companyId).limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            data,
            count: data?.length || 0,
            parentTable,
            childTable
        };
    }
});
const getCompanyOverviewTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get a comprehensive overview of the entire company including counts and summaries from all major tables.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: async (_params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const [customersResult, teamResult, vendorsResult, jobsResult, invoicesResult, estimatesResult, contractsResult, propertiesResult, equipmentResult, appointmentsResult] = await Promise.all([
            supabase.from("customers").select("id, status", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("team_members").select("id, status, role", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("vendors").select("id, status", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("jobs").select("id, status, total_amount", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("invoices").select("id, status, total_amount, balance_amount", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("estimates").select("id, status, total_amount", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("contracts").select("id, status, total_value", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("properties").select("id", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("equipment").select("id", {
                count: "exact"
            }).eq("company_id", companyId),
            supabase.from("appointments").select("id, status", {
                count: "exact"
            }).eq("company_id", companyId)
        ]);
        // Calculate summaries
        const activeCustomers = customersResult.data?.filter((c)=>c.status === "active").length || 0;
        const activeTeam = teamResult.data?.filter((t)=>t.status === "active").length || 0;
        const openJobs = jobsResult.data?.filter((j)=>[
                "pending",
                "scheduled",
                "in_progress"
            ].includes(j.status)).length || 0;
        const completedJobs = jobsResult.data?.filter((j)=>j.status === "completed").length || 0;
        const pendingInvoices = invoicesResult.data?.filter((i)=>[
                "sent",
                "viewed"
            ].includes(i.status)).length || 0;
        const overdueBalance = invoicesResult.data?.filter((i)=>i.balance_amount > 0).reduce((s, i)=>s + i.balance_amount, 0) || 0;
        const pendingEstimates = estimatesResult.data?.filter((e)=>[
                "sent",
                "viewed"
            ].includes(e.status)).length || 0;
        const activeContracts = contractsResult.data?.filter((c)=>c.status === "active").length || 0;
        // Team role breakdown
        const roleBreakdown = {};
        teamResult.data?.forEach((t)=>{
            roleBreakdown[t.role || "unassigned"] = (roleBreakdown[t.role || "unassigned"] || 0) + 1;
        });
        return {
            success: true,
            overview: {
                customers: {
                    total: customersResult.count || 0,
                    active: activeCustomers
                },
                team: {
                    total: teamResult.count || 0,
                    active: activeTeam,
                    byRole: roleBreakdown
                },
                vendors: {
                    total: vendorsResult.count || 0
                },
                jobs: {
                    total: jobsResult.count || 0,
                    open: openJobs,
                    completed: completedJobs
                },
                invoices: {
                    total: invoicesResult.count || 0,
                    pending: pendingInvoices,
                    outstandingBalance: overdueBalance / 100
                },
                estimates: {
                    total: estimatesResult.count || 0,
                    pending: pendingEstimates
                },
                contracts: {
                    total: contractsResult.count || 0,
                    active: activeContracts
                },
                properties: {
                    total: propertiesResult.count || 0
                },
                equipment: {
                    total: equipmentResult.count || 0
                },
                appointments: {
                    total: appointmentsResult.count || 0
                }
            }
        };
    }
});
const searchAllEntitesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search across multiple tables simultaneously using full-text search with relevance ranking. Use for broad searches when you don't know which entity type contains the information.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Search term - supports multi-word queries and typo tolerance"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10).describe("Results per table")
    }),
    execute: async ({ query, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Use unified full-text search for better performance and relevance
        const searchResults = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$search$2f$full$2d$text$2d$search$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchAllEntities"])(supabase, companyId, query, {
            limit
        });
        // Format results for AI consumption
        const results = {};
        if (searchResults.customers.length > 0) results.customers = searchResults.customers;
        if (searchResults.jobs.length > 0) results.jobs = searchResults.jobs;
        if (searchResults.properties.length > 0) results.properties = searchResults.properties;
        if (searchResults.equipment.length > 0) results.equipment = searchResults.equipment;
        if (searchResults.priceBookItems.length > 0) results.priceBookItems = searchResults.priceBookItems;
        const totalResults = Object.values(results).reduce((sum, arr)=>sum + arr.length, 0);
        return {
            success: true,
            results,
            totalResults,
            query
        };
    }
});
const searchCustomersTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for customers by name, email, phone, or address using full-text search with relevance ranking. Supports multi-word queries and typo tolerance.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Search query - can be name, email, phone, or address"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10).describe("Maximum results to return")
    }),
    execute: async ({ query, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Use full-text search for better performance and relevance
        const customers = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$search$2f$full$2d$text$2d$search$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchCustomersFullText"])(supabase, companyId, query, {
            limit
        });
        return {
            success: true,
            customers,
            count: customers.length
        };
    }
});
const getCustomerDetailsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get detailed information about a specific customer including their jobs, invoices, and communication history",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("The UUID of the customer")
    }),
    execute: async ({ customerId }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const [customerResult, jobsResult, invoicesResult] = await Promise.all([
            supabase.from("customers").select("*").eq("id", customerId).eq("company_id", companyId).single(),
            supabase.from("jobs").select("id, title, status, total_amount, scheduled_start").eq("customer_id", customerId).order("created_at", {
                ascending: false
            }).limit(5),
            supabase.from("invoices").select("id, invoice_number, status, total_amount, balance_amount, due_date").eq("customer_id", customerId).order("created_at", {
                ascending: false
            }).limit(5)
        ]);
        if (customerResult.error) return {
            success: false,
            error: customerResult.error.message
        };
        return {
            success: true,
            customer: customerResult.data,
            recentJobs: jobsResult.data || [],
            recentInvoices: invoicesResult.data || []
        };
    }
});
const createCustomerTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Create a new customer in the system. Use this when a new customer contacts the business.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Customer's first name"),
        lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Customer's last name"),
        email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().describe("Customer's email address"),
        phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Customer's phone number"),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Street address"),
        city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("City"),
        state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("State"),
        zipCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("ZIP code"),
        source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("How the customer found us (referral, google, etc.)")
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("customers").insert({
            company_id: companyId,
            first_name: params.firstName,
            last_name: params.lastName,
            display_name: `${params.firstName} ${params.lastName}`,
            email: params.email,
            phone: params.phone,
            address: params.address,
            city: params.city,
            state: params.state,
            zip_code: params.zipCode,
            source: params.source,
            status: "active"
        }).select().single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            customer: data,
            message: `Created customer ${data.display_name}`
        };
    }
});
const updateCustomerTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Update customer information",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Customer ID to update"),
        updates: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional(),
            phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            zipCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
        }).describe("Fields to update")
    }),
    execute: async ({ customerId, updates }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const updateData = {};
        if (updates.firstName) updateData.first_name = updates.firstName;
        if (updates.lastName) updateData.last_name = updates.lastName;
        if (updates.email) updateData.email = updates.email;
        if (updates.phone) updateData.phone = updates.phone;
        if (updates.address) updateData.address = updates.address;
        if (updates.city) updateData.city = updates.city;
        if (updates.state) updateData.state = updates.state;
        if (updates.zipCode) updateData.zip_code = updates.zipCode;
        if (updates.notes) updateData.notes = updates.notes;
        if (updates.firstName || updates.lastName) {
            updateData.display_name = `${updates.firstName || ""} ${updates.lastName || ""}`.trim();
        }
        const { data, error } = await supabase.from("customers").update(updateData).eq("id", customerId).eq("company_id", companyId).select().single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            customer: data
        };
    }
});
const searchTeamMembersTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for team members by name, role, or department. Use this to find employees to assign or contact.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Search query - name or email"),
        role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Filter by role (technician, admin, manager, etc.)"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ query, role, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("team_members").select("id, first_name, last_name, email, phone, role, department, status, hire_date, avatar_url").eq("company_id", companyId).eq("status", "active");
        if (query) {
            queryBuilder = queryBuilder.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
        }
        if (role) queryBuilder = queryBuilder.eq("role", role);
        const { data, error } = await queryBuilder.limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            teamMembers: data,
            count: data?.length || 0
        };
    }
});
const getTeamMemberDetailsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get detailed information about a team member including their schedule and performance",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        teamMemberId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("The team member's ID")
    }),
    execute: async ({ teamMemberId }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const [memberResult, jobsResult] = await Promise.all([
            supabase.from("team_members").select("*").eq("id", teamMemberId).eq("company_id", companyId).single(),
            supabase.from("jobs").select("id, title, status, scheduled_start, total_amount").eq("assigned_to", teamMemberId).order("scheduled_start", {
                ascending: false
            }).limit(10)
        ]);
        if (memberResult.error) return {
            success: false,
            error: memberResult.error.message
        };
        return {
            success: true,
            teamMember: memberResult.data,
            recentJobs: jobsResult.data || []
        };
    }
});
const sendTeamEmailTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an email to a team member for internal communication, assignments, or updates.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        teamMemberId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Team member ID to send email to"),
        subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Email subject"),
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Email body (HTML supported)")
    }),
    execute: async ({ teamMemberId, subject, body }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get team member email
        const { data: member } = await supabase.from("team_members").select("email, first_name, last_name").eq("id", teamMemberId).eq("company_id", companyId).single();
        if (!member?.email) return {
            success: false,
            error: "Team member email not found"
        };
        const { resend } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript, async loader)");
        if (!resend) return {
            success: false,
            error: "Email service not configured"
        };
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
            to: member.email,
            subject,
            html: body
        });
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            messageId: data?.id,
            message: `Email sent to ${member.first_name} ${member.last_name}`
        };
    }
});
const sendTeamSmsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an SMS to a team member for urgent updates or assignments.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        teamMemberId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Team member ID"),
        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(160).describe("SMS message (max 160 chars)")
    }),
    execute: async ({ teamMemberId, message }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data: member } = await supabase.from("team_members").select("phone, first_name, last_name").eq("id", teamMemberId).eq("company_id", companyId).single();
        if (!member?.phone) return {
            success: false,
            error: "Team member phone not found"
        };
        const { data: phoneNumber } = await supabase.from("phone_numbers").select("phone_number").eq("company_id", companyId).eq("is_primary", true).single();
        if (!phoneNumber) return {
            success: false,
            error: "No company phone configured"
        };
        const { sendSMS } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/messaging.ts [app-rsc] (ecmascript, async loader)");
        const result = await sendSMS({
            from: phoneNumber.phone_number,
            to: member.phone,
            text: message
        });
        if (!result.success) return {
            success: false,
            error: result.error
        };
        return {
            success: true,
            messageId: result.messageId,
            message: `SMS sent to ${member.first_name} ${member.last_name}`
        };
    }
});
const searchVendorsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for vendors/suppliers by name, category, or status",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Search query - name or contact"),
        category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Vendor category (supplies, equipment, parts, etc.)"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ query, category, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("vendors").select("id, name, contact_name, email, phone, category, status, account_number, payment_terms").eq("company_id", companyId);
        if (query) queryBuilder = queryBuilder.or(`name.ilike.%${query}%,contact_name.ilike.%${query}%`);
        if (category) queryBuilder = queryBuilder.eq("category", category);
        const { data, error } = await queryBuilder.limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            vendors: data,
            count: data?.length || 0
        };
    }
});
const getVendorDetailsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get detailed information about a vendor including purchase history",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        vendorId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Vendor ID")
    }),
    execute: async ({ vendorId }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const [vendorResult, purchasesResult] = await Promise.all([
            supabase.from("vendors").select("*").eq("id", vendorId).eq("company_id", companyId).single(),
            supabase.from("purchase_orders").select("id, po_number, status, total_amount, order_date").eq("vendor_id", vendorId).order("order_date", {
                ascending: false
            }).limit(10)
        ]);
        if (vendorResult.error) return {
            success: false,
            error: vendorResult.error.message
        };
        return {
            success: true,
            vendor: vendorResult.data,
            recentPurchases: purchasesResult.data || []
        };
    }
});
const sendVendorEmailTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an email to a vendor for orders, inquiries, or communication.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        vendorId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Vendor ID"),
        subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Email subject"),
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Email body")
    }),
    execute: async ({ vendorId, subject, body }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data: vendor } = await supabase.from("vendors").select("email, name, contact_name").eq("id", vendorId).eq("company_id", companyId).single();
        if (!vendor?.email) return {
            success: false,
            error: "Vendor email not found"
        };
        const { resend } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript, async loader)");
        if (!resend) return {
            success: false,
            error: "Email service not configured"
        };
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
            to: vendor.email,
            subject,
            html: body
        });
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            messageId: data?.id,
            message: `Email sent to ${vendor.name}`
        };
    }
});
const sendVendorSmsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an SMS to a vendor contact for urgent communication.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        vendorId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Vendor ID"),
        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(160).describe("SMS message")
    }),
    execute: async ({ vendorId, message }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data: vendor } = await supabase.from("vendors").select("phone, name").eq("id", vendorId).eq("company_id", companyId).single();
        if (!vendor?.phone) return {
            success: false,
            error: "Vendor phone not found"
        };
        const { data: phoneNumber } = await supabase.from("phone_numbers").select("phone_number").eq("company_id", companyId).eq("is_primary", true).single();
        if (!phoneNumber) return {
            success: false,
            error: "No company phone configured"
        };
        const { sendSMS } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/messaging.ts [app-rsc] (ecmascript, async loader)");
        const result = await sendSMS({
            from: phoneNumber.phone_number,
            to: vendor.phone,
            text: message
        });
        if (!result.success) return {
            success: false,
            error: result.error
        };
        return {
            success: true,
            messageId: result.messageId,
            message: `SMS sent to ${vendor.name}`
        };
    }
});
const searchPropertiesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for service properties by address, customer, or type",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Address or property name search"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Filter by customer"),
        propertyType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Property type (residential, commercial, etc.)"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ query, customerId, propertyType, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("properties").select("id, name, address, city, state, zip_code, property_type, customer:customers(display_name)").eq("company_id", companyId);
        if (query) queryBuilder = queryBuilder.or(`address.ilike.%${query}%,name.ilike.%${query}%`);
        if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);
        if (propertyType) queryBuilder = queryBuilder.eq("property_type", propertyType);
        const { data, error } = await queryBuilder.limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            properties: data,
            count: data?.length || 0
        };
    }
});
const getPropertyDetailsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get detailed property information including equipment and service history",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        propertyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Property ID")
    }),
    execute: async ({ propertyId }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const [propertyResult, equipmentResult, jobsResult] = await Promise.all([
            supabase.from("properties").select("*, customer:customers(display_name, phone, email)").eq("id", propertyId).eq("company_id", companyId).single(),
            supabase.from("equipment").select("id, name, model, serial_number, install_date, warranty_expiry, last_service_date").eq("property_id", propertyId).limit(20),
            supabase.from("jobs").select("id, title, status, scheduled_start, completed_at").eq("property_id", propertyId).order("scheduled_start", {
                ascending: false
            }).limit(10)
        ]);
        if (propertyResult.error) return {
            success: false,
            error: propertyResult.error.message
        };
        return {
            success: true,
            property: propertyResult.data,
            equipment: equipmentResult.data || [],
            serviceHistory: jobsResult.data || []
        };
    }
});
const searchEquipmentTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for equipment/assets by type, customer, or model",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Equipment name, model, or serial number"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        equipmentType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Equipment type (HVAC, plumbing, electrical, etc.)"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ query, customerId, equipmentType, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("equipment").select("id, name, model, serial_number, equipment_type, install_date, warranty_expiry, last_service_date, property:properties(address, customer:customers(display_name))").eq("company_id", companyId);
        if (query) queryBuilder = queryBuilder.or(`name.ilike.%${query}%,model.ilike.%${query}%,serial_number.ilike.%${query}%`);
        if (equipmentType) queryBuilder = queryBuilder.eq("equipment_type", equipmentType);
        const { data, error } = await queryBuilder.limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            equipment: data,
            count: data?.length || 0
        };
    }
});
const getMaintenanceDueTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get equipment that is due or overdue for maintenance service",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        daysAhead: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(30).describe("Look ahead days for upcoming maintenance")
    }),
    execute: async ({ daysAhead }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
        const { data, error } = await supabase.from("equipment").select("id, name, model, last_service_date, next_service_date, property:properties(address, customer:customers(display_name, phone, email))").eq("company_id", companyId).lte("next_service_date", futureDate.toISOString()).order("next_service_date", {
            ascending: true
        }).limit(50);
        if (error) return {
            success: false,
            error: error.message
        };
        const overdue = data?.filter((e)=>new Date(e.next_service_date) < new Date()) || [];
        const upcoming = data?.filter((e)=>new Date(e.next_service_date) >= new Date()) || [];
        return {
            success: true,
            overdue,
            upcoming,
            overdueCount: overdue.length,
            upcomingCount: upcoming.length
        };
    }
});
const searchJobsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for jobs by title, job number, description, or status using full-text search with relevance ranking. Supports multi-word queries and typo tolerance.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Search query - searches job number, title, description"),
        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "pending",
            "scheduled",
            "in_progress",
            "completed",
            "cancelled"
        ]).optional(),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10)
    }),
    execute: async ({ query, status, customerId, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Use full-text search if there's a query
        if (query && !status && !customerId) {
            const jobs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$search$2f$full$2d$text$2d$search$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["searchJobsFullText"])(supabase, companyId, query, {
                limit
            });
            return {
                success: true,
                jobs,
                count: jobs.length
            };
        }
        // Fall back to filtered query when status/customerId filters are used
        let queryBuilder = supabase.from("jobs").select("id, job_number, title, status, total_amount, scheduled_start, scheduled_end, customer:customers(display_name, phone)").eq("company_id", companyId).is("deleted_at", null);
        if (query) queryBuilder = queryBuilder.or(`title.ilike.%${query}%,job_number.ilike.%${query}%`);
        if (status) queryBuilder = queryBuilder.eq("status", status);
        if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);
        const { data, error } = await queryBuilder.order("scheduled_start", {
            ascending: false
        }).limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            jobs: data,
            count: data?.length || 0
        };
    }
});
const createAppointmentTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Schedule a new appointment for a customer. Use this to book service calls or consultations.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Customer to schedule for"),
        propertyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Property where service will be performed"),
        title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Appointment title/description"),
        startTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Start time in ISO format (YYYY-MM-DDTHH:mm:ss)"),
        duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Duration in minutes"),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "service",
            "consultation",
            "estimate",
            "follow_up"
        ]).default("service"),
        notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Additional notes for the technician")
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const startDate = new Date(params.startTime);
        const endDate = new Date(startDate.getTime() + params.duration * 60000);
        const { data, error } = await supabase.from("appointments").insert({
            company_id: companyId,
            customer_id: params.customerId,
            property_id: params.propertyId,
            title: params.title,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            duration: params.duration,
            type: params.type,
            notes: params.notes,
            status: "scheduled"
        }).select().single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            appointment: data,
            message: `Scheduled appointment for ${startDate.toLocaleString()}`
        };
    }
});
const getAvailableSlotsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Find available appointment slots for scheduling. Returns available time windows.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Date to check (YYYY-MM-DD)"),
        duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().default(60).describe("Required duration in minutes")
    }),
    execute: async ({ date, duration }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const targetDate = new Date(date);
        const dayStart = new Date(targetDate.setHours(8, 0, 0, 0));
        const dayEnd = new Date(targetDate.setHours(18, 0, 0, 0));
        // Get existing appointments for that day
        const { data: appointments } = await supabase.from("appointments").select("start_time, end_time").eq("company_id", companyId).gte("start_time", dayStart.toISOString()).lte("start_time", dayEnd.toISOString()).neq("status", "cancelled");
        // Calculate available slots (simplified)
        const availableSlots = [];
        let currentTime = dayStart;
        while(currentTime < dayEnd){
            const slotEnd = new Date(currentTime.getTime() + duration * 60000);
            const hasConflict = appointments?.some((apt)=>{
                const aptStart = new Date(apt.start_time);
                const aptEnd = new Date(apt.end_time);
                return currentTime < aptEnd && slotEnd > aptStart;
            });
            if (!hasConflict && slotEnd <= dayEnd) {
                availableSlots.push({
                    start: currentTime.toISOString(),
                    end: slotEnd.toISOString()
                });
            }
            currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute increments
        }
        return {
            success: true,
            availableSlots,
            date
        };
    }
});
const searchInvoicesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for invoices by number, customer, or status",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "draft",
            "sent",
            "viewed",
            "paid",
            "overdue",
            "cancelled"
        ]).optional(),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10)
    }),
    execute: async ({ query, status, customerId, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("invoices").select("id, invoice_number, title, status, total_amount, balance_amount, due_date, customer:customers(display_name)").eq("company_id", companyId);
        if (query) queryBuilder = queryBuilder.ilike("invoice_number", `%${query}%`);
        if (status) queryBuilder = queryBuilder.eq("status", status);
        if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);
        const { data, error } = await queryBuilder.order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            invoices: data,
            count: data?.length || 0
        };
    }
});
const createInvoiceTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Create a new invoice for a customer",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Customer to invoice"),
        title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Invoice title/description"),
        lineItems: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            quantity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
            unitPrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Price in cents")
        })).describe("Line items for the invoice"),
        dueDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Due date (YYYY-MM-DD)"),
        notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Calculate totals
        const subtotal = params.lineItems.reduce((sum, item)=>sum + item.quantity * item.unitPrice, 0);
        const taxAmount = Math.round(subtotal * 0.08); // 8% tax example
        const totalAmount = subtotal + taxAmount;
        // Generate invoice number
        const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
        const { data, error } = await supabase.from("invoices").insert({
            company_id: companyId,
            customer_id: params.customerId,
            invoice_number: invoiceNumber,
            title: params.title,
            line_items: params.lineItems,
            subtotal,
            tax_amount: taxAmount,
            total_amount: totalAmount,
            balance_amount: totalAmount,
            due_date: params.dueDate ? new Date(params.dueDate).toISOString() : null,
            notes: params.notes,
            status: "draft"
        }).select().single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            invoice: data,
            message: `Created invoice ${invoiceNumber} for $${(totalAmount / 100).toFixed(2)}`
        };
    }
});
const getFinancialSummaryTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get a financial summary including revenue, outstanding balances, and trends. Use this to provide business advice.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        period: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "today",
            "week",
            "month",
            "quarter",
            "year"
        ]).default("month")
    }),
    execute: async ({ period }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const now = new Date();
        let startDate;
        switch(period){
            case "today":
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case "week":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "quarter":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case "year":
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
        }
        const [invoicesResult, paymentsResult, overdueResult] = await Promise.all([
            supabase.from("invoices").select("total_amount, paid_amount, balance_amount, status").eq("company_id", companyId).gte("created_at", startDate.toISOString()),
            supabase.from("payments").select("amount").eq("company_id", companyId).eq("status", "completed").gte("created_at", startDate.toISOString()),
            supabase.from("invoices").select("id, invoice_number, balance_amount, due_date, customer:customers(display_name)").eq("company_id", companyId).eq("status", "sent").lt("due_date", new Date().toISOString()).gt("balance_amount", 0)
        ]);
        const totalInvoiced = invoicesResult.data?.reduce((sum, inv)=>sum + inv.total_amount, 0) || 0;
        const totalCollected = paymentsResult.data?.reduce((sum, pay)=>sum + pay.amount, 0) || 0;
        const totalOutstanding = invoicesResult.data?.reduce((sum, inv)=>sum + inv.balance_amount, 0) || 0;
        return {
            success: true,
            period,
            summary: {
                totalInvoiced: totalInvoiced / 100,
                totalCollected: totalCollected / 100,
                totalOutstanding: totalOutstanding / 100,
                invoiceCount: invoicesResult.data?.length || 0,
                collectionRate: totalInvoiced > 0 ? (totalCollected / totalInvoiced * 100).toFixed(1) : 0
            },
            overdueInvoices: overdueResult.data || []
        };
    }
});
const getVirtualBucketsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get virtual financial buckets for the company. These are savings goals and fund allocations.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: async (_params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("finance_virtual_buckets").select("*").eq("company_id", companyId).eq("is_active", true);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            buckets: data
        };
    }
});
const transferToBucketTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Transfer funds to a virtual bucket for savings goals. This is for financial planning.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        bucketId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Target bucket ID"),
        amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Amount to transfer in cents"),
        note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Note for the transfer")
    }),
    execute: async ({ bucketId, amount, note }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Update bucket balance
        const { data: bucket, error: fetchError } = await supabase.from("finance_virtual_buckets").select("*").eq("id", bucketId).eq("company_id", companyId).single();
        if (fetchError || !bucket) return {
            success: false,
            error: "Bucket not found"
        };
        const newBalance = (bucket.current_balance || 0) + amount;
        const { error: updateError } = await supabase.from("finance_virtual_buckets").update({
            current_balance: newBalance,
            updated_at: new Date().toISOString()
        }).eq("id", bucketId);
        if (updateError) return {
            success: false,
            error: updateError.message
        };
        return {
            success: true,
            message: `Transferred $${(amount / 100).toFixed(2)} to ${bucket.name}. New balance: $${(newBalance / 100).toFixed(2)}`,
            bucket: {
                ...bucket,
                current_balance: newBalance
            }
        };
    }
});
const sendEmailTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an email to a customer. Use this for follow-ups, reminders, or responding to inquiries.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().describe("Recipient email address"),
        subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Email subject line"),
        body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Email body content (HTML supported)"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Associated customer ID for tracking")
    }),
    execute: async (params, { companyId })=>{
        // Import Resend dynamically to avoid issues
        const { resend } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript, async loader)");
        if (!resend) {
            return {
                success: false,
                error: "Email service not configured"
            };
        }
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
            to: params.to,
            subject: params.subject,
            html: params.body
        });
        if (error) return {
            success: false,
            error: error.message
        };
        // Log communication
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("communications").insert({
            company_id: companyId,
            customer_id: params.customerId,
            type: "email",
            direction: "outbound",
            to_address: params.to,
            subject: params.subject,
            body: params.body,
            body_html: params.body,
            status: "sent",
            sent_at: new Date().toISOString(),
            provider_message_id: data?.id
        });
        return {
            success: true,
            messageId: data?.id,
            message: `Email sent to ${params.to}`
        };
    }
});
const sendSmsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an SMS text message to a customer. Use for appointment reminders or quick updates.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Phone number (format: +1XXXXXXXXXX)"),
        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(160).describe("Message content (max 160 characters)"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Associated customer ID")
    }),
    execute: async (params, { companyId })=>{
        // Get company phone number
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data: phoneNumber } = await supabase.from("phone_numbers").select("phone_number, telnyx_connection_id").eq("company_id", companyId).eq("is_primary", true).single();
        if (!phoneNumber) {
            return {
                success: false,
                error: "No phone number configured for company"
            };
        }
        // Send via Telnyx
        const { sendSMS } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/messaging.ts [app-rsc] (ecmascript, async loader)");
        const result = await sendSMS({
            from: phoneNumber.phone_number,
            to: params.to,
            text: params.message
        });
        if (!result.success) return {
            success: false,
            error: result.error
        };
        // Log communication
        await supabase.from("communications").insert({
            company_id: companyId,
            customer_id: params.customerId,
            type: "sms",
            direction: "outbound",
            to_address: params.to,
            body: params.message,
            status: "sent",
            sent_at: new Date().toISOString(),
            telnyx_message_id: result.messageId
        });
        return {
            success: true,
            messageId: result.messageId,
            message: `SMS sent to ${params.to}`
        };
    }
});
const initiateCallTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Initiate a phone call to a customer. The call will be connected through the business phone system.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Phone number to call (format: +1XXXXXXXXXX)"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Associated customer ID"),
        reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Reason for the call (for logging)")
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get company phone configuration
        const { data: phoneNumber } = await supabase.from("phone_numbers").select("phone_number, telnyx_connection_id").eq("company_id", companyId).eq("is_primary", true).single();
        if (!phoneNumber) {
            return {
                success: false,
                error: "No phone number configured"
            };
        }
        // Initiate call via Telnyx
        const { initiateCall } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/calls.ts [app-rsc] (ecmascript, async loader)");
        const result = await initiateCall({
            connectionId: phoneNumber.telnyx_connection_id,
            from: phoneNumber.phone_number,
            to: params.to
        });
        if (!result.success) return {
            success: false,
            error: result.error
        };
        // Log communication
        await supabase.from("communications").insert({
            company_id: companyId,
            customer_id: params.customerId,
            type: "call",
            direction: "outbound",
            to_address: params.to,
            from_address: phoneNumber.phone_number,
            body: params.reason || "Outbound call",
            status: "pending",
            telnyx_call_control_id: result.callControlId
        });
        return {
            success: true,
            callControlId: result.callControlId,
            message: `Call initiated to ${params.to}`
        };
    }
});
const getCommunicationHistoryTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get communication history with a customer (calls, texts, emails)",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Customer ID to get history for"),
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "all",
            "email",
            "sms",
            "call"
        ]).optional().default("all"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ customerId, type, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("communications").select("*").eq("company_id", companyId).eq("customer_id", customerId);
        if (type !== "all") queryBuilder = queryBuilder.eq("type", type);
        const { data, error } = await queryBuilder.order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            communications: data
        };
    }
});
const getDashboardMetricsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get key business metrics for the dashboard. Use this to provide business insights and recommendations.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: async (_params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        const [customersResult, jobsResult, invoicesResult] = await Promise.all([
            supabase.from("customers").select("id", {
                count: "exact",
                head: true
            }).eq("company_id", companyId).eq("status", "active"),
            supabase.from("jobs").select("id, status, total_amount").eq("company_id", companyId).gte("created_at", thirtyDaysAgo.toISOString()),
            supabase.from("invoices").select("id, total_amount, balance_amount, status").eq("company_id", companyId).gte("created_at", thirtyDaysAgo.toISOString())
        ]);
        const completedJobs = jobsResult.data?.filter((j)=>j.status === "completed") || [];
        const overdueInvoices = invoicesResult.data?.filter((i)=>i.status === "sent" && i.balance_amount > 0) || [];
        return {
            success: true,
            metrics: {
                activeCustomers: customersResult.count || 0,
                jobsLast30Days: jobsResult.data?.length || 0,
                completedJobsLast30Days: completedJobs.length,
                jobCompletionRate: jobsResult.data?.length ? (completedJobs.length / jobsResult.data.length * 100).toFixed(1) : 0,
                invoicesLast30Days: invoicesResult.data?.length || 0,
                overdueInvoiceCount: overdueInvoices.length,
                totalOutstanding: overdueInvoices.reduce((sum, i)=>sum + i.balance_amount, 0) / 100
            }
        };
    }
});
const getProactiveInsightsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get proactive business insights and recommendations. Use this to help owners make decisions.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: async (_params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get various insights
        const [overdueResult, inactiveCustomersResult, upcomingAppointmentsResult] = await Promise.all([
            // Overdue invoices
            supabase.from("invoices").select("id, invoice_number, balance_amount, due_date, customer:customers(display_name, phone, email)").eq("company_id", companyId).eq("status", "sent").lt("due_date", new Date().toISOString()).gt("balance_amount", 0).limit(5),
            // Customers inactive for 90+ days
            supabase.from("customers").select("id, display_name, phone, email, last_job_date").eq("company_id", companyId).eq("status", "active").lt("last_job_date", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()).limit(5),
            // Tomorrow's appointments
            supabase.from("appointments").select("id, title, start_time, customer:customers(display_name, phone)").eq("company_id", companyId).eq("status", "scheduled").gte("start_time", new Date().toISOString()).lt("start_time", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()).limit(10)
        ]);
        const insights = [];
        if (overdueResult.data && overdueResult.data.length > 0) {
            const totalOverdue = overdueResult.data.reduce((sum, inv)=>sum + inv.balance_amount, 0);
            insights.push({
                type: "overdue_invoices",
                severity: "high",
                title: `${overdueResult.data.length} overdue invoices totaling $${(totalOverdue / 100).toFixed(2)}`,
                recommendation: "Consider sending payment reminders or initiating collection calls",
                data: overdueResult.data
            });
        }
        if (inactiveCustomersResult.data && inactiveCustomersResult.data.length > 0) {
            insights.push({
                type: "inactive_customers",
                severity: "medium",
                title: `${inactiveCustomersResult.data.length} customers haven't had service in 90+ days`,
                recommendation: "Send re-engagement emails or offer maintenance service promotions",
                data: inactiveCustomersResult.data
            });
        }
        if (upcomingAppointmentsResult.data && upcomingAppointmentsResult.data.length > 0) {
            insights.push({
                type: "upcoming_appointments",
                severity: "info",
                title: `${upcomingAppointmentsResult.data.length} appointments scheduled for tomorrow`,
                recommendation: "Consider sending reminder messages to customers",
                data: upcomingAppointmentsResult.data
            });
        }
        return {
            success: true,
            insights
        };
    }
});
const scheduleReminderTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Schedule a reminder email or SMS to be sent at a specific time. Use for appointment reminders, payment reminders, or follow-ups.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        recipientType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "team_member",
            "vendor"
        ]).describe("Type of recipient"),
        recipientId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("ID of the recipient"),
        channel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "email",
            "sms",
            "both"
        ]).describe("Communication channel"),
        subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Email subject (for email channel)"),
        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Message content"),
        sendAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("When to send (ISO format)"),
        relatedTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
                "job",
                "invoice",
                "appointment",
                "estimate"
            ]).optional(),
            id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional()
        }).optional().describe("Related entity")
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get recipient details based on type
        let recipientEmail = null;
        let recipientPhone = null;
        let recipientName = "";
        if (params.recipientType === "customer") {
            const { data } = await supabase.from("customers").select("email, phone, display_name").eq("id", params.recipientId).eq("company_id", companyId).single();
            if (data) {
                recipientEmail = data.email;
                recipientPhone = data.phone;
                recipientName = data.display_name;
            }
        } else if (params.recipientType === "team_member") {
            const { data } = await supabase.from("team_members").select("email, phone, first_name, last_name").eq("id", params.recipientId).eq("company_id", companyId).single();
            if (data) {
                recipientEmail = data.email;
                recipientPhone = data.phone;
                recipientName = `${data.first_name} ${data.last_name}`;
            }
        } else if (params.recipientType === "vendor") {
            const { data } = await supabase.from("vendors").select("email, phone, name").eq("id", params.recipientId).eq("company_id", companyId).single();
            if (data) {
                recipientEmail = data.email;
                recipientPhone = data.phone;
                recipientName = data.name;
            }
        }
        if (!recipientEmail && !recipientPhone) {
            return {
                success: false,
                error: "Recipient contact information not found"
            };
        }
        // Create scheduled notification
        const { data, error } = await supabase.from("scheduled_notifications").insert({
            company_id: companyId,
            recipient_type: params.recipientType,
            recipient_id: params.recipientId,
            recipient_name: recipientName,
            recipient_email: recipientEmail,
            recipient_phone: recipientPhone,
            channel: params.channel,
            subject: params.subject,
            message: params.message,
            scheduled_at: params.sendAt,
            related_type: params.relatedTo?.type,
            related_id: params.relatedTo?.id,
            status: "scheduled"
        }).select().single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            reminder: data,
            message: `Reminder scheduled for ${recipientName} at ${new Date(params.sendAt).toLocaleString()}`
        };
    }
});
const cancelReminderTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Cancel a scheduled reminder",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        reminderId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("ID of the reminder to cancel")
    }),
    execute: async ({ reminderId }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { error } = await supabase.from("scheduled_notifications").update({
            status: "cancelled"
        }).eq("id", reminderId).eq("company_id", companyId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            message: "Reminder cancelled successfully"
        };
    }
});
const getScheduledRemindersTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get list of scheduled reminders for a customer, job, or entity",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        recipientType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "team_member",
            "vendor"
        ]).optional(),
        recipientId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        relatedType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "job",
            "invoice",
            "appointment",
            "estimate"
        ]).optional(),
        relatedId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "scheduled",
            "sent",
            "cancelled",
            "failed"
        ]).optional().default("scheduled")
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("scheduled_notifications").select("*").eq("company_id", companyId);
        if (params.recipientType) queryBuilder = queryBuilder.eq("recipient_type", params.recipientType);
        if (params.recipientId) queryBuilder = queryBuilder.eq("recipient_id", params.recipientId);
        if (params.relatedType) queryBuilder = queryBuilder.eq("related_type", params.relatedType);
        if (params.relatedId) queryBuilder = queryBuilder.eq("related_id", params.relatedId);
        if (params.status) queryBuilder = queryBuilder.eq("status", params.status);
        const { data, error } = await queryBuilder.order("scheduled_at", {
            ascending: true
        });
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            reminders: data,
            count: data?.length || 0
        };
    }
});
const sendImmediateNotificationTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Send an immediate notification to a customer, team member, or vendor. Use for urgent updates.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        recipientType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "team_member",
            "vendor"
        ]).describe("Type of recipient"),
        recipientId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("ID of the recipient"),
        channel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "email",
            "sms",
            "both"
        ]).describe("Communication channel"),
        subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Email subject"),
        message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Message content"),
        priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "normal",
            "high",
            "urgent"
        ]).optional().default("normal")
    }),
    execute: async (params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const results = {};
        // Get recipient details
        let recipientEmail = null;
        let recipientPhone = null;
        let recipientName = "";
        if (params.recipientType === "customer") {
            const { data } = await supabase.from("customers").select("email, phone, display_name").eq("id", params.recipientId).single();
            if (data) {
                recipientEmail = data.email;
                recipientPhone = data.phone;
                recipientName = data.display_name;
            }
        } else if (params.recipientType === "team_member") {
            const { data } = await supabase.from("team_members").select("email, phone, first_name, last_name").eq("id", params.recipientId).single();
            if (data) {
                recipientEmail = data.email;
                recipientPhone = data.phone;
                recipientName = `${data.first_name} ${data.last_name}`;
            }
        } else if (params.recipientType === "vendor") {
            const { data } = await supabase.from("vendors").select("email, phone, name").eq("id", params.recipientId).single();
            if (data) {
                recipientEmail = data.email;
                recipientPhone = data.phone;
                recipientName = data.name;
            }
        }
        // Send email if requested
        if ((params.channel === "email" || params.channel === "both") && recipientEmail) {
            const { resend } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript, async loader)");
            if (resend) {
                const { data, error } = await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com",
                    to: recipientEmail,
                    subject: params.subject || "Notification",
                    html: params.message
                });
                results.email = error ? {
                    success: false,
                    error: error.message
                } : {
                    success: true,
                    messageId: data?.id
                };
            }
        }
        // Send SMS if requested
        if ((params.channel === "sms" || params.channel === "both") && recipientPhone) {
            const { data: phoneNumber } = await supabase.from("phone_numbers").select("phone_number").eq("company_id", companyId).eq("is_primary", true).single();
            if (phoneNumber) {
                const { sendSMS } = await __turbopack_context__.A("[project]/apps/web/src/lib/telnyx/messaging.ts [app-rsc] (ecmascript, async loader)");
                const result = await sendSMS({
                    from: phoneNumber.phone_number,
                    to: recipientPhone,
                    text: params.message.slice(0, 160)
                });
                results.sms = result.success ? {
                    success: true,
                    messageId: result.messageId
                } : {
                    success: false,
                    error: result.error
                };
            }
        }
        return {
            success: true,
            results,
            message: `Notification sent to ${recipientName}`
        };
    }
});
const getJobCostingReportTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get detailed job costing report including labor, materials, and profit margins",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        jobId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Specific job ID, or omit for summary"),
        period: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "week",
            "month",
            "quarter",
            "year"
        ]).optional().default("month"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ jobId, period, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (jobId) {
            // Single job costing
            const { data: job, error } = await supabase.from("jobs").select("*, customer:customers(display_name), line_items, labor_cost, material_cost, total_amount").eq("id", jobId).eq("company_id", companyId).single();
            if (error) return {
                success: false,
                error: error.message
            };
            const laborCost = job?.labor_cost || 0;
            const materialCost = job?.material_cost || 0;
            const totalRevenue = job?.total_amount || 0;
            const profit = totalRevenue - laborCost - materialCost;
            const margin = totalRevenue > 0 ? profit / totalRevenue * 100 : 0;
            return {
                success: true,
                job: {
                    ...job,
                    costing: {
                        laborCost: laborCost / 100,
                        materialCost: materialCost / 100,
                        totalCost: (laborCost + materialCost) / 100,
                        revenue: totalRevenue / 100,
                        profit: profit / 100,
                        marginPercent: margin.toFixed(1)
                    }
                }
            };
        }
        // Period summary
        const now = new Date();
        let startDate;
        switch(period){
            case "week":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "quarter":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case "year":
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
        }
        const { data: jobs } = await supabase.from("jobs").select("id, title, labor_cost, material_cost, total_amount, status, completed_at, customer:customers(display_name)").eq("company_id", companyId).eq("status", "completed").gte("completed_at", startDate.toISOString()).order("completed_at", {
            ascending: false
        }).limit(limit);
        const summary = {
            totalJobs: jobs?.length || 0,
            totalRevenue: (jobs?.reduce((s, j)=>s + (j.total_amount || 0), 0) || 0) / 100,
            totalLaborCost: (jobs?.reduce((s, j)=>s + (j.labor_cost || 0), 0) || 0) / 100,
            totalMaterialCost: (jobs?.reduce((s, j)=>s + (j.material_cost || 0), 0) || 0) / 100,
            totalProfit: 0,
            averageMargin: 0
        };
        summary.totalProfit = summary.totalRevenue - summary.totalLaborCost - summary.totalMaterialCost;
        summary.averageMargin = summary.totalRevenue > 0 ? summary.totalProfit / summary.totalRevenue * 100 : 0;
        return {
            success: true,
            period,
            summary,
            jobs
        };
    }
});
const getRevenueBreakdownTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get revenue breakdown by customer, service type, or time period",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        groupBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "service_type",
            "month",
            "week"
        ]).default("month"),
        period: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "month",
            "quarter",
            "year"
        ]).default("quarter"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ groupBy, period, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const now = new Date();
        let startDate;
        switch(period){
            case "month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "quarter":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case "year":
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
        }
        const { data: invoices } = await supabase.from("invoices").select("id, total_amount, paid_amount, created_at, customer:customers(id, display_name), job:jobs(service_type)").eq("company_id", companyId).eq("status", "paid").gte("created_at", startDate.toISOString());
        // Group data
        const breakdown = {};
        invoices?.forEach((inv)=>{
            let key = "";
            let label = "";
            if (groupBy === "customer") {
                key = inv.customer?.id || "unknown";
                label = inv.customer?.display_name || "Unknown";
            } else if (groupBy === "service_type") {
                key = inv.job?.service_type || "general";
                label = inv.job?.service_type || "General";
            } else if (groupBy === "month") {
                const date = new Date(inv.created_at);
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
                label = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short"
                });
            } else if (groupBy === "week") {
                const date = new Date(inv.created_at);
                const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
                key = weekStart.toISOString().split("T")[0];
                label = `Week of ${weekStart.toLocaleDateString()}`;
            }
            if (!breakdown[key]) breakdown[key] = {
                label,
                revenue: 0,
                count: 0
            };
            breakdown[key].revenue += (inv.paid_amount || 0) / 100;
            breakdown[key].count += 1;
        });
        const results = Object.values(breakdown).sort((a, b)=>b.revenue - a.revenue).slice(0, limit);
        const totalRevenue = results.reduce((s, r)=>s + r.revenue, 0);
        return {
            success: true,
            groupBy,
            period,
            breakdown: results,
            totalRevenue
        };
    }
});
const getARAgingReportTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get accounts receivable aging report showing outstanding invoices by age (30/60/90+ days)",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({}),
    execute: async (_params, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const now = new Date();
        const { data: invoices } = await supabase.from("invoices").select("id, invoice_number, balance_amount, due_date, created_at, customer:customers(display_name, phone, email)").eq("company_id", companyId).in("status", [
            "sent",
            "viewed"
        ]).gt("balance_amount", 0);
        const aging = {
            current: {
                amount: 0,
                count: 0,
                invoices: []
            },
            days30: {
                amount: 0,
                count: 0,
                invoices: []
            },
            days60: {
                amount: 0,
                count: 0,
                invoices: []
            },
            days90Plus: {
                amount: 0,
                count: 0,
                invoices: []
            }
        };
        invoices?.forEach((inv)=>{
            const dueDate = new Date(inv.due_date);
            const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysOverdue <= 0) {
                aging.current.amount += inv.balance_amount;
                aging.current.count += 1;
                aging.current.invoices?.push(inv);
            } else if (daysOverdue <= 30) {
                aging.days30.amount += inv.balance_amount;
                aging.days30.count += 1;
                aging.days30.invoices?.push(inv);
            } else if (daysOverdue <= 60) {
                aging.days60.amount += inv.balance_amount;
                aging.days60.count += 1;
                aging.days60.invoices?.push(inv);
            } else {
                aging.days90Plus.amount += inv.balance_amount;
                aging.days90Plus.count += 1;
                aging.days90Plus.invoices?.push(inv);
            }
        });
        // Convert to dollars
        Object.keys(aging).forEach((key)=>{
            aging[key].amount = aging[key].amount / 100;
        });
        const totalOutstanding = aging.current.amount + aging.days30.amount + aging.days60.amount + aging.days90Plus.amount;
        return {
            success: true,
            aging,
            totalOutstanding,
            totalInvoices: invoices?.length || 0
        };
    }
});
const getTeamPerformanceReportTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get team member performance metrics including jobs completed, revenue generated, and ratings",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        teamMemberId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Specific team member, or omit for all"),
        period: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "week",
            "month",
            "quarter",
            "year"
        ]).default("month")
    }),
    execute: async ({ teamMemberId, period }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const now = new Date();
        let startDate;
        switch(period){
            case "week":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "quarter":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case "year":
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
        }
        let queryBuilder = supabase.from("jobs").select("id, assigned_to, status, total_amount, completed_at").eq("company_id", companyId).gte("created_at", startDate.toISOString());
        if (teamMemberId) queryBuilder = queryBuilder.eq("assigned_to", teamMemberId);
        const { data: jobs } = await queryBuilder;
        const { data: teamMembers } = await supabase.from("team_members").select("id, first_name, last_name, role").eq("company_id", companyId).eq("status", "active");
        // Aggregate by team member
        const performance = {};
        teamMembers?.forEach((tm)=>{
            performance[tm.id] = {
                name: `${tm.first_name} ${tm.last_name}`,
                role: tm.role,
                jobsAssigned: 0,
                jobsCompleted: 0,
                completionRate: 0,
                revenue: 0
            };
        });
        jobs?.forEach((job)=>{
            if (job.assigned_to && performance[job.assigned_to]) {
                performance[job.assigned_to].jobsAssigned += 1;
                if (job.status === "completed") {
                    performance[job.assigned_to].jobsCompleted += 1;
                    performance[job.assigned_to].revenue += (job.total_amount || 0) / 100;
                }
            }
        });
        // Calculate completion rates
        Object.values(performance).forEach((p)=>{
            p.completionRate = p.jobsAssigned > 0 ? p.jobsCompleted / p.jobsAssigned * 100 : 0;
        });
        const results = Object.values(performance).sort((a, b)=>b.revenue - a.revenue);
        return {
            success: true,
            period,
            performance: results
        };
    }
});
const getCustomerLifetimeValueTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get customer lifetime value (CLV) analysis showing total revenue and engagement per customer",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Specific customer, or omit for top customers"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ customerId, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (customerId) {
            // Single customer CLV
            const [customerResult, invoicesResult, jobsResult] = await Promise.all([
                supabase.from("customers").select("*").eq("id", customerId).eq("company_id", companyId).single(),
                supabase.from("invoices").select("total_amount, paid_amount, status, created_at").eq("customer_id", customerId),
                supabase.from("jobs").select("id, status, completed_at").eq("customer_id", customerId)
            ]);
            if (customerResult.error) return {
                success: false,
                error: customerResult.error.message
            };
            const totalRevenue = (invoicesResult.data?.filter((i)=>i.status === "paid").reduce((s, i)=>s + (i.paid_amount || 0), 0) || 0) / 100;
            const jobCount = jobsResult.data?.length || 0;
            const firstInvoice = invoicesResult.data?.sort((a, b)=>new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
            const customerSince = firstInvoice ? new Date(firstInvoice.created_at) : new Date(customerResult.data.created_at);
            const monthsAsCustomer = Math.max(1, Math.floor((Date.now() - customerSince.getTime()) / (1000 * 60 * 60 * 24 * 30)));
            return {
                success: true,
                customer: customerResult.data,
                clv: {
                    totalRevenue,
                    jobCount,
                    averageJobValue: jobCount > 0 ? totalRevenue / jobCount : 0,
                    customerSince: customerSince.toISOString(),
                    monthsAsCustomer,
                    monthlyAverageRevenue: totalRevenue / monthsAsCustomer
                }
            };
        }
        // Top customers by CLV
        const { data: customers } = await supabase.from("customers").select("id, display_name, total_revenue, job_count, created_at").eq("company_id", companyId).eq("status", "active").order("total_revenue", {
            ascending: false
        }).limit(limit);
        const clvData = customers?.map((c)=>({
                ...c,
                totalRevenue: (c.total_revenue || 0) / 100,
                averageJobValue: c.job_count > 0 ? (c.total_revenue || 0) / 100 / c.job_count : 0
            }));
        return {
            success: true,
            topCustomers: clvData
        };
    }
});
const searchEstimatesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for estimates by customer, status, or amount",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "draft",
            "sent",
            "viewed",
            "approved",
            "rejected",
            "expired"
        ]).optional(),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ query, status, customerId, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("estimates").select("id, estimate_number, title, status, total_amount, valid_until, customer:customers(display_name)").eq("company_id", companyId);
        if (query) queryBuilder = queryBuilder.ilike("estimate_number", `%${query}%`);
        if (status) queryBuilder = queryBuilder.eq("status", status);
        if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);
        const { data, error } = await queryBuilder.order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            estimates: data,
            count: data?.length || 0
        };
    }
});
const searchContractsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for contracts by customer, status, or type",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "draft",
            "sent",
            "active",
            "expired",
            "cancelled"
        ]).optional(),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20)
    }),
    execute: async ({ query, status, customerId, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let queryBuilder = supabase.from("contracts").select("id, contract_number, title, status, total_value, start_date, end_date, customer:customers(display_name)").eq("company_id", companyId);
        if (query) queryBuilder = queryBuilder.ilike("contract_number", `%${query}%`);
        if (status) queryBuilder = queryBuilder.eq("status", status);
        if (customerId) queryBuilder = queryBuilder.eq("customer_id", customerId);
        const { data, error } = await queryBuilder.order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            contracts: data,
            count: data?.length || 0
        };
    }
});
const aiAgentTools = {
    // Universal Database Access tools
    listDatabaseTables: listDatabaseTablesTool,
    queryDatabase: queryDatabaseTool,
    getRecordById: getRecordByIdTool,
    getRelatedRecords: getRelatedRecordsTool,
    getCompanyOverview: getCompanyOverviewTool,
    searchAllEntities: searchAllEntitesTool,
    // Customer tools
    searchCustomers: searchCustomersTool,
    getCustomerDetails: getCustomerDetailsTool,
    createCustomer: createCustomerTool,
    updateCustomer: updateCustomerTool,
    // Team Member tools
    searchTeamMembers: searchTeamMembersTool,
    getTeamMemberDetails: getTeamMemberDetailsTool,
    sendTeamEmail: sendTeamEmailTool,
    sendTeamSms: sendTeamSmsTool,
    // Vendor tools
    searchVendors: searchVendorsTool,
    getVendorDetails: getVendorDetailsTool,
    sendVendorEmail: sendVendorEmailTool,
    sendVendorSms: sendVendorSmsTool,
    // Property & Equipment tools
    searchProperties: searchPropertiesTool,
    getPropertyDetails: getPropertyDetailsTool,
    searchEquipment: searchEquipmentTool,
    getMaintenanceDue: getMaintenanceDueTool,
    // Job/Scheduling tools
    searchJobs: searchJobsTool,
    createAppointment: createAppointmentTool,
    getAvailableSlots: getAvailableSlotsTool,
    // Invoice/Financial tools
    searchInvoices: searchInvoicesTool,
    createInvoice: createInvoiceTool,
    getFinancialSummary: getFinancialSummaryTool,
    getVirtualBuckets: getVirtualBucketsTool,
    transferToBucket: transferToBucketTool,
    // Communication tools
    sendEmail: sendEmailTool,
    sendSms: sendSmsTool,
    initiateCall: initiateCallTool,
    getCommunicationHistory: getCommunicationHistoryTool,
    // Reminder/Notification tools
    scheduleReminder: scheduleReminderTool,
    cancelReminder: cancelReminderTool,
    getScheduledReminders: getScheduledRemindersTool,
    sendImmediateNotification: sendImmediateNotificationTool,
    // Enhanced Reporting tools
    getJobCostingReport: getJobCostingReportTool,
    getRevenueBreakdown: getRevenueBreakdownTool,
    getARAgingReport: getARAgingReportTool,
    getTeamPerformanceReport: getTeamPerformanceReportTool,
    getCustomerLifetimeValue: getCustomerLifetimeValueTool,
    getDashboardMetrics: getDashboardMetricsTool,
    getProactiveInsights: getProactiveInsightsTool,
    // Estimate & Contract tools
    searchEstimates: searchEstimatesTool,
    searchContracts: searchContractsTool
};
const toolCategories = {
    // Universal Database Access (read-only, reporting category)
    listDatabaseTables: "reporting",
    queryDatabase: "reporting",
    getRecordById: "reporting",
    getRelatedRecords: "reporting",
    getCompanyOverview: "reporting",
    searchAllEntities: "reporting",
    // Customer
    searchCustomers: "customer",
    getCustomerDetails: "customer",
    createCustomer: "customer",
    updateCustomer: "customer",
    // Team
    searchTeamMembers: "team",
    getTeamMemberDetails: "team",
    sendTeamEmail: "team",
    sendTeamSms: "team",
    // Vendor
    searchVendors: "vendor",
    getVendorDetails: "vendor",
    sendVendorEmail: "vendor",
    sendVendorSms: "vendor",
    // Property & Equipment
    searchProperties: "property",
    getPropertyDetails: "property",
    searchEquipment: "equipment",
    getMaintenanceDue: "equipment",
    // Scheduling
    searchJobs: "scheduling",
    createAppointment: "scheduling",
    getAvailableSlots: "scheduling",
    // Financial
    searchInvoices: "financial",
    createInvoice: "financial",
    getFinancialSummary: "reporting",
    getVirtualBuckets: "financial",
    transferToBucket: "financial",
    // Communication
    sendEmail: "communication",
    sendSms: "communication",
    initiateCall: "communication",
    getCommunicationHistory: "communication",
    // Notifications
    scheduleReminder: "notification",
    cancelReminder: "notification",
    getScheduledReminders: "notification",
    sendImmediateNotification: "notification",
    // Reporting
    getJobCostingReport: "reporting",
    getRevenueBreakdown: "reporting",
    getARAgingReport: "reporting",
    getTeamPerformanceReport: "reporting",
    getCustomerLifetimeValue: "reporting",
    getDashboardMetrics: "reporting",
    getProactiveInsights: "reporting",
    // Estimates & Contracts
    searchEstimates: "financial",
    searchContracts: "financial"
};
const storeMemoryTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Store a fact, preference, or important information about an entity (customer, job, property, etc.) for future reference. Use this to remember important details that should persist across conversations.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The fact or information to remember"),
        memoryType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "fact",
            "preference",
            "interaction",
            "context",
            "entity",
            "procedure",
            "feedback"
        ]).describe("Type of memory"),
        entityType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "job",
            "property",
            "equipment",
            "invoice",
            "estimate",
            "team_member"
        ]).optional().describe("Type of entity this memory relates to"),
        entityId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("ID of the related entity"),
        importance: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "low",
            "medium",
            "high"
        ]).default("medium").describe("How important is this memory"),
        tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().describe("Tags to categorize the memory")
    }),
    execute: async ({ content, memoryType, entityType, entityId, importance, tags }, { companyId, userId })=>{
        const { storeMemory } = await __turbopack_context__.A("[project]/apps/web/src/lib/ai/memory-service.ts [app-rsc] (ecmascript, async loader)");
        const importanceScore = {
            low: 0.3,
            medium: 0.6,
            high: 0.9
        }[importance];
        const memoryId = await storeMemory(companyId, userId || "system", {
            content,
            memoryType,
            entityType,
            entityId,
            importance: importanceScore,
            tags,
            sourceType: "agent"
        });
        return {
            success: true,
            message: `Memory stored successfully`,
            memoryId,
            summary: `Remembered: "${content.substring(0, 50)}..."`
        };
    }
});
const searchMemoriesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search through stored memories using natural language. Use this to recall facts, preferences, or context about customers, jobs, or other entities.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Natural language search query (e.g., 'customer preferences for Johnson family')"),
        entityType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "job",
            "property",
            "equipment",
            "invoice",
            "estimate",
            "team_member"
        ]).optional().describe("Filter to specific entity type"),
        entityId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Filter to specific entity"),
        memoryTypes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "fact",
            "preference",
            "interaction",
            "context",
            "entity",
            "procedure",
            "feedback"
        ])).optional().describe("Filter by memory types"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(5).describe("Max memories to return")
    }),
    execute: async ({ query, entityType, entityId, memoryTypes, limit }, { companyId })=>{
        const { searchMemories } = await __turbopack_context__.A("[project]/apps/web/src/lib/ai/memory-service.ts [app-rsc] (ecmascript, async loader)");
        const results = await searchMemories(companyId, query, {
            entityType,
            entityId,
            memoryTypes,
            limit,
            minSimilarity: 0.5
        });
        if (results.length === 0) {
            return {
                success: true,
                message: "No relevant memories found",
                memories: []
            };
        }
        return {
            success: true,
            message: `Found ${results.length} relevant memories`,
            memories: results.map((m)=>({
                    content: m.content,
                    type: m.memoryType,
                    relevance: Math.round(m.similarity * 100) + "%",
                    entityType: m.entityType,
                    createdAt: m.createdAt
                }))
        };
    }
});
const getEntityMemoriesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Retrieve all stored memories about a specific entity (customer, job, property, etc.). Use this before interacting with a customer or job to get full context.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        entityType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "customer",
            "job",
            "property",
            "equipment",
            "invoice",
            "estimate",
            "team_member"
        ]).describe("Type of entity"),
        entityId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Entity ID"),
        memoryTypes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "fact",
            "preference",
            "interaction",
            "context",
            "entity",
            "procedure",
            "feedback"
        ])).optional().describe("Filter by memory types"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(20).describe("Max memories to return")
    }),
    execute: async ({ entityType, entityId, memoryTypes, limit }, { companyId })=>{
        const { getEntityMemories } = await __turbopack_context__.A("[project]/apps/web/src/lib/ai/memory-service.ts [app-rsc] (ecmascript, async loader)");
        const memories = await getEntityMemories(companyId, entityType, entityId, {
            types: memoryTypes,
            limit
        });
        if (memories.length === 0) {
            return {
                success: true,
                message: `No memories stored for this ${entityType}`,
                memories: []
            };
        }
        // Group by type for better presentation
        const grouped = {};
        for (const m of memories){
            if (!grouped[m.memory_type]) grouped[m.memory_type] = [];
            grouped[m.memory_type].push({
                content: m.content,
                importance: m.importance
            });
        }
        return {
            success: true,
            message: `Found ${memories.length} memories for ${entityType}`,
            memoriesByType: grouped,
            totalCount: memories.length
        };
    }
});
const recallContextTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Automatically recall relevant memories and context based on what's being discussed. Use this at the start of conversations or when switching topics to get background information.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        topic: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The current topic or context (e.g., 'scheduling job for Smith residence', 'invoice payment issue')"),
        customerName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Customer name if known"),
        jobId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Job ID if discussing a specific job")
    }),
    execute: async ({ topic, customerName, jobId }, { companyId })=>{
        const { searchMemories } = await __turbopack_context__.A("[project]/apps/web/src/lib/ai/memory-service.ts [app-rsc] (ecmascript, async loader)");
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const context = {
            memories: []
        };
        // Search for relevant memories
        const memories = await searchMemories(companyId, topic, {
            limit: 5,
            minSimilarity: 0.4
        });
        context.memories = memories.map((m)=>({
                content: m.content,
                type: m.memoryType,
                relevance: Math.round(m.similarity * 100) + "%"
            }));
        // If customer name provided, try to find them
        if (customerName) {
            const { data: customer } = await supabase.from("customers").select("id, name, notes").eq("company_id", companyId).ilike("name", `%${customerName}%`).limit(1).single();
            if (customer) {
                context.customer = customer;
                // Get customer-specific memories
                const customerMemories = await searchMemories(companyId, `${customerName} customer preferences`, {
                    entityType: "customer",
                    entityId: customer.id,
                    limit: 3
                });
                for (const m of customerMemories){
                    if (!context.memories.some((cm)=>cm.content === m.content)) {
                        context.memories.push({
                            content: m.content,
                            type: m.memoryType,
                            relevance: Math.round(m.similarity * 100) + "%"
                        });
                    }
                }
            }
        }
        // If job ID provided, get job details
        if (jobId) {
            const { data: job } = await supabase.from("jobs").select("id, title, status, description").eq("id", jobId).eq("company_id", companyId).single();
            if (job) {
                context.job = {
                    id: job.id,
                    title: job.title,
                    status: job.status
                };
            }
        }
        return {
            success: true,
            topic,
            context,
            summary: context.memories.length > 0 ? `Found ${context.memories.length} relevant memories for context` : "No specific memories found, but retrieved available entity info"
        };
    }
});
const searchCommunicationsFullTextTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search across all customer communications (calls, emails, SMS) to find specific conversations, topics, or issues discussed. Great for finding 'what did the customer say about...'",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Search query (e.g., 'water heater issue', 'preferred time morning')"),
        channel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "email",
            "sms",
            "call",
            "all"
        ]).optional().default("all").describe("Filter by communication channel"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Filter to specific customer"),
        direction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "inbound",
            "outbound",
            "all"
        ]).optional().default("all").describe("Filter by direction"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10).describe("Max results")
    }),
    execute: async ({ query, channel, customerId, direction, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let dbQuery = supabase.from("communications").select(`
				id, type, channel, direction, subject, body_plain,
				call_transcript, call_sentiment, from_name, to_name,
				customer_id, created_at,
				customer:customers(id, name)
			`).eq("company_id", companyId).is("deleted_at", null).order("created_at", {
            ascending: false
        }).limit(limit);
        // Apply filters
        if (channel !== "all") {
            dbQuery = dbQuery.eq("channel", channel);
        }
        if (customerId) {
            dbQuery = dbQuery.eq("customer_id", customerId);
        }
        if (direction !== "all") {
            dbQuery = dbQuery.eq("direction", direction);
        }
        // Full-text search on body and transcript
        dbQuery = dbQuery.or(`body_plain.ilike.%${query}%,call_transcript.ilike.%${query}%,subject.ilike.%${query}%`);
        const { data, error } = await dbQuery;
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            message: `Found ${data?.length || 0} communications matching "${query}"`,
            results: data?.map((c)=>({
                    id: c.id,
                    channel: c.channel,
                    direction: c.direction,
                    subject: c.subject,
                    preview: (c.body_plain || c.call_transcript || "").substring(0, 200),
                    sentiment: c.call_sentiment,
                    customerName: c.customer?.name,
                    date: c.created_at
                }))
        };
    }
});
const getCallTranscriptTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get the full transcript of a phone call along with extracted insights. Use when you need to review what was discussed in a specific call.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        communicationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("The communication ID of the call")
    }),
    execute: async ({ communicationId }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("communications").select(`
				id, type, channel, direction, call_duration, call_transcript,
				call_sentiment, call_recording_url, from_name, to_name,
				customer_id, created_at,
				customer:customers(id, name, email, phone)
			`).eq("id", communicationId).eq("company_id", companyId).single();
        if (error) return {
            success: false,
            error: error.message
        };
        if (!data?.call_transcript) {
            return {
                success: false,
                error: "No transcript available for this communication"
            };
        }
        return {
            success: true,
            call: {
                id: data.id,
                direction: data.direction,
                duration: data.call_duration ? `${Math.floor(data.call_duration / 60)}m ${data.call_duration % 60}s` : "Unknown",
                sentiment: data.call_sentiment,
                customerName: data.customer?.name,
                date: data.created_at,
                transcript: data.call_transcript,
                hasRecording: !!data.call_recording_url
            }
        };
    }
});
const searchVoicemailTranscriptsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search through voicemail transcriptions to find messages about specific topics or from specific customers.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Search query for transcription content"),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().describe("Filter to specific customer"),
        urgentOnly: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(false).describe("Only show urgent voicemails"),
        unreadOnly: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(false).describe("Only show unread voicemails"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10).describe("Max results")
    }),
    execute: async ({ query, customerId, urgentOnly, unreadOnly, limit }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        let dbQuery = supabase.from("voicemails").select(`
				id, from_number, duration, transcription, transcription_confidence,
				is_read, is_urgent, received_at, customer_id,
				customer:customers(id, name)
			`).eq("company_id", companyId).is("deleted_at", null).order("received_at", {
            ascending: false
        }).limit(limit);
        if (customerId) {
            dbQuery = dbQuery.eq("customer_id", customerId);
        }
        if (urgentOnly) {
            dbQuery = dbQuery.eq("is_urgent", true);
        }
        if (unreadOnly) {
            dbQuery = dbQuery.eq("is_read", false);
        }
        if (query) {
            dbQuery = dbQuery.ilike("transcription", `%${query}%`);
        }
        const { data, error } = await dbQuery;
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            message: `Found ${data?.length || 0} voicemails`,
            voicemails: data?.map((v)=>({
                    id: v.id,
                    from: v.from_number,
                    customerName: v.customer?.name,
                    duration: v.duration ? `${Math.floor(v.duration / 60)}m ${v.duration % 60}s` : "Unknown",
                    transcription: v.transcription,
                    confidence: v.transcription_confidence,
                    isUrgent: v.is_urgent,
                    isRead: v.is_read,
                    receivedAt: v.received_at
                }))
        };
    }
});
const getCustomerCommunicationHistoryTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get the complete communication history for a customer including calls, emails, SMS, and voicemails. Use this to understand the full context of a customer relationship.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Customer UUID"),
        days: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(90).describe("Look back this many days"),
        includeTranscripts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(false).describe("Include full call transcripts")
    }),
    execute: async ({ customerId, days, includeTranscripts }, { companyId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        // Get communications
        const { data: comms, error: commsError } = await supabase.from("communications").select(`
				id, type, channel, direction, subject, body_plain,
				call_transcript, call_sentiment, call_duration,
				from_name, to_name, created_at, status
			`).eq("company_id", companyId).eq("customer_id", customerId).is("deleted_at", null).gte("created_at", cutoffDate.toISOString()).order("created_at", {
            ascending: false
        });
        // Get voicemails
        const { data: voicemails, error: vmError } = await supabase.from("voicemails").select("id, from_number, duration, transcription, is_urgent, received_at").eq("company_id", companyId).eq("customer_id", customerId).is("deleted_at", null).gte("received_at", cutoffDate.toISOString()).order("received_at", {
            ascending: false
        });
        if (commsError) return {
            success: false,
            error: commsError.message
        };
        // Summarize by channel
        const summary = {
            emails: comms?.filter((c)=>c.channel === "email").length || 0,
            calls: comms?.filter((c)=>c.channel === "call").length || 0,
            sms: comms?.filter((c)=>c.channel === "sms").length || 0,
            voicemails: voicemails?.length || 0
        };
        return {
            success: true,
            customerId,
            period: `Last ${days} days`,
            summary,
            communications: comms?.map((c)=>({
                    id: c.id,
                    channel: c.channel,
                    direction: c.direction,
                    subject: c.subject,
                    preview: includeTranscripts ? (c.body_plain || c.call_transcript || "").substring(0, 500) : (c.body_plain || c.call_transcript || "").substring(0, 100),
                    sentiment: c.call_sentiment,
                    date: c.created_at
                })),
            voicemails: voicemails?.map((v)=>({
                    id: v.id,
                    duration: v.duration,
                    transcription: v.transcription?.substring(0, 200),
                    isUrgent: v.is_urgent,
                    date: v.received_at
                }))
        };
    }
});
const extractCommunicationInsightsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Analyze a communication (call, email, SMS) and extract key insights like customer preferences, issues, sentiment. Automatically stores insights in memory for future reference.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        communicationId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().describe("Communication ID to analyze"),
        insightTypes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "preference",
            "issue",
            "sentiment",
            "action_item",
            "feedback"
        ])).optional().describe("Types of insights to extract")
    }),
    execute: async ({ communicationId, insightTypes }, { companyId, userId })=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get the communication
        const { data: comm, error } = await supabase.from("communications").select(`
				id, channel, direction, subject, body_plain, call_transcript,
				call_sentiment, customer_id,
				customer:customers(id, name)
			`).eq("id", communicationId).eq("company_id", companyId).single();
        if (error || !comm) {
            return {
                success: false,
                error: "Communication not found"
            };
        }
        const content = comm.body_plain || comm.call_transcript || "";
        if (!content) {
            return {
                success: false,
                error: "No content to analyze"
            };
        }
        // Extract insights using pattern matching (basic implementation)
        const insights = [];
        // Look for preferences (morning, afternoon, specific days, etc.)
        const preferencePatterns = [
            /prefer[s]?\s+(morning|afternoon|evening|weekend|monday|tuesday|wednesday|thursday|friday)/gi,
            /best\s+time[s]?\s+(?:is|are|would be)\s+([^.]+)/gi,
            /don'?t\s+(?:like|want|prefer)\s+([^.]+)/gi
        ];
        for (const pattern of preferencePatterns){
            const matches = content.matchAll(pattern);
            for (const match of matches){
                insights.push({
                    type: "preference",
                    content: `Customer prefers: ${match[0]}`,
                    importance: "medium"
                });
            }
        }
        // Look for issues/complaints
        const issuePatterns = [
            /problem[s]?\s+with\s+([^.]+)/gi,
            /issue[s]?\s+with\s+([^.]+)/gi,
            /not\s+working\s+([^.]+)/gi,
            /broken\s+([^.]+)/gi
        ];
        for (const pattern of issuePatterns){
            const matches = content.matchAll(pattern);
            for (const match of matches){
                insights.push({
                    type: "issue",
                    content: `Reported issue: ${match[0]}`,
                    importance: "high"
                });
            }
        }
        // Store insights in memory if customer is linked
        if (comm.customer_id && insights.length > 0) {
            const { storeMemory } = await __turbopack_context__.A("[project]/apps/web/src/lib/ai/memory-service.ts [app-rsc] (ecmascript, async loader)");
            for (const insight of insights){
                await storeMemory(companyId, userId || "system", {
                    content: insight.content,
                    memoryType: insight.type,
                    entityType: "customer",
                    entityId: comm.customer_id,
                    importance: insight.importance === "high" ? 0.9 : 0.6,
                    sourceType: "communication",
                    sourceChatId: communicationId
                });
            }
        }
        return {
            success: true,
            communicationId,
            channel: comm.channel,
            customerName: comm.customer?.name,
            extractedInsights: insights,
            storedToMemory: insights.length > 0 && !!comm.customer_id,
            sentiment: comm.call_sentiment
        };
    }
});
const getWeatherForLocationTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Get weather forecast and alerts for a specific location. Provides 7-day forecast, hourly conditions, and any active weather alerts. Use this when:
- Scheduling outdoor jobs
- Checking if weather is suitable for work
- Planning technician routes
- Informing customers about weather delays

Returns forecast periods, temperature, wind, precipitation chances, and any severe weather alerts.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Latitude of the location"),
        lon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Longitude of the location"),
        includeHourly: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(true).describe("Include hourly forecast for next 24 hours")
    }),
    execute: async ({ lat, lon, includeHourly })=>{
        const { weatherService } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/weather-service.ts [app-rsc] (ecmascript, async loader)");
        const weather = await weatherService.getWeatherData(lat, lon);
        if (!weather) {
            return {
                success: false,
                error: "Unable to fetch weather data for this location"
            };
        }
        return {
            success: true,
            location: weather.location,
            currentConditions: weather.hourly?.periods?.[0] || null,
            forecast: weather.forecast?.periods?.slice(0, 7) || [],
            hourly: includeHourly ? weather.hourly?.periods?.slice(0, 12) || [] : [],
            alerts: weather.alerts,
            hasActiveAlerts: weather.hasActiveAlerts,
            highestSeverity: weather.highestSeverity,
            enrichedAt: weather.enrichedAt
        };
    }
});
const checkWeatherForJobTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Check if weather conditions are suitable for outdoor field service work at a specific location. Considers:
- Severe weather alerts
- Precipitation (rain, snow, storms)
- Extreme temperatures (freezing or excessive heat)
- Wind conditions

Returns a clear recommendation on whether to proceed with outdoor work.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Latitude of the job location"),
        lon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Longitude of the job location"),
        jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Type of job (e.g., 'roofing', 'HVAC outdoor', 'landscaping')")
    }),
    execute: async ({ lat, lon, jobType })=>{
        const { weatherService } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/weather-service.ts [app-rsc] (ecmascript, async loader)");
        const weather = await weatherService.getWeatherData(lat, lon);
        if (!weather) {
            return {
                success: false,
                suitable: null,
                error: "Unable to fetch weather data"
            };
        }
        const suitability = weatherService.isSuitableForOutdoorWork(weather);
        return {
            success: true,
            suitable: suitability.suitable,
            reason: suitability.reason || "Weather conditions are acceptable for outdoor work",
            currentConditions: weather.hourly?.periods?.[0] ? {
                temperature: weather.hourly.periods[0].temperature,
                temperatureUnit: weather.hourly.periods[0].temperatureUnit,
                shortForecast: weather.hourly.periods[0].shortForecast,
                windSpeed: weather.hourly.periods[0].windSpeed
            } : null,
            alerts: weather.alerts.map((a)=>({
                    event: a.event,
                    severity: a.severity,
                    headline: a.headline
                })),
            jobType,
            recommendation: suitability.suitable ? "Proceed with outdoor work" : `Consider rescheduling: ${suitability.reason}`
        };
    }
});
const getWeatherAlertsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Quickly check for active weather alerts at a location without fetching the full forecast. Use this for:
- Quick safety checks
- Emergency notifications
- Batch checking multiple job sites

Returns only alert information (faster than full weather data).`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Latitude"),
        lon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Longitude")
    }),
    execute: async ({ lat, lon })=>{
        const { weatherService } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/weather-service.ts [app-rsc] (ecmascript, async loader)");
        const alerts = await weatherService.getActiveAlerts(lat, lon);
        return {
            success: true,
            hasAlerts: alerts.length > 0,
            alertCount: alerts.length,
            alerts: alerts.map((a)=>({
                    event: a.event,
                    severity: a.severity,
                    urgency: a.urgency,
                    headline: a.headline,
                    instruction: a.instruction,
                    expires: a.expires
                }))
        };
    }
});
const getTrafficConditionsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Get real-time traffic conditions and incidents near a job location or along a route. Detects:
- Traffic accidents/crashes
- Road construction
- Road closures
- Police activity
- Congestion levels

Useful for:
- Planning technician dispatch
- Estimating arrival times
- Routing around incidents
- Notifying customers of delays`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        destinationLat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Latitude of the destination/job site"),
        destinationLon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Longitude of the destination/job site"),
        originLat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe("Latitude of origin (e.g., shop/office) to check route"),
        originLon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe("Longitude of origin to check route")
    }),
    execute: async ({ destinationLat, destinationLon, originLat, originLon })=>{
        const { trafficService } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/traffic-service.ts [app-rsc] (ecmascript, async loader)");
        const traffic = await trafficService.getTrafficIncidents(destinationLat, destinationLon, originLat, originLon);
        if (!traffic) {
            return {
                success: false,
                error: "Unable to fetch traffic data. Check Google Maps API configuration."
            };
        }
        return {
            success: true,
            totalIncidents: traffic.totalIncidents,
            nearbyIncidents: traffic.nearbyIncidents,
            routeAffectingIncidents: traffic.routeAffectingIncidents,
            incidents: traffic.incidents.map((i)=>({
                    type: i.type,
                    severity: i.severity,
                    description: i.description,
                    distance: i.distance,
                    affectsRoute: i.affectsRoute
                })),
            recommendation: traffic.routeAffectingIncidents > 0 ? `${traffic.routeAffectingIncidents} incident(s) may affect travel time` : "No significant traffic issues detected",
            enrichedAt: traffic.enrichedAt
        };
    }
});
const geocodeAddressTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Convert a street address to GPS coordinates (latitude/longitude). Use this when:
- You have an address but need coordinates for weather/traffic lookup
- Verifying an address is valid
- Getting standardized/formatted address

Returns coordinates and Google's formatted version of the address.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Street address (e.g., '123 Main St')"),
        city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("City name"),
        state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("State (e.g., 'CA' or 'California')"),
        zipCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("ZIP code"),
        country: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default("USA").describe("Country (defaults to USA)")
    }),
    execute: async ({ address, city, state, zipCode, country })=>{
        const { geocodeAddressSilent } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/geocoding.ts [app-rsc] (ecmascript, async loader)");
        const result = await geocodeAddressSilent(address, city, state, zipCode, country);
        if (!result) {
            return {
                success: false,
                error: "Unable to geocode address. The address may be invalid or geocoding service unavailable."
            };
        }
        return {
            success: true,
            coordinates: {
                lat: result.lat,
                lon: result.lon
            },
            formattedAddress: result.formattedAddress
        };
    }
});
const getPropertyConditionsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Get a comprehensive conditions summary for a property/job site including weather, traffic, and alerts. This is the "one-stop" tool for checking all external conditions before dispatching or scheduling.

Combines:
- Current and forecast weather
- Weather alerts
- Traffic conditions (if shop coordinates provided)
- Work suitability assessment`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        propertyLat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Latitude of the property"),
        propertyLon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Longitude of the property"),
        shopLat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe("Shop/office latitude for traffic routing"),
        shopLon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe("Shop/office longitude for traffic routing"),
        jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Type of job being performed (for work suitability)")
    }),
    execute: async ({ propertyLat, propertyLon, shopLat, shopLon, jobType })=>{
        const { weatherService } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/weather-service.ts [app-rsc] (ecmascript, async loader)");
        const { trafficService } = await __turbopack_context__.A("[project]/apps/web/src/lib/services/traffic-service.ts [app-rsc] (ecmascript, async loader)");
        // Fetch weather and traffic in parallel
        const [weather, traffic] = await Promise.all([
            weatherService.getWeatherData(propertyLat, propertyLon),
            shopLat && shopLon ? trafficService.getTrafficIncidents(propertyLat, propertyLon, shopLat, shopLon) : Promise.resolve(null)
        ]);
        const result = {
            success: true,
            propertyLocation: {
                lat: propertyLat,
                lon: propertyLon
            }
        };
        // Weather conditions
        if (weather) {
            const suitability = weatherService.isSuitableForOutdoorWork(weather);
            result.weather = {
                current: weather.hourly?.periods?.[0] ? {
                    temperature: weather.hourly.periods[0].temperature,
                    temperatureUnit: weather.hourly.periods[0].temperatureUnit,
                    conditions: weather.hourly.periods[0].shortForecast,
                    wind: weather.hourly.periods[0].windSpeed
                } : null,
                forecast: weather.forecast?.periods?.slice(0, 3).map((p)=>({
                        name: p.name,
                        temperature: p.temperature,
                        shortForecast: p.shortForecast
                    })),
                alerts: weather.alerts.map((a)=>({
                        event: a.event,
                        severity: a.severity,
                        headline: a.headline
                    })),
                hasAlerts: weather.hasActiveAlerts,
                highestAlertSeverity: weather.highestSeverity
            };
            result.workSuitability = {
                suitable: suitability.suitable,
                reason: suitability.reason || "Conditions acceptable",
                jobType
            };
        } else {
            result.weather = {
                error: "Weather data unavailable"
            };
            result.workSuitability = {
                suitable: null,
                reason: "Unable to assess"
            };
        }
        // Traffic conditions
        if (traffic) {
            result.traffic = {
                totalIncidents: traffic.totalIncidents,
                routeAffecting: traffic.routeAffectingIncidents,
                incidents: traffic.incidents.slice(0, 5).map((i)=>({
                        type: i.type,
                        severity: i.severity,
                        description: i.description
                    }))
            };
        } else if (shopLat && shopLon) {
            result.traffic = {
                error: "Traffic data unavailable"
            };
        }
        // Overall recommendation
        const issues = [];
        if (weather?.hasActiveAlerts) {
            issues.push(`Weather alert: ${weather.highestSeverity}`);
        }
        if (weather && !weatherService.isSuitableForOutdoorWork(weather).suitable) {
            issues.push("Weather not suitable for outdoor work");
        }
        if (traffic && traffic.routeAffectingIncidents > 0) {
            issues.push(`${traffic.routeAffectingIncidents} traffic incident(s) on route`);
        }
        result.overallStatus = issues.length === 0 ? "good" : "caution";
        result.issues = issues;
        result.recommendation = issues.length === 0 ? "Conditions look good for this job" : `Review before proceeding: ${issues.join("; ")}`;
        return result;
    }
});
// =============================================================================
// CODE SEARCH TOOLS - Building, Plumbing, Electrical Codes
// =============================================================================
/**
 * Common building code references by trade type
 * This is a knowledge base that can be enhanced with actual API integrations
 */ const codeReferences = {
    plumbing: {
        name: "Uniform Plumbing Code (UPC) / International Plumbing Code (IPC)",
        commonRequirements: [
            "Drain pipe slope: 1/4 inch per foot minimum",
            "Vent pipes must extend through roof",
            "P-traps required on all fixtures",
            "Water heater T&P relief valve required",
            "Backflow prevention on potable water",
            "Minimum fixture unit calculations for pipe sizing",
            "Air gap requirements for indirect waste"
        ],
        permitTriggers: [
            "New water heater installation",
            "Moving or adding fixtures",
            "New water/sewer line connections",
            "Gas line work",
            "Sewer line replacement"
        ]
    },
    electrical: {
        name: "National Electrical Code (NEC)",
        commonRequirements: [
            "GFCI required in kitchens, bathrooms, garages, outdoors",
            "AFCI required in bedrooms and living areas",
            "Smoke detectors on every floor and bedroom",
            "Panel accessibility clearance: 36 inches",
            "Wire sizing based on amperage load",
            "Grounding requirements for all circuits",
            "Box fill calculations for junction boxes"
        ],
        permitTriggers: [
            "New circuits or subpanels",
            "Service upgrade",
            "Adding outlets or switches",
            "Electric vehicle charger installation",
            "Generator installation"
        ]
    },
    hvac: {
        name: "International Mechanical Code (IMC)",
        commonRequirements: [
            "Proper equipment sizing (Manual J calculation)",
            "Ductwork sizing (Manual D calculation)",
            "Combustion air requirements for gas appliances",
            "Clearances from combustible materials",
            "Condensate drain requirements",
            "Refrigerant line sizing and insulation",
            "Energy efficiency minimums (SEER ratings)"
        ],
        permitTriggers: [
            "New HVAC system installation",
            "Equipment replacement (like-for-like may be exempt)",
            "Ductwork modifications",
            "Gas line work",
            "Mini-split installation"
        ]
    },
    general: {
        name: "International Building Code (IBC) / International Residential Code (IRC)",
        commonRequirements: [
            "Egress window requirements for bedrooms",
            "Stair rise/run specifications (7.75 in max rise, 10 in min run)",
            "Handrail requirements (34-38 inches height)",
            "Smoke and CO detector placement",
            "Fire-rated assemblies where required",
            "Structural load calculations"
        ],
        permitTriggers: [
            "Structural modifications",
            "Adding/removing walls",
            "Roof replacement (varies by jurisdiction)",
            "Window/door changes",
            "Additions or conversions"
        ]
    },
    roofing: {
        name: "International Building Code (IBC) - Roofing Section",
        commonRequirements: [
            "Minimum roof slope requirements by material",
            "Underlayment requirements",
            "Ice and water shield in cold climates",
            "Flashing requirements at penetrations",
            "Ventilation requirements (1:150 or 1:300 ratio)",
            "Fire-rated materials in certain zones"
        ],
        permitTriggers: [
            "Complete re-roof (varies by jurisdiction)",
            "Structural repairs",
            "Adding skylights or vents",
            "Changing roofing material type"
        ]
    }
};
const searchBuildingCodesTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Search for relevant building code requirements based on the type of work being performed. Returns common code requirements, permit triggers, and best practices for:
- Plumbing (UPC/IPC)
- Electrical (NEC)
- HVAC (IMC)
- General construction (IBC/IRC)
- Roofing

Use this to help technicians understand code requirements before starting work.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        tradeType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "plumbing",
            "electrical",
            "hvac",
            "general",
            "roofing"
        ]).describe("The trade or type of work"),
        workDescription: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Specific description of the work being performed"),
        state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("State abbreviation (codes vary by jurisdiction)")
    }),
    execute: async ({ tradeType, workDescription, state })=>{
        const codeInfo = codeReferences[tradeType];
        // Build relevance context
        const relevantRequirements = [];
        if (workDescription) {
            const desc = workDescription.toLowerCase();
            // Filter requirements based on work description keywords
            for (const req of codeInfo.commonRequirements){
                const reqLower = req.toLowerCase();
                // Simple relevance matching
                const keywords = desc.split(/\s+/);
                if (keywords.some((kw)=>kw.length > 3 && reqLower.includes(kw))) {
                    relevantRequirements.push(req);
                }
            }
        }
        return {
            success: true,
            tradeType,
            codeName: codeInfo.name,
            commonRequirements: codeInfo.commonRequirements,
            relevantToWork: relevantRequirements.length > 0 ? relevantRequirements : null,
            permitTriggers: codeInfo.permitTriggers,
            jurisdictionNote: state ? `Note: Requirements may vary in ${state}. Always verify with local building department.` : "Requirements vary by jurisdiction. Always verify with local building department.",
            disclaimer: "This is general guidance only. Consult actual code books and local jurisdiction for specific requirements."
        };
    }
});
const getPermitRequirementsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Determine if a permit is likely required for specific work and what type of permit. Helps field service companies understand when to pull permits and advise customers.

Returns:
- Whether permit is typically required
- Type of permit needed
- Common exceptions
- Inspection requirements`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        workType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Type of work being performed (e.g., 'water heater replacement', 'outlet installation')"),
        propertyType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "residential",
            "commercial"
        ]).optional().default("residential"),
        city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("City for jurisdiction-specific guidance"),
        state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("State abbreviation")
    }),
    execute: async ({ workType, propertyType, city, state })=>{
        const workLower = workType.toLowerCase();
        // Analyze work type to determine permit requirements
        let permitRequired = false;
        let permitType = "unknown";
        let confidence = "medium";
        const notes = [];
        const inspections = [];
        // Electrical work
        if (workLower.includes("outlet") || workLower.includes("circuit") || workLower.includes("panel") || workLower.includes("electrical") || workLower.includes("wire") || workLower.includes("ev charger")) {
            permitRequired = true;
            permitType = "electrical";
            inspections.push("Rough-in inspection", "Final inspection");
            if (workLower.includes("panel") || workLower.includes("service")) {
                notes.push("Service upgrades typically require utility coordination");
            }
        }
        // Plumbing work
        if (workLower.includes("water heater") || workLower.includes("plumbing") || workLower.includes("sewer") || workLower.includes("drain") || workLower.includes("fixture")) {
            permitRequired = true;
            permitType = "plumbing";
            inspections.push("Rough-in inspection", "Final inspection");
            if (workLower.includes("water heater")) {
                notes.push("Water heater permits often include gas and electrical inspections");
                confidence = "high";
            }
        }
        // HVAC work
        if (workLower.includes("hvac") || workLower.includes("furnace") || workLower.includes("air condition") || workLower.includes("ac ") || workLower.includes("heat pump") || workLower.includes("mini-split")) {
            permitRequired = true;
            permitType = "mechanical";
            inspections.push("Final inspection");
            notes.push("EPA certification required for refrigerant handling");
        }
        // Roofing
        if (workLower.includes("roof") || workLower.includes("re-roof")) {
            permitRequired = true;
            permitType = "building/roofing";
            inspections.push("Final inspection");
            notes.push("Requirements vary significantly by jurisdiction - some exempt repairs under certain square footage");
            confidence = "low";
        }
        // Gas work
        if (workLower.includes("gas line") || workLower.includes("gas pipe")) {
            permitRequired = true;
            permitType = "gas/plumbing";
            inspections.push("Pressure test inspection", "Final inspection");
            notes.push("Gas work requires licensed gas fitter in most jurisdictions");
            confidence = "high";
        }
        // Minor repairs generally don't require permits
        if (workLower.includes("repair") && !workLower.includes("replace") && !workLower.includes("install")) {
            permitRequired = false;
            notes.push("Minor repairs typically exempt, but verify with local jurisdiction");
            confidence = "low";
        }
        // Like-for-like replacements
        if (workLower.includes("like for like") || workLower.includes("same location")) {
            notes.push("Like-for-like replacements may be exempt in some jurisdictions");
            confidence = "low";
        }
        return {
            success: true,
            workType,
            propertyType,
            location: city && state ? `${city}, ${state}` : state || "Not specified",
            permitRequired,
            permitType: permitRequired ? permitType : null,
            confidence,
            typicalInspections: permitRequired ? inspections : [],
            notes,
            recommendations: permitRequired ? [
                "Contact local building department for specific requirements",
                "Have contractor license number ready",
                "Allow 1-3 business days for permit processing",
                "Schedule inspections in advance"
            ] : [
                "Document work performed for records",
                "When in doubt, contact local building department"
            ],
            disclaimer: "Permit requirements vary by jurisdiction. Always verify with local building department."
        };
    }
});
const getCodeComplianceChecklistTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Generate a code compliance and safety checklist for a specific type of job. Helps technicians ensure they're meeting code requirements during installation or repair.

Returns a checklist of items to verify for code compliance.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Type of job (e.g., 'water heater installation', 'panel upgrade', 'AC replacement')"),
        includesSafety: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(true).describe("Include safety checklist items")
    }),
    execute: async ({ jobType, includesSafety })=>{
        const jobLower = jobType.toLowerCase();
        const checklist = [];
        // Water heater specific
        if (jobLower.includes("water heater") || jobLower.includes("hot water")) {
            checklist.push({
                category: "Temperature & Pressure Relief",
                items: [
                    "T&P relief valve installed in top 6 inches of tank",
                    "Discharge pipe routes to within 6 inches of floor",
                    "Discharge pipe same size as valve outlet",
                    "No valves or restrictions in discharge line"
                ]
            });
            checklist.push({
                category: "Seismic & Stability",
                items: [
                    "Seismic straps installed (required in seismic zones)",
                    "Unit stable and level",
                    "Proper clearances maintained"
                ]
            });
            checklist.push({
                category: "Connections",
                items: [
                    "Proper venting for gas units (draft hood, flue)",
                    "Gas shutoff valve accessible",
                    "Sediment trap on gas line",
                    "Dielectric unions on water connections",
                    "Expansion tank installed if closed system"
                ]
            });
        }
        // Electrical panel/service
        if (jobLower.includes("panel") || jobLower.includes("electrical") || jobLower.includes("breaker")) {
            checklist.push({
                category: "Panel Requirements",
                items: [
                    "36-inch clearance in front of panel",
                    "30-inch width clearance",
                    "78-inch height clearance",
                    "Panel cover intact and secured",
                    "All breakers labeled",
                    "No exposed conductors"
                ]
            });
            checklist.push({
                category: "Grounding & Bonding",
                items: [
                    "Ground rod(s) installed",
                    "Bonding jumper at water heater",
                    "CSST gas line bonded (if applicable)",
                    "Grounding electrode conductor sized properly"
                ]
            });
        }
        // HVAC
        if (jobLower.includes("hvac") || jobLower.includes("furnace") || jobLower.includes("ac") || jobLower.includes("heat pump")) {
            checklist.push({
                category: "Equipment Installation",
                items: [
                    "Clearances from combustibles maintained",
                    "Condensate drain properly routed",
                    "Secondary drain pan with float switch (if in attic)",
                    "Filter access provided",
                    "Disconnect within sight of unit"
                ]
            });
            checklist.push({
                category: "Ductwork & Airflow",
                items: [
                    "Supply and return balanced",
                    "Duct connections sealed",
                    "No kinks in flex duct",
                    "Adequate return air"
                ]
            });
            if (jobLower.includes("gas") || jobLower.includes("furnace")) {
                checklist.push({
                    category: "Gas & Combustion",
                    items: [
                        "Combustion air adequate",
                        "Gas pressure verified",
                        "CO testing performed",
                        "Heat exchanger inspected"
                    ]
                });
            }
        }
        // Safety checklist
        if (includesSafety) {
            checklist.push({
                category: "General Safety",
                items: [
                    "Work area secured and clean",
                    "PPE used appropriately",
                    "All utilities verified off before work",
                    "Test equipment calibrated",
                    "Customer informed of work"
                ]
            });
        }
        // If no specific checklist matched, provide general
        if (checklist.length === (includesSafety ? 1 : 0)) {
            checklist.unshift({
                category: "General Code Compliance",
                items: [
                    "Work matches permit scope (if applicable)",
                    "Materials meet code requirements",
                    "Manufacturer installation instructions followed",
                    "All connections secure",
                    "System tested and operational",
                    "Area cleaned up"
                ]
            });
        }
        return {
            success: true,
            jobType,
            checklist,
            totalItems: checklist.reduce((sum, cat)=>sum + cat.items.length, 0),
            reminder: "Document completion of each item. Photos recommended for permit inspections.",
            disclaimer: "This checklist is general guidance. Refer to local codes and manufacturer instructions."
        };
    }
});
const analyzeRecentCommunicationsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Proactively analyze recent customer communications to extract insights and learnings. Scans the last N days of communications and identifies:
- Customer preferences mentioned in calls/emails
- Common issues or complaints
- Positive feedback and compliments
- Service requests patterns
- Emergency situations or urgent needs

Use this for periodic learning runs to build customer knowledge.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company ID"),
        daysBack: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(7).describe("Number of days to look back"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(50).describe("Maximum communications to analyze"),
        focusArea: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "all",
            "preferences",
            "issues",
            "feedback",
            "urgent"
        ]).optional().default("all").describe("Focus on specific type of insights")
    }),
    execute: async ({ companyId, daysBack, limit, focusArea })=>{
        const { createServiceSupabaseClient } = await __turbopack_context__.A("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript, async loader)");
        const supabase = createServiceSupabaseClient();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);
        // Get recent communications with transcripts
        const { data: comms, error } = await supabase.from("communications").select(`
				id,
				channel,
				direction,
				call_transcript,
				call_sentiment,
				body_plain,
				customer_id,
				created_at,
				customer:customers!customer_id(id, name)
			`).eq("company_id", companyId).gte("created_at", startDate.toISOString()).not("call_transcript", "is", null).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error || !comms) {
            return {
                success: false,
                error: error?.message || "No communications found"
            };
        }
        const insights = [];
        // Pattern matching for different insight types
        const patterns = {
            preferences: [
                /prefer[s]?\s+([^.]+)/gi,
                /like[s]?\s+([^.]+)/gi,
                /want[s]?\s+([^.]+)/gi,
                /always\s+([^.]+)/gi,
                /please\s+([^.]+)/gi
            ],
            issues: [
                /problem[s]?\s+with\s+([^.]+)/gi,
                /issue[s]?\s+with\s+([^.]+)/gi,
                /not\s+working\s+([^.]+)/gi,
                /broken\s+([^.]+)/gi,
                /complaint[s]?\s+about\s+([^.]+)/gi,
                /frustrated\s+([^.]+)/gi
            ],
            feedback: [
                /great\s+([^.]+)/gi,
                /excellent\s+([^.]+)/gi,
                /thank\s+you\s+for\s+([^.]+)/gi,
                /appreciate\s+([^.]+)/gi,
                /happy\s+with\s+([^.]+)/gi
            ],
            urgent: [
                /emergency\s+([^.]+)/gi,
                /urgent\s+([^.]+)/gi,
                /asap\s+([^.]+)/gi,
                /right\s+away\s+([^.]+)/gi,
                /immediately\s+([^.]+)/gi
            ]
        };
        for (const comm of comms){
            const content = comm.call_transcript || comm.body_plain || "";
            if (!content) continue;
            const customer = comm.customer;
            // Extract insights based on focus area
            const areasToScan = focusArea === "all" ? Object.keys(patterns) : [
                focusArea
            ];
            for (const area of areasToScan){
                for (const pattern of patterns[area] || []){
                    const matches = content.matchAll(pattern);
                    for (const match of matches){
                        insights.push({
                            customerId: comm.customer_id,
                            customerName: customer?.name || null,
                            type: area,
                            content: match[0],
                            source: `${comm.channel} on ${new Date(comm.created_at).toLocaleDateString()}`,
                            importance: area === "urgent" || area === "issues" ? "high" : "medium"
                        });
                    }
                }
            }
            // Also flag negative sentiment calls
            if (comm.call_sentiment && [
                "negative",
                "very_negative"
            ].includes(comm.call_sentiment)) {
                insights.push({
                    customerId: comm.customer_id,
                    customerName: customer?.name || null,
                    type: "sentiment",
                    content: `Negative sentiment detected in ${comm.channel} communication`,
                    source: `${comm.channel} on ${new Date(comm.created_at).toLocaleDateString()}`,
                    importance: "high"
                });
            }
        }
        return {
            success: true,
            communicationsAnalyzed: comms.length,
            daysBack,
            focusArea,
            insightsFound: insights.length,
            insights: insights.slice(0, 100),
            summary: {
                byType: {
                    preferences: insights.filter((i)=>i.type === "preferences").length,
                    issues: insights.filter((i)=>i.type === "issues").length,
                    feedback: insights.filter((i)=>i.type === "feedback").length,
                    urgent: insights.filter((i)=>i.type === "urgent").length,
                    sentiment: insights.filter((i)=>i.type === "sentiment").length
                },
                highImportance: insights.filter((i)=>i.importance === "high").length
            }
        };
    }
});
const learnFromCompletedJobsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Analyze completed jobs to learn patterns about:
- Common job durations by type
- Frequently used materials
- Customer satisfaction indicators
- Technician performance patterns
- Seasonal job patterns

Helps improve scheduling and resource allocation.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company ID"),
        daysBack: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(30).describe("Days to look back"),
        jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Filter by job type")
    }),
    execute: async ({ companyId, daysBack, jobType })=>{
        const { createServiceSupabaseClient } = await __turbopack_context__.A("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript, async loader)");
        const supabase = createServiceSupabaseClient();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);
        let query = supabase.from("jobs").select(`
				id,
				title,
				job_type,
				status,
				scheduled_start,
				scheduled_end,
				actual_start,
				actual_end,
				total_amount,
				customer:customers!customer_id(name),
				property:properties!property_id(address_line1, city)
			`).eq("company_id", companyId).eq("status", "completed").gte("created_at", startDate.toISOString()).order("created_at", {
            ascending: false
        }).limit(100);
        if (jobType) {
            query = query.eq("job_type", jobType);
        }
        const { data: jobs, error } = await query;
        if (error || !jobs) {
            return {
                success: false,
                error: error?.message || "No jobs found"
            };
        }
        // Analyze job patterns
        const durationAnalysis = {};
        const revenueAnalysis = {};
        const accuracyAnalysis = [];
        for (const job of jobs){
            const type = job.job_type || "unknown";
            // Duration analysis
            if (job.actual_start && job.actual_end) {
                const actualMinutes = (new Date(job.actual_end).getTime() - new Date(job.actual_start).getTime()) / 60000;
                if (!durationAnalysis[type]) durationAnalysis[type] = [];
                durationAnalysis[type].push(actualMinutes);
                // Scheduling accuracy
                if (job.scheduled_start && job.scheduled_end) {
                    const scheduledMinutes = (new Date(job.scheduled_end).getTime() - new Date(job.scheduled_start).getTime()) / 60000;
                    accuracyAnalysis.push({
                        jobType: type,
                        scheduledMinutes,
                        actualMinutes,
                        accuracy: Math.min(scheduledMinutes / actualMinutes, actualMinutes / scheduledMinutes) * 100
                    });
                }
            }
            // Revenue analysis
            if (job.total_amount) {
                if (!revenueAnalysis[type]) revenueAnalysis[type] = [];
                revenueAnalysis[type].push(job.total_amount);
            }
        }
        // Calculate averages
        const durationSummary = {};
        for (const [type, durations] of Object.entries(durationAnalysis)){
            const avg = durations.reduce((a, b)=>a + b, 0) / durations.length;
            durationSummary[type] = {
                avg: Math.round(avg),
                min: Math.round(Math.min(...durations)),
                max: Math.round(Math.max(...durations)),
                count: durations.length
            };
        }
        const revenueSummary = {};
        for (const [type, amounts] of Object.entries(revenueAnalysis)){
            const avg = amounts.reduce((a, b)=>a + b, 0) / amounts.length;
            revenueSummary[type] = {
                avg: Math.round(avg * 100) / 100,
                min: Math.min(...amounts),
                max: Math.max(...amounts),
                count: amounts.length
            };
        }
        // Scheduling accuracy summary
        const avgAccuracy = accuracyAnalysis.length > 0 ? accuracyAnalysis.reduce((sum, a)=>sum + a.accuracy, 0) / accuracyAnalysis.length : null;
        return {
            success: true,
            jobsAnalyzed: jobs.length,
            daysBack,
            insights: {
                durationByType: durationSummary,
                revenueByType: revenueSummary,
                schedulingAccuracy: avgAccuracy ? `${Math.round(avgAccuracy)}% average accuracy` : "Insufficient data"
            },
            recommendations: Object.entries(durationSummary).map(([type, stats])=>({
                    jobType: type,
                    recommendedDuration: stats.avg,
                    note: stats.max > stats.avg * 1.5 ? `Consider allocating buffer time - some ${type} jobs take up to ${stats.max} minutes` : null
                }))
        };
    }
});
const buildCustomerProfileTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: `Build a comprehensive customer profile by aggregating all available data:
- Communication history and sentiment
- Job history and preferences
- Payment history
- Property information
- Stored memories and notes

Use this to prepare for customer interactions or to understand customer value.`,
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Customer UUID"),
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company ID")
    }),
    execute: async ({ customerId, companyId })=>{
        const { createServiceSupabaseClient } = await __turbopack_context__.A("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript, async loader)");
        const supabase = createServiceSupabaseClient();
        // Fetch all customer data in parallel
        const [customerResult, jobsResult, commsResult, invoicesResult, memoriesResult] = await Promise.all([
            supabase.from("customers").select("*").eq("id", customerId).eq("company_id", companyId).single(),
            supabase.from("jobs").select("id, title, job_type, status, total_amount, created_at").eq("customer_id", customerId).order("created_at", {
                ascending: false
            }).limit(20),
            supabase.from("communications").select("id, channel, direction, call_sentiment, created_at").eq("customer_id", customerId).order("created_at", {
                ascending: false
            }).limit(50),
            supabase.from("invoices").select("id, status, total, paid_amount, created_at").eq("customer_id", customerId).order("created_at", {
                ascending: false
            }).limit(20),
            supabase.from("ai_memory").select("content, memory_type, importance, created_at").eq("company_id", companyId).eq("entity_id", customerId).eq("entity_type", "customer").order("importance", {
                ascending: false
            }).limit(20)
        ]);
        const customer = customerResult.data;
        const jobs = jobsResult.data || [];
        const comms = commsResult.data || [];
        const invoices = invoicesResult.data || [];
        const memories = memoriesResult.data || [];
        if (!customer) {
            return {
                success: false,
                error: "Customer not found"
            };
        }
        // Analyze job history
        const completedJobs = jobs.filter((j)=>j.status === "completed");
        const totalRevenue = jobs.reduce((sum, j)=>sum + (j.total_amount || 0), 0);
        const jobTypes = [
            ...new Set(jobs.map((j)=>j.job_type).filter(Boolean))
        ];
        // Analyze communication sentiment
        const sentiments = comms.map((c)=>c.call_sentiment).filter(Boolean);
        const negativeSentiments = sentiments.filter((s)=>s === "negative" || s === "very_negative").length;
        const positiveSentiments = sentiments.filter((s)=>s === "positive" || s === "very_positive").length;
        // Analyze payment behavior
        const paidInvoices = invoices.filter((i)=>i.status === "paid");
        const overdueInvoices = invoices.filter((i)=>i.status === "overdue");
        const totalOwed = invoices.filter((i)=>i.status !== "paid").reduce((sum, i)=>sum + ((i.total || 0) - (i.paid_amount || 0)), 0);
        // Customer tier based on revenue and history
        let tier = "new";
        if (completedJobs.length >= 5 && totalRevenue > 5000) {
            tier = "vip";
        } else if (completedJobs.length >= 2) {
            tier = "regular";
        }
        if (negativeSentiments > positiveSentiments || overdueInvoices.length > 2) {
            tier = "at_risk";
        }
        return {
            success: true,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                createdAt: customer.created_at
            },
            tier,
            jobHistory: {
                totalJobs: jobs.length,
                completedJobs: completedJobs.length,
                totalRevenue,
                commonJobTypes: jobTypes,
                recentJobs: jobs.slice(0, 5).map((j)=>({
                        title: j.title,
                        type: j.job_type,
                        status: j.status,
                        amount: j.total_amount
                    }))
            },
            communicationHistory: {
                totalInteractions: comms.length,
                channelBreakdown: {
                    calls: comms.filter((c)=>c.channel === "phone").length,
                    emails: comms.filter((c)=>c.channel === "email").length,
                    sms: comms.filter((c)=>c.channel === "sms").length
                },
                sentimentSummary: {
                    positive: positiveSentiments,
                    negative: negativeSentiments,
                    neutral: sentiments.length - positiveSentiments - negativeSentiments
                }
            },
            financials: {
                totalInvoices: invoices.length,
                paidInvoices: paidInvoices.length,
                overdueInvoices: overdueInvoices.length,
                currentBalance: totalOwed,
                paymentHealth: overdueInvoices.length === 0 ? "good" : overdueInvoices.length < 3 ? "fair" : "poor"
            },
            memories: memories.map((m)=>({
                    content: m.content,
                    type: m.memory_type,
                    importance: m.importance
                })),
            recommendations: tier === "at_risk" ? [
                "Review recent negative interactions",
                "Consider follow-up call to address concerns",
                "Check for outstanding payment issues"
            ] : tier === "vip" ? [
                "Prioritize this customer's requests",
                "Consider loyalty discount or perks",
                "Proactive maintenance reminders"
            ] : [
                "Standard service approach",
                "Opportunity to build relationship"
            ]
        };
    }
});
const getRouteTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Calculate optimal driving route between locations with distance and duration",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        waypoints: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Full address"),
            lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe("Latitude if known"),
            lng: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().describe("Longitude if known")
        })).min(2).describe("Array of waypoints (minimum 2: origin and destination)"),
        optimizeOrder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(false).describe("Whether to optimize waypoint order for shortest route")
    }),
    execute: async ({ waypoints })=>{
        // Geocode any waypoints without coordinates
        const geocodedWaypoints = await Promise.all(waypoints.map(async (wp)=>{
            if (wp.lat && wp.lng) {
                return {
                    ...wp,
                    coordinates: [
                        wp.lng,
                        wp.lat
                    ]
                };
            }
            // Use geocoding service (Nominatim requires User-Agent per ToS)
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(wp.address)}&limit=1`;
            try {
                const response = await fetch(geocodeUrl, {
                    headers: {
                        "User-Agent": "Stratos-FSM/1.0 (https://stratos.app; support@stratos.app)",
                        "Accept": "application/json"
                    }
                });
                if (!response.ok) {
                    console.warn(`Geocoding failed for ${wp.address}: ${response.status}`);
                    return {
                        ...wp,
                        coordinates: null
                    };
                }
                const data = await response.json();
                if (data.length > 0) {
                    return {
                        ...wp,
                        coordinates: [
                            parseFloat(data[0].lon),
                            parseFloat(data[0].lat)
                        ]
                    };
                }
            } catch (error) {
                console.warn(`Geocoding error for ${wp.address}:`, error);
            }
            return {
                ...wp,
                coordinates: null
            };
        }));
        const validWaypoints = geocodedWaypoints.filter((wp)=>wp.coordinates);
        if (validWaypoints.length < 2) {
            return {
                error: "Could not geocode enough waypoints for routing"
            };
        }
        // Get route from OpenRouteService (if API key available)
        const apiKey = process.env.OPENROUTESERVICE_API_KEY;
        if (apiKey) {
            try {
                const coordinates = validWaypoints.map((wp)=>wp.coordinates);
                const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
                    method: "POST",
                    headers: {
                        Authorization: apiKey,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        coordinates,
                        instructions: true
                    })
                });
                const routeData = await response.json();
                if (routeData.features?.[0]) {
                    const feature = routeData.features[0];
                    return {
                        distance_km: (feature.properties.summary.distance / 1000).toFixed(1),
                        duration_minutes: Math.round(feature.properties.summary.duration / 60),
                        waypoints: validWaypoints.map((wp)=>wp.address),
                        geometry: feature.geometry
                    };
                }
            } catch  {
            // Fall through to estimate
            }
        }
        // Fallback: Calculate straight-line distance estimate
        const coords = validWaypoints.map((wp)=>wp.coordinates);
        let totalDistance = 0;
        for(let i = 0; i < coords.length - 1; i++){
            const [lon1, lat1] = coords[i];
            const [lon2, lat2] = coords[i + 1];
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            totalDistance += R * c;
        }
        const drivingDistance = totalDistance * 1.3;
        const durationMinutes = Math.round(drivingDistance / 50 * 60);
        return {
            distance_km: drivingDistance.toFixed(1),
            duration_minutes: durationMinutes,
            waypoints: validWaypoints.map((wp)=>wp.address),
            note: "Estimated based on straight-line distance"
        };
    }
});
const findNearbySuppliersTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Find nearby supply stores for parts (plumbing, electrical, HVAC, hardware)",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Latitude"),
            lng: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().describe("Longitude")
        }),
        supplyType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "plumbing",
            "electrical",
            "hvac",
            "hardware",
            "all"
        ]).default("all"),
        radiusKm: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10)
    }),
    execute: async ({ location, supplyType, radiusKm })=>{
        const typeFilters = {
            plumbing: '["shop"="trade"]["trade"~"plumbing|bathroom"]',
            electrical: '["shop"="trade"]["trade"~"electrical"]',
            hvac: '["shop"="trade"]["trade"~"hvac|air_conditioning"]',
            hardware: '["shop"="doityourself"]',
            all: '["shop"~"trade|doityourself|hardware"]'
        };
        const filter = typeFilters[supplyType];
        const query = `[out:json][timeout:25];(node${filter}(around:${radiusKm * 1000},${location.lat},${location.lng});way${filter}(around:${radiusKm * 1000},${location.lat},${location.lng}););out center;`;
        try {
            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: query
            });
            const data = await response.json();
            const suppliers = data.elements.map((el)=>({
                    name: el.tags?.name || "Unknown Supplier",
                    phone: el.tags?.phone,
                    website: el.tags?.website,
                    lat: el.lat || el.center?.lat,
                    lng: el.lon || el.center?.lon
                })).filter((s)=>s.name !== "Unknown Supplier").slice(0, 10);
            return {
                suppliers,
                searchRadius: radiusKm,
                supplyType
            };
        } catch  {
            return {
                error: "Failed to search for suppliers"
            };
        }
    }
});
const searchInventoryTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search company inventory for parts by name, SKU, or category",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Search query"),
        category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        inStockOnly: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional().default(false)
    }),
    execute: async ({ companyId, query, category, inStockOnly })=>{
        const supabase = await createClient();
        let dbQuery = supabase.from("inventory").select("id, sku, name, description, category, quantity_on_hand, quantity_reserved, reorder_point, unit_cost, unit_price, location").eq("company_id", companyId).or(`name.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`);
        if (category) dbQuery = dbQuery.eq("category", category);
        if (inStockOnly) dbQuery = dbQuery.gt("quantity_on_hand", 0);
        const { data, error } = await dbQuery.order("name").limit(20);
        if (error) return {
            error: error.message
        };
        return {
            items: data.map((item)=>({
                    ...item,
                    available: item.quantity_on_hand - (item.quantity_reserved || 0),
                    needsReorder: item.quantity_on_hand <= (item.reorder_point || 0)
                })),
            total: data.length
        };
    }
});
const checkPartsAvailabilityTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Check if required parts are available in inventory for a job",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        parts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            itemId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            sku: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            quantity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
        }))
    }),
    execute: async ({ companyId, parts })=>{
        if (!parts.length) {
            return {
                error: "At least one part is required"
            };
        }
        const supabase = await createClient();
        // Batch lookup: collect IDs and SKUs for a single query
        const itemIds = parts.filter((p)=>p.itemId).map((p)=>p.itemId);
        const skus = parts.filter((p)=>p.sku && !p.itemId).map((p)=>p.sku);
        // Fetch all matching inventory items in one query
        let inventoryQuery = supabase.from("inventory").select("id, sku, name, quantity_on_hand, quantity_reserved, unit_cost, unit_price").eq("company_id", companyId).is("deleted_at", null);
        // Build OR conditions for batch lookup
        const orConditions = [];
        if (itemIds.length > 0) {
            orConditions.push(`id.in.(${itemIds.join(",")})`);
        }
        if (skus.length > 0) {
            orConditions.push(`sku.in.(${skus.join(",")})`);
        }
        let inventoryItems = [];
        if (orConditions.length > 0) {
            const { data } = await inventoryQuery.or(orConditions.join(","));
            inventoryItems = data || [];
        }
        // For name-based lookups, we still need individual queries (fuzzy match)
        const nameOnlyParts = parts.filter((p)=>!p.itemId && !p.sku && p.name);
        if (nameOnlyParts.length > 0) {
            const nameResults = await Promise.all(nameOnlyParts.map(async (part)=>{
                const { data } = await supabase.from("inventory").select("id, sku, name, quantity_on_hand, quantity_reserved, unit_cost, unit_price").eq("company_id", companyId).is("deleted_at", null).ilike("name", `%${part.name}%`).limit(1).single();
                return data;
            }));
            inventoryItems.push(...nameResults.filter((r)=>r !== null));
        }
        // Map results to parts
        const results = parts.map((part)=>{
            const item = inventoryItems.find((inv)=>part.itemId && inv.id === part.itemId || part.sku && inv.sku === part.sku || part.name && inv.name.toLowerCase().includes(part.name.toLowerCase()));
            if (!item) {
                return {
                    ...part,
                    found: false,
                    available: 0,
                    canFulfill: false
                };
            }
            const available = item.quantity_on_hand - (item.quantity_reserved || 0);
            return {
                itemId: item.id,
                sku: item.sku,
                name: item.name,
                found: true,
                available,
                needed: part.quantity,
                canFulfill: available >= part.quantity,
                unitPrice: item.unit_price,
                totalPrice: (item.unit_price || 0) * part.quantity
            };
        });
        return {
            allPartsAvailable: results.every((r)=>r.canFulfill),
            parts: results,
            missingParts: results.filter((r)=>!r.canFulfill),
            totalEstimatedPrice: results.reduce((sum, r)=>sum + (r.totalPrice || 0), 0)
        };
    }
});
const getLowStockAlertsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get inventory items at or below reorder point",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(50).describe("Max items to return")
    }),
    execute: async ({ companyId, category, limit })=>{
        const supabase = await createClient();
        // Use a raw filter to get only items where quantity <= reorder_point
        let query = supabase.from("inventory").select("id, sku, name, category, quantity_on_hand, reorder_point, reorder_quantity, unit_cost").eq("company_id", companyId).is("deleted_at", null).not("reorder_point", "is", null);
        if (category) query = query.eq("category", category);
        const { data, error } = await query.order("quantity_on_hand", {
            ascending: true
        }).limit(limit * 2);
        if (error) return {
            error: error.message
        };
        // Filter for items at or below reorder point and limit
        const lowStockItems = data.filter((item)=>item.quantity_on_hand <= (item.reorder_point || 0)).slice(0, limit).map((item)=>({
                ...item,
                shortfall: (item.reorder_point || 0) - item.quantity_on_hand,
                suggestedOrderQty: item.reorder_quantity || 10,
                urgency: item.quantity_on_hand === 0 ? "critical" : item.quantity_on_hand <= (item.reorder_point || 0) / 2 ? "high" : "normal"
            }));
        return {
            lowStockCount: lowStockItems.length,
            items: lowStockItems,
            criticalCount: lowStockItems.filter((i)=>i.urgency === "critical").length
        };
    }
});
const getPropertyEquipmentTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get list of equipment installed at a customer's property",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        propertyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        customerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }),
    execute: async ({ companyId, propertyId, customerId })=>{
        // Validate: at least one filter is required
        if (!propertyId && !customerId) {
            return {
                error: "Either propertyId or customerId is required"
            };
        }
        const supabase = await createClient();
        let query = supabase.from("equipment").select("id, name, model_number, serial_number, manufacturer, install_date, warranty_expiry, last_service_date, next_service_due, status, notes").eq("company_id", companyId).is("deleted_at", null);
        if (propertyId) {
            query = query.eq("property_id", propertyId);
        } else if (customerId) {
            const { data: properties } = await supabase.from("properties").select("id").eq("customer_id", customerId).is("deleted_at", null);
            if (!properties?.length) {
                return {
                    equipment: [],
                    total: 0,
                    message: "No properties found for this customer"
                };
            }
            query = query.in("property_id", properties.map((p)=>p.id));
        }
        const { data, error } = await query.order("name").limit(100);
        if (error) return {
            error: error.message
        };
        const now = new Date();
        return {
            equipment: data.map((eq)=>({
                    ...eq,
                    warrantyStatus: eq.warranty_expiry ? new Date(eq.warranty_expiry) > now ? "active" : "expired" : "unknown",
                    serviceDue: eq.next_service_due ? new Date(eq.next_service_due) <= now : false
                })),
            total: data.length
        };
    }
});
const getEquipmentServiceHistoryTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get service history for a specific piece of equipment",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        equipmentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Equipment UUID"),
        limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(10)
    }),
    execute: async ({ companyId, equipmentId, limit })=>{
        const supabase = await createClient();
        const { data: equipment } = await supabase.from("equipment").select("*").eq("id", equipmentId).eq("company_id", companyId).single();
        if (!equipment) return {
            error: "Equipment not found"
        };
        const { data: serviceHistory } = await supabase.from("job_equipment").select("job:jobs(id, title, status, completed_at), notes, work_performed, created_at").eq("equipment_id", equipmentId).order("created_at", {
            ascending: false
        }).limit(limit);
        return {
            equipment: {
                id: equipment.id,
                name: equipment.name,
                model: equipment.model_number,
                serial: equipment.serial_number
            },
            serviceHistory: serviceHistory || [],
            totalServices: serviceHistory?.length || 0
        };
    }
});
const checkEquipmentWarrantyTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Check warranty status for equipment",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        equipmentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Equipment UUID")
    }),
    execute: async ({ companyId, equipmentId })=>{
        const supabase = await createClient();
        const { data: equipment, error } = await supabase.from("equipment").select("id, name, model_number, serial_number, warranty_expiry, warranty_type, warranty_notes").eq("id", equipmentId).eq("company_id", companyId).single();
        if (error || !equipment) return {
            error: "Equipment not found"
        };
        const now = new Date();
        const warrantyEnd = equipment.warranty_expiry ? new Date(equipment.warranty_expiry) : null;
        let status = "unknown";
        let daysRemaining = null;
        if (warrantyEnd) {
            daysRemaining = Math.ceil((warrantyEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
            status = daysRemaining < 0 ? "expired" : daysRemaining <= 30 ? "expiring_soon" : "active";
        }
        return {
            equipment: {
                name: equipment.name,
                model: equipment.model_number,
                serial: equipment.serial_number
            },
            warranty: {
                status,
                expiryDate: equipment.warranty_expiry,
                daysRemaining: daysRemaining && daysRemaining > 0 ? daysRemaining : 0,
                type: equipment.warranty_type
            }
        };
    }
});
const findTechniciansBySkillsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Find available technicians with specific skills or certifications",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        skills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
        certifications: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
        date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Date to check availability")
    }),
    execute: async ({ companyId, skills, certifications, date })=>{
        try {
            const supabase = await createClient();
            const { data: members, error } = await supabase.from("company_memberships").select("id, role, skills, certifications, service_areas, user:users(id, first_name, last_name, email)").eq("company_id", companyId).eq("role", "technician");
            if (error) return {
                error: error.message
            };
            let filtered = members;
            if (skills?.length) {
                filtered = filtered.filter((m)=>skills.some((skill)=>(m.skills || []).map((s)=>s.toLowerCase()).includes(skill.toLowerCase())));
            }
            if (certifications?.length) {
                filtered = filtered.filter((m)=>certifications.some((cert)=>(m.certifications || []).map((c)=>c.toLowerCase()).includes(cert.toLowerCase())));
            }
            if (date) {
                const dayStart = new Date(date);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(date);
                dayEnd.setHours(23, 59, 59, 999);
                const { data: assignments } = await supabase.from("jobs").select("assigned_to").is("deleted_at", null).in("assigned_to", filtered.map((m)=>m.id)).gte("scheduled_start", dayStart.toISOString()).lte("scheduled_start", dayEnd.toISOString());
                const jobCounts = {};
                assignments?.forEach((a)=>{
                    if (a.assigned_to) jobCounts[a.assigned_to] = (jobCounts[a.assigned_to] || 0) + 1;
                });
                filtered = filtered.map((m)=>({
                        ...m,
                        jobsOnDate: jobCounts[m.id] || 0,
                        availability: (jobCounts[m.id] || 0) === 0 ? "available" : (jobCounts[m.id] || 0) < 4 ? "partially_booked" : "fully_booked"
                    }));
            }
            return {
                technicians: filtered.map((m)=>({
                        id: m.id,
                        name: `${m.user?.first_name} ${m.user?.last_name}`,
                        skills: m.skills,
                        certifications: m.certifications,
                        availability: m.availability
                    })),
                total: filtered.length
            };
        } catch (err) {
            return {
                error: err instanceof Error ? err.message : "Failed to find technicians"
            };
        }
    }
});
const getTechnicianWorkloadTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Get a technician's current workload and schedule",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        technicianId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Technician membership UUID"),
        startDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        endDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    }),
    execute: async ({ companyId, technicianId, startDate, endDate })=>{
        try {
            const supabase = await createClient();
            const { data: tech } = await supabase.from("company_memberships").select("id, user:users(first_name, last_name)").eq("id", technicianId).eq("company_id", companyId).single();
            if (!tech) return {
                error: "Technician not found"
            };
            const { data: jobs } = await supabase.from("jobs").select("id, title, status, scheduled_start, scheduled_end, customer:customers(name)").eq("assigned_to", technicianId).is("deleted_at", null).gte("scheduled_start", startDate).lte("scheduled_start", endDate).order("scheduled_start");
            return {
                technician: {
                    id: tech.id,
                    name: `${tech.user?.first_name} ${tech.user?.last_name}`
                },
                summary: {
                    totalJobs: jobs?.length || 0,
                    completed: jobs?.filter((j)=>j.status === "completed").length || 0,
                    scheduled: jobs?.filter((j)=>j.status === "scheduled").length || 0
                },
                jobs: jobs?.map((j)=>({
                        id: j.id,
                        title: j.title,
                        status: j.status,
                        scheduledStart: j.scheduled_start,
                        customer: j.customer?.name
                    })) || []
            };
        } catch (err) {
            return {
                error: err instanceof Error ? err.message : "Failed to get technician workload"
            };
        }
    }
});
const searchPriceBookTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search price book for services, parts, and flat-rate pricing",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }),
    execute: async ({ companyId, query, category })=>{
        const supabase = await createClient();
        let dbQuery = supabase.from("price_book_items").select("id, name, description, category, sku, unit_price, cost, is_active").eq("company_id", companyId).eq("is_active", true).or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`);
        if (category) dbQuery = dbQuery.eq("category", category);
        const { data, error } = await dbQuery.order("name").limit(20);
        if (error) return {
            error: error.message
        };
        return {
            items: data.map((item)=>({
                    ...item,
                    profit: item.unit_price - (item.cost || 0)
                })),
            total: data.length
        };
    }
});
const calculateEstimateTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Calculate an estimate total from price book items",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            priceBookItemId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            quantity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().default(1),
            customPrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
        })),
        discount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
                "percentage",
                "fixed"
            ]),
            value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
        }).optional(),
        taxRate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional()
    }),
    execute: async ({ companyId, items, discount, taxRate })=>{
        const supabase = await createClient();
        const priceBookIds = items.filter((i)=>i.priceBookItemId).map((i)=>i.priceBookItemId);
        let priceBookItems = [];
        if (priceBookIds.length > 0) {
            const { data } = await supabase.from("price_book_items").select("id, name, unit_price, cost").in("id", priceBookIds);
            priceBookItems = data || [];
        }
        const lineItems = items.map((item)=>{
            const pbItem = priceBookItems.find((p)=>p.id === item.priceBookItemId);
            const unitPrice = item.customPrice || pbItem?.unit_price || 0;
            return {
                name: item.name || pbItem?.name || "Unknown Item",
                quantity: item.quantity,
                unitPrice,
                lineTotal: unitPrice * item.quantity
            };
        });
        const subtotal = lineItems.reduce((sum, item)=>sum + item.lineTotal, 0);
        let discountAmount = 0;
        if (discount) {
            discountAmount = discount.type === "percentage" ? subtotal * (discount.value / 100) : discount.value;
        }
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = afterDiscount * ((taxRate || 0) / 100);
        return {
            lineItems,
            subtotal,
            discount: discountAmount > 0 ? {
                ...discount,
                amount: discountAmount
            } : null,
            tax: {
                rate: taxRate || 0,
                amount: taxAmount
            },
            grandTotal: afterDiscount + taxAmount
        };
    }
});
const suggestTechnicianForJobTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Suggest the best technician for a job based on skills, location, and availability",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        jobType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        requiredSkills: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
        preferredDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    }),
    execute: async ({ companyId, jobType, requiredSkills, preferredDate })=>{
        try {
            const supabase = await createClient();
            const { data: technicians } = await supabase.from("company_memberships").select("id, skills, preferred_job_types, user:users(first_name, last_name)").eq("company_id", companyId).eq("role", "technician");
            if (!technicians?.length) return {
                error: "No technicians found"
            };
            const dayStart = new Date(preferredDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(preferredDate);
            dayEnd.setHours(23, 59, 59, 999);
            const { data: existingJobs } = await supabase.from("jobs").select("assigned_to").is("deleted_at", null).in("assigned_to", technicians.map((t)=>t.id)).gte("scheduled_start", dayStart.toISOString()).lte("scheduled_start", dayEnd.toISOString());
            const jobCounts = {};
            existingJobs?.forEach((j)=>{
                if (j.assigned_to) jobCounts[j.assigned_to] = (jobCounts[j.assigned_to] || 0) + 1;
            });
            const scored = technicians.map((tech)=>{
                let score = 0;
                const reasons = [];
                const techSkills = (tech.skills || []).map((s)=>s.toLowerCase());
                const matchedSkills = (requiredSkills || []).filter((s)=>techSkills.includes(s.toLowerCase()));
                if (matchedSkills.length > 0) {
                    score += 40 * (matchedSkills.length / (requiredSkills?.length || 1));
                    reasons.push(`Matches ${matchedSkills.length} skills`);
                }
                const preferredTypes = (tech.preferred_job_types || []).map((t)=>t.toLowerCase());
                if (preferredTypes.includes(jobType.toLowerCase())) {
                    score += 20;
                    reasons.push("Prefers this job type");
                }
                const techJobs = jobCounts[tech.id] || 0;
                if (techJobs === 0) {
                    score += 30;
                    reasons.push("Fully available");
                } else if (techJobs < 3) {
                    score += 15;
                    reasons.push(`${techJobs} jobs scheduled`);
                }
                return {
                    id: tech.id,
                    name: `${tech.user?.first_name} ${tech.user?.last_name}`,
                    score: Math.round(score),
                    reasons,
                    jobsOnDate: techJobs
                };
            });
            scored.sort((a, b)=>b.score - a.score);
            return {
                recommendations: scored.slice(0, 5),
                bestMatch: scored[0]
            };
        } catch (err) {
            return {
                error: err instanceof Error ? err.message : "Failed to suggest technician"
            };
        }
    }
});
const optimizeJobOrderTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Optimize the order of jobs for a technician to minimize travel time",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        companyId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("Company UUID"),
        technicianId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    }),
    execute: async ({ technicianId, date })=>{
        try {
            const supabase = await createClient();
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            const { data: jobs } = await supabase.from("jobs").select("id, title, scheduled_start, priority, property:properties(address, city, latitude, longitude)").eq("assigned_to", technicianId).is("deleted_at", null).gte("scheduled_start", dayStart.toISOString()).lte("scheduled_start", dayEnd.toISOString()).order("scheduled_start");
            if (!jobs || jobs.length < 2) return {
                message: "Not enough jobs to optimize",
                jobs: jobs || []
            };
            const jobsWithCoords = jobs.filter((j)=>j.property?.latitude).map((j)=>({
                    ...j,
                    lat: j.property?.latitude,
                    lng: j.property?.longitude
                }));
            if (jobsWithCoords.length < 2) return {
                message: "Not enough jobs with location data",
                jobs
            };
            // Simple nearest-neighbor optimization
            const optimized = [];
            const remaining = [
                ...jobsWithCoords
            ];
            let current = {
                lat: jobsWithCoords[0].lat,
                lng: jobsWithCoords[0].lng
            };
            while(remaining.length > 0){
                let nearestIdx = 0;
                let nearestDist = Infinity;
                remaining.forEach((job, idx)=>{
                    const dist = Math.sqrt(Math.pow(job.lat - current.lat, 2) + Math.pow(job.lng - current.lng, 2));
                    const priorityBonus = job.priority === "high" ? 0.8 : 1;
                    if (dist * priorityBonus < nearestDist) {
                        nearestDist = dist * priorityBonus;
                        nearestIdx = idx;
                    }
                });
                const next = remaining.splice(nearestIdx, 1)[0];
                optimized.push(next);
                current = {
                    lat: next.lat,
                    lng: next.lng
                };
            }
            return {
                optimizedOrder: optimized.map((j, idx)=>({
                        order: idx + 1,
                        jobId: j.id,
                        title: j.title,
                        address: `${j.property?.address}, ${j.property?.city}`
                    })),
                jobCount: optimized.length
            };
        } catch (err) {
            return {
                error: err instanceof Error ? err.message : "Failed to optimize job order"
            };
        }
    }
});
const webSearchTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search the web for information. Use this to find answers to questions, research topics, look up current events, regulations, industry news, competitor information, or any general knowledge questions.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The search query - be specific and include relevant keywords"),
        numResults: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(5).describe("Number of results to return (1-10)"),
        dateRestrict: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe("Limit to recent results: d7 (7 days), m1 (1 month), y1 (1 year)")
    }),
    execute: async ({ query, numResults, dateRestrict })=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].isConfigured()) {
            return {
                success: false,
                error: "Web search is not configured. Please set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID.",
                configStatus: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].getConfigStatus()
            };
        }
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].search(query, {
            num: Math.min(numResults, 10),
            dateRestrict
        });
        if (!results) {
            return {
                success: false,
                error: "Search failed. Please try again."
            };
        }
        return {
            success: true,
            query,
            totalResults: results.totalResults,
            searchTime: results.searchTime,
            results: results.results.map((r)=>({
                    title: r.title,
                    url: r.link,
                    snippet: r.snippet,
                    source: r.displayLink
                }))
        };
    }
});
const webSearchNewsTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for recent news articles. Use this for industry news, current events, company updates, regulation changes, or any time-sensitive information.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The news search query - include topic and relevant keywords"),
        daysBack: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(7).describe("How many days back to search (1-30)"),
        numResults: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(5).describe("Number of results to return (1-10)")
    }),
    execute: async ({ query, daysBack, numResults })=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].isConfigured()) {
            return {
                success: false,
                error: "Web search is not configured. Please set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID."
            };
        }
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].searchNews(query, {
            daysBack: Math.min(daysBack, 30),
            num: Math.min(numResults, 10)
        });
        if (!results) {
            return {
                success: false,
                error: "News search failed. Please try again."
            };
        }
        return {
            success: true,
            query,
            searchType: "news",
            daysBack,
            totalResults: results.totalResults,
            results: results.results.map((r)=>({
                    title: r.title,
                    url: r.link,
                    snippet: r.snippet,
                    source: r.displayLink
                }))
        };
    }
});
const webSearchTechnicalTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search for technical documentation, guides, tutorials, and code examples. Use this when looking for how to do something technical, API documentation, troubleshooting guides, or code references.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The technical search query - include technology names and specific topics"),
        numResults: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(5).describe("Number of results to return (1-10)")
    }),
    execute: async ({ query, numResults })=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].isConfigured()) {
            return {
                success: false,
                error: "Web search is not configured. Please set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID."
            };
        }
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].searchTechnical(query, {
            num: Math.min(numResults, 10)
        });
        if (!results) {
            return {
                success: false,
                error: "Technical search failed. Please try again."
            };
        }
        return {
            success: true,
            query,
            searchType: "technical",
            totalResults: results.totalResults,
            results: results.results.map((r)=>({
                    title: r.title,
                    url: r.link,
                    snippet: r.snippet,
                    source: r.displayLink
                }))
        };
    }
});
const webSearchSiteTool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$provider$2d$utils$40$3$2e$0$2e$17_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
    description: "Search within a specific website. Use this to find information on a particular site like manufacturer documentation, government sites, or specific company websites.",
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The search query"),
        site: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe("The domain to search within (e.g., 'epa.gov', 'osha.gov', 'lennox.com')"),
        numResults: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(5).describe("Number of results to return (1-10)")
    }),
    execute: async ({ query, site, numResults })=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].isConfigured()) {
            return {
                success: false,
                error: "Web search is not configured. Please set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID."
            };
        }
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$google$2d$custom$2d$search$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["googleCustomSearchService"].searchSite(query, site, {
            num: Math.min(numResults, 10)
        });
        if (!results) {
            return {
                success: false,
                error: "Site search failed. Please try again."
            };
        }
        return {
            success: true,
            query,
            site,
            totalResults: results.totalResults,
            results: results.results.map((r)=>({
                    title: r.title,
                    url: r.link,
                    snippet: r.snippet
                }))
        };
    }
});
const destructiveTools = {
    // Communication tools - sending messages to external parties
    sendEmail: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "high",
        requiresOwnerApproval: true,
        description: "Sends an email to a customer on behalf of your company",
        affectedEntityType: "customer"
    },
    sendSms: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "high",
        requiresOwnerApproval: true,
        description: "Sends an SMS message to a customer on behalf of your company",
        affectedEntityType: "customer"
    },
    initiateCall: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "critical",
        requiresOwnerApproval: true,
        description: "Initiates a phone call to a customer",
        affectedEntityType: "customer"
    },
    sendTeamEmail: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "medium",
        requiresOwnerApproval: true,
        description: "Sends an internal email to a team member",
        affectedEntityType: "team_member"
    },
    sendTeamSms: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "medium",
        requiresOwnerApproval: true,
        description: "Sends an SMS to a team member",
        affectedEntityType: "team_member"
    },
    sendVendorEmail: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "high",
        requiresOwnerApproval: true,
        description: "Sends an email to a vendor on behalf of your company",
        affectedEntityType: "vendor"
    },
    sendVendorSms: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "high",
        requiresOwnerApproval: true,
        description: "Sends an SMS to a vendor on behalf of your company",
        affectedEntityType: "vendor"
    },
    sendImmediateNotification: {
        isDestructive: true,
        actionType: "send_communication",
        riskLevel: "high",
        requiresOwnerApproval: true,
        description: "Sends an immediate notification to a recipient",
        affectedEntityType: "notification"
    },
    // Financial tools - money movement and financial records
    createInvoice: {
        isDestructive: true,
        actionType: "financial",
        riskLevel: "high",
        requiresOwnerApproval: true,
        description: "Creates a new invoice that will be sent to a customer",
        affectedEntityType: "invoice"
    },
    transferToBucket: {
        isDestructive: true,
        actionType: "financial",
        riskLevel: "critical",
        requiresOwnerApproval: true,
        description: "Transfers funds between financial buckets",
        affectedEntityType: "finance_bucket"
    },
    // Scheduling tools - affects customer commitments
    createAppointment: {
        isDestructive: true,
        actionType: "bulk_update",
        riskLevel: "medium",
        requiresOwnerApproval: true,
        description: "Creates a new appointment which commits company resources",
        affectedEntityType: "appointment"
    },
    cancelReminder: {
        isDestructive: true,
        actionType: "delete",
        riskLevel: "low",
        requiresOwnerApproval: true,
        description: "Cancels a scheduled reminder",
        affectedEntityType: "reminder"
    },
    // Data modification tools
    updateCustomer: {
        isDestructive: true,
        actionType: "bulk_update",
        riskLevel: "medium",
        requiresOwnerApproval: true,
        description: "Modifies customer record information",
        affectedEntityType: "customer"
    }
};
function isDestructiveTool(toolName) {
    return toolName in destructiveTools;
}
function getDestructiveToolMetadata(toolName) {
    return destructiveTools[toolName] || null;
}
function getDestructiveToolNames() {
    return Object.keys(destructiveTools);
}
}),
"[project]/apps/web/src/lib/ai/action-approval.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * AI Action Approval Service
 *
 * Handles owner-only approval workflow for destructive AI actions.
 * Ensures no destructive action can execute without explicit owner permission.
 */ __turbopack_context__.s([
    "approveAction",
    ()=>approveAction,
    "createPendingAction",
    ()=>createPendingAction,
    "expireOldActions",
    ()=>expireOldActions,
    "getCompanyOwners",
    ()=>getCompanyOwners,
    "getPendingAction",
    ()=>getPendingAction,
    "getPendingActionsForChat",
    ()=>getPendingActionsForChat,
    "getPendingActionsForCompany",
    ()=>getPendingActionsForCompany,
    "isCompanyOwner",
    ()=>isCompanyOwner,
    "markActionExecuted",
    ()=>markActionExecuted,
    "markActionFailed",
    ()=>markActionFailed,
    "rejectAction",
    ()=>rejectAction,
    "shouldInterceptTool",
    ()=>shouldInterceptTool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$agent$2d$tools$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/ai/agent-tools.ts [app-rsc] (ecmascript)");
;
;
async function isCompanyOwner(companyId, userId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.rpc("is_company_owner", {
        p_company_id: companyId,
        p_user_id: userId
    });
    if (error) {
        console.error("Error checking owner status:", error);
        return false;
    }
    return data === true;
}
async function getCompanyOwners(companyId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("company_memberships").select(`
			user_id,
			users!company_memberships_users_id_fkey (
				email,
				name
			)
		`).eq("company_id", companyId).eq("role", "owner");
    if (error) {
        console.error("Error fetching company owners:", error);
        return [];
    }
    return (data || []).map((row)=>{
        const user = row.users;
        const nameParts = (user?.name || "").split(" ");
        return {
            userId: row.user_id,
            email: user?.email || "",
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || ""
        };
    });
}
async function createPendingAction(input) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get metadata about this destructive tool
    const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$agent$2d$tools$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDestructiveToolMetadata"])(input.toolName);
    if (!metadata) {
        return {
            success: false,
            error: `Tool '${input.toolName}' is not registered as destructive`
        };
    }
    // Calculate expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    // Create the pending action record
    const { data, error } = await supabase.from("ai_pending_actions").insert({
        company_id: input.companyId,
        chat_id: input.chatId,
        message_id: input.messageId,
        user_id: input.userId,
        tool_name: input.toolName,
        tool_args: input.toolArgs,
        action_type: metadata.actionType,
        action_title: `AI wants to: ${metadata.description}`,
        action_summary: generateActionSummary(input.toolName, input.toolArgs, metadata),
        action_details: {
            toolName: input.toolName,
            toolArgs: input.toolArgs,
            metadata
        },
        affected_entity_type: metadata.affectedEntityType,
        affected_entity_ids: input.affectedEntityIds || [],
        affected_count: input.affectedEntityIds?.length || 1,
        risk_level: metadata.riskLevel,
        status: "pending",
        urgency: metadata.riskLevel === "critical" ? "high" : metadata.riskLevel === "high" ? "medium" : "low",
        expires_at: expiresAt.toISOString(),
        // Required by existing schema
        action_log_id: crypto.randomUUID()
    }).select("id").single();
    if (error) {
        console.error("Error creating pending action:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true,
        pendingActionId: data.id
    };
}
/**
 * Generate a human-readable summary of the action
 */ function generateActionSummary(toolName, toolArgs, metadata) {
    const parts = [
        metadata.description
    ];
    // Add relevant details from toolArgs
    if (toolArgs.to || toolArgs.recipient) {
        parts.push(`Recipient: ${toolArgs.to || toolArgs.recipient}`);
    }
    if (toolArgs.subject) {
        parts.push(`Subject: "${toolArgs.subject}"`);
    }
    if (toolArgs.customerId) {
        parts.push(`Customer ID: ${toolArgs.customerId}`);
    }
    if (toolArgs.amount) {
        parts.push(`Amount: $${toolArgs.amount / 100}`);
    }
    return parts.join(" | ");
}
async function getPendingActionsForChat(companyId, chatId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("ai_pending_actions").select("*").eq("company_id", companyId).eq("chat_id", chatId).eq("status", "pending").order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error fetching pending actions:", error);
        return [];
    }
    return (data || []).map(mapDbToPendingAction);
}
async function getPendingActionsForCompany(companyId, options) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    let query = supabase.from("ai_pending_actions").select("*").eq("company_id", companyId).order("created_at", {
        ascending: false
    });
    if (options?.status) {
        query = query.eq("status", options.status);
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching pending actions:", error);
        return [];
    }
    return (data || []).map(mapDbToPendingAction);
}
async function getPendingAction(companyId, actionId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("ai_pending_actions").select("*").eq("company_id", companyId).eq("id", actionId).single();
    if (error) {
        console.error("Error fetching pending action:", error);
        return null;
    }
    return mapDbToPendingAction(data);
}
async function approveAction(actionId, approverId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.rpc("approve_pending_action", {
        p_action_id: actionId,
        p_approver_id: approverId
    });
    if (error) {
        console.error("Error approving action:", error);
        return {
            success: false,
            error: error.message
        };
    }
    const result = data;
    return result;
}
async function rejectAction(actionId, rejectorId, reason) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.rpc("reject_pending_action", {
        p_action_id: actionId,
        p_rejector_id: rejectorId,
        p_reason: reason || null
    });
    if (error) {
        console.error("Error rejecting action:", error);
        return {
            success: false,
            error: error.message
        };
    }
    const result = data;
    return result;
}
async function markActionExecuted(companyId, actionId, result) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("ai_pending_actions").update({
        status: "executed",
        executed_at: new Date().toISOString(),
        execution_result: result,
        updated_at: new Date().toISOString()
    }).eq("company_id", companyId).eq("id", actionId).eq("status", "approved"); // Can only execute approved actions
    if (error) {
        console.error("Error marking action as executed:", error);
        return false;
    }
    return true;
}
async function markActionFailed(companyId, actionId, errorMessage) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("ai_pending_actions").update({
        status: "failed",
        execution_error: errorMessage,
        updated_at: new Date().toISOString()
    }).eq("company_id", companyId).eq("id", actionId).eq("status", "approved");
    if (error) {
        console.error("Error marking action as failed:", error);
        return false;
    }
    return true;
}
async function expireOldActions(companyId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("ai_pending_actions").update({
        status: "expired",
        updated_at: new Date().toISOString()
    }).eq("company_id", companyId).eq("status", "pending").lt("expires_at", new Date().toISOString()).select("id");
    if (error) {
        console.error("Error expiring old actions:", error);
        return 0;
    }
    return data?.length || 0;
}
async function shouldInterceptTool(toolName, toolArgs, context) {
    // Check if tool is destructive
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$agent$2d$tools$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDestructiveTool"])(toolName)) {
        return {
            intercept: false
        };
    }
    const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$ai$2f$agent$2d$tools$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDestructiveToolMetadata"])(toolName);
    if (!metadata || !metadata.requiresOwnerApproval) {
        return {
            intercept: false
        };
    }
    // Check if user is already an owner (owners can self-approve in UI)
    const isOwner = await isCompanyOwner(context.companyId, context.userId);
    // Even owners need to see the dialog and explicitly approve
    // This ensures conscious decision-making for destructive actions
    // Create pending action
    const result = await createPendingAction({
        companyId: context.companyId,
        chatId: context.chatId,
        messageId: context.messageId,
        userId: context.userId,
        toolName,
        toolArgs
    });
    if (!result.success) {
        return {
            intercept: true,
            error: result.error,
            metadata
        };
    }
    return {
        intercept: true,
        pendingActionId: result.pendingActionId,
        metadata
    };
}
// ============================================================================
// Helpers
// ============================================================================
function mapDbToPendingAction(row) {
    return {
        id: row.id,
        companyId: row.company_id,
        chatId: row.chat_id,
        messageId: row.message_id,
        userId: row.user_id,
        toolName: row.tool_name,
        toolArgs: row.tool_args || {},
        actionType: row.action_type,
        affectedEntityType: row.affected_entity_type,
        affectedEntityIds: row.affected_entity_ids || [],
        affectedCount: row.affected_count || 1,
        riskLevel: row.risk_level || "medium",
        status: row.status,
        approvedBy: row.approved_by,
        approvedAt: row.approved_at,
        rejectionReason: row.rejection_reason,
        executedAt: row.executed_at,
        executionResult: row.execution_result,
        executionError: row.execution_error,
        expiresAt: row.expires_at,
        createdAt: row.created_at
    };
}
;
}),
"[project]/apps/web/src/lib/services/geocoding.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Google Geocoding API Utility
 *
 * Automatically acquires GPS coordinates (lat/lon) from addresses
 * Used during customer creation, property creation, and company onboarding
 */ __turbopack_context__.s([
    "geocodeAddressSilent",
    ()=>geocodeAddressSilent
]);
/**
 * Geocode an address to get GPS coordinates
 *
 * @param address - Street address
 * @param city - City
 * @param state - State
 * @param zipCode - ZIP code
 * @param country - Country (defaults to "USA")
 * @returns Coordinates {lat, lon} or null if geocoding fails
 */ async function geocodeAddress(address, city, state, zipCode, country = "USA") {
    try {
        // Build full address string
        const fullAddress = `${address}, ${city}, ${state} ${zipCode}, ${country}`;
        // Get API key from environment
        const apiKey = ("TURBOPACK compile-time value", "AIzaSyCVKN0pddG230vvjT0EMP9sSIR31j1q2t0");
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Call Google Geocoding API
        const encodedAddress = encodeURIComponent(fullAddress);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            return {
                success: false,
                error: `Geocoding failed with status ${response.status}`
            };
        }
        const data = await response.json();
        // Check if we got results
        if (data.status === "OK" && data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            const formattedAddress = data.results[0].formatted_address;
            return {
                success: true,
                coordinates: {
                    lat: location.lat,
                    lon: location.lng,
                    formattedAddress
                }
            };
        }
        if (data.status === "ZERO_RESULTS") {
            return {
                success: false,
                error: "Address not found"
            };
        }
        return {
            success: false,
            error: data.error_message || `Geocoding failed: ${data.status}`
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown geocoding error"
        };
    }
}
async function geocodeAddressSilent(address, city, state, zipCode, country = "USA") {
    try {
        const result = await geocodeAddress(address, city, state, zipCode, country);
        return result.success && result.coordinates ? result.coordinates : null;
    } catch (_error) {
        return null;
    }
}
}),
"[project]/apps/web/src/lib/communication/sms-service.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SMS Service
 * 
 * Handles fetching and managing SMS messages from the communications table
 * Similar structure to email-service.ts but for SMS type communications
 */ __turbopack_context__.s([
    "getCompanySms",
    ()=>getCompanySms,
    "getSmsById",
    ()=>getSmsById,
    "getSmsConversation",
    ()=>getSmsConversation,
    "markSmsAsRead",
    ()=>markSmsAsRead,
    "markSmsConversationAsRead",
    ()=>markSmsConversationAsRead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
;
async function getCompanySms(companyId, input = {}) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            sms: [],
            total: 0,
            hasMore: false
        };
    }
    const { limit = 50, offset = 0, type = "all", folder, label, search, sortBy = "created_at", sortOrder = "desc" } = input;
    // Build the query - get all SMS messages
    let query = supabase.from("communications").select(`
			id,
			from_address,
			from_name,
			to_address,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags,
			telnyx_message_id
		`, {
        count: "exact"
    }).eq("company_id", companyId).eq("type", "sms");
    // Apply folder filtering
    if (folder) {
        switch(folder){
            case "inbox":
                // Inbox: inbound, not archived, not deleted, not snoozed (or snooze expired)
                query = query.eq("direction", "inbound").eq("is_archived", false).is("deleted_at", null).or("snoozed_until.is.null,snoozed_until.lt.now()");
                break;
            case "sent":
                // Sent: outbound, not archived, not deleted
                query = query.eq("direction", "outbound").eq("is_archived", false).is("deleted_at", null);
                break;
            case "archive":
                // Archive: is_archived = true, not deleted
                query = query.eq("is_archived", true).is("deleted_at", null);
                break;
            case "trash":
            case "bin":
                // Trash: deleted_at is not null
                query = query.not("deleted_at", "is", null);
                break;
            default:
                // Custom folder or label filtering - done in memory after fetch
                // (JSONB array containment not supported by PostgREST cs operator)
                query = query.is("deleted_at", null);
                break;
        }
    } else {
        // Default: exclude deleted SMS
        query = query.is("deleted_at", null);
    }
    // Apply direction filter
    if (type === "sent") {
        query = query.eq("direction", "outbound");
    } else if (type === "received") {
        query = query.eq("direction", "inbound");
    }
    // Apply search filter
    if (search) {
        const searchLower = search.toLowerCase();
        query = query.or(`from_address.ilike.%${searchLower}%,to_address.ilike.%${searchLower}%,body.ilike.%${searchLower}%`);
    }
    // Apply sorting
    const ascending = sortOrder === "asc";
    if (sortBy === "sent_at") {
        query = query.order("sent_at", {
            ascending,
            nullsFirst: false
        });
    } else {
        query = query.order("created_at", {
            ascending
        });
    }
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) {
        console.error("Error fetching SMS messages:", error);
        return {
            sms: [],
            total: 0,
            hasMore: false
        };
    }
    let sms = (data || []).map((msg)=>({
            ...msg,
            tags: msg.tags || null,
            provider_metadata: msg.provider_metadata || null
        }));
    // Post-process custom folder/label filtering (JSONB array containment not supported by PostgREST)
    const standardFolders = [
        "inbox",
        "sent",
        "archive",
        "trash",
        "bin"
    ];
    const folderName = label || folder;
    if (folderName && !standardFolders.includes(folderName)) {
        sms = sms.filter((msg)=>{
            const msgTags = msg.tags || [];
            return Array.isArray(msgTags) && msgTags.includes(folderName);
        });
        return {
            sms,
            total: sms.length,
            hasMore: false
        };
    }
    const total = count || 0;
    const hasMore = offset + sms.length < total;
    return {
        sms,
        total,
        hasMore
    };
}
async function getSmsById(companyId, smsId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return null;
    }
    const { data, error } = await supabase.from("communications").select(`
			id,
			from_address,
			from_name,
			to_address,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags,
			telnyx_message_id
		`).eq("id", smsId).eq("company_id", companyId).eq("type", "sms").single();
    if (error || !data) {
        return null;
    }
    return {
        ...data,
        tags: data.tags || null,
        provider_metadata: data.provider_metadata || null
    };
}
async function markSmsAsRead(companyId, smsId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        console.error("❌ markSmsAsRead: Missing supabase");
        return false;
    }
    const readAt = new Date().toISOString();
    const { data, error } = await supabase.from("communications").update({
        read_at: readAt
    }).eq("id", smsId).eq("company_id", companyId).eq("type", "sms").select("id, read_at").single();
    if (error) {
        console.error("❌ markSmsAsRead error:", error);
        return false;
    }
    if (!data) {
        console.error("❌ markSmsAsRead: No data returned");
        return false;
    }
    console.log("✅ markSmsAsRead success:", {
        smsId,
        read_at: data.read_at
    });
    return true;
}
async function getSmsConversation(companyId, phoneNumber) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return [];
    }
    // Normalize phone number for matching
    const normalizePhone = (phone)=>{
        const digits = phone.replace(/[^0-9]/g, "");
        if (digits.length === 11 && digits.startsWith("1")) {
            return `+${digits}`;
        }
        if (digits.length === 10) {
            return `+1${digits}`;
        }
        return phone.startsWith("+") ? phone : `+${phone}`;
    };
    const normalizedPhone = normalizePhone(phoneNumber);
    // Fetch all messages where this phone number is either from or to
    const { data, error } = await supabase.from("communications").select(`
			id,
			from_address,
			from_name,
			to_address,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags,
			telnyx_message_id
		`).eq("company_id", companyId).eq("type", "sms").is("deleted_at", null).or(`from_address.eq.${normalizedPhone},to_address.eq.${normalizedPhone}`).order("created_at", {
        ascending: true
    });
    if (error) {
        console.error("Error fetching SMS conversation:", error);
        return [];
    }
    return (data || []).map((msg)=>({
            ...msg,
            tags: msg.tags || null,
            provider_metadata: msg.provider_metadata || null
        }));
}
async function markSmsConversationAsRead(companyId, phoneNumber) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return false;
    }
    // Normalize phone number for matching
    const normalizePhone = (phone)=>{
        const digits = phone.replace(/[^0-9]/g, "");
        if (digits.length === 11 && digits.startsWith("1")) {
            return `+${digits}`;
        }
        if (digits.length === 10) {
            return `+1${digits}`;
        }
        return phone.startsWith("+") ? phone : `+${phone}`;
    };
    const normalizedPhone = normalizePhone(phoneNumber);
    // Mark all unread inbound messages in this conversation as read
    const readAt = new Date().toISOString();
    const { data, error } = await supabase.from("communications").update({
        read_at: readAt
    }).eq("company_id", companyId).eq("type", "sms").eq("direction", "inbound").is("read_at", null).is("deleted_at", null).or(`from_address.eq.${normalizedPhone},to_address.eq.${normalizedPhone}`).select("id, read_at");
    if (error) {
        console.error("❌ markSmsConversationAsRead error:", error);
        return false;
    }
    console.log(`✅ markSmsConversationAsRead success: Marked ${data?.length || 0} messages as read`);
    return true;
}
}),
"[project]/apps/web/src/lib/validations/database-schemas.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Zod Validation Schemas for Database Tables
 *
 * Provides type-safe validation for all database operations.
 * Use these schemas to validate user input before database operations.
 *
 * Usage:
 * ```typescript
 * import { customerInsertSchema } from "@/lib/validations/database-schemas";
 *
 * const result = customerInsertSchema.safeParse(formData);
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */ __turbopack_context__.s([
    "paymentInsertSchema",
    ()=>paymentInsertSchema,
    "paymentUpdateSchema",
    ()=>paymentUpdateSchema,
    "purchaseOrderInsertSchema",
    ()=>purchaseOrderInsertSchema,
    "vendorInsertSchema",
    ()=>vendorInsertSchema,
    "vendorUpdateSchema",
    ()=>vendorUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
// ============================================================================
// CUSTOMERS
// ============================================================================
const customerInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "residential",
        "commercial",
        "industrial"
    ]).default("residential"),
    first_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "First name is required").max(100),
    last_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Last name is required").max(100),
    company_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional().nullable(),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address").optional().nullable(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    alternate_phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2).optional().nullable(),
    zip: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(10).optional().nullable(),
    latitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().nullable(),
    longitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "active",
        "inactive",
        "blocked"
    ]).default("active"),
    source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    referred_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    total_revenue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    total_jobs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    outstanding_balance: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    lifetime_value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    average_job_value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    last_job_date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    next_service_due: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    portal_enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    portal_invited_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    portal_last_login: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    billing_same_as_service: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    billing_address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    billing_city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    billing_state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(2).optional().nullable(),
    billing_zip: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(10).optional().nullable(),
    tax_exempt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    tax_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    preferred_contact_method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "email",
        "phone",
        "sms",
        "any"
    ]).optional().nullable(),
    do_not_disturb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    marketing_opt_in: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
});
const customerUpdateSchema = customerInsertSchema.partial().omit({
    company_id: true
});
const customerSelectSchema = customerInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable()
});
// ============================================================================
// COMMUNICATIONS
// ============================================================================
const communicationInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    customer_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    invoice_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "email",
        "sms",
        "phone",
        "chat",
        "note"
    ]),
    direction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "inbound",
        "outbound"
    ]),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "draft",
        "queued",
        "sending",
        "sent",
        "delivered",
        "failed",
        "read"
    ]).default("draft"),
    subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    body: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    from_email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().nullable(),
    to_email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().nullable(),
    from_phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    to_phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    cc: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email()).optional().nullable(),
    bcc: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email()).optional().nullable(),
    thread_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    parent_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    scheduled_for: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    sent_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    delivered_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    read_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    failed_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    failure_reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    retry_count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    open_count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    click_count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    call_duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    call_recording_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().nullable(),
    call_transcription: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    internal_note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    pinned: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().nullable()
});
const communicationUpdateSchema = communicationInsertSchema.partial().omit({
    company_id: true
});
const communicationSelectSchema = communicationInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable()
});
const paymentInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    customer_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    invoice_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    payment_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Payment number is required").max(50),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1, "Amount must be greater than 0"),
    currency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(3).default("USD"),
    payment_method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "cash",
        "check",
        "credit_card",
        "debit_card",
        "ach",
        "wire",
        "venmo",
        "paypal",
        "other"
    ]),
    payment_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "payment",
        "refund",
        "credit"
    ]).default("payment"),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
        "cancelled"
    ]).default("pending"),
    card_brand: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "visa",
        "mastercard",
        "amex",
        "discover"
    ]).optional().nullable(),
    card_last4: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(4).optional().nullable(),
    card_exp_month: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(12).optional().nullable(),
    card_exp_year: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(2024).optional().nullable(),
    check_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    transaction_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional().nullable(),
    processor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    processor_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    processor_transaction_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional().nullable(),
    processor_fee: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    net_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    processor_metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().nullable(),
    processor_response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().nullable(),
    refunded_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    original_payment_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    refund_reason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    is_reconciled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    reconciled_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    reconciled_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    deposit_date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    bank_account_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    processed_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    processed_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable()
});
const paymentUpdateSchema = paymentInsertSchema.partial().omit({
    company_id: true,
    payment_number: true
});
const paymentSelectSchema = paymentInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable()
});
// ============================================================================
// EQUIPMENT
// ============================================================================
const equipmentInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    customer_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    property_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    equipment_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Equipment number is required").max(50),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "hvac",
        "plumbing",
        "electrical",
        "appliance",
        "other"
    ]),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    manufacturer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    model: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    serial_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    year: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1900).max(2100).optional().nullable(),
    install_date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional().nullable(),
    size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    capacity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    fuel_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    efficiency_rating: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    warranty_expiration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    is_under_warranty: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    warranty_provider: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    warranty_notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    purchase_price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    current_value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "active",
        "inactive",
        "retired",
        "warranty",
        "needs_service"
    ]).default("active"),
    condition: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "excellent",
        "good",
        "fair",
        "poor"
    ]).optional().nullable(),
    last_service_date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    next_service_due: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    service_interval_months: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    service_plan_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().nullable()
});
const equipmentUpdateSchema = equipmentInsertSchema.partial().omit({
    company_id: true,
    equipment_number: true
});
const equipmentSelectSchema = equipmentInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable()
});
// ============================================================================
// SCHEDULES
// ============================================================================
const scheduleInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    customer_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    assigned_to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "appointment",
        "task",
        "event",
        "block",
        "callback"
    ]).default("appointment"),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Title is required").max(200),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    start_time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    end_time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(15),
    all_day: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show"
    ]).default("scheduled"),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "normal",
        "high",
        "urgent"
    ]).default("normal"),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    latitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().nullable(),
    longitude: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().nullable(),
    is_recurring: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    recurrence_rule: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().nullable(),
    parent_schedule_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(7).optional().nullable(),
    reminder_enabled: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    reminder_sent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    reminder_hours_before: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(24),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional().nullable(),
    // Dispatch and completion tracking
    dispatch_time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    ]).optional().nullable(),
    actual_start_time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    ]).optional().nullable(),
    actual_end_time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    ]).optional().nullable(),
    actual_duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable()
});
const scheduleUpdateSchema = scheduleInsertSchema.partial().omit({
    company_id: true
});
const scheduleSelectSchema = scheduleInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable()
});
// ============================================================================
// TAGS
// ============================================================================
const tagInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Tag name is required").max(50),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(60),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "customer",
        "job",
        "equipment",
        "communication",
        "general"
    ]).optional().nullable(),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional().nullable(),
    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    usage_count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    is_system: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    is_active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true)
});
const tagUpdateSchema = tagInsertSchema.partial().omit({
    company_id: true,
    slug: true
});
const tagSelectSchema = tagInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()
});
// ============================================================================
// ATTACHMENTS
// ============================================================================
const attachmentInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    entity_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "job",
        "customer",
        "invoice",
        "equipment",
        "communication",
        "estimate",
        "other"
    ]),
    entity_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    file_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "File name is required").max(255),
    file_size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1, "File size must be greater than 0"),
    mime_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "MIME type is required").max(100),
    storage_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url("Invalid storage URL"),
    storage_path: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    bucket: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    is_image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    is_document: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    is_public: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    thumbnail_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().nullable(),
    width: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    height: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    alt_text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional().nullable(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    uploaded_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    uploaded_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable()
});
const attachmentUpdateSchema = attachmentInsertSchema.partial().omit({
    company_id: true,
    entity_type: true,
    entity_id: true
});
const attachmentSelectSchema = attachmentInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().nullable()
});
// ============================================================================
// JOB TIME ENTRIES
// ============================================================================
const jobTimeEntryInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    clock_in: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    clock_out: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    break_minutes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).max(1439).default(0),
    clock_in_location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        lng: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        accuracy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional().nullable(),
    clock_out_location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        lng: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        accuracy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional().nullable(),
    gps_verified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    entry_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "manual",
        "auto",
        "gps"
    ]).default("manual"),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    is_overtime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    is_billable: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    hourly_rate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional().nullable(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable()
});
const jobTimeEntryUpdateSchema = jobTimeEntryInsertSchema.partial().omit({
    job_id: true,
    company_id: true,
    user_id: true
});
const jobTimeEntrySelectSchema = jobTimeEntryInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    total_hours: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().nullable(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()
});
// ============================================================================
// JOB PHOTOS
// ============================================================================
const jobPhotoInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    uploaded_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    storage_path: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Storage path is required"),
    thumbnail_path: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    file_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "File name is required").max(255),
    file_size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(52_428_800),
    mime_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "before",
        "during",
        "after",
        "issue",
        "equipment",
        "completion",
        "other"
    ]),
    subcategory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional().nullable(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    is_customer_visible: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    is_required_photo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    photo_location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        lng: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        accuracy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional().nullable(),
    taken_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    device_info: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable(),
    exif_data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable(),
    annotations: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional().nullable(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    display_order: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().default(0),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable()
});
const jobPhotoUpdateSchema = jobPhotoInsertSchema.partial().omit({
    job_id: true,
    company_id: true,
    uploaded_by: true
});
const jobPhotoSelectSchema = jobPhotoInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()
});
// ============================================================================
// JOB WORKFLOW STAGES
// ============================================================================
const jobWorkflowStageInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    stage_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Stage name is required").max(100),
    stage_key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Stage key is required").max(100),
    display_order: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).default(0),
    stage_color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    stage_icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    is_start_stage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    is_end_stage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    requires_approval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    approval_roles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional().nullable(),
    required_fields: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    required_photos_count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).default(0),
    required_time_entry: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    auto_send_email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    email_template_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    auto_send_sms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    sms_template_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    auto_create_invoice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    allowed_next_stages: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    industry_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    is_active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(true),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable()
});
const jobWorkflowStageUpdateSchema = jobWorkflowStageInsertSchema.partial().omit({
    company_id: true
});
const jobWorkflowStageSelectSchema = jobWorkflowStageInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()
});
// ============================================================================
// JOB SIGNATURES
// ============================================================================
const jobSignatureInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    signature_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "customer",
        "technician",
        "inspector",
        "supervisor",
        "other"
    ]),
    signer_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Signer name is required").max(200),
    signer_email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().nullable(),
    signer_phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    signer_role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    signature_data_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Signature data is required"),
    signature_hash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    signed_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().default(()=>new Date()),
    signed_location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        lat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        lng: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        accuracy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional().nullable(),
    ip_address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(45).optional().nullable(),
    user_agent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    device_info: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable(),
    document_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "job_completion",
        "estimate",
        "change_order",
        "work_authorization",
        "inspection",
        "other"
    ]),
    document_content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable(),
    agreement_text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    is_verified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false),
    verified_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    verified_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable()
});
const jobSignatureUpdateSchema = jobSignatureInsertSchema.partial().omit({
    job_id: true,
    company_id: true
});
const jobSignatureSelectSchema = jobSignatureInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date()
});
// ============================================================================
// ENHANCED JOBS SCHEMA
// ============================================================================
/**
 * Job Insert Schema - REFACTORED
 *
 * After domain table refactoring, this schema only includes core job fields.
 * Domain-specific fields have been moved to separate tables and schemas:
 * - job_financial - Financial data
 * - job_workflow - Workflow/template data
 * - job_time_tracking - Time tracking data
 * - job_customer_approval - Customer signatures/approval
 * - job_equipment_service - Equipment service tracking
 * - job_dispatch - Dispatch/routing data
 * - job_quality - Quality metrics
 * - job_safety - Safety/compliance data
 * - job_ai_enrichment - AI analysis
 * - job_multi_entity - Multi-customer/property support
 *
 * See /src/lib/validations/job-domain-schemas.ts for domain schemas
 */ const jobInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    // Core identity
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    job_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Job number is required").max(50),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Title is required").max(200),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    // Classification
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "quoted",
        "scheduled",
        "in_progress",
        "on_hold",
        "completed",
        "cancelled",
        "archived"
    ]).default("quoted"),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "medium",
        "high",
        "urgent"
    ]).default("medium"),
    job_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    service_type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    // Primary relationships
    property_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    customer_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    assigned_to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    // Scheduling (core scheduling only - actual times moved to job_time_tracking)
    scheduled_start: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    scheduled_end: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    // Flexible data
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    metadata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional().nullable()
});
const jobUpdateSchema = jobInsertSchema.partial().omit({
    company_id: true
});
const jobSelectSchema = jobInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    archived_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().nullable(),
    search_vector: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().nullable()
});
const vendorInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Vendor name is required").max(200),
    display_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Display name is required").max(200),
    vendor_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Vendor number is required").max(50),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address").optional().nullable(),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    secondary_phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    website: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url("Invalid URL").optional().nullable(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    address2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    city: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional().nullable(),
    zip_code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    country: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).default("USA"),
    tax_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).optional().nullable(),
    payment_terms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "net_15",
        "net_30",
        "net_60",
        "due_on_receipt",
        "custom"
    ]).default("net_30"),
    credit_limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).default(0),
    preferred_payment_method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "check",
        "ach",
        "credit_card",
        "wire"
    ]).optional().nullable(),
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "supplier",
        "distributor",
        "manufacturer",
        "service_provider",
        "other"
    ]).optional().nullable(),
    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "active",
        "inactive"
    ]).default("active"),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    internal_notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    custom_fields: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional().nullable()
});
const vendorUpdateSchema = vendorInsertSchema.partial().omit({
    company_id: true
});
const vendorSelectSchema = vendorInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    deleted_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    deleted_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable()
});
// ============================================================================
// PURCHASE ORDERS
// ============================================================================
const purchaseOrderLineItemSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Description is required"),
    quantity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive("Quantity must be positive"),
    unit_price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative("Unit price must be non-negative"),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative("Total must be non-negative")
});
const purchaseOrderInsertSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    company_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    job_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    estimate_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    invoice_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    requested_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    approved_by: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    vendor_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid().optional().nullable(),
    vendor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Vendor name is required").max(200),
    vendor_email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address").optional().nullable(),
    vendor_phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(20).optional().nullable(),
    po_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "PO number is required").max(100),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Title is required").max(200),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "draft",
        "pending_approval",
        "approved",
        "ordered",
        "partially_received",
        "received",
        "cancelled"
    ]).default("draft"),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "low",
        "normal",
        "high",
        "urgent"
    ]).default("normal"),
    line_items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(purchaseOrderLineItemSchema).min(1, "At least one line item is required"),
    subtotal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().default(0),
    tax_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().default(0),
    shipping_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().default(0),
    total_amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().default(0),
    expected_delivery: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    actual_delivery: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    delivery_address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional().nullable(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    internal_notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().nullable(),
    auto_generated: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false)
});
const purchaseOrderUpdateSchema = purchaseOrderInsertSchema.partial().omit({
    company_id: true
});
const purchaseOrderSelectSchema = purchaseOrderInsertSchema.extend({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    updated_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date(),
    approved_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    ordered_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable(),
    received_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].date().optional().nullable()
});
}),
"[project]/apps/web/src/lib/notifications/triggers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Notification Triggers
 *
 * Helper functions to create notifications for system events.
 * These functions check user preferences before creating notifications
 * and provide a consistent interface for triggering notifications across the app.
 *
 * Usage:
 * ```typescript
 * import { notifyJobCreated } from "@/lib/notifications/triggers";
 *
 * // In your server action:
 * await notifyJobCreated({
 *   userId: technician.id,
 *   companyId: job.company_id,
 *   jobId: job.id,
 *   jobTitle: job.title,
 *   address: job.property.address,
 *   priority: "urgent",
 * });
 * ```
 */ __turbopack_context__.s([
    "notifyJobCreated",
    ()=>notifyJobCreated,
    "notifyPaymentReceived",
    ()=>notifyPaymentReceived
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
;
// =====================================================================================
// Helper Functions
// =====================================================================================
/**
 * Create a notification in the database
 * Internal helper function used by all trigger functions
 */ async function createNotification(type, userId, companyId, title, message, priority = "medium", actionUrl, actionLabel, metadata) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return {
                success: false,
                error: "Supabase client not configured"
            };
        }
        const { data, error } = await supabase.from("notifications").insert({
            user_id: userId,
            company_id: companyId,
            type,
            priority,
            title,
            message,
            action_url: actionUrl,
            action_label: actionLabel,
            metadata: metadata || {}
        }).select().single();
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            data
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
/**
 * Check if user has notifications enabled for a specific event type.
 * Queries the notification_preferences table for user's preference.
 * Defaults to enabled if no preference is set.
 */ async function isNotificationEnabled(userId, companyId, eventType) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        if (!supabase) {
            return true; // Default to enabled if Supabase not configured
        }
        const { data, error } = await supabase.from("notification_preferences").select("enabled").eq("user_id", userId).eq("company_id", companyId).eq("channel", "in_app").eq("event_type", eventType).single();
        if (error || !data) {
            // If no preference set, default to enabled
            return true;
        }
        return data.enabled;
    } catch  {
        // Default to enabled on error
        return true;
    }
}
async function notifyJobCreated(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "job_created");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("job", params.userId, params.companyId, "New Job Assignment", `Job "${params.jobTitle}" has been assigned to you at ${params.address}`, params.priority || "medium", params.actionUrl || "/dashboard/work", "View Job", {
        job_id: params.jobId,
        address: params.address
    });
}
/**
 * Notify user when a job is updated
 */ async function notifyJobUpdated(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "job_updated");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("job", params.userId, params.companyId, "Job Updated", `Job "${params.jobTitle}" has been updated`, params.priority || "low", params.actionUrl || "/dashboard/work", "View Job", {
        job_id: params.jobId
    });
}
/**
 * Notify user when a job is completed
 */ async function notifyJobCompleted(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "job_completed");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("job", params.userId, params.companyId, "Job Completed", `Job "${params.jobTitle}" at ${params.address} has been completed`, params.priority || "low", params.actionUrl || "/dashboard/work", "View Job", {
        job_id: params.jobId,
        status: "completed"
    });
}
async function notifyPaymentReceived(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "payment_received");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("payment", params.userId, params.companyId, "Payment Received", `Payment of $${params.amount.toFixed(2)} received from ${params.customerName}`, params.priority || "high", params.actionUrl || "/dashboard/finance/invoices", "View Invoice", {
        amount: params.amount,
        customer: params.customerName,
        invoice_id: params.invoiceId
    });
}
/**
 * Notify user when an invoice payment is due soon
 */ async function notifyPaymentDue(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "payment_due");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("payment", params.userId, params.companyId, "Payment Reminder", `Invoice payment of $${params.amount.toFixed(2)} from ${params.customerName} is due in ${params.daysUntilDue} days`, params.priority || "medium", params.actionUrl || "/dashboard/finance/invoices", "View Invoice", {
        amount: params.amount,
        customer: params.customerName,
        invoice_id: params.invoiceId,
        days_until_due: params.daysUntilDue
    });
}
// =====================================================================================
// Message/Communication Notifications
// =====================================================================================
/**
 * Notify user when they receive a new message
 */ async function notifyNewMessage(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "new_message");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("message", params.userId, params.companyId, `New Message from ${params.from}`, params.messagePreview, params.priority || "medium", params.actionUrl || "/dashboard/communication", "Reply", {
        from: params.from,
        message_id: params.messageId
    });
}
/**
 * Notify user when they miss a call
 */ async function notifyMissedCall(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "missed_call");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("message", params.userId, params.companyId, "Missed Call", `You missed a call from ${params.from}`, params.priority || "high", params.actionUrl || "/dashboard/communication", "View Details", {
        from: params.from,
        call_id: params.messageId
    });
}
// =====================================================================================
// Team Notifications
// =====================================================================================
/**
 * Notify user when a new team member joins
 */ async function notifyTeamMemberAdded(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "team_member_added");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("team", params.userId, params.companyId, "New Team Member", `${params.memberName} has joined your team${params.role ? ` as a ${params.role}` : ""}`, params.priority || "low", params.actionUrl || "/dashboard/settings/team", "View Team", {
        member_name: params.memberName,
        role: params.role
    });
}
/**
 * Notify user when they're assigned to a team
 */ async function notifyTeamAssignment(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "team_assignment");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("team", params.userId, params.companyId, "Team Assignment", `You've been assigned to work with ${params.memberName}`, params.priority || "medium", params.actionUrl || "/dashboard/settings/team", "View Details", {
        member_name: params.memberName
    });
}
// =====================================================================================
// Alert Notifications
// =====================================================================================
/**
 * Notify user with a custom alert
 */ async function notifyAlert(params) {
    const enabled = await isNotificationEnabled(params.userId, params.companyId, "system_alert");
    if (!enabled) {
        return {
            success: true,
            skipped: true
        };
    }
    return createNotification("alert", params.userId, params.companyId, params.alertTitle, params.alertMessage, params.priority || "medium", params.actionUrl, "View Details");
}
// =====================================================================================
// System Notifications
// =====================================================================================
/**
 * Notify user with a system message
 */ async function notifySystem(params) {
    return createNotification("system", params.userId, params.companyId, params.systemTitle, params.systemMessage, params.priority || "low", params.actionUrl, "View Details");
}
}),
"[project]/apps/web/src/lib/validations/job-status-transitions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Job Status Transition Validation
 *
 * Enforces business rules for job status changes:
 * - Valid transition paths (workflow validation)
 * - Required fields per status
 * - Blocking conditions
 *
 * Used by: updateJobStatus, updateJobData actions
 */ __turbopack_context__.s([
    "getAllowedNextStatuses",
    ()=>getAllowedNextStatuses,
    "getRecommendedNextStatus",
    ()=>getRecommendedNextStatus,
    "getStatusLabel",
    ()=>getStatusLabel,
    "getStatusVariant",
    ()=>getStatusVariant,
    "validateStatusTransition",
    ()=>validateStatusTransition
]);
/**
 * Valid status transition paths
 * Key = current status, Value = allowed next statuses
 */ const VALID_TRANSITIONS = {
    quoted: [
        "scheduled",
        "cancelled"
    ],
    scheduled: [
        "in_progress",
        "on_hold",
        "cancelled"
    ],
    in_progress: [
        "on_hold",
        "completed",
        "cancelled"
    ],
    on_hold: [
        "scheduled",
        "in_progress",
        "cancelled"
    ],
    completed: [
        "invoiced"
    ],
    cancelled: [
        "quoted",
        "scheduled"
    ],
    invoiced: [
        "paid"
    ],
    paid: []
};
/**
 * Required fields for each status
 */ const REQUIRED_FIELDS = {
    quoted: [
        "customer_id"
    ],
    scheduled: [
        "customer_id",
        "scheduled_start",
        "scheduled_end"
    ],
    in_progress: [
        "customer_id",
        "scheduled_start",
        "assigned_to"
    ],
    on_hold: [
        "customer_id"
    ],
    completed: [
        "customer_id",
        "scheduled_start"
    ],
    cancelled: [],
    invoiced: [
        "customer_id",
        "total_amount"
    ],
    paid: [
        "customer_id",
        "total_amount"
    ]
};
/**
 * Field labels for user-friendly error messages
 */ const FIELD_LABELS = {
    customer_id: "Customer",
    scheduled_start: "Start Date",
    scheduled_end: "End Date",
    assigned_to: "Assigned Team Member",
    property_id: "Property",
    total_amount: "Total Amount"
};
function validateStatusTransition(context) {
    const { currentStatus, newStatus, job } = context;
    // Same status - always allowed (no-op)
    if (currentStatus === newStatus) {
        return {
            allowed: true
        };
    }
    // Check if transition is in allowed paths
    const allowedNextStatuses = VALID_TRANSITIONS[currentStatus];
    if (!allowedNextStatuses.includes(newStatus)) {
        return {
            allowed: false,
            reason: `Cannot transition from "${currentStatus}" to "${newStatus}". Valid next statuses: ${allowedNextStatuses.join(", ")}`
        };
    }
    // Check required fields for target status
    const requiredFields = REQUIRED_FIELDS[newStatus];
    const missingFields = [];
    for (const field of requiredFields){
        const value = job[field];
        if (value === null || value === undefined || value === "") {
            missingFields.push(FIELD_LABELS[field] || field);
        }
    }
    if (missingFields.length > 0) {
        return {
            allowed: false,
            reason: `Cannot transition to "${newStatus}" - missing required fields`,
            requiredFields: missingFields
        };
    }
    // Business rule validations
    const warnings = [];
    // Scheduled → In Progress: Should have team assignment
    if (currentStatus === "scheduled" && newStatus === "in_progress") {
        if (!job.teamAssignments || job.teamAssignments.length === 0) {
            warnings.push("No team members assigned to this job");
        }
    }
    // Completed → Invoiced: Should have estimates or total amount
    if (currentStatus === "completed" && newStatus === "invoiced") {
        const hasEstimates = job.estimates && job.estimates.length > 0;
        const hasTotalAmount = job.total_amount && job.total_amount > 0;
        if (!hasEstimates && !hasTotalAmount) {
            return {
                allowed: false,
                reason: "Cannot create invoice - no estimates or total amount defined"
            };
        }
    }
    // Invoiced → Paid: Should have invoices
    if (currentStatus === "invoiced" && newStatus === "paid") {
        if (!job.invoices || job.invoices.length === 0) {
            return {
                allowed: false,
                reason: "Cannot mark as paid - no invoices found"
            };
        }
        // Check if all invoices are paid
        const unpaidInvoices = job.invoices.filter((inv)=>inv.status !== "paid" && inv.status !== "cancelled");
        if (unpaidInvoices.length > 0) {
            return {
                allowed: false,
                reason: `Cannot mark as paid - ${unpaidInvoices.length} invoice(s) still unpaid`
            };
        }
    }
    // Paid → any: Should not be allowed (terminal state)
    if (currentStatus === "paid") {
        return {
            allowed: false,
            reason: "Cannot change status of paid jobs. Create a new job if needed."
        };
    }
    return {
        allowed: true,
        warnings: warnings.length > 0 ? warnings : undefined
    };
}
function getAllowedNextStatuses(currentStatus) {
    return VALID_TRANSITIONS[currentStatus] || [];
}
/**
 * Get required fields for a status
 */ function getRequiredFieldsForStatus(status) {
    return REQUIRED_FIELDS[status] || [];
}
/**
 * Check if a specific transition is valid (simple check without context)
 */ function isTransitionAllowed(from, to) {
    if (from === to) return true;
    return VALID_TRANSITIONS[from]?.includes(to) || false;
}
function getStatusLabel(status) {
    const labels = {
        quoted: "Quoted",
        scheduled: "Scheduled",
        in_progress: "In Progress",
        on_hold: "On Hold",
        completed: "Completed",
        cancelled: "Cancelled",
        invoiced: "Invoiced",
        paid: "Paid"
    };
    return labels[status] || status;
}
function getStatusVariant(status) {
    const variants = {
        quoted: "outline",
        scheduled: "secondary",
        in_progress: "default",
        on_hold: "secondary",
        completed: "default",
        cancelled: "destructive",
        invoiced: "secondary",
        paid: "default"
    };
    return variants[status] || "default";
}
function getRecommendedNextStatus(currentStatus) {
    const recommendations = {
        quoted: "scheduled",
        scheduled: "in_progress",
        in_progress: "completed",
        on_hold: "in_progress",
        completed: "invoiced",
        cancelled: null,
        invoiced: "paid",
        paid: null
    };
    return recommendations[currentStatus] || null;
}
}),
];

//# sourceMappingURL=apps_web_src_lib_93277504._.js.map