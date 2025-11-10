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

import { Clock, Route, Users, DollarSign } from "lucide-react";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatsCards } from "@/components/ui/stats-cards";

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
      icon: Clock,
      trend: undefined,
      description: "Scheduled appointment duration",
    },
    {
      label: "Travel Time",
      value: metrics.travelTime > 0 ? `${metrics.travelTime}m` : "N/A",
      icon: Route,
      trend: undefined,
      description: "Estimated travel time from shop",
    },
    {
      label: "Team Members",
      value: metrics.teamMemberCount,
      icon: Users,
      trend: undefined,
      description: "Assigned team members",
    },
    {
      label: "Job Value",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(metrics.jobValue),
      icon: DollarSign,
      trend:
        metrics.jobValue > 1000
          ? { direction: "up" as const, value: "High Value" }
          : undefined,
      description: "Linked job total value",
    },
  ];

  return <StatsCards compact={compact} stats={stats} variant="ticker" />;
}
