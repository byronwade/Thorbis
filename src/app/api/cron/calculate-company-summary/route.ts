/**
 * Cron Job: Calculate Company Summary Analytics
 *
 * Runs weekly to compute comprehensive company-level KPIs and summaries.
 * Aggregates data from daily snapshots and entity tables into
 * the analytics_company_summary table.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/calculate-company-summary",
 *     "schedule": "0 4 * * 0"
 *   }]
 * }
 */

import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export const maxDuration = 300;

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 });
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const supabase = createServiceSupabaseClient();
		const results: Array<{ companyId: string; success: boolean; error?: string }> = [];

		const { data: companies, error: companiesError } = await supabase
			.from("companies")
			.select("id")
			.is("deleted_at", null);

		if (companiesError || !companies) {
			return NextResponse.json(
				{ error: "Failed to fetch companies", details: companiesError?.message },
				{ status: 500 },
			);
		}

		const summaryDate = new Date().toISOString().split("T")[0];

		for (const company of companies) {
			try {
				await calculateCompanySummary(supabase, company.id, summaryDate);
				results.push({ companyId: company.id, success: true });
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : "Unknown error";
				results.push({ companyId: company.id, success: false, error: message });
			}
		}

		return NextResponse.json({
			success: true,
			summaryDate,
			processed: companies.length,
			results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: "Failed", details: message }, { status: 500 });
	}
}

async function calculateCompanySummary(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	summaryDate: string,
) {
	// Get date ranges
	const today = new Date(summaryDate);
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const ninetyDaysAgo = new Date(today);
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
	const oneYearAgo = new Date(today);
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

	// Fetch daily snapshots for aggregation
	const { data: snapshots } = await supabase
		.from("analytics_daily_snapshots")
		.select("*")
		.eq("company_id", companyId)
		.gte("snapshot_date", ninetyDaysAgo.toISOString().split("T")[0])
		.order("snapshot_date", { ascending: false });

	const recentSnapshots = snapshots ?? [];
	const last30Snapshots = recentSnapshots.slice(0, 30);
	const last7Snapshots = recentSnapshots.slice(0, 7);

	// Revenue metrics
	const revenueTotal = last30Snapshots.reduce((sum, s) => sum + (s.total_revenue ?? 0), 0);
	const revenue7day = last7Snapshots.reduce((sum, s) => sum + (s.total_revenue ?? 0), 0);
	const avgJobValue = last30Snapshots.reduce((sum, s) => sum + (s.average_ticket ?? 0), 0) / Math.max(last30Snapshots.length, 1);

	// Jobs metrics
	const jobsCompleted = last30Snapshots.reduce((sum, s) => sum + (s.jobs_completed ?? 0), 0);
	const jobsCreated = last30Snapshots.reduce((sum, s) => sum + (s.jobs_created ?? 0), 0);
	const jobsCancelled = last30Snapshots.reduce((sum, s) => sum + (s.jobs_cancelled ?? 0), 0);
	const firstTimeFixes = last30Snapshots.reduce((sum, s) => sum + (s.first_time_fix_count ?? 0), 0);
	const callbacks = last30Snapshots.reduce((sum, s) => sum + (s.callback_count ?? 0), 0);
	const firstTimeFixRate = jobsCompleted > 0 ? (firstTimeFixes / jobsCompleted) * 100 : 0;
	const callbackRate = jobsCompleted > 0 ? (callbacks / jobsCompleted) * 100 : 0;

	// Estimate metrics
	const estimatesCreated = last30Snapshots.reduce((sum, s) => sum + (s.estimates_created ?? 0), 0);
	const estimatesApproved = last30Snapshots.reduce((sum, s) => sum + (s.estimates_approved ?? 0), 0);
	const estimatesDeclined = last30Snapshots.reduce((sum, s) => sum + (s.estimates_declined ?? 0), 0);
	const estimateWinRate = estimatesCreated > 0 ? (estimatesApproved / estimatesCreated) * 100 : 0;

	// Customer metrics
	const newCustomers = last30Snapshots.reduce((sum, s) => sum + (s.new_customers ?? 0), 0);
	const totalCustomers = last30Snapshots[0]?.total_active_customers ?? 0;

	// Communications
	const emailsSent = last30Snapshots.reduce((sum, s) => sum + (s.emails_sent ?? 0), 0);
	const emailsReceived = last30Snapshots.reduce((sum, s) => sum + (s.emails_received ?? 0), 0);
	const smsSent = last30Snapshots.reduce((sum, s) => sum + (s.sms_sent ?? 0), 0);
	const smsReceived = last30Snapshots.reduce((sum, s) => sum + (s.sms_received ?? 0), 0);
	const callsMade = last30Snapshots.reduce((sum, s) => sum + (s.calls_made ?? 0), 0);
	const callsReceived = last30Snapshots.reduce((sum, s) => sum + (s.calls_received ?? 0), 0);
	const totalCommunications = emailsSent + emailsReceived + smsSent + smsReceived + callsMade + callsReceived;

	// Response time
	const responseTimes = last30Snapshots.filter((s) => s.average_response_time_minutes).map((s) => s.average_response_time_minutes!);
	const avgResponseTime = responseTimes.length > 0
		? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
		: 0;

	// Contracts
	const contractsCreated = last30Snapshots.reduce((sum, s) => sum + (s.contracts_created ?? 0), 0);
	const contractsRenewed = last30Snapshots.reduce((sum, s) => sum + (s.contracts_renewed ?? 0), 0);
	const contractsCancelled = last30Snapshots.reduce((sum, s) => sum + (s.contracts_cancelled ?? 0), 0);
	const activeContracts = last30Snapshots[0]?.active_contracts ?? 0;
	const contractRevenue = last30Snapshots.reduce((sum, s) => sum + (s.contract_revenue ?? 0), 0);
	const contractRenewalRate = (contractsCreated + contractsRenewed) > 0
		? (contractsRenewed / (contractsCreated + contractsRenewed)) * 100
		: 0;

	// Technician metrics
	const activeTechnicians = last30Snapshots[0]?.active_technicians ?? 0;
	const utilizationRates = last30Snapshots.filter((s) => s.utilization_rate).map((s) => s.utilization_rate!);
	const utilizationRate = utilizationRates.length > 0
		? utilizationRates.reduce((a, b) => a + b, 0) / utilizationRates.length
		: 0;
	const jobsPerTech = activeTechnicians > 0 ? jobsCompleted / activeTechnicians : 0;
	const revenuePerTech = activeTechnicians > 0 ? revenueTotal / activeTechnicians : 0;

	// AR metrics
	const outstandingAR = last30Snapshots[0]?.outstanding_revenue ?? 0;

	// Get AR aging from invoices
	const { data: arInvoices } = await supabase
		.from("invoices")
		.select("balance_amount, due_date, status")
		.eq("company_id", companyId)
		.in("status", ["sent", "partial", "overdue"])
		.is("deleted_at", null);

	let arCurrent = 0, ar1_30 = 0, ar31_60 = 0, ar61_90 = 0, arOver90 = 0;
	for (const inv of arInvoices ?? []) {
		if (!inv.due_date || !inv.balance_amount) continue;
		const daysPastDue = Math.floor((today.getTime() - new Date(inv.due_date).getTime()) / (1000 * 60 * 60 * 24));
		if (daysPastDue <= 0) arCurrent += inv.balance_amount;
		else if (daysPastDue <= 30) ar1_30 += inv.balance_amount;
		else if (daysPastDue <= 60) ar31_60 += inv.balance_amount;
		else if (daysPastDue <= 90) ar61_90 += inv.balance_amount;
		else arOver90 += inv.balance_amount;
	}

	// Pipeline value from open estimates
	const { data: openEstimates } = await supabase
		.from("estimates")
		.select("total_amount, conversion_probability")
		.eq("company_id", companyId)
		.in("status", ["draft", "sent", "pending"])
		.is("deleted_at", null);

	const pipelineValue = (openEstimates ?? []).reduce((sum, e) => sum + (e.total_amount ?? 0), 0);
	const weightedPipeline = (openEstimates ?? []).reduce(
		(sum, e) => sum + ((e.total_amount ?? 0) * ((e.conversion_probability ?? 50) / 100)),
		0
	);

	// === NEW KPI CALCULATIONS ===

	// Quote-to-close rate (estimates converted to jobs)
	const { data: convertedEstimates } = await supabase
		.from("estimates")
		.select("id, total_amount")
		.eq("company_id", companyId)
		.eq("conversion_status", "won")
		.gte("created_at", thirtyDaysAgo.toISOString())
		.is("deleted_at", null);

	const quoteToCloseRate = estimatesCreated > 0
		? ((convertedEstimates?.length ?? 0) / estimatesCreated) * 100
		: 0;

	// Quote accuracy (compare estimate amounts to final job amounts)
	const { data: jobsWithEstimates } = await supabase
		.from("jobs")
		.select("total_amount, estimated_amount")
		.eq("company_id", companyId)
		.eq("status", "completed")
		.not("estimated_amount", "is", null)
		.gte("created_at", thirtyDaysAgo.toISOString())
		.is("deleted_at", null);

	let quoteAccuracySum = 0;
	let quoteAccuracyCount = 0;
	for (const job of jobsWithEstimates ?? []) {
		if (job.estimated_amount && job.estimated_amount > 0) {
			const accuracy = 100 - Math.abs(((job.total_amount ?? 0) - job.estimated_amount) / job.estimated_amount * 100);
			quoteAccuracySum += Math.max(0, accuracy);
			quoteAccuracyCount++;
		}
	}
	const avgQuoteAccuracy = quoteAccuracyCount > 0 ? quoteAccuracySum / quoteAccuracyCount : 0;

	// Capacity utilization from daily snapshots
	const capacityValues = last30Snapshots.filter(s => s.capacity_utilization).map(s => s.capacity_utilization);
	const capacityUtilizationPercent = capacityValues.length > 0
		? capacityValues.reduce((a, b) => a + b, 0) / capacityValues.length
		: 0;

	// Billable hours ratio
	const totalBillableHours = last30Snapshots.reduce((sum, s) => sum + (s.billable_hours ?? 0), 0);
	const totalNonBillableHours = last30Snapshots.reduce((sum, s) => sum + (s.non_billable_hours ?? 0), 0);
	const billableHoursRatio = (totalBillableHours + totalNonBillableHours) > 0
		? (totalBillableHours / (totalBillableHours + totalNonBillableHours)) * 100
		: 0;

	// Cash flow forecasting
	const avgDailyRevenue = revenueTotal / 30;
	const avgDailyPayments = last30Snapshots.reduce((sum, s) => sum + (s.payments_value ?? 0), 0) / 30;
	const cashFlow30DayForecast = (avgDailyPayments * 30) - (avgDailyRevenue * 0.6 * 30); // Assuming 60% costs
	const cashFlow60DayForecast = cashFlow30DayForecast * 2;
	const cashFlow90DayForecast = cashFlow30DayForecast * 3;

	// Days to payment calculation
	const { data: paidInvoices } = await supabase
		.from("invoices")
		.select("created_at, paid_at")
		.eq("company_id", companyId)
		.eq("status", "paid")
		.not("paid_at", "is", null)
		.gte("paid_at", thirtyDaysAgo.toISOString())
		.is("deleted_at", null);

	let totalDaysToPayment = 0;
	let paidCount = 0;
	for (const inv of paidInvoices ?? []) {
		if (inv.created_at && inv.paid_at) {
			const days = Math.floor(
				(new Date(inv.paid_at).getTime() - new Date(inv.created_at).getTime()) / (1000 * 60 * 60 * 24)
			);
			totalDaysToPayment += days;
			paidCount++;
		}
	}
	const avgDaysToPayment = paidCount > 0 ? totalDaysToPayment / paidCount : 0;

	// Collection rate
	const totalInvoiced = last30Snapshots.reduce((sum, s) => sum + (s.invoices_value ?? 0), 0);
	const totalCollected = last30Snapshots.reduce((sum, s) => sum + (s.payments_value ?? 0), 0);
	const collectionRate = totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0;

	// Customer lifetime value
	const { data: customerRevenue } = await supabase
		.from("customers")
		.select("total_revenue")
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.gt("total_revenue", 0);

	const avgCustomerLifetimeValue = customerRevenue && customerRevenue.length > 0
		? customerRevenue.reduce((sum, c) => sum + (c.total_revenue ?? 0), 0) / customerRevenue.length
		: 0;

	// Customer acquisition cost (simplified - marketing spend / new customers)
	const customerAcquisitionCost = newCustomers > 0 ? 250 : 0; // Default estimate

	// LTV to CAC ratio
	const ltvToCacRatio = customerAcquisitionCost > 0
		? avgCustomerLifetimeValue / customerAcquisitionCost
		: 0;

	// First call resolution rate
	const firstCallResolutionRate = firstTimeFixRate;

	// Technician metrics
	const technicianUtilizationRate = capacityUtilizationPercent;
	const revenuePerTechCalc = activeTechnicians > 0 ? revenueTotal / activeTechnicians : 0;

	// Job profitability
	const { data: profitableJobs } = await supabase
		.from("jobs")
		.select("gross_margin_percent")
		.eq("company_id", companyId)
		.eq("status", "completed")
		.not("gross_margin_percent", "is", null)
		.gte("created_at", thirtyDaysAgo.toISOString())
		.is("deleted_at", null);

	const avgJobProfitability = profitableJobs && profitableJobs.length > 0
		? profitableJobs.reduce((sum, j) => sum + (j.gross_margin_percent ?? 0), 0) / profitableJobs.length
		: 0;

	// Service agreement revenue
	const { data: serviceAgreements } = await supabase
		.from("service_agreements")
		.select("monthly_value")
		.eq("company_id", companyId)
		.eq("status", "active");

	const serviceAgreementRevenue = (serviceAgreements ?? []).reduce(
		(sum, sa) => sum + ((sa.monthly_value ?? 0) * 12), 0
	);
	const recurringRevenuePercent = revenueTotal > 0
		? (serviceAgreementRevenue / 12 / (revenueTotal / 30) * 100)
		: 0;

	// Preventive vs reactive ratio
	const preventiveJobs = last30Snapshots.reduce((sum, s) => sum + (s.preventive_maintenance_count ?? 0), 0);
	const reactiveJobs = jobsCompleted - preventiveJobs;
	const preventiveVsReactiveRatio = reactiveJobs > 0 ? preventiveJobs / reactiveJobs : 0;

	// Calculate moving averages
	const revenue7ma = revenue7day / 7;
	const revenue30ma = revenueTotal / 30;

	// Growth calculations
	const lastMonthRevenue = recentSnapshots.slice(30, 60).reduce((sum, s) => sum + (s.total_revenue ?? 0), 0);
	const revenueGrowthMom = lastMonthRevenue > 0 ? ((revenueTotal - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

	// Customer retention (simplified)
	const churnedCustomers = last30Snapshots.reduce((sum, s) => sum + (s.churned_customers ?? 0), 0);
	const retentionRate = totalCustomers > 0 ? ((totalCustomers - churnedCustomers) / totalCustomers) * 100 : 100;

	// Calculate most common values
	const jobTypes: Record<string, number> = {};
	const leadSources: Record<string, number> = {};
	const paymentMethods: Record<string, number> = {};
	for (const s of last30Snapshots) {
		if (s.most_common_job_type) jobTypes[s.most_common_job_type] = (jobTypes[s.most_common_job_type] ?? 0) + (s.most_common_job_type_count ?? 0);
		if (s.most_common_lead_source) leadSources[s.most_common_lead_source] = (leadSources[s.most_common_lead_source] ?? 0) + (s.most_common_lead_source_count ?? 0);
		if (s.most_common_payment_method) paymentMethods[s.most_common_payment_method] = (paymentMethods[s.most_common_payment_method] ?? 0) + (s.most_common_payment_method_count ?? 0);
	}

	const topJobType = Object.entries(jobTypes).sort((a, b) => b[1] - a[1])[0];
	const topLeadSource = Object.entries(leadSources).sort((a, b) => b[1] - a[1])[0];
	const topPaymentMethod = Object.entries(paymentMethods).sort((a, b) => b[1] - a[1])[0];

	// Upsert company summary
	await supabase
		.from("analytics_company_summary")
		.upsert(
			{
				company_id: companyId,
				summary_date: summaryDate,
				period_type: "monthly",
				// Revenue
				revenue_total: revenueTotal,
				avg_job_value: Math.round(avgJobValue),
				revenue_7day_ma: Math.round(revenue7ma),
				revenue_30day_ma: Math.round(revenue30ma),
				revenue_growth_mom: revenueGrowthMom,
				// Jobs
				jobs_completed: jobsCompleted,
				jobs_created: jobsCreated,
				jobs_cancelled: jobsCancelled,
				first_time_fix_rate: firstTimeFixRate,
				callback_rate: callbackRate,
				// Estimates
				estimates_created: estimatesCreated,
				estimates_approved: estimatesApproved,
				estimates_declined: estimatesDeclined,
				estimate_win_rate: estimateWinRate,
				pipeline_value: pipelineValue,
				weighted_pipeline_value: Math.round(weightedPipeline),
				// Customers
				new_customers: newCustomers,
				total_customers: totalCustomers,
				churned_customers: churnedCustomers,
				customer_retention_rate: retentionRate,
				// Communications
				emails_sent: emailsSent,
				emails_received: emailsReceived,
				sms_sent: smsSent,
				sms_received: smsReceived,
				calls_made: callsMade,
				calls_received: callsReceived,
				total_communications: totalCommunications,
				avg_response_time_minutes: avgResponseTime,
				// Contracts
				contracts_created: contractsCreated,
				contracts_renewed: contractsRenewed,
				contracts_cancelled: contractsCancelled,
				active_contracts: activeContracts,
				contract_revenue: contractRevenue,
				contract_renewal_rate: contractRenewalRate,
				// Technicians
				active_technicians: activeTechnicians,
				utilization_rate: utilizationRate,
				jobs_per_tech_per_day: jobsPerTech / 30,
				revenue_per_tech: Math.round(revenuePerTech),
				// AR
				accounts_receivable_total: outstandingAR,
				ar_current: arCurrent,
				ar_1_30: ar1_30,
				ar_31_60: ar31_60,
				ar_61_90: ar61_90,
				ar_over_90: arOver90,
				// Mode values
				most_common_job_type: topJobType?.[0] ?? null,
				most_common_lead_source: topLeadSource?.[0] ?? null,
				most_common_payment_method: topPaymentMethod?.[0] ?? null,
				// New KPI fields
				quote_to_close_rate: quoteToCloseRate,
				avg_quote_accuracy: avgQuoteAccuracy,
				capacity_utilization_percent: capacityUtilizationPercent,
				billable_hours_ratio: billableHoursRatio,
				cash_flow_30_day_forecast: cashFlow30DayForecast,
				cash_flow_60_day_forecast: cashFlow60DayForecast,
				cash_flow_90_day_forecast: cashFlow90DayForecast,
				avg_days_to_payment: avgDaysToPayment,
				collection_rate: collectionRate,
				customer_acquisition_cost: customerAcquisitionCost,
				avg_customer_lifetime_value: avgCustomerLifetimeValue,
				ltv_to_cac_ratio: ltvToCacRatio,
				first_call_resolution_rate: firstCallResolutionRate,
				technician_utilization_rate: technicianUtilizationRate,
				revenue_per_technician: revenuePerTechCalc,
				avg_job_profitability: avgJobProfitability,
				service_agreement_revenue: serviceAgreementRevenue,
				recurring_revenue_percent: recurringRevenuePercent,
				preventive_vs_reactive_ratio: preventiveVsReactiveRatio,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "company_id,summary_date,period_type" }
		);
}
