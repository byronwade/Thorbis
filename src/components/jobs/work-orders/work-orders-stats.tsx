/**
 * Work Orders Stats - Fast Server Component
 *
 * Fetches and displays work order summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { AlertCircle, CheckCircle, ClipboardList, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function WorkOrdersStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

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
					<CardTitle className="font-medium text-sm">Active Orders</CardTitle>
					<ClipboardList className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.activeOrders}</div>
					<p className="text-muted-foreground text-xs">{stats.activeChange} from yesterday</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Completed</CardTitle>
					<CheckCircle className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.completed}</div>
					<p className="text-muted-foreground text-xs">{stats.completedPeriod}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Pending Approval</CardTitle>
					<AlertCircle className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.pendingApproval}</div>
					<p className="text-muted-foreground text-xs">Awaiting review</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Average Value</CardTitle>
					<DollarSign className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">${stats.avgValue}</div>
					<p className="text-muted-foreground text-xs">Per work order</p>
				</CardContent>
			</Card>
		</div>
	);
}
