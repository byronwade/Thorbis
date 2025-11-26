"use client";

/**
 * AI Job Assistant Header
 *
 * Seamlessly integrated intelligent insights without AI branding.
 * Clean, minimal design matching existing UI patterns.
 */

import {
	AlertCircle,
	ArrowRight,
	CheckCircle,
	Clock,
	DollarSign,
	Lightbulb,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";

interface AIJobAssistantHeaderProps {
	job: any;
	customer: any | null;
	property: any | null;
	metrics: any;
	teamAssignments: any[];
	timeEntries: any[];
	invoices: any[];
	payments: any[];
	estimates: any[];
	userRole?: string;
	onTitleChange: (value: string) => void;
	onSave?: () => void;
	onCancel?: () => void;
	isSaving?: boolean;
	hasChanges?: boolean;
}

interface AIInsight {
	type: "critical" | "warning" | "info" | "success";
	icon: React.ReactNode;
	title: string;
	message: string;
	action?: {
		label: string;
		href?: string;
		onClick?: () => void;
	};
}

export function AIJobAssistantHeader({
	job,
	customer,
	property,
	metrics,
	teamAssignments,
	timeEntries,
	invoices,
	payments,
	estimates,
	userRole = "owner",
	onTitleChange,
	onSave,
	onCancel,
	isSaving = false,
	hasChanges = false,
}: AIJobAssistantHeaderProps) {
	const [insights, setInsights] = useState<AIInsight[]>([]);

	useEffect(() => {
		const generatedInsights = generateInsights({
			job,
			customer,
			property,
			metrics,
			teamAssignments,
			timeEntries,
			invoices,
			payments,
			estimates,
			userRole,
		});

		setInsights(generatedInsights);
	}, [
		job.id,
		job.status,
		job.priority,
		customer?.id,
		metrics.totalAmount,
		metrics.paidAmount,
		teamAssignments.length,
		invoices.length,
		userRole,
	]);

	return (
		<div className="space-y-4">
			{/* Title Row */}
			<div className="flex items-start gap-4">
				<div className="flex-1 min-w-0">
					<Input
						className="h-auto border-0 bg-transparent p-0 text-2xl font-bold tracking-tight shadow-none focus-visible:ring-0 md:text-3xl"
						onChange={(e) => onTitleChange(e.target.value)}
						placeholder="Enter job title..."
						value={job.title}
					/>
					<div className="mt-2 flex flex-wrap items-center gap-2">
						<Badge variant="secondary" className="font-mono text-xs">
							#{job.job_number}
						</Badge>
						<Badge
							variant={getStatusVariant(job.status)}
							className="capitalize"
						>
							{job.status?.replace(/_/g, " ")}
						</Badge>
						{job.priority && job.priority !== "low" && (
							<Badge
								variant={getPriorityVariant(job.priority)}
								className="capitalize"
							>
								{job.priority}
							</Badge>
						)}
					</div>
				</div>

				{/* Save/Cancel Buttons */}
				{hasChanges && (
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" onClick={onCancel}>
							Cancel
						</Button>
						<Button size="sm" onClick={onSave} disabled={isSaving}>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				)}
			</div>

			{/* Insights - Only show if there are any */}
			{insights.length > 0 && (
				<>
					<Separator />
					<div className="space-y-2">
						{insights.map((insight, index) => (
							<InsightAlert key={index} insight={insight} />
						))}
					</div>
				</>
			)}
		</div>
	);
}

function InsightAlert({ insight }: { insight: AIInsight }) {
	const getVariant = (type: AIInsight["type"]) => {
		switch (type) {
			case "critical":
				return "destructive";
			case "warning":
				return "default";
			default:
				return "default";
		}
	};

	const getIconColor = (type: AIInsight["type"]) => {
		switch (type) {
			case "critical":
				return "text-destructive";
			case "warning":
				return "text-yellow-600 dark:text-yellow-400";
			case "success":
				return "text-green-600 dark:text-green-400";
			default:
				return "text-blue-600 dark:text-blue-400";
		}
	};

	return (
		<Alert variant={getVariant(insight.type)} className="relative">
			<div className="flex items-start gap-3">
				<div className={`mt-0.5 shrink-0 ${getIconColor(insight.type)}`}>
					{insight.icon}
				</div>
				<div className="flex-1 min-w-0 space-y-1">
					<div className="font-semibold text-sm leading-tight">
						{insight.title}
					</div>
					<AlertDescription className="text-xs leading-relaxed">
						{insight.message}
					</AlertDescription>
					{insight.action && (
						<Button
							variant="link"
							size="sm"
							className="h-auto p-0 text-xs gap-1"
							onClick={insight.action.onClick}
						>
							{insight.action.label}
							<ArrowRight className="h-3 w-3" />
						</Button>
					)}
				</div>
			</div>
		</Alert>
	);
}

/**
 * Generate insights based on job context
 */
function generateInsights(context: {
	job: any;
	customer: any;
	property: any;
	metrics: any;
	teamAssignments: any[];
	timeEntries: any[];
	invoices: any[];
	payments: any[];
	estimates: any[];
	userRole: string;
}): AIInsight[] {
	const {
		job,
		customer,
		metrics,
		teamAssignments,
		timeEntries,
		invoices,
		payments,
		estimates,
		userRole,
	} = context;

	const insights: AIInsight[] = [];
	const now = new Date();

	// Safely calculate total due (metrics are in cents)
	const totalDue = (metrics.totalAmount || 0) - (metrics.paidAmount || 0);

	// Calculate key metrics
	const scheduledStart = job.scheduled_start
		? new Date(job.scheduled_start)
		: null;
	const isOverdue =
		scheduledStart && scheduledStart < now && job.status !== "completed";

	const overdueInvoices = invoices.filter((inv: any) => {
		const dueDate = inv.due_date ? new Date(inv.due_date) : null;
		return dueDate && dueDate < now && inv.status !== "paid";
	});

	// Critical: Overdue Job
	if (isOverdue && teamAssignments.length === 0) {
		const hoursOverdue = Math.floor(
			(now.getTime() - scheduledStart!.getTime()) / (1000 * 60 * 60),
		);

		insights.push({
			type: "critical",
			icon: <AlertCircle className="h-4 w-4" />,
			title: `Job Overdue by ${hoursOverdue} hours`,
			message:
				userRole === "dispatcher"
					? `This job was scheduled ${hoursOverdue}h ago but no technician is assigned. Dispatch protocol requires immediate assignment for jobs overdue by more than 2 hours.`
					: `This job is ${hoursOverdue} hours overdue. Company policy requires immediate action for jobs past their scheduled time. Contact dispatch or reassign technicians.`,
			action: {
				label: "Assign Technician",
				onClick: () => {
					// Scroll to team assignment section
					const element = document.querySelector(
						'[data-section="team-assignments"]',
					);
					element?.scrollIntoView({ behavior: "smooth", block: "center" });
				},
			},
		});
	}

	// Critical: Overdue Payment (30+ days)
	if (overdueInvoices.length > 0 && totalDue > 0) {
		const oldestInvoice = overdueInvoices.reduce((oldest: any, inv: any) => {
			const invDue = new Date(inv.due_date);
			const oldestDue = new Date(oldest.due_date);
			return invDue < oldestDue ? inv : oldest;
		});

		const daysOverdue = Math.floor(
			(now.getTime() - new Date(oldestInvoice.due_date).getTime()) /
				(1000 * 60 * 60 * 24),
		);

		if (daysOverdue >= 30) {
			insights.push({
				type: "critical",
				icon: <DollarSign className="h-4 w-4" />,
				title: `Outstanding Balance: ${formatCurrency(totalDue)} (${daysOverdue} days overdue)`,
				message:
					userRole === "owner" || userRole === "manager"
						? `Company policy requires escalation for accounts 30+ days past due. The balance of ${formatCurrency(totalDue)} has been outstanding since ${new Date(oldestInvoice.due_date).toLocaleDateString()}. Consider collection agency referral or payment plan negotiation.`
						: `This account is ${daysOverdue} days past due. Per company policy, accounts over 30 days require manager approval before scheduling additional work. Contact management before proceeding.`,
				action: {
					label: "View Invoices",
					onClick: () => {
						const element = document.querySelector('[data-section="invoices"]');
						element?.scrollIntoView({ behavior: "smooth", block: "center" });
					},
				},
			});
		} else if (daysOverdue >= 15) {
			insights.push({
				type: "warning",
				icon: <Clock className="h-4 w-4" />,
				title: `Payment Overdue: ${formatCurrency(totalDue)} (${daysOverdue} days)`,
				message: `Customer has an outstanding balance ${daysOverdue} days past due. Company policy recommends friendly follow-up call at 15 days. Consider offering payment plan or checking if there are service quality concerns.`,
				action: {
					label: "Send Payment Reminder",
					onClick: () => {
						// Open payment reminder dialog
					},
				},
			});
		}
	}

	// Warning: High-Value Job Without Estimate
	const estimatedValue = metrics.totalAmount || 0;
	if (estimatedValue > 500000 && estimates.length === 0) {
		// $5000 in cents
		insights.push({
			type: "warning",
			icon: <Lightbulb className="h-4 w-4" />,
			title: "High-Value Job Without Approved Estimate",
			message:
				userRole === "technician"
					? "Company policy requires written estimates for jobs over $5,000 before work begins. Ensure you have customer approval documented before proceeding with any repairs or installations."
					: `This is a high-value job (potential revenue ${formatCurrency(estimatedValue)}) with no estimate on file. Best practice is to provide detailed written estimates for all jobs exceeding $5,000 to protect both the company and customer.`,
			action: {
				label: "Create Estimate",
				onClick: () => {
					// Navigate to estimate creation
				},
			},
		});
	}

	// Info: VIP Customer
	const customerLifetimeValue = (customer?.total_revenue || 0) * 100; // Convert to cents
	if (customerLifetimeValue > 1000000) {
		// $10,000 in cents
		insights.push({
			type: "success",
			icon: <TrendingUp className="h-4 w-4" />,
			title: `VIP Customer: ${formatCurrency(customerLifetimeValue)} Lifetime Value`,
			message: `${customer?.display_name || customer?.first_name + " " + customer?.last_name} is a high-value customer with ${formatCurrency(customerLifetimeValue)} in total revenue. Prioritize excellent service and consider offering loyalty perks or discounts on future work.`,
			action: {
				label: "View Customer History",
				onClick: () => {
					window.location.href = `/dashboard/customers/${customer?.id}`;
				},
			},
		});
	}

	// Info: Active Time Entry
	const activeEntry = timeEntries.find(
		(entry: any) => entry.clock_in_time && !entry.clock_out_time,
	);
	if (activeEntry) {
		const clockInTime = new Date(activeEntry.clock_in_time);
		const hoursWorked =
			(now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

		insights.push({
			type: "info",
			icon: <Zap className="h-4 w-4" />,
			title: "Job In Progress",
			message:
				userRole === "technician"
					? `You've been clocked in for ${hoursWorked.toFixed(1)} hours. Remember to clock out when complete and document all parts used and work performed.`
					: `Technician currently on-site and clocked in for ${hoursWorked.toFixed(1)} hours. Real-time updates available in team tracking.`,
			action: {
				label: "View Time Entries",
				onClick: () => {
					const element = document.querySelector(
						'[data-section="time-entries"]',
					);
					element?.scrollIntoView({ behavior: "smooth", block: "center" });
				},
			},
		});
	}

	// Success: Recent Payment
	if (payments.length > 0) {
		const recentPayment = payments[0]; // Assuming sorted by date
		const paymentDate = new Date(
			recentPayment.payment_date || recentPayment.created_at,
		);
		const daysAgo = Math.floor(
			(now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (daysAgo <= 7) {
			insights.push({
				type: "success",
				icon: <CheckCircle className="h-4 w-4" />,
				title: "Recent Payment Received",
				message: `Customer paid ${formatCurrency(recentPayment.amount)} ${daysAgo === 0 ? "today" : daysAgo + " days ago"}. Account is in good standing. Consider following up to ensure satisfaction and request a review.`,
				action: {
					label: "Send Review Request",
					onClick: () => {
						// Open review request dialog
					},
				},
			});
		}
	}

	// Role-Specific Insights
	if (
		userRole === "dispatcher" &&
		teamAssignments.length === 0 &&
		job.status === "scheduled"
	) {
		insights.push({
			type: "warning",
			icon: <Clock className="h-4 w-4" />,
			title: "Technician Assignment Required",
			message:
				"This job is scheduled but has no technician assigned. Dispatch protocol requires all scheduled jobs to have team assignments at least 24 hours in advance for route optimization.",
			action: {
				label: "Assign Team",
				onClick: () => {
					const element = document.querySelector(
						'[data-section="team-assignments"]',
					);
					element?.scrollIntoView({ behavior: "smooth", block: "center" });
				},
			},
		});
	}

	if (
		userRole === "technician" &&
		job.status === "in_progress" &&
		!activeEntry
	) {
		insights.push({
			type: "warning",
			icon: <Clock className="h-4 w-4" />,
			title: "Clock-In Reminder",
			message:
				"This job is marked as 'In Progress' but you haven't clocked in yet. Company policy requires accurate time tracking for all billable hours. Please clock in before starting work.",
			action: {
				label: "Clock In Now",
				onClick: () => {
					// Open clock in dialog
				},
			},
		});
	}

	return insights;
}

// Helper functions
function getStatusVariant(
	status: string,
): "default" | "secondary" | "destructive" | "outline" {
	switch (status?.toLowerCase()) {
		case "completed":
		case "paid":
			return "default";
		case "in_progress":
		case "scheduled":
			return "secondary";
		case "overdue":
		case "cancelled":
		case "urgent":
			return "destructive";
		default:
			return "outline";
	}
}

function getPriorityVariant(
	priority: string,
): "default" | "destructive" | "outline" {
	if (priority === "urgent" || priority === "high") return "destructive";
	return "outline";
}
