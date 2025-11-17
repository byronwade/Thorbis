/**
 * Reports Stats - Fast Server Component
 *
 * Fetches and displays reports summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function ReportsStats() {
	const _supabase = await createClient();
	const _companyId = await getActiveCompanyId();

	// Future: Fetch real reports statistics
	// const { data: stats } = await supabase
	//   .from("reports")
	//   .select("*")
	//   .eq("company_id", companyId);

	// Placeholder stats for now
	const stats = {
		totalReports: 0,
		scheduledReports: 0,
		customReports: 0,
		dataSources: 0,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Total Reports</h3>
				<p className="mt-2 text-2xl font-bold">{stats.totalReports}</p>
				<p className="text-muted-foreground mt-1 text-xs">Available reports</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Scheduled Reports</h3>
				<p className="mt-2 text-2xl font-bold">{stats.scheduledReports}</p>
				<p className="text-muted-foreground mt-1 text-xs">Automated delivery</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Custom Reports</h3>
				<p className="mt-2 text-2xl font-bold">{stats.customReports}</p>
				<p className="text-muted-foreground mt-1 text-xs">User-created</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Data Sources</h3>
				<p className="mt-2 text-2xl font-bold">{stats.dataSources}</p>
				<p className="text-muted-foreground mt-1 text-xs">Connected sources</p>
			</div>
		</div>
	);
}
