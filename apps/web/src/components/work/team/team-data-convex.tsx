"use client";

/**
 * Team Data (Convex Version)
 *
 * Client component that fetches team member data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: team-data.tsx (Supabase Server Component)
 */
import { TeamsKanban } from "@/components/work/teams-kanban";
import { type TeamMember, TeamsTable } from "@/components/work/teams-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useTeamMembers } from "@/lib/convex/hooks/team";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const TEAM_MEMBERS_PAGE_SIZE = 50;

/**
 * Get relative time from date
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

/**
 * Get role color
 */
function getRoleColor(roleName: string | undefined): string {
  const colors: Record<string, string> = {
    owner: "#fbbf24",
    admin: "#3b82f6",
    manager: "#10b981",
    technician: "#6b7280",
    member: "#6b7280",
  };
  return colors[roleName?.toLowerCase() || ""] || "#6b7280";
}

/**
 * Get department color
 */
function getDepartmentColor(deptName: string | undefined): string {
  const colors: Record<string, string> = {
    Sales: "#3b82f6",
    Operations: "#10b981",
    Service: "#f59e0b",
    Support: "#8b5cf6",
  };
  return colors[deptName || ""] || "#6b7280";
}

/**
 * Format role name for display
 */
function formatRoleName(role: string): string {
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Loading skeleton for team view
 */
function TeamLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function TeamError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Team</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function TeamEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Team Members Yet</h3>
        <p className="text-muted-foreground mt-2">
          Invite your first team member to get started.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for TeamDataConvex
 */
interface TeamDataConvexProps {
  searchParams?: { page?: string; search?: string; filter?: string };
}

/**
 * Team Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function TeamDataConvex({ searchParams }: TeamDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const searchQuery = searchParams?.search ?? "";
  const archiveFilter = searchParams?.filter ?? "active";

  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch team members from Convex
  const teamMembersResult = useTeamMembers(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          status: archiveFilter === "active" ? "active" : undefined,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || teamMembersResult === undefined) {
    return <TeamLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <TeamError message="Please select a company to view team members." />;
  }

  // Error state
  if (teamMembersResult === null) {
    return <TeamError message="Failed to load team members. Please try again." />;
  }

  const convexMembers = teamMembersResult;

  // Empty state
  if (convexMembers.length === 0) {
    return <TeamEmpty />;
  }

  // Transform Convex records to table format
  const teamMembers: TeamMember[] = convexMembers.map((member) => {
    const roleName = formatRoleName(member.role || "member");
    const departmentName = member.department || "General";

    return {
      id: member._id,
      name: member.user?.name || member.user?.email?.split("@")[0] || "Unknown",
      email: member.user?.email || "",
      roleId: member.customRoleId || "default-role",
      roleName,
      roleColor: getRoleColor(member.role),
      departmentId: "default-department",
      departmentName,
      departmentColor: getDepartmentColor(departmentName),
      status: (member.status as TeamMember["status"]) || "active",
      avatar: member.user?.avatarUrl,
      jobTitle: member.jobTitle || roleName,
      phone: member.user?.phone,
      joinedDate: member.joinedAt
        ? new Date(member.joinedAt).toLocaleDateString()
        : member.invitedAt
          ? new Date(member.invitedAt).toLocaleDateString()
          : "",
      lastActive: "Recently", // Last active not tracked in Convex yet
      archived_at: member.archivedAt ? new Date(member.archivedAt).toISOString() : undefined,
    };
  });

  return (
    <WorkDataView
      kanban={<TeamsKanban members={teamMembers} />}
      section="team"
      table={
        <TeamsTable
          initialArchiveFilter={archiveFilter as "active" | "archived" | "all"}
          initialSearchQuery={searchQuery}
          itemsPerPage={TEAM_MEMBERS_PAGE_SIZE}
          teamMembers={teamMembers}
          totalCount={convexMembers.length}
          currentPage={currentPage}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { TeamData } from "./team-data";
