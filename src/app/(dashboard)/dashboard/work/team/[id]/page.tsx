/**
 * Team Member Details Page - Single Page with Collapsible Sections
 * Matches customer and job details page pattern
 */

import { notFound } from "next/navigation";
import { ToolbarActionsProvider } from "@/components/layout/toolbar-actions-provider";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { TeamMemberPageContent } from "@/components/team/team-member-page-content";
import { generateTeamMemberStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

// Configure page for full width with no sidebars
export const dynamic = "force-dynamic";

// Custom metadata for this page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: "Team Member Details",
  };
}

export default async function TeamMemberDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: memberId } = await params;

  const supabase = await createClient();

  if (!supabase) {
    console.error("[Team Member Page] Supabase client not initialized");
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("[Team Member Page] Auth error:", authError);
    return notFound();
  }

  if (!user) {
    console.error("[Team Member Page] No authenticated user");
    return notFound();
  }

  // Get the active company ID
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    console.error("[Team Member Page] No active company ID");
    return notFound();
  }

  // Get user's membership for the ACTIVE company
  const { data: teamMember, error: teamMemberError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", activeCompanyId)
    .eq("status", "active")
    .maybeSingle();

  // Check for real errors
  const hasRealError =
    teamMemberError &&
    teamMemberError.code !== "PGRST116" &&
    Object.keys(teamMemberError).length > 0;

  if (hasRealError) {
    try {
      console.error(
        "[Team Member Page] Team member query error:",
        JSON.stringify(teamMemberError, null, 2)
      );
    } catch (e) {
      console.error(
        "[Team Member Page] Team member error (could not serialize):",
        teamMemberError
      );
    }
    return notFound();
  }

  if (!teamMember?.company_id) {
    console.error(
      "[Team Member Page] User has no active company membership. User ID:",
      user.id
    );
    return notFound();
  }

  // Fetch the specific team member details (basic first)
  const { data: member, error: memberError } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", memberId)
    .eq("company_id", teamMember.company_id)
    .single();

  if (memberError) {
    console.error("[Team Member Page] Member query error:", memberError);
    console.error("[Team Member Page] Member ID:", memberId);
    console.error("[Team Member Page] Company ID:", teamMember.company_id);
    return notFound();
  }

  if (!member) {
    console.error(
      "[Team Member Page] Member not found. ID:",
      memberId,
      "Company ID:",
      teamMember.company_id
    );
    return notFound();
  }

  // Fetch role details if role_id exists
  let roleData = null;
  if (member.role_id) {
    const { data } = await supabase
      .from("custom_roles")
      .select("id, name, color")
      .eq("id", member.role_id)
      .single();
    roleData = data;
  }

  // Fetch department details if department_id exists
  let departmentData = null;
  if (member.department_id) {
    const { data } = await supabase
      .from("departments")
      .select("id, name, color")
      .eq("id", member.department_id)
      .single();
    departmentData = data;
  }

  // Fetch user details
  const { data: userData } = await supabase
    .from("users")
    .select("id, name, email, avatar")
    .eq("id", member.user_id)
    .single();

  // Fetch related data for display
  const [
    { data: assignedJobs },
    { data: timeEntries },
    { data: certifications },
    { data: activities },
    { data: attachments },
    { data: permissions },
  ] = await Promise.all([
    // Assigned Jobs
    supabase
      .from("job_assignments")
      .select(
        `
        *,
        job:jobs(
          id,
          job_number,
          title,
          status,
          scheduled_start,
          scheduled_end,
          customer:customers(id, first_name, last_name, display_name, company_name)
        )
      `
      )
      .eq("team_member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(20),
    // Time Entries
    supabase
      .from("time_entries")
      .select(
        `
        *,
        job:jobs(id, job_number, title)
      `
      )
      .eq("team_member_id", memberId)
      .order("clock_in", { ascending: false })
      .limit(50),
    // Certifications
    supabase
      .from("certifications")
      .select("*")
      .eq("team_member_id", memberId)
      .order("issue_date", { ascending: false }),
    // Activities
    supabase
      .from("audit_logs")
      .select(
        `
        *,
        user:users!user_id(name, email, avatar)
      `
      )
      .eq("entity_type", "team_members")
      .eq("entity_id", memberId)
      .order("created_at", { ascending: false })
      .limit(50),
    // Attachments
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "team_members")
      .eq("entity_id", memberId)
      .is("deleted_at", null)
      .order("uploaded_at", { ascending: false })
      .limit(100),
    // Permissions (if we have a permissions table)
    supabase
      .from("role_permissions")
      .select("*")
      .eq("role_id", member.role_id)
      .order("created_at", { ascending: false }),
  ]);

  // Calculate metrics
  const totalJobs = assignedJobs?.length || 0;
  const totalHours =
    timeEntries?.reduce(
      (sum: number, entry: any) => sum + (entry.total_hours || 0),
      0
    ) || 0;
  const activeCertifications =
    certifications?.filter((cert: any) => {
      if (!cert.expiry_date) return true;
      return new Date(cert.expiry_date) > new Date();
    }).length || 0;

  const metrics = {
    totalJobs,
    totalHours,
    activeCertifications,
    totalCertifications: certifications?.length || 0,
    completedJobs:
      assignedJobs?.filter((a: any) => a.job?.status === "completed").length ||
      0,
    activeJobs:
      assignedJobs?.filter(
        (a: any) =>
          a.job?.status === "in_progress" || a.job?.status === "scheduled"
      ).length || 0,
  };

  // Prepare team member data object with role and department
  const teamMemberData = {
    teamMember: {
      ...member,
      role: roleData,
      department: departmentData,
      user: userData,
    },
    user: userData,
    assignedJobs: assignedJobs || [],
    timeEntries: timeEntries || [],
    certifications: certifications || [],
    activities: activities || [],
    attachments: attachments || [],
    permissions: permissions || [],
  };

  // Generate stats for toolbar
  const stats = generateTeamMemberStats(metrics);

  return (
    <ToolbarStatsProvider stats={stats}>
      <ToolbarActionsProvider actions={null}>
        <div className="flex h-full w-full flex-col overflow-auto">
          <div className="mx-auto w-full max-w-7xl">
            <TeamMemberPageContent
              entityData={teamMemberData}
              metrics={metrics}
            />
          </div>
        </div>
      </ToolbarActionsProvider>
    </ToolbarStatsProvider>
  );
}
