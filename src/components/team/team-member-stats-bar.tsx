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
      icon: Briefcase,
      trend: metrics.jobsTrend
        ? {
            direction: metrics.jobsTrend > 0 ? ("up" as const) : ("down" as const),
            value: `${Math.abs(metrics.jobsTrend)}%`,
          }
        : undefined,
      description: "Completed jobs all-time",
    },
    {
      label: "Hours Worked",
      value: `${Math.floor(metrics.hoursWorked)}h`,
      icon: Clock,
      trend: metrics.hoursTrend
        ? {
            direction: metrics.hoursTrend > 0 ? ("up" as const) : ("down" as const),
            value: `${Math.abs(metrics.hoursTrend)}%`,
          }
        : undefined,
      description: "Total hours logged",
    },
    {
      label: "Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(metrics.revenueGenerated),
      icon: DollarSign,
      trend: metrics.revenueTrend
        ? {
            direction: metrics.revenueTrend > 0 ? ("up" as const) : ("down" as const),
            value: `${Math.abs(metrics.revenueTrend)}%`,
          }
        : undefined,
      description: "Revenue from completed jobs",
    },
    {
      label: "Rating",
      value: metrics.customerRating > 0 ? metrics.customerRating.toFixed(1) : "N/A",
      icon: Star,
      trend:
        metrics.customerRating >= 4.5
          ? { direction: "up" as const, value: "Excellent" }
          : metrics.customerRating >= 4.0
            ? { direction: "neutral" as const, value: "Good" }
            : metrics.customerRating > 0
              ? { direction: "down" as const, value: "Needs Improvement" }
              : undefined,
      description: "Average customer rating",
    },
  ];

  return <StatsCards compact={compact} stats={stats} variant="ticker" />;
}
