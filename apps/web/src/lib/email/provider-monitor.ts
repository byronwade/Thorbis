"use server";

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
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { EmailProvider } from "./email-provider";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Types of events we track for email providers
 */
export type ProviderEventType =
	| "send_success" // Email sent successfully
	| "send_failure" // Email send failed
	| "health_check_success" // Health check passed
	| "health_check_failure" // Health check failed
	| "webhook_received" // Webhook event received
	| "fallback_triggered"; // Fallback to secondary provider was used

/**
 * Event data for recording provider activity
 */
export interface ProviderEventData {
	/** Which provider this event is for */
	provider: EmailProvider;
	/** Type of event */
	eventType: ProviderEventType;
	/** Message ID if applicable */
	messageId?: string;
	/** Time taken for the operation in milliseconds */
	latencyMs?: number;
	/** Error message if this was a failure */
	error?: string;
	/** Additional metadata */
	metadata?: Record<string, unknown>;
	/** Company ID for multi-tenant tracking */
	companyId?: string;
	/** Domain ID if associated with a specific domain */
	domainId?: string;
}

/**
 * Aggregated statistics for a provider
 */
export interface ProviderStats {
	provider: EmailProvider;
	period: string;
	totalEvents: number;
	successCount: number;
	failureCount: number;
	successRate: number;
	averageLatencyMs: number;
	p95LatencyMs: number;
	fallbackCount: number;
	lastEventAt: Date | null;
	lastError: string | null;
}

/**
 * Real-time health status for dashboard
 */
export interface ProviderHealthDashboard {
	resend: {
		status: "healthy" | "degraded" | "down" | "unknown";
		successRate24h: number;
		avgLatencyMs: number;
		totalSent24h: number;
		lastError?: string;
		lastSuccessAt?: Date;
	};
	postmark: {
		status: "healthy" | "degraded" | "down" | "unknown";
		successRate24h: number;
		avgLatencyMs: number;
		totalSent24h: number;
		lastError?: string;
		lastSuccessAt?: Date;
	};
	overall: {
		primaryProvider: EmailProvider;
		fallbackProvider: EmailProvider;
		fallbackRate24h: number;
		recommendedAction?: string;
	};
}

// =============================================================================
// EVENT RECORDING
// =============================================================================

/**
 * Record a provider event to the database
 *
 * This function logs every email provider interaction for monitoring.
 * Events are stored in the email_provider_events table.
 *
 * @param event - Event data to record
 * @returns Success status
 *
 * @example
 * await recordProviderEvent({
 *   provider: "resend",
 *   eventType: "send_success",
 *   messageId: "msg_123",
 *   latencyMs: 145,
 *   companyId: "company_abc",
 * });
 */
export async function recordProviderEvent(
	event: ProviderEventData,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		// Log to console for immediate visibility
		const logPrefix = event.eventType.includes("success") ? "✓" : "✗";
		console.log(
			`[ProviderMonitor] ${logPrefix} ${event.provider}:${event.eventType}` +
				(event.latencyMs ? ` (${event.latencyMs}ms)` : "") +
				(event.error ? ` - ${event.error}` : ""),
		);

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
			created_at: new Date().toISOString(),
		});

		if (error) {
			// Don't fail the main operation if monitoring fails
			console.error(
				`[ProviderMonitor] Failed to record event: ${error.message}`,
			);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		// Monitoring should never break the main flow
		console.error(
			`[ProviderMonitor] Error recording event: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Record a successful email send
 * Convenience wrapper for recordProviderEvent
 */
export async function recordSendSuccess(
	provider: EmailProvider,
	messageId: string,
	latencyMs: number,
	options?: {
		companyId?: string;
		domainId?: string;
		metadata?: Record<string, unknown>;
	},
): Promise<void> {
	await recordProviderEvent({
		provider,
		eventType: "send_success",
		messageId,
		latencyMs,
		...options,
	});
}

/**
 * Record a failed email send
 * Convenience wrapper for recordProviderEvent
 */
export async function recordSendFailure(
	provider: EmailProvider,
	error: string,
	latencyMs: number,
	options?: {
		companyId?: string;
		domainId?: string;
		metadata?: Record<string, unknown>;
	},
): Promise<void> {
	await recordProviderEvent({
		provider,
		eventType: "send_failure",
		error,
		latencyMs,
		...options,
	});
}

/**
 * Record when fallback provider was used
 */
export async function recordFallbackTriggered(
	primaryProvider: EmailProvider,
	fallbackProvider: EmailProvider,
	primaryError: string,
	options?: { companyId?: string; metadata?: Record<string, unknown> },
): Promise<void> {
	await recordProviderEvent({
		provider: primaryProvider,
		eventType: "fallback_triggered",
		error: primaryError,
		metadata: {
			fallback_provider: fallbackProvider,
			...options?.metadata,
		},
		...options,
	});
}

// =============================================================================
// STATISTICS & ANALYTICS
// =============================================================================

/**
 * Get statistics for a specific provider
 *
 * @param provider - Provider to get stats for
 * @param period - Time period ("1h", "24h", "7d", "30d")
 * @returns Provider statistics
 */
async function getProviderStats(
	provider: EmailProvider,
	period: "1h" | "24h" | "7d" | "30d" = "24h",
): Promise<ProviderStats | null> {
	try {
		const supabase = await createServiceSupabaseClient();

		// Calculate start time based on period
		const now = new Date();
		const periodMs = {
			"1h": 60 * 60 * 1000,
			"24h": 24 * 60 * 60 * 1000,
			"7d": 7 * 24 * 60 * 60 * 1000,
			"30d": 30 * 24 * 60 * 60 * 1000,
		};
		const startTime = new Date(now.getTime() - periodMs[period]).toISOString();

		// Query events for this provider and period
		const { data: events, error } = await supabase
			.from("email_provider_events")
			.select("event_type, latency_ms, error_message, created_at")
			.eq("provider", provider)
			.gte("created_at", startTime)
			.order("created_at", { ascending: false });

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
				lastError: null,
			};
		}

		// Calculate statistics
		const sendEvents = events.filter(
			(e) => e.event_type === "send_success" || e.event_type === "send_failure",
		);
		const successEvents = events.filter((e) => e.event_type === "send_success");
		const failureEvents = events.filter((e) => e.event_type === "send_failure");
		const fallbackEvents = events.filter(
			(e) => e.event_type === "fallback_triggered",
		);

		// Calculate latency metrics
		const latencies = successEvents
			.map((e) => e.latency_ms)
			.filter((l): l is number => l !== null)
			.sort((a, b) => a - b);

		const avgLatency =
			latencies.length > 0
				? latencies.reduce((sum, l) => sum + l, 0) / latencies.length
				: 0;

		const p95Index = Math.floor(latencies.length * 0.95);
		const p95Latency =
			latencies.length > 0
				? latencies[p95Index] || latencies[latencies.length - 1]
				: 0;

		// Find last error
		const lastFailure = failureEvents[0];

		return {
			provider,
			period,
			totalEvents: events.length,
			successCount: successEvents.length,
			failureCount: failureEvents.length,
			successRate:
				sendEvents.length > 0
					? (successEvents.length / sendEvents.length) * 100
					: 0,
			averageLatencyMs: Math.round(avgLatency),
			p95LatencyMs: Math.round(p95Latency),
			fallbackCount: fallbackEvents.length,
			lastEventAt: events[0] ? new Date(events[0].created_at) : null,
			lastError: lastFailure?.error_message || null,
		};
	} catch (error) {
		console.error(
			`[ProviderMonitor] Error getting stats: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		return null;
	}
}

/**
 * Get health dashboard data for all providers
 *
 * @returns Dashboard data for monitoring UI
 */
async function getProviderHealthDashboard(): Promise<ProviderHealthDashboard> {
	console.log("[ProviderMonitor] Getting health dashboard data...");

	// Get stats for both providers
	const [resendStats, postmarkStats] = await Promise.all([
		getProviderStats("resend", "24h"),
		getProviderStats("postmark", "24h"),
	]);

	// Determine health status based on success rate
	const getStatus = (
		stats: ProviderStats | null,
	): "healthy" | "degraded" | "down" | "unknown" => {
		if (!stats || stats.totalEvents === 0) return "unknown";
		if (stats.successRate >= 99) return "healthy";
		if (stats.successRate >= 95) return "degraded";
		return "down";
	};

	// Calculate fallback rate
	const totalFallbacks =
		(resendStats?.fallbackCount || 0) + (postmarkStats?.fallbackCount || 0);
	const totalSends =
		(resendStats?.successCount || 0) +
		(resendStats?.failureCount || 0) +
		(postmarkStats?.successCount || 0) +
		(postmarkStats?.failureCount || 0);
	const fallbackRate = totalSends > 0 ? (totalFallbacks / totalSends) * 100 : 0;

	// Determine recommended action
	let recommendedAction: string | undefined;
	const resendStatus = getStatus(resendStats);
	const postmarkStatus = getStatus(postmarkStats);

	if (resendStatus === "down" && postmarkStatus === "down") {
		recommendedAction =
			"CRITICAL: Both providers are down. Check API keys and provider status.";
	} else if (resendStatus === "down") {
		recommendedAction =
			"Primary provider (Resend) is down. Traffic is using fallback.";
	} else if (fallbackRate > 10) {
		recommendedAction =
			"High fallback rate detected. Review primary provider health.";
	} else if (resendStatus === "degraded") {
		recommendedAction =
			"Primary provider showing degraded performance. Monitor closely.";
	}

	return {
		resend: {
			status: resendStatus,
			successRate24h: resendStats?.successRate || 0,
			avgLatencyMs: resendStats?.averageLatencyMs || 0,
			totalSent24h: resendStats?.successCount || 0,
			lastError: resendStats?.lastError || undefined,
			lastSuccessAt: resendStats?.lastEventAt || undefined,
		},
		postmark: {
			status: postmarkStatus,
			successRate24h: postmarkStats?.successRate || 0,
			avgLatencyMs: postmarkStats?.averageLatencyMs || 0,
			totalSent24h: postmarkStats?.successCount || 0,
			lastError: postmarkStats?.lastError || undefined,
			lastSuccessAt: postmarkStats?.lastEventAt || undefined,
		},
		overall: {
			primaryProvider: "resend",
			fallbackProvider: "postmark",
			fallbackRate24h: fallbackRate,
			recommendedAction,
		},
	};
}

// =============================================================================
// CLEANUP & MAINTENANCE
// =============================================================================

/**
 * Clean up old provider events
 * Should be run periodically (e.g., daily cron job)
 *
 * @param retentionDays - Number of days to retain events
 * @returns Number of deleted events
 */
async function cleanupOldEvents(
	retentionDays: number = 30,
): Promise<{ deleted: number; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

		const { data, error } = await supabase
			.from("email_provider_events")
			.delete()
			.lt("created_at", cutoffDate.toISOString())
			.select("id");

		if (error) {
			console.error(`[ProviderMonitor] Cleanup failed: ${error.message}`);
			return { deleted: 0, error: error.message };
		}

		const deletedCount = data?.length || 0;
		console.log(
			`[ProviderMonitor] Cleaned up ${deletedCount} events older than ${retentionDays} days`,
		);

		return { deleted: deletedCount };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		console.error(`[ProviderMonitor] Cleanup error: ${errorMessage}`);
		return { deleted: 0, error: errorMessage };
	}
}

// =============================================================================
// ALERTING HELPERS
// =============================================================================

/**
 * Check if a provider should trigger an alert
 *
 * @param provider - Provider to check
 * @returns Alert status and reason
 */
async function checkProviderAlert(provider: EmailProvider): Promise<{
	shouldAlert: boolean;
	severity: "info" | "warning" | "critical";
	reason?: string;
}> {
	const stats = await getProviderStats(provider, "1h");

	if (!stats) {
		return { shouldAlert: false, severity: "info" };
	}

	// No events in the last hour - might be expected during low traffic
	if (stats.totalEvents === 0) {
		return { shouldAlert: false, severity: "info" };
	}

	// Critical: Success rate below 90%
	if (stats.successRate < 90) {
		return {
			shouldAlert: true,
			severity: "critical",
			reason: `${provider} success rate is ${stats.successRate.toFixed(1)}% (below 90%)`,
		};
	}

	// Warning: Success rate below 99%
	if (stats.successRate < 99) {
		return {
			shouldAlert: true,
			severity: "warning",
			reason: `${provider} success rate is ${stats.successRate.toFixed(1)}% (below 99%)`,
		};
	}

	// Warning: High latency
	if (stats.averageLatencyMs > 5000) {
		return {
			shouldAlert: true,
			severity: "warning",
			reason: `${provider} average latency is ${stats.averageLatencyMs}ms (above 5s)`,
		};
	}

	return { shouldAlert: false, severity: "info" };
}
