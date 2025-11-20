import { cache } from "react";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { ArchiveFilter } from "@/lib/utils/archive";

export const TEAM_MEMBERS_PAGE_SIZE = 50;

const TEAM_MEMBERS_SELECT = `
  id,
  user_id,
  company_id,
  role,
  permissions,
  department_id,
  job_title,
  status,
  invited_at,
  accepted_at,
  created_at,
  updated_at,
  emergency_contact_name,
  emergency_contact_phone,
  emergency_contact_relationship,
  employee_id,
  hire_date,
  employment_type,
  work_schedule,
  work_location,
  pay_type,
  hourly_rate,
  annual_salary,
  commission_rate,
  commission_structure,
  overtime_eligible,
  street_address,
  city,
  state,
  postal_code,
  country,
  skills,
  certifications,
  licenses,
  service_areas,
  availability_schedule,
  max_weekly_hours,
  preferred_job_types,
  performance_notes,
  last_review_date,
  next_review_date,
  notes,
  archived_at,
  profiles!company_memberships_user_id_fkey (
    id,
    email,
    full_name,
    avatar_url,
    phone
  )
`;

export type TeamMemberRecord = {
	id: string;
	user_id: string | null;
	company_id: string;
	role:
		| "owner"
		| "admin"
		| "manager"
		| "member"
		| "technician"
		| "dispatcher"
		| "csr"
		| null;
	permissions: Record<string, any> | null;
	department_id: string | null;
	job_title: string | null;
	status: "active" | "invited" | "suspended" | null;
	invited_at: string | null;
	accepted_at: string | null;
	created_at: string;
	updated_at: string;
	user?: {
		id: string;
		email: string | null;
		full_name?: string | null;
		avatar_url?: string | null;
		phone?: string | null;
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
		// IMPORTANT: Cannot use "use cache" here because we call getActiveCompanyId()
		// which uses cookies(). React.cache() provides request-level deduplication.
		const companyId = companyIdOverride ?? (await getActiveCompanyId());
		if (!companyId) {
			return { teamMembers: [], totalCount: 0 };
		}

		const supabase = await createServiceSupabaseClient();
		const start = (Math.max(page, 1) - 1) * pageSize;
		const end = start + pageSize - 1;

		let query = supabase
			.from("company_memberships")
			.select(TEAM_MEMBERS_SELECT, { count: "exact" })
			.eq("company_id", companyId)
			.order("created_at", { ascending: false })
			.range(start, end);

		if (archiveFilter === "active") {
			query = query.eq("status", "active");
		} else if (archiveFilter === "archived") {
			query = query.eq("status", "suspended");
		}

		const normalizedSearch = searchQuery.trim();
		if (normalizedSearch) {
			const sanitized = normalizedSearch.replace(/,/g, "\\,");
			const term = `%${sanitized}%`;
			query = query.or(`job_title.ilike.${term},role.ilike.${term}`);
		}

		const { data, error, count } = await query;

		if (error) {
			throw new Error(`Failed to load team members: ${error.message}`);
		}

		// Profile data is now joined in the query - no secondary query needed!
		// Supabase returns profiles as an array when joining, so we normalize it
		const members = data ?? [];
		const normalizedMembers: TeamMemberRecord[] = members.map(
			(member: any) => ({
				...member,
				user: Array.isArray(member.profiles)
					? (member.profiles[0] ?? null)
					: (member.profiles ?? null),
				profiles: undefined, // Remove the raw profiles field
			}),
		);

		return {
			teamMembers: normalizedMembers,
			totalCount: count ?? 0,
		};
	},
);
