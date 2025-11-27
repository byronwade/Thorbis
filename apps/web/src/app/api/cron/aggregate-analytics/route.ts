/**
 * Cron Job: Aggregate Analytics
 *
 * Pre-aggregates analytics data for faster dashboard loading.
 * Runs hourly to compute metrics and store in performance_metrics table.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/aggregate-analytics",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */

import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const maxDuration = 300; // 5 minutes max

interface MetricData {
	companyId: string;
	metricType: string;
	metricName: string;
	period: string;
	value: number;
	count: number;
	min: number | null;
	max: number | null;
	p50: number | null;
	p95: number | null;
	p99: number | null;
	metadata?: Record<string, unknown>;
}

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return NextResponse.json(
			{ error: "Cron secret not configured" },
			{ status: 500 },
		);
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const startTime = Date.now();
	const supabase = createServiceSupabaseClient();

	try {
		// Get all companies for aggregation
		const { data: companies } = await supabase
			.from("companies")
			.select("id")
			.limit(1000);

		if (!companies || companies.length === 0) {
			return NextResponse.json({
				success: true,
				message: "No companies to process",
			});
		}

		const metrics: MetricData[] = [];
		const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
		const period = new Date().toISOString().slice(0, 13) + ":00:00"; // Current hour

		for (const company of companies) {
			const companyId = company.id;

			// Aggregate API call metrics
			const apiMetrics = await aggregateApiMetrics(
				supabase,
				companyId,
				hourAgo,
				period,
			);
			metrics.push(...apiMetrics);

			// Aggregate action execution metrics
			const actionMetrics = await aggregateActionMetrics(
				supabase,
				companyId,
				hourAgo,
				period,
			);
			metrics.push(...actionMetrics);

			// Aggregate AI usage metrics
			const aiMetrics = await aggregateAIMetrics(
				supabase,
				companyId,
				hourAgo,
				period,
			);
			metrics.push(...aiMetrics);

			// Aggregate communication metrics
			const commMetrics = await aggregateCommunicationMetrics(
				supabase,
				companyId,
				hourAgo,
				period,
			);
			metrics.push(...commMetrics);

			// Aggregate feature usage metrics
			const featureMetrics = await aggregateFeatureMetrics(
				supabase,
				companyId,
				hourAgo,
				period,
			);
			metrics.push(...featureMetrics);
		}

		// Insert aggregated metrics
		if (metrics.length > 0) {
			const { error: insertError } = await supabase
				.from("performance_metrics")
				.upsert(
					metrics.map((m) => ({
						company_id: m.companyId,
						metric_type: m.metricType,
						metric_name: m.metricName,
						period: m.period,
						value: m.value,
						count: m.count,
						min_value: m.min,
						max_value: m.max,
						p50_value: m.p50,
						p95_value: m.p95,
						p99_value: m.p99,
						metadata: m.metadata || null,
						created_at: new Date().toISOString(),
					})),
					{
						onConflict: "company_id,metric_type,metric_name,period",
					},
				);

			if (insertError) {
				console.error(
					"[Analytics Aggregation] Insert error:",
					insertError.message,
				);
			}
		}

		// Clean up old raw data (optional - keep last 90 days)
		const ninetyDaysAgo = new Date(
			Date.now() - 90 * 24 * 60 * 60 * 1000,
		).toISOString();

		await Promise.all([
			supabase
				.from("api_call_logs")
				.delete()
				.lt("created_at", ninetyDaysAgo),
			supabase
				.from("action_executions")
				.delete()
				.lt("created_at", ninetyDaysAgo),
			supabase
				.from("feature_usage")
				.delete()
				.lt("created_at", ninetyDaysAgo),
		]);

		const duration = Date.now() - startTime;

		return NextResponse.json({
			success: true,
			duration_ms: duration,
			companies_processed: companies.length,
			metrics_generated: metrics.length,
			period,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[Analytics Aggregation] Error:", message);
		return NextResponse.json(
			{ error: "Aggregation failed", details: message },
			{ status: 500 },
		);
	}
}

// Helper function to calculate percentiles
function calculatePercentiles(values: number[]): {
	p50: number | null;
	p95: number | null;
	p99: number | null;
} {
	if (values.length === 0) {
		return { p50: null, p95: null, p99: null };
	}

	const sorted = [...values].sort((a, b) => a - b);
	const p50Index = Math.floor(sorted.length * 0.5);
	const p95Index = Math.floor(sorted.length * 0.95);
	const p99Index = Math.floor(sorted.length * 0.99);

	return {
		p50: sorted[p50Index] ?? null,
		p95: sorted[p95Index] ?? sorted[sorted.length - 1] ?? null,
		p99: sorted[p99Index] ?? sorted[sorted.length - 1] ?? null,
	};
}

async function aggregateApiMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	since: string,
	period: string,
): Promise<MetricData[]> {
	const metrics: MetricData[] = [];

	const { data } = await supabase
		.from("api_call_logs")
		.select("endpoint, latency_ms, response_status")
		.eq("company_id", companyId)
		.gte("created_at", since);

	if (!data || data.length === 0) return metrics;

	// Overall API metrics
	const latencies = data.map((d) => d.latency_ms);
	const errors = data.filter((d) => d.response_status >= 400);
	const percentiles = calculatePercentiles(latencies);

	metrics.push({
		companyId,
		metricType: "api_calls",
		metricName: "overall",
		period,
		value: latencies.reduce((a, b) => a + b, 0) / latencies.length,
		count: data.length,
		min: Math.min(...latencies),
		max: Math.max(...latencies),
		...percentiles,
		metadata: {
			error_count: errors.length,
			error_rate: Math.round((errors.length / data.length) * 100),
		},
	});

	// Per-endpoint metrics
	const byEndpoint = new Map<string, number[]>();
	for (const row of data) {
		const existing = byEndpoint.get(row.endpoint) || [];
		existing.push(row.latency_ms);
		byEndpoint.set(row.endpoint, existing);
	}

	for (const [endpoint, endpointLatencies] of byEndpoint.entries()) {
		if (endpointLatencies.length < 5) continue; // Skip low-volume endpoints

		const endpointPercentiles = calculatePercentiles(endpointLatencies);
		metrics.push({
			companyId,
			metricType: "api_calls",
			metricName: `endpoint:${endpoint}`,
			period,
			value:
				endpointLatencies.reduce((a, b) => a + b, 0) / endpointLatencies.length,
			count: endpointLatencies.length,
			min: Math.min(...endpointLatencies),
			max: Math.max(...endpointLatencies),
			...endpointPercentiles,
		});
	}

	return metrics;
}

async function aggregateActionMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	since: string,
	period: string,
): Promise<MetricData[]> {
	const metrics: MetricData[] = [];

	const { data } = await supabase
		.from("action_executions")
		.select("action_name, action_category, duration_ms, success")
		.eq("company_id", companyId)
		.gte("created_at", since);

	if (!data || data.length === 0) return metrics;

	// Overall action metrics
	const durations = data.map((d) => d.duration_ms);
	const failures = data.filter((d) => !d.success);
	const percentiles = calculatePercentiles(durations);

	metrics.push({
		companyId,
		metricType: "actions",
		metricName: "overall",
		period,
		value: durations.reduce((a, b) => a + b, 0) / durations.length,
		count: data.length,
		min: Math.min(...durations),
		max: Math.max(...durations),
		...percentiles,
		metadata: {
			failure_count: failures.length,
			success_rate: Math.round(((data.length - failures.length) / data.length) * 100),
		},
	});

	// Per-category metrics
	const byCategory = new Map<string, { durations: number[]; failures: number }>();
	for (const row of data) {
		const existing = byCategory.get(row.action_category) || {
			durations: [],
			failures: 0,
		};
		existing.durations.push(row.duration_ms);
		if (!row.success) existing.failures++;
		byCategory.set(row.action_category, existing);
	}

	for (const [category, stats] of byCategory.entries()) {
		if (stats.durations.length < 3) continue;

		const categoryPercentiles = calculatePercentiles(stats.durations);
		metrics.push({
			companyId,
			metricType: "actions",
			metricName: `category:${category}`,
			period,
			value:
				stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length,
			count: stats.durations.length,
			min: Math.min(...stats.durations),
			max: Math.max(...stats.durations),
			...categoryPercentiles,
			metadata: {
				failure_count: stats.failures,
			},
		});
	}

	return metrics;
}

async function aggregateAIMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	since: string,
	period: string,
): Promise<MetricData[]> {
	const metrics: MetricData[] = [];

	const { data } = await supabase
		.from("ai_usage_logs")
		.select("provider, model, input_tokens, output_tokens, cost_cents, latency_ms, success")
		.eq("company_id", companyId)
		.gte("created_at", since);

	if (!data || data.length === 0) return metrics;

	// Overall AI metrics
	const totalTokens = data.reduce(
		(sum, d) => sum + (d.input_tokens || 0) + (d.output_tokens || 0),
		0,
	);
	const totalCost = data.reduce((sum, d) => sum + (d.cost_cents || 0), 0);
	const latencies = data.map((d) => d.latency_ms);
	const percentiles = calculatePercentiles(latencies);

	metrics.push({
		companyId,
		metricType: "ai_usage",
		metricName: "overall",
		period,
		value: totalCost,
		count: data.length,
		min: Math.min(...latencies),
		max: Math.max(...latencies),
		...percentiles,
		metadata: {
			total_tokens: totalTokens,
			avg_tokens_per_request: Math.round(totalTokens / data.length),
			success_count: data.filter((d) => d.success).length,
		},
	});

	// Per-model metrics
	const byModel = new Map<
		string,
		{ count: number; tokens: number; cost: number; latencies: number[] }
	>();
	for (const row of data) {
		const key = `${row.provider}:${row.model}`;
		const existing = byModel.get(key) || {
			count: 0,
			tokens: 0,
			cost: 0,
			latencies: [],
		};
		existing.count++;
		existing.tokens += (row.input_tokens || 0) + (row.output_tokens || 0);
		existing.cost += row.cost_cents || 0;
		existing.latencies.push(row.latency_ms);
		byModel.set(key, existing);
	}

	for (const [model, stats] of byModel.entries()) {
		const modelPercentiles = calculatePercentiles(stats.latencies);
		metrics.push({
			companyId,
			metricType: "ai_usage",
			metricName: `model:${model}`,
			period,
			value: stats.cost,
			count: stats.count,
			min: Math.min(...stats.latencies),
			max: Math.max(...stats.latencies),
			...modelPercentiles,
			metadata: {
				total_tokens: stats.tokens,
			},
		});
	}

	return metrics;
}

async function aggregateCommunicationMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	since: string,
	period: string,
): Promise<MetricData[]> {
	const metrics: MetricData[] = [];

	const { data } = await supabase
		.from("communication_analytics")
		.select("communication_type, event_type")
		.eq("company_id", companyId)
		.gte("created_at", since);

	if (!data || data.length === 0) return metrics;

	// Group by type
	const byType = new Map<string, Record<string, number>>();
	for (const row of data) {
		const existing = byType.get(row.communication_type) || {};
		existing[row.event_type] = (existing[row.event_type] || 0) + 1;
		byType.set(row.communication_type, existing);
	}

	for (const [type, events] of byType.entries()) {
		const sent = events["sent"] || 0;
		const delivered = events["delivered"] || 0;
		const opened = events["opened"] || 0;
		const clicked = events["clicked"] || 0;

		metrics.push({
			companyId,
			metricType: "communications",
			metricName: type,
			period,
			value: sent,
			count: Object.values(events).reduce((a, b) => a + b, 0),
			min: null,
			max: null,
			p50: null,
			p95: null,
			p99: null,
			metadata: {
				delivered,
				opened,
				clicked,
				open_rate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
				click_rate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
			},
		});
	}

	return metrics;
}

async function aggregateFeatureMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	since: string,
	period: string,
): Promise<MetricData[]> {
	const metrics: MetricData[] = [];

	const { data } = await supabase
		.from("feature_usage")
		.select("feature_category, feature_name")
		.eq("company_id", companyId)
		.gte("created_at", since);

	if (!data || data.length === 0) return metrics;

	// Group by category
	const byCategory = new Map<string, number>();
	for (const row of data) {
		const count = byCategory.get(row.feature_category) || 0;
		byCategory.set(row.feature_category, count + 1);
	}

	for (const [category, count] of byCategory.entries()) {
		metrics.push({
			companyId,
			metricType: "features",
			metricName: `category:${category}`,
			period,
			value: count,
			count,
			min: null,
			max: null,
			p50: null,
			p95: null,
			p99: null,
		});
	}

	// Overall feature usage
	metrics.push({
		companyId,
		metricType: "features",
		metricName: "overall",
		period,
		value: data.length,
		count: data.length,
		min: null,
		max: null,
		p50: null,
		p95: null,
		p99: null,
		metadata: {
			unique_features: new Set(data.map((d) => d.feature_name)).size,
			categories: byCategory.size,
		},
	});

	return metrics;
}
