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
	const _supabase = await createClient();
	const _companyId = await getActiveCompanyId();

	// Future: Fetch real work order statistics
	// const { data: stats } = await supabase
	//   .from("work_orders")
	//   .select("*")
	//   .eq("company_id", companyId);

	// Placeholder stats for now
	const stats = {
		activeOrders: 24,
		activeChange: "+3",
		completed: 18,
		completedPeriod: "Today",
		pendingApproval: 5,
		avgValue: 180,
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
