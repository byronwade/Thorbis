"use client";

/**
 * Job Statistics Sheet - Comprehensive Statistics for Owners/Project Managers
 *
 * Shows all key metrics:
 * - Financial: Job value, paid, outstanding, profit, margin
 * - Labor: Total hours, estimated hours, variance, team breakdown
 * - Time: Travel time, on-site time, total duration
 * - Costing: Materials cost, labor cost, overhead, total cost
 * - Performance: Completion percentage, efficiency metrics
 */

import { BarChart3, Clock, DollarSign, Package, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type JobStatisticsSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	job: any;
	metrics: any;
	timeEntries: any[];
	teamAssignments: any[];
	invoices: any[];
	payments: any[];
	jobMaterials: any[];
};

const CENTS_PER_DOLLAR = 100;

export function JobStatisticsSheet({
	open,
	onOpenChange,
	job,
	metrics,
	timeEntries,
	teamAssignments,
	invoices,
	payments,
	jobMaterials,
}: JobStatisticsSheetProps) {
	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / CENTS_PER_DOLLAR);

	const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

	// Calculate detailed metrics
	const detailedMetrics = useMemo(() => {
		// Labor cost (assuming average rate - in production, get from team member rates)
		const averageLaborRate = 50; // $50/hour
		const laborCost = metrics.totalLaborHours * averageLaborRate * 100; // in cents

		// Materials cost
		const materialsCost = metrics.materialsCost || 0;

		// Total cost
		const totalCost = laborCost + materialsCost;

		// Profit
		const profit = metrics.totalAmount - totalCost;

		// Profit margin
		const profitMargin = metrics.totalAmount > 0 ? (profit / metrics.totalAmount) * 100 : 0;

		// Labor variance
		const laborVariance = metrics.estimatedLaborHours > 0 ? metrics.totalLaborHours - metrics.estimatedLaborHours : 0;

		// Labor variance percentage
		const laborVariancePercent =
			metrics.estimatedLaborHours > 0 ? (laborVariance / metrics.estimatedLaborHours) * 100 : 0;

		// Calculate travel time (time entries with type "travel")
		const travelTimeEntries = timeEntries.filter((entry: any) => entry.entry_type === "travel");
		const travelHours = travelTimeEntries.reduce((sum: number, entry: any) => sum + (entry.total_hours || 0), 0);

		// Calculate on-site time (time entries with type "work" or "labor")
		const onSiteTimeEntries = timeEntries.filter(
			(entry: any) => entry.entry_type === "work" || entry.entry_type === "labor"
		);
		const onSiteHours = onSiteTimeEntries.reduce((sum: number, entry: any) => sum + (entry.total_hours || 0), 0);

		// Team breakdown
		const teamBreakdown = timeEntries.reduce((acc: any, entry: any) => {
			const user = Array.isArray(entry.user) ? entry.user[0] : entry.user;
			const userId = user?.id || "unknown";
			const userName = user?.name || "Unknown";

			if (!acc[userId]) {
				acc[userId] = {
					id: userId,
					name: userName,
					avatar: user?.avatar,
					totalHours: 0,
					entries: 0,
				};
			}

			acc[userId].totalHours += entry.total_hours || 0;
			acc[userId].entries += 1;

			return acc;
		}, {});

		const teamMembers = Object.values(teamBreakdown);

		return {
			laborCost,
			materialsCost,
			totalCost,
			profit,
			profitMargin,
			laborVariance,
			laborVariancePercent,
			travelHours,
			onSiteHours,
			teamMembers,
		};
	}, [metrics, timeEntries]);

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className="w-full overflow-y-auto px-0 sm:max-w-3xl lg:max-w-4xl">
				<div className="px-6">
					<SheetHeader className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
									<BarChart3 className="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<SheetTitle className="text-2xl">Job Analytics</SheetTitle>
									<SheetDescription>
										#{job.job_number || "N/A"} • {job.title || "Untitled Job"}
									</SheetDescription>
								</div>
							</div>
							<Badge
								variant={
									job.status === "completed" ? "default" : job.status === "in_progress" ? "secondary" : "outline"
								}
							>
								{job.status?.replace(/_/g, " ") || "Unknown"}
							</Badge>
						</div>
					</SheetHeader>
				</div>

				<Separator className="my-6" />

				<div className="space-y-6 px-6 pb-6">
					{/* FINANCIAL OVERVIEW */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<DollarSign className="h-5 w-5 text-muted-foreground" />
							<h3 className="font-semibold text-lg">Financial Overview</h3>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{/* Job Value */}
							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Job Value</p>
									<p className="mt-2 font-bold text-2xl tabular-nums">{formatCurrency(metrics.totalAmount)}</p>
									<p className="mt-1 text-muted-foreground text-xs">
										{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
									</p>
								</CardContent>
							</Card>

							{/* Paid */}
							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Paid</p>
									<p className="mt-2 font-bold text-2xl text-success tabular-nums dark:text-success">
										{formatCurrency(metrics.paidAmount)}
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										{payments.length} payment{payments.length !== 1 ? "s" : ""}
									</p>
								</CardContent>
							</Card>

							{/* Outstanding */}
							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Outstanding</p>
									<p className="mt-2 font-bold text-2xl text-warning tabular-nums dark:text-warning">
										{formatCurrency(metrics.totalAmount - metrics.paidAmount)}
									</p>
									<p className="mt-1 text-muted-foreground text-xs">
										{metrics.totalAmount > 0
											? `${Math.round(
													((metrics.totalAmount - metrics.paidAmount) / metrics.totalAmount) * 100
												)}% remaining`
											: "N/A"}
									</p>
								</CardContent>
							</Card>

							{/* Profit */}
							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Profit</p>
									<p
										className={`mt-2 font-bold text-2xl tabular-nums ${
											detailedMetrics.profit >= 0
												? "text-success dark:text-success"
												: "text-destructive dark:text-destructive"
										}`}
									>
										{formatCurrency(detailedMetrics.profit)}
									</p>
									<div className="mt-1 flex items-center gap-1">
										{detailedMetrics.profitMargin >= 0 ? (
											<TrendingUp className="h-3 w-3 text-success dark:text-success" />
										) : (
											<TrendingDown className="h-3 w-3 text-destructive dark:text-destructive" />
										)}
										<p className="text-muted-foreground text-xs">{detailedMetrics.profitMargin.toFixed(1)}% margin</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* JOB COSTING */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Package className="h-5 w-5 text-muted-foreground" />
							<h3 className="font-semibold text-lg">Job Costing</h3>
						</div>

						<Card>
							<CardContent className="space-y-4 p-6">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">Labor Cost</span>
									<span className="font-semibold tabular-nums">{formatCurrency(detailedMetrics.laborCost)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground text-sm">Materials Cost</span>
									<span className="font-semibold tabular-nums">{formatCurrency(detailedMetrics.materialsCost)}</span>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="font-semibold">Total Cost</span>
									<span className="font-bold text-lg tabular-nums">{formatCurrency(detailedMetrics.totalCost)}</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										{detailedMetrics.profit >= 0 ? (
											<TrendingUp className="h-4 w-4 text-success dark:text-success" />
										) : (
											<TrendingDown className="h-4 w-4 text-destructive dark:text-destructive" />
										)}
										<span className="font-semibold">Net Profit</span>
									</div>
									<span
										className={`font-bold text-lg tabular-nums ${
											detailedMetrics.profit >= 0
												? "text-success dark:text-success"
												: "text-destructive dark:text-destructive"
										}`}
									>
										{formatCurrency(detailedMetrics.profit)}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* LABOR & TIME TRACKING */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Clock className="h-5 w-5 text-muted-foreground" />
							<h3 className="font-semibold text-lg">Labor & Time</h3>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Total Hours</p>
									<p className="mt-2 font-bold text-2xl tabular-nums">{formatHours(metrics.totalLaborHours)}</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Estimated</p>
									<p className="mt-2 font-bold text-2xl tabular-nums">
										{metrics.estimatedLaborHours > 0 ? formatHours(metrics.estimatedLaborHours) : "N/A"}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Travel Time</p>
									<p className="mt-2 font-bold text-2xl tabular-nums">{formatHours(detailedMetrics.travelHours)}</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">On-Site Time</p>
									<p className="mt-2 font-bold text-2xl tabular-nums">{formatHours(detailedMetrics.onSiteHours)}</p>
								</CardContent>
							</Card>
						</div>

						{metrics.estimatedLaborHours > 0 && (
							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											{detailedMetrics.laborVariance >= 0 ? (
												<TrendingUp className="h-4 w-4 text-warning dark:text-warning" />
											) : (
												<TrendingDown className="h-4 w-4 text-success dark:text-success" />
											)}
											<span className="font-medium">Labor Variance</span>
										</div>
										<div className="text-right">
											<span
												className={`font-bold text-lg tabular-nums ${
													detailedMetrics.laborVariance >= 0
														? "text-warning dark:text-warning"
														: "text-success dark:text-success"
												}`}
											>
												{detailedMetrics.laborVariance >= 0 ? "+" : ""}
												{formatHours(Math.abs(detailedMetrics.laborVariance))}
											</span>
											<p className="mt-0.5 text-muted-foreground text-xs">
												{detailedMetrics.laborVariancePercent >= 0 ? "+" : ""}
												{detailedMetrics.laborVariancePercent.toFixed(1)}% vs estimate
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* TEAM BREAKDOWN */}
					{detailedMetrics.teamMembers.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-muted-foreground" />
								<h3 className="font-semibold text-lg">Team Breakdown</h3>
							</div>

							<Card>
								<CardContent className="p-6">
									<div className="space-y-4">
										{detailedMetrics.teamMembers.map((member: any, index: number) => (
											<div key={member.id}>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<Avatar className="h-9 w-9">
															<AvatarImage alt={member.name} src={member.avatar || undefined} />
															<AvatarFallback className="text-xs">
																{member.name
																	.split(" ")
																	.map((n: string) => n[0])
																	.join("")
																	.toUpperCase()
																	.slice(0, 2)}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium text-sm">{member.name}</p>
															<p className="text-muted-foreground text-xs">
																{member.entries} {member.entries === 1 ? "entry" : "entries"}
															</p>
														</div>
													</div>
													<div className="text-right">
														<p className="font-semibold tabular-nums">{formatHours(member.totalHours)}</p>
														<p className="text-muted-foreground text-xs">
															{((member.totalHours / metrics.totalLaborHours) * 100).toFixed(0)}%
														</p>
													</div>
												</div>
												{index !== detailedMetrics.teamMembers.length - 1 && <Separator className="mt-4" />}
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* PERFORMANCE METRICS */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-muted-foreground" />
							<h3 className="font-semibold text-lg">Performance</h3>
						</div>

						<Card>
							<CardContent className="space-y-6 p-6">
								<div>
									<div className="mb-3 flex items-center justify-between">
										<p className="font-medium text-sm">Completion Progress</p>
										<span className="font-bold tabular-nums">{metrics.completionPercentage}%</span>
									</div>
									<div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
										<div
											className="h-full rounded-full bg-primary transition-all"
											style={{
												width: `${metrics.completionPercentage}%`,
											}}
										/>
									</div>
								</div>

								<Separator />

								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<p className="text-muted-foreground text-sm">Efficiency</p>
										<p className="mt-1 font-semibold text-lg">
											{metrics.estimatedLaborHours > 0
												? `${((metrics.estimatedLaborHours / metrics.totalLaborHours) * 100).toFixed(0)}%`
												: "N/A"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground text-sm">Job Status</p>
										<Badge className="mt-1" variant="outline">
											{job.status?.replace(/_/g, " ") || "Unknown"}
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
