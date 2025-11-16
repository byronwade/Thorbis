import { notFound } from "next/navigation";
import { TeamsKanban } from "@/components/work/teams-kanban";
import { TeamsTable } from "@/components/work/teams-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

function getRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60_000);

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins} min ago`;
	}
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) {
		return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	}
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getRoleColor(roleName: string | undefined): string {
	const colors: Record<string, string> = {
		Owner: "#fbbf24",
		Administrator: "#3b82f6",
		Manager: "#10b981",
		Technician: "#6b7280",
	};
	return colors[roleName || ""] || "#6b7280";
}

function getDepartmentColor(deptName: string | undefined): string {
	const colors: Record<string, string> = {
		Sales: "#3b82f6",
		Operations: "#10b981",
		Service: "#f59e0b",
		Support: "#8b5cf6",
	};
	return colors[deptName || ""] || "#6b7280";
}

export async function UteamData() {
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

	// Fetch team members using scalar columns only (no relationships required)
	const { data: teamMembersRaw, error } = await supabase
		.from("team_members")
		.select(
			[
				"id",
				"status",
				"job_title",
				"phone",
				"joined_at",
				"invited_at",
				"last_active_at",
				"archived_at",
				"email",
				"invited_email",
				"invited_name",
				"role",
				"department",
			].join(", ")
		)
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to load team members: ${error.message}`);
	}

	// Transform data for components
	const teamMembers = (teamMembersRaw || []).map((member: any) => {
		const nameFromEmail = member.email?.split("@")[0] || member.invited_email?.split("@")[0] || undefined;
		const name = member.invited_name || nameFromEmail || member.email || "Unknown";

		const email = member.email || member.invited_email || "";

		const roleName = member.role || "Team Member";
		const departmentName = member.department || "General";

		return {
			id: member.id,
			name,
			email,
			roleId: "team-role", // placeholder ID – table uses roleName + color primarily
			roleName,
			roleColor: getRoleColor(roleName),
			departmentId: "team-department",
			departmentName,
			departmentColor: getDepartmentColor(departmentName),
			status: member.status || "active",
			avatar: undefined,
			jobTitle: member.job_title || "Team Member",
			phone: member.phone,
			joinedDate: member.joined_at
				? new Date(member.joined_at).toLocaleDateString()
				: member.invited_at
					? new Date(member.invited_at).toLocaleDateString()
					: "",
			lastActive: member.last_active_at ? getRelativeTime(new Date(member.last_active_at)) : "Never",
			archived_at: member.archived_at,
		};
	});

	return (
		<WorkDataView
			kanban={<TeamsKanban teamMembers={teamMembers} />}
			section="team"
			table={<TeamsTable itemsPerPage={50} teamMembers={teamMembers} />}
		/>
	);
}
