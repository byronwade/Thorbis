"use server";

/**
 * Integrations Management Actions
 *
 * Server actions for monitoring integration health and status.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getAdminSession } from "@/lib/auth/session";

export interface IntegrationConnection {
	id: string;
	provider: string;
	status: "connected" | "disconnected" | "error" | "unknown";
	company_id?: string;
	company_name?: string;
	last_sync_at?: string;
	last_success_at?: string;
	last_error?: string;
	failure_count: number;
	metadata?: Record<string, unknown>;
}

export interface IntegrationHealth {
	provider: string;
	total_connections: number;
	healthy: number;
	degraded: number;
	down: number;
	unknown: number;
	last_check: string;
	avg_sync_time_ms?: number;
	total_errors: number;
}

export interface WebhookStatus {
	id: string;
	url: string;
	status: "active" | "inactive" | "error";
	company_id?: string;
	company_name?: string;
	success_rate: number;
	total_deliveries: number;
	failed_deliveries: number;
	last_delivery_at?: string;
	last_success_at?: string;
	last_error?: string;
}

/**
 * Get all integration connections
 */
export async function getIntegrationConnections() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Check for integration_connections table (may not exist yet)
		const connections: IntegrationConnection[] = [];

		// Get Telnyx integrations from company_telnyx_settings
		try {
			const { data: telnyxSettings } = await webDb
				.from("company_telnyx_settings")
				.select("id, company_id, updated_at")
				.not("company_id", "is", null);

			if (telnyxSettings) {
				// Get company names
				const companyIds = telnyxSettings.map((s) => s.company_id).filter(Boolean);
				const { data: companies } = await webDb
					.from("companies")
					.select("id, name")
					.in("id", companyIds);

				const companyMap = new Map((companies || []).map((c) => [c.id, c.name]));

				for (const setting of telnyxSettings) {
					connections.push({
						id: setting.id,
						provider: "telnyx",
						status: "connected",
						company_id: setting.company_id,
						company_name: companyMap.get(setting.company_id) || undefined,
						last_sync_at: setting.updated_at,
						failure_count: 0,
					});
				}
			}
		} catch (error) {
			// Table may not exist
			console.log("Telnyx settings table not found or error:", error);
		}

		// Get Stripe integrations from companies with subscriptions
		try {
			const { data: stripeCompanies } = await webDb
				.from("companies")
				.select("id, name, stripe_subscription_id, updated_at")
				.not("stripe_subscription_id", "is", null)
				.limit(100);

			if (stripeCompanies) {
				for (const company of stripeCompanies) {
					connections.push({
						id: company.id,
						provider: "stripe",
						status: "connected",
						company_id: company.id,
						company_name: company.name,
						last_sync_at: company.updated_at,
						failure_count: 0,
					});
				}
			}
		} catch (error) {
			console.log("Error fetching Stripe connections:", error);
		}

		return { data: connections };
	} catch (error) {
		console.error("Failed to get integration connections:", error);
		return { error: error instanceof Error ? error.message : "Failed to get integration connections" };
	}
}

/**
 * Get integration health summary
 */
export async function getIntegrationHealth() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const connectionsResult = await getIntegrationConnections();

		if (connectionsResult.error || !connectionsResult.data) {
			return connectionsResult;
		}

		const connections = connectionsResult.data;

		// Group by provider
		const providerMap = new Map<string, IntegrationConnection[]>();
		for (const conn of connections) {
			if (!providerMap.has(conn.provider)) {
				providerMap.set(conn.provider, []);
			}
			providerMap.get(conn.provider)!.push(conn);
		}

		// Calculate health for each provider
		const health: IntegrationHealth[] = [];

		for (const [provider, providerConnections] of providerMap) {
			const total = providerConnections.length;
			const healthy = providerConnections.filter((c) => c.status === "connected").length;
			const degraded = providerConnections.filter((c) => c.status === "error").length;
			const down = providerConnections.filter((c) => c.status === "disconnected").length;
			const unknown = providerConnections.filter((c) => c.status === "unknown").length;
			const totalErrors = providerConnections.reduce((sum, c) => sum + c.failure_count, 0);

			health.push({
				provider,
				total_connections: total,
				healthy,
				degraded,
				down,
				unknown,
				last_check: new Date().toISOString(),
				total_errors,
			});
		}

		return { data: health };
	} catch (error) {
		console.error("Failed to get integration health:", error);
		return { error: error instanceof Error ? error.message : "Failed to get integration health" };
	}
}

/**
 * Get webhook status
 */
export async function getWebhookStatus() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Check for webhooks table
		const { data: webhooks } = await webDb
			.from("webhooks")
			.select("id, url, active, company_id, created_at")
			.limit(100);

		if (!webhooks || webhooks.length === 0) {
			return { data: [] };
		}

		// Get company names
		const companyIds = webhooks.map((w) => w.company_id).filter(Boolean);
		const { data: companies } = await webDb
			.from("companies")
			.select("id, name")
			.in("id", companyIds);

		const companyMap = new Map((companies || []).map((c) => [c.id, c.name]));

		// Get webhook logs for delivery stats
		const { data: logs } = await webDb
			.from("webhook_logs")
			.select("webhook_id, status, created_at")
			.in("webhook_id", webhooks.map((w) => w.id))
			.gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

		// Calculate stats per webhook
		const webhookStats: Record<string, { success: number; failed: number; last: string }> = {};

		for (const log of logs || []) {
			if (!webhookStats[log.webhook_id]) {
				webhookStats[log.webhook_id] = { success: 0, failed: 0, last: log.created_at };
			}
			if (log.status === "sent" || log.status === "delivered") {
				webhookStats[log.webhook_id].success++;
			} else {
				webhookStats[log.webhook_id].failed++;
			}
			if (new Date(log.created_at) > new Date(webhookStats[log.webhook_id].last)) {
				webhookStats[log.webhook_id].last = log.created_at;
			}
		}

		const status: WebhookStatus[] = webhooks.map((webhook) => {
			const stats = webhookStats[webhook.id] || { success: 0, failed: 0, last: "" };
			const total = stats.success + stats.failed;
			const successRate = total > 0 ? (stats.success / total) * 100 : 0;

			return {
				id: webhook.id,
				url: webhook.url,
				status: !webhook.active ? ("inactive" as const) : successRate < 50 ? ("error" as const) : ("active" as const),
				company_id: webhook.company_id,
				company_name: companyMap.get(webhook.company_id) || undefined,
				success_rate: successRate,
				total_deliveries: total,
				failed_deliveries: stats.failed,
				last_delivery_at: stats.last || undefined,
			};
		});

		return { data: status };
	} catch (error) {
		console.error("Failed to get webhook status:", error);
		// Table may not exist
		return { data: [] };
	}
}

