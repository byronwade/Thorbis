/**
 * Analytics Overview Dashboard - Server Component
 *
 * Main dashboard showing real-time KPIs, trends, and quick insights.
 * Uses React.cache() for deduplication and Suspense for streaming.
 */

import { Suspense } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	getAnalyticsTrends,
	getKPISummary,
	getCustomerHealthDistribution,
	getEstimateConversionFunnel,
	getInvoiceAgingSummary,
} from "@/lib/queries/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DollarSign,
	TrendingUp,
	TrendingDown,
	Users,
	Briefcase,
	MessageSquare,
	Target,
	Clock,
	AlertTriangle,
	CheckCircle2,
	ArrowUpRight,
	ArrowDownRight,
	Calendar,
	Receipt,
} from "lucide-react";
import Link from "next/link";
import { AnalyticsCharts } from "./analytics-charts";

// Formatters
function formatCurrency(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(1)}M`;
	}
	if (amount >= 1000) {
		return `$${(amount / 1000).toFixed(1)}K`;
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatPercent(value: number | null): string {
	if (value === null) return "—";
	return `${value.toFixed(1)}%`;
}

function formatNumber(value: number): string {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}
	return value.toLocaleString();
}

// KPI Card Component
function KPICard({
	title,
	value,
	subtitle,
	icon,
	trend,
	trendValue,
	href,
}: {
	title: string;
	value: string;
	subtitle?: string;
	icon: React.ReactNode;
	trend?: "up" | "down" | "neutral";
	trendValue?: string;
	href?: string;
}) {
	const content = (
		<Card className="relative overflow-hidden transition-all hover:shadow-md">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{title}</CardTitle>
				<div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
			</CardHeader>
			<CardContent>
				<div className="text-xl md:text-2xl font-bold">{value}</div>
				<div className="mt-1 flex items-center gap-2">
					{trend && trendValue && (
						<span
							className={`flex items-center text-xs font-medium ${
								trend === "up"
									? "text-green-600"
									: trend === "down"
										? "text-red-600"
										: "text-muted-foreground"
							}`}
						>
							{trend === "up" ? (
								<ArrowUpRight className="mr-0.5 h-3 w-3" />
							) : trend === "down" ? (
								<ArrowDownRight className="mr-0.5 h-3 w-3" />
							) : null}
							{trendValue}
						</span>
					)}
					{subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
				</div>
			</CardContent>
		</Card>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{content}
			</Link>
		);
	}

	return content;
}

// Quick Stat Card for smaller metrics
function QuickStatCard({
	label,
	value,
	color = "blue",
}: {
	label: string;
	value: string | number;
	color?: "blue" | "green" | "yellow" | "red" | "purple";
}) {
	const colorClasses = {
		blue: "bg-blue-500/10 text-blue-600",
		green: "bg-green-500/10 text-green-600",
		yellow: "bg-yellow-500/10 text-yellow-600",
		red: "bg-red-500/10 text-red-600",
		purple: "bg-purple-500/10 text-purple-600",
	};

	return (
		<div className="rounded-lg border bg-card/50 p-3 md:p-4">
			<div className="text-xs font-medium text-muted-foreground">{label}</div>
			<div className={`mt-1 text-lg md:text-xl font-bold ${colorClasses[color].split(" ")[1]}`}>{value}</div>
		</div>
	);
}

// Report Link Card
function ReportLinkCard({
	title,
	description,
	href,
	icon,
	badge,
}: {
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	badge?: string;
}) {
	return (
		<Link href={href} className="block group">
			<Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm group-hover:bg-muted/30">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
						{badge && (
							<Badge variant="secondary" className="text-xs">
								{badge}
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<CardTitle className="text-base group-hover:text-primary">{title}</CardTitle>
					<CardDescription className="mt-1 text-xs">{description}</CardDescription>
				</CardContent>
			</Card>
		</Link>
	);
}

// Main Analytics Overview Component
export async function AnalyticsOverview() {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">Please select a company to view analytics</p>
			</div>
		);
	}

	// Fetch all data in parallel
	const [trends, kpis, customerHealth, estimateFunnel, invoiceAging] = await Promise.all([
		getAnalyticsTrends(companyId, 30),
		getKPISummary(companyId),
		getCustomerHealthDistribution(companyId),
		getEstimateConversionFunnel(companyId, 30),
		getInvoiceAgingSummary(companyId),
	]);

	// Calculate totals from trends
	const totalRevenue = trends.revenue.reduce((sum, day) => sum + day.value, 0);
	const totalJobs = trends.jobs.reduce((sum, day) => sum + day.value, 0);
	const totalComms = trends.communications.reduce((sum, day) => sum + day.value + (day.value2 || 0), 0);

	// Calculate previous period for comparison (simple approximation)
	const halfwayPoint = Math.floor(trends.revenue.length / 2);
	const currentPeriodRevenue = trends.revenue.slice(halfwayPoint).reduce((sum, day) => sum + day.value, 0);
	const previousPeriodRevenue = trends.revenue.slice(0, halfwayPoint).reduce((sum, day) => sum + day.value, 0);
	const revenueChange =
		previousPeriodRevenue > 0
			? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
			: 0;

	const currentPeriodJobs = trends.jobs.slice(halfwayPoint).reduce((sum, day) => sum + day.value, 0);
	const previousPeriodJobs = trends.jobs.slice(0, halfwayPoint).reduce((sum, day) => sum + day.value, 0);
	const jobsChange =
		previousPeriodJobs > 0 ? ((currentPeriodJobs - previousPeriodJobs) / previousPeriodJobs) * 100 : 0;

	// Customer health totals
	const totalCustomers =
		customerHealth.low + customerHealth.medium + customerHealth.high + customerHealth.unknown;

	return (
		<div className="flex w-full flex-col gap-4 p-4 md:p-6">
			{/* Primary KPIs */}
			<div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				<KPICard
					title="Total Revenue"
					value={formatCurrency(totalRevenue)}
					subtitle="Last 30 days"
					icon={<DollarSign className="h-4 w-4" />}
					trend={revenueChange >= 0 ? "up" : "down"}
					trendValue={`${Math.abs(revenueChange).toFixed(1)}%`}
					href="/dashboard/reports/financial"
				/>
				<KPICard
					title="Jobs Completed"
					value={formatNumber(totalJobs)}
					subtitle="Last 30 days"
					icon={<Briefcase className="h-4 w-4" />}
					trend={jobsChange >= 0 ? "up" : "down"}
					trendValue={`${Math.abs(jobsChange).toFixed(1)}%`}
					href="/dashboard/reports/jobs"
				/>
				<KPICard
					title="Active Customers"
					value={formatNumber(totalCustomers)}
					subtitle={`${customerHealth.low} healthy`}
					icon={<Users className="h-4 w-4" />}
					href="/dashboard/reports/customers"
				/>
				<KPICard
					title="Communications"
					value={formatNumber(totalComms)}
					subtitle="Last 30 days"
					icon={<MessageSquare className="h-4 w-4" />}
				/>
			</div>

			{/* Charts Section */}
			<Suspense fallback={<ChartsSkeleton />}>
				<AnalyticsCharts trends={trends} />
			</Suspense>

			{/* Secondary Metrics Row */}
			<div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				{/* Estimate Conversion */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-base">
							<Target className="h-4 w-4 text-primary" />
							Estimate Conversion
						</CardTitle>
						<CardDescription>Last 30 days</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex items-baseline gap-2">
							<span className="text-3xl font-bold">{formatPercent(estimateFunnel.conversionRate)}</span>
							<Badge variant={estimateFunnel.conversionRate >= 50 ? "default" : "secondary"}>
								{estimateFunnel.won} won
							</Badge>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Total Sent</span>
								<span className="font-medium">{estimateFunnel.total}</span>
							</div>
							<Progress value={estimateFunnel.conversionRate} className="h-2" />
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>Won: {estimateFunnel.won}</span>
								<span>Pending: {estimateFunnel.pending}</span>
								<span>Lost: {estimateFunnel.lost}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Customer Health */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-base">
							<Users className="h-4 w-4 text-primary" />
							Customer Health
						</CardTitle>
						<CardDescription>Churn risk distribution</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-green-500" />
									<span className="text-sm">Low Risk</span>
								</div>
								<span className="font-medium">{customerHealth.low}</span>
							</div>
							<Progress
								value={totalCustomers > 0 ? (customerHealth.low / totalCustomers) * 100 : 0}
								className="h-2 [&>div]:bg-green-500"
							/>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<span className="text-sm">Medium Risk</span>
								</div>
								<span className="font-medium">{customerHealth.medium}</span>
							</div>
							<Progress
								value={totalCustomers > 0 ? (customerHealth.medium / totalCustomers) * 100 : 0}
								className="h-2 [&>div]:bg-yellow-500"
							/>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<span className="text-sm">High Risk</span>
								</div>
								<span className="font-medium">{customerHealth.high}</span>
							</div>
							<Progress
								value={totalCustomers > 0 ? (customerHealth.high / totalCustomers) * 100 : 0}
								className="h-2 [&>div]:bg-red-500"
							/>
						</div>
					</CardContent>
				</Card>

				{/* KPI Highlights */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-base">
							<CheckCircle2 className="h-4 w-4 text-primary" />
							Performance KPIs
						</CardTitle>
						<CardDescription>Team metrics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">First Time Fix Rate</span>
								<Badge variant={kpis.firstTimeFixRate && kpis.firstTimeFixRate >= 85 ? "default" : "secondary"}>
									{formatPercent(kpis.firstTimeFixRate)}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Utilization Rate</span>
								<Badge variant={kpis.utilizationRate && kpis.utilizationRate >= 75 ? "default" : "secondary"}>
									{formatPercent(kpis.utilizationRate)}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">On-Time Rate</span>
								<Badge variant={kpis.onTimeRate && kpis.onTimeRate >= 90 ? "default" : "secondary"}>
									{formatPercent(kpis.onTimeRate)}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Avg Customer Rating</span>
								<Badge variant={kpis.avgCustomerRating && kpis.avgCustomerRating >= 4.5 ? "default" : "secondary"}>
									{kpis.avgCustomerRating ? `${kpis.avgCustomerRating.toFixed(1)} ★` : "—"}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Access Reports */}
			<div>
				<h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">Quick Access Reports</h3>
				<div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					<ReportLinkCard
						title="Financial Reports"
						description="P&L, cash flow, AR aging, and revenue analysis"
						href="/dashboard/reports/financial"
						icon={<DollarSign className="h-5 w-5" />}
						badge="12 reports"
					/>
					<ReportLinkCard
						title="Job Performance"
						description="Completion rates, efficiency, and profitability"
						href="/dashboard/reports/jobs"
						icon={<Briefcase className="h-5 w-5" />}
						badge="10 reports"
					/>
					<ReportLinkCard
						title="Team Leaderboard"
						description="Technician rankings and performance metrics"
						href="/dashboard/reports/technicians"
						icon={<Users className="h-5 w-5" />}
						badge="8 reports"
					/>
					<ReportLinkCard
						title="Customer Analytics"
						description="Retention, LTV, acquisition, and segments"
						href="/dashboard/reports/customers"
						icon={<Target className="h-5 w-5" />}
						badge="9 reports"
					/>
				</div>
			</div>

			{/* Invoice Aging Summary */}
			{invoiceAging && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Receipt className="h-5 w-5 text-primary" />
							Accounts Receivable Aging
						</CardTitle>
						<CardDescription>Outstanding invoice breakdown</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
							<QuickStatCard
								label="Current"
								value={formatCurrency(invoiceAging.current?.amount || 0)}
								color="green"
							/>
							<QuickStatCard
								label="1-30 Days"
								value={formatCurrency(invoiceAging["1-30"]?.amount || 0)}
								color="blue"
							/>
							<QuickStatCard
								label="31-60 Days"
								value={formatCurrency(invoiceAging["31-60"]?.amount || 0)}
								color="yellow"
							/>
							<QuickStatCard
								label="61-90 Days"
								value={formatCurrency(invoiceAging["61-90"]?.amount || 0)}
								color="yellow"
							/>
							<QuickStatCard
								label="90+ Days"
								value={formatCurrency(invoiceAging["90+"]?.amount || 0)}
								color="red"
							/>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

// Skeleton for charts loading
function ChartsSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-48" />
				<Skeleton className="h-4 w-32" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-[300px] w-full" />
			</CardContent>
		</Card>
	);
}
