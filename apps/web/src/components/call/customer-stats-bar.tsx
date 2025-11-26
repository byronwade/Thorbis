"use client";

/**
 * Customer Stats Bar
 *
 * Sticky stats bar showing critical customer metrics at a glance.
 * Always visible at the top of the customer sidebar during calls.
 *
 * Shows:
 * - Total revenue (color-coded)
 * - Open balance
 * - Active jobs count
 * - Last visit date
 * - Customer since date
 */

import {
	Banknote,
	Briefcase,
	Calendar,
	Clock,
	CreditCard,
	TrendingDown,
	TrendingUp,
	User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CustomerStats } from "@/types/call";

type CustomerStatsBarProps = {
	stats: CustomerStats;
	openBalance?: number;
	lastVisitDate?: string | null;
	className?: string;
};

// Revenue tiers for color coding
const getRevenueColor = (revenue: number): string => {
	if (revenue >= 10000) return "text-success"; // High value
	if (revenue >= 5000) return "text-primary"; // Good value
	if (revenue >= 1000) return "text-foreground"; // Average
	return "text-muted-foreground"; // Low/new
};

const getRevenueLabel = (revenue: number): string => {
	if (revenue >= 10000) return "High Value";
	if (revenue >= 5000) return "Good";
	if (revenue >= 1000) return "Average";
	if (revenue > 0) return "New";
	return "No History";
};

export function CustomerStatsBar({
	stats,
	openBalance = 0,
	lastVisitDate,
	className,
}: CustomerStatsBarProps) {
	// Format currency
	const formatCurrency = (amount: number): string => {
		if (amount >= 1000) {
			return `$${(amount / 1000).toFixed(1)}k`;
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	// Format date
	const formatDate = (date: string | null): string => {
		if (!date) return "Never";
		const d = new Date(date);
		const now = new Date();
		const diffDays = Math.floor(
			(now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
	};

	// Get customer tenure
	const getCustomerTenure = (): string => {
		if (!stats.customerSince) return "New";
		const start = new Date(stats.customerSince);
		const now = new Date();
		const diffYears =
			(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);

		if (diffYears < 1) {
			const months = Math.floor(diffYears * 12);
			return months <= 1 ? "< 1 mo" : `${months} mo`;
		}
		return `${Math.floor(diffYears)}y`;
	};

	const revenueColor = getRevenueColor(stats.totalRevenue);
	const hasOpenBalance = openBalance > 0;

	return (
		<TooltipProvider delayDuration={200}>
			<div
				className={cn(
					"bg-card/80 sticky top-0 z-10 border-b backdrop-blur-sm",
					className,
				)}
			>
				<div className="grid grid-cols-5 divide-x">
					{/* Revenue */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex flex-col items-center justify-center p-3 transition-colors hover:bg-muted/50">
								<div className="flex items-center gap-1">
									<Banknote className={cn("h-3.5 w-3.5", revenueColor)} />
									<span className={cn("text-xs font-bold", revenueColor)}>
										{formatCurrency(stats.totalRevenue)}
									</span>
								</div>
								<span className="text-muted-foreground text-[10px]">
									Revenue
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Total Lifetime Revenue</p>
							<p className="text-muted-foreground text-xs">
								{getRevenueLabel(stats.totalRevenue)} customer
							</p>
						</TooltipContent>
					</Tooltip>

					{/* Open Balance */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={cn(
									"flex flex-col items-center justify-center p-3 transition-colors hover:bg-muted/50",
									hasOpenBalance && "bg-destructive/5",
								)}
							>
								<div className="flex items-center gap-1">
									<CreditCard
										className={cn(
											"h-3.5 w-3.5",
											hasOpenBalance
												? "text-destructive"
												: "text-muted-foreground",
										)}
									/>
									<span
										className={cn(
											"text-xs font-bold",
											hasOpenBalance
												? "text-destructive"
												: "text-muted-foreground",
										)}
									>
										{hasOpenBalance ? formatCurrency(openBalance) : "$0"}
									</span>
								</div>
								<span className="text-muted-foreground text-[10px]">
									{hasOpenBalance ? "Due" : "Balance"}
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>{hasOpenBalance ? "Outstanding Balance" : "No Balance Due"}</p>
							{hasOpenBalance && (
								<p className="text-destructive text-xs">
									{stats.openInvoices} unpaid invoice
									{stats.openInvoices !== 1 ? "s" : ""}
								</p>
							)}
						</TooltipContent>
					</Tooltip>

					{/* Active Jobs */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex flex-col items-center justify-center p-3 transition-colors hover:bg-muted/50">
								<div className="flex items-center gap-1">
									<Briefcase
										className={cn(
											"h-3.5 w-3.5",
											stats.activeJobs > 0
												? "text-primary"
												: "text-muted-foreground",
										)}
									/>
									<span
										className={cn(
											"text-xs font-bold",
											stats.activeJobs > 0
												? "text-primary"
												: "text-muted-foreground",
										)}
									>
										{stats.activeJobs}
									</span>
								</div>
								<span className="text-muted-foreground text-[10px]">
									Active
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Active Jobs</p>
							<p className="text-muted-foreground text-xs">
								{stats.totalJobs} total jobs
							</p>
						</TooltipContent>
					</Tooltip>

					{/* Last Visit */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex flex-col items-center justify-center p-3 transition-colors hover:bg-muted/50">
								<div className="flex items-center gap-1">
									<Clock className="text-muted-foreground h-3.5 w-3.5" />
									<span className="text-foreground text-xs font-bold">
										{formatDate(lastVisitDate ?? null)}
									</span>
								</div>
								<span className="text-muted-foreground text-[10px]">
									Last Visit
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Last Service Visit</p>
							{lastVisitDate && (
								<p className="text-muted-foreground text-xs">
									{new Date(lastVisitDate).toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>
							)}
						</TooltipContent>
					</Tooltip>

					{/* Customer Since */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex flex-col items-center justify-center p-3 transition-colors hover:bg-muted/50">
								<div className="flex items-center gap-1">
									<User className="text-muted-foreground h-3.5 w-3.5" />
									<span className="text-foreground text-xs font-bold">
										{getCustomerTenure()}
									</span>
								</div>
								<span className="text-muted-foreground text-[10px]">
									Member
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Customer Since</p>
							{stats.customerSince && (
								<p className="text-muted-foreground text-xs">
									{new Date(stats.customerSince).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})}
								</p>
							)}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
}
