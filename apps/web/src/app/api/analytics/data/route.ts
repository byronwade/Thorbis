/**
 * API Route: Analytics Data
 *
 * Returns comprehensive analytics data for the dashboard.
 * Supports filtering by time range and data type.
 */

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getApiCallStats, getSlowApiCalls } from "@/lib/analytics/api-call-tracker";
import { getActionStats, getFailedActions, getActionVolumeByCategory } from "@/lib/analytics/action-tracker";
import { getCommunicationStats, getCallStats, getTopEmailTemplates } from "@/lib/analytics/communication-tracker";
import { getAIUsageSummary, getAICostByDay, getToolCallStats, getApprovalStats } from "@/lib/analytics/ai-tracker";

export const maxDuration = 60;

type AnalyticsType =
	| "overview"
	| "api_calls"
	| "actions"
	| "communications"
	| "ai"
	| "features"
	| "all";

export async function GET(request: NextRequest) {
	try {
		// Verify authentication
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 },
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get company ID
		const companyId =
			(user.user_metadata?.company_id as string) ||
			(user.app_metadata?.company_id as string);

		if (!companyId) {
			return NextResponse.json(
				{ error: "Company ID not found" },
				{ status: 400 },
			);
		}

		// Parse query parameters
		const searchParams = request.nextUrl.searchParams;
		const type = (searchParams.get("type") || "overview") as AnalyticsType;
		const hours = parseInt(searchParams.get("hours") || "24", 10);
		const days = parseInt(searchParams.get("days") || "30", 10);

		// Build response based on type
		const response: Record<string, unknown> = {
			companyId,
			generatedAt: new Date().toISOString(),
			timeRange: { hours, days },
		};

		// Overview - high-level stats
		if (type === "overview" || type === "all") {
			const [apiStats, actionStats, commStats, aiSummary] = await Promise.all([
				getApiCallStats(companyId, hours),
				getActionStats(companyId, hours),
				getCommunicationStats(companyId, undefined, days),
				getAIUsageSummary(companyId, days),
			]);

			// Calculate overview metrics
			const totalApiCalls = apiStats.reduce((sum, s) => sum + s.total_calls, 0);
			const avgApiLatency =
				apiStats.length > 0
					? Math.round(
							apiStats.reduce((sum, s) => sum + s.avg_latency_ms, 0) /
								apiStats.length,
						)
					: 0;
			const apiErrorRate =
				apiStats.length > 0
					? Math.round(
							(apiStats.reduce((sum, s) => sum + s.error_count, 0) /
								totalApiCalls) *
								100,
						)
					: 0;

			const totalActions = actionStats.reduce(
				(sum, s) => sum + s.total_executions,
				0,
			);
			const actionSuccessRate =
				actionStats.length > 0
					? Math.round(
							actionStats.reduce((sum, s) => sum + s.success_rate, 0) /
								actionStats.length,
						)
					: 100;

			const totalAICost = aiSummary.reduce(
				(sum, s) => sum + s.totalCostCents,
				0,
			);
			const totalAITokens = aiSummary.reduce(
				(sum, s) => sum + s.totalTokens,
				0,
			);

			response.overview = {
				apiCalls: {
					total: totalApiCalls,
					avgLatencyMs: avgApiLatency,
					errorRate: apiErrorRate,
				},
				actions: {
					total: totalActions,
					successRate: actionSuccessRate,
				},
				communications: {
					email: commStats.find((s) => s.communicationType === "email") || null,
					sms: commStats.find((s) => s.communicationType === "sms") || null,
					call: commStats.find((s) => s.communicationType === "call") || null,
				},
				ai: {
					totalCostCents: totalAICost,
					totalTokens: totalAITokens,
					totalRequests: aiSummary.reduce(
						(sum, s) => sum + s.totalRequests,
						0,
					),
				},
			};
		}

		// API Calls detail
		if (type === "api_calls" || type === "all") {
			const [apiStats, slowCalls] = await Promise.all([
				getApiCallStats(companyId, hours),
				getSlowApiCalls(companyId, 1000, 10),
			]);

			response.apiCalls = {
				stats: apiStats,
				slowCalls: slowCalls.map((c) => ({
					endpoint: c.endpoint,
					method: c.method,
					latencyMs: c.latencyMs,
					status: c.responseStatus,
					createdAt: c.createdAt,
				})),
			};
		}

		// Actions detail
		if (type === "actions" || type === "all") {
			const [actionStats, failedActions, volumeByCategory] = await Promise.all([
				getActionStats(companyId, hours),
				getFailedActions(companyId, hours, 20),
				getActionVolumeByCategory(companyId, 7),
			]);

			response.actions = {
				stats: actionStats,
				failed: failedActions.map((a) => ({
					name: a.actionName,
					category: a.actionCategory,
					errorType: a.errorType,
					errorMessage: a.errorMessage,
					createdAt: a.createdAt,
				})),
				volumeByCategory,
			};
		}

		// Communications detail
		if (type === "communications" || type === "all") {
			const [commStats, callStats, topTemplates] = await Promise.all([
				getCommunicationStats(companyId, undefined, days),
				getCallStats(companyId, days),
				getTopEmailTemplates(companyId, days, 10),
			]);

			response.communications = {
				stats: commStats,
				calls: callStats,
				topEmailTemplates: topTemplates,
			};
		}

		// AI detail
		if (type === "ai" || type === "all") {
			const [aiSummary, costByDay, toolStats, approvalStats] = await Promise.all([
				getAIUsageSummary(companyId, days),
				getAICostByDay(companyId, days),
				getToolCallStats(companyId, days),
				getApprovalStats(companyId, days),
			]);

			response.ai = {
				summary: aiSummary,
				costByDay,
				toolStats,
				approvalStats,
			};
		}

		// Feature usage detail
		if (type === "features" || type === "all") {
			const serviceClient = await createClient();
			if (serviceClient) {
				const cutoff = new Date(
					Date.now() - days * 24 * 60 * 60 * 1000,
				).toISOString();

				// Get feature usage stats
				const { data: featureData } = await serviceClient
					.from("feature_usage")
					.select("feature_name, feature_category, action_type")
					.eq("company_id", companyId)
					.gte("created_at", cutoff);

				// Aggregate feature usage
				const featureMap = new Map<
					string,
					{ name: string; category: string; count: number; actions: Record<string, number> }
				>();

				for (const row of featureData || []) {
					const key = `${row.feature_category}:${row.feature_name}`;
					const existing = featureMap.get(key) || {
						name: row.feature_name,
						category: row.feature_category,
						count: 0,
						actions: {},
					};

					existing.count++;
					existing.actions[row.action_type] =
						(existing.actions[row.action_type] || 0) + 1;

					featureMap.set(key, existing);
				}

				response.features = {
					usage: Array.from(featureMap.values()).sort(
						(a, b) => b.count - a.count,
					),
					totalEvents: featureData?.length || 0,
				};
			}
		}

		return NextResponse.json({
			success: true,
			data: response,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[Analytics Data] Error:", message);
		return NextResponse.json(
			{ error: "Failed to fetch analytics", details: message },
			{ status: 500 },
		);
	}
}
