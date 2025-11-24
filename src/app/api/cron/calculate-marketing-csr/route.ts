/**
 * Cron Job: Calculate Marketing ROI & CSR Metrics
 *
 * Runs daily to compute marketing campaign performance, ROI,
 * and CSR (Customer Service Representative) scorecards.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/calculate-marketing-csr",
 *     "schedule": "0 4 * * *"
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
		const results: Array<{
			companyId: string;
			campaignsProcessed: number;
			csrsProcessed: number;
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
				{ error: "Failed to fetch companies", details: companiesError?.message },
				{ status: 500 },
			);
		}

		for (const company of companies) {
			try {
				const campaignsProcessed = await calculateMarketingROI(supabase, company.id);
				const csrsProcessed = await calculateCSRMetrics(supabase, company.id);
				results.push({ companyId: company.id, campaignsProcessed, csrsProcessed, success: true });
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : "Unknown error";
				results.push({ companyId: company.id, campaignsProcessed: 0, csrsProcessed: 0, success: false, error: message });
			}
		}

		const totalCampaigns = results.reduce((sum, r) => sum + r.campaignsProcessed, 0);
		const totalCSRs = results.reduce((sum, r) => sum + r.csrsProcessed, 0);

		return NextResponse.json({
			success: true,
			totalCampaignsProcessed: totalCampaigns,
			totalCSRsProcessed: totalCSRs,
			companiesProcessed: companies.length,
			results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: "Failed", details: message }, { status: 500 });
	}
}

async function calculateMarketingROI(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
): Promise<number> {
	const today = new Date();
	const todayStr = today.toISOString().split("T")[0];

	// Get active campaigns
	const { data: campaigns, error: campaignsError } = await supabase
		.from("marketing_campaigns")
		.select("*")
		.eq("company_id", companyId)
		.in("status", ["active", "completed"])
		.is("deleted_at", null);

	if (campaignsError || !campaigns) {
		throw new Error(`Failed to fetch campaigns: ${campaignsError?.message}`);
	}

	let processedCount = 0;

	for (const campaign of campaigns) {
		try {
			// Get call tracking data for this campaign
			const { data: calls } = await supabase
				.from("marketing_call_tracking")
				.select("*")
				.eq("campaign_id", campaign.id);

			const totalCalls = calls?.length ?? 0;
			const answeredCalls = calls?.filter(c => c.answered)?.length ?? 0;
			const bookedJobs = calls?.filter(c => c.booked_job)?.length ?? 0;
			const totalLeads = calls?.filter(c => c.call_outcome !== "spam" && c.call_outcome !== "wrong_number")?.length ?? 0;

			// Calculate attributed revenue from booked jobs
			const jobIds = calls?.filter(c => c.job_id).map(c => c.job_id) ?? [];
			let totalRevenue = 0;
			let totalProfit = 0;

			if (jobIds.length > 0) {
				const { data: jobs } = await supabase
					.from("jobs")
					.select("total_amount, profit_actual")
					.in("id", jobIds);

				totalRevenue = jobs?.reduce((sum, j) => sum + (j.total_amount ?? 0), 0) ?? 0;
				totalProfit = jobs?.reduce((sum, j) => sum + (j.profit_actual ?? 0), 0) ?? 0;
			}

			// Calculate ROI metrics
			const spend = campaign.actual_spend ?? 0;
			const costPerLead = totalLeads > 0 ? spend / totalLeads : 0;
			const costPerAcquisition = bookedJobs > 0 ? spend / bookedJobs : 0;
			const roas = spend > 0 ? totalRevenue / spend : 0;
			const roiPercent = spend > 0 ? ((totalRevenue - spend) / spend) * 100 : 0;

			// Update campaign with calculated metrics
			await supabase
				.from("marketing_campaigns")
				.update({
					total_leads: totalLeads,
					total_calls: totalCalls,
					total_booked_jobs: bookedJobs,
					total_revenue: Math.round(totalRevenue * 100) / 100,
					total_profit: Math.round(totalProfit * 100) / 100,
					cost_per_lead: Math.round(costPerLead * 100) / 100,
					cost_per_acquisition: Math.round(costPerAcquisition * 100) / 100,
					return_on_ad_spend: Math.round(roas * 100) / 100,
					roi_percent: Math.round(roiPercent * 100) / 100,
					updated_at: new Date().toISOString(),
				})
				.eq("id", campaign.id);

			// Upsert daily attribution record
			const bookingRate = totalLeads > 0 ? (bookedJobs / totalLeads) * 100 : 0;
			const callAnswerRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0;

			await supabase
				.from("analytics_marketing_attribution")
				.upsert({
					company_id: companyId,
					date: todayStr,
					campaign_id: campaign.id,
					channel: campaign.channel,
					lead_source: campaign.utm_source ?? campaign.channel,
					daily_spend: spend,
					cumulative_spend: spend,
					total_calls: totalCalls,
					answered_calls: answeredCalls,
					call_answer_rate: Math.round(callAnswerRate * 100) / 100,
					total_leads: totalLeads,
					booked_appointments: bookedJobs,
					booking_rate: Math.round(bookingRate * 100) / 100,
					total_revenue: Math.round(totalRevenue * 100) / 100,
					total_profit: Math.round(totalProfit * 100) / 100,
					cost_per_lead: Math.round(costPerLead * 100) / 100,
					cost_per_acquisition: Math.round(costPerAcquisition * 100) / 100,
					return_on_ad_spend: Math.round(roas * 100) / 100,
					roi_percent: Math.round(roiPercent * 100) / 100,
					updated_at: new Date().toISOString(),
				}, { onConflict: "company_id,date,campaign_id,channel,lead_source" });

			processedCount++;
		} catch {
			// Continue processing other campaigns
			continue;
		}
	}

	// Calculate channel-level aggregations
	await calculateChannelAttribution(supabase, companyId, todayStr);

	return processedCount;
}

async function calculateChannelAttribution(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
	dateStr: string,
): Promise<void> {
	// Get all calls for today grouped by channel
	const { data: calls } = await supabase
		.from("marketing_call_tracking")
		.select(`
			*,
			campaign:marketing_campaigns(channel, utm_source)
		`)
		.eq("company_id", companyId)
		.gte("call_start", `${dateStr}T00:00:00`)
		.lt("call_start", `${dateStr}T23:59:59`);

	if (!calls || calls.length === 0) return;

	// Group by channel
	const channelData: Record<string, {
		calls: number;
		answered: number;
		booked: number;
		revenue: number;
	}> = {};

	for (const call of calls) {
		const channel = call.campaign?.channel ?? "organic";
		if (!channelData[channel]) {
			channelData[channel] = { calls: 0, answered: 0, booked: 0, revenue: 0 };
		}
		channelData[channel].calls++;
		if (call.answered) channelData[channel].answered++;
		if (call.booked_job) channelData[channel].booked++;
		channelData[channel].revenue += call.attributed_revenue ?? 0;
	}

	// Upsert channel-level attribution
	for (const [channel, data] of Object.entries(channelData)) {
		const callAnswerRate = data.calls > 0 ? (data.answered / data.calls) * 100 : 0;
		const bookingRate = data.calls > 0 ? (data.booked / data.calls) * 100 : 0;

		await supabase
			.from("analytics_marketing_attribution")
			.upsert({
				company_id: companyId,
				date: dateStr,
				campaign_id: null,
				channel: channel,
				lead_source: channel,
				total_calls: data.calls,
				answered_calls: data.answered,
				call_answer_rate: Math.round(callAnswerRate * 100) / 100,
				total_leads: data.calls,
				booked_appointments: data.booked,
				booking_rate: Math.round(bookingRate * 100) / 100,
				total_revenue: Math.round(data.revenue * 100) / 100,
				updated_at: new Date().toISOString(),
			}, { onConflict: "company_id,date,campaign_id,channel,lead_source" });
	}
}

async function calculateCSRMetrics(
	supabase: ReturnType<typeof createServiceSupabaseClient>,
	companyId: string,
): Promise<number> {
	const today = new Date();
	const todayStr = today.toISOString().split("T")[0];
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const periodStart = thirtyDaysAgo.toISOString().split("T")[0];

	// Get CSR users (office staff, admins, dispatchers who take calls)
	const { data: csrUsers } = await supabase
		.from("users")
		.select("id, first_name, last_name, role")
		.eq("company_id", companyId)
		.in("role", ["admin", "office_staff", "dispatcher", "csr"])
		.is("deleted_at", null);

	if (!csrUsers || csrUsers.length === 0) return 0;

	let processedCount = 0;
	const csrMetrics: Array<{
		userId: string;
		name: string;
		bookingRate: number;
		revenue: number;
		callVolume: number;
		performanceScore: number;
	}> = [];

	for (const csr of csrUsers) {
		try {
			// Get calls answered by this CSR in the period
			const { data: calls } = await supabase
				.from("marketing_call_tracking")
				.select("*")
				.eq("answered_by_user_id", csr.id)
				.gte("call_start", thirtyDaysAgo.toISOString());

			const totalCallsAnswered = calls?.length ?? 0;
			const missedCalls = calls?.filter(c => c.missed_call)?.length ?? 0;
			const totalCalls = totalCallsAnswered + missedCalls;
			const callAnswerRate = totalCalls > 0 ? (totalCallsAnswered / totalCalls) * 100 : 0;

			// Calculate booking metrics
			const opportunities = calls?.filter(c =>
				c.call_outcome !== "spam" &&
				c.call_outcome !== "wrong_number" &&
				c.call_outcome !== "voicemail"
			)?.length ?? 0;
			const jobsBooked = calls?.filter(c => c.booked_job)?.length ?? 0;
			const bookingRate = opportunities > 0 ? (jobsBooked / opportunities) * 100 : 0;

			// Calculate revenue attribution
			const bookedRevenue = calls?.reduce((sum, c) => sum + (c.attributed_revenue ?? 0), 0) ?? 0;
			const avgBookedTicket = jobsBooked > 0 ? bookedRevenue / jobsBooked : 0;
			const revenuePerCall = totalCallsAnswered > 0 ? bookedRevenue / totalCallsAnswered : 0;

			// Calculate timing metrics
			const avgTalkTime = calls && calls.length > 0
				? calls.reduce((sum, c) => sum + (c.talk_time_seconds ?? 0), 0) / calls.length
				: 0;
			const avgRingTime = calls && calls.length > 0
				? calls.reduce((sum, c) => sum + (c.ring_time_seconds ?? 0), 0) / calls.length
				: 0;
			const avgHoldTime = calls && calls.length > 0
				? calls.reduce((sum, c) => sum + (c.hold_time_seconds ?? 0), 0) / calls.length
				: 0;
			const totalTalkMinutes = calls?.reduce((sum, c) => sum + (c.talk_time_seconds ?? 0), 0) / 60 ?? 0;

			// Calculate quality metrics
			const callsWithScore = calls?.filter(c => c.call_quality_score) ?? [];
			const avgQualityScore = callsWithScore.length > 0
				? callsWithScore.reduce((sum, c) => sum + (c.call_quality_score ?? 0), 0) / callsWithScore.length
				: 0;
			const positiveCallsCount = calls?.filter(c => c.customer_sentiment === "positive")?.length ?? 0;
			const negativeCallsCount = calls?.filter(c => c.customer_sentiment === "negative")?.length ?? 0;

			// Customer metrics
			const newCustomers = calls?.filter(c => c.is_new_customer)?.length ?? 0;
			const existingCustomerCalls = totalCallsAnswered - newCustomers;

			// Calculate performance score (0-100)
			// Weighted: Booking Rate (40%), Revenue (30%), Call Volume (20%), Quality (10%)
			const bookingScore = Math.min(bookingRate / 80 * 40, 40); // 80% booking = max 40 points
			const revenueScore = Math.min(bookedRevenue / 10000 * 30, 30); // $10k = max 30 points
			const volumeScore = Math.min(totalCallsAnswered / 100 * 20, 20); // 100 calls = max 20 points
			const qualityScore = avgQualityScore / 5 * 10; // 5/5 quality = max 10 points
			const performanceScore = bookingScore + revenueScore + volumeScore + qualityScore;

			csrMetrics.push({
				userId: csr.id,
				name: `${csr.first_name} ${csr.last_name}`.trim(),
				bookingRate,
				revenue: bookedRevenue,
				callVolume: totalCallsAnswered,
				performanceScore,
			});

			// Upsert CSR metrics
			await supabase
				.from("analytics_csr_metrics")
				.upsert({
					company_id: companyId,
					user_id: csr.id,
					date: todayStr,
					period_start: periodStart,
					period_end: todayStr,
					csr_name: `${csr.first_name} ${csr.last_name}`.trim(),
					total_calls_received: totalCalls,
					total_calls_answered: totalCallsAnswered,
					total_calls_missed: missedCalls,
					call_answer_rate: Math.round(callAnswerRate * 100) / 100,
					avg_ring_time_seconds: Math.round(avgRingTime),
					avg_talk_time_seconds: Math.round(avgTalkTime),
					avg_hold_time_seconds: Math.round(avgHoldTime),
					total_talk_time_minutes: Math.round(totalTalkMinutes),
					total_opportunities: opportunities,
					jobs_booked: jobsBooked,
					booking_rate: Math.round(bookingRate * 100) / 100,
					booked_revenue: Math.round(bookedRevenue * 100) / 100,
					avg_booked_ticket: Math.round(avgBookedTicket * 100) / 100,
					revenue_per_call: Math.round(revenuePerCall * 100) / 100,
					new_customers_created: newCustomers,
					existing_customer_calls: existingCustomerCalls,
					avg_call_quality_score: Math.round(avgQualityScore * 100) / 100,
					positive_sentiment_calls: positiveCallsCount,
					negative_sentiment_calls: negativeCallsCount,
					overall_performance_score: Math.round(performanceScore * 100) / 100,
					updated_at: new Date().toISOString(),
				}, { onConflict: "company_id,user_id,date" });

			processedCount++;
		} catch {
			// Continue processing other CSRs
			continue;
		}
	}

	// Calculate rankings
	if (csrMetrics.length > 1) {
		// Sort and assign ranks
		const bookingRanks = [...csrMetrics].sort((a, b) => b.bookingRate - a.bookingRate);
		const revenueRanks = [...csrMetrics].sort((a, b) => b.revenue - a.revenue);
		const volumeRanks = [...csrMetrics].sort((a, b) => b.callVolume - a.callVolume);

		for (const metric of csrMetrics) {
			const bookingRank = bookingRanks.findIndex(m => m.userId === metric.userId) + 1;
			const revenueRank = revenueRanks.findIndex(m => m.userId === metric.userId) + 1;
			const volumeRank = volumeRanks.findIndex(m => m.userId === metric.userId) + 1;

			await supabase
				.from("analytics_csr_metrics")
				.update({
					booking_rate_rank: bookingRank,
					revenue_rank: revenueRank,
					call_volume_rank: volumeRank,
				})
				.eq("company_id", companyId)
				.eq("user_id", metric.userId)
				.eq("date", todayStr);
		}
	}

	return processedCount;
}
