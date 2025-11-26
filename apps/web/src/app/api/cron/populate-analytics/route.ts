/**
 * Cron Job: Populate Daily Analytics Snapshots
 *
 * Runs nightly to compute and store aggregated analytics metrics.
 * This pre-calculates data so dashboards load instantly instead of
 * computing on-the-fly.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/populate-analytics",
 *     "schedule": "0 3 * * *"
 *   }]
 * }
 */

import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const maxDuration = 300; // 5 minutes max for Vercel

export async function GET(request: Request) {
	// Verify cron secret for security
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return NextResponse.json(
			{ error: "Cron secret not configured" },
			{ status: 500 },
		);
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const supabase = createServiceSupabaseClient();
		const results: Array<{
			companyId: string;
			success: boolean;
			error?: string;
		}> = [];

		// Get all active companies
		const { data: companies, error: companiesError } = await supabase
			.from("companies")
			.select("id")
			.is("deleted_at", null);

		if (companiesError) {
			return NextResponse.json(
				{ error: "Failed to fetch companies", details: companiesError.message },
				{ status: 500 },
			);
		}

		if (!companies || companies.length === 0) {
			return NextResponse.json({
				success: true,
				message: "No companies to process",
				processed: 0,
			});
		}

		// Calculate for yesterday (complete day)
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const snapshotDate = yesterday.toISOString().split("T")[0];
		const dayStart = `${snapshotDate}T00:00:00.000Z`;
		const dayEnd = `${snapshotDate}T23:59:59.999Z`;

		for (const company of companies) {
			try {
				await populateDailySnapshot(
					supabase,
					company.id,
					snapshotDate,
					dayStart,
					dayEnd,
				);
				results.push({ companyId: company.id, success: true });
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "Unknown error";
				results.push({ companyId: company.id, success: false, error: message });
			}
		}

		const successCount = results.filter((r) => r.success).length;
		const failCount = results.filter((r) => !r.success).length;

		return NextResponse.json({
			success: true,
			message: `Processed ${companies.length} companies`,
			snapshotDate,
			successCount,
			failCount,
			results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Analytics population failed", details: message },
			{ status: 500 },
		);
	}
}

async function populateDailySnapshot(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	snapshotDate: string,
	dayStart: string,
	dayEnd: string,
) {
	// Fetch all raw data in parallel for efficiency
	const [
		jobsResult,
		completedJobsResult,
		estimatesResult,
		invoicesResult,
		paymentsResult,
		appointmentsResult,
		communicationsResult,
		customersResult,
		contractsResult,
		usersResult,
		timeEntriesResult,
		invoiceItemsResult,
	] = await Promise.all([
		// Jobs created/scheduled today
		supabase
			.from("jobs")
			.select(
				"id, status, total_revenue, actual_start_time, actual_end_time, job_type, is_callback",
			)
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Jobs completed today (for revenue)
		supabase
			.from("jobs")
			.select("id, total_revenue, actual_start_time, actual_end_time, job_type")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("actual_end_time", dayStart)
			.lt("actual_end_time", dayEnd)
			.is("deleted_at", null),

		// Estimates
		supabase
			.from("estimates")
			.select("id, status, total_amount, conversion_status")
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Invoices
		supabase
			.from("invoices")
			.select("id, status, total_amount, balance_amount, due_date, paid_at")
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Payments
		supabase
			.from("payments")
			.select("id, amount, payment_method, status")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Appointments
		supabase
			.from("appointments")
			.select("id, status")
			.eq("company_id", companyId)
			.gte("start_time", dayStart)
			.lt("start_time", dayEnd)
			.is("deleted_at", null),

		// Communications
		supabase
			.from("communications")
			.select("id, type, direction, response_time_minutes")
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Customers created today
		supabase
			.from("customers")
			.select("id")
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Contracts
		supabase
			.from("contracts")
			.select("id, status, total_value")
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Active technicians (users with technician role who worked today)
		supabase
			.from("users")
			.select("id")
			.eq("company_id", companyId)
			.eq("role", "technician")
			.eq("status", "active"),

		// Time entries for billable hours
		supabase
			.from("time_entries")
			.select("id, duration_minutes, billable, user_id")
			.eq("company_id", companyId)
			.gte("created_at", dayStart)
			.lt("created_at", dayEnd)
			.is("deleted_at", null),

		// Invoice items for parts/labor breakdown
		supabase
			.from("invoice_items")
			.select(
				"id, quantity, unit_price, item_type, invoice:invoices!inner(company_id, created_at)",
			)
			.eq("invoice.company_id", companyId)
			.gte("invoice.created_at", dayStart)
			.lt("invoice.created_at", dayEnd),
	]);

	const jobs = jobsResult.data ?? [];
	const completedJobs = completedJobsResult.data ?? [];
	const estimates = estimatesResult.data ?? [];
	const invoices = invoicesResult.data ?? [];
	const payments = paymentsResult.data ?? [];
	const appointments = appointmentsResult.data ?? [];
	const communications = communicationsResult.data ?? [];
	const newCustomers = customersResult.data ?? [];
	const contracts = contractsResult.data ?? [];
	const technicians = usersResult.data ?? [];
	const timeEntries = timeEntriesResult.data ?? [];
	const invoiceItems = invoiceItemsResult.data ?? [];

	// Calculate job metrics
	const jobsCreated = jobs.length;
	const jobsScheduled = jobs.filter((j) => j.status === "scheduled").length;
	const jobsCompleted = completedJobs.length;
	const jobsCancelled = jobs.filter((j) => j.status === "cancelled").length;
	const jobsInProgress = jobs.filter((j) => j.status === "in_progress").length;
	const firstTimeFix = completedJobs.filter((j) => !j.is_callback).length;
	const callbacks = completedJobs.filter((j) => j.is_callback).length;

	// Revenue calculations (amounts stored in cents)
	const totalRevenue = completedJobs.reduce(
		(sum, j) => sum + (j.total_revenue ?? 0),
		0,
	);
	const averageTicket =
		jobsCompleted > 0 ? Math.round(totalRevenue / jobsCompleted) : 0;

	// Job durations
	const durations = completedJobs
		.filter((j) => j.actual_start_time && j.actual_end_time)
		.map((j) => {
			const start = new Date(j.actual_start_time!).getTime();
			const end = new Date(j.actual_end_time!).getTime();
			return Math.round((end - start) / (1000 * 60)); // minutes
		});
	const avgDuration =
		durations.length > 0
			? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
			: 0;

	// Estimate metrics
	const estimatesCreated = estimates.length;
	const estimatesApproved = estimates.filter(
		(e) => e.conversion_status === "won",
	).length;
	const estimatesDeclined = estimates.filter(
		(e) => e.conversion_status === "lost",
	).length;
	const estimateConversionRate =
		estimatesCreated > 0 ? (estimatesApproved / estimatesCreated) * 100 : 0;
	const estimateTotalValue = estimates.reduce(
		(sum, e) => sum + (e.total_amount ?? 0),
		0,
	);

	// Invoice metrics
	const invoicesCreated = invoices.length;
	const invoicesPaid = invoices.filter((i) => i.status === "paid").length;
	const invoicesOverdue = invoices.filter((i) => {
		if (!i.due_date || i.status === "paid") return false;
		return new Date(i.due_date) < new Date(snapshotDate);
	}).length;

	// Payment metrics
	const paymentsReceived = payments.reduce(
		(sum, p) => sum + (p.amount ?? 0),
		0,
	);
	const paymentCount = payments.length;

	// Appointment metrics
	const appointmentsScheduled = appointments.length;
	const appointmentsCompleted = appointments.filter(
		(a) => a.status === "completed",
	).length;
	const appointmentsCancelled = appointments.filter(
		(a) => a.status === "cancelled",
	).length;
	const appointmentsNoShow = appointments.filter(
		(a) => a.status === "no_show",
	).length;
	const appointmentShowRate =
		appointmentsScheduled > 0
			? (appointmentsCompleted / appointmentsScheduled) * 100
			: 0;

	// Communication metrics
	const emailsSent = communications.filter(
		(c) => c.type === "email" && c.direction === "outbound",
	).length;
	const emailsReceived = communications.filter(
		(c) => c.type === "email" && c.direction === "inbound",
	).length;
	const smsSent = communications.filter(
		(c) => c.type === "sms" && c.direction === "outbound",
	).length;
	const smsReceived = communications.filter(
		(c) => c.type === "sms" && c.direction === "inbound",
	).length;
	const callsMade = communications.filter(
		(c) => c.type === "call" && c.direction === "outbound",
	).length;
	const callsReceived = communications.filter(
		(c) => c.type === "call" && c.direction === "inbound",
	).length;

	// Average response time
	const responseTimes = communications
		.filter((c) => c.response_time_minutes != null)
		.map((c) => c.response_time_minutes!);
	const avgResponseTime =
		responseTimes.length > 0
			? Math.round(
					responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
				)
			: 0;

	// Contract metrics
	const contractsCreated = contracts.length;
	const contractsRenewed = contracts.filter(
		(c) => c.status === "renewed",
	).length;
	const contractsCancelled = contracts.filter(
		(c) => c.status === "cancelled",
	).length;
	const contractRevenue = contracts.reduce(
		(sum, c) => sum + (c.total_value ?? 0),
		0,
	);

	// Get active contracts count
	const { count: activeContracts } = await supabase
		.from("contracts")
		.select("id", { count: "exact", head: true })
		.eq("company_id", companyId)
		.eq("status", "active")
		.is("deleted_at", null);

	// Get total active customers
	const { count: totalActiveCustomers } = await supabase
		.from("customers")
		.select("id", { count: "exact", head: true })
		.eq("company_id", companyId)
		.is("deleted_at", null);

	// Calculate outstanding revenue (unpaid invoices)
	const { data: outstandingInvoices } = await supabase
		.from("invoices")
		.select("balance_amount")
		.eq("company_id", companyId)
		.in("status", ["sent", "partial", "overdue"])
		.is("deleted_at", null);
	const outstandingRevenue = (outstandingInvoices ?? []).reduce(
		(sum, i) => sum + (i.balance_amount ?? 0),
		0,
	);

	// Calculate median job value
	const jobValues = completedJobs
		.map((j) => j.total_revenue ?? 0)
		.sort((a, b) => a - b);
	const medianJobValue =
		jobValues.length > 0 ? jobValues[Math.floor(jobValues.length / 2)] : 0;

	// Calculate percentiles
	const p25 =
		jobValues.length > 0 ? jobValues[Math.floor(jobValues.length * 0.25)] : 0;
	const p75 =
		jobValues.length > 0 ? jobValues[Math.floor(jobValues.length * 0.75)] : 0;
	const p90 =
		jobValues.length > 0 ? jobValues[Math.floor(jobValues.length * 0.9)] : 0;

	// Get most common job type
	const jobTypeCounts: Record<string, number> = {};
	for (const job of completedJobs) {
		const type = job.job_type ?? "unknown";
		jobTypeCounts[type] = (jobTypeCounts[type] ?? 0) + 1;
	}
	const mostCommonJobType = Object.entries(jobTypeCounts).sort(
		(a, b) => b[1] - a[1],
	)[0];

	// Get most common payment method
	const paymentMethodCounts: Record<string, number> = {};
	for (const payment of payments) {
		const method = payment.payment_method ?? "unknown";
		paymentMethodCounts[method] = (paymentMethodCounts[method] ?? 0) + 1;
	}
	const mostCommonPaymentMethod = Object.entries(paymentMethodCounts).sort(
		(a, b) => b[1] - a[1],
	)[0];

	// === NEW METRICS FOR ENHANCED ANALYTICS ===

	// Billable hours calculation
	const billableMinutes = timeEntries
		.filter((t) => t.billable === true)
		.reduce((sum, t) => sum + (t.duration_minutes ?? 0), 0);
	const nonBillableMinutes = timeEntries
		.filter((t) => t.billable === false || t.billable === null)
		.reduce((sum, t) => sum + (t.duration_minutes ?? 0), 0);
	const billableHours = billableMinutes / 60;
	const nonBillableHours = nonBillableMinutes / 60;

	// Capacity calculation (assumes 8 hour workday per tech)
	const capacityAvailableHours = technicians.length * 8;
	const capacityBookedHours = (billableMinutes + nonBillableMinutes) / 60;
	const capacityUtilization =
		capacityAvailableHours > 0
			? (capacityBookedHours / capacityAvailableHours) * 100
			: 0;

	// Revenue breakdown by type
	let partsRevenue = 0;
	let laborRevenue = 0;
	let serviceRevenue = 0;
	for (const item of invoiceItems) {
		const amount = (item.unit_price ?? 0) * (item.quantity ?? 1);
		if (item.item_type === "part" || item.item_type === "material") {
			partsRevenue += amount;
		} else if (item.item_type === "labor") {
			laborRevenue += amount;
		} else if (item.item_type === "service") {
			serviceRevenue += amount;
		}
	}

	// Emergency calls tracking (jobs with priority = 'emergency')
	const emergencyCalls = jobs.filter(
		(j) => (j as { priority?: string }).priority === "emergency",
	).length;
	const emergencyRevenue = completedJobs
		.filter((j) => (j as { priority?: string }).priority === "emergency")
		.reduce((sum, j) => sum + (j.total_revenue ?? 0), 0);

	// Same-day completions
	const sameDayCompletions = completedJobs.filter((j) => {
		if (!j.actual_start_time || !j.actual_end_time) return false;
		const start = new Date(j.actual_start_time).toISOString().split("T")[0];
		const end = new Date(j.actual_end_time).toISOString().split("T")[0];
		return start === end;
	}).length;

	// Rescheduled jobs
	const rescheduledJobs = jobs.filter((j) => j.status === "rescheduled").length;

	// Drive time (from appointments with drive data)
	const driveTimeTotal = (appointmentsResult.data ?? []).reduce(
		(sum, a) =>
			sum + ((a as { drive_time_minutes?: number }).drive_time_minutes ?? 0),
		0,
	);

	// Quotes/estimates metrics for daily tracking
	const quotesValue = estimates.reduce(
		(sum, e) => sum + (e.total_amount ?? 0),
		0,
	);

	// Average job profit calculation
	const jobProfits = completedJobs
		.filter((j) => (j as { profit_actual?: number }).profit_actual != null)
		.map((j) => (j as { profit_actual?: number }).profit_actual ?? 0);
	const avgJobProfit =
		jobProfits.length > 0
			? jobProfits.reduce((a, b) => a + b, 0) / jobProfits.length
			: 0;

	// Average job value
	const avgJobValueCalc = jobsCompleted > 0 ? totalRevenue / jobsCompleted : 0;

	// Upsert the snapshot
	const { error: upsertError } = await supabase
		.from("analytics_daily_snapshots")
		.upsert(
			{
				company_id: companyId,
				snapshot_date: snapshotDate,
				// Revenue
				total_revenue: totalRevenue,
				collected_revenue: paymentsReceived,
				outstanding_revenue: outstandingRevenue,
				average_ticket: averageTicket,
				// Jobs
				jobs_created: jobsCreated,
				jobs_scheduled: jobsScheduled,
				jobs_completed: jobsCompleted,
				jobs_cancelled: jobsCancelled,
				jobs_in_progress: jobsInProgress,
				average_job_duration_minutes: avgDuration,
				first_time_fix_count: firstTimeFix,
				callback_count: callbacks,
				// Customers
				new_customers: newCustomers.length,
				total_active_customers: totalActiveCustomers ?? 0,
				// Estimates
				estimates_created: estimatesCreated,
				estimates_approved: estimatesApproved,
				estimates_declined: estimatesDeclined,
				estimate_conversion_rate: estimateConversionRate,
				estimate_total_value: estimateTotalValue,
				// Invoices
				invoices_created: invoicesCreated,
				invoices_paid: invoicesPaid,
				invoices_overdue: invoicesOverdue,
				// Payments
				payments_received: paymentsReceived,
				payment_count: paymentCount,
				// Appointments
				appointments_scheduled: appointmentsScheduled,
				appointments_completed: appointmentsCompleted,
				appointments_cancelled: appointmentsCancelled,
				appointments_no_show: appointmentsNoShow,
				appointment_show_rate: appointmentShowRate,
				// Communications
				emails_sent: emailsSent,
				emails_received: emailsReceived,
				sms_sent: smsSent,
				sms_received: smsReceived,
				calls_made: callsMade,
				calls_received: callsReceived,
				average_response_time_minutes: avgResponseTime,
				// Technicians
				active_technicians: technicians.length,
				// Contracts
				contracts_created: contractsCreated,
				contracts_renewed: contractsRenewed,
				contracts_cancelled: contractsCancelled,
				active_contracts: activeContracts ?? 0,
				contract_revenue: contractRevenue,
				// Statistical
				median_job_value: medianJobValue,
				job_value_p25: p25,
				job_value_p75: p75,
				job_value_p90: p90,
				most_common_job_type: mostCommonJobType?.[0] ?? null,
				most_common_job_type_count: mostCommonJobType?.[1] ?? 0,
				most_common_payment_method: mostCommonPaymentMethod?.[0] ?? null,
				most_common_payment_method_count: mostCommonPaymentMethod?.[1] ?? 0,
				// New enhanced metrics
				avg_response_time_minutes: avgResponseTime,
				emergency_calls: emergencyCalls,
				emergency_revenue: emergencyRevenue,
				same_day_completions: sameDayCompletions,
				callbacks: callbacks,
				rescheduled_jobs: rescheduledJobs,
				capacity_available_hours: capacityAvailableHours,
				capacity_booked_hours: capacityBookedHours,
				capacity_utilization: capacityUtilization,
				drive_time_total_minutes: driveTimeTotal,
				billable_hours: billableHours,
				non_billable_hours: nonBillableHours,
				parts_revenue: partsRevenue,
				labor_revenue: laborRevenue,
				service_revenue: serviceRevenue,
				quotes_sent: estimatesCreated,
				quotes_value: quotesValue,
				quotes_accepted: estimatesApproved,
				quotes_rejected: estimatesDeclined,
				invoices_created: invoicesCreated,
				invoices_value: invoices.reduce(
					(sum, i) => sum + (i.total_amount ?? 0),
					0,
				),
				payments_received: paymentCount,
				payments_value: paymentsReceived,
				avg_job_duration_minutes: avgDuration,
				avg_job_value: avgJobValueCalc,
				avg_job_profit: avgJobProfit,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: "company_id,snapshot_date",
			},
		);

	if (upsertError) {
		throw new Error(`Failed to upsert snapshot: ${upsertError.message}`);
	}

	// After inserting today's snapshot, calculate moving averages
	await calculateMovingAverages(supabase, companyId, snapshotDate);
}

async function calculateMovingAverages(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	snapshotDate: string,
) {
	// Get last 90 days of snapshots for moving average calculation
	const ninetyDaysAgo = new Date(snapshotDate);
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

	const { data: snapshots } = await supabase
		.from("analytics_daily_snapshots")
		.select("snapshot_date, total_revenue, jobs_completed, new_customers")
		.eq("company_id", companyId)
		.gte("snapshot_date", ninetyDaysAgo.toISOString().split("T")[0])
		.lte("snapshot_date", snapshotDate)
		.order("snapshot_date", { ascending: true });

	if (!snapshots || snapshots.length < 2) return;

	const revenues = snapshots.map((s) => s.total_revenue ?? 0);
	const jobs = snapshots.map((s) => s.jobs_completed ?? 0);
	const customers = snapshots.map((s) => s.new_customers ?? 0);

	// Calculate moving averages
	const revenue7ma = calculateMA(revenues, 7);
	const revenue30ma = calculateMA(revenues, 30);
	const revenue90ma = calculateMA(revenues, 90);
	const jobs7ma = calculateMA(jobs, 7);
	const jobs30ma = calculateMA(jobs, 30);
	const customers7ma = calculateMA(customers, 7);

	// Calculate trends
	const revenueTrend = determineTrend(revenues.slice(-7));
	const jobsTrend = determineTrend(jobs.slice(-7));
	const customerTrend = determineTrend(customers.slice(-7));

	// Calculate percent changes
	const prevDayRevenue = revenues[revenues.length - 2] ?? 0;
	const todayRevenue = revenues[revenues.length - 1] ?? 0;
	const revenueVsPrevDay =
		prevDayRevenue > 0
			? ((todayRevenue - prevDayRevenue) / prevDayRevenue) * 100
			: 0;

	const prevWeekRevenue = revenues[revenues.length - 8] ?? 0;
	const revenueVsPrevWeek =
		prevWeekRevenue > 0
			? ((todayRevenue - prevWeekRevenue) / prevWeekRevenue) * 100
			: 0;

	// Simple forecast (linear projection)
	const revenueForecast7d = Math.round(revenue7ma * 7);
	const revenueForecast30d = Math.round(revenue30ma * 30);

	// Update with moving averages and trends
	await supabase
		.from("analytics_daily_snapshots")
		.update({
			revenue_7day_ma: Math.round(revenue7ma),
			revenue_30day_ma: Math.round(revenue30ma),
			revenue_90day_ma: Math.round(revenue90ma),
			jobs_7day_ma: jobs7ma,
			jobs_30day_ma: jobs30ma,
			customers_7day_ma: customers7ma,
			revenue_trend: revenueTrend,
			jobs_trend: jobsTrend,
			customer_trend: customerTrend,
			revenue_vs_prev_day_percent: revenueVsPrevDay,
			revenue_vs_prev_week_percent: revenueVsPrevWeek,
			revenue_forecast_7d: revenueForecast7d,
			revenue_forecast_30d: revenueForecast30d,
		})
		.eq("company_id", companyId)
		.eq("snapshot_date", snapshotDate);
}

function calculateMA(values: number[], period: number): number {
	if (values.length === 0) return 0;
	const slice = values.slice(-period);
	return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function determineTrend(values: number[]): string {
	if (values.length < 2) return "stable";

	const firstHalf = values.slice(0, Math.floor(values.length / 2));
	const secondHalf = values.slice(Math.floor(values.length / 2));

	const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
	const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

	const change = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

	if (change > 10) return "increasing";
	if (change < -10) return "decreasing";
	return "stable";
}
