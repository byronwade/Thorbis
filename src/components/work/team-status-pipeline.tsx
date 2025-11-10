/**
 * Team Status Pipeline - Client Component
 * Stock ticker-style statistics for team members
 *
 * Features:
 * - Stock ticker design with colored trend indicators
 * - Green for positive changes, red for negative
 * - Full-width seamless design
 * - Matches JobStatusPipeline structure
 */

"use client";

import { type StatCard, StatsCards } from "@/components/ui/stats-cards";
import type { TeamMember } from "@/components/work/teams-table";

interface TeamStatusPipelineProps {
  teamMembers: TeamMember[];
}

export function TeamStatusPipeline({
  teamMembers,
}: TeamStatusPipelineProps) {
  // Calculate stats from team members
  const activeCount = teamMembers.filter(
    (member) => member.status === "active"
  ).length;
  const invitedCount = teamMembers.filter(
    (member) => member.status === "invited"
  ).length;
  const suspendedCount = teamMembers.filter(
    (member) => member.status === "suspended"
  ).length;

  // Get unique departments count
  const departments = new Set(
    teamMembers
      .map((m) => m.departmentName)
      .filter((d): d is string => Boolean(d))
  );

  // Get unique roles count
  const roles = new Set(
    teamMembers.map((m) => m.roleName).filter((r): r is string => Boolean(r))
  );

  const teamStats: StatCard[] = [
    {
      label: "Active Members",
      value: activeCount,
      change: activeCount > 0 ? 1 : 0,
      changeLabel: "currently active",
    },
    {
      label: "Invited",
      value: invitedCount,
      change: invitedCount > 0 ? 0 : 1,
      changeLabel: "pending acceptance",
    },
    {
      label: "Departments",
      value: departments.size,
      change: 0,
      changeLabel: "active departments",
    },
    {
      label: "Roles",
      value: roles.size,
      change: 0,
      changeLabel: "custom roles",
    },
    {
      label: "Total Members",
      value: teamMembers.length,
      change: 1,
      changeLabel: "in your team",
    },
  ];

  return <StatsCards stats={teamStats} variant="ticker" />;
}

