/**
 * Reports Stats - Fast Server Component
 *
 * Fetches and displays reports summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function ReportsStats() {
  const supabase = await createClient();
  const companyId = await getActiveCompanyId();

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
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Total Reports
        </h3>
        <p className="mt-2 font-bold text-2xl">{stats.totalReports}</p>
        <p className="mt-1 text-muted-foreground text-xs">Available reports</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Scheduled Reports
        </h3>
        <p className="mt-2 font-bold text-2xl">{stats.scheduledReports}</p>
        <p className="mt-1 text-muted-foreground text-xs">Automated delivery</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Custom Reports
        </h3>
        <p className="mt-2 font-bold text-2xl">{stats.customReports}</p>
        <p className="mt-1 text-muted-foreground text-xs">User-created</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-medium text-muted-foreground text-sm">
          Data Sources
        </h3>
        <p className="mt-2 font-bold text-2xl">{stats.dataSources}</p>
        <p className="mt-1 text-muted-foreground text-xs">Connected sources</p>
      </div>
    </div>
  );
}
