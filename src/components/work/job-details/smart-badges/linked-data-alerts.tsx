/**
 * Linked Data Alerts
 * Automatically generate alert badges based on linked data analysis
 */

"use client";

import { AlertCircle, Clock, DollarSign, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type LinkedDataAlertsProps = {
	job: {
		id: string;
		deposit_amount?: number | null;
		deposit_paid_at?: string | null;
		scheduled_end?: string | null;
		status?: string | null;
	};
	invoices?: Array<{
		id: string;
		invoice_number?: string | null;
		due_date?: string | null;
		balance_amount?: number | null;
		total_amount?: number | null;
		status?: string | null;
	}>;
	estimates?: Array<{
		id: string;
		estimate_number?: string | null;
		total_amount?: number | null;
		status?: string | null;
		created_at?: string | null;
	}>;
};

export function LinkedDataAlerts({
	job,
	invoices = [],
	estimates = [],
}: LinkedDataAlertsProps) {
	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / 100);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Calculate past due invoices
	const pastDueInvoices = invoices.filter((inv) => {
		if (!(inv.due_date && inv.balance_amount) || inv.balance_amount <= 0) {
			return false;
		}
		const dueDate = new Date(inv.due_date);
		return dueDate < today;
	});

	const totalPastDue = pastDueInvoices.reduce(
		(sum, inv) => sum + (inv.balance_amount || 0),
		0,
	);

	// Calculate outstanding estimates
	const outstandingEstimates = estimates.filter(
		(est) =>
			est.status === "pending" ||
			est.status === "sent" ||
			est.status === "draft",
	);

	const totalEstimated = outstandingEstimates.reduce(
		(sum, est) => sum + (est.total_amount || 0),
		0,
	);

	// Check unpaid deposit
	const hasUnpaidDeposit =
		job.financial?.deposit_amount &&
		job.financial.deposit_amount > 0 &&
		!job.deposit_paid_at;

	// Check completion overdue
	const isCompletionOverdue =
		job.scheduled_end &&
		new Date(job.scheduled_end) < today &&
		job.status !== "completed" &&
		job.status !== "cancelled";

	const alerts = [];

	// Past Due Invoices Alert
	if (pastDueInvoices.length > 0) {
		alerts.push(
			<HoverCard key="past-due" openDelay={200}>
				<HoverCardTrigger asChild>
					<button className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-700 text-sm transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
						<AlertCircle className="size-4" />
						{pastDueInvoices.length} Past Due • {formatCurrency(totalPastDue)}
					</button>
				</HoverCardTrigger>
				<HoverCardContent align="start" className="w-96" side="bottom">
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-sm">Past Due Invoices</h4>
							<p className="text-muted-foreground text-xs">
								Invoices that are overdue for payment
							</p>
						</div>
						<Separator />
						<div className="space-y-2">
							{pastDueInvoices.map((inv) => {
								const daysPastDue = Math.floor(
									(today.getTime() - new Date(inv.due_date!).getTime()) /
										(1000 * 60 * 60 * 24),
								);
								return (
									<div
										className="flex items-start justify-between rounded-md bg-red-50 p-2 dark:bg-red-900/20"
										key={inv.id}
									>
										<div className="flex flex-col gap-0.5">
											<span className="font-medium text-sm">
												#{inv.invoice_number || inv.id.slice(0, 8)}
											</span>
											<span className="text-muted-foreground text-xs">
												{daysPastDue} day{daysPastDue !== 1 ? "s" : ""} overdue
											</span>
										</div>
										<span className="font-semibold text-red-600 text-sm dark:text-red-400">
											{formatCurrency(inv.balance_amount || 0)}
										</span>
									</div>
								);
							})}
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">Total Past Due</span>
							<span className="font-bold text-base text-red-600 dark:text-red-400">
								{formatCurrency(totalPastDue)}
							</span>
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>,
		);
	}

	// Outstanding Estimates Alert
	if (outstandingEstimates.length > 0) {
		alerts.push(
			<HoverCard key="estimates" openDelay={200}>
				<HoverCardTrigger asChild>
					<button className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-medium text-amber-700 text-sm transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
						<FileText className="size-4" />
						{outstandingEstimates.length} Pending •{" "}
						{formatCurrency(totalEstimated)}
					</button>
				</HoverCardTrigger>
				<HoverCardContent align="start" className="w-96" side="bottom">
					<div className="space-y-3">
						<div>
							<h4 className="font-semibold text-sm">Outstanding Estimates</h4>
							<p className="text-muted-foreground text-xs">
								Estimates awaiting customer approval
							</p>
						</div>
						<Separator />
						<div className="space-y-2">
							{outstandingEstimates.map((est) => (
								<div
									className="flex items-start justify-between rounded-md bg-amber-50 p-2 dark:bg-amber-900/20"
									key={est.id}
								>
									<div className="flex flex-col gap-0.5">
										<span className="font-medium text-sm">
											#{est.estimate_number || est.id.slice(0, 8)}
										</span>
										<Badge className="w-fit capitalize" variant="outline">
											{est.status}
										</Badge>
									</div>
									<span className="font-semibold text-sm">
										{formatCurrency(est.total_amount || 0)}
									</span>
								</div>
							))}
						</div>
						<Separator />
						<div className="flex items-center justify-between">
							<span className="font-semibold text-sm">Total Estimated</span>
							<span className="font-bold text-amber-600 text-base dark:text-amber-400">
								{formatCurrency(totalEstimated)}
							</span>
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>,
		);
	}

	// Unpaid Deposit Alert
	if (hasUnpaidDeposit) {
		alerts.push(
			<button
				className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-700 text-sm transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
				key="deposit"
			>
				<DollarSign className="size-4" />
				Deposit Due • {formatCurrency(job.financial?.deposit_amount ?? 0)}
			</button>,
		);
	}

	// Completion Overdue Alert
	if (isCompletionOverdue) {
		const daysPastDue = Math.floor(
			(today.getTime() - new Date(job.scheduled_end!).getTime()) /
				(1000 * 60 * 60 * 24),
		);
		alerts.push(
			<button
				className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-medium text-amber-700 text-sm transition-colors hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400"
				key="overdue"
			>
				<Clock className="size-4" />
				{daysPastDue} Day{daysPastDue !== 1 ? "s" : ""} Overdue
			</button>,
		);
	}

	if (alerts.length === 0) {
		return null;
	}

	return <>{alerts}</>;
}
