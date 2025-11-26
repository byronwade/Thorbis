/**
 * Job Metrics Calculation Utilities
 *
 * Calculates comprehensive job metrics including:
 * - Financial metrics (revenue, costs, profit, margins)
 * - Time metrics (hours logged, estimated vs actual)
 * - Completion metrics (progress, overdue status)
 * - Performance metrics (efficiency, variance)
 *
 * USAGE:
 * ```typescript
 * import { calculateJobMetrics } from '@/lib/queries/job-metrics';
 *
 * const metrics = calculateJobMetrics({
 *   job,
 *   invoices,
 *   estimates,
 *   payments,
 *   purchaseOrders,
 *   timeEntries,
 *   tasks
 * });
 * ```
 */

export interface JobMetricsInput {
	job: {
		id: string;
		status: string;
		priority: string;
		scheduled_start?: string | null;
		scheduled_end?: string | null;
		created_at: string;
		updated_at: string;
	};
	invoices?: Array<{
		total_amount: number;
		paid_amount: number;
		balance_amount: number;
		status: string;
	}>;
	estimates?: Array<{
		total_amount: number;
		status: string;
		converted_at?: string | null;
	}>;
	payments?: Array<{
		amount: number;
		status: string;
		completed_at?: string | null;
	}>;
	purchaseOrders?: Array<{
		total_amount: number;
		status: string;
	}>;
	timeEntries?: Array<{
		total_hours: number;
		hourly_rate?: number;
		is_billable?: boolean;
		is_overtime?: boolean;
		clock_in: string;
		clock_out?: string | null;
	}>;
	tasks?: Array<{
		status: string;
		estimated_hours?: number;
		actual_hours?: number;
	}>;
	financial?: {
		total_amount?: number;
		paid_amount?: number;
		deposit_amount?: number;
	};
}

export interface JobMetrics {
	// Financial Metrics
	financial: {
		totalRevenue: number; // Sum of all invoice totals
		collectedRevenue: number; // Sum of all payments
		outstandingRevenue: number; // Revenue not yet collected
		estimatedRevenue: number; // Sum of pending estimates
		convertedEstimateRevenue: number; // Sum of accepted estimates
		totalCosts: number; // Sum of purchase orders + labor costs
		laborCosts: number; // Sum of time entries * rates
		materialCosts: number; // Sum of purchase orders
		netProfit: number; // Revenue - costs
		profitMargin: number; // (netProfit / totalRevenue) * 100
		depositCollected: number; // Deposit amount if paid
		balanceDue: number; // Remaining balance on all invoices
	};

	// Time Metrics
	time: {
		totalHoursLogged: number; // Sum of all time entries
		billableHours: number; // Sum of billable time entries
		nonBillableHours: number; // Sum of non-billable time entries
		overtimeHours: number; // Sum of overtime entries
		estimatedHours: number; // Sum of task estimates
		actualHours: number; // Sum of task actuals
		hoursVariance: number; // estimated - actual
		hoursVariancePercent: number; // (variance / estimated) * 100
		averageHourlyRate: number; // Total labor cost / total hours
		activeClockedInHours: number; // Hours for currently clocked-in entries
	};

	// Completion Metrics
	completion: {
		overallProgress: number; // Overall % complete (0-100)
		tasksTotal: number; // Total number of tasks
		tasksCompleted: number; // Number of completed tasks
		tasksInProgress: number; // Number of in-progress tasks
		tasksPending: number; // Number of pending tasks
		isOverdue: boolean; // Is job past scheduled end?
		daysOverdue: number; // Days past scheduled end (0 if not overdue)
		estimatedCompletionDate: string | null; // Projected completion
		daysSinceCreated: number; // Days since job created
		daysSinceLastUpdate: number; // Days since last update
	};

	// Status Metrics
	status: {
		jobStatus: string; // Current job status
		priority: string; // Job priority
		hasOpenInvoices: boolean; // Any unpaid invoices?
		hasPendingEstimates: boolean; // Any pending estimates?
		hasActivePurchaseOrders: boolean; // Any open POs?
		isFullyPaid: boolean; // All invoices paid?
		requiresAction: boolean; // Needs attention (overdue, unpaid, etc.)
	};

	// Performance Metrics
	performance: {
		revenuePerHour: number; // Total revenue / total hours
		costPerHour: number; // Total costs / total hours
		profitPerHour: number; // Net profit / total hours
		estimateAccuracy: number; // How accurate were estimates? (0-100)
		invoiceConversionRate: number; // % of estimates converted to invoices
		collectionRate: number; // % of invoiced revenue collected
		efficiency: number; // Actual vs estimated hours efficiency (0-100)
	};

	// Summary
	summary: {
		health: "excellent" | "good" | "fair" | "poor" | "critical"; // Overall job health
		healthScore: number; // 0-100 score
		alerts: string[]; // List of issues requiring attention
		warnings: string[]; // List of potential issues
	};
}

/**
 * Calculate comprehensive job metrics
 */
export function calculateJobMetrics(input: JobMetricsInput): JobMetrics {
	const {
		job,
		invoices = [],
		estimates = [],
		payments = [],
		purchaseOrders = [],
		timeEntries = [],
		tasks = [],
		financial,
	} = input;

	// Common date references for all time calculations
	const now = new Date();
	const createdAt = new Date(job.created_at);
	const updatedAt = new Date(job.updated_at);

	// Initialize metrics
	const metrics: JobMetrics = {
		financial: {
			totalRevenue: 0,
			collectedRevenue: 0,
			outstandingRevenue: 0,
			estimatedRevenue: 0,
			convertedEstimateRevenue: 0,
			totalCosts: 0,
			laborCosts: 0,
			materialCosts: 0,
			netProfit: 0,
			profitMargin: 0,
			depositCollected: 0,
			balanceDue: 0,
		},
		time: {
			totalHoursLogged: 0,
			billableHours: 0,
			nonBillableHours: 0,
			overtimeHours: 0,
			estimatedHours: 0,
			actualHours: 0,
			hoursVariance: 0,
			hoursVariancePercent: 0,
			averageHourlyRate: 0,
			activeClockedInHours: 0,
		},
		completion: {
			overallProgress: 0,
			tasksTotal: tasks.length,
			tasksCompleted: 0,
			tasksInProgress: 0,
			tasksPending: 0,
			isOverdue: false,
			daysOverdue: 0,
			estimatedCompletionDate: null,
			daysSinceCreated: 0,
			daysSinceLastUpdate: 0,
		},
		status: {
			jobStatus: job.status,
			priority: job.priority,
			hasOpenInvoices: false,
			hasPendingEstimates: false,
			hasActivePurchaseOrders: false,
			isFullyPaid: false,
			requiresAction: false,
		},
		performance: {
			revenuePerHour: 0,
			costPerHour: 0,
			profitPerHour: 0,
			estimateAccuracy: 0,
			invoiceConversionRate: 0,
			collectionRate: 0,
			efficiency: 0,
		},
		summary: {
			health: "good",
			healthScore: 0,
			alerts: [],
			warnings: [],
		},
	};

	// === FINANCIAL CALCULATIONS ===

	// Calculate invoice revenue
	metrics.financial.totalRevenue = invoices.reduce(
		(sum, inv) => sum + (inv.total_amount || 0),
		0,
	);
	metrics.financial.balanceDue = invoices.reduce(
		(sum, inv) => sum + (inv.balance_amount || 0),
		0,
	);

	// Calculate collected revenue from payments
	metrics.financial.collectedRevenue = payments
		.filter((p) => p.status === "completed" || p.status === "succeeded")
		.reduce((sum, p) => sum + (p.amount || 0), 0);

	metrics.financial.outstandingRevenue =
		metrics.financial.totalRevenue - metrics.financial.collectedRevenue;

	// Calculate estimate revenue
	const pendingEstimates = estimates.filter(
		(e) => e.status === "pending" || e.status === "sent",
	);
	metrics.financial.estimatedRevenue = pendingEstimates.reduce(
		(sum, e) => sum + (e.total_amount || 0),
		0,
	);

	const convertedEstimates = estimates.filter((e) => e.converted_at);
	metrics.financial.convertedEstimateRevenue = convertedEstimates.reduce(
		(sum, e) => sum + (e.total_amount || 0),
		0,
	);

	// Calculate costs
	metrics.financial.materialCosts = purchaseOrders
		.filter((po) => po.status !== "cancelled")
		.reduce((sum, po) => sum + (po.total_amount || 0), 0);

	// Calculate labor costs from time entries
	timeEntries.forEach((entry) => {
		const hours = entry.total_hours || 0;
		const rate = entry.hourly_rate || 0;
		const laborCost = hours * rate;

		metrics.financial.laborCosts += laborCost;

		// Check if actively clocked in (no clock_out)
		if (!entry.clock_out) {
			const clockInTime = new Date(entry.clock_in);
			const hoursElapsed =
				(now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
			metrics.time.activeClockedInHours += hoursElapsed;
		}
	});

	metrics.financial.totalCosts =
		metrics.financial.laborCosts + metrics.financial.materialCosts;
	metrics.financial.netProfit =
		metrics.financial.totalRevenue - metrics.financial.totalCosts;
	metrics.financial.profitMargin =
		metrics.financial.totalRevenue > 0
			? (metrics.financial.netProfit / metrics.financial.totalRevenue) * 100
			: 0;

	// Deposit from financial table or invoices
	if (financial?.deposit_amount) {
		metrics.financial.depositCollected = financial.deposit_amount;
	}

	// === TIME CALCULATIONS ===

	timeEntries.forEach((entry) => {
		const hours = entry.total_hours || 0;
		metrics.time.totalHoursLogged += hours;

		if (entry.is_billable) {
			metrics.time.billableHours += hours;
		} else {
			metrics.time.nonBillableHours += hours;
		}

		if (entry.is_overtime) {
			metrics.time.overtimeHours += hours;
		}
	});

	// Calculate task time metrics
	tasks.forEach((task) => {
		metrics.time.estimatedHours += task.estimated_hours || 0;
		metrics.time.actualHours += task.actual_hours || 0;
	});

	metrics.time.hoursVariance =
		metrics.time.estimatedHours - metrics.time.actualHours;
	metrics.time.hoursVariancePercent =
		metrics.time.estimatedHours > 0
			? (metrics.time.hoursVariance / metrics.time.estimatedHours) * 100
			: 0;

	metrics.time.averageHourlyRate =
		metrics.time.totalHoursLogged > 0
			? metrics.financial.laborCosts / metrics.time.totalHoursLogged
			: 0;

	// === COMPLETION CALCULATIONS ===

	tasks.forEach((task) => {
		if (task.status === "completed" || task.status === "done") {
			metrics.completion.tasksCompleted++;
		} else if (task.status === "in_progress") {
			metrics.completion.tasksInProgress++;
		} else {
			metrics.completion.tasksPending++;
		}
	});

	metrics.completion.overallProgress =
		tasks.length > 0
			? (metrics.completion.tasksCompleted / tasks.length) * 100
			: 0;

	// Check if overdue
	if (job.scheduled_end) {
		const scheduledEnd = new Date(job.scheduled_end);
		if (now > scheduledEnd && job.status !== "completed") {
			metrics.completion.isOverdue = true;
			metrics.completion.daysOverdue = Math.ceil(
				(now.getTime() - scheduledEnd.getTime()) / (1000 * 60 * 60 * 24),
			);
		}
	}

	// Days since created/updated

	metrics.completion.daysSinceCreated = Math.floor(
		(now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
	);
	metrics.completion.daysSinceLastUpdate = Math.floor(
		(now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24),
	);

	// === STATUS CALCULATIONS ===

	metrics.status.hasOpenInvoices = invoices.some(
		(inv) => inv.status !== "paid" && inv.balance_amount > 0,
	);
	metrics.status.hasPendingEstimates = estimates.some(
		(e) => e.status === "pending",
	);
	metrics.status.hasActivePurchaseOrders = purchaseOrders.some(
		(po) => po.status === "pending" || po.status === "ordered",
	);
	metrics.status.isFullyPaid =
		metrics.financial.totalRevenue > 0 && metrics.financial.balanceDue === 0;

	// === PERFORMANCE CALCULATIONS ===

	metrics.performance.revenuePerHour =
		metrics.time.totalHoursLogged > 0
			? metrics.financial.totalRevenue / metrics.time.totalHoursLogged
			: 0;

	metrics.performance.costPerHour =
		metrics.time.totalHoursLogged > 0
			? metrics.financial.totalCosts / metrics.time.totalHoursLogged
			: 0;

	metrics.performance.profitPerHour =
		metrics.time.totalHoursLogged > 0
			? metrics.financial.netProfit / metrics.time.totalHoursLogged
			: 0;

	// Estimate accuracy (how close were estimates to actuals)
	if (metrics.time.estimatedHours > 0 && metrics.time.actualHours > 0) {
		const variance = Math.abs(
			metrics.time.estimatedHours - metrics.time.actualHours,
		);
		const accuracy = 100 - (variance / metrics.time.estimatedHours) * 100;
		metrics.performance.estimateAccuracy = Math.max(0, Math.min(100, accuracy));
	}

	// Invoice conversion rate
	if (estimates.length > 0) {
		const convertedCount = estimates.filter((e) => e.converted_at).length;
		metrics.performance.invoiceConversionRate =
			(convertedCount / estimates.length) * 100;
	}

	// Collection rate
	if (metrics.financial.totalRevenue > 0) {
		metrics.performance.collectionRate =
			(metrics.financial.collectedRevenue / metrics.financial.totalRevenue) *
			100;
	}

	// Efficiency (actual vs estimated - lower actual is better)
	if (metrics.time.estimatedHours > 0 && metrics.time.actualHours > 0) {
		metrics.performance.efficiency = Math.min(
			100,
			(metrics.time.estimatedHours / metrics.time.actualHours) * 100,
		);
	}

	// === HEALTH SUMMARY ===

	let healthScore = 100;
	const alerts: string[] = [];
	const warnings: string[] = [];

	// Check for critical issues (alerts)
	if (metrics.completion.isOverdue && metrics.completion.daysOverdue > 7) {
		alerts.push(`Job is ${metrics.completion.daysOverdue} days overdue`);
		healthScore -= 20;
	} else if (metrics.completion.isOverdue) {
		warnings.push(`Job is ${metrics.completion.daysOverdue} days overdue`);
		healthScore -= 10;
	}

	if (metrics.financial.profitMargin < 0) {
		alerts.push(
			`Job is unprofitable (${metrics.financial.profitMargin.toFixed(1)}% margin)`,
		);
		healthScore -= 25;
	} else if (metrics.financial.profitMargin < 10) {
		warnings.push(
			`Low profit margin (${metrics.financial.profitMargin.toFixed(1)}%)`,
		);
		healthScore -= 10;
	}

	if (metrics.status.hasOpenInvoices && metrics.financial.balanceDue > 0) {
		const daysOutstanding = metrics.completion.daysSinceLastUpdate;
		if (daysOutstanding > 30) {
			alerts.push(
				`Outstanding balance of $${(metrics.financial.balanceDue / 100).toFixed(2)} for ${daysOutstanding} days`,
			);
			healthScore -= 15;
		} else if (daysOutstanding > 14) {
			warnings.push(
				`Outstanding balance of $${(metrics.financial.balanceDue / 100).toFixed(2)}`,
			);
			healthScore -= 5;
		}
	}

	if (metrics.time.hoursVariancePercent > 50 && metrics.time.actualHours > 0) {
		warnings.push(
			`Hours exceeded estimate by ${metrics.time.hoursVariancePercent.toFixed(0)}%`,
		);
		healthScore -= 10;
	}

	if (
		metrics.completion.daysSinceLastUpdate > 14 &&
		job.status !== "completed"
	) {
		warnings.push(
			`No updates in ${metrics.completion.daysSinceLastUpdate} days`,
		);
		healthScore -= 5;
	}

	if (metrics.time.activeClockedInHours > 0) {
		warnings.push(
			`Active time entry: ${metrics.time.activeClockedInHours.toFixed(1)} hours clocked in`,
		);
	}

	// Determine overall health
	healthScore = Math.max(0, Math.min(100, healthScore));
	metrics.summary.healthScore = healthScore;

	if (healthScore >= 90) {
		metrics.summary.health = "excellent";
	} else if (healthScore >= 75) {
		metrics.summary.health = "good";
	} else if (healthScore >= 60) {
		metrics.summary.health = "fair";
	} else if (healthScore >= 40) {
		metrics.summary.health = "poor";
	} else {
		metrics.summary.health = "critical";
	}

	metrics.summary.alerts = alerts;
	metrics.summary.warnings = warnings;

	// Mark as requiring action if there are any alerts
	metrics.status.requiresAction = alerts.length > 0;

	return metrics;
}

/**
 * Format currency for display
 */
function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

/**
 * Format hours for display
 */
function formatHours(hours: number): string {
	if (hours < 1) {
		return `${Math.round(hours * 60)}m`;
	}
	const h = Math.floor(hours);
	const m = Math.round((hours - h) * 60);
	return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Format percentage for display
 */
function formatPercentage(percentage: number, decimals = 1): string {
	return `${percentage.toFixed(decimals)}%`;
}

/**
 * Get health color for UI
 */
function getHealthColor(health: JobMetrics["summary"]["health"]): string {
	switch (health) {
		case "excellent":
			return "text-green-600";
		case "good":
			return "text-blue-600";
		case "fair":
			return "text-yellow-600";
		case "poor":
			return "text-orange-600";
		case "critical":
			return "text-red-600";
		default:
			return "text-gray-600";
	}
}

/**
 * Get priority color for UI
 */
function getPriorityColor(priority: string): string {
	switch (priority.toLowerCase()) {
		case "urgent":
			return "text-red-600 bg-red-50";
		case "high":
			return "text-orange-600 bg-orange-50";
		case "medium":
			return "text-yellow-600 bg-yellow-50";
		case "low":
			return "text-blue-600 bg-blue-50";
		default:
			return "text-gray-600 bg-gray-50";
	}
}
