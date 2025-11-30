import {
	TrendingUp,
	TrendingDown,
	Users,
	Target,
	Activity,
	BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrowthMetrics } from "@/actions/growth";
import { formatNumber } from "@/lib/formatters";

type GrowthDashboardProps = {
	metrics: GrowthMetrics;
};

/**
 * Growth Dashboard Component
 *
 * Displays platform growth metrics including signups, activations, feature adoption, and retention.
 */
export function GrowthDashboard({ metrics }: GrowthDashboardProps) {
	return (
		<div className="space-y-6">
			{/* Signups Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Today</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.signups.today}</div>
						<p className="text-xs text-muted-foreground">New signups</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">This Week</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.signups.this_week}</div>
						<p className="text-xs text-muted-foreground">New signups</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">This Month</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.signups.this_month}</div>
						<div className="flex items-center gap-1 mt-1">
							{metrics.signups.trend === "up" ? (
								<>
									<TrendingUp className="h-3 w-3 text-green-500" />
									<span className="text-xs text-green-600">
										+{Math.abs(metrics.signups.change_percent).toFixed(1)}%
									</span>
								</>
							) : metrics.signups.trend === "down" ? (
								<>
									<TrendingDown className="h-3 w-3 text-red-500" />
									<span className="text-xs text-red-600">
										{metrics.signups.change_percent.toFixed(1)}%
									</span>
								</>
							) : (
								<span className="text-xs text-muted-foreground">No change</span>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Activation Rate</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{metrics.activations.rate.toFixed(1)}%</div>
						<p className="text-xs text-muted-foreground">
							{formatNumber(metrics.activations.total)} active companies
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Activation Funnel */}
			<Card>
				<CardHeader>
					<CardTitle>Activation Funnel</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[
							{ label: "Signed Up", value: metrics.activations.funnel.signed_up, color: "bg-blue-500" },
							{ label: "Completed Onboarding", value: metrics.activations.funnel.completed_onboarding, color: "bg-purple-500" },
							{ label: "First Job Created", value: metrics.activations.funnel.first_job_created, color: "bg-orange-500" },
							{ label: "First Invoice Sent", value: metrics.activations.funnel.first_invoice_sent, color: "bg-green-500" },
							{ label: "Active User", value: metrics.activations.funnel.active_user, color: "bg-emerald-500" },
						].map((step, index, arr) => {
							const maxValue = arr[0].value;
							const percentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
							const previousValue = index > 0 ? arr[index - 1].value : maxValue;
							const dropoff = previousValue > 0 ? ((previousValue - step.value) / previousValue) * 100 : 0;

							return (
								<div key={step.label} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">{step.label}</span>
										<div className="flex items-center gap-2">
											<span className="text-sm font-bold">{formatNumber(step.value)}</span>
											{index > 0 && dropoff > 0 && (
												<Badge variant="secondary" className="text-xs">
													-{dropoff.toFixed(1)}%
												</Badge>
											)}
										</div>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div
											className={`h-2 rounded-full ${step.color} transition-all`}
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Feature Adoption */}
			<Card>
				<CardHeader>
					<CardTitle>Feature Adoption</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{metrics.feature_adoption.map((feature) => (
							<div key={feature.feature} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">{feature.feature}</span>
									<div className="flex items-center gap-2">
										<span className="text-sm text-muted-foreground">
											{formatNumber(feature.companies_using)} companies
										</span>
										<Badge variant={feature.adoption_rate >= 50 ? "default" : "secondary"}>
											{feature.adoption_rate.toFixed(1)}%
										</Badge>
									</div>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className="h-2 rounded-full bg-primary transition-all"
										style={{ width: `${feature.adoption_rate}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Retention Cohorts */}
			<Card>
				<CardHeader>
					<CardTitle>Retention Cohorts</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{metrics.retention.cohorts.map((cohort) => (
							<div key={cohort.month} className="flex items-center justify-between p-3 rounded-lg border">
								<div>
									<p className="font-medium">{cohort.month}</p>
									<p className="text-sm text-muted-foreground">
										{formatNumber(cohort.signups)} signups
									</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold">{cohort.retention_rate.toFixed(1)}%</p>
									<p className="text-xs text-muted-foreground">Retention</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

