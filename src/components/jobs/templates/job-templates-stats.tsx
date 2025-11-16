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
					<CardTitle className="font-medium text-sm">Total Templates</CardTitle>
					<FileText className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.totalTemplates}</div>
					<p className="text-muted-foreground text-xs">{stats.newThisMonth} this month</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Most Used</CardTitle>
					<TrendingUp className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.mostUsed}</div>
					<p className="text-muted-foreground text-xs">{stats.mostUsedCategory}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Template Usage</CardTitle>
					<BarChart2 className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.templateUsage}%</div>
					<p className="text-muted-foreground text-xs">Jobs use templates</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="font-medium text-sm">Time Saved</CardTitle>
					<Clock className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="font-bold text-2xl">{stats.timeSaved}</div>
					<p className="text-muted-foreground text-xs">Per job setup</p>
				</CardContent>
			</Card>
		</div>
	);
}
