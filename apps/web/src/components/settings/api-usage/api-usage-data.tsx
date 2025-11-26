import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Clock,
	DollarSign,
	Server,
	TrendingUp,
	Wifi,
	WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { API_SERVICES } from "@/lib/api/api-service-config";
import { getSystemHealthSummary } from "@/lib/api/health-check-service";
import {
	getServicesApproachingLimits,
	getUsageSummary,
} from "@/lib/api/usage-sync-service";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Format currency from cents to dollars
 */
function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

/**
 * Format large numbers with K/M suffixes
 */
function formatNumber(num: number): string {
	if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(1)}M`;
	}
	if (num >= 1_000) {
		return `${(num / 1_000).toFixed(1)}K`;
	}
	return num.toString();
}

/**
 * Get alert level color classes
 */
function getAlertColor(level: string): string {
	switch (level) {
		case "critical":
			return "text-red-600 bg-red-100 dark:bg-red-900/30";
		case "warning":
			return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
		default:
			return "text-green-600 bg-green-100 dark:bg-green-900/30";
	}
}

/**
 * Get health status color classes
 */
function getHealthColor(status: string): string {
	switch (status) {
		case "down":
			return "text-red-600";
		case "degraded":
			return "text-yellow-600";
		default:
			return "text-green-600";
	}
}

export async function ApiUsageData() {
	// Fetch all data
	const [usageSummary, approachingLimits, healthSummary] = await Promise.all([
		getUsageSummary(),
		getServicesApproachingLimits(),
		getSystemHealthSummary(),
	]);

	// Calculate monthly cost projection
	const currentDay = new Date().getDate();
	const daysInMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		0,
	).getDate();
	const projectedMonthlyCost = usageSummary
		? Math.round(
				(usageSummary.total_cost_cents / Math.max(currentDay, 1)) * daysInMonth,
			)
		: 0;

	// Group services by category
	const servicesByCategory: Record<string, typeof usageSummary.services> = {};
	if (usageSummary?.services) {
		for (const service of usageSummary.services) {
			if (!servicesByCategory[service.category]) {
				servicesByCategory[service.category] = [];
			}
			servicesByCategory[service.category].push(service);
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						API Usage & Costs
					</h1>
					<p className="text-muted-foreground mt-2">
						Monitor API usage, costs, and service health across all integrations
					</p>
				</div>
				<div className="flex items-center gap-2">
					{healthSummary && (
						<Badge
							variant={
								healthSummary.overall_status === "healthy"
									? "default"
									: healthSummary.overall_status === "degraded"
										? "secondary"
										: "destructive"
							}
							className="text-sm"
						>
							{healthSummary.overall_status === "healthy" && (
								<CheckCircle className="mr-1 h-3 w-3" />
							)}
							{healthSummary.overall_status === "degraded" && (
								<AlertTriangle className="mr-1 h-3 w-3" />
							)}
							{healthSummary.overall_status === "critical" && (
								<AlertCircle className="mr-1 h-3 w-3" />
							)}
							System {healthSummary.overall_status}
						</Badge>
					)}
				</div>
			</div>

			{/* Overview Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
							<DollarSign className="h-4 w-4" />
							Current Month Cost
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{formatCurrency(usageSummary?.total_cost_cents || 0)}
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							Projected: {formatCurrency(projectedMonthlyCost)} by month end
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
							<TrendingUp className="h-4 w-4" />
							Services at Risk
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div
							className={`text-3xl font-bold ${approachingLimits.length > 0 ? "text-yellow-600" : "text-green-600"}`}
						>
							{approachingLimits.length}
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							Approaching free tier limits
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
							<Server className="h-4 w-4" />
							Services Monitored
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{usageSummary?.services.length || 0}
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							Active integrations tracked
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
							<Wifi className="h-4 w-4" />
							System Uptime
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div
							className={`text-3xl font-bold ${getHealthColor(healthSummary?.overall_status || "healthy")}`}
						>
							{healthSummary?.average_uptime_24h.toFixed(1) || 100}%
						</div>
						<p className="text-muted-foreground mt-1 text-xs">
							24-hour average
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Services Approaching Limits Alert */}
			{approachingLimits.length > 0 && (
				<Card className="border-yellow-300 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
							<AlertTriangle className="h-5 w-5" />
							Services Approaching Free Tier Limits
						</CardTitle>
						<CardDescription className="text-yellow-600 dark:text-yellow-500">
							These services are nearing their free tier limits and may incur
							charges soon
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{approachingLimits.map((service) => (
								<div
									key={service.service_id}
									className="flex items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-900"
								>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">
												{service.display_name}
											</span>
											<Badge
												variant={
													service.alert_level === "critical"
														? "destructive"
														: "secondary"
												}
												className="text-xs"
											>
												{service.alert_level === "critical"
													? "Critical"
													: "Warning"}
											</Badge>
										</div>
										<p className="text-muted-foreground mt-1 text-sm">
											{formatNumber(service.usage_count)} /{" "}
											{formatNumber(service.free_tier_limit)} used
										</p>
									</div>
									<div className="w-32">
										<Progress
											value={service.percentage_used}
											className={
												service.alert_level === "critical"
													? "[&>div]:bg-red-500"
													: "[&>div]:bg-yellow-500"
											}
										/>
										<p className="text-muted-foreground mt-1 text-right text-xs">
											{service.percentage_used.toFixed(1)}%
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Health Status */}
			{healthSummary && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Wifi className="h-5 w-5" />
							Service Health Status
						</CardTitle>
						<CardDescription>
							Real-time availability monitoring for all external services
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex gap-4">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-green-500" />
								<span className="text-sm">
									{healthSummary.healthy_services} Healthy
								</span>
							</div>
							{healthSummary.degraded_services > 0 && (
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<span className="text-sm">
										{healthSummary.degraded_services} Degraded
									</span>
								</div>
							)}
							{healthSummary.down_services > 0 && (
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<span className="text-sm">
										{healthSummary.down_services} Down
									</span>
								</div>
							)}
						</div>
						<div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
							{healthSummary.services.map((service) => (
								<div
									key={service.service_id}
									className="flex items-center gap-2 rounded-lg border p-2"
								>
									{service.current_status === "healthy" ? (
										<CheckCircle className="h-4 w-4 text-green-500" />
									) : service.current_status === "degraded" ? (
										<AlertTriangle className="h-4 w-4 text-yellow-500" />
									) : (
										<WifiOff className="h-4 w-4 text-red-500" />
									)}
									<span className="truncate text-xs">
										{service.display_name}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Usage by Category */}
			{Object.entries(servicesByCategory).map(([category, services]) => (
				<Card key={category}>
					<CardHeader>
						<CardTitle className="capitalize">
							{category.replace(/_/g, " ")}
						</CardTitle>
						<CardDescription>
							Usage and costs for {category.replace(/_/g, " ").toLowerCase()}{" "}
							services
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{services.map((service) => {
								const config = API_SERVICES[service.service_id];
								const hasFreeTier = config?.free_tier;
								const freeTierLimit = config?.free_tier?.monthly_limit || 0;

								return (
									<div
										key={service.service_id}
										className="rounded-lg border p-4"
									>
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{service.display_name}
													</span>
													{service.alert_level !== "normal" && (
														<Badge
															variant={
																service.alert_level === "critical"
																	? "destructive"
																	: "secondary"
															}
															className="text-xs"
														>
															{service.alert_level === "critical"
																? "95%+"
																: "80%+"}
														</Badge>
													)}
												</div>
												<div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
													<span>
														Usage:{" "}
														<strong>{formatNumber(service.usage_count)}</strong>
														{hasFreeTier && ` / ${formatNumber(freeTierLimit)}`}
													</span>
													{service.cost_cents > 0 && (
														<span>
															Cost:{" "}
															<strong>
																{formatCurrency(service.cost_cents)}
															</strong>
														</span>
													)}
													{service.last_synced && (
														<span className="flex items-center gap-1 text-xs">
															<Clock className="h-3 w-3" />
															Synced{" "}
															{new Date(
																service.last_synced,
															).toLocaleTimeString()}
														</span>
													)}
												</div>
											</div>
											{hasFreeTier && (
												<div className="w-40">
													<Progress
														value={service.free_tier_percentage}
														className={`${
															service.alert_level === "critical"
																? "[&>div]:bg-red-500"
																: service.alert_level === "warning"
																	? "[&>div]:bg-yellow-500"
																	: "[&>div]:bg-green-500"
														}`}
													/>
													<div className="text-muted-foreground mt-1 flex justify-between text-xs">
														<span>Free tier</span>
														<span>
															{service.free_tier_percentage.toFixed(1)}%
														</span>
													</div>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			))}

			{/* Cost Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<DollarSign className="h-5 w-5" />
						Monthly Cost Breakdown
					</CardTitle>
					<CardDescription>Estimated costs by service category</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{Object.entries(servicesByCategory).map(([category, services]) => {
							const categoryCost = services.reduce(
								(sum, s) => sum + s.cost_cents,
								0,
							);
							const percentage = usageSummary?.total_cost_cents
								? (categoryCost / usageSummary.total_cost_cents) * 100
								: 0;

							return (
								<div
									key={category}
									className="flex items-center justify-between"
								>
									<div className="flex-1">
										<div className="font-medium capitalize">
											{category.replace(/_/g, " ")}
										</div>
										<div className="text-muted-foreground text-sm">
											{services.length} services
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-32">
											<Progress value={percentage} />
										</div>
										<div className="w-20 text-right font-medium">
											{formatCurrency(categoryCost)}
										</div>
									</div>
								</div>
							);
						})}
						<div className="mt-4 flex items-center justify-between border-t pt-4">
							<div className="text-lg font-bold">Total Estimated Cost</div>
							<div className="text-lg font-bold">
								{formatCurrency(usageSummary?.total_cost_cents || 0)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Info Card */}
			<Card className="bg-muted/50">
				<CardHeader>
					<CardTitle>About API Usage Tracking</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						This dashboard provides real-time monitoring of all external API
						integrations used by Stratos:
					</p>
					<ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
						<li>
							<strong>Usage Tracking</strong> - Monitor API calls, tokens, and
							resource consumption
						</li>
						<li>
							<strong>Free Tier Alerts</strong> - Get warned at 80% and 95% of
							free tier limits
						</li>
						<li>
							<strong>Cost Estimation</strong> - Track actual costs and project
							monthly expenses
						</li>
						<li>
							<strong>Health Monitoring</strong> - Real-time availability and
							uptime tracking
						</li>
						<li>
							<strong>Automatic Sync</strong> - Usage data is synced hourly from
							provider APIs
						</li>
					</ul>
					<div className="border-t pt-4">
						<p className="text-muted-foreground text-xs">
							<strong>Note:</strong> Cost estimates are based on current usage
							patterns. Actual charges may vary. Some services (like internal
							tracking) show usage without costs as they are included in your
							subscription.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
