/**
 * Statistics Utilities
 *
 * Helper functions to generate StatCard arrays from entity metrics
 * Used to generate toolbar stats from various entity types
 */

import type { StatCard } from "@/components/ui/stats-cards";

/**
 * Format currency from cents to string
 */
export function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(cents / 100);
}

/**
 * Format hours to string
 */
export function formatHours(hours: number): string {
	return `${hours.toFixed(1)}h`;
}

/**
 * Format percentage to string
 */
export function formatPercentage(value: number): string {
	return `${value.toFixed(0)}%`;
}

/**
 * Generate job stats from metrics
 */
export function generateJobStats(metrics: {
	totalAmount: number; // in cents
	paidAmount: number; // in cents
	totalLaborHours: number; // decimal hours
	estimatedLaborHours: number; // decimal hours
	materialsCost: number; // in cents
	profitMargin: number; // percentage
	completionPercentage: number; // 0-100
	status: string;
}): StatCard[] {
	// Calculate outstanding balance
	const outstanding = metrics.totalAmount - metrics.paidAmount;

	// Calculate profit (revenue minus costs)
	const estimatedProfit = metrics.totalAmount - metrics.materialsCost;
	const profitMarginCalc = metrics.totalAmount > 0 ? ((estimatedProfit / metrics.totalAmount) * 100).toFixed(0) : 0;

	// Calculate labor efficiency (actual vs estimated)
	const laborEfficiency =
		metrics.estimatedLaborHours > 0
			? ((metrics.totalLaborHours / metrics.estimatedLaborHours) * 100 - 100).toFixed(0)
			: 0;

	return [
		{
			label: "Job Value",
			value: formatCurrency(metrics.totalAmount),
			change: outstanding > 0 ? Number((-((outstanding / metrics.totalAmount) * 100)).toFixed(2)) : undefined,
			changeLabel: outstanding > 0 ? `${formatCurrency(outstanding)} due` : "paid in full",
		},
		{
			label: "Labor Hours",
			value: formatHours(metrics.totalLaborHours),
			change: metrics.estimatedLaborHours > 0 ? Number(laborEfficiency) : 0,
			changeLabel:
				metrics.estimatedLaborHours > 0 ? `vs ${formatHours(metrics.estimatedLaborHours)} est` : "no estimate",
		},
		{
			label: "Profitability",
			value: formatCurrency(estimatedProfit),
			change: Number(profitMarginCalc),
			changeLabel: `${profitMarginCalc}% margin`,
		},
		{
			label: "Progress",
			value: formatPercentage(metrics.completionPercentage),
			change: metrics.completionPercentage === 100 ? 100 : undefined,
			changeLabel: metrics.status,
		},
	];
}

/**
 * Generate customer stats from metrics
 */
export function generateCustomerStats(metrics: {
	totalRevenue: number; // in cents
	totalJobs: number;
	totalProperties: number;
	outstandingBalance: number; // in cents
}): StatCard[] {
	return [
		{
			label: "Total Revenue",
			value: formatCurrency(metrics.totalRevenue),
			change: 0, // TODO: Calculate vs last period
			changeLabel: "all time",
		},
		{
			label: "Jobs",
			value: metrics.totalJobs.toString(),
			change: 0, // TODO: Calculate vs last period
			changeLabel: "total",
		},
		{
			label: "Properties",
			value: metrics.totalProperties.toString(),
			change: 0,
			changeLabel: "locations",
		},
		{
			label: "Outstanding",
			value: formatCurrency(metrics.outstandingBalance),
			change: metrics.outstandingBalance > 0 ? -1 : 0, // Negative if balance exists
			changeLabel: "balance due",
		},
	];
}

/**
 * Format relative date string
 */
function formatDate(dateString: string | null): string {
	if (!dateString) {
		return "Never";
	}
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		return "Today";
	}
	if (diffDays === 1) {
		return "Yesterday";
	}
	if (diffDays < 7) {
		return `${diffDays} days ago`;
	}
	if (diffDays < 30) {
		return `${Math.floor(diffDays / 7)} weeks ago`;
	}
	if (diffDays < 365) {
		return `${Math.floor(diffDays / 30)} months ago`;
	}
	return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format next scheduled date
 */
function formatNextScheduled(dateString: string | null): string {
	if (!dateString) {
		return "Not scheduled";
	}
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = date.getTime() - now.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays < 0) {
		return "Overdue";
	}
	if (diffDays === 0) {
		return "Today";
	}
	if (diffDays === 1) {
		return "Tomorrow";
	}
	if (diffDays < 7) {
		return `In ${diffDays} days`;
	}
	if (diffDays < 30) {
		return `In ${Math.floor(diffDays / 7)} weeks`;
	}
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

/**
 * Generate property stats from metrics
 */
export function generatePropertyStats(metrics: {
	totalJobs: number;
	activeJobs: number;
	totalRevenue: number; // in cents
	lastServiceDate: string | null;
	nextScheduledDate: string | null;
	equipmentCount: number;
}): StatCard[] {
	const jobActivityChange = metrics.activeJobs > 0 ? 100 : 0;

	return [
		{
			label: "Total Jobs",
			value: metrics.totalJobs.toString(),
			change: metrics.activeJobs > 0 ? jobActivityChange : undefined,
			changeLabel: metrics.activeJobs > 0 ? `${metrics.activeJobs} active` : "no active jobs",
		},
		{
			label: "Total Revenue",
			value: formatCurrency(metrics.totalRevenue),
			change: metrics.totalRevenue > 0 ? undefined : 0,
			changeLabel:
				metrics.totalJobs > 0 ? `${metrics.totalJobs} job${metrics.totalJobs !== 1 ? "s" : ""}` : "no jobs yet",
		},
		{
			label: "Last Service",
			value: formatDate(metrics.lastServiceDate),
			change: undefined,
			changeLabel: metrics.lastServiceDate ? "completed" : "no history",
		},
		{
			label: "Next Scheduled",
			value: formatNextScheduled(metrics.nextScheduledDate),
			change: metrics.nextScheduledDate ? 100 : undefined,
			changeLabel: metrics.equipmentCount ? `${metrics.equipmentCount} equipment` : "no equipment",
		},
	];
}

/**
 * Calculate days until due date
 */
function daysUntilDue(dueDate: string | null): number | null {
	if (!dueDate) {
		return null;
	}
	const due = new Date(dueDate);
	const now = new Date();
	const diffTime = due.getTime() - now.getTime();
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate invoice stats from metrics
 */
export function generateInvoiceStats(metrics: {
	totalAmount: number; // in cents
	paidAmount: number; // in cents
	balanceAmount: number; // in cents
	dueDate: string | null;
	status: string;
	createdAt: string;
}): StatCard[] {
	// Calculate percentage paid
	const percentPaid = metrics.totalAmount > 0 ? Math.round((metrics.paidAmount / metrics.totalAmount) * 100) : 0;

	const days = daysUntilDue(metrics.dueDate);
	const isOverdue = days !== null && days < 0;

	return [
		{
			label: "Total Amount",
			value: formatCurrency(metrics.totalAmount),
		},
		{
			label: "Paid",
			value: formatCurrency(metrics.paidAmount),
			change: percentPaid,
			changeLabel: `${percentPaid}% paid`,
		},
		{
			label: "Balance Due",
			value: formatCurrency(metrics.balanceAmount),
			change: metrics.balanceAmount > 0 ? -1 : 1,
		},
		{
			label: "Due Date",
			value: metrics.dueDate
				? new Date(metrics.dueDate).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: "Not set",
			changeLabel:
				days !== null ? (isOverdue ? `${Math.abs(days)} days overdue` : `${days} days remaining`) : undefined,
			change: isOverdue ? -1 : days !== null && days <= 7 ? 0 : 1,
		},
	];
}

/**
 * Format valid until date for estimates
 */
function formatValidUntil(dateString: string | null, daysUntil: number | null): string {
	if (!dateString) {
		return "No expiry";
	}
	if (daysUntil === null) {
		return "No expiry";
	}
	if (daysUntil < 0) {
		return "Expired";
	}
	if (daysUntil === 0) {
		return "Expires today";
	}
	if (daysUntil === 1) {
		return "Expires tomorrow";
	}
	if (daysUntil < 7) {
		return `${daysUntil} days left`;
	}
	return new Date(dateString).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

/**
 * Generate estimate stats from metrics
 */
export function generateEstimateStats(metrics: {
	totalAmount: number; // in cents
	lineItemsCount: number;
	status: string;
	validUntil: string | null;
	daysUntilExpiry: number | null;
	isAccepted: boolean;
}): StatCard[] {
	const statusMap: Record<string, { change: number | undefined; label: string }> = {
		draft: { change: undefined, label: "not sent" },
		sent: { change: 50, label: "awaiting response" },
		accepted: { change: 100, label: "customer approved" },
		rejected: { change: 0, label: "declined" },
	};
	const statusInfo = statusMap[metrics.status.toLowerCase()] || {
		change: undefined,
		label: metrics.status,
	};

	return [
		{
			label: "Estimate Value",
			value: formatCurrency(metrics.totalAmount),
			change: metrics.isAccepted ? 100 : undefined,
			changeLabel: metrics.isAccepted
				? "accepted"
				: `${metrics.lineItemsCount} item${metrics.lineItemsCount !== 1 ? "s" : ""}`,
		},
		{
			label: "Line Items",
			value: metrics.lineItemsCount.toString(),
			change: metrics.lineItemsCount > 0 ? undefined : 0,
			changeLabel: metrics.totalAmount > 0 ? formatCurrency(metrics.totalAmount) : "no items",
		},
		{
			label: "Status",
			value: metrics.status,
			change: statusInfo.change,
			changeLabel: statusInfo.label,
		},
		{
			label: "Valid Until",
			value: formatValidUntil(metrics.validUntil, metrics.daysUntilExpiry),
			change:
				metrics.daysUntilExpiry !== null && metrics.daysUntilExpiry >= 0
					? metrics.daysUntilExpiry < 7
						? 0
						: undefined
					: undefined,
			changeLabel:
				metrics.validUntil && metrics.daysUntilExpiry !== null
					? metrics.daysUntilExpiry < 0
						? "expired"
						: metrics.daysUntilExpiry === 0
							? "today"
							: "valid"
					: "no limit",
		},
	];
}

/**
 * Generate appointment stats from metrics
 */
export function generateAppointmentStats(metrics: {
	duration: number; // minutes
	travelTime: number; // minutes
	teamMemberCount: number;
	jobValue: number; // in cents
}): StatCard[] {
	return [
		{
			label: "Duration",
			value: `${Math.floor(metrics.duration / 60)}h ${metrics.duration % 60}m`,
			change: undefined,
		},
		{
			label: "Travel Time",
			value: metrics.travelTime > 0 ? `${metrics.travelTime}m` : "N/A",
			change: undefined,
		},
		{
			label: "Team Members",
			value: (metrics.teamMemberCount ?? 0).toString(),
			change: undefined,
		},
		{
			label: "Job Value",
			value: formatCurrency(metrics.jobValue),
			change: metrics.jobValue > 100_000 ? 10 : undefined,
		},
	];
}

/**
 * Generate material stats from metrics
 */
export function generateMaterialStats(metrics: {
	quantityOnHand: number;
	quantityReserved: number;
	quantityAvailable: number;
	minimumQuantity: number;
	reorderPoint?: number | null;
	totalValue: number; // in cents
	status: string;
}): StatCard[] {
	const availabilityChange =
		metrics.minimumQuantity > 0
			? Math.round(((metrics.quantityAvailable - metrics.minimumQuantity) / metrics.minimumQuantity) * 100)
			: undefined;

	const reservedPercent =
		metrics.quantityOnHand > 0 && metrics.quantityReserved > 0
			? Math.round((-metrics.quantityReserved / metrics.quantityOnHand) * 100)
			: undefined;

	return [
		{
			label: "On Hand",
			value: metrics.quantityOnHand,
			changeLabel: "total units",
		},
		{
			label: "Available",
			value: metrics.quantityAvailable,
			change: availabilityChange,
			changeLabel: metrics.minimumQuantity > 0 ? `vs min ${metrics.minimumQuantity}` : "available units",
		},
		{
			label: "Reserved",
			value: metrics.quantityReserved,
			change: reservedPercent,
			changeLabel: "allocated",
		},
		{
			label: "Inventory Value",
			value: formatCurrency(metrics.totalValue),
			changeLabel: "at cost",
		},
	];
}

/**
 * Generate purchase order stats from metrics
 */
export function generatePurchaseOrderStats(metrics: {
	totalAmount: number; // in cents
	lineItemCount: number;
	status: string;
	daysUntilDelivery?: number;
}): StatCard[] {
	return [
		{
			label: "Total Amount",
			value: formatCurrency(metrics.totalAmount),
			change: undefined,
		},
		{
			label: "Line Items",
			value: metrics.lineItemCount.toString(),
			change: undefined,
		},
		{
			label: "Status",
			value: metrics.status,
			change: undefined,
		},
		{
			label: "Delivery",
			value:
				metrics.daysUntilDelivery !== undefined
					? metrics.daysUntilDelivery > 0
						? `${metrics.daysUntilDelivery} days`
						: "Today"
					: "Not set",
			change: undefined,
		},
	];
}

/**
 * Generate team member stats from metrics (simple version)
 */
export function generateTeamMemberStatsSimple(metrics: {
	totalJobs: number;
	hoursWorked: number;
	revenueGenerated: number; // in cents
	customerRating: number;
	jobsTrend?: number;
	hoursTrend?: number;
	revenueTrend?: number;
}): StatCard[] {
	return [
		{
			label: "Total Jobs",
			value: metrics.totalJobs.toString(),
			change: metrics.jobsTrend || 0,
			changeLabel: "vs last month",
		},
		{
			label: "Hours Worked",
			value: formatHours(metrics.hoursWorked),
			change: metrics.hoursTrend || 0,
			changeLabel: "vs last month",
		},
		{
			label: "Revenue Generated",
			value: formatCurrency(metrics.revenueGenerated),
			change: metrics.revenueTrend || 0,
			changeLabel: "vs last month",
		},
		{
			label: "Rating",
			value: metrics.customerRating > 0 ? metrics.customerRating.toFixed(1) : "N/A",
			change: 0,
			changeLabel: "customer rating",
		},
	];
}

/**
 * Generate contract stats from metrics
 */
export function generateContractStats(metrics: {
	status: string;
	signedAt?: string | null;
	sentAt?: string | null;
	viewedAt?: string | null;
	validUntil?: string | null;
}): StatCard[] {
	const now = new Date();
	const validUntil = metrics.validUntil ? new Date(metrics.validUntil) : null;
	const daysUntilExpiry = validUntil ? Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

	return [
		{
			label: "Status",
			value: metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1),
			change: undefined,
		},
		...(metrics.signedAt
			? [
					{
						label: "Signed",
						value: new Date(metrics.signedAt).toLocaleDateString(),
						change: undefined,
					},
				]
			: []),
		...(metrics.sentAt && !metrics.signedAt
			? [
					{
						label: "Sent",
						value: new Date(metrics.sentAt).toLocaleDateString(),
						change: undefined,
					},
				]
			: []),
		...(validUntil
			? [
					{
						label: "Expires",
						value:
							daysUntilExpiry !== null
								? daysUntilExpiry > 0
									? `${daysUntilExpiry} days`
									: daysUntilExpiry === 0
										? "Today"
										: "Expired"
								: "Not set",
						change: daysUntilExpiry !== null && daysUntilExpiry < 7 ? -5 : undefined,
					},
				]
			: []),
	];
}

/**
 * Generate payment stats from metrics
 */
export function generatePaymentStats(metrics: {
	amount: number; // in cents
	status: string;
	paymentMethod: string;
	paymentType: string;
	createdAt: string;
	processedAt?: string | null;
	refundedAmount?: number; // in cents
}): StatCard[] {
	const _now = new Date();
	const createdAt = new Date(metrics.createdAt);
	const processedAt = metrics.processedAt ? new Date(metrics.processedAt) : null;

	// Calculate processing time if processed
	const processingTime = processedAt
		? Math.floor((processedAt.getTime() - createdAt.getTime()) / (1000 * 60)) // minutes
		: null;

	const isRefunded = (metrics.refundedAmount || 0) > 0;
	const netAmount = metrics.amount - (metrics.refundedAmount || 0);

	return [
		{
			label: "Payment Amount",
			value: formatCurrency(metrics.amount),
			change: isRefunded ? -1 : metrics.amount > 0 ? 100 : undefined,
			changeLabel: isRefunded ? `${formatCurrency(metrics.refundedAmount || 0)} refunded` : "received",
		},
		{
			label: "Net Amount",
			value: formatCurrency(netAmount),
			change: isRefunded ? -1 : undefined,
			changeLabel: isRefunded ? "after refund" : "processed",
		},
		{
			label: "Status",
			value: metrics.status,
			change: metrics.status === "completed" ? 100 : undefined,
			changeLabel: metrics.status === "completed" ? "successful" : "pending",
		},
		{
			label: "Processing Time",
			value:
				processingTime !== null
					? processingTime < 60
						? `${processingTime}m`
						: `${Math.floor(processingTime / 60)}h ${processingTime % 60}m`
					: "Not processed",
			change: processingTime !== null && processingTime < 30 ? 100 : undefined,
			changeLabel: processingTime !== null ? `from ${createdAt.toLocaleDateString()}` : "awaiting processing",
		},
	];
}

/**
 * Generate team member stats from metrics (detailed version)
 */
export function generateTeamMemberStats(
	metrics:
		| {
				activeJobsCount: number;
				hoursThisMonth: number;
				completionRate: number;
				availableHours: number;
				totalTasksCompleted: number;
				totalTasks: number;
				averageHoursPerMonth: number;
		  }
		| {
				totalJobs: number;
				totalHours: number;
				activeCertifications: number;
				totalCertifications: number;
				completedJobs: number;
				activeJobs: number;
		  }
): StatCard[] {
	// Check which metrics format we have
	if ("activeJobsCount" in metrics) {
		// Original detailed version
		const hoursVsAverage =
			metrics.averageHoursPerMonth > 0
				? (((metrics.hoursThisMonth - metrics.averageHoursPerMonth) / metrics.averageHoursPerMonth) * 100).toFixed(0)
				: 0;

		const completionRateCalc =
			metrics.totalTasks > 0 ? ((metrics.totalTasksCompleted / metrics.totalTasks) * 100).toFixed(0) : 0;

		const availabilityStatus = metrics.availableHours > 0 ? "available" : "fully booked";

		return [
			{
				label: "Active Jobs",
				value: metrics.activeJobsCount.toString(),
				change: metrics.activeJobsCount > 0 ? 12.5 : undefined,
				changeLabel: metrics.activeJobsCount > 0 ? "currently assigned" : "no active assignments",
			},
			{
				label: "Hours This Month",
				value: formatHours(metrics.hoursThisMonth),
				change: metrics.averageHoursPerMonth > 0 ? Number(hoursVsAverage) : undefined,
				changeLabel:
					metrics.averageHoursPerMonth > 0 ? `vs ${formatHours(metrics.averageHoursPerMonth)} avg` : "first month",
			},
			{
				label: "Completion Rate",
				value: formatPercentage(metrics.completionRate),
				change: metrics.completionRate >= 90 ? Number(completionRateCalc) : 0,
				changeLabel: `${metrics.totalTasksCompleted} / ${metrics.totalTasks} tasks`,
			},
			{
				label: "Availability",
				value: formatHours(metrics.availableHours),
				change: metrics.availableHours > 0 ? undefined : 0,
				changeLabel: availabilityStatus,
			},
		];
	}
	// Simplified version for detail pages
	const _completionRate = metrics.totalJobs > 0 ? Math.round((metrics.completedJobs / metrics.totalJobs) * 100) : 0;

	return [
		{
			label: "Active Jobs",
			value: metrics.activeJobs.toString(),
			change: metrics.activeJobs > 0 ? undefined : 0,
			changeLabel: metrics.activeJobs > 0 ? "currently assigned" : "no active assignments",
		},
		{
			label: "Total Jobs",
			value: metrics.totalJobs.toString(),
			change: 0,
			changeLabel: "all time",
		},
		{
			label: "Hours Worked",
			value: formatHours(metrics.totalHours),
			change: 0,
			changeLabel: "lifetime",
		},
		{
			label: "Certifications",
			value: `${metrics.activeCertifications}/${metrics.totalCertifications}`,
			change:
				metrics.activeCertifications === metrics.totalCertifications
					? 100
					: metrics.activeCertifications > 0
						? undefined
						: 0,
			changeLabel:
				metrics.activeCertifications === metrics.totalCertifications
					? "all current"
					: metrics.activeCertifications > 0
						? "active"
						: "none active",
		},
	];
}
