/**
 * Team Member Details Page
 *
 * Displays comprehensive team member profile using unified layout system
 */

import { notFound } from "next/navigation";
import { DetailPageLayout } from "@/components/layout/detail-page-layout";
import { TeamMemberStatsBar } from "@/components/team/team-member-stats-bar";
import { TeamMemberPageContent } from "@/components/team/team-member-page-content";
import { createClient } from "@/lib/supabase/server";

export default async function TeamMemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamMemberId } = await params;

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
    .from("team_members")
    .select("company_id, role")
    .eq("user_id", user.id)
    .eq("company_id", activeCompanyId)
    .eq("status", "active")
    .maybeSingle();

  if (!currentUserMember) {
    return notFound();
  }

  // Fetch team member with user data
  const { data: teamMember, error } = await supabase
    .from("team_members")
    .select(`
      *,
      user:users(*),
      company:companies(name)
    `)
    .eq("id", teamMemberId)
    .eq("company_id", activeCompanyId)
    .single();

  if (error || !teamMember) {
    return notFound();
  }

  // Fetch related data
  const [
    { data: assignedJobs },
    { data: timeEntries },
    { data: certifications },
    { data: activities },
  ] = await Promise.all([
    // Get jobs assigned to this team member
    supabase
      .from("job_team_assignments")
      .select(`
        *,
        job:jobs(
          *,
          customer:customers(first_name, last_name)
        )
      `)
      .eq("team_member_id", teamMemberId)
      .eq("status", "assigned")
      .order("created_at", { ascending: false })
      .limit(20),

    // Get time entries
    supabase
      .from("job_time_entries")
      .select(`
        *,
        job:jobs(id, job_number, title)
      `)
      .eq("user_id", teamMember.user_id)
      .order("clock_in", { ascending: false })
      .limit(50),

    // Get certifications (if you have this table)
    supabase
      .from("team_member_certifications")
      .select("*")
      .eq("team_member_id", teamMemberId)
      .is("deleted_at", null)
      .then((result) => (result.error ? { data: [], error: null } : { data: result.data || [], error: null })),

    // Get activity log
    supabase
      .from("activity_log")
      .select("*, user:users(*)")
      .eq("entity_type", "team_member")
      .eq("entity_id", teamMemberId)
      .order("created_at", { ascending: false})
      .limit(20),
  ]);

  // Extract user from team member
  const memberUser = Array.isArray(teamMember.user)
    ? teamMember.user[0]
    : teamMember.user;

  // Calculate metrics
  const totalJobs = assignedJobs?.length || 0;
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

  return (
    <DetailPageLayout
      entityId={teamMemberId}
      entityType="team-member"
      entityData={teamMemberData}
      metrics={metrics}
      StatsBarComponent={TeamMemberStatsBar}
      ContentComponent={TeamMemberPageContent}
    />
  );
}
