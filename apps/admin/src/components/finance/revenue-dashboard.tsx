import { DollarSign, TrendingUp, TrendingDown, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevenueMetrics } from "@/actions/revenue";
import { formatNumber } from "@/lib/formatters";
import { formatCurrencyFromDollars } from "@stratos/shared/utils/formatting";

// Currency formatter wrapper
function formatCurrency(value: number, options?: { decimals?: number }): string {
	return formatCurrencyFromDollars(value, { decimals: options?.decimals });
}

type RevenueDashboardProps = {
	metrics: RevenueMetrics;
};

/**
 * Revenue Dashboard Component
 *
 * Displays revenue metrics including MRR, ARR, and growth trends.
 */
export function RevenueDashboard({ metrics }: RevenueDashboardProps) {
	return (
		<div className="space-y-6">
			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">MRR</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(metrics.mrr, { decimals: 0 })}</div>
						<p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">ARR</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(metrics.arr, { decimals: 0 })}</div>
						<p className="text-xs text-muted-foreground">Annual Recurring Revenue</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
						{metrics.revenue_growth_percent >= 0 ? (
							<TrendingUp className="h-4 w-4 text-green-500" />
						) : (
							<TrendingDown className="h-4 w-4 text-red-500" />
						)}
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${metrics.revenue_growth_percent >= 0 ? "text-green-600" : "text-red-600"}`}
						>
							{metrics.revenue_growth_percent >= 0 ? "+" : ""}
							{metrics.revenue_growth_percent.toFixed(1)}%
						</div>
						<p className="text-xs text-muted-foreground">Month over month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{formatCurrency(metrics.total_revenue, { decimals: 0 })}
						</div>
						<p className="text-xs text-muted-foreground">All time</p>
					</CardContent>
				</Card>
			</div>

			{/* Revenue by Plan */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue by Plan</CardTitle>
				</CardHeader>
				<CardContent>
					{metrics.by_plan.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<Building2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
							<p>No revenue data available</p>
						</div>
					) : (
						<div className="space-y-4">
							{metrics.by_plan.map((plan) => {
								const totalRevenue = metrics.by_plan.reduce((sum, p) => sum + p.revenue, 0);
								const percentage = totalRevenue > 0 ? (plan.revenue / totalRevenue) * 100 : 0;

								return (
									<div key={plan.plan} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="font-medium capitalize">{plan.plan}</span>
												<Badge variant="outline" className="text-xs">
													{formatNumber(plan.companies)} companies
												</Badge>
											</div>
											<span className="font-bold">{formatCurrency(plan.revenue, { decimals: 0 })}</span>
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

			{/* Revenue Trends */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue Trends (Last 12 Months)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-64 flex items-end gap-2">
						{metrics.by_month.map((month) => {
							const maxRevenue = Math.max(...metrics.by_month.map((m) => m.revenue));
							const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

							return (
								<div key={month.month} className="flex-1 flex flex-col items-center gap-2">
									<div className="w-full bg-primary/20 rounded-t flex items-end">
										<div
											className="w-full bg-primary rounded-t transition-all"
											style={{ height: `${height}%` }}
										/>
									</div>
									<span className="text-xs text-muted-foreground">
										{month.month.split(" ")[0]}
									</span>
									<span className="text-xs font-medium">
										{formatCurrency(month.revenue, { decimals: 0 })}
									</span>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

