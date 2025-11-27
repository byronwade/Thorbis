/**
 * API Usage Data Queries
 *
 * Functions to fetch API usage data from the database for the admin dashboard.
 */

import { cache } from "react";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export interface ApiUsageRecord {
	id: string;
	companyId: string;
	apiName: string;
	endpoint: string;
	monthYear: string;
	callCount: number;
	successCount: number;
	errorCount: number;
	estimatedCostCents: number | null;
	monthlyLimit: number | null;
	totalResponseTimeMs: number | null;
	lastCalledAt: Date | null;
	lastErrorMessage: string | null;
}

export interface AggregatedApiUsage {
	apiName: string;
	endpoint: string;
	totalCalls: number;
	successCount: number;
	errorCount: number;
	estimatedCostCents: number;
	avgResponseTimeMs: number;
	lastCalledAt: Date | null;
	companyCount: number;
}

/**
 * Get aggregated API usage for all companies (admin view)
 * Groups by API name + endpoint and aggregates across all companies
 * Preserves endpoint info for proper catalog service mapping
 */
export const getAggregatedApiUsage = cache(async (): Promise<AggregatedApiUsage[]> => {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			console.error("[API Usage] No Supabase client - check WEB_SUPABASE_URL and WEB_SUPABASE_SERVICE_ROLE_KEY");
			return [];
		}

		// Get current month in YYYY-MM format
		const currentMonth = new Date().toISOString().slice(0, 7);

		const { data, error } = await supabase
			.from("api_usage_tracking")
			.select("*")
			.eq("month_year", currentMonth);

		if (error) {
			console.error("[API Usage] Failed to fetch usage data:", error.message);
			return [];
		}

		if (!data || data.length === 0) {
			return [];
		}

		// Aggregate by API name + endpoint (preserves endpoint for catalog mapping)
		const aggregatedMap = new Map<string, AggregatedApiUsage>();

		for (const row of data) {
			// Key by api_name + endpoint to preserve endpoint-level granularity
			const key = `${row.api_name}::${row.endpoint}`;
			const existing = aggregatedMap.get(key);
			const lastCalled = row.last_called_at ? new Date(row.last_called_at) : null;

			if (existing) {
				existing.totalCalls += row.call_count;
				existing.successCount += row.success_count;
				existing.errorCount += row.error_count;
				existing.estimatedCostCents += row.estimated_cost_cents || 0;
				existing.avgResponseTimeMs =
					(existing.avgResponseTimeMs * existing.companyCount +
						(row.total_response_time_ms || 0) / Math.max(row.call_count, 1)) /
					(existing.companyCount + 1);
				existing.companyCount += 1;
				if (lastCalled && (!existing.lastCalledAt || lastCalled > existing.lastCalledAt)) {
					existing.lastCalledAt = lastCalled;
				}
			} else {
				aggregatedMap.set(key, {
					apiName: row.api_name,
					endpoint: row.endpoint,
					totalCalls: row.call_count,
					successCount: row.success_count,
					errorCount: row.error_count,
					estimatedCostCents: row.estimated_cost_cents || 0,
					avgResponseTimeMs:
						row.call_count > 0
							? (row.total_response_time_ms || 0) / row.call_count
							: 0,
					lastCalledAt: lastCalled,
					companyCount: 1,
				});
			}
		}

		return Array.from(aggregatedMap.values()).sort((a, b) => b.totalCalls - a.totalCalls);
	} catch (err) {
		console.error("[API Usage] Query error:", err);
		return [];
	}
});

/**
 * Get API usage for a specific company
 */
export const getCompanyApiUsage = cache(
	async (companyId: string): Promise<ApiUsageRecord[]> => {
		try {
			const supabase = await createServiceSupabaseClient();
			if (!supabase) return [];

			const currentMonth = new Date().toISOString().slice(0, 7);

			const { data, error } = await supabase
				.from("api_usage_tracking")
				.select("*")
				.eq("company_id", companyId)
				.eq("month_year", currentMonth)
				.order("call_count", { ascending: false });

			if (error) {
				console.error("[API Usage] Failed to fetch company usage:", error.message);
				return [];
			}

			return (data || []).map((row) => ({
				id: row.id,
				companyId: row.company_id,
				apiName: row.api_name,
				endpoint: row.endpoint,
				monthYear: row.month_year,
				callCount: row.call_count,
				successCount: row.success_count,
				errorCount: row.error_count,
				estimatedCostCents: row.estimated_cost_cents,
				monthlyLimit: row.monthly_limit,
				totalResponseTimeMs: row.total_response_time_ms,
				lastCalledAt: row.last_called_at ? new Date(row.last_called_at) : null,
				lastErrorMessage: row.last_error_message,
			}));
		} catch (err) {
			console.error("[API Usage] Company query error:", err);
			return [];
		}
	}
);

/**
 * Get API usage summary statistics
 */
export const getApiUsageSummary = cache(async (): Promise<{
	totalApiCalls: number;
	totalCostCents: number;
	totalErrors: number;
	uniqueApis: number;
	companiesWithUsage: number;
}> => {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) {
			return {
				totalApiCalls: 0,
				totalCostCents: 0,
				totalErrors: 0,
				uniqueApis: 0,
				companiesWithUsage: 0,
			};
		}

		const currentMonth = new Date().toISOString().slice(0, 7);

		const { data, error } = await supabase
			.from("api_usage_tracking")
			.select("api_name, company_id, call_count, error_count, estimated_cost_cents")
			.eq("month_year", currentMonth);

		if (error) {
			console.error("[API Usage] Failed to fetch summary:", error.message);
			return {
				totalApiCalls: 0,
				totalCostCents: 0,
				totalErrors: 0,
				uniqueApis: 0,
				companiesWithUsage: 0,
			};
		}

		const uniqueApis = new Set<string>();
		const uniqueCompanies = new Set<string>();
		let totalApiCalls = 0;
		let totalCostCents = 0;
		let totalErrors = 0;

		for (const row of data || []) {
			uniqueApis.add(row.api_name);
			uniqueCompanies.add(row.company_id);
			totalApiCalls += row.call_count;
			totalCostCents += row.estimated_cost_cents || 0;
			totalErrors += row.error_count;
		}

		return {
			totalApiCalls,
			totalCostCents,
			totalErrors,
			uniqueApis: uniqueApis.size,
			companiesWithUsage: uniqueCompanies.size,
		};
	} catch (err) {
		console.error("[API Usage] Summary query error:", err);
		return {
			totalApiCalls: 0,
			totalCostCents: 0,
			totalErrors: 0,
			uniqueApis: 0,
			companiesWithUsage: 0,
		};
	}
});

/**
 * Get historical API usage trends (last 6 months)
 */
export const getApiUsageTrends = cache(async (): Promise<
	{
		monthYear: string;
		totalCalls: number;
		totalCostCents: number;
		errorRate: number;
	}[]
> => {
	try {
		const supabase = await createServiceSupabaseClient();
		if (!supabase) return [];

		// Generate last 6 months
		const months: string[] = [];
		const now = new Date();
		for (let i = 0; i < 6; i++) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			months.push(date.toISOString().slice(0, 7));
		}

		const { data, error } = await supabase
			.from("api_usage_tracking")
			.select("month_year, call_count, error_count, estimated_cost_cents")
			.in("month_year", months);

		if (error) {
			console.error("[API Usage] Failed to fetch trends:", error.message);
			return [];
		}

		// Aggregate by month
		const monthlyMap = new Map<
			string,
			{ totalCalls: number; totalErrors: number; totalCostCents: number }
		>();

		for (const row of data || []) {
			const existing = monthlyMap.get(row.month_year);
			if (existing) {
				existing.totalCalls += row.call_count;
				existing.totalErrors += row.error_count;
				existing.totalCostCents += row.estimated_cost_cents || 0;
			} else {
				monthlyMap.set(row.month_year, {
					totalCalls: row.call_count,
					totalErrors: row.error_count,
					totalCostCents: row.estimated_cost_cents || 0,
				});
			}
		}

		return months
			.map((month) => {
				const data = monthlyMap.get(month);
				return {
					monthYear: month,
					totalCalls: data?.totalCalls || 0,
					totalCostCents: data?.totalCostCents || 0,
					errorRate:
						data && data.totalCalls > 0
							? Math.round((data.totalErrors / data.totalCalls) * 100)
							: 0,
				};
			})
			.reverse();
	} catch (err) {
		console.error("[API Usage] Trends query error:", err);
		return [];
	}
});

/**
 * Get top APIs by usage this month
 */
export const getTopApisByUsage = cache(
	async (limit: number = 10): Promise<AggregatedApiUsage[]> => {
		const allUsage = await getAggregatedApiUsage();
		return allUsage.slice(0, limit);
	}
);

/**
 * Get APIs with high error rates
 */
export const getHighErrorRateApis = cache(
	async (threshold: number = 5): Promise<AggregatedApiUsage[]> => {
		const allUsage = await getAggregatedApiUsage();
		return allUsage.filter((api) => {
			const errorRate = api.totalCalls > 0 ? (api.errorCount / api.totalCalls) * 100 : 0;
			return errorRate >= threshold;
		});
	}
);
