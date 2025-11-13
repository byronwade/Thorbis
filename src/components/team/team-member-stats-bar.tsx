"use client";

/**
 * Team Member Stats Bar - Client Component
 * Statistics bar for team member metrics
 *
 * Features:
 * - Permanent stats bar above team member details
 * - Jobs, Hours, Revenue, Rating metrics
 * - Full-width seamless design
 * - Supports compact mode for sticky scrolling
 */

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

interface TeamMemberStatsBarProps {
  metrics: {
    totalJobs: number;
    hoursWorked: number;
    revenueGenerated: number;
    customerRating: number;
    jobsTrend?: number;
    hoursTrend?: number;
    revenueTrend?: number;
  };
  entityId: string;
  compact?: boolean;
}

export function TeamMemberStatsBar({
  metrics,
  compact = false,
}: TeamMemberStatsBarProps) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const teamMemberStats: StatCard[] = [
    {
      label: "Total Jobs",
      value: metrics.totalJobs,
      change: metrics.jobsTrend || 0,
      changeLabel: "vs last month",
    },
    {
      label: "Hours Worked",
      value: metrics.hoursWorked.toFixed(1),
      change: metrics.hoursTrend || 0,
      changeLabel: "vs last month",
    },
    {
      label: "Revenue Generated",
      value: formatCurrency(metrics.revenueGenerated),
      change: metrics.revenueTrend || 0,
      changeLabel: "vs last month",
    },
    {
      label: "Rating",
      value:
        metrics.customerRating > 0 ? metrics.customerRating.toFixed(1) : "N/A",
      change: 0,
      changeLabel: "customer rating",
    },
  ];

  return <EntityStatsBar compact={compact} stats={teamMemberStats} />;
}
