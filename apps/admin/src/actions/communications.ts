"use server";

/**
 * Communication Analytics Actions
 *
 * Server actions for monitoring email/SMS delivery rates and provider health.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface CommunicationStats {
	provider: string;
	total_sent: number;
	delivered: number;
	failed: number;
	bounced: number;
	opened?: number;
	clicked?: number;
	delivery_rate: number;
	open_rate?: number;
	click_rate?: number;
}

export interface ProviderHealth {
	provider: string;
	status: "healthy" | "degraded" | "down";
	last_check: string;
	error_rate: number;
	avg_latency_ms?: number;
	total_events: number;
}

/**
 * Get communication statistics
 */
export async function getCommunicationStats() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Get email provider events
		const { data: emailEvents } = await webDb
			.from("email_provider_events")
			.select("provider, event_type, latency_ms, created_at")
			.gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
			.limit(1000);

		if (!emailEvents || emailEvents.length === 0) {
			return { data: [] };
		}

		// Group by provider
		const providerMap = new Map<string, typeof emailEvents>();

		for (const event of emailEvents) {
			if (!providerMap.has(event.provider || "unknown")) {
				providerMap.set(event.provider || "unknown", []);
			}
			providerMap.get(event.provider || "unknown")!.push(event);
		}

		const stats: CommunicationStats[] = [];

		for (const [provider, events] of providerMap) {
			const totalSent = events.filter((e) => e.event_type?.includes("send")).length;
			const delivered = events.filter((e) => e.event_type?.includes("delivered")).length;
			const failed = events.filter((e) => e.event_type?.includes("fail") || e.event_type?.includes("error")).length;
			const bounced = events.filter((e) => e.event_type?.includes("bounce")).length;

			const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
			const avgLatency = events
				.filter((e) => e.latency_ms)
				.reduce((sum, e) => sum + (e.latency_ms || 0), 0) / events.filter((e) => e.latency_ms).length || 0;

			stats.push({
				provider,
				total_sent: totalSent,
				delivered,
				failed,
				bounced,
				delivery_rate: Math.round(deliveryRate * 100) / 100,
				avg_latency_ms: Math.round(avgLatency),
			});
		}

		return { data: stats };
	} catch (error) {
		console.error("Failed to get communication stats:", error);
		return { data: [] };
	}
}

/**
 * Get provider health
 */
export async function getProviderHealth() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const statsResult = await getCommunicationStats();

		if (statsResult.error || !statsResult.data) {
			return { data: [] };
		}

		const health: ProviderHealth[] = statsResult.data.map((stat) => {
			const errorRate = stat.total_sent > 0 ? ((stat.failed + stat.bounced) / stat.total_sent) * 100 : 0;
			const status =
				errorRate > 10 ? ("down" as const) : errorRate > 5 ? ("degraded" as const) : ("healthy" as const);

			return {
				provider: stat.provider,
				status,
				last_check: new Date().toISOString(),
				error_rate: Math.round(errorRate * 100) / 100,
				avg_latency_ms: stat.avg_latency_ms,
				total_events: stat.total_sent,
			};
		});

		return { data: health };
	} catch (error) {
		console.error("Failed to get provider health:", error);
		return { data: [] };
	}
}



