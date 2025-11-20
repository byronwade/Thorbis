import { notFound } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { TeamMemberPageContent } from "@/components/team/team-member-page-content";
import { generateTeamMemberStatsSimple } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type TeamMemberDetailDataProps = {
	teamMemberId: string;
};

/**
 * Team Member Detail Data - Async Server Component
 *
 * Fetches team member data with 6 queries:
 * 1. Auth user check
 * 2. Active company check
 * 3. Current user member verification
 * 4. Team member with user and company data
 * 5. Assigned jobs
 * 6. Time entries, certifications, and activity log (parallel)
 *
 * Streams in after shell renders (100-400ms).
 */
export async function TeamMemberDetailData({
	teamMemberId,
}: TeamMemberDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	// Get active company
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Verify user access
	const { data: currentUserMember } = await supabase
		.from("company_memberships")
		.select("company_id, role")
		.eq("user_id", user.id)
		.eq("company_id", activeCompanyId)
		.eq("status", "active")
		.maybeSingle();

	if (!currentUserMember) {
		return notFound();
	}

	// Fetch team member with all employee management fields
	const { data: teamMember, error } = await supabase
		.from("company_memberships")
		.select(
			`
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
      company:companies(name)
    `,
		)
		.eq("id", teamMemberId)
		.eq("company_id", activeCompanyId)
		.single();

	if (error || !teamMember) {
		console.error("Team member fetch error:", error);
		console.error("Error message:", error?.message);
		console.error("Error code:", error?.code);
		console.error("Error details:", error?.details);
		console.error("Team member ID:", teamMemberId);
		console.error("Active company ID:", activeCompanyId);
		console.error("Team member data:", teamMember);
		console.error("Query was:", {
			table: "company_memberships",
			filters: {
				id: teamMemberId,
				company_id: activeCompanyId,
			},
		});
		return notFound();
	}

	// Fetch user data separately from public.users table
	const { data: userData } = await supabase
		.from("profiles")
		.select("id, email, full_name, avatar_url, phone")
		.eq("id", teamMember.user_id)
		.maybeSingle();

	// Attach user data to team member
	if (userData) {
		// Parse name into firstName and lastName
		const nameParts = userData.full_name?.split(" ") || [];
		teamMember.user = {
			id: userData.id,
			email: userData.email,
			first_name: nameParts[0] || null,
			last_name: nameParts.slice(1).join(" ") || null,
			avatar_url: userData.avatar_url,
			phone: userData.phone,
			name: userData.full_name,
		};
	} else {
		// Fallback if user not found
		teamMember.user = null;
	}

	// Fetch related data in parallel
	const [
		{ data: assignedJobs },
		{ data: timeEntries },
		{ data: certifications },
		{ data: activities },
	] = await Promise.all([
		// Get jobs assigned to this team member
		supabase
			.from("job_team_assignments")
			.select(
				`
        *,
        job:jobs(
          *,
          customer:customers(first_name, last_name)
        )
      `,
			)
			.eq("team_member_id", teamMemberId)
			.eq("status", "assigned")
			.order("created_at", { ascending: false })
			.limit(20),

		// Get time entries
		supabase
			.from("job_time_entries")
			.select(
				`
        *,
        job:jobs(id, job_number, title)
      `,
			)
			.eq("user_id", teamMember.user_id)
			.order("clock_in", { ascending: false })
			.limit(50),

		// Get certifications (if you have this table)
		supabase
			.from("team_member_certifications")
			.select("*")
			.eq("team_member_id", teamMemberId)
			.is("deleted_at", null)
			.then((result) =>
				result.error
					? { data: [], error: null }
					: { data: result.data || [], error: null },
			),

		// Get activity log
		supabase
			.from("activity_log")
			.select("*, user:users(*)")
			.eq("entity_type", "team_member")
			.eq("entity_id", teamMemberId)
			.order("created_at", { ascending: false })
			.limit(20),
	]);

	// Extract user from team member
	const memberUser = Array.isArray(teamMember.user)
		? teamMember.user[0]
		: teamMember.user;

	// Calculate metrics
	const _totalJobs = assignedJobs?.length || 0;
	const totalHours =
		timeEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;
	const completedJobs =
		assignedJobs?.filter((j) => j.job?.status === "completed").length || 0;
	const revenueGenerated =
		assignedJobs
			?.filter((j) => j.job?.status === "completed")
			.reduce((sum, j) => sum + (j.job?.total_amount || 0), 0) || 0;

	const metrics = {
		totalJobs: completedJobs,
		hoursWorked: totalHours,
		revenueGenerated,
		customerRating: 0, // Would calculate from job ratings if available
		jobsTrend: 0,
		hoursTrend: 0,
		revenueTrend: 0,
	};

	const teamMemberData = {
		teamMember,
		user: memberUser,
		assignedJobs: assignedJobs || [],
		timeEntries: timeEntries || [],
		certifications: certifications || [],
		activities: activities || [],
	};

	// Generate stats for toolbar
	const stats = generateTeamMemberStatsSimple(metrics);

	return (
		<ToolbarStatsProvider stats={stats}>
			<TeamMemberPageContent entityData={teamMemberData} metrics={metrics} />
		</ToolbarStatsProvider>
	);
}
