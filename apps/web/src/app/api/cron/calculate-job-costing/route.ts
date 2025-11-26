/**
 * Cron Job: Calculate Job Costing
 *
 * Runs daily to compute job costs, profitability, and budget variance.
 * Calculates labor costs from time entries, material costs from invoices,
 * and updates job costing fields.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/calculate-job-costing",
 *     "schedule": "0 3 * * *"
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
			jobsProcessed: number;
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
				const jobsProcessed = await calculateJobCostingForCompany(
					supabase,
					company.id,
				);
				results.push({ companyId: company.id, jobsProcessed, success: true });
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "Unknown error";
				results.push({
					companyId: company.id,
					jobsProcessed: 0,
					success: false,
					error: message,
				});
			}
		}

		const totalProcessed = results.reduce((sum, r) => sum + r.jobsProcessed, 0);

		return NextResponse.json({
			success: true,
			totalJobsProcessed: totalProcessed,
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

async function calculateJobCostingForCompany(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
): Promise<number> {
	// Get jobs that need costing calculation (completed in last 90 days or in progress)
	const ninetyDaysAgo = new Date();
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

	const { data: jobs, error: jobsError } = await supabase
		.from("jobs")
		.select(`
			id,
			status,
			total_amount,
			labor_cost_estimated,
			materials_cost_estimated,
			equipment_cost_estimated,
			total_cost_estimated,
			created_at
		`)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.or(`status.eq.completed,status.eq.in_progress`)
		.gte("created_at", ninetyDaysAgo.toISOString());

	if (jobsError || !jobs) {
		throw new Error(`Failed to fetch jobs: ${jobsError?.message}`);
	}

	// Get company's default labor rate and overhead rate
	const { data: companySettings } = await supabase
		.from("companies")
		.select("settings")
		.eq("id", companyId)
		.single();

	const laborRate = companySettings?.settings?.defaultLaborRate ?? 75;
	const overheadRate = companySettings?.settings?.overheadRate ?? 0.15; // 15% overhead
	const driveCostPerMile = companySettings?.settings?.driveCostPerMile ?? 0.67;

	let processedCount = 0;

	for (const job of jobs) {
		try {
			// Calculate labor costs from time entries
			const { data: timeEntries } = await supabase
				.from("time_entries")
				.select("duration_minutes, hourly_rate")
				.eq("job_id", job.id)
				.is("deleted_at", null);

			let laborCostActual = 0;
			let totalLaborMinutes = 0;
			for (const entry of timeEntries ?? []) {
				const hours = (entry.duration_minutes ?? 0) / 60;
				const rate = entry.hourly_rate ?? laborRate;
				laborCostActual += hours * rate;
				totalLaborMinutes += entry.duration_minutes ?? 0;
			}

			// Calculate materials cost from invoice line items
			const { data: invoiceItems } = await supabase
				.from("invoice_items")
				.select(`
					quantity,
					unit_price,
					cost_price,
					item_type,
					invoice:invoices!inner(job_id, deleted_at)
				`)
				.eq("invoice.job_id", job.id)
				.is("invoice.deleted_at", null);

			let materialsCostActual = 0;
			let equipmentCostActual = 0;
			for (const item of invoiceItems ?? []) {
				const itemCost =
					(item.cost_price ?? item.unit_price ?? 0) * (item.quantity ?? 1);
				if (item.item_type === "equipment" || item.item_type === "rental") {
					equipmentCostActual += itemCost;
				} else {
					materialsCostActual += itemCost;
				}
			}

			// Calculate drive time cost (if we have distance data)
			const { data: appointments } = await supabase
				.from("appointments")
				.select("drive_distance_miles, drive_time_minutes")
				.eq("job_id", job.id)
				.is("deleted_at", null);

			let driveTimeMinutes = 0;
			let driveTimeCost = 0;
			for (const apt of appointments ?? []) {
				driveTimeMinutes += apt.drive_time_minutes ?? 0;
				driveTimeCost += (apt.drive_distance_miles ?? 0) * driveCostPerMile;
			}

			// Calculate totals
			const totalCostActual =
				laborCostActual +
				materialsCostActual +
				equipmentCostActual +
				driveTimeCost;
			const overheadCost = totalCostActual * overheadRate;
			const totalCostWithOverhead = totalCostActual + overheadCost;

			// Calculate profits
			const revenue = job.total_amount ?? 0;
			const profitActual = revenue - totalCostWithOverhead;
			const profitEstimated = revenue - (job.total_cost_estimated ?? 0);

			// Calculate variance
			const estimatedCost = job.total_cost_estimated ?? totalCostActual;
			const costVariancePercent =
				estimatedCost > 0
					? ((totalCostActual - estimatedCost) / estimatedCost) * 100
					: 0;
			const profitVarianceAmount = profitActual - profitEstimated;

			// Determine budget status
			let budgetStatus: "under_budget" | "on_budget" | "over_budget" =
				"on_budget";
			if (costVariancePercent < -5) budgetStatus = "under_budget";
			else if (costVariancePercent > 5) budgetStatus = "over_budget";

			// Calculate gross margin
			const grossMarginPercent =
				revenue > 0 ? (profitActual / revenue) * 100 : 0;

			// Update job with costing data
			await supabase
				.from("jobs")
				.update({
					labor_cost_actual: Math.round(laborCostActual * 100) / 100,
					materials_cost_actual: Math.round(materialsCostActual * 100) / 100,
					equipment_cost_actual: Math.round(equipmentCostActual * 100) / 100,
					total_cost_actual: Math.round(totalCostActual * 100) / 100,
					overhead_cost: Math.round(overheadCost * 100) / 100,
					drive_time_minutes: driveTimeMinutes,
					drive_time_cost: Math.round(driveTimeCost * 100) / 100,
					cost_variance_percent: Math.round(costVariancePercent * 100) / 100,
					profit_estimated: Math.round(profitEstimated * 100) / 100,
					profit_actual: Math.round(profitActual * 100) / 100,
					profit_variance_amount: Math.round(profitVarianceAmount * 100) / 100,
					budget_status: budgetStatus,
					gross_margin_percent: Math.round(grossMarginPercent * 100) / 100,
					updated_at: new Date().toISOString(),
				})
				.eq("id", job.id);

			processedCount++;
		} catch {}
	}

	// Update technician metrics with job profitability
	await updateTechnicianJobMetrics(supabase, companyId);

	return processedCount;
}

async function updateTechnicianJobMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
) {
	// Get period dates
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const periodStart = thirtyDaysAgo.toISOString().split("T")[0];
	const periodEnd = today.toISOString().split("T")[0];

	// Get technicians with their job assignments
	const { data: technicians } = await supabase
		.from("users")
		.select("id, first_name, last_name")
		.eq("company_id", companyId)
		.eq("role", "technician")
		.is("deleted_at", null);

	if (!technicians) return;

	for (const tech of technicians) {
		// Get jobs assigned to this technician
		const { data: assignedJobs } = await supabase
			.from("job_assignments")
			.select(`
				job:jobs!inner(
					id,
					total_amount,
					total_cost_actual,
					profit_actual,
					gross_margin_percent,
					status,
					created_at
				)
			`)
			.eq("user_id", tech.id)
			.eq("job.company_id", companyId)
			.eq("job.status", "completed")
			.gte("job.created_at", thirtyDaysAgo.toISOString());

		const jobs = (assignedJobs ?? []).map((a) => a.job).filter(Boolean);
		const jobCount = jobs.length;

		if (jobCount === 0) continue;

		const totalRevenue = jobs.reduce(
			(sum, j) => sum + (j?.total_amount ?? 0),
			0,
		);
		const totalCost = jobs.reduce(
			(sum, j) => sum + (j?.total_cost_actual ?? 0),
			0,
		);
		const totalProfit = jobs.reduce(
			(sum, j) => sum + (j?.profit_actual ?? 0),
			0,
		);
		const avgJobValue = totalRevenue / jobCount;
		const avgJobProfit = totalProfit / jobCount;
		const profitMarginPercent =
			totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

		// Upsert technician metrics
		await supabase.from("analytics_technician_metrics").upsert(
			{
				company_id: companyId,
				user_id: tech.id,
				period_start: periodStart,
				period_end: periodEnd,
				name: `${tech.first_name} ${tech.last_name}`.trim(),
				jobs_completed: jobCount,
				total_revenue: Math.round(totalRevenue * 100) / 100,
				avg_job_value: Math.round(avgJobValue * 100) / 100,
				avg_job_profit: Math.round(avgJobProfit * 100) / 100,
				profit_margin_percent: Math.round(profitMarginPercent * 100) / 100,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "company_id,user_id,period_start" },
		);
	}
}
