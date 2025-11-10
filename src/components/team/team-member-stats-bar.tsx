/**
 * Team Member Stats Bar
 *
 * Displays key team member performance metrics:
 * - Total Jobs (completed count)
 * - Hours Worked (total time logged)
 * - Revenue Generated (from completed jobs)
 * - Customer Rating (average rating)
 *
 * Features:
 * - Compact mode support (when scrolled)
 * - Ticker variant for stock-ticker style
 * - Performance trend indicators
 */

"use client";

import { Briefcase, Clock, DollarSign, Star } from "lucide-react";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatsCards } from "@/components/ui/stats-cards";

export type TeamMemberMetrics = {
  totalJobs: number;
  hoursWorked: number;
  revenueGenerated: number;
  customerRating: number; // 0-5
  jobsTrend?: number; // % change
  hoursTrend?: number; // % change
  revenueTrend?: number; // % change
};

export type TeamMemberStatsBarProps = {
  entityId: string;
  metrics: TeamMemberMetrics;
  compact?: boolean;
};

export function TeamMemberStatsBar({
  entityId,
  metrics,
  compact = false,
}: TeamMemberStatsBarProps) {
  const stats: StatCard[] = [
    {
      label: "Total Jobs",
      value: metrics.totalJobs,
      change: metrics.jobsTrend || undefined,
      changeLabel: metrics.jobsTrend ? "vs last month" : undefined,
    },
    {
      label: "Hours Worked",
      value: `${Math.floor(metrics.hoursWorked)}h`,
      change: metrics.hoursTrend || undefined,
      changeLabel: metrics.hoursTrend ? "vs last month" : undefined,
    },
    {
      label: "Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(metrics.revenueGenerated),
      change: metrics.revenueTrend || undefined,
      changeLabel: metrics.revenueTrend ? "vs last month" : undefined,
    },
    {
      label: "Rating",
      value: metrics.customerRating > 0 ? metrics.customerRating.toFixed(1) : "N/A",
      change: metrics.customerRating >= 4.5 ? 5 : metrics.customerRating >= 4.0 ? 0 : -5,
    },
  ];

  return <StatsCards compact={compact} stats={stats} variant="ticker" />;
}
