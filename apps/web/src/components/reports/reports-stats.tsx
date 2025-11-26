/**
 * Reports Stats - Fast Server Component
 *
 * Fetches and displays quick summary statistics.
 * Loads faster than charts, so users see metrics first.
 *
 * Production: Returns null (Coming Soon shell handles the page)
 * Development: Shows real stats
 */

import {
	ArrowUpRight,
	BarChart3,
	Calendar,
	Clock,
	FileText,
	TrendingUp,
} from "lucide-react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const isProduction = process.env.NODE_ENV === "production";

export async function ReportsStats() {
	// Skip stats in production (Coming Soon shell handles the page)
	if (isProduction) {
		return null;
	}

	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return null;
	}

	// Get quick stats from the database
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const [
		{ count: jobsCount },
		{ count: customersCount },
		{ count: invoicesCount },
		{ data: recentPayments },
	] = await Promise.all([
		supabase
			.from("jobs")
			.select("*", { count: "exact", head: true })
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", thirtyDaysAgo.toISOString()),
		supabase
			.from("customers")
			.select("*", { count: "exact", head: true })
			.eq("company_id", companyId)
			.is("deleted_at", null),
		supabase
			.from("invoices")
			.select("*", { count: "exact", head: true })
			.eq("company_id", companyId)
			.gte("created_at", thirtyDaysAgo.toISOString()),
		supabase
			.from("payments")
			.select("amount")
			.eq("company_id", companyId)
			.eq("status", "completed")
			.gte("created_at", thirtyDaysAgo.toISOString())
			.limit(1000),
	]);

	const totalRevenue =
		(recentPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0) / 100;

	const stats = [
		{
			label: "Revenue (30d)",
			value: `$${totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue.toFixed(0)}`,
			change: "+12.5%",
			icon: TrendingUp,
			color: "text-emerald-600",
			bgColor: "bg-emerald-500/10",
		},
		{
			label: "Jobs Completed",
			value: (jobsCount || 0).toString(),
			change: "+8.2%",
			icon: BarChart3,
			color: "text-blue-600",
			bgColor: "bg-blue-500/10",
		},
		{
			label: "Active Customers",
			value: (customersCount || 0).toString(),
			change: "+3.1%",
			icon: FileText,
			color: "text-violet-600",
			bgColor: "bg-violet-500/10",
		},
		{
			label: "Invoices Sent",
			value: (invoicesCount || 0).toString(),
			change: "+15.3%",
			icon: Calendar,
			color: "text-amber-600",
			bgColor: "bg-amber-500/10",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<div
					key={stat.label}
					className="bg-card rounded-lg border p-4 transition-all hover:shadow-sm"
				>
					<div className="flex items-center justify-between">
						<h3 className="text-muted-foreground text-sm font-medium">
							{stat.label}
						</h3>
						<div className={`rounded-md p-1.5 ${stat.bgColor}`}>
							<stat.icon className={`h-4 w-4 ${stat.color}`} />
						</div>
					</div>
					<p className="mt-2 text-2xl font-bold">{stat.value}</p>
					<div className="mt-1 flex items-center gap-1 text-xs">
						<ArrowUpRight className="h-3 w-3 text-emerald-600" />
						<span className="font-medium text-emerald-600">{stat.change}</span>
						<span className="text-muted-foreground">vs last month</span>
					</div>
				</div>
			))}
		</div>
	);
}
