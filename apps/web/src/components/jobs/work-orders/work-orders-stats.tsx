/**
 * Work Orders Stats - Fast Server Component
 *
 * Fetches and displays work order summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import {
	AlertCircle,
	CheckCircle,
	ClipboardList,
	DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function WorkOrdersStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	let activeOrders = 0;
	let completedToday = 0;
	let pendingApproval = 0;
	let totalValue = 0;
	let totalCount = 0;

	if (companyId) {
		// Get today's date range
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);

		// Fetch jobs with different statuses
		const { data: jobs, error } = await supabase
			.from("jobs")
			.select("id, status, total_amount, completed_at")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (!error && jobs) {
			for (const job of jobs) {
				totalCount++;
				totalValue += job.total_amount || 0;

				// Count by status
				if (
					["scheduled", "dispatched", "in_progress", "arrived"].includes(
						job.status,
					)
				) {
					activeOrders++;
				} else if (job.status === "pending_approval") {
					pendingApproval++;
				} else if (job.status === "completed" && job.completed_at) {
					const completedDate = new Date(job.completed_at);
					if (completedDate >= todayStart) {
						completedToday++;
					}
				}
			}
		}
	}

	const avgValue =
		totalCount > 0 ? Math.round(totalValue / totalCount / 100) : 0;

	const stats = {
		activeOrders,
		activeChange: "+0",
		completed: completedToday,
		completedPeriod: "Today",
		pendingApproval,
		avgValue,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Active Orders</CardTitle>
					<ClipboardList className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.activeOrders}</div>
					<p className="text-muted-foreground text-xs">
						{stats.activeChange} from yesterday
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
					<p className="text-muted-foreground text-xs">
						{stats.completedPeriod}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Pending Approval
					</CardTitle>
					<AlertCircle className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.pendingApproval}</div>
					<p className="text-muted-foreground text-xs">Awaiting review</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Average Value</CardTitle>
					<DollarSign className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">${stats.avgValue}</div>
					<p className="text-muted-foreground text-xs">Per work order</p>
				</CardContent>
			</Card>
		</div>
	);
}
