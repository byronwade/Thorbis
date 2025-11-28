/**
 * Admin Audit Logging
 *
 * Logs all authentication and security events for the admin dashboard.
 * Critical for compliance, security monitoring, and incident response.
 *
 * Events logged:
 * - Login attempts (success/failure)
 * - Logout events
 * - Session refreshes
 * - Unauthorized access attempts
 * - Rate limit violations
 * - Domain validation failures
 */

export type AuditEventType =
	| "LOGIN_ATTEMPT"
	| "LOGIN_SUCCESS"
	| "LOGIN_FAILURE"
	| "LOGOUT"
	| "SESSION_REFRESH"
	| "UNAUTHORIZED_ACCESS"
	| "RATE_LIMIT_EXCEEDED"
	| "INVALID_DOMAIN"
	| "SUSPICIOUS_ACTIVITY";

export type AuditEventSeverity = "INFO" | "WARN" | "ERROR" | "CRITICAL";

export interface AuditEvent {
	timestamp: string;
	eventType: AuditEventType;
	severity: AuditEventSeverity;
	email?: string;
	ip?: string;
	userAgent?: string;
	details?: Record<string, unknown>;
	success: boolean;
}

/**
 * Determine severity based on event type
 */
function getSeverity(eventType: AuditEventType, success: boolean): AuditEventSeverity {
	switch (eventType) {
		case "LOGIN_SUCCESS":
		case "LOGOUT":
		case "SESSION_REFRESH":
			return "INFO";

		case "LOGIN_ATTEMPT":
			return "INFO";

		case "LOGIN_FAILURE":
			return "WARN";

		case "RATE_LIMIT_EXCEEDED":
		case "INVALID_DOMAIN":
			return "WARN";

		case "UNAUTHORIZED_ACCESS":
			return "ERROR";

		case "SUSPICIOUS_ACTIVITY":
			return "CRITICAL";

		default:
			return success ? "INFO" : "WARN";
	}
}

/**
 * Log Admin Auth Event
 *
 * Logs authentication events with structured data.
 * Persists to both console and the admin_audit_logs database table.
 *
 * @param eventType - Type of authentication event
 * @param options - Event details
 */
async function logAdminAuthEvent(
	eventType: AuditEventType,
	options: {
		email?: string;
		ip?: string;
		userAgent?: string;
		success: boolean;
		details?: Record<string, unknown>;
	},
): Promise<void> {
	const event: AuditEvent = {
		timestamp: new Date().toISOString(),
		eventType,
		severity: getSeverity(eventType, options.success),
		email: options.email ? maskEmail(options.email) : undefined,
		ip: options.ip,
		userAgent: options.userAgent,
		details: options.details,
		success: options.success,
	};

	// Log to console in structured format
	const logMessage = formatLogMessage(event);

	switch (event.severity) {
		case "CRITICAL":
		case "ERROR":
			console.error(logMessage);
			break;
		case "WARN":
			console.warn(logMessage);
			break;
		default:
			console.log(logMessage);
	}

	// Persist to database
	try {
		const { createClient } = await import("@/lib/supabase/server");
		const supabase = await createClient();

		await supabase.from("admin_audit_logs").insert({
			action: eventType,
			admin_email: options.email,
			ip_address: options.ip,
			user_agent: options.userAgent,
			details: {
				...options.details,
				success: options.success,
				severity: event.severity,
			},
		});
	} catch (error) {
		// Don't fail the main operation if audit logging fails
		console.error("[AUDIT_LOG] Failed to persist audit log:", error);
	}
}

/**
 * Format log message for structured logging
 */
function formatLogMessage(event: AuditEvent): string {
	const base = `[ADMIN_AUTH] [${event.severity}] ${event.eventType}`;
	const details = [
		event.email && `email=${event.email}`,
		event.ip && `ip=${event.ip}`,
		`success=${event.success}`,
		event.details && `details=${JSON.stringify(event.details)}`,
	]
		.filter(Boolean)
		.join(" ");

	return `${base} ${details}`;
}

/**
 * Mask email for privacy in logs
 * user@domain.com -> u***@domain.com
 */
function maskEmail(email: string): string {
	const [local, domain] = email.split("@");
	if (!local || !domain) return "***@***";

	if (local.length <= 2) {
		return `${local[0]}***@${domain}`;
	}

	return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Log successful admin login
 */
export async function logAdminLoginSuccess(
	email: string,
	ip: string,
	userAgent?: string,
): Promise<void> {
	await logAdminAuthEvent("LOGIN_SUCCESS", {
		email,
		ip,
		userAgent,
		success: true,
	});
}

/**
 * Log failed admin login attempt
 */
export async function logAdminLoginFailure(
	email: string,
	ip: string,
	reason: string,
	userAgent?: string,
): Promise<void> {
	await logAdminAuthEvent("LOGIN_FAILURE", {
		email,
		ip,
		userAgent,
		success: false,
		details: { reason },
	});
}

/**
 * Log rate limit exceeded
 */
export async function logRateLimitExceeded(
	email: string,
	ip: string,
	lockedUntil?: number,
): Promise<void> {
	await logAdminAuthEvent("RATE_LIMIT_EXCEEDED", {
		email,
		ip,
		success: false,
		details: {
			lockedUntil: lockedUntil ? new Date(lockedUntil).toISOString() : undefined,
		},
	});
}

/**
 * Log invalid domain attempt
 */
async function logInvalidDomainAttempt(
	email: string,
	ip: string,
): Promise<void> {
	await logAdminAuthEvent("INVALID_DOMAIN", {
		email,
		ip,
		success: false,
		details: {
			domain: email.split("@")[1]?.toLowerCase(),
			message: "Non-admin domain attempted admin login",
		},
	});
}

/**
 * Log unauthorized access attempt
 */
async function logUnauthorizedAccess(
	email: string | undefined,
	ip: string,
	path: string,
): Promise<void> {
	await logAdminAuthEvent("UNAUTHORIZED_ACCESS", {
		email,
		ip,
		success: false,
		details: { path },
	});
}
