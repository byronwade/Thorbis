"use client";

/**
 * Properties Stats (Convex Version)
 *
 * Client component that fetches property statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { usePropertyStats } from "@/lib/convex/hooks/properties";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

const PERCENTAGE_MULTIPLIER = 100;
const ACTIVE_CHANGE = 5.2;
const RESIDENTIAL_CHANGE = 3.8;
const COMMERCIAL_CHANGE = 8.5;

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
 * PropertiesStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when properties change
 */
export function PropertiesStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = usePropertyStats(
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

  // Calculate active percentage
  const activePercentage =
    stats.total > 0
      ? Math.round((stats.active / stats.total) * PERCENTAGE_MULTIPLIER)
      : 0;

  // Transform Convex stats to StatCard format
  const propertyStats: StatCard[] = [
    {
      label: "Total Properties",
      value: stats.total,
      change: activePercentage,
    },
    {
      label: "Active",
      value: stats.active,
      change: stats.active > 0 ? ACTIVE_CHANGE : 0,
    },
    {
      label: "Residential",
      value: stats.byType.residential,
      change: stats.byType.residential > 0 ? RESIDENTIAL_CHANGE : 0,
    },
    {
      label: "Commercial",
      value: stats.byType.commercial,
      change: stats.byType.commercial > 0 ? COMMERCIAL_CHANGE : 0,
    },
    {
      label: "Inactive",
      value: stats.inactive,
      change: stats.inactive > 0 ? 0 : 0,
    },
  ];

  return <StatusPipeline compact stats={propertyStats} />;
}

/**
 * Hook to get property stats data for toolbar integration
 */
export function usePropertiesStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = usePropertyStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  const activePercentage =
    stats.total > 0
      ? Math.round((stats.active / stats.total) * PERCENTAGE_MULTIPLIER)
      : 0;

  return [
    { label: "Total Properties", value: stats.total, change: activePercentage },
    { label: "Active", value: stats.active, change: stats.active > 0 ? ACTIVE_CHANGE : 0 },
    { label: "Residential", value: stats.byType.residential, change: stats.byType.residential > 0 ? RESIDENTIAL_CHANGE : 0 },
    { label: "Commercial", value: stats.byType.commercial, change: stats.byType.commercial > 0 ? COMMERCIAL_CHANGE : 0 },
    { label: "Inactive", value: stats.inactive, change: 0 },
  ];
}
