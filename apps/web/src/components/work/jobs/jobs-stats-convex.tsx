"use client";

/**
 * Jobs Stats (Convex Version)
 *
 * Client component that fetches job statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: jobs-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobStats } from "@/lib/convex/hooks/jobs";
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
 * JobsStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when jobs change
 */
export function JobsStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useJobStats(
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

  // Transform Convex stats to StatCard format
  // Note: Convex doesn't track period-over-period changes by default
  // so we set change to 0 (could be enhanced with a separate query)
  const jobStats: StatCard[] = [
    {
      label: "Quoted",
      value: stats.quoted,
      change: 0,
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      change: 0,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      change: 0,
    },
    {
      label: "Completed",
      value: stats.completed,
      change: 0,
    },
    {
      label: "On Hold",
      value: stats.onHold,
      change: 0,
    },
  ];

  return <StatusPipeline compact stats={jobStats} />;
}

/**
 * Get jobs stats data function for toolbar integration
 * Returns StatCard array from Convex stats
 */
export function useJobsStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = useJobStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  return [
    { label: "Quoted", value: stats.quoted, change: 0 },
    { label: "Scheduled", value: stats.scheduled, change: 0 },
    { label: "In Progress", value: stats.inProgress, change: 0 },
    { label: "Completed", value: stats.completed, change: 0 },
    { label: "On Hold", value: stats.onHold, change: 0 },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getJobsStatsData } from "./jobs-stats";
