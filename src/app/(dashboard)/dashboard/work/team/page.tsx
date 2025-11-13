/**
 * Work > Team Members Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only TeamsTable and TeamsKanban components are client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs page structure: stats pipeline + table/kanban views
 */

import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import { getTeamMembers } from "@/actions/team";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { TeamsKanban } from "@/components/work/teams-kanban";
import { type TeamMember, TeamsTable } from "@/components/work/teams-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { ERROR_CODES } from "@/lib/errors/action-error";

export default async function WorkTeamMembersPage() {
  // Fetch team members from database
  const result = await getTeamMembers();

  // Handle case where user is not part of a company
  if (!result.success) {
    if (result.code === ERROR_CODES.AUTH_FORBIDDEN) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Users className="size-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="mb-2 font-semibold text-2xl">No Company Access</h2>
            <p className="mb-6 text-muted-foreground">
              {result.error ||
                "You must be part of a company to view team members."}
            </p>
            <p className="text-muted-foreground text-sm">
              Please contact your administrator to be added to a company.
            </p>
          </div>
        </div>
      );
    }
    // For other errors, show 404
    return notFound();
  }

  if (!result.data) {
    return notFound();
  }

  // Transform database format to component format
  const teamMembers: TeamMember[] = result.data.map((member: any) => {
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

    function getRelativeTime(date: Date): string {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60_000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    return {
      id: member.id,
      name: member.user?.name || member.user?.email?.split("@")[0] || "Unknown",
      email: member.user?.email || "",
      roleId: member.role_id || "4",
      roleName: member.role?.name || "Team Member",
      roleColor: member.role?.color || getRoleColor(member.role?.name),
      departmentId: member.department_id || "1",
      departmentName: member.department?.name || "General",
      departmentColor:
        member.department?.color || getDepartmentColor(member.department?.name),
      status: (member.status || "active") as "active" | "invited" | "suspended",
      avatar: member.user?.avatar,
      jobTitle: member.job_title || "Team Member",
      phone: member.phone,
      joinedDate: member.joined_at
        ? new Date(member.joined_at).toLocaleDateString()
        : member.invited_at
          ? new Date(member.invited_at).toLocaleDateString()
          : "",
      lastActive: member.last_active_at
        ? getRelativeTime(new Date(member.last_active_at))
        : "Never",
      archived_at: member.archived_at,
    };
  });

  // Filter out archived members for stats calculations
  const activeTeamMembers = teamMembers.filter((m) => !m.archived_at);

  // Calculate team stats (excluding archived members)
  const activeCount = activeTeamMembers.filter(
    (member) => member.status === "active"
  ).length;
  const invitedCount = activeTeamMembers.filter(
    (member) => member.status === "invited"
  ).length;
  const suspendedCount = activeTeamMembers.filter(
    (member) => member.status === "suspended"
  ).length;

  // Get unique departments count (excluding archived members)
  const departments = new Set(
    activeTeamMembers
      .map((m) => m.departmentName)
      .filter((d): d is string => Boolean(d))
  );

  // Get unique roles count (excluding archived members)
  const roles = new Set(
    activeTeamMembers
      .map((m) => m.roleName)
      .filter((r): r is string => Boolean(r))
  );

  const teamStats: StatCard[] = [
    {
      label: "Active Members",
      value: activeCount,
      change: activeCount > 0 ? 7.3 : 0, // Green if active members exist
      changeLabel: "currently active",
    },
    {
      label: "Invited",
      value: invitedCount,
      change: invitedCount > 0 ? 0 : 5.1, // Neutral if invited, green if none pending
      changeLabel: "pending acceptance",
    },
    {
      label: "Departments",
      value: departments.size,
      change: departments.size > 0 ? 3.2 : 0, // Green if departments exist
      changeLabel: "active departments",
    },
    {
      label: "Roles",
      value: roles.size,
      change: roles.size > 0 ? 2.8 : 0, // Green if roles exist
      changeLabel: "custom roles",
    },
    {
      label: "Total Members",
      value: activeTeamMembers.length,
      change: activeTeamMembers.length > 0 ? 6.4 : 0, // Green if team members exist
      changeLabel: "in your team",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={teamStats} />
      <WorkDataView
        kanban={<TeamsKanban members={teamMembers} />}
        section="teams"
        table={<TeamsTable itemsPerPage={50} teamMembers={teamMembers} />}
      />
    </>
  );
}
