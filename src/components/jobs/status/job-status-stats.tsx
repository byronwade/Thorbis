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

  // Future: Fetch real job status statistics
  // const { data: stats } = await supabase
  //   .from("jobs")
  //   .select("status")
  //   .eq("company_id", companyId);

  // Placeholder stats for now
  const stats = {
    inProgress: 12,
    avgDuration: "2.3h",
    completed: 18,
    pending: 6,
    overdue: 2,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">In Progress</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.inProgress}</div>
          <p className="text-muted-foreground text-xs">
            Average: {stats.avgDuration} duration
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Completed</CardTitle>
          <CheckCircle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.completed}</div>
          <p className="text-muted-foreground text-xs">Today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Pending</CardTitle>
          <AlertCircle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.pending}</div>
          <p className="text-muted-foreground text-xs">Awaiting assignment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Overdue</CardTitle>
          <AlertTriangle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-destructive">
            {stats.overdue}
          </div>
          <p className="text-muted-foreground text-xs">Need attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
