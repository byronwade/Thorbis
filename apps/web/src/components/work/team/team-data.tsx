import { notFound } from "next/navigation";
import { TeamsKanban } from "@/components/work/teams-kanban";
import { type TeamMember, TeamsTable } from "@/components/work/teams-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	getTeamMembersPageData,
	TEAM_MEMBERS_PAGE_SIZE,
} from "@/lib/queries/team-members";
import type { ArchiveFilter } from "@/lib/utils/archive";

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

const FALLBACK_ROLE = "Team Member";

type RawMember = Awaited<
	ReturnType<typeof getTeamMembersPageData>
>["teamMembers"][number];

const NAME_FIELDS = [
	"full_name",
	"fullName",
	"name",
	"display_name",
	"displayName",
	"preferred_name",
	"preferredName",
];

const FIRST_NAME_FIELDS = [
	"first_name",
	"firstName",
	"given_name",
	"givenName",
	"first",
];

const LAST_NAME_FIELDS = [
	"last_name",
	"lastName",
	"family_name",
	"familyName",
	"surname",
	"last",
];

const MIDDLE_NAME_FIELDS = ["middle_name", "middleName", "middle"];

function asRecord(value: unknown): Record<string, unknown> | null {
	return value && typeof value === "object"
		? (value as Record<string, unknown>)
		: null;
}

function getStringFromKeys(
	source: Record<string, unknown> | null,
	keys: string[],
): string | undefined {
	if (!source) {
		return undefined;
	}
	for (const key of keys) {
		const raw = source[key];
		if (typeof raw === "string") {
			const trimmed = raw.trim();
			if (trimmed) {
				return trimmed;
			}
		}
	}
	return undefined;
}

function buildNameFromMeta(
	meta: Record<string, unknown> | null,
): string | undefined {
	if (!meta) {
		return undefined;
	}
	const direct = getStringFromKeys(meta, NAME_FIELDS);
	if (direct) {
		return direct;
	}
	const first = getStringFromKeys(meta, FIRST_NAME_FIELDS);
	const middle = getStringFromKeys(meta, MIDDLE_NAME_FIELDS);
	const last = getStringFromKeys(meta, LAST_NAME_FIELDS);
	const parts = [first, middle, last].filter(Boolean) as string[];
	if (parts.length) {
		return parts.join(" ").replace(/\s+/g, " ").trim();
	}
	const nestedProfile = asRecord(meta.profile);
	if (nestedProfile) {
		return buildNameFromMeta(nestedProfile);
	}
	return undefined;
}

function extractUserMeta(user: RawMember["user"]): Record<string, unknown> {
	if (!user) {
		return {};
	}
	return (
		(user.raw_user_meta_data as Record<string, unknown> | null) ??
		(user.user_metadata as Record<string, unknown> | null) ??
		{}
	);
}

function buildDisplayName(member: RawMember): string {
	const meta = extractUserMeta(member.user);
	const metaName = buildNameFromMeta(meta);
	const profileName = buildNameFromMeta(asRecord(meta.profile));
	const userName =
		typeof member.user?.full_name === "string"
			? member.user.full_name
			: undefined;

	const emailName =
		member.user?.email?.split("@")[0] || member.email?.split("@")[0] || null;

	return (
		member.invited_name ||
		metaName ||
		profileName ||
		userName ||
		emailName ||
		member.invited_email ||
		member.email ||
		(member.role
			? member.role
					.replace(/_/g, " ")
					.replace(/\b\w/g, (char) => char.toUpperCase())
			: undefined) ||
		"Unknown"
	);
}

function buildAvatar(
	member: RawMember,
	meta: Record<string, unknown>,
): string | undefined {
	const avatar =
		getStringFromKeys(meta, [
			"avatar_url",
			"avatar",
			"photoURL",
			"photo_url",
		]) ||
		getStringFromKeys(asRecord(meta.profile), [
			"avatar_url",
			"avatar",
			"photoURL",
			"photo_url",
		]);
	if (avatar) {
		return avatar;
	}
	const userAvatar = member.user?.avatar_url;
	return typeof userAvatar === "string" && userAvatar.length > 0
		? userAvatar
		: undefined;
}

function transformMember(member: RawMember): TeamMember {
	const meta = extractUserMeta(member.user);
	const roleName = member.role || FALLBACK_ROLE;
	const departmentName = member.department || "General";
	const joinedDateSource = member.joined_at || member.invited_at;
	const lastActiveSource =
		member.last_active_at || member.user?.last_sign_in_at;

	return {
		id: member.id,
		name: buildDisplayName(member),
		email: member.user?.email || member.email || member.invited_email || "",
		roleId: "team-role",
		roleName,
		roleColor: getRoleColor(roleName),
		departmentId: "team-department",
		departmentName,
		departmentColor: getDepartmentColor(departmentName),
		status: (member.status as TeamMember["status"]) || "active",
		avatar: buildAvatar(member, meta),
		jobTitle:
			member.job_title ||
			(typeof meta.title === "string" ? meta.title : undefined) ||
			FALLBACK_ROLE,
		phone:
			member.phone || (typeof meta.phone === "string" ? meta.phone : undefined),
		joinedDate: joinedDateSource
			? new Date(joinedDateSource).toLocaleDateString()
			: "",
		lastActive: lastActiveSource
			? getRelativeTime(new Date(lastActiveSource))
			: "Never",
		archived_at: member.archived_at,
	};
}

export async function TeamData({
	searchParams,
}: {
	searchParams?: { page?: string; search?: string; filter?: string };
}) {
	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const searchQuery = searchParams?.search ?? "";
	const requestedFilter = (searchParams?.filter as ArchiveFilter) ?? "active";
	const archiveFilter: ArchiveFilter = ["active", "archived", "all"].includes(
		requestedFilter,
	)
		? requestedFilter
		: "active";

	const { teamMembers: teamMembersRaw, totalCount } =
		await getTeamMembersPageData(
			currentPage,
			TEAM_MEMBERS_PAGE_SIZE,
			searchQuery,
			activeCompanyId,
			archiveFilter,
		);

	const teamMembers: TeamMember[] = teamMembersRaw.map(transformMember);

	return (
		<WorkDataView
			kanban={<TeamsKanban members={teamMembers} />}
			section="team"
			table={
				<TeamsTable
					initialArchiveFilter={archiveFilter}
					initialSearchQuery={searchQuery}
					itemsPerPage={TEAM_MEMBERS_PAGE_SIZE}
					teamMembers={teamMembers}
					totalCount={totalCount}
					currentPage={currentPage}
				/>
			}
		/>
	);
}
