import { notFound } from "next/navigation";
import { Megaphone, Target, TrendingUp, UserPlus } from "lucide-react";
import type { Lead } from "@/components/marketing/leads-datatable";
import { LeadsDataTable } from "@/components/marketing/leads-datatable";
import { type StatCard, StatsCards } from "@/components/ui/stats-cards";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Marketing Data - Async Server Component
 *
 * Fetches lead sources and statistics from database.
 * Shows empty state when no leads are tracked.
 */
export async function MarketingData() {
	const supabase = await createClient();
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch lead sources for statistics
	const { data: leadSources } = await supabase
		.from("lead_sources")
		.select("id, name, total_leads, conversion_rate, is_active")
		.eq("company_id", activeCompanyId)
		.eq("is_active", true);

	// Calculate statistics from lead sources
	const totalLeads = (leadSources || []).reduce(
		(sum, source) => sum + (source.total_leads || 0),
		0,
	);
	const avgConversionRate =
		leadSources && leadSources.length > 0
			? leadSources.reduce(
					(sum, source) => sum + (Number(source.conversion_rate) || 0),
					0,
				) / leadSources.length
			: 0;
	const activeSources = (leadSources || []).length;

	// Build stats from actual data
	const leadStats: StatCard[] = [
		{
			label: "Total Leads",
			value: totalLeads,
			change: 0,
			changeLabel: "tracked leads",
		},
		{
			label: "Active Sources",
			value: activeSources,
			change: 0,
			changeLabel: "lead sources",
		},
		{
			label: "Avg. Conversion",
			value: `${avgConversionRate.toFixed(1)}%`,
			change: 0,
			changeLabel: "conversion rate",
		},
		{
			label: "Est. Pipeline",
			value: "$0",
			change: 0,
			changeLabel: "pipeline value",
		},
	];

	// No leads tracked yet - show empty state
	const leads: Lead[] = [];

	return (
		<>
			{/* Statistics - Full width, no padding */}
			<StatsCards compact stats={leadStats} />

			{/* Full-width seamless table or empty state */}
			{leads.length > 0 ? (
				<div>
					<LeadsDataTable itemsPerPage={50} leads={leads} />
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="bg-muted/50 mb-6 rounded-full p-4">
						<UserPlus className="text-muted-foreground/70 size-12" />
					</div>
					<h3 className="mb-2 text-lg font-semibold">No leads yet</h3>
					<p className="text-muted-foreground mb-6 max-w-md text-sm">
						Start capturing leads from your marketing campaigns, website forms,
						or referrals. All your leads will appear here for tracking and
						follow-up.
					</p>
					<div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-xs">
						<div className="flex items-center gap-2">
							<Target className="size-4" />
							<span>Google Ads</span>
						</div>
						<div className="flex items-center gap-2">
							<Megaphone className="size-4" />
							<span>Social Media</span>
						</div>
						<div className="flex items-center gap-2">
							<TrendingUp className="size-4" />
							<span>Referrals</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
