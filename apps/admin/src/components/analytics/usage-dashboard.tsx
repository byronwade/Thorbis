import { Activity, BarChart3, TrendingUp, Server, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageMetrics } from "@/actions/usage";
import { formatNumber } from "@/lib/formatters";

type UsageDashboardProps = {
	metrics: UsageMetrics;
};

/**
 * Usage Dashboard Component
 *
 * Displays platform usage metrics including API usage, feature usage, and cost analysis.
 */
export function UsageDashboard({ metrics }: UsageDashboardProps) {
	return (
		<div className="space-y-6">
			{/* Resource Consumption */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">API Calls</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatNumber(metrics.resource_consumption.api_calls)}</div>
						<p className="text-xs text-muted-foreground">Total requests</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Storage</CardTitle>
						<Server className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.resource_consumption.storage_gb.toFixed(2)} GB</div>
						<p className="text-xs text-muted-foreground">Total storage</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Cost</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${metrics.cost_analysis.reduce((sum, c) => sum + c.cost_usd, 0).toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">Estimated monthly</p>
					</CardContent>
				</Card>
			</div>

			{/* Top Companies by API Usage */}
			<Card>
				<CardHeader>
					<CardTitle>Top Companies by API Usage</CardTitle>
				</CardHeader>
				<CardContent>
					{metrics.api_usage.by_company.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No API usage data available</p>
						</div>
					) : (
						<div className="space-y-3">
							{metrics.api_usage.by_company.map((company, index) => {
								const maxCalls = metrics.api_usage.by_company[0]?.calls || 1;
								const percentage = (company.calls / maxCalls) * 100;

								return (
									<div key={company.company_id} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-muted-foreground w-6">
													#{index + 1}
												</span>
												<span className="text-sm font-medium">{company.company_name}</span>
											</div>
											<span className="text-sm font-bold">{formatNumber(company.calls)}</span>
										</div>
										<div className="w-full bg-muted rounded-full h-2">
											<div
												className="h-2 rounded-full bg-primary transition-all"
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Peak Usage Hours */}
			<Card>
				<CardHeader>
					<CardTitle>Peak Usage Hours</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-64 flex items-end gap-2">
						{metrics.api_usage.peak_hours.map((hour) => {
							const maxCalls = Math.max(...metrics.api_usage.peak_hours.map((h) => h.calls));
							const height = maxCalls > 0 ? (hour.calls / maxCalls) * 100 : 0;
							const isPeak = hour.calls >= maxCalls * 0.8;

							return (
								<div key={hour.hour} className="flex-1 flex flex-col items-center gap-2">
									<div className="w-full bg-primary/20 rounded-t flex items-end">
										<div
											className={`w-full rounded-t transition-all ${isPeak ? "bg-primary" : "bg-primary/60"}`}
											style={{ height: `${height}%` }}
										/>
									</div>
									<span className="text-xs text-muted-foreground">
										{hour.hour}:00
									</span>
									<span className="text-xs font-medium">{formatNumber(hour.calls)}</span>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Feature Usage */}
			<Card>
				<CardHeader>
					<CardTitle>Feature Usage</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{metrics.feature_usage.map((feature) => (
							<div key={feature.feature} className="flex items-center justify-between p-4 rounded-lg border">
								<div>
									<p className="font-medium">{feature.feature}</p>
									<p className="text-sm text-muted-foreground">
										{formatNumber(feature.companies_count)} companies
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold">{formatNumber(feature.usage_count)}</p>
									<p className="text-xs text-muted-foreground">
										{feature.avg_per_company.toFixed(1)} avg/company
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Cost Analysis */}
			<Card>
				<CardHeader>
					<CardTitle>Cost Analysis</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{metrics.cost_analysis.map((cost) => (
							<div key={cost.service} className="flex items-center justify-between p-4 rounded-lg border">
								<div>
									<p className="font-medium">{cost.service}</p>
									<p className="text-sm text-muted-foreground">
										{formatNumber(cost.usage)} {cost.unit}
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold">${cost.cost_usd.toFixed(2)}</p>
									<p className="text-xs text-muted-foreground">Estimated cost</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}



