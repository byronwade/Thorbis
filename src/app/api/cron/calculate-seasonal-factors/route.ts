/**
 * Cron Job: Calculate Seasonal Factors
 *
 * Runs monthly to compute demand patterns by hour, day, and month.
 * Used for forecasting and scheduling optimization.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/calculate-seasonal-factors",
 *     "schedule": "0 5 1 * *"
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

		const analysisDate = new Date().toISOString().split("T")[0];

		for (const company of companies) {
			try {
				await calculateSeasonalFactors(supabase, company.id, analysisDate);
				results.push({ companyId: company.id, success: true });
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : "Unknown error";
				results.push({ companyId: company.id, success: false, error: message });
			}
		}

		return NextResponse.json({
			success: true,
			analysisDate,
			processed: companies.length,
			results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: "Failed", details: message }, { status: 500 });
	}
}

async function calculateSeasonalFactors(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	analysisDate: string,
) {
	// Get last 12 months of job data for seasonal analysis
	const oneYearAgo = new Date(analysisDate);
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

	const { data: jobs } = await supabase
		.from("jobs")
		.select("id, scheduled_start, total_revenue, job_type, status")
		.eq("company_id", companyId)
		.gte("scheduled_start", oneYearAgo.toISOString())
		.is("deleted_at", null);

	if (!jobs || jobs.length === 0) return;

	// Calculate average for baseline
	const totalJobs = jobs.length;
	const totalRevenue = jobs.reduce((sum, j) => sum + (j.total_revenue ?? 0), 0);
	const avgJobsPerMonth = totalJobs / 12;
	const avgRevenuePerMonth = totalRevenue / 12;

	// Group by month
	const byMonth: Record<number, { jobs: number; revenue: number }> = {};
	// Group by day of week
	const byDayOfWeek: Record<number, { jobs: number; revenue: number }> = {};
	// Group by hour
	const byHour: Record<number, { jobs: number; revenue: number }> = {};

	for (let i = 0; i < 12; i++) byMonth[i] = { jobs: 0, revenue: 0 };
	for (let i = 0; i < 7; i++) byDayOfWeek[i] = { jobs: 0, revenue: 0 };
	for (let i = 0; i < 24; i++) byHour[i] = { jobs: 0, revenue: 0 };

	for (const job of jobs) {
		if (!job.scheduled_start) continue;
		const date = new Date(job.scheduled_start);
		const month = date.getMonth();
		const dayOfWeek = date.getDay();
		const hour = date.getHours();
		const revenue = job.total_revenue ?? 0;

		byMonth[month].jobs++;
		byMonth[month].revenue += revenue;
		byDayOfWeek[dayOfWeek].jobs++;
		byDayOfWeek[dayOfWeek].revenue += revenue;
		byHour[hour].jobs++;
		byHour[hour].revenue += revenue;
	}

	// Calculate factors and upsert
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	// Monthly factors
	for (let month = 0; month < 12; month++) {
		const data = byMonth[month];
		const demandFactor = avgJobsPerMonth > 0 ? data.jobs / avgJobsPerMonth : 1;
		const revenueFactor = avgRevenuePerMonth > 0 ? data.revenue / avgRevenuePerMonth : 1;

		await supabase
			.from("analytics_seasonal_factors")
			.upsert(
				{
					company_id: companyId,
					analysis_date: analysisDate,
					period_type: "month",
					period_value: month + 1,
					period_name: monthNames[month],
					demand_factor: demandFactor,
					revenue_factor: revenueFactor,
					job_count: data.jobs,
					revenue_total: data.revenue,
					avg_job_value: data.jobs > 0 ? Math.round(data.revenue / data.jobs) : 0,
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "company_id,analysis_date,period_type,period_value" }
			);
	}

	// Day of week factors
	const avgJobsPerDay = totalJobs / 7;
	const avgRevenuePerDay = totalRevenue / 7;

	for (let day = 0; day < 7; day++) {
		const data = byDayOfWeek[day];
		const demandFactor = avgJobsPerDay > 0 ? (data.jobs / (totalJobs / 7 * 52)) * 52 : 1;
		const revenueFactor = avgRevenuePerDay > 0 ? (data.revenue / (totalRevenue / 7)) : 1;

		await supabase
			.from("analytics_seasonal_factors")
			.upsert(
				{
					company_id: companyId,
					analysis_date: analysisDate,
					period_type: "day_of_week",
					period_value: day,
					period_name: dayNames[day],
					demand_factor: demandFactor,
					revenue_factor: revenueFactor,
					job_count: data.jobs,
					revenue_total: data.revenue,
					avg_job_value: data.jobs > 0 ? Math.round(data.revenue / data.jobs) : 0,
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "company_id,analysis_date,period_type,period_value" }
			);
	}

	// Hourly factors
	const avgJobsPerHour = totalJobs / 24;

	for (let hour = 0; hour < 24; hour++) {
		const data = byHour[hour];
		const demandFactor = avgJobsPerHour > 0 ? data.jobs / avgJobsPerHour : 0;

		await supabase
			.from("analytics_seasonal_factors")
			.upsert(
				{
					company_id: companyId,
					analysis_date: analysisDate,
					period_type: "hour",
					period_value: hour,
					period_name: `${hour.toString().padStart(2, "0")}:00`,
					demand_factor: demandFactor,
					job_count: data.jobs,
					revenue_total: data.revenue,
					avg_job_value: data.jobs > 0 ? Math.round(data.revenue / data.jobs) : 0,
					updated_at: new Date().toISOString(),
				},
				{ onConflict: "company_id,analysis_date,period_type,period_value" }
			);
	}

	// Find peak periods
	const peakMonth = Object.entries(byMonth).sort((a, b) => b[1].jobs - a[1].jobs)[0];
	const slowMonth = Object.entries(byMonth).sort((a, b) => a[1].jobs - b[1].jobs)[0];
	const peakDay = Object.entries(byDayOfWeek).sort((a, b) => b[1].jobs - a[1].jobs)[0];
	const peakHour = Object.entries(byHour).sort((a, b) => b[1].jobs - a[1].jobs)[0];

	// Store summary record
	await supabase
		.from("analytics_seasonal_factors")
		.upsert(
			{
				company_id: companyId,
				analysis_date: analysisDate,
				period_type: "summary",
				period_value: 0,
				period_name: "Annual Summary",
				demand_factor: 1,
				job_count: totalJobs,
				revenue_total: totalRevenue,
				avg_job_value: totalJobs > 0 ? Math.round(totalRevenue / totalJobs) : 0,
				peak_month: parseInt(peakMonth[0]) + 1,
				slow_month: parseInt(slowMonth[0]) + 1,
				peak_day_of_week: parseInt(peakDay[0]),
				peak_hour: parseInt(peakHour[0]),
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "company_id,analysis_date,period_type,period_value" }
		);
}
