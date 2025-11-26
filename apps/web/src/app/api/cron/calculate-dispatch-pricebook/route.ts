/**
 * Cron Job: Calculate Dispatch Efficiency, Pricebook Performance & Customer Health
 *
 * Runs daily to compute:
 * - Dispatch efficiency metrics (schedule fill rate, drive time, on-time arrival)
 * - Pricebook performance (margins, pricing effectiveness, labor efficiency)
 * - Customer health scores and churn risk
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/calculate-dispatch-pricebook",
 *     "schedule": "0 5 * * *"
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
			dispatchProcessed: boolean;
			pricebookItemsProcessed: number;
			customersProcessed: number;
			success: boolean;
			error?: string;
		}> = [];

		// Get all active companies
		const { data: companies, error: companiesError } = await supabase
			.from("companies")
			.select("id")
			.is("deleted_at", null);

		if (companiesError || !companies) {
			return NextResponse.json(
				{
					error: "Failed to fetch companies",
					details: companiesError?.message,
				},
				{ status: 500 },
			);
		}

		for (const company of companies) {
			try {
				const dispatchProcessed = await calculateDispatchEfficiency(
					supabase,
					company.id,
				);
				const pricebookItemsProcessed = await calculatePricebookPerformance(
					supabase,
					company.id,
				);
				const customersProcessed = await calculateCustomerHealth(
					supabase,
					company.id,
				);
				results.push({
					companyId: company.id,
					dispatchProcessed,
					pricebookItemsProcessed,
					customersProcessed,
					success: true,
				});
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "Unknown error";
				results.push({
					companyId: company.id,
					dispatchProcessed: false,
					pricebookItemsProcessed: 0,
					customersProcessed: 0,
					success: false,
					error: message,
				});
			}
		}

		const totalPricebook = results.reduce(
			(sum, r) => sum + r.pricebookItemsProcessed,
			0,
		);
		const totalCustomers = results.reduce(
			(sum, r) => sum + r.customersProcessed,
			0,
		);

		return NextResponse.json({
			success: true,
			totalPricebookItemsProcessed: totalPricebook,
			totalCustomersProcessed: totalCustomers,
			companiesProcessed: companies.length,
			results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ error: "Failed", details: message },
			{ status: 500 },
		);
	}
}

async function calculateDispatchEfficiency(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
): Promise<boolean> {
	const today = new Date();
	const todayStr = today.toISOString().split("T")[0];
	const startOfDay = `${todayStr}T00:00:00`;
	const endOfDay = `${todayStr}T23:59:59`;

	// Get today's appointments
	const { data: appointments } = await supabase
		.from("appointments")
		.select(`
			id, status, scheduled_start, scheduled_end, actual_start, actual_end,
			drive_time_minutes, drive_distance_miles, assigned_to,
			job:jobs(id, total_amount, priority)
		`)
		.eq("company_id", companyId)
		.gte("scheduled_start", startOfDay)
		.lte("scheduled_start", endOfDay)
		.is("deleted_at", null);

	const allAppointments = appointments || [];
	const totalJobsDispatched = allAppointments.length;

	if (totalJobsDispatched === 0) {
		// No appointments today, skip
		return false;
	}

	// Get technicians
	const { data: technicians } = await supabase
		.from("users")
		.select("id")
		.eq("company_id", companyId)
		.eq("role", "technician")
		.is("deleted_at", null);

	const activeTechnicians = technicians?.length ?? 0;
	const totalAvailableHours = activeTechnicians * 8; // Assume 8-hour workday

	// Calculate scheduled hours
	let totalScheduledMinutes = 0;
	let totalDriveTimeMinutes = 0;
	let totalDriveMiles = 0;
	let onTimeArrivals = 0;
	let lateArrivals = 0;
	let earlyArrivals = 0;
	let completedOnTime = 0;
	let completedLate = 0;
	let rescheduled = 0;

	for (const apt of allAppointments) {
		// Calculate scheduled duration
		if (apt.scheduled_start && apt.scheduled_end) {
			const start = new Date(apt.scheduled_start);
			const end = new Date(apt.scheduled_end);
			totalScheduledMinutes += (end.getTime() - start.getTime()) / 60000;
		}

		// Drive metrics
		totalDriveTimeMinutes += apt.drive_time_minutes ?? 0;
		totalDriveMiles += apt.drive_distance_miles ?? 0;

		// Arrival timing
		if (apt.actual_start && apt.scheduled_start) {
			const scheduled = new Date(apt.scheduled_start);
			const actual = new Date(apt.actual_start);
			const diffMinutes = (actual.getTime() - scheduled.getTime()) / 60000;

			if (diffMinutes <= 0) {
				earlyArrivals++;
				onTimeArrivals++;
			} else if (diffMinutes <= 15) {
				onTimeArrivals++; // Within 15 min grace period
			} else {
				lateArrivals++;
			}
		}

		// Completion status
		if (apt.status === "completed") {
			if (apt.actual_end && apt.scheduled_end) {
				const scheduledEnd = new Date(apt.scheduled_end);
				const actualEnd = new Date(apt.actual_end);
				if (actualEnd <= scheduledEnd) {
					completedOnTime++;
				} else {
					completedLate++;
				}
			}
		} else if (apt.status === "rescheduled") {
			rescheduled++;
		}
	}

	// Calculate billable hours from time entries
	const { data: timeEntries } = await supabase
		.from("time_entries")
		.select("duration_minutes, is_billable")
		.eq("company_id", companyId)
		.gte("start_time", startOfDay)
		.lte("start_time", endOfDay)
		.is("deleted_at", null);

	const totalBillableMinutes =
		timeEntries
			?.filter((t) => t.is_billable)
			?.reduce((sum, t) => sum + (t.duration_minutes ?? 0), 0) ?? 0;

	// Calculate metrics
	const totalScheduledHours = totalScheduledMinutes / 60;
	const totalBillableHours = totalBillableMinutes / 60;
	const scheduleFillRate =
		totalAvailableHours > 0
			? (totalScheduledHours / totalAvailableHours) * 100
			: 0;
	const utilizationRate =
		totalAvailableHours > 0
			? (totalBillableHours / totalAvailableHours) * 100
			: 0;

	const avgDriveTimeBetweenJobs =
		totalJobsDispatched > 1
			? totalDriveTimeMinutes / (totalJobsDispatched - 1)
			: 0;
	const avgDriveMilesBetweenJobs =
		totalJobsDispatched > 1 ? totalDriveMiles / (totalJobsDispatched - 1) : 0;

	const totalWorkMinutes = totalScheduledMinutes + totalDriveTimeMinutes;
	const driveTimeRatio =
		totalWorkMinutes > 0 ? (totalDriveTimeMinutes / totalWorkMinutes) * 100 : 0;

	const onTimeArrivalRate =
		totalJobsDispatched > 0 ? (onTimeArrivals / totalJobsDispatched) * 100 : 0;
	const earlyArrivalRate =
		totalJobsDispatched > 0 ? (earlyArrivals / totalJobsDispatched) * 100 : 0;
	const lateArrivalRate =
		totalJobsDispatched > 0 ? (lateArrivals / totalJobsDispatched) * 100 : 0;
	const rescheduleRate =
		totalJobsDispatched > 0 ? (rescheduled / totalJobsDispatched) * 100 : 0;

	const avgJobsPerTech =
		activeTechnicians > 0 ? totalJobsDispatched / activeTechnicians : 0;

	// Calculate revenue metrics
	const totalRevenue =
		allAppointments.reduce((sum, apt) => {
			const job = apt.job as { total_amount?: number } | null;
			return sum + (job?.total_amount ?? 0);
		}, 0) / 100;

	const revenuePerHour =
		totalBillableHours > 0 ? totalRevenue / totalBillableHours : 0;
	const revenuePerMile =
		totalDriveMiles > 0 ? totalRevenue / totalDriveMiles : 0;
	const avgRevenuePerTech =
		activeTechnicians > 0 ? totalRevenue / activeTechnicians : 0;

	// Upsert dispatch efficiency
	await supabase.from("analytics_dispatch_efficiency").upsert(
		{
			company_id: companyId,
			date: todayStr,
			total_available_hours: Math.round(totalAvailableHours * 100) / 100,
			total_scheduled_hours: Math.round(totalScheduledHours * 100) / 100,
			total_billable_hours: Math.round(totalBillableHours * 100) / 100,
			schedule_fill_rate: Math.round(scheduleFillRate * 100) / 100,
			utilization_rate: Math.round(utilizationRate * 100) / 100,
			total_jobs_dispatched: totalJobsDispatched,
			total_drive_time_minutes: totalDriveTimeMinutes,
			total_drive_miles: Math.round(totalDriveMiles * 100) / 100,
			avg_drive_time_between_jobs: Math.round(avgDriveTimeBetweenJobs),
			avg_drive_miles_between_jobs:
				Math.round(avgDriveMilesBetweenJobs * 100) / 100,
			drive_time_ratio: Math.round(driveTimeRatio * 100) / 100,
			on_time_arrival_rate: Math.round(onTimeArrivalRate * 100) / 100,
			early_arrival_rate: Math.round(earlyArrivalRate * 100) / 100,
			late_arrival_rate: Math.round(lateArrivalRate * 100) / 100,
			jobs_completed_on_time: completedOnTime,
			jobs_completed_late: completedLate,
			jobs_rescheduled: rescheduled,
			reschedule_rate: Math.round(rescheduleRate * 100) / 100,
			active_technicians: activeTechnicians,
			avg_jobs_per_tech: Math.round(avgJobsPerTech * 100) / 100,
			revenue_per_hour: Math.round(revenuePerHour * 100) / 100,
			revenue_per_mile: Math.round(revenuePerMile * 100) / 100,
			avg_revenue_per_tech: Math.round(avgRevenuePerTech * 100) / 100,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "company_id,date" },
	);

	return true;
}

async function calculatePricebookPerformance(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
): Promise<number> {
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const periodStart = thirtyDaysAgo.toISOString().split("T")[0];
	const periodEnd = today.toISOString().split("T")[0];

	// Get invoice items with price book references
	const { data: invoiceItems } = await supabase
		.from("invoice_items")
		.select(`
			id, quantity, unit_price, cost_price, total_price, item_type,
			price_book_item_id,
			price_book_item:price_book_items(id, name, category, unit_price, cost, item_type, target_margin_percent),
			invoice:invoices!inner(id, job_id, created_at, deleted_at)
		`)
		.eq("invoice.company_id", companyId)
		.is("invoice.deleted_at", null)
		.gte("invoice.created_at", thirtyDaysAgo.toISOString());

	if (!invoiceItems || invoiceItems.length === 0) {
		return 0;
	}

	// Group by price book item
	const itemStats: Record<
		string,
		{
			priceBookItem: {
				id: string;
				name: string;
				category: string;
				unit_price: number;
				cost: number;
				item_type: string;
				target_margin_percent: number;
			} | null;
			timesSold: number;
			totalQuantity: number;
			jobIds: Set<string>;
			prices: number[];
			costs: number[];
			totalRevenue: number;
			totalCost: number;
		}
	> = {};

	for (const item of invoiceItems) {
		const pbItem = item.price_book_item as {
			id: string;
			name: string;
			category: string;
			unit_price: number;
			cost: number;
			item_type: string;
			target_margin_percent: number;
		} | null;
		const invoice = item.invoice as { job_id: string } | null;
		const key = item.price_book_item_id || `custom_${item.item_type}`;

		if (!itemStats[key]) {
			itemStats[key] = {
				priceBookItem: pbItem,
				timesSold: 0,
				totalQuantity: 0,
				jobIds: new Set(),
				prices: [],
				costs: [],
				totalRevenue: 0,
				totalCost: 0,
			};
		}

		itemStats[key].timesSold++;
		itemStats[key].totalQuantity += item.quantity ?? 1;
		if (invoice?.job_id) itemStats[key].jobIds.add(invoice.job_id);
		if (item.unit_price) itemStats[key].prices.push(item.unit_price);
		if (item.cost_price) itemStats[key].costs.push(item.cost_price);
		itemStats[key].totalRevenue += (item.total_price ?? 0) / 100;
		itemStats[key].totalCost +=
			((item.cost_price ?? 0) * (item.quantity ?? 1)) / 100;
	}

	let processedCount = 0;

	for (const [key, stats] of Object.entries(itemStats)) {
		const pbItem = stats.priceBookItem;
		const avgPrice =
			stats.prices.length > 0
				? stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length / 100
				: 0;
		const minPrice =
			stats.prices.length > 0 ? Math.min(...stats.prices) / 100 : 0;
		const maxPrice =
			stats.prices.length > 0 ? Math.max(...stats.prices) / 100 : 0;

		const listPrice = (pbItem?.unit_price ?? 0) / 100;
		const priceVariance =
			listPrice > 0 ? ((avgPrice - listPrice) / listPrice) * 100 : 0;
		const discountRate =
			listPrice > 0 && avgPrice < listPrice
				? ((listPrice - avgPrice) / listPrice) * 100
				: 0;

		const totalProfit = stats.totalRevenue - stats.totalCost;
		const grossMargin =
			stats.totalRevenue > 0 ? (totalProfit / stats.totalRevenue) * 100 : 0;
		const markup =
			stats.totalCost > 0 ? (totalProfit / stats.totalCost) * 100 : 0;

		const targetMargin = pbItem?.target_margin_percent ?? 30;
		const marginVsTarget = grossMargin - targetMargin;
		const marginAlert = grossMargin < targetMargin - 10;

		// Determine trends and recommendations
		const salesTrend = "stable";
		let marginTrend = "stable";
		let priceRecommendation = "maintain";

		if (marginAlert) {
			priceRecommendation = "increase";
			marginTrend = "declining";
		} else if (grossMargin > targetMargin + 10) {
			marginTrend = "improving";
		}

		const demandScore = Math.min(Math.round((stats.timesSold / 30) * 100), 100);

		await supabase.from("analytics_pricebook_performance").upsert(
			{
				company_id: companyId,
				period_start: periodStart,
				period_end: periodEnd,
				price_book_item_id: pbItem?.id || null,
				item_name: pbItem?.name || `Custom ${key}`,
				item_category: pbItem?.category || "uncategorized",
				item_type: pbItem?.item_type || "service",
				times_sold: stats.timesSold,
				total_quantity_sold: Math.round(stats.totalQuantity * 100) / 100,
				unique_jobs_used: stats.jobIds.size,
				list_price: Math.round(listPrice * 100) / 100,
				avg_sold_price: Math.round(avgPrice * 100) / 100,
				min_sold_price: Math.round(minPrice * 100) / 100,
				max_sold_price: Math.round(maxPrice * 100) / 100,
				price_variance_percent: Math.round(priceVariance * 100) / 100,
				discount_rate: Math.round(discountRate * 100) / 100,
				total_cost: Math.round(stats.totalCost * 100) / 100,
				total_revenue: Math.round(stats.totalRevenue * 100) / 100,
				total_profit: Math.round(totalProfit * 100) / 100,
				gross_margin_percent: Math.round(grossMargin * 100) / 100,
				markup_percent: Math.round(markup * 100) / 100,
				target_margin_percent: targetMargin,
				margin_vs_target: Math.round(marginVsTarget * 100) / 100,
				sales_trend: salesTrend,
				margin_trend: marginTrend,
				demand_score: demandScore,
				price_recommendation: priceRecommendation,
				margin_alert: marginAlert,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "company_id,period_start,period_end,price_book_item_id" },
		);

		processedCount++;
	}

	return processedCount;
}

async function calculateCustomerHealth(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
): Promise<number> {
	const today = new Date();
	const todayStr = today.toISOString().split("T")[0];
	const oneYearAgo = new Date(today);
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

	// Get customers with their job history
	const { data: customers } = await supabase
		.from("customers")
		.select(`
			id, created_at, customer_type, lifetime_value, total_jobs,
			last_service_date, avg_days_between_jobs, churn_risk,
			has_active_contract, contract_end_date
		`)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.limit(500); // Process in batches

	if (!customers || customers.length === 0) {
		return 0;
	}

	let processedCount = 0;

	for (const customer of customers) {
		try {
			// Get recent jobs
			const { data: jobs } = await supabase
				.from("jobs")
				.select("id, total_amount, created_at, status")
				.eq("customer_id", customer.id)
				.is("deleted_at", null)
				.order("created_at", { ascending: false })
				.limit(50);

			const allJobs = jobs || [];
			const jobs12m = allJobs.filter(
				(j) => new Date(j.created_at) >= oneYearAgo,
			);

			// Calculate days since last service
			const daysSinceLastService = customer.last_service_date
				? Math.floor(
						(today.getTime() - new Date(customer.last_service_date).getTime()) /
							(1000 * 60 * 60 * 24),
					)
				: 365;

			// Get recent communications
			const { data: comms } = await supabase
				.from("communications")
				.select("id, created_at, direction")
				.eq("customer_id", customer.id)
				.gte(
					"created_at",
					new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
				)
				.is("deleted_at", null);

			const interactions90d = comms?.length ?? 0;
			const interactions30d =
				comms?.filter(
					(c) =>
						new Date(c.created_at) >=
						new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
				)?.length ?? 0;

			const daysSinceLastContact =
				comms && comms.length > 0
					? Math.floor(
							(today.getTime() - new Date(comms[0].created_at).getTime()) /
								(1000 * 60 * 60 * 24),
						)
					: 180;

			// Get outstanding invoices
			const { data: invoices } = await supabase
				.from("invoices")
				.select("balance_amount, due_date, status")
				.eq("customer_id", customer.id)
				.not("status", "in", '("paid", "void")')
				.is("deleted_at", null);

			const outstandingBalance =
				invoices?.reduce((sum, inv) => sum + (inv.balance_amount ?? 0), 0) /
					100 ?? 0;
			const hasOverdueInvoices =
				invoices?.some(
					(inv) => inv.due_date && new Date(inv.due_date) < today,
				) ?? false;

			// Calculate revenue metrics
			const totalJobsLifetime = customer.total_jobs ?? allJobs.length;
			const totalJobs12m = jobs12m.length;
			const totalRevenueLifetime = (customer.lifetime_value ?? 0) / 100;
			const totalRevenue12m =
				jobs12m.reduce((sum, j) => sum + (j.total_amount ?? 0), 0) / 100;
			const avgJobValue =
				totalJobsLifetime > 0 ? totalRevenueLifetime / totalJobsLifetime : 0;
			const avgDaysBetweenJobs = customer.avg_days_between_jobs ?? 180;

			// Calculate health score (0-100)
			let healthScore = 50; // Start at neutral

			// Recency factor (max 25 points)
			if (daysSinceLastService <= 90) healthScore += 25;
			else if (daysSinceLastService <= 180) healthScore += 15;
			else if (daysSinceLastService <= 365) healthScore += 5;
			else healthScore -= 10;

			// Engagement factor (max 15 points)
			if (interactions90d >= 5) healthScore += 15;
			else if (interactions90d >= 2) healthScore += 10;
			else if (interactions90d >= 1) healthScore += 5;

			// Transaction factor (max 20 points)
			if (totalJobs12m >= 3) healthScore += 20;
			else if (totalJobs12m >= 2) healthScore += 15;
			else if (totalJobs12m >= 1) healthScore += 10;

			// Contract factor (max 15 points)
			if (customer.has_active_contract) healthScore += 15;

			// Payment factor (max 10 points, can go negative)
			if (!hasOverdueInvoices && outstandingBalance === 0) healthScore += 10;
			else if (hasOverdueInvoices) healthScore -= 10;

			// Value factor (max 15 points)
			if (avgJobValue >= 500) healthScore += 15;
			else if (avgJobValue >= 200) healthScore += 10;
			else if (avgJobValue >= 100) healthScore += 5;

			// Clamp to 0-100
			healthScore = Math.max(0, Math.min(100, healthScore));

			// Determine health status
			let healthStatus = "healthy";
			if (healthScore < 30) healthStatus = "critical";
			else if (healthScore < 50) healthStatus = "at_risk";
			else if (healthScore < 70) healthStatus = "healthy";
			else healthStatus = "healthy";

			// Calculate churn probability
			const churnProbability = Math.max(
				0,
				Math.min(1, (100 - healthScore) / 100),
			);
			let churnRiskLevel = "low";
			if (churnProbability >= 0.7) churnRiskLevel = "critical";
			else if (churnProbability >= 0.5) churnRiskLevel = "high";
			else if (churnProbability >= 0.3) churnRiskLevel = "medium";

			// Determine segment
			let customerSegment = "regular";
			if (healthScore >= 80 && avgJobValue >= 300) customerSegment = "vip";
			else if (healthScore >= 70) customerSegment = "loyal";
			else if (daysSinceLastService > 365) customerSegment = "dormant";
			else if (daysSinceLastService > 180) customerSegment = "occasional";

			let valueSegment = "medium";
			if (totalRevenueLifetime >= 5000) valueSegment = "high";
			else if (totalRevenueLifetime < 500) valueSegment = "low";

			// Calculate upsell score
			let upsellScore = 50;
			if (healthScore >= 70) upsellScore += 20;
			if (!customer.has_active_contract) upsellScore += 15;
			if (avgJobValue < 300) upsellScore += 10;
			upsellScore = Math.min(100, upsellScore);

			// Recommended action
			let recommendedAction = "maintain_relationship";
			let actionPriority = "low";
			if (churnRiskLevel === "critical") {
				recommendedAction = "urgent_outreach";
				actionPriority = "urgent";
			} else if (churnRiskLevel === "high") {
				recommendedAction = "schedule_check_in";
				actionPriority = "high";
			} else if (upsellScore >= 70) {
				recommendedAction = "present_service_agreement";
				actionPriority = "medium";
			} else if (daysSinceLastService > 180) {
				recommendedAction = "send_reminder";
				actionPriority = "medium";
			}

			await supabase.from("analytics_customer_health").upsert(
				{
					company_id: companyId,
					customer_id: customer.id,
					analysis_date: todayStr,
					health_score: healthScore,
					health_status: healthStatus,
					days_since_last_service: daysSinceLastService,
					days_since_last_contact: daysSinceLastContact,
					total_interactions_30d: interactions30d,
					total_interactions_90d: interactions90d,
					total_jobs_lifetime: totalJobsLifetime,
					total_jobs_12m: totalJobs12m,
					total_revenue_lifetime: Math.round(totalRevenueLifetime * 100) / 100,
					total_revenue_12m: Math.round(totalRevenue12m * 100) / 100,
					avg_job_value: Math.round(avgJobValue * 100) / 100,
					avg_days_between_jobs: avgDaysBetweenJobs,
					outstanding_balance: Math.round(outstandingBalance * 100) / 100,
					has_overdue_invoices: hasOverdueInvoices,
					is_recurring_customer: totalJobsLifetime >= 2,
					has_service_agreement: customer.has_active_contract ?? false,
					churn_probability: Math.round(churnProbability * 10000) / 10000,
					churn_risk_level: churnRiskLevel,
					upsell_score: upsellScore,
					current_ltv: Math.round(totalRevenueLifetime * 100) / 100,
					customer_segment: customerSegment,
					value_segment: valueSegment,
					recommended_action: recommendedAction,
					recommended_action_priority: actionPriority,
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "company_id,customer_id,analysis_date" },
			);

			processedCount++;
		} catch {}
	}

	return processedCount;
}
