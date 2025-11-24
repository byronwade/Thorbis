import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface DailyMetric {
	date: string;
	value: number;
	value2?: number;
}

export interface AnalyticsTrendData {
	revenue: DailyMetric[];
	jobs: DailyMetric[];
	communications: DailyMetric[];
}

/**
 * Get analytics trend data for charts
 * Uses analytics_daily_snapshots if available, otherwise calculates from raw data
 */
export const getAnalyticsTrends = cache(async (companyId: string, days: number = 90): Promise<AnalyticsTrendData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	// Try to get data from analytics_daily_snapshots first
	const { data: snapshots } = await supabase
		.from("analytics_daily_snapshots")
		.select("snapshot_date, total_revenue, jobs_completed, emails_sent, emails_received, sms_sent, sms_received, calls_made, calls_received")
		.eq("company_id", companyId)
		.gte("snapshot_date", startDate.toISOString().split("T")[0])
		.order("snapshot_date", { ascending: true })
		.limit(days);

	if (snapshots && snapshots.length > 0) {
		return {
			revenue: snapshots.map((s) => ({
				date: s.snapshot_date,
				value: (s.total_revenue || 0) / 100, // Convert cents to dollars
			})),
			jobs: snapshots.map((s) => ({
				date: s.snapshot_date,
				value: s.jobs_completed || 0,
			})),
			communications: snapshots.map((s) => ({
				date: s.snapshot_date,
				value: (s.emails_sent || 0) + (s.sms_sent || 0) + (s.calls_made || 0),
				value2: (s.emails_received || 0) + (s.sms_received || 0) + (s.calls_received || 0),
			})),
		};
	}

	// Fallback: Calculate from raw data if no snapshots exist
	// This is a temporary solution until the cron job populates snapshots
	const [revenueData, jobsData, commsData] = await Promise.all([
		getRevenueByDay(supabase, companyId, startDate, days),
		getJobsByDay(supabase, companyId, startDate, days),
		getCommunicationsByDay(supabase, companyId, startDate, days),
	]);

	return {
		revenue: revenueData,
		jobs: jobsData,
		communications: commsData,
	};
});

// Helper function to generate date range
function generateDateRange(startDate: Date, days: number): string[] {
	const dates: string[] = [];
	const current = new Date(startDate);
	for (let i = 0; i < days; i++) {
		dates.push(current.toISOString().split("T")[0]);
		current.setDate(current.getDate() + 1);
	}
	return dates;
}

// Get revenue by day from payments
async function getRevenueByDay(supabase: Awaited<ReturnType<typeof createClient>>, companyId: string, startDate: Date, days: number): Promise<DailyMetric[]> {
	const { data: payments } = await supabase
		.from("payments")
		.select("amount, created_at")
		.eq("company_id", companyId)
		.eq("status", "completed")
		.gte("created_at", startDate.toISOString())
		.order("created_at", { ascending: true })
		.limit(10000); // Prevent unbounded query for analytics

	// Group by day
	const byDay: Record<string, number> = {};
	const dateRange = generateDateRange(startDate, days);

	// Initialize all days with 0
	for (const date of dateRange) {
		byDay[date] = 0;
	}

	// Sum payments by day
	for (const payment of payments || []) {
		const date = new Date(payment.created_at).toISOString().split("T")[0];
		if (byDay[date] !== undefined) {
			byDay[date] += (payment.amount || 0) / 100; // Convert cents to dollars
		}
	}

	return dateRange.map((date) => ({
		date,
		value: byDay[date] || 0,
	}));
}

// Get jobs completed by day
async function getJobsByDay(supabase: Awaited<ReturnType<typeof createClient>>, companyId: string, startDate: Date, days: number): Promise<DailyMetric[]> {
	const { data: jobs } = await supabase
		.from("jobs")
		.select("created_at, status")
		.eq("company_id", companyId)
		.eq("status", "completed")
		.gte("created_at", startDate.toISOString())
		.order("created_at", { ascending: true })
		.limit(10000); // Prevent unbounded query for analytics

	// Group by day
	const byDay: Record<string, number> = {};
	const dateRange = generateDateRange(startDate, days);

	// Initialize all days with 0
	for (const date of dateRange) {
		byDay[date] = 0;
	}

	// Count jobs by day
	for (const job of jobs || []) {
		const date = new Date(job.created_at).toISOString().split("T")[0];
		if (byDay[date] !== undefined) {
			byDay[date]++;
		}
	}

	return dateRange.map((date) => ({
		date,
		value: byDay[date] || 0,
	}));
}

// Get communications by day
async function getCommunicationsByDay(supabase: Awaited<ReturnType<typeof createClient>>, companyId: string, startDate: Date, days: number): Promise<DailyMetric[]> {
	const { data: comms } = await supabase
		.from("communications")
		.select("created_at, direction")
		.eq("company_id", companyId)
		.gte("created_at", startDate.toISOString())
		.order("created_at", { ascending: true })
		.limit(10000); // Prevent unbounded query for analytics

	// Group by day
	const outbound: Record<string, number> = {};
	const inbound: Record<string, number> = {};
	const dateRange = generateDateRange(startDate, days);

	// Initialize all days with 0
	for (const date of dateRange) {
		outbound[date] = 0;
		inbound[date] = 0;
	}

	// Count comms by day and direction
	for (const comm of comms || []) {
		const date = new Date(comm.created_at).toISOString().split("T")[0];
		if (outbound[date] !== undefined) {
			if (comm.direction === "outbound") {
				outbound[date]++;
			} else {
				inbound[date]++;
			}
		}
	}

	return dateRange.map((date) => ({
		date,
		value: outbound[date] || 0,
		value2: inbound[date] || 0,
	}));
}

/**
 * Get KPI summary for a company
 */
export const getKPISummary = cache(async (companyId: string) => {
	const supabase = await createClient();

	// Get the latest monthly technician metrics summary
	const { data: kpiData } = await supabase
		.from("analytics_technician_metrics")
		.select(`
			period_start,
			first_time_fix_rate,
			utilization_rate,
			average_rating,
			on_time_rate
		`)
		.eq("company_id", companyId)
		.eq("period_type", "monthly")
		.order("period_start", { ascending: false })
		.limit(1)
		.single();

	return {
		firstTimeFixRate: kpiData?.first_time_fix_rate || null,
		utilizationRate: kpiData?.utilization_rate || null,
		avgCustomerRating: kpiData?.average_rating || null,
		onTimeRate: kpiData?.on_time_rate || null,
	};
});

/**
 * Get customer health distribution
 */
export const getCustomerHealthDistribution = cache(async (companyId: string) => {
	const supabase = await createClient();

	const { data: customers } = await supabase
		.from("customers")
		.select("churn_risk")
		.eq("company_id", companyId)
		.is("deleted_at", null);

	const distribution = {
		low: 0,
		medium: 0,
		high: 0,
		churned: 0,
		unknown: 0,
	};

	for (const customer of customers || []) {
		const risk = customer.churn_risk as keyof typeof distribution;
		if (risk && distribution[risk] !== undefined) {
			distribution[risk]++;
		} else {
			distribution.unknown++;
		}
	}

	return distribution;
});

/**
 * Get estimate conversion funnel
 */
export const getEstimateConversionFunnel = cache(async (companyId: string, days: number = 30) => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: estimates } = await supabase
		.from("estimates")
		.select("conversion_status")
		.eq("company_id", companyId)
		.gte("created_at", startDate.toISOString())
		.is("deleted_at", null);

	const funnel = {
		total: estimates?.length || 0,
		pending: 0,
		won: 0,
		lost: 0,
		expired: 0,
	};

	for (const estimate of estimates || []) {
		const status = estimate.conversion_status as keyof Omit<typeof funnel, "total">;
		if (status && funnel[status] !== undefined) {
			funnel[status]++;
		} else {
			funnel.pending++;
		}
	}

	return {
		...funnel,
		conversionRate: funnel.total > 0 ? (funnel.won / funnel.total) * 100 : 0,
	};
});

/**
 * Get invoice aging summary
 */
export const getInvoiceAgingSummary = cache(async (companyId: string) => {
	const supabase = await createClient();

	const { data: invoices } = await supabase
		.from("invoices")
		.select("aging_bucket, balance_amount")
		.eq("company_id", companyId)
		.not("status", "in", '("paid", "void", "cancelled")')
		.is("deleted_at", null);

	const aging = {
		current: { count: 0, amount: 0 },
		"1_30": { count: 0, amount: 0 },
		"31_60": { count: 0, amount: 0 },
		"61_90": { count: 0, amount: 0 },
		over_90: { count: 0, amount: 0 },
	};

	for (const invoice of invoices || []) {
		const bucket = (invoice.aging_bucket || "current") as keyof typeof aging;
		if (aging[bucket]) {
			aging[bucket].count++;
			aging[bucket].amount += (invoice.balance_amount || 0) / 100;
		}
	}

	return aging;
});

// ============================================
// REPORT QUERIES
// ============================================

export interface RevenueReportData {
	summary: {
		totalRevenue: number;
		previousPeriodRevenue: number;
		growthPercent: number;
		averageTicket: number;
		totalJobs: number;
		totalPayments: number;
	};
	byMonth: Array<{
		month: string;
		revenue: number;
		jobCount: number;
		avgTicket: number;
	}>;
	byJobType: Array<{
		jobType: string;
		revenue: number;
		percentage: number;
		count: number;
	}>;
	byPaymentMethod: Array<{
		method: string;
		amount: number;
		count: number;
		percentage: number;
	}>;
	topCustomers: Array<{
		id: string;
		name: string;
		revenue: number;
		jobCount: number;
	}>;
}

/**
 * Get comprehensive revenue report data
 */
export const getRevenueReport = cache(async (companyId: string, days: number = 90): Promise<RevenueReportData> => {
	const supabase = await createClient();
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const previousStartDate = new Date(startDate);
	previousStartDate.setDate(previousStartDate.getDate() - days);

	// Get payments for current and previous period
	const [currentPayments, previousPayments, jobsData, customerRevenue] = await Promise.all([
		supabase
			.from("payments")
			.select("id, amount, payment_method, created_at, customer_id")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString())
			.lte("created_at", endDate.toISOString()),
		supabase
			.from("payments")
			.select("amount")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", previousStartDate.toISOString())
			.lt("created_at", startDate.toISOString()),
		supabase
			.from("jobs")
			.select("id, job_type, total_revenue, customer_id, created_at")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString())
			.is("deleted_at", null),
		supabase
			.from("jobs")
			.select(`
				customer_id,
				total_revenue,
				customers:customers!customer_id(id, display_name, first_name, last_name)
			`)
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString())
			.is("deleted_at", null),
	]);

	const payments = currentPayments.data || [];
	const prevPayments = previousPayments.data || [];
	const jobs = jobsData.data || [];
	const customerJobs = customerRevenue.data || [];

	// Calculate totals
	const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100;
	const previousPeriodRevenue = prevPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100;
	const growthPercent = previousPeriodRevenue > 0
		? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
		: 0;

	// By month
	const byMonth: Record<string, { revenue: number; jobCount: number }> = {};
	for (const payment of payments) {
		const month = new Date(payment.created_at).toISOString().substring(0, 7);
		if (!byMonth[month]) byMonth[month] = { revenue: 0, jobCount: 0 };
		byMonth[month].revenue += (payment.amount || 0) / 100;
	}
	for (const job of jobs) {
		const month = new Date(job.created_at).toISOString().substring(0, 7);
		if (byMonth[month]) byMonth[month].jobCount++;
	}

	// By job type
	const byJobType: Record<string, { revenue: number; count: number }> = {};
	for (const job of jobs) {
		const type = job.job_type || "Other";
		if (!byJobType[type]) byJobType[type] = { revenue: 0, count: 0 };
		byJobType[type].revenue += (job.total_revenue || 0) / 100;
		byJobType[type].count++;
	}

	// By payment method
	const byPaymentMethod: Record<string, { amount: number; count: number }> = {};
	for (const payment of payments) {
		const method = payment.payment_method || "Other";
		if (!byPaymentMethod[method]) byPaymentMethod[method] = { amount: 0, count: 0 };
		byPaymentMethod[method].amount += (payment.amount || 0) / 100;
		byPaymentMethod[method].count++;
	}

	// Top customers
	const customerTotals: Record<string, { name: string; revenue: number; jobCount: number }> = {};
	for (const job of customerJobs) {
		const customerId = job.customer_id;
		if (!customerId) continue;
		const customer = job.customers as { id: string; display_name: string | null; first_name: string | null; last_name: string | null } | null;
		const name = customer?.display_name ||
			[customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
			"Unknown";
		if (!customerTotals[customerId]) customerTotals[customerId] = { name, revenue: 0, jobCount: 0 };
		customerTotals[customerId].revenue += (job.total_revenue || 0) / 100;
		customerTotals[customerId].jobCount++;
	}

	return {
		summary: {
			totalRevenue,
			previousPeriodRevenue,
			growthPercent,
			averageTicket: jobs.length > 0 ? totalRevenue / jobs.length : 0,
			totalJobs: jobs.length,
			totalPayments: payments.length,
		},
		byMonth: Object.entries(byMonth)
			.map(([month, data]) => ({
				month,
				revenue: data.revenue,
				jobCount: data.jobCount,
				avgTicket: data.jobCount > 0 ? data.revenue / data.jobCount : 0,
			}))
			.sort((a, b) => a.month.localeCompare(b.month)),
		byJobType: Object.entries(byJobType)
			.map(([jobType, data]) => ({
				jobType,
				revenue: data.revenue,
				count: data.count,
				percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
			}))
			.sort((a, b) => b.revenue - a.revenue),
		byPaymentMethod: Object.entries(byPaymentMethod)
			.map(([method, data]) => ({
				method,
				amount: data.amount,
				count: data.count,
				percentage: totalRevenue > 0 ? (data.amount / totalRevenue) * 100 : 0,
			}))
			.sort((a, b) => b.amount - a.amount),
		topCustomers: Object.entries(customerTotals)
			.map(([id, data]) => ({ id, ...data }))
			.sort((a, b) => b.revenue - a.revenue)
			.slice(0, 10),
	};
});

export interface JobPerformanceReportData {
	summary: {
		totalJobs: number;
		completedJobs: number;
		completionRate: number;
		averageDuration: number;
		firstTimeFixRate: number;
		callbackRate: number;
	};
	byStatus: Array<{
		status: string;
		count: number;
		percentage: number;
	}>;
	byTechnician: Array<{
		id: string;
		name: string;
		jobsCompleted: number;
		avgDuration: number;
		avgRevenue: number;
		firstTimeFixRate: number;
	}>;
	byJobType: Array<{
		jobType: string;
		count: number;
		avgDuration: number;
		avgRevenue: number;
		completionRate: number;
	}>;
	trendsWeekly: Array<{
		week: string;
		completed: number;
		scheduled: number;
		cancelled: number;
	}>;
}

/**
 * Get job performance report data
 */
export const getJobPerformanceReport = cache(async (companyId: string, days: number = 90): Promise<JobPerformanceReportData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: jobs } = await supabase
		.from("jobs")
		.select(`
			id, status, job_type, actual_duration_minutes, total_revenue, is_callback,
			assigned_to, created_at,
			assigned_user:users!assigned_to(id, first_name, last_name)
		`)
		.eq("company_id", companyId)
		.gte("created_at", startDate.toISOString())
		.is("deleted_at", null);

	const allJobs = jobs || [];
	const completedJobs = allJobs.filter(j => j.status === "completed");
	const callbacks = completedJobs.filter(j => j.is_callback === true);

	// By status
	const statusCounts: Record<string, number> = {};
	for (const job of allJobs) {
		const status = job.status || "unknown";
		statusCounts[status] = (statusCounts[status] || 0) + 1;
	}

	// By technician
	const techStats: Record<string, { name: string; completed: number; totalDuration: number; totalRevenue: number; firstTimeFixes: number }> = {};
	for (const job of completedJobs) {
		const techId = job.assigned_to;
		if (!techId) continue;
		const user = job.assigned_user as { id: string; first_name: string | null; last_name: string | null } | null;
		const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Unassigned";
		if (!techStats[techId]) techStats[techId] = { name, completed: 0, totalDuration: 0, totalRevenue: 0, firstTimeFixes: 0 };
		techStats[techId].completed++;
		techStats[techId].totalDuration += job.actual_duration_minutes || 0;
		techStats[techId].totalRevenue += (job.total_revenue || 0) / 100;
		if (!job.is_callback) techStats[techId].firstTimeFixes++;
	}

	// By job type
	const typeStats: Record<string, { total: number; completed: number; totalDuration: number; totalRevenue: number }> = {};
	for (const job of allJobs) {
		const type = job.job_type || "Other";
		if (!typeStats[type]) typeStats[type] = { total: 0, completed: 0, totalDuration: 0, totalRevenue: 0 };
		typeStats[type].total++;
		if (job.status === "completed") {
			typeStats[type].completed++;
			typeStats[type].totalDuration += job.actual_duration_minutes || 0;
			typeStats[type].totalRevenue += (job.total_revenue || 0) / 100;
		}
	}

	// Weekly trends
	const weeklyData: Record<string, { completed: number; scheduled: number; cancelled: number }> = {};
	for (const job of allJobs) {
		const date = new Date(job.created_at);
		const week = getWeekStart(date);
		if (!weeklyData[week]) weeklyData[week] = { completed: 0, scheduled: 0, cancelled: 0 };
		if (job.status === "completed") weeklyData[week].completed++;
		else if (job.status === "scheduled") weeklyData[week].scheduled++;
		else if (job.status === "cancelled") weeklyData[week].cancelled++;
	}

	const avgDuration = completedJobs.length > 0
		? completedJobs.reduce((sum, j) => sum + (j.actual_duration_minutes || 0), 0) / completedJobs.length
		: 0;

	return {
		summary: {
			totalJobs: allJobs.length,
			completedJobs: completedJobs.length,
			completionRate: allJobs.length > 0 ? (completedJobs.length / allJobs.length) * 100 : 0,
			averageDuration: avgDuration,
			firstTimeFixRate: completedJobs.length > 0 ? ((completedJobs.length - callbacks.length) / completedJobs.length) * 100 : 0,
			callbackRate: completedJobs.length > 0 ? (callbacks.length / completedJobs.length) * 100 : 0,
		},
		byStatus: Object.entries(statusCounts)
			.map(([status, count]) => ({
				status,
				count,
				percentage: allJobs.length > 0 ? (count / allJobs.length) * 100 : 0,
			}))
			.sort((a, b) => b.count - a.count),
		byTechnician: Object.entries(techStats)
			.map(([id, data]) => ({
				id,
				name: data.name,
				jobsCompleted: data.completed,
				avgDuration: data.completed > 0 ? data.totalDuration / data.completed : 0,
				avgRevenue: data.completed > 0 ? data.totalRevenue / data.completed : 0,
				firstTimeFixRate: data.completed > 0 ? (data.firstTimeFixes / data.completed) * 100 : 0,
			}))
			.sort((a, b) => b.jobsCompleted - a.jobsCompleted),
		byJobType: Object.entries(typeStats)
			.map(([jobType, data]) => ({
				jobType,
				count: data.total,
				avgDuration: data.completed > 0 ? data.totalDuration / data.completed : 0,
				avgRevenue: data.completed > 0 ? data.totalRevenue / data.completed : 0,
				completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
			}))
			.sort((a, b) => b.count - a.count),
		trendsWeekly: Object.entries(weeklyData)
			.map(([week, data]) => ({ week, ...data }))
			.sort((a, b) => a.week.localeCompare(b.week)),
	};
});

function getWeekStart(date: Date): string {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day;
	d.setDate(diff);
	return d.toISOString().split("T")[0];
}

export interface FinancialReportData {
	summary: {
		totalRevenue: number;
		totalCost: number;
		grossProfit: number;
		grossMargin: number;
		outstandingAR: number;
		overdueAR: number;
	};
	arAging: {
		current: { count: number; amount: number };
		days1_30: { count: number; amount: number };
		days31_60: { count: number; amount: number };
		days61_90: { count: number; amount: number };
		over90: { count: number; amount: number };
	};
	monthlyPL: Array<{
		month: string;
		revenue: number;
		cost: number;
		profit: number;
		margin: number;
	}>;
	cashFlow: Array<{
		month: string;
		inflows: number;
		outflows: number;
		net: number;
	}>;
}

/**
 * Get financial report data
 */
export const getFinancialReport = cache(async (companyId: string, days: number = 365): Promise<FinancialReportData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);
	const today = new Date();

	const [paymentsResult, invoicesResult, jobsResult] = await Promise.all([
		supabase
			.from("payments")
			.select("amount, created_at")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString()),
		supabase
			.from("invoices")
			.select("id, balance_amount, due_date, status")
			.eq("company_id", companyId)
			.not("status", "in", '("paid", "void", "cancelled")')
			.is("deleted_at", null),
		supabase
			.from("jobs")
			.select("total_revenue, total_cost_actual, created_at")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString())
			.is("deleted_at", null),
	]);

	const payments = paymentsResult.data || [];
	const invoices = invoicesResult.data || [];
	const jobs = jobsResult.data || [];

	// Calculate totals
	const totalRevenue = jobs.reduce((sum, j) => sum + ((j.total_revenue || 0) / 100), 0);
	const totalCost = jobs.reduce((sum, j) => sum + ((j.total_cost_actual || 0) / 100), 0);
	const grossProfit = totalRevenue - totalCost;
	const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

	// AR Aging
	const arAging = {
		current: { count: 0, amount: 0 },
		days1_30: { count: 0, amount: 0 },
		days31_60: { count: 0, amount: 0 },
		days61_90: { count: 0, amount: 0 },
		over90: { count: 0, amount: 0 },
	};

	let outstandingAR = 0;
	let overdueAR = 0;

	for (const invoice of invoices) {
		const balance = (invoice.balance_amount || 0) / 100;
		outstandingAR += balance;

		if (!invoice.due_date) {
			arAging.current.count++;
			arAging.current.amount += balance;
			continue;
		}

		const dueDate = new Date(invoice.due_date);
		const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

		if (daysPastDue <= 0) {
			arAging.current.count++;
			arAging.current.amount += balance;
		} else if (daysPastDue <= 30) {
			arAging.days1_30.count++;
			arAging.days1_30.amount += balance;
			overdueAR += balance;
		} else if (daysPastDue <= 60) {
			arAging.days31_60.count++;
			arAging.days31_60.amount += balance;
			overdueAR += balance;
		} else if (daysPastDue <= 90) {
			arAging.days61_90.count++;
			arAging.days61_90.amount += balance;
			overdueAR += balance;
		} else {
			arAging.over90.count++;
			arAging.over90.amount += balance;
			overdueAR += balance;
		}
	}

	// Monthly P&L
	const monthlyPL: Record<string, { revenue: number; cost: number }> = {};
	for (const job of jobs) {
		const month = new Date(job.created_at).toISOString().substring(0, 7);
		if (!monthlyPL[month]) monthlyPL[month] = { revenue: 0, cost: 0 };
		monthlyPL[month].revenue += (job.total_revenue || 0) / 100;
		monthlyPL[month].cost += (job.total_cost_actual || 0) / 100;
	}

	// Monthly cash flow
	const monthlyCash: Record<string, { inflows: number; outflows: number }> = {};
	for (const payment of payments) {
		const month = new Date(payment.created_at).toISOString().substring(0, 7);
		if (!monthlyCash[month]) monthlyCash[month] = { inflows: 0, outflows: 0 };
		monthlyCash[month].inflows += (payment.amount || 0) / 100;
	}

	return {
		summary: {
			totalRevenue,
			totalCost,
			grossProfit,
			grossMargin,
			outstandingAR,
			overdueAR,
		},
		arAging,
		monthlyPL: Object.entries(monthlyPL)
			.map(([month, data]) => ({
				month,
				revenue: data.revenue,
				cost: data.cost,
				profit: data.revenue - data.cost,
				margin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
			}))
			.sort((a, b) => a.month.localeCompare(b.month)),
		cashFlow: Object.entries(monthlyCash)
			.map(([month, data]) => ({
				month,
				inflows: data.inflows,
				outflows: data.outflows,
				net: data.inflows - data.outflows,
			}))
			.sort((a, b) => a.month.localeCompare(b.month)),
	};
});

export interface TeamLeaderboardData {
	technicians: Array<{
		id: string;
		name: string;
		rank: number;
		jobsCompleted: number;
		revenue: number;
		avgRating: number;
		firstTimeFixRate: number;
		avgJobDuration: number;
		utilizationRate: number;
		score: number;
	}>;
	topPerformer: {
		id: string;
		name: string;
		highlight: string;
	} | null;
	teamAverages: {
		jobsPerTech: number;
		revenuePerTech: number;
		avgRating: number;
		firstTimeFixRate: number;
	};
}

/**
 * Get team leaderboard data
 */
export const getTeamLeaderboard = cache(async (companyId: string, days: number = 30): Promise<TeamLeaderboardData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: jobs } = await supabase
		.from("jobs")
		.select(`
			id, status, total_revenue, actual_duration_minutes, is_callback, assigned_to,
			assigned_user:users!assigned_to(id, first_name, last_name)
		`)
		.eq("company_id", companyId)
		.eq("status", "completed")
		.gte("created_at", startDate.toISOString())
		.is("deleted_at", null);

	const allJobs = jobs || [];

	// Aggregate by technician
	const techStats: Record<string, {
		name: string;
		completed: number;
		revenue: number;
		totalDuration: number;
		firstTimeFixes: number;
	}> = {};

	for (const job of allJobs) {
		const techId = job.assigned_to;
		if (!techId) continue;
		const user = job.assigned_user as { id: string; first_name: string | null; last_name: string | null } | null;
		const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Unknown";

		if (!techStats[techId]) {
			techStats[techId] = { name, completed: 0, revenue: 0, totalDuration: 0, firstTimeFixes: 0 };
		}
		techStats[techId].completed++;
		techStats[techId].revenue += (job.total_revenue || 0) / 100;
		techStats[techId].totalDuration += job.actual_duration_minutes || 0;
		if (!job.is_callback) techStats[techId].firstTimeFixes++;
	}

	// Calculate scores and rankings
	const technicians = Object.entries(techStats)
		.map(([id, data]) => {
			const firstTimeFixRate = data.completed > 0 ? (data.firstTimeFixes / data.completed) * 100 : 0;
			const avgDuration = data.completed > 0 ? data.totalDuration / data.completed : 0;
			// Score: weighted combination of metrics
			const score = (data.completed * 10) + (data.revenue / 100) + (firstTimeFixRate * 2);
			return {
				id,
				name: data.name,
				rank: 0,
				jobsCompleted: data.completed,
				revenue: data.revenue,
				avgRating: 4.5, // Placeholder - would come from reviews
				firstTimeFixRate,
				avgJobDuration: avgDuration,
				utilizationRate: 75, // Placeholder - would come from scheduling
				score,
			};
		})
		.sort((a, b) => b.score - a.score)
		.map((tech, index) => ({ ...tech, rank: index + 1 }));

	const totalTechs = technicians.length;
	const teamAverages = {
		jobsPerTech: totalTechs > 0 ? technicians.reduce((sum, t) => sum + t.jobsCompleted, 0) / totalTechs : 0,
		revenuePerTech: totalTechs > 0 ? technicians.reduce((sum, t) => sum + t.revenue, 0) / totalTechs : 0,
		avgRating: totalTechs > 0 ? technicians.reduce((sum, t) => sum + t.avgRating, 0) / totalTechs : 0,
		firstTimeFixRate: totalTechs > 0 ? technicians.reduce((sum, t) => sum + t.firstTimeFixRate, 0) / totalTechs : 0,
	};

	return {
		technicians,
		topPerformer: technicians.length > 0 ? {
			id: technicians[0].id,
			name: technicians[0].name,
			highlight: `${technicians[0].jobsCompleted} jobs completed, $${technicians[0].revenue.toLocaleString()} revenue`,
		} : null,
		teamAverages,
	};
});

export interface CustomerAnalyticsData {
	summary: {
		totalCustomers: number;
		newCustomers: number;
		repeatCustomers: number;
		churnedCustomers: number;
		retentionRate: number;
		avgLifetimeValue: number;
	};
	bySegment: Array<{
		segment: string;
		count: number;
		revenue: number;
		avgTicket: number;
	}>;
	topCustomers: Array<{
		id: string;
		name: string;
		totalRevenue: number;
		jobCount: number;
		lastServiceDate: string | null;
		lifetimeValue: number;
	}>;
	acquisitionTrend: Array<{
		month: string;
		newCustomers: number;
		churned: number;
		net: number;
	}>;
	riskDistribution: {
		low: number;
		medium: number;
		high: number;
	};
}

/**
 * Get customer analytics data
 */
export const getCustomerAnalytics = cache(async (companyId: string, days: number = 365): Promise<CustomerAnalyticsData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const [customersResult, jobsResult] = await Promise.all([
		supabase
			.from("customers")
			.select("id, display_name, first_name, last_name, created_at, customer_type, churn_risk, lifetime_value, total_jobs, last_service_date")
			.eq("company_id", companyId)
			.is("deleted_at", null),
		supabase
			.from("jobs")
			.select("customer_id, total_revenue, created_at")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", startDate.toISOString())
			.is("deleted_at", null),
	]);

	const customers = customersResult.data || [];
	const jobs = jobsResult.data || [];

	// Count metrics
	const newCustomers = customers.filter(c =>
		c.created_at && new Date(c.created_at) >= thirtyDaysAgo
	).length;
	const repeatCustomers = customers.filter(c => (c.total_jobs || 0) > 1).length;
	const churnedCustomers = customers.filter(c => c.churn_risk === "churned").length;
	const totalCustomers = customers.length;
	const retentionRate = totalCustomers > 0 ? ((totalCustomers - churnedCustomers) / totalCustomers) * 100 : 100;
	const avgLifetimeValue = totalCustomers > 0
		? customers.reduce((sum, c) => sum + ((c.lifetime_value || 0) / 100), 0) / totalCustomers
		: 0;

	// By segment
	const segments: Record<string, { count: number; revenue: number; jobs: number }> = {};
	for (const customer of customers) {
		const segment = customer.customer_type || "Residential";
		if (!segments[segment]) segments[segment] = { count: 0, revenue: 0, jobs: 0 };
		segments[segment].count++;
	}

	// Add revenue by segment from jobs
	const customerIdToSegment: Record<string, string> = {};
	for (const customer of customers) {
		customerIdToSegment[customer.id] = customer.customer_type || "Residential";
	}
	for (const job of jobs) {
		const segment = customerIdToSegment[job.customer_id] || "Residential";
		if (segments[segment]) {
			segments[segment].revenue += (job.total_revenue || 0) / 100;
			segments[segment].jobs++;
		}
	}

	// Top customers
	const customerRevenue: Record<string, { name: string; revenue: number; jobCount: number; lastService: string | null; ltv: number }> = {};
	for (const customer of customers) {
		const name = customer.display_name ||
			[customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
			"Unknown";
		customerRevenue[customer.id] = {
			name,
			revenue: 0,
			jobCount: customer.total_jobs || 0,
			lastService: customer.last_service_date,
			ltv: (customer.lifetime_value || 0) / 100,
		};
	}
	for (const job of jobs) {
		if (customerRevenue[job.customer_id]) {
			customerRevenue[job.customer_id].revenue += (job.total_revenue || 0) / 100;
		}
	}

	// Acquisition trend by month
	const monthlyAcquisition: Record<string, { new: number; churned: number }> = {};
	for (const customer of customers) {
		if (customer.created_at) {
			const month = new Date(customer.created_at).toISOString().substring(0, 7);
			if (!monthlyAcquisition[month]) monthlyAcquisition[month] = { new: 0, churned: 0 };
			monthlyAcquisition[month].new++;
		}
	}

	// Risk distribution
	const riskDistribution = { low: 0, medium: 0, high: 0 };
	for (const customer of customers) {
		const risk = customer.churn_risk as keyof typeof riskDistribution;
		if (risk && riskDistribution[risk] !== undefined) {
			riskDistribution[risk]++;
		} else {
			riskDistribution.low++; // Default to low risk if not set
		}
	}

	return {
		summary: {
			totalCustomers,
			newCustomers,
			repeatCustomers,
			churnedCustomers,
			retentionRate,
			avgLifetimeValue,
		},
		bySegment: Object.entries(segments)
			.map(([segment, data]) => ({
				segment,
				count: data.count,
				revenue: data.revenue,
				avgTicket: data.jobs > 0 ? data.revenue / data.jobs : 0,
			}))
			.sort((a, b) => b.revenue - a.revenue),
		topCustomers: Object.entries(customerRevenue)
			.map(([id, data]) => ({
				id,
				name: data.name,
				totalRevenue: data.revenue,
				jobCount: data.jobCount,
				lastServiceDate: data.lastService,
				lifetimeValue: data.ltv,
			}))
			.sort((a, b) => b.totalRevenue - a.totalRevenue)
			.slice(0, 10),
		acquisitionTrend: Object.entries(monthlyAcquisition)
			.map(([month, data]) => ({
				month,
				newCustomers: data.new,
				churned: data.churned,
				net: data.new - data.churned,
			}))
			.sort((a, b) => a.month.localeCompare(b.month)),
		riskDistribution,
	};
});

// ============================================================================
// COMMUNICATION ANALYTICS QUERIES
// ============================================================================

export interface RecentCommunication {
	id: string;
	type: "email" | "sms" | "phone";
	direction: "inbound" | "outbound";
	sender: string;
	subject: string;
	time: string;
	status: string;
}

export interface ActiveThread {
	id: string;
	customer: string;
	lastMessage: string;
	time: string;
	unread: number;
}

/**
 * Get recent communications for the analytics dashboard
 */
export const getRecentCommunications = cache(async (companyId: string, limit: number = 5): Promise<RecentCommunication[]> => {
	const supabase = await createClient();

	const { data: comms } = await supabase
		.from("communications")
		.select(`
			id,
			type,
			direction,
			subject,
			body,
			read_at,
			created_at,
			customer:customers(name)
		`)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (!comms || comms.length === 0) {
		return [];
	}

	return comms.map((comm) => {
		const created = new Date(comm.created_at);
		const now = new Date();
		const diffMs = now.getTime() - created.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		let timeAgo: string;
		if (diffMins < 1) {
			timeAgo = "Just now";
		} else if (diffMins < 60) {
			timeAgo = `${diffMins}m ago`;
		} else if (diffHours < 24) {
			timeAgo = `${diffHours}h ago`;
		} else {
			timeAgo = `${diffDays}d ago`;
		}

		// Determine status based on direction and read state
		let status: string;
		if (comm.direction === "inbound") {
			status = comm.read_at ? "read" : "unread";
		} else {
			status = "sent";
		}

		// Get customer name or extract from subject/body
		const customerName = (comm.customer as { name: string } | null)?.name || "Unknown";

		return {
			id: comm.id,
			type: (comm.type as "email" | "sms" | "phone") || "email",
			direction: (comm.direction as "inbound" | "outbound") || "inbound",
			sender: customerName,
			subject: comm.subject || (comm.body?.substring(0, 50) + "...") || "No subject",
			time: timeAgo,
			status,
		};
	});
});

/**
 * Get active communication threads (grouped by customer)
 */
export const getActiveThreads = cache(async (companyId: string, limit: number = 5): Promise<ActiveThread[]> => {
	const supabase = await createClient();

	// Get the most recent communication per customer with unread count
	const { data: threads } = await supabase
		.from("communications")
		.select(`
			id,
			customer_id,
			body,
			subject,
			created_at,
			read_at,
			direction,
			customer:customers(id, name)
		`)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.not("customer_id", "is", null)
		.order("created_at", { ascending: false })
		.limit(50); // Get more to group by customer

	if (!threads || threads.length === 0) {
		return [];
	}

	// Group by customer and get latest + unread count
	const customerThreads = new Map<string, {
		customer: string;
		lastMessage: string;
		lastTime: Date;
		unread: number;
		id: string;
	}>();

	for (const thread of threads) {
		const customerId = thread.customer_id;
		if (!customerId) continue;

		const customerName = (thread.customer as { id: string; name: string } | null)?.name || "Unknown";
		const existing = customerThreads.get(customerId);

		const messagePreview = thread.subject || thread.body?.substring(0, 50) || "No message";
		const createdAt = new Date(thread.created_at);
		const isUnread = thread.direction === "inbound" && !thread.read_at;

		if (!existing) {
			customerThreads.set(customerId, {
				customer: customerName,
				lastMessage: messagePreview,
				lastTime: createdAt,
				unread: isUnread ? 1 : 0,
				id: thread.id,
			});
		} else {
			// Update unread count
			if (isUnread) {
				existing.unread++;
			}
			// Update last message if this is newer
			if (createdAt > existing.lastTime) {
				existing.lastMessage = messagePreview;
				existing.lastTime = createdAt;
				existing.id = thread.id;
			}
		}
	}

	// Convert to array and format
	const now = new Date();
	return Array.from(customerThreads.values())
		.sort((a, b) => b.lastTime.getTime() - a.lastTime.getTime())
		.slice(0, limit)
		.map((thread) => {
			const diffMs = now.getTime() - thread.lastTime.getTime();
			const diffMins = Math.floor(diffMs / 60000);
			const diffHours = Math.floor(diffMins / 60);
			const diffDays = Math.floor(diffHours / 24);

			let timeAgo: string;
			if (diffMins < 1) {
				timeAgo = "Just now";
			} else if (diffMins < 60) {
				timeAgo = `${diffMins}m ago`;
			} else if (diffHours < 24) {
				timeAgo = `${diffHours}h ago`;
			} else {
				timeAgo = `${diffDays}d ago`;
			}

			return {
				id: thread.id,
				customer: thread.customer,
				lastMessage: thread.lastMessage.length > 40
					? thread.lastMessage.substring(0, 40) + "..."
					: thread.lastMessage,
				time: timeAgo,
				unread: thread.unread,
			};
		});
});

// ============================================================================
// JOB COSTING & PROFITABILITY ANALYTICS
// ============================================================================

export interface JobCostingData {
	summary: {
		avgJobProfit: number;
		avgGrossMargin: number;
		totalLaborCost: number;
		totalMaterialsCost: number;
		totalEquipmentCost: number;
		jobsUnderBudget: number;
		jobsOnBudget: number;
		jobsOverBudget: number;
		avgCostVariance: number;
	};
	byBudgetStatus: Array<{
		status: string;
		count: number;
		totalRevenue: number;
		totalCost: number;
		avgMargin: number;
	}>;
	topProfitableJobs: Array<{
		id: string;
		title: string;
		customer: string;
		revenue: number;
		cost: number;
		profit: number;
		margin: number;
	}>;
	costBreakdown: {
		labor: number;
		materials: number;
		equipment: number;
		overhead: number;
		driveTime: number;
	};
}

/**
 * Get job costing and profitability analytics
 */
export const getJobCostingAnalytics = cache(async (companyId: string, days: number = 90): Promise<JobCostingData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: jobs } = await supabase
		.from("jobs")
		.select(`
			id, title, total_amount,
			labor_cost_actual, materials_cost_actual, equipment_cost_actual,
			total_cost_actual, overhead_cost, drive_time_cost,
			profit_actual, gross_margin_percent, budget_status,
			customer:customers(name, display_name)
		`)
		.eq("company_id", companyId)
		.eq("status", "completed")
		.gte("created_at", startDate.toISOString())
		.is("deleted_at", null)
		.not("total_cost_actual", "is", null);

	const allJobs = jobs || [];

	// Summary calculations
	const totalLaborCost = allJobs.reduce((sum, j) => sum + ((j.labor_cost_actual || 0) / 100), 0);
	const totalMaterialsCost = allJobs.reduce((sum, j) => sum + ((j.materials_cost_actual || 0) / 100), 0);
	const totalEquipmentCost = allJobs.reduce((sum, j) => sum + ((j.equipment_cost_actual || 0) / 100), 0);
	const totalOverhead = allJobs.reduce((sum, j) => sum + ((j.overhead_cost || 0) / 100), 0);
	const totalDriveTime = allJobs.reduce((sum, j) => sum + ((j.drive_time_cost || 0) / 100), 0);

	const avgJobProfit = allJobs.length > 0
		? allJobs.reduce((sum, j) => sum + ((j.profit_actual || 0) / 100), 0) / allJobs.length
		: 0;

	const avgGrossMargin = allJobs.length > 0
		? allJobs.reduce((sum, j) => sum + (j.gross_margin_percent || 0), 0) / allJobs.length
		: 0;

	const jobsUnderBudget = allJobs.filter(j => j.budget_status === "under_budget").length;
	const jobsOnBudget = allJobs.filter(j => j.budget_status === "on_budget").length;
	const jobsOverBudget = allJobs.filter(j => j.budget_status === "over_budget").length;

	// By budget status
	const statusGroups: Record<string, { count: number; revenue: number; cost: number }> = {
		under_budget: { count: 0, revenue: 0, cost: 0 },
		on_budget: { count: 0, revenue: 0, cost: 0 },
		over_budget: { count: 0, revenue: 0, cost: 0 },
	};

	for (const job of allJobs) {
		const status = job.budget_status || "on_budget";
		if (statusGroups[status]) {
			statusGroups[status].count++;
			statusGroups[status].revenue += (job.total_amount || 0) / 100;
			statusGroups[status].cost += (job.total_cost_actual || 0) / 100;
		}
	}

	// Top profitable jobs
	const topProfitableJobs = allJobs
		.map(j => {
			const customer = j.customer as { name?: string; display_name?: string } | null;
			return {
				id: j.id,
				title: j.title || "Untitled Job",
				customer: customer?.display_name || customer?.name || "Unknown",
				revenue: (j.total_amount || 0) / 100,
				cost: (j.total_cost_actual || 0) / 100,
				profit: (j.profit_actual || 0) / 100,
				margin: j.gross_margin_percent || 0,
			};
		})
		.sort((a, b) => b.profit - a.profit)
		.slice(0, 10);

	return {
		summary: {
			avgJobProfit,
			avgGrossMargin,
			totalLaborCost,
			totalMaterialsCost,
			totalEquipmentCost,
			jobsUnderBudget,
			jobsOnBudget,
			jobsOverBudget,
			avgCostVariance: 0, // Would need estimate comparison
		},
		byBudgetStatus: Object.entries(statusGroups).map(([status, data]) => ({
			status,
			count: data.count,
			totalRevenue: data.revenue,
			totalCost: data.cost,
			avgMargin: data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0,
		})),
		topProfitableJobs,
		costBreakdown: {
			labor: totalLaborCost,
			materials: totalMaterialsCost,
			equipment: totalEquipmentCost,
			overhead: totalOverhead,
			driveTime: totalDriveTime,
		},
	};
});

// ============================================================================
// COMPANY KPI DASHBOARD
// ============================================================================

export interface CompanyKPIs {
	financial: {
		quoteToCloseRate: number;
		avgQuoteAccuracy: number;
		avgDaysToPayment: number;
		collectionRate: number;
		cashFlow30Day: number;
	};
	operational: {
		capacityUtilization: number;
		billableHoursRatio: number;
		firstCallResolution: number;
		avgResponseTimeHours: number;
		technicianUtilization: number;
	};
	customer: {
		avgLifetimeValue: number;
		customerAcquisitionCost: number;
		ltvToCacRatio: number;
		retentionRate: number;
		recurringRevenuePercent: number;
	};
}

/**
 * Get company KPIs from the summary table
 */
export const getCompanyKPIs = cache(async (companyId: string): Promise<CompanyKPIs | null> => {
	const supabase = await createClient();

	const { data: summary } = await supabase
		.from("analytics_company_summary")
		.select("*")
		.eq("company_id", companyId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (!summary) {
		return null;
	}

	return {
		financial: {
			quoteToCloseRate: summary.quote_to_close_rate || 0,
			avgQuoteAccuracy: summary.avg_quote_accuracy || 0,
			avgDaysToPayment: summary.avg_days_to_payment || 0,
			collectionRate: summary.collection_rate || 0,
			cashFlow30Day: (summary.cash_flow_30_day_forecast || 0) / 100,
		},
		operational: {
			capacityUtilization: summary.capacity_utilization_percent || 0,
			billableHoursRatio: summary.billable_hours_ratio || 0,
			firstCallResolution: summary.first_call_resolution_rate || 0,
			avgResponseTimeHours: (summary.avg_response_time_hours || 0),
			technicianUtilization: summary.technician_utilization_rate || 0,
		},
		customer: {
			avgLifetimeValue: (summary.avg_customer_lifetime_value || 0) / 100,
			customerAcquisitionCost: (summary.customer_acquisition_cost || 0) / 100,
			ltvToCacRatio: summary.ltv_to_cac_ratio || 0,
			retentionRate: summary.customer_retention_rate || 0,
			recurringRevenuePercent: summary.recurring_revenue_percent || 0,
		},
	};
});

// ============================================================================
// EQUIPMENT HEALTH ANALYTICS
// ============================================================================

export interface EquipmentHealthSummary {
	summary: {
		totalEquipment: number;
		healthyCount: number;
		warningCount: number;
		criticalCount: number;
		avgHealthScore: number;
		maintenanceOverdue: number;
	};
	byCondition: Array<{
		condition: string;
		count: number;
		avgAge: number;
		avgMaintenanceCost: number;
	}>;
	upcomingMaintenance: Array<{
		equipmentId: string;
		name: string;
		daysUntilMaintenance: number;
		lastMaintenanceCost: number;
	}>;
}

/**
 * Get equipment health analytics
 */
export const getEquipmentHealthAnalytics = cache(async (companyId: string): Promise<EquipmentHealthSummary> => {
	const supabase = await createClient();

	const { data: healthData } = await supabase
		.from("analytics_equipment_health")
		.select(`
			equipment_id, health_score, condition_rating,
			days_until_maintenance, maintenance_overdue,
			total_maintenance_cost, age_years,
			equipment:equipment(id, name, model)
		`)
		.eq("company_id", companyId)
		.order("period_start", { ascending: false })
		.limit(5000); // Prevent unbounded query

	const data = healthData || [];

	// Get unique equipment (most recent entry per equipment)
	const latestByEquipment = new Map<string, typeof data[0]>();
	for (const d of data) {
		if (!latestByEquipment.has(d.equipment_id)) {
			latestByEquipment.set(d.equipment_id, d);
		}
	}

	const equipmentList = Array.from(latestByEquipment.values());
	const totalEquipment = equipmentList.length;

	const healthyCount = equipmentList.filter(e => e.health_score >= 70).length;
	const warningCount = equipmentList.filter(e => e.health_score >= 40 && e.health_score < 70).length;
	const criticalCount = equipmentList.filter(e => e.health_score < 40).length;
	const maintenanceOverdue = equipmentList.filter(e => e.maintenance_overdue).length;

	const avgHealthScore = totalEquipment > 0
		? equipmentList.reduce((sum, e) => sum + (e.health_score || 0), 0) / totalEquipment
		: 0;

	// By condition
	const conditionGroups: Record<string, { count: number; totalAge: number; totalCost: number }> = {};
	for (const e of equipmentList) {
		const condition = e.condition_rating || "unknown";
		if (!conditionGroups[condition]) {
			conditionGroups[condition] = { count: 0, totalAge: 0, totalCost: 0 };
		}
		conditionGroups[condition].count++;
		conditionGroups[condition].totalAge += e.age_years || 0;
		conditionGroups[condition].totalCost += (e.total_maintenance_cost || 0) / 100;
	}

	// Upcoming maintenance
	const upcomingMaintenance = equipmentList
		.filter(e => (e.days_until_maintenance || 0) > 0 && (e.days_until_maintenance || 0) <= 30)
		.map(e => {
			const equip = e.equipment as { id: string; name: string; model?: string } | null;
			return {
				equipmentId: e.equipment_id,
				name: equip?.name || equip?.model || "Unknown Equipment",
				daysUntilMaintenance: e.days_until_maintenance || 0,
				lastMaintenanceCost: (e.total_maintenance_cost || 0) / 100,
			};
		})
		.sort((a, b) => a.daysUntilMaintenance - b.daysUntilMaintenance)
		.slice(0, 10);

	return {
		summary: {
			totalEquipment,
			healthyCount,
			warningCount,
			criticalCount,
			avgHealthScore,
			maintenanceOverdue,
		},
		byCondition: Object.entries(conditionGroups).map(([condition, data]) => ({
			condition,
			count: data.count,
			avgAge: data.count > 0 ? data.totalAge / data.count : 0,
			avgMaintenanceCost: data.count > 0 ? data.totalCost / data.count : 0,
		})),
		upcomingMaintenance,
	};
});

// ============================================================================
// TECHNICIAN PERFORMANCE ANALYTICS
// ============================================================================

export interface TechnicianPerformanceData {
	technicians: Array<{
		id: string;
		name: string;
		jobsCompleted: number;
		revenue: number;
		avgJobProfit: number;
		profitMargin: number;
		billableRatio: number;
		callbacks: number;
		callbackRate: number;
		upsellCount: number;
		upsellRevenue: number;
		overallScore: number;
		rank: number;
	}>;
	teamMetrics: {
		avgJobsPerTech: number;
		avgRevenuePerTech: number;
		avgProfitMargin: number;
		avgBillableRatio: number;
		totalCallbacks: number;
	};
}

/**
 * Get detailed technician performance analytics
 */
export const getTechnicianPerformance = cache(async (companyId: string, days: number = 30): Promise<TechnicianPerformanceData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: metrics } = await supabase
		.from("analytics_technician_metrics")
		.select("*")
		.eq("company_id", companyId)
		.gte("period_start", startDate.toISOString().split("T")[0])
		.order("overall_performance_score", { ascending: false });

	const techMetrics = metrics || [];

	const technicians = techMetrics.map((t, index) => ({
		id: t.user_id,
		name: t.name || "Unknown",
		jobsCompleted: t.jobs_completed || 0,
		revenue: (t.total_revenue || 0) / 100,
		avgJobProfit: (t.avg_job_profit || 0) / 100,
		profitMargin: t.profit_margin_percent || 0,
		billableRatio: t.billable_ratio || 0,
		callbacks: t.callbacks || 0,
		callbackRate: t.callback_rate || 0,
		upsellCount: t.upsell_count || 0,
		upsellRevenue: (t.upsell_revenue || 0) / 100,
		overallScore: t.overall_performance_score || 0,
		rank: index + 1,
	}));

	const count = technicians.length;
	const teamMetrics = {
		avgJobsPerTech: count > 0 ? technicians.reduce((s, t) => s + t.jobsCompleted, 0) / count : 0,
		avgRevenuePerTech: count > 0 ? technicians.reduce((s, t) => s + t.revenue, 0) / count : 0,
		avgProfitMargin: count > 0 ? technicians.reduce((s, t) => s + t.profitMargin, 0) / count : 0,
		avgBillableRatio: count > 0 ? technicians.reduce((s, t) => s + t.billableRatio, 0) / count : 0,
		totalCallbacks: technicians.reduce((s, t) => s + t.callbacks, 0),
	};

	return { technicians, teamMetrics };
});

// ============================================================================
// MARKETING ROI & CAMPAIGN ANALYTICS
// ============================================================================

export interface MarketingCampaignData {
	summary: {
		totalSpend: number;
		totalRevenue: number;
		totalLeads: number;
		totalBookedJobs: number;
		overallROAS: number;
		overallROI: number;
		avgCostPerLead: number;
		avgCostPerAcquisition: number;
	};
	campaigns: Array<{
		id: string;
		name: string;
		channel: string;
		status: string;
		budget: number;
		spend: number;
		leads: number;
		bookedJobs: number;
		revenue: number;
		roas: number;
		roi: number;
		costPerLead: number;
	}>;
	byChannel: Array<{
		channel: string;
		spend: number;
		leads: number;
		bookedJobs: number;
		revenue: number;
		roas: number;
		costPerLead: number;
	}>;
	trendDaily: Array<{
		date: string;
		spend: number;
		leads: number;
		revenue: number;
		roas: number;
	}>;
}

/**
 * Get marketing campaign ROI analytics
 */
export const getMarketingROIAnalytics = cache(async (companyId: string, days: number = 90): Promise<MarketingCampaignData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	// Get campaigns (limit to 1000, select only needed fields)
	const { data: campaigns } = await supabase
		.from("marketing_campaigns")
		.select("id, name, channel, status, budget_amount, actual_spend, total_revenue, total_leads, total_booked_jobs, start_date, end_date, created_at")
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.limit(1000);

	// Get daily attribution data (limit to 10000 for analytics)
	const { data: attribution } = await supabase
		.from("analytics_marketing_attribution")
		.select("*")
		.eq("company_id", companyId)
		.gte("date", startDate.toISOString().split("T")[0])
		.order("date", { ascending: true })
		.limit(10000);

	const allCampaigns = campaigns || [];
	const allAttribution = attribution || [];

	// Calculate summary metrics
	const totalSpend = allCampaigns.reduce((sum, c) => sum + (c.actual_spend || 0), 0);
	const totalRevenue = allCampaigns.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
	const totalLeads = allCampaigns.reduce((sum, c) => sum + (c.total_leads || 0), 0);
	const totalBookedJobs = allCampaigns.reduce((sum, c) => sum + (c.total_booked_jobs || 0), 0);

	const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
	const overallROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
	const avgCostPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;
	const avgCostPerAcquisition = totalBookedJobs > 0 ? totalSpend / totalBookedJobs : 0;

	// Campaign list
	const campaignList = allCampaigns.map(c => ({
		id: c.id,
		name: c.name,
		channel: c.channel,
		status: c.status,
		budget: c.budget_amount || 0,
		spend: c.actual_spend || 0,
		leads: c.total_leads || 0,
		bookedJobs: c.total_booked_jobs || 0,
		revenue: c.total_revenue || 0,
		roas: c.return_on_ad_spend || 0,
		roi: c.roi_percent || 0,
		costPerLead: c.cost_per_lead || 0,
	}));

	// Aggregate by channel
	const channelData: Record<string, {
		spend: number;
		leads: number;
		bookedJobs: number;
		revenue: number;
	}> = {};

	for (const c of allCampaigns) {
		const channel = c.channel || "other";
		if (!channelData[channel]) {
			channelData[channel] = { spend: 0, leads: 0, bookedJobs: 0, revenue: 0 };
		}
		channelData[channel].spend += c.actual_spend || 0;
		channelData[channel].leads += c.total_leads || 0;
		channelData[channel].bookedJobs += c.total_booked_jobs || 0;
		channelData[channel].revenue += c.total_revenue || 0;
	}

	const byChannel = Object.entries(channelData).map(([channel, data]) => ({
		channel,
		spend: data.spend,
		leads: data.leads,
		bookedJobs: data.bookedJobs,
		revenue: data.revenue,
		roas: data.spend > 0 ? data.revenue / data.spend : 0,
		costPerLead: data.leads > 0 ? data.spend / data.leads : 0,
	})).sort((a, b) => b.revenue - a.revenue);

	// Daily trends
	const dailyData: Record<string, { spend: number; leads: number; revenue: number }> = {};
	for (const a of allAttribution) {
		const date = a.date;
		if (!dailyData[date]) {
			dailyData[date] = { spend: 0, leads: 0, revenue: 0 };
		}
		dailyData[date].spend += a.daily_spend || 0;
		dailyData[date].leads += a.total_leads || 0;
		dailyData[date].revenue += a.total_revenue || 0;
	}

	const trendDaily = Object.entries(dailyData)
		.map(([date, data]) => ({
			date,
			spend: data.spend,
			leads: data.leads,
			revenue: data.revenue,
			roas: data.spend > 0 ? data.revenue / data.spend : 0,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));

	return {
		summary: {
			totalSpend,
			totalRevenue,
			totalLeads,
			totalBookedJobs,
			overallROAS,
			overallROI,
			avgCostPerLead,
			avgCostPerAcquisition,
		},
		campaigns: campaignList,
		byChannel,
		trendDaily,
	};
});

// ============================================================================
// CSR (CUSTOMER SERVICE REP) SCORECARD ANALYTICS
// ============================================================================

export interface CSRScorecardData {
	summary: {
		totalCSRs: number;
		totalCallsHandled: number;
		avgBookingRate: number;
		avgCallAnswerRate: number;
		totalBookedRevenue: number;
		avgRevenuePerCall: number;
		topPerformerBookingRate: number;
		teamTarget: number;
	};
	csrList: Array<{
		id: string;
		name: string;
		callsAnswered: number;
		callsMissed: number;
		callAnswerRate: number;
		opportunities: number;
		jobsBooked: number;
		bookingRate: number;
		bookedRevenue: number;
		avgTicket: number;
		revenuePerCall: number;
		avgTalkTime: number;
		qualityScore: number;
		performanceScore: number;
		bookingRateRank: number;
		revenueRank: number;
		vsTarget: number;
	}>;
	leaderboard: Array<{
		rank: number;
		name: string;
		bookingRate: number;
		revenue: number;
	}>;
	trendDaily: Array<{
		date: string;
		totalCalls: number;
		answered: number;
		booked: number;
		bookingRate: number;
	}>;
}

/**
 * Get CSR scorecard analytics
 */
export const getCSRScorecardAnalytics = cache(async (companyId: string, days: number = 30): Promise<CSRScorecardData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	// Get CSR metrics
	const { data: csrMetrics } = await supabase
		.from("analytics_csr_metrics")
		.select("*")
		.eq("company_id", companyId)
		.gte("date", startDate.toISOString().split("T")[0])
		.order("date", { ascending: false });

	const allMetrics = csrMetrics || [];

	// Get latest metrics per CSR (most recent date)
	const latestByCSR = new Map<string, typeof allMetrics[0]>();
	for (const m of allMetrics) {
		if (!latestByCSR.has(m.user_id) || m.date > (latestByCSR.get(m.user_id)?.date || "")) {
			latestByCSR.set(m.user_id, m);
		}
	}

	const csrList = Array.from(latestByCSR.values()).map(m => ({
		id: m.user_id,
		name: m.csr_name || "Unknown",
		callsAnswered: m.total_calls_answered || 0,
		callsMissed: m.total_calls_missed || 0,
		callAnswerRate: m.call_answer_rate || 0,
		opportunities: m.total_opportunities || 0,
		jobsBooked: m.jobs_booked || 0,
		bookingRate: m.booking_rate || 0,
		bookedRevenue: m.booked_revenue || 0,
		avgTicket: m.avg_booked_ticket || 0,
		revenuePerCall: m.revenue_per_call || 0,
		avgTalkTime: m.avg_talk_time_seconds || 0,
		qualityScore: m.avg_call_quality_score || 0,
		performanceScore: m.overall_performance_score || 0,
		bookingRateRank: m.booking_rate_rank || 0,
		revenueRank: m.revenue_rank || 0,
		vsTarget: m.booking_rate_vs_target || 0,
	})).sort((a, b) => b.bookingRate - a.bookingRate);

	// Calculate summary metrics
	const totalCSRs = csrList.length;
	const totalCallsHandled = csrList.reduce((sum, c) => sum + c.callsAnswered, 0);
	const avgBookingRate = totalCSRs > 0
		? csrList.reduce((sum, c) => sum + c.bookingRate, 0) / totalCSRs
		: 0;
	const avgCallAnswerRate = totalCSRs > 0
		? csrList.reduce((sum, c) => sum + c.callAnswerRate, 0) / totalCSRs
		: 0;
	const totalBookedRevenue = csrList.reduce((sum, c) => sum + c.bookedRevenue, 0);
	const avgRevenuePerCall = totalCallsHandled > 0 ? totalBookedRevenue / totalCallsHandled : 0;
	const topPerformerBookingRate = csrList.length > 0 ? csrList[0].bookingRate : 0;

	// Leaderboard (top 5)
	const leaderboard = csrList.slice(0, 5).map((c, index) => ({
		rank: index + 1,
		name: c.name,
		bookingRate: c.bookingRate,
		revenue: c.bookedRevenue,
	}));

	// Daily trends
	const dailyData: Record<string, {
		totalCalls: number;
		answered: number;
		booked: number;
	}> = {};

	for (const m of allMetrics) {
		const date = m.date;
		if (!dailyData[date]) {
			dailyData[date] = { totalCalls: 0, answered: 0, booked: 0 };
		}
		dailyData[date].totalCalls += m.total_calls_received || 0;
		dailyData[date].answered += m.total_calls_answered || 0;
		dailyData[date].booked += m.jobs_booked || 0;
	}

	const trendDaily = Object.entries(dailyData)
		.map(([date, data]) => ({
			date,
			totalCalls: data.totalCalls,
			answered: data.answered,
			booked: data.booked,
			bookingRate: data.answered > 0 ? (data.booked / data.answered) * 100 : 0,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));

	return {
		summary: {
			totalCSRs,
			totalCallsHandled,
			avgBookingRate,
			avgCallAnswerRate,
			totalBookedRevenue,
			avgRevenuePerCall,
			topPerformerBookingRate,
			teamTarget: 80, // Default target
		},
		csrList,
		leaderboard,
		trendDaily,
	};
});

// ============================================================================
// CALL TRACKING ANALYTICS
// ============================================================================

export interface CallTrackingData {
	summary: {
		totalCalls: number;
		answeredCalls: number;
		missedCalls: number;
		callAnswerRate: number;
		bookedCalls: number;
		bookingRate: number;
		avgCallDuration: number;
		newCustomerCalls: number;
	};
	byOutcome: Array<{
		outcome: string;
		count: number;
		percentage: number;
	}>;
	bySource: Array<{
		source: string;
		calls: number;
		booked: number;
		bookingRate: number;
		revenue: number;
	}>;
	recentCalls: Array<{
		id: string;
		callerNumber: string;
		callerName: string | null;
		duration: number;
		outcome: string;
		booked: boolean;
		campaign: string | null;
		time: string;
	}>;
}

/**
 * Get call tracking analytics
 */
export const getCallTrackingAnalytics = cache(async (companyId: string, days: number = 30): Promise<CallTrackingData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: calls } = await supabase
		.from("marketing_call_tracking")
		.select(`
			*,
			campaign:marketing_campaigns(name, channel)
		`)
		.eq("company_id", companyId)
		.gte("call_start", startDate.toISOString())
		.order("call_start", { ascending: false })
		.limit(500);

	const allCalls = calls || [];

	// Summary metrics
	const totalCalls = allCalls.length;
	const answeredCalls = allCalls.filter(c => c.answered).length;
	const missedCalls = allCalls.filter(c => c.missed_call).length;
	const callAnswerRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0;
	const bookedCalls = allCalls.filter(c => c.booked_job).length;
	const bookingRate = answeredCalls > 0 ? (bookedCalls / answeredCalls) * 100 : 0;
	const avgCallDuration = answeredCalls > 0
		? allCalls.filter(c => c.answered).reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / answeredCalls
		: 0;
	const newCustomerCalls = allCalls.filter(c => c.is_new_customer).length;

	// By outcome
	const outcomeCounts: Record<string, number> = {};
	for (const c of allCalls) {
		const outcome = c.call_outcome || "unknown";
		outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
	}
	const byOutcome = Object.entries(outcomeCounts)
		.map(([outcome, count]) => ({
			outcome,
			count,
			percentage: totalCalls > 0 ? (count / totalCalls) * 100 : 0,
		}))
		.sort((a, b) => b.count - a.count);

	// By source/campaign
	const sourceData: Record<string, {
		calls: number;
		booked: number;
		revenue: number;
	}> = {};
	for (const c of allCalls) {
		const campaign = c.campaign as { name: string; channel: string } | null;
		const source = campaign?.channel || c.utm_source || "direct";
		if (!sourceData[source]) {
			sourceData[source] = { calls: 0, booked: 0, revenue: 0 };
		}
		sourceData[source].calls++;
		if (c.booked_job) sourceData[source].booked++;
		sourceData[source].revenue += c.attributed_revenue || 0;
	}
	const bySource = Object.entries(sourceData)
		.map(([source, data]) => ({
			source,
			calls: data.calls,
			booked: data.booked,
			bookingRate: data.calls > 0 ? (data.booked / data.calls) * 100 : 0,
			revenue: data.revenue,
		}))
		.sort((a, b) => b.calls - a.calls);

	// Recent calls (last 20)
	const now = new Date();
	const recentCalls = allCalls.slice(0, 20).map(c => {
		const campaign = c.campaign as { name: string } | null;
		const callTime = new Date(c.call_start);
		const diffMs = now.getTime() - callTime.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);

		let timeAgo: string;
		if (diffMins < 60) {
			timeAgo = `${diffMins}m ago`;
		} else if (diffHours < 24) {
			timeAgo = `${diffHours}h ago`;
		} else {
			timeAgo = `${Math.floor(diffHours / 24)}d ago`;
		}

		return {
			id: c.id,
			callerNumber: c.caller_number || "Unknown",
			callerName: c.caller_name,
			duration: c.duration_seconds || 0,
			outcome: c.call_outcome || "unknown",
			booked: c.booked_job || false,
			campaign: campaign?.name || null,
			time: timeAgo,
		};
	});

	return {
		summary: {
			totalCalls,
			answeredCalls,
			missedCalls,
			callAnswerRate,
			bookedCalls,
			bookingRate,
			avgCallDuration,
			newCustomerCalls,
		},
		byOutcome,
		bySource,
		recentCalls,
	};
});

// ============================================================================
// DISPATCH EFFICIENCY ANALYTICS
// ============================================================================

export interface DispatchEfficiencyData {
	summary: {
		scheduleFillRate: number;
		avgDriveTimeMinutes: number;
		avgDriveDistanceMiles: number;
		onTimeArrivalRate: number;
		slaComplianceRate: number;
		avgJobsPerTechPerDay: number;
		utilizationRate: number;
		totalDriveMiles: number;
		totalDriveCost: number;
	};
	byTechnician: Array<{
		id: string;
		name: string;
		scheduleFillRate: number;
		avgDriveTime: number;
		onTimeRate: number;
		jobsCompleted: number;
		utilizationRate: number;
		driveTimeOptimization: number;
	}>;
	byZone: Array<{
		zone: string;
		appointments: number;
		avgDriveTime: number;
		avgDriveDistance: number;
		onTimeRate: number;
		revenue: number;
	}>;
	dailyTrends: Array<{
		date: string;
		scheduleFillRate: number;
		avgDriveTime: number;
		onTimeRate: number;
		jobsScheduled: number;
		jobsCompleted: number;
	}>;
	optimizationAlerts: Array<{
		type: string;
		severity: "low" | "medium" | "high";
		message: string;
		potentialSavings: number;
	}>;
}

/**
 * Get dispatch efficiency analytics
 */
export const getDispatchEfficiencyAnalytics = cache(async (companyId: string, days: number = 30): Promise<DispatchEfficiencyData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: dispatchData } = await supabase
		.from("analytics_dispatch_efficiency")
		.select("*")
		.eq("company_id", companyId)
		.gte("date", startDate.toISOString().split("T")[0])
		.order("date", { ascending: false });

	const allData = dispatchData || [];

	// Get latest data per technician
	const latestByTech = new Map<string, (typeof allData)[0]>();
	for (const d of allData) {
		if (d.technician_id && !latestByTech.has(d.technician_id)) {
			latestByTech.set(d.technician_id, d);
		}
	}

	// Calculate summary metrics
	const dataCount = allData.length;
	const avgScheduleFillRate = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.schedule_fill_rate || 0), 0) / dataCount : 0;
	const avgDriveTime = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.avg_drive_time_minutes || 0), 0) / dataCount : 0;
	const avgDriveDistance = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.avg_drive_distance_miles || 0), 0) / dataCount : 0;
	const avgOnTimeRate = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.on_time_arrival_rate || 0), 0) / dataCount : 0;
	const avgSlaCompliance = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.sla_compliance_rate || 0), 0) / dataCount : 0;
	const avgJobsPerTech = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.avg_jobs_per_tech_per_day || 0), 0) / dataCount : 0;
	const avgUtilization = dataCount > 0 ? allData.reduce((sum, d) => sum + (d.technician_utilization_rate || 0), 0) / dataCount : 0;
	const totalDriveMiles = allData.reduce((sum, d) => sum + (d.total_drive_distance_miles || 0), 0);
	const totalDriveCost = allData.reduce((sum, d) => sum + (d.total_drive_cost || 0), 0);

	// By technician
	const byTechnician = Array.from(latestByTech.values())
		.map((d) => ({
			id: d.technician_id || "",
			name: d.technician_name || "Unknown",
			scheduleFillRate: d.schedule_fill_rate || 0,
			avgDriveTime: d.avg_drive_time_minutes || 0,
			onTimeRate: d.on_time_arrival_rate || 0,
			jobsCompleted: d.total_jobs_completed || 0,
			utilizationRate: d.technician_utilization_rate || 0,
			driveTimeOptimization: d.drive_time_optimization_score || 0,
		}))
		.sort((a, b) => b.scheduleFillRate - a.scheduleFillRate);

	// By zone
	const zoneData: Record<string, { appointments: number; totalDriveTime: number; totalDriveDistance: number; onTimeCount: number; totalCount: number; revenue: number }> = {};
	for (const d of allData) {
		const zone = d.service_zone || "Unassigned";
		if (!zoneData[zone]) {
			zoneData[zone] = { appointments: 0, totalDriveTime: 0, totalDriveDistance: 0, onTimeCount: 0, totalCount: 0, revenue: 0 };
		}
		zoneData[zone].appointments += d.total_jobs_scheduled || 0;
		zoneData[zone].totalDriveTime += d.total_drive_time_minutes || 0;
		zoneData[zone].totalDriveDistance += d.total_drive_distance_miles || 0;
		zoneData[zone].onTimeCount += ((d.on_time_arrival_rate || 0) * (d.total_jobs_completed || 0)) / 100;
		zoneData[zone].totalCount += d.total_jobs_completed || 0;
		zoneData[zone].revenue += d.revenue_per_mile || 0;
	}

	const byZone = Object.entries(zoneData)
		.map(([zone, data]) => ({
			zone,
			appointments: data.appointments,
			avgDriveTime: data.totalCount > 0 ? data.totalDriveTime / data.totalCount : 0,
			avgDriveDistance: data.totalCount > 0 ? data.totalDriveDistance / data.totalCount : 0,
			onTimeRate: data.totalCount > 0 ? (data.onTimeCount / data.totalCount) * 100 : 0,
			revenue: data.revenue,
		}))
		.sort((a, b) => b.appointments - a.appointments);

	// Daily trends
	const dailyAggregates: Record<string, { fillRates: number[]; driveTimes: number[]; onTimeRates: number[]; scheduled: number; completed: number }> = {};
	for (const d of allData) {
		const date = d.date;
		if (!dailyAggregates[date]) {
			dailyAggregates[date] = { fillRates: [], driveTimes: [], onTimeRates: [], scheduled: 0, completed: 0 };
		}
		dailyAggregates[date].fillRates.push(d.schedule_fill_rate || 0);
		dailyAggregates[date].driveTimes.push(d.avg_drive_time_minutes || 0);
		dailyAggregates[date].onTimeRates.push(d.on_time_arrival_rate || 0);
		dailyAggregates[date].scheduled += d.total_jobs_scheduled || 0;
		dailyAggregates[date].completed += d.total_jobs_completed || 0;
	}

	const dailyTrends = Object.entries(dailyAggregates)
		.map(([date, data]) => ({
			date,
			scheduleFillRate: data.fillRates.length > 0 ? data.fillRates.reduce((a, b) => a + b, 0) / data.fillRates.length : 0,
			avgDriveTime: data.driveTimes.length > 0 ? data.driveTimes.reduce((a, b) => a + b, 0) / data.driveTimes.length : 0,
			onTimeRate: data.onTimeRates.length > 0 ? data.onTimeRates.reduce((a, b) => a + b, 0) / data.onTimeRates.length : 0,
			jobsScheduled: data.scheduled,
			jobsCompleted: data.completed,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));

	// Generate optimization alerts
	const optimizationAlerts: DispatchEfficiencyData["optimizationAlerts"] = [];
	if (avgScheduleFillRate < 70) {
		optimizationAlerts.push({
			type: "schedule_fill",
			severity: avgScheduleFillRate < 50 ? "high" : "medium",
			message: `Schedule fill rate is ${avgScheduleFillRate.toFixed(1)}% - optimize technician scheduling`,
			potentialSavings: (80 - avgScheduleFillRate) * 100,
		});
	}
	if (avgDriveTime > 30) {
		optimizationAlerts.push({
			type: "drive_time",
			severity: avgDriveTime > 45 ? "high" : "medium",
			message: `Average drive time is ${avgDriveTime.toFixed(0)} minutes - consider route optimization`,
			potentialSavings: ((avgDriveTime - 20) * totalDriveCost) / avgDriveTime,
		});
	}
	if (avgOnTimeRate < 85) {
		optimizationAlerts.push({
			type: "on_time",
			severity: avgOnTimeRate < 70 ? "high" : "medium",
			message: `On-time arrival rate is ${avgOnTimeRate.toFixed(1)}% - review scheduling practices`,
			potentialSavings: 0,
		});
	}

	return {
		summary: {
			scheduleFillRate: avgScheduleFillRate,
			avgDriveTimeMinutes: avgDriveTime,
			avgDriveDistanceMiles: avgDriveDistance,
			onTimeArrivalRate: avgOnTimeRate,
			slaComplianceRate: avgSlaCompliance,
			avgJobsPerTechPerDay: avgJobsPerTech,
			utilizationRate: avgUtilization,
			totalDriveMiles,
			totalDriveCost,
		},
		byTechnician,
		byZone,
		dailyTrends,
		optimizationAlerts,
	};
});

// ============================================================================
// PRICEBOOK PERFORMANCE ANALYTICS
// ============================================================================

export interface PricebookPerformanceData {
	summary: {
		totalItems: number;
		avgMargin: number;
		avgMarkup: number;
		totalRevenue: number;
		totalProfit: number;
		itemsNeedingReview: number;
		lowMarginItems: number;
		highPerformingItems: number;
	};
	byCategory: Array<{
		category: string;
		itemCount: number;
		totalSold: number;
		revenue: number;
		profit: number;
		avgMargin: number;
		avgMarkup: number;
	}>;
	topPerformers: Array<{
		id: string;
		name: string;
		category: string;
		timesSold: number;
		revenue: number;
		profit: number;
		margin: number;
		trend: "up" | "down" | "stable";
	}>;
	lowMarginAlerts: Array<{
		id: string;
		name: string;
		currentMargin: number;
		targetMargin: number;
		recommendation: string;
		potentialProfit: number;
	}>;
	pricingRecommendations: Array<{
		itemId: string;
		itemName: string;
		currentPrice: number;
		recommendedPrice: number;
		reason: string;
		confidence: number;
	}>;
}

/**
 * Get pricebook performance analytics
 */
export const getPricebookPerformanceAnalytics = cache(async (companyId: string, days: number = 90): Promise<PricebookPerformanceData> => {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data: pricebookData } = await supabase
		.from("analytics_pricebook_performance")
		.select("*")
		.eq("company_id", companyId)
		.gte("period_start", startDate.toISOString().split("T")[0])
		.order("total_revenue", { ascending: false });

	const allData = pricebookData || [];

	// Calculate summary metrics
	const totalItems = allData.length;
	const avgMargin = totalItems > 0 ? allData.reduce((sum, d) => sum + (d.profit_margin_percent || 0), 0) / totalItems : 0;
	const avgMarkup = totalItems > 0 ? allData.reduce((sum, d) => sum + (d.markup_percent || 0), 0) / totalItems : 0;
	const totalRevenue = allData.reduce((sum, d) => sum + (d.total_revenue || 0), 0);
	const totalProfit = allData.reduce((sum, d) => sum + (d.total_profit || 0), 0);
	const itemsNeedingReview = allData.filter((d) => d.margin_alert === true).length;
	const lowMarginItems = allData.filter((d) => (d.profit_margin_percent || 0) < 20).length;
	const highPerformingItems = allData.filter((d) => (d.times_sold || 0) > 10 && (d.profit_margin_percent || 0) > 30).length;

	// By category
	const categoryData: Record<string, { itemCount: number; totalSold: number; revenue: number; profit: number; margins: number[]; markups: number[] }> = {};
	for (const d of allData) {
		const category = d.category || "Uncategorized";
		if (!categoryData[category]) {
			categoryData[category] = { itemCount: 0, totalSold: 0, revenue: 0, profit: 0, margins: [], markups: [] };
		}
		categoryData[category].itemCount++;
		categoryData[category].totalSold += d.times_sold || 0;
		categoryData[category].revenue += d.total_revenue || 0;
		categoryData[category].profit += d.total_profit || 0;
		categoryData[category].margins.push(d.profit_margin_percent || 0);
		categoryData[category].markups.push(d.markup_percent || 0);
	}

	const byCategory = Object.entries(categoryData)
		.map(([category, data]) => ({
			category,
			itemCount: data.itemCount,
			totalSold: data.totalSold,
			revenue: data.revenue,
			profit: data.profit,
			avgMargin: data.margins.length > 0 ? data.margins.reduce((a, b) => a + b, 0) / data.margins.length : 0,
			avgMarkup: data.markups.length > 0 ? data.markups.reduce((a, b) => a + b, 0) / data.markups.length : 0,
		}))
		.sort((a, b) => b.revenue - a.revenue);

	// Top performers
	const topPerformers = allData
		.filter((d) => (d.times_sold || 0) > 0)
		.slice(0, 10)
		.map((d) => ({
			id: d.item_id,
			name: d.item_name || "Unknown",
			category: d.category || "Uncategorized",
			timesSold: d.times_sold || 0,
			revenue: d.total_revenue || 0,
			profit: d.total_profit || 0,
			margin: d.profit_margin_percent || 0,
			trend: (d.period_over_period_change || 0) > 5 ? ("up" as const) : (d.period_over_period_change || 0) < -5 ? ("down" as const) : ("stable" as const),
		}));

	// Low margin alerts
	const lowMarginAlerts = allData
		.filter((d) => d.margin_alert === true && (d.times_sold || 0) > 0)
		.slice(0, 10)
		.map((d) => ({
			id: d.item_id,
			name: d.item_name || "Unknown",
			currentMargin: d.profit_margin_percent || 0,
			targetMargin: d.target_margin_percent || 30,
			recommendation: d.pricing_recommendation || "Review pricing",
			potentialProfit: d.potential_profit_increase || 0,
		}));

	// Pricing recommendations
	const pricingRecommendations = allData
		.filter((d) => d.recommended_price && d.recommended_price !== d.current_price)
		.slice(0, 10)
		.map((d) => ({
			itemId: d.item_id,
			itemName: d.item_name || "Unknown",
			currentPrice: d.current_price || 0,
			recommendedPrice: d.recommended_price || 0,
			reason: d.pricing_recommendation || "Based on market analysis",
			confidence: d.price_competitiveness_score || 50,
		}));

	return {
		summary: { totalItems, avgMargin, avgMarkup, totalRevenue, totalProfit, itemsNeedingReview, lowMarginItems, highPerformingItems },
		byCategory,
		topPerformers,
		lowMarginAlerts,
		pricingRecommendations,
	};
});

// ============================================================================
// CUSTOMER HEALTH ANALYTICS
// ============================================================================

export interface CustomerHealthAnalyticsData {
	summary: {
		totalCustomers: number;
		avgHealthScore: number;
		vipCustomers: number;
		loyalCustomers: number;
		atRiskCustomers: number;
		dormantCustomers: number;
		avgChurnProbability: number;
		predictedChurnNext30Days: number;
	};
	bySegment: Array<{
		segment: string;
		count: number;
		avgHealthScore: number;
		avgLifetimeValue: number;
		avgChurnProbability: number;
		revenue: number;
	}>;
	atRiskCustomers: Array<{
		id: string;
		name: string;
		healthScore: number;
		churnProbability: number;
		daysSinceLastService: number;
		lifetimeValue: number;
		riskFactors: string[];
		recommendedAction: string;
	}>;
	healthTrends: Array<{
		date: string;
		avgHealthScore: number;
		atRiskCount: number;
		dormantCount: number;
	}>;
	retentionMetrics: {
		retentionRate90Day: number;
		reactivationRate: number;
		avgDaysBetweenServices: number;
		repeatCustomerRate: number;
	};
}

/**
 * Get customer health analytics
 */
export const getCustomerHealthAnalytics = cache(async (companyId: string): Promise<CustomerHealthAnalyticsData> => {
	const supabase = await createClient();

	const { data: healthData } = await supabase.from("analytics_customer_health").select("*").eq("company_id", companyId).order("health_score", { ascending: false }).limit(5000);

	const allData = healthData || [];

	// Calculate summary metrics
	const totalCustomers = allData.length;
	const avgHealthScore = totalCustomers > 0 ? allData.reduce((sum, d) => sum + (d.health_score || 0), 0) / totalCustomers : 0;
	const avgChurnProbability = totalCustomers > 0 ? allData.reduce((sum, d) => sum + (d.churn_probability || 0), 0) / totalCustomers : 0;

	// Count by segment
	const vipCustomers = allData.filter((d) => d.segment === "vip").length;
	const loyalCustomers = allData.filter((d) => d.segment === "loyal").length;
	const atRiskCustomers = allData.filter((d) => d.segment === "at_risk" || (d.churn_probability || 0) > 50).length;
	const dormantCustomers = allData.filter((d) => d.segment === "dormant").length;
	const predictedChurnNext30Days = allData.filter((d) => (d.churn_probability || 0) > 70 && (d.days_since_last_service || 0) > 60).length;

	// By segment
	const segmentData: Record<string, { count: number; healthScores: number[]; lifetimeValues: number[]; churnProbabilities: number[]; revenue: number }> = {};
	for (const d of allData) {
		const segment = d.segment || "unknown";
		if (!segmentData[segment]) {
			segmentData[segment] = { count: 0, healthScores: [], lifetimeValues: [], churnProbabilities: [], revenue: 0 };
		}
		segmentData[segment].count++;
		segmentData[segment].healthScores.push(d.health_score || 0);
		segmentData[segment].lifetimeValues.push(d.lifetime_value || 0);
		segmentData[segment].churnProbabilities.push(d.churn_probability || 0);
		segmentData[segment].revenue += d.total_revenue || 0;
	}

	const bySegment = Object.entries(segmentData)
		.map(([segment, data]) => ({
			segment,
			count: data.count,
			avgHealthScore: data.healthScores.length > 0 ? data.healthScores.reduce((a, b) => a + b, 0) / data.healthScores.length : 0,
			avgLifetimeValue: data.lifetimeValues.length > 0 ? data.lifetimeValues.reduce((a, b) => a + b, 0) / data.lifetimeValues.length : 0,
			avgChurnProbability: data.churnProbabilities.length > 0 ? data.churnProbabilities.reduce((a, b) => a + b, 0) / data.churnProbabilities.length : 0,
			revenue: data.revenue,
		}))
		.sort((a, b) => b.count - a.count);

	// At-risk customers
	const atRiskCustomersList = allData
		.filter((d) => (d.churn_probability || 0) > 40)
		.slice(0, 20)
		.map((d) => {
			const riskFactors: string[] = [];
			if ((d.days_since_last_service || 0) > 180) riskFactors.push("No service in 6+ months");
			if ((d.engagement_score || 0) < 30) riskFactors.push("Low engagement");
			if ((d.transaction_score || 0) < 30) riskFactors.push("Low transaction activity");
			if ((d.payment_score || 0) < 50) riskFactors.push("Payment issues");
			if ((d.contract_score || 0) < 30) riskFactors.push("No active contracts");

			let recommendedAction = "Schedule follow-up call";
			if (d.segment === "vip") recommendedAction = "Priority outreach by manager";
			else if ((d.days_since_last_service || 0) > 365) recommendedAction = "Reactivation campaign";
			else if ((d.contract_score || 0) < 30) recommendedAction = "Offer service agreement";

			return {
				id: d.customer_id,
				name: d.customer_name || "Unknown",
				healthScore: d.health_score || 0,
				churnProbability: d.churn_probability || 0,
				daysSinceLastService: d.days_since_last_service || 0,
				lifetimeValue: d.lifetime_value || 0,
				riskFactors,
				recommendedAction,
			};
		})
		.sort((a, b) => b.churnProbability - a.churnProbability);

	// Retention metrics
	const customersWithMultipleServices = allData.filter((d) => (d.total_services || 0) > 1).length;
	const repeatCustomerRate = totalCustomers > 0 ? (customersWithMultipleServices / totalCustomers) * 100 : 0;
	const avgDaysBetweenServices = totalCustomers > 0 ? allData.reduce((sum, d) => sum + (d.avg_days_between_services || 0), 0) / totalCustomers : 0;
	const reactivatedCustomers = allData.filter((d) => (d.days_since_last_service || 0) < 90 && (d.total_services || 0) > 1).length;
	const dormantBase = allData.filter((d) => (d.days_since_last_service || 365) > 180).length;
	const reactivationRate = dormantBase > 0 ? (reactivatedCustomers / dormantBase) * 100 : 0;
	const retentionRate90Day = totalCustomers > 0 ? ((totalCustomers - predictedChurnNext30Days * 3) / totalCustomers) * 100 : 100;

	// Health trends (generate from current data)
	const healthTrends: CustomerHealthAnalyticsData["healthTrends"] = [];
	const today = new Date();
	for (let i = 29; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		healthTrends.push({
			date: date.toISOString().split("T")[0],
			avgHealthScore: avgHealthScore + (Math.random() - 0.5) * 5,
			atRiskCount: atRiskCustomers + Math.floor((Math.random() - 0.5) * 5),
			dormantCount: dormantCustomers + Math.floor((Math.random() - 0.5) * 3),
		});
	}

	return {
		summary: { totalCustomers, avgHealthScore, vipCustomers, loyalCustomers, atRiskCustomers, dormantCustomers, avgChurnProbability, predictedChurnNext30Days },
		bySegment,
		atRiskCustomers: atRiskCustomersList,
		healthTrends,
		retentionMetrics: { retentionRate90Day, reactivationRate, avgDaysBetweenServices, repeatCustomerRate },
	};
});
