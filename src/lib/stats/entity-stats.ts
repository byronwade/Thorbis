/**
 * Entity Stats Factory
 *
 * Shared utility for generating statistics across all entity types.
 * Eliminates duplicate stats calculation logic and provides consistent patterns.
 *
 * Usage:
 * ```typescript
 * const stats = await createEntityStats("jobs", companyId, {
 *   groupBy: "status",
 *   metrics: ["count", "revenue", "avgValue"]
 * });
 * ```
 */

import { createClient } from "@/lib/supabase/server";
import type { StatCard } from "@/components/ui/status-pipeline";

export type StatsMetric = "count" | "revenue" | "avgValue" | "completion" | "growth";

export type StatsConfig = {
	groupBy?: string;
	metrics?: StatsMetric[];
	statusField?: string;
	amountField?: string;
	dateField?: string;
};

type EntityTable =
	| "jobs"
	| "invoices"
	| "estimates"
	| "contracts"
	| "appointments"
	| "payments"
	| "purchase_orders"
	| "maintenance_plans"
	| "service_agreements"
	| "customers"
	| "team_members"
	| "inventory_items"
	| "price_book_items";

/**
 * Create statistics for any entity type
 */
export async function createEntityStats(
	table: EntityTable,
	companyId: string,
	config: StatsConfig = {}
): Promise<StatCard[]> {
	const supabase = await createClient();

	const { groupBy = "status", statusField = "status", amountField = "total", dateField = "created_at" } = config;

	try {
		// Fetch all records for the entity
		const { data: records, error } = await supabase
			.from(table)
			.select(`${statusField}, ${amountField}, ${dateField}`)
			.eq("company_id", companyId);

		if (error || !records) {
			return getPlaceholderStats();
		}

		// Group by status
		const grouped = records.reduce(
			(acc, record) => {
				const status = record[statusField] || "unknown";
				if (!acc[status]) {
					acc[status] = {
						count: 0,
						total: 0,
						records: [],
					};
				}
				acc[status].count++;
				acc[status].total += Number(record[amountField]) || 0;
				acc[status].records.push(record);
				return acc;
			},
			{} as Record<string, { count: number; total: number; records: any[] }>
		);

		// Convert to StatCard format
		const stats: StatCard[] = Object.entries(grouped).map(([status, data]) => ({
			label: formatStatusLabel(status),
			value: data.count,
			description: `$${(data.total / 100).toFixed(0)} total`,
			status: mapStatusToVariant(status),
		}));

		return stats;
	} catch (error) {
		console.error("Error creating entity stats:", error);
		return getPlaceholderStats();
	}
}

/**
 * Get statistics for a specific status/filter
 */
export async function getEntityCount(
	table: EntityTable,
	companyId: string,
	filters: Record<string, any> = {}
): Promise<number> {
	const supabase = await createClient();

	try {
		let query = supabase.from(table).select("*", { count: "exact", head: true }).eq("company_id", companyId);

		// Apply filters
		Object.entries(filters).forEach(([key, value]) => {
			query = query.eq(key, value);
		});

		const { count } = await query;
		return count || 0;
	} catch (error) {
		console.error("Error getting entity count:", error);
		return 0;
	}
}

/**
 * Calculate growth percentage
 */
export async function calculateGrowth(
	table: EntityTable,
	companyId: string,
	period: "day" | "week" | "month" = "month"
): Promise<number> {
	const supabase = await createClient();

	const now = new Date();
	const periodStart = new Date();

	switch (period) {
		case "day":
			periodStart.setDate(now.getDate() - 1);
			break;
		case "week":
			periodStart.setDate(now.getDate() - 7);
			break;
		case "month":
			periodStart.setMonth(now.getMonth() - 1);
			break;
	}

	try {
		// Current period count
		const { count: currentCount } = await supabase
			.from(table)
			.select("*", { count: "exact", head: true })
			.eq("company_id", companyId)
			.gte("created_at", periodStart.toISOString());

		// Previous period count
		const previousPeriodStart = new Date(periodStart);
		const previousPeriodEnd = periodStart;

		switch (period) {
			case "day":
				previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
				break;
			case "week":
				previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
				break;
			case "month":
				previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
				break;
		}

		const { count: previousCount } = await supabase
			.from(table)
			.select("*", { count: "exact", head: true })
			.eq("company_id", companyId)
			.gte("created_at", previousPeriodStart.toISOString())
			.lt("created_at", previousPeriodEnd.toISOString());

		if (!previousCount || previousCount === 0) {
			return 0;
		}

		const growth = ((Number(currentCount) - Number(previousCount)) / Number(previousCount)) * 100;
		return Math.round(growth);
	} catch (error) {
		console.error("Error calculating growth:", error);
		return 0;
	}
}

// Helper functions

function formatStatusLabel(status: string): string {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function mapStatusToVariant(status: string): "default" | "success" | "warning" | "destructive" {
	const statusLower = status.toLowerCase();

	if (statusLower.includes("complete") || statusLower.includes("paid") || statusLower.includes("done")) {
		return "success";
	}

	if (statusLower.includes("pending") || statusLower.includes("draft") || statusLower.includes("review")) {
		return "warning";
	}

	if (
		statusLower.includes("cancel") ||
		statusLower.includes("overdue") ||
		statusLower.includes("failed") ||
		statusLower.includes("reject")
	) {
		return "destructive";
	}

	return "default";
}

function getPlaceholderStats(): StatCard[] {
	return [
		{ label: "Total", value: 0, description: "Loading...", status: "default" },
		{ label: "Active", value: 0, description: "Loading...", status: "default" },
		{ label: "Completed", value: 0, description: "Loading...", status: "success" },
		{ label: "Pending", value: 0, description: "Loading...", status: "warning" },
	];
}
