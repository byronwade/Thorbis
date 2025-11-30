"use server";

/**
 * System Health Management Actions
 *
 * Server actions for monitoring system health, API metrics, and integration status.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getAdminSession } from "@/lib/auth/session";

export interface SystemHealthMetrics {
	database: {
		status: "healthy" | "degraded" | "down";
		responseTimeMs: number;
		activeConnections: number;
	};
	api: {
		totalCalls: number;
		errorRate: number;
		avgLatencyMs: number;
		slowCalls: number;
	};
	integrations: {
		telnyx: IntegrationHealth;
		stripe: IntegrationHealth;
		resend: IntegrationHealth;
		[key: string]: IntegrationHealth;
	};
	errors: {
		total: number;
		critical: number;
		recent: Array<{
			id: string;
			message: string;
			severity: string;
			created_at: string;
			company_id?: string;
		}>;
	};
}

export interface IntegrationHealth {
	status: "healthy" | "degraded" | "down" | "unknown";
	lastCheck: string;
	errorRate?: number;
	lastError?: string;
}

/**
 * Get system health metrics
 */
export async function getSystemHealthMetrics() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();
		const adminDb = createAdminClient();

		// Test database connectivity
		const dbStartTime = Date.now();
		const { error: dbError } = await webDb.from("companies").select("id").limit(1);
		const dbResponseTime = Date.now() - dbStartTime;

		const database = {
			status: dbError ? ("down" as const) : dbResponseTime > 1000 ? ("degraded" as const) : ("healthy" as const),
			responseTimeMs: dbResponseTime,
			activeConnections: 0, // TODO: Query pg_stat_activity if available
		};

		// Get API metrics (platform-wide, last 24 hours)
		const apiMetrics = await getPlatformApiMetrics(webDb);

		// Get integration health
		const integrations = await getIntegrationHealth(webDb, adminDb);

		// Get recent errors
		const errors = await getRecentErrors(adminDb);

		return {
			data: {
				database,
				api: apiMetrics,
				integrations,
				errors,
			},
		};
	} catch (error) {
		console.error("System health check failed:", error);
		return {
			error: error instanceof Error ? error.message : "Failed to get system health",
		};
	}
}

/**
 * Get platform-wide API metrics
 */
async function getPlatformApiMetrics(webDb: ReturnType<typeof createWebClient>) {
	try {
		// Query API call stats table if it exists
		// This is a simplified version - in production, you'd aggregate from api_call_logs
		const { data: stats, error } = await webDb
			.from("api_call_stats")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(100);

		if (error || !stats || stats.length === 0) {
			// Fallback if table doesn't exist
			return {
				totalCalls: 0,
				errorRate: 0,
				avgLatencyMs: 0,
				slowCalls: 0,
			};
		}

		const totalCalls = stats.reduce((sum, s) => sum + (s.total_calls || 0), 0);
		const totalErrors = stats.reduce((sum, s) => sum + (s.error_count || 0), 0);
		const errorRate = totalCalls > 0 ? (totalErrors / totalCalls) * 100 : 0;
		const avgLatencyMs = Math.round(
			stats.reduce((sum, s) => sum + (s.avg_latency_ms || 0), 0) / stats.length,
		);
		const slowCalls = stats.filter((s) => (s.avg_latency_ms || 0) > 1000).length;

		return {
			totalCalls,
			errorRate: Math.round(errorRate * 100) / 100,
			avgLatencyMs,
			slowCalls,
		};
	} catch (error) {
		console.error("Failed to get API metrics:", error);
		return {
			totalCalls: 0,
			errorRate: 0,
			avgLatencyMs: 0,
			slowCalls: 0,
		};
	}
}

/**
 * Get integration health status
 */
async function getIntegrationHealth(
	webDb: ReturnType<typeof createWebClient>,
	adminDb: ReturnType<typeof createAdminClient>,
): Promise<Record<string, IntegrationHealth>> {
	const integrations: Record<string, IntegrationHealth> = {};

	try {
		// Check Telnyx (from communications or phone settings)
		const { data: telnyxSettings } = await webDb
			.from("company_telnyx_settings")
			.select("id, updated_at")
			.order("updated_at", { ascending: false })
			.limit(1);

		integrations.telnyx = {
			status: telnyxSettings && telnyxSettings.length > 0 ? ("healthy" as const) : ("unknown" as const),
			lastCheck: new Date().toISOString(),
		};

		// Check Stripe (from companies with subscriptions)
		const { data: stripeCompanies } = await webDb
			.from("companies")
			.select("id, stripe_subscription_id, updated_at")
			.not("stripe_subscription_id", "is", null)
			.order("updated_at", { ascending: false })
			.limit(1);

		integrations.stripe = {
			status: stripeCompanies && stripeCompanies.length > 0 ? ("healthy" as const) : ("unknown" as const),
			lastCheck: new Date().toISOString(),
		};

		// Check Resend (from email provider events)
		const { data: emailEvents } = await webDb
			.from("email_provider_events")
			.select("provider, event_type, created_at")
			.eq("provider", "resend")
			.order("created_at", { ascending: false })
			.limit(100);

		if (emailEvents && emailEvents.length > 0) {
			const recentErrors = emailEvents.filter((e) => e.event_type?.includes("fail")).length;
			const errorRate = (recentErrors / emailEvents.length) * 100;
			const lastEvent = emailEvents[0];

			integrations.resend = {
				status:
					errorRate > 10
						? ("degraded" as const)
						: errorRate > 50
							? ("down" as const)
							: ("healthy" as const),
				lastCheck: lastEvent.created_at || new Date().toISOString(),
				errorRate,
			};
		} else {
			integrations.resend = {
				status: "unknown" as const,
				lastCheck: new Date().toISOString(),
			};
		}
	} catch (error) {
		console.error("Failed to get integration health:", error);
	}

	return integrations;
}

/**
 * Get recent errors from audit logs
 */
async function getRecentErrors(
	adminDb: ReturnType<typeof createAdminClient>,
): Promise<SystemHealthMetrics["errors"]> {
	try {
		const { data: errorLogs } = await adminDb
			.from("admin_audit_logs")
			.select("id, action, details, created_at")
			.or("action.ilike.%error%,action.ilike.%fail%")
			.order("created_at", { ascending: false })
			.limit(10);

		if (!errorLogs || errorLogs.length === 0) {
			return {
				total: 0,
				critical: 0,
				recent: [],
			};
		}

		const critical = errorLogs.filter((log) =>
			log.action?.toLowerCase().includes("critical"),
		).length;

		return {
			total: errorLogs.length,
			critical,
			recent: errorLogs.map((log) => ({
				id: log.id,
				message: (log.details as { message?: string })?.message || log.action || "Unknown error",
				severity: log.action?.toLowerCase().includes("critical") ? "critical" : "error",
				created_at: log.created_at,
			})),
		};
	} catch (error) {
		console.error("Failed to get recent errors:", error);
		return {
			total: 0,
			critical: 0,
			recent: [],
		};
	}
}

