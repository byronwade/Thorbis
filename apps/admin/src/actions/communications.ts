"use server";

/**
 * Communication Analytics Actions
 *
 * Server actions for monitoring email/SMS delivery rates and provider health.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import type { AdminCommunication } from "@/types/entities";

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

/**
 * Get platform-wide communications for the admin unified inbox
 * Fetches recent communications from all companies
 */
export async function getPlatformCommunications(options?: {
	limit?: number;
	type?: "email" | "sms" | "call" | "voicemail";
}): Promise<{ data?: AdminCommunication[]; error?: string }> {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const limit = options?.limit || 100;

	try {
		const webDb = createWebClient();

		// Build query for communications
		let query = webDb
			.from("communications")
			.select(`
				id,
				type,
				direction,
				subject,
				body,
				from_address,
				to_address,
				company_id,
				customer_id,
				status,
				channel,
				created_at,
				updated_at,
				provider_metadata,
				company:companies(id, name)
			`)
			.order("created_at", { ascending: false })
			.limit(limit);

		// Filter by type if specified
		if (options?.type) {
			query = query.eq("type", options.type);
		}

		const { data: communications, error: fetchError } = await query;

		if (fetchError) {
			console.error("Failed to fetch communications:", fetchError);
			return { error: fetchError.message };
		}

		// Transform to AdminCommunication format
		const transformed: AdminCommunication[] = (communications || []).map((comm) => {
			// Extract duration from provider_metadata if present
			const metadata = comm.provider_metadata as Record<string, unknown> | null;
			const duration = metadata?.duration as number | undefined;
			const recordingUrl = metadata?.recording_url as string | undefined;

			// Determine preview text
			let preview = comm.body || "";
			if (preview.length > 150) {
				preview = `${preview.substring(0, 150)}...`;
			}

			// Map internal status to display status
			let displayStatus: AdminCommunication["status"] = "read";
			if (comm.status === "pending" || comm.status === "queued") {
				displayStatus = "new";
			} else if (comm.status === "sent") {
				displayStatus = "sent";
			} else if (comm.status === "delivered") {
				displayStatus = "delivered";
			} else if (comm.status === "failed") {
				displayStatus = "failed";
			} else if (comm.status === "read") {
				displayStatus = "read";
			} else {
				displayStatus = "unread";
			}

			return {
				id: comm.id,
				type: (comm.type || "email") as AdminCommunication["type"],
				direction: (comm.direction || "inbound") as "inbound" | "outbound",
				subject: comm.subject || undefined,
				preview: preview || undefined,
				from: comm.from_address || undefined,
				to: comm.to_address || undefined,
				companyId: comm.company_id || undefined,
				companyName: (comm.company as { name?: string } | null)?.name || undefined,
				status: displayStatus,
				duration,
				recordingUrl,
				createdAt: comm.created_at,
				updatedAt: comm.updated_at || undefined,
			};
		});

		return { data: transformed };
	} catch (error) {
		console.error("Failed to get platform communications:", error);
		return { error: error instanceof Error ? error.message : "Failed to fetch communications" };
	}
}

export interface PlatformCommunicationStats {
	totalCommunications: number;
	totalCommunicationsChange: number;
	activeCompanies: number;
	avgResponseTimeHours: number;
	totalVolumeLast30Days: number;
	byChannel: {
		email: { total: number; unread: number };
		sms: { total: number; unread: number };
		call: { total: number; unread: number };
		voicemail: { total: number; unread: number };
	};
	topCompanies: Array<{
		id: string;
		name: string;
		communications: number;
		percentage: number;
	}>;
	recentActivity: Array<{
		date: string;
		emails: number;
		sms: number;
		calls: number;
	}>;
}

/**
 * Get platform-wide communication statistics
 */
export async function getPlatformCommunicationStats(): Promise<{
	data?: PlatformCommunicationStats;
	error?: string;
}> {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();
		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

		// Get total communications
		const { count: totalCount } = await webDb
			.from("communications")
			.select("*", { count: "exact", head: true });

		// Get communications in the last 30 days
		const { count: last30DaysCount } = await webDb
			.from("communications")
			.select("*", { count: "exact", head: true })
			.gte("created_at", thirtyDaysAgo.toISOString());

		// Get communications 30-60 days ago for comparison
		const { count: previous30DaysCount } = await webDb
			.from("communications")
			.select("*", { count: "exact", head: true })
			.gte("created_at", sixtyDaysAgo.toISOString())
			.lt("created_at", thirtyDaysAgo.toISOString());

		// Calculate change percentage
		const changePercent = previous30DaysCount && previous30DaysCount > 0
			? ((((last30DaysCount || 0) - previous30DaysCount) / previous30DaysCount) * 100)
			: 0;

		// Get counts by channel
		const { data: channelCounts } = await webDb
			.from("communications")
			.select("type, status")
			.gte("created_at", thirtyDaysAgo.toISOString());

		const byChannel = {
			email: { total: 0, unread: 0 },
			sms: { total: 0, unread: 0 },
			call: { total: 0, unread: 0 },
			voicemail: { total: 0, unread: 0 },
		};

		(channelCounts || []).forEach((comm) => {
			const type = (comm.type as keyof typeof byChannel) || "email";
			if (byChannel[type]) {
				byChannel[type].total++;
				if (comm.status === "pending" || comm.status === "queued" || !comm.status) {
					byChannel[type].unread++;
				}
			}
		});

		// Get active companies (companies with communications in last 30 days)
		const { data: companyData } = await webDb
			.from("communications")
			.select("company_id")
			.gte("created_at", thirtyDaysAgo.toISOString())
			.not("company_id", "is", null);

		const uniqueCompanies = new Set((companyData || []).map((c) => c.company_id));

		// Get top companies by communication volume
		const companyCounts: Record<string, number> = {};
		(companyData || []).forEach((comm) => {
			if (comm.company_id) {
				companyCounts[comm.company_id] = (companyCounts[comm.company_id] || 0) + 1;
			}
		});

		const sortedCompanyIds = Object.entries(companyCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([id]) => id);

		// Get company names
		const { data: companies } = await webDb
			.from("companies")
			.select("id, name")
			.in("id", sortedCompanyIds);

		const companyMap = new Map((companies || []).map((c) => [c.id, c.name]));

		const topCompanies = sortedCompanyIds.map((id) => {
			const count = companyCounts[id];
			return {
				id,
				name: companyMap.get(id) || "Unknown Company",
				communications: count,
				percentage: (last30DaysCount || 0) > 0 ? Math.round((count / (last30DaysCount || 1)) * 1000) / 10 : 0,
			};
		});

		// Get recent activity (last 7 days)
		const recentActivity: PlatformCommunicationStats["recentActivity"] = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);
			const startOfDay = new Date(date);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(date);
			endOfDay.setHours(23, 59, 59, 999);

			const { data: dayComms } = await webDb
				.from("communications")
				.select("type")
				.gte("created_at", startOfDay.toISOString())
				.lte("created_at", endOfDay.toISOString());

			const dayCounts = {
				emails: 0,
				sms: 0,
				calls: 0,
			};

			(dayComms || []).forEach((comm) => {
				if (comm.type === "email") dayCounts.emails++;
				else if (comm.type === "sms") dayCounts.sms++;
				else if (comm.type === "call" || comm.type === "voicemail") dayCounts.calls++;
			});

			recentActivity.push({
				date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
				...dayCounts,
			});
		}

		return {
			data: {
				totalCommunications: totalCount || 0,
				totalCommunicationsChange: Math.round(changePercent * 10) / 10,
				activeCompanies: uniqueCompanies.size,
				avgResponseTimeHours: 2.4, // Would need response tracking for real value
				totalVolumeLast30Days: last30DaysCount || 0,
				byChannel,
				topCompanies,
				recentActivity,
			},
		};
	} catch (error) {
		console.error("Failed to get platform communication stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to fetch stats" };
	}
}

