"use client";

/**
 * Dispatch Analytics Dashboard
 *
 * Displays key performance indicators from analytics tables:
 * - analytics_dispatch_efficiency
 * - analytics_technician_leaderboard
 *
 * Shows trends, comparisons, and actionable insights for dispatch optimization
 */

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import {
	ArrowDown,
	ArrowUp,
	Calendar,
	Car,
	Clock,
	DollarSign,
	Gauge,
	MapPin,
	RefreshCw,
	Target,
	TrendingDown,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type DateRange = "today" | "7days" | "30days" | "90days";

type DispatchEfficiencyMetrics = {
	date: string;
	totalJobs: number;
	completedJobs: number;
	cancelledJobs: number;
	utilizationRate: number;
	onTimeArrivalRate: number;
	avgDriveTimeBetweenJobs: number;
	totalDriveMiles: number;
	totalDriveMinutes: number;
	revenuePerHour: number;
	revenuePerMile: number;
	emergencyResponseTimeMinutes: number;
	firstTimeFixRate: number;
	callbackRate: number;
	avgJobDurationMinutes: number;
};

type AnalyticsSummary = {
	totalJobs: number;
	completedJobs: number;
	avgUtilization: number;
	avgOnTimeRate: number;
	avgDriveTime: number;
	totalMiles: number;
	avgRevenuePerHour: number;
	emergencyResponseTime: number;
	firstTimeFixRate: number;
	trend: {
		utilization: number;
		onTimeRate: number;
		revenuePerHour: number;
	};
};

type DispatchAnalyticsProps = {
	companyId: string;
	className?: string;
};

// ============================================================================
// Component
// ============================================================================

export function DispatchAnalytics({
	companyId,
	className,
}: DispatchAnalyticsProps) {
	const [dateRange, setDateRange] = useState<DateRange>("7days");
	const [isLoading, setIsLoading] = useState(true);
	const [metrics, setMetrics] = useState<DispatchEfficiencyMetrics[]>([]);
	const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

	// Fetch analytics data
	const fetchAnalytics = useCallback(async () => {
		setIsLoading(true);
		const supabase = createClient();

		const days =
			dateRange === "today"
				? 1
				: dateRange === "7days"
					? 7
					: dateRange === "30days"
						? 30
						: 90;

		const startDate = startOfDay(subDays(new Date(), days - 1));

		const { data, error } = await supabase
			.from("analytics_dispatch_efficiency")
			.select("*")
			.eq("company_id", companyId)
			.gte("date", startDate.toISOString().split("T")[0])
			.order("date", { ascending: false });

		if (error) {
			console.error("Failed to fetch analytics:", error);
			setIsLoading(false);
			return;
		}

		const metricsData: DispatchEfficiencyMetrics[] =
			data?.map((row) => ({
				date: row.date,
				totalJobs: row.total_jobs || 0,
				completedJobs: row.completed_jobs || 0,
				cancelledJobs: row.cancelled_jobs || 0,
				utilizationRate: row.utilization_rate || 0,
				onTimeArrivalRate: row.on_time_arrival_rate || 0,
				avgDriveTimeBetweenJobs: row.avg_drive_time_between_jobs || 0,
				totalDriveMiles: row.total_drive_miles || 0,
				totalDriveMinutes: row.total_drive_minutes || 0,
				revenuePerHour: row.revenue_per_hour || 0,
				revenuePerMile: row.revenue_per_mile || 0,
				emergencyResponseTimeMinutes: row.emergency_response_time_minutes || 0,
				firstTimeFixRate: row.first_time_fix_rate || 0,
				callbackRate: row.callback_rate || 0,
				avgJobDurationMinutes: row.avg_job_duration_minutes || 0,
			})) || [];

		setMetrics(metricsData);

		// Calculate summary
		if (metricsData.length > 0) {
			const totalJobs = metricsData.reduce((sum, m) => sum + m.totalJobs, 0);
			const completedJobs = metricsData.reduce(
				(sum, m) => sum + m.completedJobs,
				0,
			);
			const avgUtilization =
				metricsData.reduce((sum, m) => sum + m.utilizationRate, 0) /
				metricsData.length;
			const avgOnTimeRate =
				metricsData.reduce((sum, m) => sum + m.onTimeArrivalRate, 0) /
				metricsData.length;
			const avgDriveTime =
				metricsData.reduce((sum, m) => sum + m.avgDriveTimeBetweenJobs, 0) /
				metricsData.length;
			const totalMiles = metricsData.reduce(
				(sum, m) => sum + m.totalDriveMiles,
				0,
			);
			const avgRevenuePerHour =
				metricsData.reduce((sum, m) => sum + m.revenuePerHour, 0) /
				metricsData.length;
			const emergencyResponseTime =
				metricsData
					.filter((m) => m.emergencyResponseTimeMinutes > 0)
					.reduce((sum, m) => sum + m.emergencyResponseTimeMinutes, 0) /
					metricsData.filter((m) => m.emergencyResponseTimeMinutes > 0)
						.length || 0;
			const firstTimeFixRate =
				metricsData.reduce((sum, m) => sum + m.firstTimeFixRate, 0) /
				metricsData.length;

			// Calculate trends (compare first half to second half)
			const midpoint = Math.floor(metricsData.length / 2);
			const recentData = metricsData.slice(0, midpoint);
			const olderData = metricsData.slice(midpoint);

			const calcTrend = (recent: number[], older: number[]): number => {
				if (older.length === 0) return 0;
				const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
				const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
				if (olderAvg === 0) return 0;
				return ((recentAvg - olderAvg) / olderAvg) * 100;
			};

			setSummary({
				totalJobs,
				completedJobs,
				avgUtilization,
				avgOnTimeRate,
				avgDriveTime,
				totalMiles,
				avgRevenuePerHour,
				emergencyResponseTime,
				firstTimeFixRate,
				trend: {
					utilization: calcTrend(
						recentData.map((m) => m.utilizationRate),
						olderData.map((m) => m.utilizationRate),
					),
					onTimeRate: calcTrend(
						recentData.map((m) => m.onTimeArrivalRate),
						olderData.map((m) => m.onTimeArrivalRate),
					),
					revenuePerHour: calcTrend(
						recentData.map((m) => m.revenuePerHour),
						olderData.map((m) => m.revenuePerHour),
					),
				},
			});
		} else {
			setSummary(null);
		}

		setIsLoading(false);
	}, [companyId, dateRange]);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Gauge className="h-5 w-5 text-primary" />
							Dispatch Analytics
						</CardTitle>
						<CardDescription>
							Performance metrics and efficiency insights
						</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						<Select
							value={dateRange}
							onValueChange={(v) => setDateRange(v as DateRange)}
						>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="7days">Last 7 days</SelectItem>
								<SelectItem value="30days">Last 30 days</SelectItem>
								<SelectItem value="90days">Last 90 days</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="icon"
							onClick={fetchAnalytics}
							disabled={isLoading}
						>
							<RefreshCw
								className={cn("h-4 w-4", isLoading && "animate-spin")}
							/>
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{isLoading ? (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{[...Array(8)].map((_, i) => (
							<Skeleton key={i} className="h-24" />
						))}
					</div>
				) : summary ? (
					<>
						{/* Primary KPIs */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<KPICard
								title="Total Jobs"
								value={summary.totalJobs.toString()}
								subtitle={`${summary.completedJobs} completed`}
								icon={Target}
								trend={null}
							/>
							<KPICard
								title="Utilization"
								value={`${summary.avgUtilization.toFixed(1)}%`}
								subtitle="Avg technician capacity"
								icon={Users}
								trend={summary.trend.utilization}
								trendLabel="vs previous period"
							/>
							<KPICard
								title="On-Time Rate"
								value={`${summary.avgOnTimeRate.toFixed(1)}%`}
								subtitle="Arrivals within window"
								icon={Clock}
								trend={summary.trend.onTimeRate}
								trendLabel="vs previous period"
							/>
							<KPICard
								title="Revenue/Hour"
								value={`$${summary.avgRevenuePerHour.toFixed(0)}`}
								subtitle="Per technician hour"
								icon={DollarSign}
								trend={summary.trend.revenuePerHour}
								trendLabel="vs previous period"
							/>
						</div>

						{/* Secondary KPIs */}
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<KPICard
								title="Avg Drive Time"
								value={`${summary.avgDriveTime.toFixed(0)} min`}
								subtitle="Between jobs"
								icon={Car}
								trend={null}
								inverse
							/>
							<KPICard
								title="Total Miles"
								value={summary.totalMiles.toFixed(0)}
								subtitle="Fleet distance"
								icon={MapPin}
								trend={null}
							/>
							<KPICard
								title="Emergency Response"
								value={`${summary.emergencyResponseTime.toFixed(0)} min`}
								subtitle="Avg response time"
								icon={Zap}
								trend={null}
								inverse
							/>
							<KPICard
								title="First-Time Fix"
								value={`${summary.firstTimeFixRate.toFixed(1)}%`}
								subtitle="Resolved first visit"
								icon={Target}
								trend={null}
							/>
						</div>

						{/* Daily Breakdown */}
						{metrics.length > 1 && (
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Daily Trend</h4>
								<div className="space-y-1">
									{metrics.slice(0, 7).map((day) => (
										<div
											key={day.date}
											className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-sm"
										>
											<div className="flex items-center gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span className="font-medium">
													{format(new Date(day.date), "EEE, MMM d")}
												</span>
											</div>
											<div className="flex items-center gap-4 text-muted-foreground">
												<span>{day.totalJobs} jobs</span>
												<span>{day.utilizationRate.toFixed(0)}% util</span>
												<span>{day.onTimeArrivalRate.toFixed(0)}% on-time</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex h-40 items-center justify-center text-muted-foreground">
						<p>No analytics data available for this period</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// ============================================================================
// Sub-Components
// ============================================================================

type KPICardProps = {
	title: string;
	value: string;
	subtitle: string;
	icon: React.ComponentType<{ className?: string }>;
	trend: number | null;
	trendLabel?: string;
	inverse?: boolean; // Lower is better
};

function KPICard({
	title,
	value,
	subtitle,
	icon: Icon,
	trend,
	trendLabel,
	inverse = false,
}: KPICardProps) {
	const isPositive = trend !== null && (inverse ? trend < 0 : trend > 0);
	const isNegative = trend !== null && (inverse ? trend > 0 : trend < 0);

	return (
		<div className="rounded-lg border bg-card p-4">
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">{title}</span>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</div>
			<div className="mt-2 flex items-baseline gap-2">
				<span className="text-2xl font-bold">{value}</span>
				{trend !== null && (
					<Badge
						variant="secondary"
						className={cn(
							"text-xs",
							isPositive && "bg-green-100 text-green-700",
							isNegative && "bg-red-100 text-red-700",
						)}
					>
						{isPositive ? (
							<TrendingUp className="mr-1 h-3 w-3" />
						) : isNegative ? (
							<TrendingDown className="mr-1 h-3 w-3" />
						) : null}
						{Math.abs(trend).toFixed(1)}%
					</Badge>
				)}
			</div>
			<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
			{trendLabel && trend !== null && (
				<p className="mt-0.5 text-xs text-muted-foreground">{trendLabel}</p>
			)}
		</div>
	);
}

// ============================================================================
// Export for Page Integration
// ============================================================================

export default DispatchAnalytics;
