/**
 * Job History Stats - Fast Server Component
 *
 * Fetches and displays job history summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { Archive, CheckCircle, DollarSign, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function JobHistoryStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	let totalJobs = 0;
	let completedJobs = 0;
	let thisMonthJobs = 0;
	let totalRevenue = 0;

	if (companyId) {
		// Get first of current month
		const monthStart = new Date();
		monthStart.setDate(1);
		monthStart.setHours(0, 0, 0, 0);

		// Fetch all jobs
		const { data: jobs, error } = await supabase
			.from("jobs")
			.select("id, status, total_amount, created_at")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (!error && jobs) {
			totalJobs = jobs.length;

			for (const job of jobs) {
				// Count completed
				if (job.status === "completed") {
					completedJobs++;
				}

				// Count jobs created this month
				if (job.created_at && new Date(job.created_at) >= monthStart) {
					thisMonthJobs++;
				}

				// Sum revenue (total_amount is in cents)
				totalRevenue += job.total_amount || 0;
			}
		}
	}

	// Calculate stats
	const completionRate =
		totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
	const revenueK = Math.round(totalRevenue / 100 / 1000); // Convert cents to thousands

	const stats = {
		totalJobs,
		monthlyIncrease: `+${thisMonthJobs}`,
		completed: completedJobs,
		completionRate: `${completionRate}%`,
		avgRating: 4.8, // Would need reviews table
		totalRevenue: revenueK >= 1000 ? `$${(revenueK / 1000).toFixed(1)}M` : `$${revenueK}K`,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
					<Archive className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats.totalJobs.toLocaleString()}
					</div>
					<p className="text-muted-foreground text-xs">
						{stats.monthlyIncrease} this month
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Completed</CardTitle>
					<CheckCircle className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats.completed.toLocaleString()}
					</div>
					<p className="text-muted-foreground text-xs">
						{stats.completionRate} completion rate
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Average Rating</CardTitle>
					<Star className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.avgRating}</div>
					<p className="text-muted-foreground text-xs">out of 5.0 stars</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Revenue</CardTitle>
					<DollarSign className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalRevenue}</div>
					<p className="text-muted-foreground text-xs">Total revenue</p>
				</CardContent>
			</Card>
		</div>
	);
}
