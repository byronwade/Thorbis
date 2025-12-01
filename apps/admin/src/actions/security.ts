"use server";

/**
 * Security Management Actions
 *
 * Server actions for monitoring security events and incidents.
 */

import { createAdminClient } from "@/lib/supabase/admin-client";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface SecurityEvent {
	id: string;
	type: "failed_login" | "suspicious_activity" | "permission_change" | "api_key_usage" | "other";
	severity: "low" | "medium" | "high" | "critical";
	description: string;
	admin_email?: string;
	company_id?: string;
	company_name?: string;
	ip_address?: string;
	user_agent?: string;
	metadata?: Record<string, unknown>;
	created_at: string;
}

export interface SecurityStats {
	total_events: number;
	failed_logins: number;
	suspicious_activity: number;
	permission_changes: number;
	api_key_anomalies: number;
	critical_incidents: number;
	recent_activity_24h: number;
}

/**
 * Get security events
 */
export async function getSecurityEvents(options?: {
	limit?: number;
	severity?: "low" | "medium" | "high" | "critical";
	type?: string;
	start_date?: string;
	end_date?: string;
}) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();
		const webDb = createWebClient();

		const limit = options?.limit || 50;

		const events: SecurityEvent[] = [];

		// Get failed login attempts from admin_sessions
		const { data: failedLogins } = await adminDb
			.from("admin_users")
			.select("email, failed_login_attempts, locked_until, updated_at")
			.gt("failed_login_attempts", 0)
			.order("updated_at", { ascending: false })
			.limit(limit);

		if (failedLogins) {
			for (const login of failedLogins) {
				events.push({
					id: login.email,
					type: "failed_login",
					severity: (login.failed_login_attempts || 0) >= 5 ? ("high" as const) : ("medium" as const),
					description: `${login.email} has ${login.failed_login_attempts} failed login attempts`,
					admin_email: login.email,
					metadata: {
						failed_attempts: login.failed_login_attempts,
						locked_until: login.locked_until,
					},
					created_at: login.updated_at || new Date().toISOString(),
				});
			}
		}

		// Get audit logs with security-related actions
		const { data: securityLogs } = await adminDb
			.from("admin_audit_logs")
			.select("id, action, admin_email, ip_address, user_agent, details, created_at")
			.or("action.ilike.%permission%,action.ilike.%security%,action.ilike.%access%,action.ilike.%api_key%")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (securityLogs) {
			for (const log of securityLogs) {
				const action = log.action.toLowerCase();
				let type: SecurityEvent["type"] = "other";
				let severity: SecurityEvent["severity"] = "low";

				if (action.includes("permission") || action.includes("role")) {
					type = "permission_change";
					severity = "medium";
				} else if (action.includes("api_key")) {
					type = "api_key_usage";
					severity = "medium";
				}

				events.push({
					id: log.id,
					type,
					severity,
					description: log.action,
					admin_email: log.admin_email || undefined,
					ip_address: log.ip_address || undefined,
					user_agent: log.user_agent || undefined,
					metadata: log.details as Record<string, unknown>,
					created_at: log.created_at,
				});
			}
		}

		// Sort by created_at descending
		events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

		// Apply filters
		let filtered = events;
		if (options?.severity) {
			filtered = filtered.filter((e) => e.severity === options.severity);
		}
		if (options?.type) {
			filtered = filtered.filter((e) => e.type === options.type);
		}
		if (options?.start_date) {
			filtered = filtered.filter((e) => e.created_at >= options.start_date!);
		}
		if (options?.end_date) {
			filtered = filtered.filter((e) => e.created_at <= options.end_date!);
		}

		return { data: filtered.slice(0, limit) };
	} catch (error) {
		console.error("Failed to get security events:", error);
		return { error: error instanceof Error ? error.message : "Failed to get security events" };
	}
}

/**
 * Get security statistics
 */
export async function getSecurityStats() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const eventsResult = await getSecurityEvents({ limit: 1000 });

		if (eventsResult.error || !eventsResult.data) {
			return {
				data: {
					total_events: 0,
					failed_logins: 0,
					suspicious_activity: 0,
					permission_changes: 0,
					api_key_anomalies: 0,
					critical_incidents: 0,
					recent_activity_24h: 0,
				},
			};
		}

		const events = eventsResult.data;
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
		const recentEvents = events.filter((e) => e.created_at >= oneDayAgo);

		return {
			data: {
				total_events: events.length,
				failed_logins: events.filter((e) => e.type === "failed_login").length,
				suspicious_activity: events.filter((e) => e.type === "suspicious_activity").length,
				permission_changes: events.filter((e) => e.type === "permission_change").length,
				api_key_anomalies: events.filter((e) => e.type === "api_key_usage").length,
				critical_incidents: events.filter((e) => e.severity === "critical").length,
				recent_activity_24h: recentEvents.length,
			},
		};
	} catch (error) {
		console.error("Failed to get security stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to get security stats" };
	}
}



