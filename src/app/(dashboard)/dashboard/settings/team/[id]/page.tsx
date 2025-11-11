/**
 * Team Member Details Page - Server Component
 * Matches job details page pattern with stats bar and collapsible sections
 */

import { notFound, redirect } from "next/navigation";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { StickyStatsBar } from "@/components/ui/sticky-stats-bar";
import { TeamMemberPageContent } from "@/components/team/team-member-page-content";
import { TeamMemberStatsBar } from "@/components/team/team-member-stats-bar";
import { createClient } from "@/lib/supabase/server";

export default async function TeamMemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamMemberId } = await params;

  const supabase = await createClient();
  if (!supabase) return notFound();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();
  if (!isOnboardingComplete) redirect("/dashboard/welcome");

  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) redirect("/dashboard/welcome");

  const { data: teamMember } = await supabase
    .from("team_members")
    .select(`*,user:users!user_id(*)`)
    .eq("id", teamMemberId)
    .eq("company_id", activeCompanyId)
    .single();

  if (!teamMember) return notFound();

  const userData = Array.isArray(teamMember.user) ? teamMember.user[0] : teamMember.user;

  const [
    { data: assignedJobs },
    { data: timeEntries },
    { data: certifications },
    { data: activities },
  ] = await Promise.all([
    supabase
      .from("jobs")
      .select(`*,customer:customers!customer_id(id, first_name, last_name)`)
      .eq("company_id", activeCompanyId)
      .contains("assigned_team_member_ids", [teamMemberId])
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("job_time_entries")
      .select(`*,job:jobs!job_id(id, job_number, title)`)
      .eq("user_id", teamMember.user_id)
      .order("clock_in", { ascending: false })
      .limit(50),
    supabase
      .from("team_member_certifications")
      .select("*")
      .eq("team_member_id", teamMemberId)
      .order("issue_date", { ascending: false }),
    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "team_member")
      .eq("entity_id", teamMemberId)
      .order("created_at", { ascending: false})
      .limit(50),
  ]);

  const totalJobs = assignedJobs?.length || 0;
  const completedJobs = assignedJobs?.filter((job) => job.status === "completed").length || 0;
  const hoursWorked = timeEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;
  const revenueGenerated = assignedJobs?.reduce((sum, job) => sum + (job.total_amount || 0), 0) || 0;

  const metrics = {
    totalJobs,
    hoursWorked,
    revenueGenerated,
    customerRating: 4.2,
    jobsTrend: 0,
    hoursTrend: 0,
    revenueTrend: 0,
    completedJobs,
    scheduledHours: 0,
    utilizationRate: 0,
  };

  const entityData = {
    teamMember,
    user: userData,
    assignedJobs: assignedJobs || [],
    timeEntries: timeEntries || [],
    certifications: certifications || [],
    activities: activities || [],
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <StickyStatsBar>
        <TeamMemberStatsBar
          entityId={teamMemberId}
          metrics={metrics}
          compact={false}
        />
      </StickyStatsBar>
      <TeamMemberPageContent entityData={entityData} metrics={metrics} />
    </div>
  );
}
