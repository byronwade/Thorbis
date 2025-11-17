import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const PERCENTAGE_MULTIPLIER = 100;
const ACTIVE_CHANGE = 8.4;
const INVITED_CHANGE = 3.2;
const SUSPENDED_CHANGE_NEGATIVE = -2.1;
const SUSPENDED_CHANGE_POSITIVE = 1.5;

export async function UteamStats() {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch team members
	const { data: teamMembersRaw, error } = await supabase
		.from("team_members")
		.select("id, status, role, archived_at")
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to load team members: ${error.message}`);
	}

	// Filter active team members (not archived)
	const teamMembers = (teamMembersRaw || []).filter((member) => !member.archived_at);

	const totalMembers = teamMembers.length;
	const activeMembers = teamMembers.filter((m) => m.status === "active").length;
	const invitedMembers = teamMembers.filter((m) => m.status === "invited").length;
	const suspendedMembers = teamMembers.filter((m) => m.status === "suspended").length;

	const activePercentage =
		totalMembers > 0 ? Math.round((activeMembers / totalMembers) * PERCENTAGE_MULTIPLIER) : 0;

	const stats: StatCard[] = [
		{
			label: "Total Members",
			value: totalMembers,
			change: totalMembers > 0 ? ACTIVE_CHANGE : 0,
			changeLabel: "team size",
		},
		{
			label: "Active",
			value: activeMembers,
			change: activeMembers > 0 ? ACTIVE_CHANGE : 0,
			changeLabel: `${activePercentage}% of team`,
		},
		{
			label: "Invited",
			value: invitedMembers,
			change: invitedMembers > 0 ? INVITED_CHANGE : 0,
			changeLabel: "pending activation",
		},
		{
			label: "Suspended",
			value: suspendedMembers,
			change: suspendedMembers > 0 ? SUSPENDED_CHANGE_NEGATIVE : SUSPENDED_CHANGE_POSITIVE,
			changeLabel: suspendedMembers > 0 ? "requires attention" : "all active",
		},
	];

	return <StatusPipeline compact stats={stats} />;
}
