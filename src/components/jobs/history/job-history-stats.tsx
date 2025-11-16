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

  // Future: Fetch real job history statistics
  // const { data: stats } = await supabase
  //   .from("jobs")
  //   .select("*")
  //   .eq("company_id", companyId)
  //   .eq("status", "completed");

  // Placeholder stats for now
  const stats = {
    totalJobs: 2847,
    monthlyIncrease: "+156",
    completed: 2678,
    completionRate: "94%",
    avgRating: 4.8,
    totalRevenue: "$847K",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Jobs</CardTitle>
          <Archive className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {stats.totalJobs.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">
            {stats.monthlyIncrease} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Completed</CardTitle>
          <CheckCircle className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {stats.completed.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">
            {stats.completionRate} completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Average Rating</CardTitle>
          <Star className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.avgRating}</div>
          <p className="text-muted-foreground text-xs">out of 5.0 stars</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.totalRevenue}</div>
          <p className="text-muted-foreground text-xs">Total revenue</p>
        </CardContent>
      </Card>
    </div>
  );
}
