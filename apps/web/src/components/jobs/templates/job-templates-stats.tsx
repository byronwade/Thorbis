/**
 * Job Templates Stats - Fast Server Component
 *
 * Fetches and displays job template summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { BarChart2, Clock, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function JobTemplatesStats() {
	const _supabase = await createClient();
	const _companyId = await getActiveCompanyId();

	// Future: Fetch real job template statistics
	// const { data: stats } = await supabase
	//   .from("job_templates")
	//   .select("*")
	//   .eq("company_id", companyId);

	// Placeholder stats for now
	const stats = {
		totalTemplates: 47,
		newThisMonth: "+3",
		mostUsed: "HVAC",
		mostUsedCategory: "Maintenance",
		templateUsage: 78,
		timeSaved: "2.3h",
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Templates</CardTitle>
					<FileText className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalTemplates}</div>
					<p className="text-muted-foreground text-xs">
						{stats.newThisMonth} this month
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Most Used</CardTitle>
					<TrendingUp className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.mostUsed}</div>
					<p className="text-muted-foreground text-xs">
						{stats.mostUsedCategory}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Template Usage</CardTitle>
					<BarChart2 className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.templateUsage}%</div>
					<p className="text-muted-foreground text-xs">Jobs use templates</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Time Saved</CardTitle>
					<Clock className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.timeSaved}</div>
					<p className="text-muted-foreground text-xs">Per job setup</p>
				</CardContent>
			</Card>
		</div>
	);
}
