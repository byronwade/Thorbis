import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { ArchiveFilter } from "@/lib/utils/archive";

export const TEAM_MEMBERS_PAGE_SIZE = 50;

const TEAM_MEMBERS_SELECT = `
  id,
  user_id,
  company_id,
  email,
  invited_email,
  invited_name,
  status,
  job_title,
  phone,
  joined_at,
  invited_at,
  last_active_at,
  archived_at,
  role,
  department,
  created_at,
  updated_at
`;

export type TeamMemberRecord = {
	id: string;
	user_id: string | null;
	company_id: string;
	email: string | null;
	invited_email: string | null;
	invited_name: string | null;
	status: string | null;
	job_title: string | null;
	phone: string | null;
	joined_at: string | null;
	invited_at: string | null;
	last_active_at: string | null;
	archived_at: string | null;
	role: string | null;
	department: string | null;
	created_at: string;
	updated_at: string;
	user?: {
		id: string;
		email: string | null;
		full_name?: string | null;
		avatar_url?: string | null;
		raw_user_meta_data?: Record<string, unknown> | null;
		user_metadata?: Record<string, unknown> | null;
		last_sign_in_at?: string | null;
	} | null;
};

export type TeamMembersPageResult = {
	teamMembers: TeamMemberRecord[];
	totalCount: number;
};

export const getTeamMembersPageData = cache(
	async (
		page: number,
		pageSize: number = TEAM_MEMBERS_PAGE_SIZE,
		searchQuery = "",
		companyIdOverride?: string,
		archiveFilter: ArchiveFilter = "active",
	): Promise<TeamMembersPageResult> => {
		const companyId = companyIdOverride ?? (await getActiveCompanyId());
		if (!companyId) {
			return { teamMembers: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		let query = supabase
			.from("team_members")
			.select(TEAM_MEMBERS_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.range(start, end);

		if (archiveFilter === "active") {
			query = query.is("archived_at", null);
		} else if (archiveFilter === "archived") {
			query = query.not("archived_at", "is", null);
		}

		const normalizedSearch = searchQuery.trim();
		if (normalizedSearch) {
			const sanitized = normalizedSearch.replace(/,/g, "\\,");
			const term = `%${sanitized}%`;
			query = query.or(
				`invited_name.ilike.${term},email.ilike.${term},invited_email.ilike.${term},job_title.ilike.${term},role.ilike.${term},department.ilike.${term}`,
			);
		}

		const { data, error, count } = await query;

		if (error) {
			throw new Error(`Failed to load team members: ${error.message}`);
		}

		const members = data ?? [];
		const uniqueUserIds = Array.from(
			new Set(
				members
					.map((member) => member.user_id)
					.filter((id): id is string => Boolean(id)),
			),
		);

		const usersById = new Map<string, TeamMemberRecord["user"]>();
		if (uniqueUserIds.length > 0) {
			const { data: userRows } = await supabase
				.from("users")
				.select("id,email,name,avatar,last_login_at")
				.in("id", uniqueUserIds);

			if (userRows) {
				for (const user of userRows) {
					usersById.set(user.id, {
						id: user.id,
						email: user.email,
						full_name: user.name,
						avatar_url: user.avatar,
						raw_user_meta_data: {
							full_name: user.name,
							avatar_url: user.avatar,
						},
						user_metadata: {
							full_name: user.name,
							avatar_url: user.avatar,
						},
						last_sign_in_at: user.last_login_at,
					});
				}
			}
		}

		const enrichedMembers: TeamMemberRecord[] = members.map((member) =>
			member.user_id && usersById.has(member.user_id)
				? { ...member, user: usersById.get(member.user_id) ?? null }
				: { ...member, user: null },
		);

		return {
			teamMembers: enrichedMembers,
			totalCount: count ?? 0,
		};
	},
);
