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

import { notFound } from "next/navigation";
import { TeamStatusPipeline } from "@/components/work/team-status-pipeline";
import { TeamsKanban } from "@/components/work/teams-kanban";
import { type TeamMember, TeamsTable } from "@/components/work/teams-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";
import { getTeamMembers } from "@/actions/team";

export default async function WorkTeamMembersPage() {
  // Fetch team members from database
  const result = await getTeamMembers();

  if (!result.success || !result.data) {
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
      name:
        member.user?.name ||
        member.user?.email?.split("@")[0] ||
        "Unknown",
      email: member.user?.email || "",
      roleId: member.role_id || "4",
      roleName: member.role?.name || "Team Member",
      roleColor: member.role?.color || getRoleColor(member.role?.name),
      departmentId: member.department_id || "1",
      departmentName: member.department?.name || "General",
      departmentColor:
        member.department?.color ||
        getDepartmentColor(member.department?.name),
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
    };
  });

  return (
    <div className="flex h-full flex-col">
      <TeamStatusPipeline teamMembers={teamMembers} />
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <WorkViewSwitcher section="teams" />
      </div>
      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<TeamsKanban members={teamMembers} />}
          section="teams"
          table={<TeamsTable teamMembers={teamMembers} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}

