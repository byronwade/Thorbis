/**
 * Analytics Dashboard Data Component
 *
 * Server component that fetches and displays comprehensive analytics data.
 */

import { createClient } from "@/lib/supabase/server";
import { getApiCallStats, getSlowApiCalls } from "@/lib/analytics/api-call-tracker";
import { getActionStats, getFailedActions } from "@/lib/analytics/action-tracker";
import { getCommunicationStats, getCallStats } from "@/lib/analytics/communication-tracker";
import { getAIUsageSummary, getAICostByDay, getApprovalStats } from "@/lib/analytics/ai-tracker";
import { InternalAnalyticsDashboard } from "./internal-analytics-dashboard";

export async function AnalyticsData() {
	const supabase = await createClient();

	if (!supabase) {
		return (
			<div className="p-4 text-destructive">
				Failed to connect to database
			</div>
		);
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return (
			<div className="p-4 text-destructive">
				You must be logged in to view analytics
			</div>
		);
	}

	// Get company ID
	const companyId =
		(user.user_metadata?.company_id as string) ||
		(user.app_metadata?.company_id as string);

	if (!companyId) {
		return (
			<div className="p-4 text-muted-foreground">
				No company associated with your account
			</div>
		);
	}

	// Fetch all analytics data in parallel
	const [
		apiStats,
		slowApiCalls,
		actionStats,
		failedActions,
		communicationStats,
		callStats,
		aiSummary,
		aiCostByDay,
		approvalStats,
	] = await Promise.all([
		getApiCallStats(companyId, 24),
		getSlowApiCalls(companyId, 1000, 10),
		getActionStats(companyId, 24),
		getFailedActions(companyId, 24, 10),
		getCommunicationStats(companyId, undefined, 30),
		getCallStats(companyId, 30),
		getAIUsageSummary(companyId, 30),
		getAICostByDay(companyId, 30),
		getApprovalStats(companyId, 30),
	]);

	// Calculate overview metrics
	const totalApiCalls = apiStats.reduce((sum, s) => sum + s.total_calls, 0);
	const avgApiLatency =
		apiStats.length > 0
			? Math.round(
					apiStats.reduce((sum, s) => sum + s.avg_latency_ms, 0) / apiStats.length,
				)
			: 0;
	const apiErrorRate =
		totalApiCalls > 0
			? Math.round(
					(apiStats.reduce((sum, s) => sum + s.error_count, 0) / totalApiCalls) *
						100,
				)
			: 0;

	const totalActions = actionStats.reduce((sum, s) => sum + s.total_executions, 0);
	const actionSuccessRate =
		actionStats.length > 0
			? Math.round(
					actionStats.reduce((sum, s) => sum + s.success_rate, 0) /
						actionStats.length,
				)
			: 100;

	const totalAICost = aiSummary.reduce((sum, s) => sum + s.totalCostCents, 0);
	const totalAITokens = aiSummary.reduce((sum, s) => sum + s.totalTokens, 0);
	const totalAIRequests = aiSummary.reduce((sum, s) => sum + s.totalRequests, 0);

	const emailStats = communicationStats.find((s) => s.communicationType === "email");
	const smsStats = communicationStats.find((s) => s.communicationType === "sms");

	return (
		<InternalAnalyticsDashboard
			overview={{
				apiCalls: {
					total: totalApiCalls,
					avgLatencyMs: avgApiLatency,
					errorRate: apiErrorRate,
				},
				actions: {
					total: totalActions,
					successRate: actionSuccessRate,
				},
				ai: {
					totalCostCents: totalAICost,
					totalTokens: totalAITokens,
					totalRequests: totalAIRequests,
				},
				communications: {
					emailsSent: emailStats?.totalSent || 0,
					emailOpenRate: emailStats?.openRate || 0,
					smsSent: smsStats?.totalSent || 0,
					callsConnected: callStats.connectedCalls,
				},
			}}
			apiStats={apiStats}
			slowApiCalls={slowApiCalls.map((c) => ({
				endpoint: c.endpoint,
				method: c.method,
				latencyMs: c.latencyMs,
				status: c.responseStatus,
				createdAt: c.createdAt.toISOString(),
			}))}
			actionStats={actionStats}
			failedActions={failedActions.map((a) => ({
				name: a.actionName,
				category: a.actionCategory,
				errorType: a.errorType || "Unknown",
				errorMessage: a.errorMessage || "Unknown error",
				createdAt: a.createdAt.toISOString(),
			}))}
			aiSummary={aiSummary}
			aiCostByDay={aiCostByDay}
			approvalStats={approvalStats}
			communicationStats={communicationStats}
			callStats={callStats}
		/>
	);
}
