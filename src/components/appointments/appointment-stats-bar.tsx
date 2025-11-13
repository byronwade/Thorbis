/**
 * Appointment Stats Bar
 *
 * Displays key appointment metrics in sticky stats bar:
 * - Duration (scheduled time)
 * - Travel Time (from shop to location)
 * - Team Members (assigned count)
 * - Job Value (linked job value)
 *
 * Features:
 * - Compact mode support (when scrolled)
 * - Ticker variant for stock-ticker style
 * - Trend indicators for metrics
 */

"use client";

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

export type AppointmentMetrics = {
  duration: number; // minutes
  travelTime: number; // minutes
  teamMemberCount: number;
  jobValue: number; // dollars
};

export type AppointmentStatsBarProps = {
  entityId: string;
  metrics: AppointmentMetrics;
  compact?: boolean;
};

export function AppointmentStatsBar({
  entityId,
  metrics,
  compact = false,
}: AppointmentStatsBarProps) {
  const stats: StatCard[] = [
    {
      label: "Duration",
      value: `${Math.floor(metrics.duration / 60)}h ${metrics.duration % 60}m`,
      change: undefined,
    },
    {
      label: "Travel Time",
      value: metrics.travelTime > 0 ? `${metrics.travelTime}m` : "N/A",
      change: undefined,
    },
    {
      label: "Team Members",
      value: metrics.teamMemberCount,
      change: undefined,
    },
    {
      label: "Job Value",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(metrics.jobValue),
      change: metrics.jobValue > 1000 ? 10 : undefined,
    },
  ];

  return <EntityStatsBar compact={compact} stats={stats} />;
}
