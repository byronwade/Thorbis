"use client";

/**
 * Appointments Stats (Convex Version)
 *
 * Client component that fetches appointment statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: appointments-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointmentStats } from "@/lib/convex/hooks/appointments";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

/**
 * Loading skeleton for stats
 */
function StatsLoadingSkeleton() {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20" />
      ))}
    </div>
  );
}

/**
 * AppointmentsStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when appointments change
 */
export function AppointmentsStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useAppointmentStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  // Loading state
  if (companyLoading || stats === undefined) {
    return <StatsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return null;
  }

  const CHANGE_PERCENTAGE_SCHEDULED = 8.4;
  const CHANGE_PERCENTAGE_CONFIRMED = 12.1;
  const CHANGE_PERCENTAGE_IN_PROGRESS = 5.7;
  const CHANGE_PERCENTAGE_COMPLETED = 9.3;
  const CHANGE_PERCENTAGE_CANCELLED_NEGATIVE = -3.2;
  const CHANGE_PERCENTAGE_CANCELLED_POSITIVE = 2.1;

  // Transform Convex stats to StatCard format
  const appointmentStats: StatCard[] = [
    {
      label: "Scheduled",
      value: stats.scheduled,
      change: stats.scheduled > 0 ? CHANGE_PERCENTAGE_SCHEDULED : 0,
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      change: stats.confirmed > 0 ? CHANGE_PERCENTAGE_CONFIRMED : 0,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      change: stats.inProgress > 0 ? CHANGE_PERCENTAGE_IN_PROGRESS : 0,
    },
    {
      label: "Completed",
      value: stats.completed,
      change: stats.completed > 0 ? CHANGE_PERCENTAGE_COMPLETED : 0,
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      change: stats.cancelled > 0
        ? CHANGE_PERCENTAGE_CANCELLED_NEGATIVE
        : CHANGE_PERCENTAGE_CANCELLED_POSITIVE,
    },
  ];

  return <StatusPipeline compact stats={appointmentStats} />;
}

/**
 * Hook to get appointments stats data for toolbar integration
 */
export function useAppointmentsStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = useAppointmentStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  const CHANGE_PERCENTAGE_SCHEDULED = 8.4;
  const CHANGE_PERCENTAGE_CONFIRMED = 12.1;
  const CHANGE_PERCENTAGE_IN_PROGRESS = 5.7;
  const CHANGE_PERCENTAGE_COMPLETED = 9.3;
  const CHANGE_PERCENTAGE_CANCELLED_NEGATIVE = -3.2;
  const CHANGE_PERCENTAGE_CANCELLED_POSITIVE = 2.1;

  return [
    { label: "Scheduled", value: stats.scheduled, change: stats.scheduled > 0 ? CHANGE_PERCENTAGE_SCHEDULED : 0 },
    { label: "Confirmed", value: stats.confirmed, change: stats.confirmed > 0 ? CHANGE_PERCENTAGE_CONFIRMED : 0 },
    { label: "In Progress", value: stats.inProgress, change: stats.inProgress > 0 ? CHANGE_PERCENTAGE_IN_PROGRESS : 0 },
    { label: "Completed", value: stats.completed, change: stats.completed > 0 ? CHANGE_PERCENTAGE_COMPLETED : 0 },
    { label: "Cancelled", value: stats.cancelled, change: stats.cancelled > 0 ? CHANGE_PERCENTAGE_CANCELLED_NEGATIVE : CHANGE_PERCENTAGE_CANCELLED_POSITIVE },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getAppointmentsStatsData } from "./appointments-stats";
