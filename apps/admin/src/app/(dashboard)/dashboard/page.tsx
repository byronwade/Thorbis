import { Suspense } from "react";
import {
	Building2,
	DollarSign,
	TrendingUp,
	Users,
	Activity,
	AlertCircle,
	Zap,
	Bot,
	Mail,
	AlertTriangle,
	Clock,
	Server,
} from "lucide-react";
import { SectionLayout } from "@/components/layout/section-layout";
import { Badge } from "@stratos/ui/badge";
import { getApiCallStats } from "@web/lib/analytics/api-call-tracker";
import { getActionStats, getFailedActions } from "@web/lib/analytics/action-tracker";
import { getCommunicationStats, getCallStats } from "@web/lib/analytics/communication-tracker";
import { getAIUsageSummary } from "@web/lib/analytics/ai-tracker";
import { ApiUsageSectionSkeleton } from "@/components/api-usage-section";
import { ApiUsageData } from "@/components/api-usage-data";

// Force dynamic rendering for real-time data
export const dynamic = "force-dynamic";

/**
 * Admin Dashboard - Today Page
 *
 * Shows platform overview with key metrics including internal analytics.
 * No sidebar on this page - full width content.
 */
export default function AdminDashboardPage() {
	return (
		<SectionLayout
			title="Today"
			subtitle="Platform Overview"
			showSidebar={false}
		>
			<div className="mx-auto max-w-7xl p-6">
				{/* Page Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold tracking-tight">
						Welcome back, Admin
					</h1>
					<p className="text-muted-foreground">
						Here's what's happening on the Stratos platform today.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
					<StatsCard
						title="Total Companies"
						value="--"
						change="+-- this month"
						icon={Building2}
					/>
					<StatsCard
						title="Active Users"
						value="--"
						change="+-- this week"
						icon={Users}
					/>
					<StatsCard
						title="Monthly Revenue"
						value="$--"
						change="+--% from last month"
						icon={DollarSign}
					/>
					<StatsCard
						title="Platform Health"
						value="--"
						change="All systems operational"
						icon={Activity}
						positive
					/>
				</div>

				{/* Internal Analytics Section */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">System Analytics</h2>
						<Badge variant="secondary">Last 24h</Badge>
					</div>
					<Suspense fallback={<InternalAnalyticsSkeleton />}>
						<InternalAnalyticsData />
					</Suspense>
				</div>

				{/* External API Usage Section */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<Server className="h-5 w-5 text-muted-foreground" />
							<h2 className="text-lg font-semibold">External API Usage & Costs</h2>
						</div>
						<Badge variant="secondary">Real-time</Badge>
					</div>
					<Suspense fallback={<ApiUsageSectionSkeleton />}>
						<ApiUsageData />
					</Suspense>
				</div>

				{/* Quick Actions */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
					<QuickActionCard
						title="Recent Signups"
						description="-- new companies this week"
						href="/dashboard/work/companies"
						icon={Building2}
					/>
					<QuickActionCard
						title="Support Tickets"
						description="-- open tickets"
						href="/dashboard/work/support"
						icon={AlertCircle}
					/>
					<QuickActionCard
						title="Revenue Growth"
						description="View detailed analytics"
						href="/dashboard/analytics"
						icon={TrendingUp}
					/>
				</div>

				{/* Recent Activity */}
				<div className="rounded-lg border bg-card">
					<div className="p-6 border-b">
						<h2 className="text-lg font-semibold">Recent Activity</h2>
						<p className="text-sm text-muted-foreground">
							Latest platform events
						</p>
					</div>
					<div className="p-6">
						<div className="text-center py-8 text-muted-foreground">
							<Activity className="size-12 mx-auto mb-4 opacity-20" />
							<p>Activity feed coming soon</p>
						</div>
					</div>
				</div>
			</div>
		</SectionLayout>
	);
}

/**
 * Internal Analytics Data - Server Component
 * Fetches and displays real analytics data
 */
async function InternalAnalyticsData() {
	// Fetch analytics for all companies (admin view - no company filter)
	const [apiStats, actionStats, failedActions, communicationStats, callStats, aiSummary] =
		await Promise.all([
			getApiCallStats(undefined as any, 24).catch(() => []),
			getActionStats(undefined as any, 24).catch(() => []),
			getFailedActions(undefined as any, 24, 10).catch(() => []),
			getCommunicationStats(undefined as any, undefined, 1).catch(() => []),
			getCallStats(undefined as any, 1).catch(() => ({
				totalCalls: 0,
				connectedCalls: 0,
				failedCalls: 0,
				voicemails: 0,
				averageDurationSeconds: 0,
				totalDurationMinutes: 0,
				connectRate: 0,
			})),
			getAIUsageSummary(undefined as any, 1).catch(() => []),
		]);

	// Calculate metrics
	const totalApiCalls = apiStats.reduce((sum, s) => sum + s.total_calls, 0);
	const avgApiLatency =
		apiStats.length > 0
			? Math.round(apiStats.reduce((sum, s) => sum + s.avg_latency_ms, 0) / apiStats.length)
			: 0;
	const apiErrorRate =
		totalApiCalls > 0
			? Math.round((apiStats.reduce((sum, s) => sum + s.error_count, 0) / totalApiCalls) * 100)
			: 0;

	const totalActions = actionStats.reduce((sum, s) => sum + s.total_executions, 0);
	const actionSuccessRate =
		actionStats.length > 0
			? Math.round(actionStats.reduce((sum, s) => sum + s.success_rate, 0) / actionStats.length)
			: 100;

	const totalAICost = aiSummary.reduce((sum, s) => sum + s.totalCostCents, 0);
	const totalAITokens = aiSummary.reduce((sum, s) => sum + s.totalTokens, 0);
	const totalAIRequests = aiSummary.reduce((sum, s) => sum + s.totalRequests, 0);

	const emailStats = communicationStats.find((s) => s.communicationType === "email");
	const smsStats = communicationStats.find((s) => s.communicationType === "sms");

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	};

	const formatCost = (cents: number) => `$${(cents / 100).toFixed(2)}`;
	const formatDuration = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`);

	return (
		<div className="rounded-lg border bg-card">
			<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
				{/* API Calls */}
				<div className="p-4 md:p-6">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<Activity className="h-4 w-4" />
						<span className="text-xs font-medium">API Calls</span>
					</div>
					<p className="text-2xl font-bold">{formatNumber(totalApiCalls)}</p>
					<div className="flex items-center gap-2 text-xs mt-1">
						<Clock className="h-3 w-3 text-muted-foreground" />
						<span className="text-muted-foreground">{formatDuration(avgApiLatency)} avg</span>
						{apiErrorRate > 5 ? (
							<Badge variant="destructive" className="text-[10px] h-4 px-1">
								{apiErrorRate}% err
							</Badge>
						) : (
							<Badge variant="secondary" className="text-[10px] h-4 px-1">
								{apiErrorRate}% err
							</Badge>
						)}
					</div>
				</div>

				{/* Server Actions */}
				<div className="p-4 md:p-6">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<Zap className="h-4 w-4" />
						<span className="text-xs font-medium">Actions</span>
					</div>
					<p className="text-2xl font-bold">{formatNumber(totalActions)}</p>
					<div className="flex items-center gap-2 text-xs mt-1">
						{actionSuccessRate >= 95 ? (
							<TrendingUp className="h-3 w-3 text-green-500" />
						) : (
							<AlertTriangle className="h-3 w-3 text-red-500" />
						)}
						<span className={actionSuccessRate >= 95 ? "text-green-500" : "text-red-500"}>
							{actionSuccessRate}% success
						</span>
						{failedActions.length > 0 && (
							<Badge variant="destructive" className="text-[10px] h-4 px-1">
								{failedActions.length} failed
							</Badge>
						)}
					</div>
				</div>

				{/* AI Usage */}
				<div className="p-4 md:p-6">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<Bot className="h-4 w-4" />
						<span className="text-xs font-medium">AI Usage</span>
					</div>
					<p className="text-2xl font-bold">{formatCost(totalAICost)}</p>
					<div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground">
						<span>{formatNumber(totalAITokens)} tokens</span>
						<span>•</span>
						<span>{totalAIRequests} req</span>
					</div>
				</div>

				{/* Communications */}
				<div className="p-4 md:p-6">
					<div className="flex items-center gap-2 text-muted-foreground mb-2">
						<Mail className="h-4 w-4" />
						<span className="text-xs font-medium">Comms</span>
					</div>
					<p className="text-2xl font-bold">
						{formatNumber((emailStats?.totalSent || 0) + (smsStats?.totalSent || 0))}
					</p>
					<div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground">
						<span>{emailStats?.openRate || 0}% open</span>
						<span>•</span>
						<span>{callStats.connectedCalls} calls</span>
					</div>
				</div>
			</div>

			{/* Alert Row */}
			{(apiErrorRate > 5 || failedActions.length > 5) && (
				<div className="border-t p-4 bg-destructive/5 flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-destructive" />
					<span className="text-sm text-destructive">
						{apiErrorRate > 5 && `High API error rate (${apiErrorRate}%). `}
						{failedActions.length > 5 && `${failedActions.length} failed actions need attention.`}
					</span>
				</div>
			)}
		</div>
	);
}

function InternalAnalyticsSkeleton() {
	return (
		<div className="rounded-lg border bg-card">
			<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="p-4 md:p-6">
						<div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
						<div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
						<div className="h-3 w-24 bg-muted animate-pulse rounded" />
					</div>
				))}
			</div>
		</div>
	);
}

function StatsCard({
	title,
	value,
	change,
	icon: Icon,
	positive,
}: {
	title: string;
	value: string;
	change: string;
	icon: React.ComponentType<{ className?: string }>;
	positive?: boolean;
}) {
	return (
		<div className="rounded-lg border bg-card p-6">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-muted-foreground">
					{title}
				</span>
				<Icon className="size-4 text-muted-foreground" />
			</div>
			<div className="mt-2">
				<span className="text-2xl font-bold">{value}</span>
			</div>
			<p
				className={`text-xs mt-1 ${positive ? "text-green-600" : "text-muted-foreground"}`}
			>
				{change}
			</p>
		</div>
	);
}

function QuickActionCard({
	title,
	description,
	href,
	icon: Icon,
}: {
	title: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
}) {
	return (
		<a
			href={href}
			className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
		>
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
				<Icon className="size-5 text-primary" />
			</div>
			<div>
				<h3 className="font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</a>
	);
}
