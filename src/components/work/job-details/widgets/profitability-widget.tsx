/**
 * Profitability Widget - Server Component
 *
 * Displays real-time job profitability analysis with revenue, costs, and margin tracking.
 * Critical for business decision-making and job costing.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/formatters";

type ProfitabilityWidgetProps = {
	job: Job;
	materials?: unknown[];
};

// Cost breakdown type
type CostBreakdown = {
	labor: number;
	materials: number;
	equipment: number;
	permits: number;
	overhead: number;
	other: number;
};

type RevenueBreakdown = {
	services: number;
	materials: number;
	equipment: number;
	other: number;
};

export function ProfitabilityWidget({
	job,
	materials: materialsData = [],
}: ProfitabilityWidgetProps) {
	// Calculate revenue and costs from job line items
	const lineItems = materialsData as any[];

	// Calculate revenue by item type
	const revenue: RevenueBreakdown = {
		services:
			lineItems
				.filter(
					(item) => item.item_type === "service" || item.item_type === "labor",
				)
				.reduce((sum, item) => sum + (item.total_price || 0), 0) / 100,
		materials:
			lineItems
				.filter(
					(item) =>
						item.item_type === "material" || item.item_type === "product",
				)
				.reduce((sum, item) => sum + (item.total_price || 0), 0) / 100,
		equipment:
			lineItems
				.filter((item) => item.item_type === "equipment")
				.reduce((sum, item) => sum + (item.total_price || 0), 0) / 100,
		other:
			lineItems
				.filter(
					(item) =>
						!["service", "labor", "material", "product", "equipment"].includes(
							item.item_type,
						),
				)
				.reduce((sum, item) => sum + (item.total_price || 0), 0) / 100,
	};

	// Calculate costs (assuming cost is tracked separately, or use 60% of price as estimate)
	const costs: CostBreakdown = {
		labor:
			lineItems
				.filter(
					(item) => item.item_type === "service" || item.item_type === "labor",
				)
				.reduce(
					(sum, item) => sum + (item.cost || item.total_price * 0.6 || 0),
					0,
				) / 100,
		materials:
			lineItems
				.filter(
					(item) =>
						item.item_type === "material" || item.item_type === "product",
				)
				.reduce(
					(sum, item) => sum + (item.cost || item.total_price * 0.7 || 0),
					0,
				) / 100,
		equipment:
			lineItems
				.filter((item) => item.item_type === "equipment")
				.reduce(
					(sum, item) => sum + (item.cost || item.total_price * 0.7 || 0),
					0,
				) / 100,
		permits: 0, // TODO: Track permit costs separately
		overhead: ((job.totalAmount || 0) * 0.1) / 100, // 10% overhead estimate
		other: 0,
	};

	// If no line items, use job total_amount
	if (lineItems.length === 0 && job.totalAmount) {
		revenue.services = job.totalAmount / 100;
		costs.labor = (job.totalAmount * 0.6) / 100; // Estimate 60% labor cost
		costs.overhead = (job.totalAmount * 0.1) / 100;
	}

	// Calculate totals
	const totalRevenue = Object.values(revenue).reduce(
		(sum, val) => sum + val,
		0,
	);
	const totalCosts = Object.values(costs).reduce((sum, val) => sum + val, 0);
	const grossProfit = totalRevenue - totalCosts;
	const profitMargin =
		totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

	// Determine profit status
	const isProfitable = grossProfit > 0;
	const isHighMargin = profitMargin >= 30;
	const isLowMargin = profitMargin > 0 && profitMargin < 15;
	const isLoss = grossProfit < 0;

	// Estimated vs actual (for analysis)
	// Note: job.amount doesn't exist in schema, using totalCosts as fallback
	const estimatedAmount = totalCosts / 0.75; // Assuming 25% margin
	const estimatedProfit = estimatedAmount * 0.25; // 25% target margin
	const profitVariance = grossProfit - estimatedProfit;
	const isOverPerforming = profitVariance > 0;

	function getCostPercentage(cost: number): number {
		return totalRevenue > 0 ? (cost / totalRevenue) * 100 : 0;
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h4 className="font-semibold text-sm">Job Profitability</h4>
				<Badge
					className="text-xs"
					variant={isLoss ? "destructive" : isLowMargin ? "outline" : "default"}
				>
					{profitMargin > 0 ? "+" : ""}
					{profitMargin.toFixed(2)}% margin
				</Badge>
			</div>

			{/* Profit Summary Cards */}
			<div className="grid grid-cols-2 gap-3">
				{/* Revenue */}
				<div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100/50 p-3 dark:from-green-950/30 dark:to-green-900/20">
					<div className="mb-1 flex items-center gap-1.5">
						<DollarSign className="size-4 text-success" />
						<span className="text-muted-foreground text-xs">Revenue</span>
					</div>
					<p className="font-bold text-lg text-success dark:text-success">
						{formatCurrency(totalRevenue)}
					</p>
				</div>

				{/* Costs */}
				<div className="rounded-lg border bg-gradient-to-br from-red-50 to-red-100/50 p-3 dark:from-red-950/30 dark:to-red-900/20">
					<div className="mb-1 flex items-center gap-1.5">
						<TrendingDown className="size-4 text-destructive" />
						<span className="text-muted-foreground text-xs">Costs</span>
					</div>
					<p className="font-bold text-destructive text-lg dark:text-destructive">
						{formatCurrency(totalCosts)}
					</p>
				</div>

				{/* Gross Profit */}
				<div
					className={`col-span-2 rounded-lg border p-3 ${
						isProfitable
							? "bg-gradient-to-br from-primary/10 to-primary/5"
							: "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20"
					}`}
				>
					<div className="mb-1 flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							{isProfitable ? (
								<TrendingUp className="size-4 text-primary" />
							) : (
								<TrendingDown className="size-4 text-destructive" />
							)}
							<span className="text-muted-foreground text-xs">
								Gross Profit
							</span>
						</div>
						{isOverPerforming ? (
							<Badge className="text-xs" variant="default">
								<ArrowUp className="mr-1 size-3" />
								{formatCurrency(Math.abs(profitVariance))} over
							</Badge>
						) : (
							<Badge className="text-xs" variant="outline">
								<ArrowDown className="mr-1 size-3" />
								{formatCurrency(Math.abs(profitVariance))} under
							</Badge>
						)}
					</div>
					<p
						className={`font-bold text-xl ${isProfitable ? "text-primary" : "text-destructive dark:text-destructive"}`}
					>
						{formatCurrency(grossProfit)}
					</p>
				</div>
			</div>

			<Separator />

			{/* Revenue Breakdown */}
			<div className="space-y-2">
				<h5 className="font-medium text-sm">Revenue Breakdown</h5>
				<div className="space-y-2">
					{Object.entries(revenue).map(([category, amount]) => {
						const percentage = (amount / totalRevenue) * 100;
						return (
							<div className="space-y-1" key={category}>
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground capitalize">
										{category}
									</span>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground">
											{percentage.toFixed(2)}%
										</span>
										<span className="font-medium">
											{formatCurrency(amount)}
										</span>
									</div>
								</div>
								<Progress className="h-1.5" value={percentage} />
							</div>
						);
					})}
				</div>
			</div>

			<Separator />

			{/* Cost Breakdown */}
			<div className="space-y-2">
				<h5 className="font-medium text-sm">Cost Breakdown</h5>
				<div className="space-y-2">
					{Object.entries(costs).map(([category, amount]) => {
						const percentage = getCostPercentage(amount);
						return (
							<div className="space-y-1" key={category}>
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground capitalize">
										{category}
									</span>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground">
											{percentage.toFixed(2)}%
										</span>
										<span className="font-medium">
											{formatCurrency(amount)}
										</span>
									</div>
								</div>
								<Progress
									className="h-1.5 [&>div]:bg-destructive"
									value={percentage}
								/>
							</div>
						);
					})}
				</div>
			</div>

			{/* Profit Analysis */}
			{isLoss && (
				<>
					<Separator />
					<div className="flex items-start gap-2 rounded-lg border-destructive border-l-4 bg-destructive p-3 dark:bg-destructive/30">
						<AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
						<div>
							<p className="font-medium text-destructive text-sm dark:text-destructive">
								Loss Alert
							</p>
							<p className="text-destructive text-xs dark:text-destructive">
								This job is currently unprofitable. Review costs and consider
								price adjustments.
							</p>
						</div>
					</div>
				</>
			)}

			{isLowMargin && !isLoss && (
				<>
					<Separator />
					<div className="flex items-start gap-2 rounded-lg border-warning border-l-4 bg-warning p-3 dark:bg-warning/30">
						<AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
						<div>
							<p className="font-medium text-sm text-warning dark:text-warning">
								Low Margin Warning
							</p>
							<p className="text-warning text-xs dark:text-warning">
								Profit margin is below 15%. Monitor costs closely.
							</p>
						</div>
					</div>
				</>
			)}

			{isHighMargin && (
				<>
					<Separator />
					<div className="flex items-start gap-2 rounded-lg border-success border-l-4 bg-success p-3 dark:bg-success/30">
						<TrendingUp className="mt-0.5 size-4 shrink-0 text-success" />
						<div>
							<p className="font-medium text-sm text-success dark:text-success">
								Healthy Margin
							</p>
							<p className="text-success text-xs dark:text-success">
								Great work! This job has a strong profit margin of{" "}
								{profitMargin.toFixed(2)}
								%.
							</p>
						</div>
					</div>
				</>
			)}

			{/* Actions */}
			<Separator />
			<div className="space-y-2">
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={`/dashboard/work/${job.id}/financials`}>
						View Detailed Financials
					</Link>
				</Button>
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={"/dashboard/reports/jobs"}>
						Compare with Similar Jobs
					</Link>
				</Button>
			</div>

			{/* Key Metrics Summary */}
			<div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-3 text-xs">
				<div className="space-y-1">
					<p className="text-muted-foreground">Labor Cost %</p>
					<p className="font-semibold">
						{getCostPercentage(costs.labor).toFixed(2)}%
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-muted-foreground">Material Cost %</p>
					<p className="font-semibold">
						{getCostPercentage(costs.materials).toFixed(2)}%
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-muted-foreground">Overhead %</p>
					<p className="font-semibold">
						{getCostPercentage(costs.overhead).toFixed(2)}%
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-muted-foreground">Target Margin</p>
					<p className="font-semibold">25%</p>
				</div>
			</div>
		</div>
	);
}
