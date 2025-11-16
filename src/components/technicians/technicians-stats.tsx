/**
 * Technicians Stats - Fast Server Component
 *
 * Fetches and displays technician summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function TechniciansStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	// Future: Fetch real technician statistics
	// const { data: stats } = await supabase
	//   .from("team_members")
	//   .select("*")
	//   .eq("company_id", companyId)
	//   .eq("role", "technician");

	// Placeholder stats for now
	const stats = {
		totalTechnicians: 0,
		activeToday: 0,
		onBreak: 0,
		available: 0,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div className="rounded-lg border bg-card p-6">
				<h3 className="font-medium text-muted-foreground text-sm">Total Technicians</h3>
				<p className="mt-2 font-bold text-2xl">{stats.totalTechnicians}</p>
				<p className="mt-1 text-muted-foreground text-xs">Team members</p>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<h3 className="font-medium text-muted-foreground text-sm">Active Today</h3>
				<p className="mt-2 font-bold text-2xl">{stats.activeToday}</p>
				<p className="mt-1 text-muted-foreground text-xs">Currently working</p>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<h3 className="font-medium text-muted-foreground text-sm">On Break</h3>
				<p className="mt-2 font-bold text-2xl">{stats.onBreak}</p>
				<p className="mt-1 text-muted-foreground text-xs">Break time</p>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<h3 className="font-medium text-muted-foreground text-sm">Available</h3>
				<p className="mt-2 font-bold text-2xl">{stats.available}</p>
				<p className="mt-1 text-muted-foreground text-xs">Ready for dispatch</p>
			</div>
		</div>
	);
}
