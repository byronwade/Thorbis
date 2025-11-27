"use client";

/**
 * Customer Status Indicator
 *
 * Visual at-a-glance status bar for CSRs showing:
 * - Customer tier (VIP, Premium, Regular, New)
 * - Payment standing (green/yellow/red based on balance)
 * - Service history tier (based on job count and tenure)
 *
 * Designed to be compact and instantly readable during calls.
 */

import { Award, Crown, Sparkles, Star, TrendingUp, User, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CustomerStats } from "@/types/call";

type CustomerStatusIndicatorProps = {
	stats: CustomerStats;
	openBalance?: number;
	hasOverdueInvoices?: boolean;
	className?: string;
};

// Customer tiers based on revenue
type CustomerTier = {
	name: string;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
	borderColor: string;
};

const getCustomerTier = (revenue: number): CustomerTier => {
	if (revenue >= 25000) {
		return {
			name: "VIP",
			icon: <Crown className="h-3 w-3" />,
			color: "text-amber-500",
			bgColor: "bg-amber-500/10",
			borderColor: "border-amber-500/30",
		};
	}
	if (revenue >= 10000) {
		return {
			name: "Premium",
			icon: <Star className="h-3 w-3" />,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
			borderColor: "border-purple-500/30",
		};
	}
	if (revenue >= 5000) {
		return {
			name: "Valued",
			icon: <Award className="h-3 w-3" />,
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
			borderColor: "border-blue-500/30",
		};
	}
	if (revenue >= 1000) {
		return {
			name: "Regular",
			icon: <User className="h-3 w-3" />,
			color: "text-slate-500",
			bgColor: "bg-slate-500/10",
			borderColor: "border-slate-500/30",
		};
	}
	return {
		name: "New",
		icon: <Sparkles className="h-3 w-3" />,
		color: "text-emerald-500",
		bgColor: "bg-emerald-500/10",
		borderColor: "border-emerald-500/30",
	};
};

// Payment status
type PaymentStatus = {
	status: "good" | "attention" | "urgent";
	label: string;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
};

const getPaymentStatus = (openBalance: number, hasOverdue: boolean): PaymentStatus => {
	if (hasOverdue) {
		return {
			status: "urgent",
			label: "Overdue",
			icon: <AlertTriangle className="h-3 w-3" />,
			color: "text-red-500",
			bgColor: "bg-red-500/10",
		};
	}
	if (openBalance > 0) {
		return {
			status: "attention",
			label: "Balance Due",
			icon: <Clock className="h-3 w-3" />,
			color: "text-amber-500",
			bgColor: "bg-amber-500/10",
		};
	}
	return {
		status: "good",
		label: "Good Standing",
		icon: <CheckCircle className="h-3 w-3" />,
		color: "text-emerald-500",
		bgColor: "bg-emerald-500/10",
	};
};

// Service tier based on engagement
type ServiceTier = {
	name: string;
	description: string;
	icon: React.ReactNode;
	color: string;
};

const getServiceTier = (totalJobs: number, customerSince: string | null): ServiceTier => {
	const tenureYears = customerSince
		? (Date.now() - new Date(customerSince).getTime()) / (1000 * 60 * 60 * 24 * 365)
		: 0;

	// High engagement: lots of jobs or long tenure with activity
	if (totalJobs >= 20 || (totalJobs >= 10 && tenureYears >= 2)) {
		return {
			name: "Loyal",
			description: "Long-term repeat customer",
			icon: <TrendingUp className="h-3 w-3" />,
			color: "text-emerald-500",
		};
	}
	// Medium engagement
	if (totalJobs >= 5 || (totalJobs >= 3 && tenureYears >= 1)) {
		return {
			name: "Active",
			description: "Regular customer",
			icon: <TrendingUp className="h-3 w-3" />,
			color: "text-blue-500",
		};
	}
	// Low engagement but returning
	if (totalJobs >= 2) {
		return {
			name: "Returning",
			description: "Repeat customer",
			icon: <TrendingUp className="h-3 w-3" />,
			color: "text-slate-500",
		};
	}
	// First-time customer
	return {
		name: "First-Time",
		description: "New customer",
		icon: <Sparkles className="h-3 w-3" />,
		color: "text-purple-500",
	};
};

export function CustomerStatusIndicator({
	stats,
	openBalance = 0,
	hasOverdueInvoices = false,
	className,
}: CustomerStatusIndicatorProps) {
	const customerTier = getCustomerTier(stats.totalRevenue);
	const paymentStatus = getPaymentStatus(openBalance, hasOverdueInvoices);
	const serviceTier = getServiceTier(stats.totalJobs, stats.customerSince);

	return (
		<TooltipProvider delayDuration={200}>
			<div className={cn("flex items-center gap-1.5", className)}>
				{/* Customer Tier Badge */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge
							variant="outline"
							className={cn(
								"gap-1 border px-2 py-0.5 text-[10px] font-semibold",
								customerTier.bgColor,
								customerTier.borderColor,
								customerTier.color,
							)}
						>
							{customerTier.icon}
							{customerTier.name}
						</Badge>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="font-medium">{customerTier.name} Customer</p>
						<p className="text-muted-foreground text-xs">
							Lifetime value: ${stats.totalRevenue.toLocaleString()}
						</p>
					</TooltipContent>
				</Tooltip>

				{/* Payment Status Indicator */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								"flex items-center gap-1 rounded-full px-2 py-0.5",
								paymentStatus.bgColor,
							)}
						>
							<span className={paymentStatus.color}>{paymentStatus.icon}</span>
							<span className={cn("text-[10px] font-medium", paymentStatus.color)}>
								{paymentStatus.label}
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="font-medium">Payment Status</p>
						{openBalance > 0 ? (
							<p className="text-muted-foreground text-xs">
								Outstanding: ${openBalance.toLocaleString()}
								{hasOverdueInvoices && " (includes overdue)"}
							</p>
						) : (
							<p className="text-muted-foreground text-xs">No outstanding balance</p>
						)}
					</TooltipContent>
				</Tooltip>

				{/* Service Tier (subtle, shows on hover) */}
				<Tooltip>
					<TooltipTrigger asChild>
						<span className={cn("text-[10px]", serviceTier.color)}>
							{serviceTier.icon}
						</span>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="font-medium">{serviceTier.name} Customer</p>
						<p className="text-muted-foreground text-xs">{serviceTier.description}</p>
						<p className="text-muted-foreground text-xs">{stats.totalJobs} total jobs</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}

/**
 * Compact Status Dot
 *
 * A minimal indicator showing just the payment status as a colored dot.
 * Useful for tight spaces like table rows.
 */
type StatusDotProps = {
	openBalance: number;
	hasOverdueInvoices?: boolean;
	className?: string;
};

export function CustomerStatusDot({
	openBalance,
	hasOverdueInvoices = false,
	className,
}: StatusDotProps) {
	const status = getPaymentStatus(openBalance, hasOverdueInvoices);

	const dotColors = {
		good: "bg-emerald-500",
		attention: "bg-amber-500",
		urgent: "bg-red-500 animate-pulse",
	};

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className={cn(
							"inline-block h-2 w-2 rounded-full",
							dotColors[status.status],
							className,
						)}
					/>
				</TooltipTrigger>
				<TooltipContent side="top">
					<p className="text-xs">{status.label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
