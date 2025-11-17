/**
 * Technicians Stats - Fast Server Component
 *
 * Fetches and displays technician summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function TechniciansStats() {
	const _supabase = await createClient();
	const _companyId = await getActiveCompanyId();

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
			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Total Technicians</h3>
				<p className="mt-2 text-2xl font-bold">{stats.totalTechnicians}</p>
				<p className="text-muted-foreground mt-1 text-xs">Team members</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Active Today</h3>
				<p className="mt-2 text-2xl font-bold">{stats.activeToday}</p>
				<p className="text-muted-foreground mt-1 text-xs">Currently working</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">On Break</h3>
				<p className="mt-2 text-2xl font-bold">{stats.onBreak}</p>
				<p className="text-muted-foreground mt-1 text-xs">Break time</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Available</h3>
				<p className="mt-2 text-2xl font-bold">{stats.available}</p>
				<p className="text-muted-foreground mt-1 text-xs">Ready for dispatch</p>
			</div>
		</div>
	);
}
