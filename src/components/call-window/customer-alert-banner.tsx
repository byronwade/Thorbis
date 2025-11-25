"use client";

/**
 * Customer Alert Banner Component
 *
 * Displays prominent alerts at the top of the customer sidebar for:
 * - Past due balance (red)
 * - VIP customer status (gold)
 * - Problem history/at-risk (orange)
 * - Recent complaints (needs attention)
 *
 * CSRs need to see critical customer information at a glance
 * without scrolling or hunting through sections.
 */

import {
	AlertTriangle,
	BadgeCheck,
	Ban,
	CreditCard,
	Crown,
	MessageSquareWarning,
	ShieldAlert,
	Star,
	TrendingDown,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerCallData, CustomerStats } from "@/types/call-window";

type AlertType =
	| "past_due"
	| "vip"
	| "at_risk"
	| "complaint"
	| "blocked"
	| "new_customer"
	| "high_value";

type Alert = {
	id: string;
	type: AlertType;
	title: string;
	description: string;
	amount?: number;
	dismissible?: boolean;
	action?: {
		label: string;
		onClick: () => void;
	};
};

type CustomerAlertBannerProps = {
	customerData: CustomerCallData | null;
	stats: CustomerStats | null;
	onTakePayment?: () => void;
	onViewHistory?: () => void;
	onViewComplaints?: () => void;
	className?: string;
};

const alertConfig: Record<
	AlertType,
	{
		icon: React.ElementType;
		bgColor: string;
		borderColor: string;
		textColor: string;
		iconColor: string;
	}
> = {
	past_due: {
		icon: CreditCard,
		bgColor: "bg-destructive/10 dark:bg-destructive/20",
		borderColor: "border-destructive/50",
		textColor: "text-destructive",
		iconColor: "text-destructive",
	},
	vip: {
		icon: Crown,
		bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
		borderColor: "border-amber-500/50",
		textColor: "text-amber-600 dark:text-amber-400",
		iconColor: "text-amber-500",
	},
	at_risk: {
		icon: TrendingDown,
		bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
		borderColor: "border-orange-500/50",
		textColor: "text-orange-600 dark:text-orange-400",
		iconColor: "text-orange-500",
	},
	complaint: {
		icon: MessageSquareWarning,
		bgColor: "bg-warning/10 dark:bg-warning/20",
		borderColor: "border-warning/50",
		textColor: "text-warning",
		iconColor: "text-warning",
	},
	blocked: {
		icon: Ban,
		bgColor: "bg-destructive/15 dark:bg-destructive/25",
		borderColor: "border-destructive",
		textColor: "text-destructive",
		iconColor: "text-destructive",
	},
	new_customer: {
		icon: Star,
		bgColor: "bg-primary/10 dark:bg-primary/20",
		borderColor: "border-primary/50",
		textColor: "text-primary",
		iconColor: "text-primary",
	},
	high_value: {
		icon: BadgeCheck,
		bgColor: "bg-success/10 dark:bg-success/20",
		borderColor: "border-success/50",
		textColor: "text-success",
		iconColor: "text-success",
	},
};

export function CustomerAlertBanner({
	customerData,
	stats,
	onTakePayment,
	onViewHistory,
	onViewComplaints,
	className,
}: CustomerAlertBannerProps) {
	const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
		new Set(),
	);

	// Generate alerts based on customer data
	const alerts: Alert[] = [];

	if (!customerData || !stats) {
		return null;
	}

	const { customer } = customerData;

	// Check for past due invoices
	if (stats.openInvoices > 0) {
		// Calculate total outstanding (from unpaid invoices)
		const unpaidTotal = customerData.invoices
			.filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
			.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

		if (unpaidTotal > 0) {
			const hasOverdue = customerData.invoices.some(
				(inv) => inv.status === "overdue",
			);
			alerts.push({
				id: "past_due",
				type: "past_due",
				title: hasOverdue ? "Past Due Balance" : "Outstanding Balance",
				description: `${stats.openInvoices} unpaid invoice${stats.openInvoices > 1 ? "s" : ""}`,
				amount: unpaidTotal,
				action: onTakePayment
					? { label: "Take Payment", onClick: onTakePayment }
					: undefined,
			});
		}
	}

	// Check for VIP status (based on tags or high revenue)
	const isVIP =
		customer?.tags?.includes("VIP") ||
		customer?.tags?.includes("vip") ||
		customer?.priority_level === "high";
	if (isVIP) {
		alerts.push({
			id: "vip",
			type: "vip",
			title: "VIP Customer",
			description: "Priority service • Extended support",
			dismissible: true,
		});
	}

	// Check for high value customer
	if (stats.totalRevenue > 10000 && !isVIP) {
		alerts.push({
			id: "high_value",
			type: "high_value",
			title: "High Value Customer",
			description: `Lifetime value: ${formatCurrency(stats.totalRevenue)}`,
			dismissible: true,
		});
	}

	// Check for new customer (first call or created recently)
	const isNewCustomer =
		customer?.created_at &&
		new Date(customer.created_at) >
			new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Within 30 days
	if (isNewCustomer && stats.totalRevenue === 0) {
		alerts.push({
			id: "new_customer",
			type: "new_customer",
			title: "New Customer",
			description: "First interaction • Make a great impression!",
			dismissible: true,
		});
	}

	// Check for at-risk indicators (multiple cancelled jobs, declining engagement)
	const cancelledJobs = customerData.jobs.filter(
		(job) => job.status === "cancelled",
	).length;
	if (cancelledJobs >= 2) {
		alerts.push({
			id: "at_risk",
			type: "at_risk",
			title: "At-Risk Customer",
			description: `${cancelledJobs} cancelled jobs • Consider retention offer`,
			action: onViewHistory
				? { label: "View History", onClick: onViewHistory }
				: undefined,
		});
	}

	// Check for recent complaints (would come from notes/communications)
	// This is a placeholder - in production, you'd query for recent negative interactions
	const hasRecentComplaint =
		customer?.notes?.toLowerCase().includes("complaint") ||
		customer?.notes?.toLowerCase().includes("unhappy") ||
		customer?.notes?.toLowerCase().includes("frustrated");
	if (hasRecentComplaint) {
		alerts.push({
			id: "complaint",
			type: "complaint",
			title: "Recent Complaint",
			description: "Customer had a previous issue • Handle with care",
			action: onViewComplaints
				? { label: "View Details", onClick: onViewComplaints }
				: undefined,
		});
	}

	// Check for blocked/problem customer
	if (
		customer?.status === "blocked" ||
		customer?.tags?.includes("problem") ||
		customer?.tags?.includes("do-not-service")
	) {
		alerts.push({
			id: "blocked",
			type: "blocked",
			title: "Service Restricted",
			description: "Check with manager before scheduling",
		});
	}

	// Filter out dismissed alerts
	const visibleAlerts = alerts.filter(
		(alert) => !dismissedAlerts.has(alert.id),
	);

	if (visibleAlerts.length === 0) {
		return null;
	}

	const handleDismiss = (alertId: string) => {
		setDismissedAlerts((prev) => new Set([...prev, alertId]));
	};

	return (
		<div className={cn("space-y-2", className)}>
			{visibleAlerts.map((alert) => {
				const config = alertConfig[alert.type];
				const Icon = config.icon;

				return (
					<div
						className={cn(
							"relative overflow-hidden rounded-lg border p-3 transition-all",
							config.bgColor,
							config.borderColor,
						)}
						key={alert.id}
					>
						<div className="flex items-start gap-3">
							{/* Icon */}
							<div
								className={cn(
									"mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
									config.bgColor,
								)}
							>
								<Icon className={cn("h-4 w-4", config.iconColor)} />
							</div>

							{/* Content */}
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<h4 className={cn("text-sm font-semibold", config.textColor)}>
										{alert.title}
									</h4>
									{alert.amount !== undefined && (
										<Badge
											className={cn("font-mono text-xs", config.textColor)}
											variant="outline"
										>
											{formatCurrency(alert.amount)}
										</Badge>
									)}
								</div>
								<p
									className={cn(
										"mt-0.5 text-xs opacity-80",
										config.textColor,
									)}
								>
									{alert.description}
								</p>

								{/* Action button */}
								{alert.action && (
									<Button
										className={cn("mt-2 h-7 text-xs", config.textColor)}
										onClick={alert.action.onClick}
										size="sm"
										variant="outline"
									>
										{alert.action.label}
									</Button>
								)}
							</div>

							{/* Dismiss button */}
							{alert.dismissible && (
								<Button
									className={cn(
										"h-6 w-6 shrink-0 opacity-60 hover:opacity-100",
										config.textColor,
									)}
									onClick={() => handleDismiss(alert.id)}
									size="icon"
									variant="ghost"
								>
									<X className="h-3 w-3" />
								</Button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// Helper function to format currency
function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}
