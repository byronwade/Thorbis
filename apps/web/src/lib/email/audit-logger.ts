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
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { EmailCategory } from "./email-permissions";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Audit event types
 */
export type AuditEventType =
	// Gmail OAuth events
	| "gmail_connected"
	| "gmail_disconnected"
	| "gmail_token_refreshed"
	| "gmail_token_refresh_failed"
	| "gmail_token_revoked"
	// Permission events
	| "permission_granted"
	| "permission_revoked"
	| "permission_updated"
	| "permission_check_failed"
	// Sync events
	| "sync_started"
	| "sync_completed"
	| "sync_failed"
	| "sync_rate_limited"
	// Email access events (optional)
	| "email_accessed"
	| "email_sent"
	| "email_assigned"
	// Security events
	| "unauthorized_access_attempt"
	| "permission_escalation_attempt"
	| "invalid_oauth_state"
	// System events
	| "token_cleanup_executed"
	| "rate_limit_exceeded";

/**
 * Audit event severity levels
 */
export type AuditSeverity = "info" | "warning" | "error" | "critical";

/**
 * Audit event metadata
 */
export interface AuditEventMetadata {
	// Common fields
	teamMemberId?: string;
	companyId?: string;
	userId?: string; // auth.uid
	userName?: string;

	// Gmail fields
	gmailEmail?: string;
	gmailMessageId?: string;
	syncMessageCount?: number;

	// Permission fields
	category?: EmailCategory;
	grantedBy?: string;
	grantedTo?: string;
	canRead?: boolean;
	canSend?: boolean;
	canAssign?: boolean;

	// Email fields
	communicationId?: string;
	emailSubject?: string;
	fromAddress?: string;
	toAddress?: string;

	// Error fields
	error?: string;
	errorCode?: string;
	stackTrace?: string;

	// Rate limiting
	retryAfter?: number;
	requestsPerMinute?: number;

	// Additional context
	ipAddress?: string;
	userAgent?: string;
	[key: string]: any;
}

/**
 * Audit event record
 */
export interface AuditEvent {
	id: string;
	eventType: AuditEventType;
	severity: AuditSeverity;
	message: string;
	metadata: AuditEventMetadata;
	createdAt: string;
}

// =============================================================================
// LOGGING FUNCTIONS
// =============================================================================

/**
 * Log an audit event
 *
 * @param eventType - Type of event
 * @param metadata - Event metadata
 * @param severity - Event severity (default: info)
 * @param message - Optional custom message
 *
 * @example
 * await logAuditEvent('gmail_connected', {
 *   teamMemberId: 'xxx',
 *   gmailEmail: 'user@gmail.com'
 * });
 */
export async function logAuditEvent(
	eventType: AuditEventType,
	metadata: AuditEventMetadata = {},
	severity: AuditSeverity = "info",
	message?: string,
): Promise<{ success: boolean; error?: string }> {
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
			metadata,
		};

		// Console output with color coding
		const prefix = `[Email Audit]`;
		const severityEmoji = {
			info: "ℹ️",
			warning: "⚠️",
			error: "❌",
			critical: "🚨",
		}[severity];

		console.log(
			`${prefix} ${severityEmoji} [${severity.toUpperCase()}] ${logEntry.message}`,
			metadata,
		);

		// Store in database
		try {
			const supabase = await createServiceSupabaseClient();
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
					user_agent: metadata.userAgent || null,
				});
			}
		} catch (dbError) {
			// Don't fail the audit log if database write fails - console log is still captured
			console.error("[Email Audit] Failed to store in database:", dbError);
		}

		return { success: true };
	} catch (error) {
		console.error("[Email Audit] Failed to log event:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Generate default message for event type
 */
function generateDefaultMessage(
	eventType: AuditEventType,
	metadata: AuditEventMetadata,
): string {
	const name = metadata.userName || metadata.teamMemberId || "User";

	switch (eventType) {
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

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Log Gmail connection
 */
export async function logGmailConnected(
	teamMemberId: string,
	userName: string,
	gmailEmail: string,
	companyId: string,
): Promise<void> {
	await logAuditEvent(
		"gmail_connected",
		{ teamMemberId, userName, gmailEmail, companyId },
		"info",
	);
}

/**
 * Log Gmail disconnection
 */
export async function logGmailDisconnected(
	teamMemberId: string,
	userName: string,
	gmailEmail: string,
	companyId: string,
): Promise<void> {
	await logAuditEvent(
		"gmail_disconnected",
		{ teamMemberId, userName, gmailEmail, companyId },
		"info",
	);
}

/**
 * Log token refresh failure
 */
export async function logTokenRefreshFailed(
	teamMemberId: string,
	gmailEmail: string,
	error: string,
): Promise<void> {
	await logAuditEvent(
		"gmail_token_refresh_failed",
		{ teamMemberId, gmailEmail, error },
		"warning",
	);
}

/**
 * Log permission grant
 */
export async function logPermissionGranted(
	grantedBy: string,
	grantedByName: string,
	grantedTo: string,
	grantedToName: string,
	category: EmailCategory,
	companyId: string,
): Promise<void> {
	await logAuditEvent(
		"permission_granted",
		{
			grantedBy,
			userName: grantedByName,
			grantedTo,
			category,
			companyId,
		},
		"info",
	);
}

/**
 * Log permission revocation
 */
export async function logPermissionRevoked(
	revokedBy: string,
	revokedByName: string,
	revokedFrom: string,
	revokedFromName: string,
	category: EmailCategory,
	companyId: string,
): Promise<void> {
	await logAuditEvent(
		"permission_revoked",
		{
			grantedBy: revokedBy,
			userName: revokedByName,
			grantedTo: revokedFrom,
			category,
			companyId,
		},
		"info",
	);
}

/**
 * Log sync failure
 */
export async function logSyncFailed(
	teamMemberId: string,
	userName: string,
	gmailEmail: string,
	error: string,
): Promise<void> {
	await logAuditEvent(
		"sync_failed",
		{ teamMemberId, userName, gmailEmail, error },
		"error",
	);
}

/**
 * Log unauthorized access attempt
 */
export async function logUnauthorizedAccess(
	userId: string,
	userName: string,
	resource: string,
	error: string,
): Promise<void> {
	await logAuditEvent(
		"unauthorized_access_attempt",
		{ userId, userName, error, communicationId: resource },
		"warning",
	);
}

/**
 * Log rate limit exceeded
 */
export async function logRateLimitExceeded(
	userId: string,
	userName: string,
	requestsPerMinute: number,
	retryAfter: number,
): Promise<void> {
	await logAuditEvent(
		"rate_limit_exceeded",
		{ userId, userName, requestsPerMinute, retryAfter },
		"warning",
	);
}

// =============================================================================
// QUERY FUNCTIONS
// =============================================================================

/**
 * Get audit events for a team member
 *
 * @param teamMemberId - Team member ID
 * @param limit - Max events to return
 * @returns List of audit events
 */
export async function getAuditEventsForUser(
	teamMemberId: string,
	limit: number = 100,
): Promise<AuditEvent[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("email_audit_log")
			.select("id, event_type, severity, message, metadata, created_at")
			.eq("team_member_id", teamMemberId)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("[Email Audit] Failed to query events for user:", error);
			return [];
		}

		return (data || []).map((row) => ({
			id: row.id,
			eventType: row.event_type as AuditEventType,
			severity: row.severity as AuditSeverity,
			message: row.message,
			metadata: row.metadata || {},
			createdAt: row.created_at,
		}));
	} catch (error) {
		console.error("[Email Audit] Failed to query events for user:", error);
		return [];
	}
}

/**
 * Get audit events for a company
 *
 * @param companyId - Company ID
 * @param limit - Max events to return
 * @returns List of audit events
 */
export async function getAuditEventsForCompany(
	companyId: string,
	limit: number = 100,
): Promise<AuditEvent[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("email_audit_log")
			.select("id, event_type, severity, message, metadata, created_at")
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("[Email Audit] Failed to query events for company:", error);
			return [];
		}

		return (data || []).map((row) => ({
			id: row.id,
			eventType: row.event_type as AuditEventType,
			severity: row.severity as AuditSeverity,
			message: row.message,
			metadata: row.metadata || {},
			createdAt: row.created_at,
		}));
	} catch (error) {
		console.error("[Email Audit] Failed to query events for company:", error);
		return [];
	}
}

/**
 * Get critical security events
 *
 * @param limit - Max events to return
 * @returns List of critical events
 */
export async function getCriticalSecurityEvents(
	limit: number = 50,
): Promise<AuditEvent[]> {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("email_audit_log")
			.select("id, event_type, severity, message, metadata, created_at")
			.in("severity", ["error", "critical"])
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("[Email Audit] Failed to query critical events:", error);
			return [];
		}

		return (data || []).map((row) => ({
			id: row.id,
			eventType: row.event_type as AuditEventType,
			severity: row.severity as AuditSeverity,
			message: row.message,
			metadata: row.metadata || {},
			createdAt: row.created_at,
		}));
	} catch (error) {
		console.error("[Email Audit] Failed to query critical events:", error);
		return [];
	}
}
