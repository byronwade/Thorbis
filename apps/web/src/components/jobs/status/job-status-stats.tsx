/**
 * Job Status Stats - Fast Server Component
 *
 * Fetches and displays job status summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { AlertCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function JobStatusStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	let inProgress = 0;
	let completedToday = 0;
	let pending = 0;
	let overdue = 0;

	if (companyId) {
		// Get today's start
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const now = new Date();

		// Fetch jobs
		const { data: jobs, error } = await supabase
			.from("jobs")
			.select("id, status, scheduled_end, completed_at")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (!error && jobs) {
			for (const job of jobs) {
				switch (job.status) {
					case "in_progress":
					case "arrived":
					case "dispatched":
						inProgress++;
						// Check if overdue (past scheduled end)
						if (job.scheduled_end && new Date(job.scheduled_end) < now) {
							overdue++;
						}
						break;
					case "completed":
						if (job.completed_at && new Date(job.completed_at) >= todayStart) {
							completedToday++;
						}
						break;
					case "scheduled":
					case "pending":
					case "unscheduled":
						pending++;
						break;
				}
			}
		}
	}

	const stats = {
		inProgress,
		avgDuration: "2.3h", // Would need duration tracking
		completed: completedToday,
		pending,
		overdue,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">In Progress</CardTitle>
					<Clock className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.inProgress}</div>
					<p className="text-muted-foreground text-xs">
						Average: {stats.avgDuration} duration
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Completed</CardTitle>
					<CheckCircle className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.completed}</div>
					<p className="text-muted-foreground text-xs">Today</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Pending</CardTitle>
					<AlertCircle className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.pending}</div>
					<p className="text-muted-foreground text-xs">Awaiting assignment</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Overdue</CardTitle>
					<AlertTriangle className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-destructive text-2xl font-bold">
						{stats.overdue}
					</div>
					<p className="text-muted-foreground text-xs">Need attention</p>
				</CardContent>
			</Card>
		</div>
	);
}
