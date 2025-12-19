"use client";

/**
 * Vendors Stats (Convex Version)
 *
 * Client component that fetches vendor statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: vendors-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendorStats } from "@/lib/convex/hooks/vendors";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

const PERCENTAGE_MULTIPLIER = 100;
const ACTIVE_CHANGE = 8.5;
const INACTIVE_CHANGE = -2.1;

/**
 * Loading skeleton for stats
 */
function StatsLoadingSkeleton() {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20" />
      ))}
    </div>
  );
}

/**
 * VendorsStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when vendors change
 *
 * Note: 12-month spend and Open PO Value require purchase order
 * data which is not included in the basic vendor stats query.
 * These will show placeholder values until PO queries are integrated.
 */
export function VendorsStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useVendorStats(
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
  const vendorStats: StatCard[] = [
    {
      label: "Total Vendors",
      value: stats.total,
      change: activePercentage,
    },
    {
      label: "Active Vendors",
      value: stats.active,
      change: stats.active > 0 ? ACTIVE_CHANGE : 0,
    },
    {
      label: "Inactive",
      value: stats.inactive,
      change: stats.inactive > 0 ? INACTIVE_CHANGE : 0,
    },
    {
      label: "Categories",
      value: Object.keys(stats.byCategory).length,
      change: 0,
    },
  ];

  return <StatusPipeline compact stats={vendorStats} />;
}

/**
 * Hook to get vendor stats data for toolbar integration
 */
export function useVendorsStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = useVendorStats(
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
    { label: "Total Vendors", value: stats.total, change: activePercentage },
    { label: "Active Vendors", value: stats.active, change: stats.active > 0 ? ACTIVE_CHANGE : 0 },
    { label: "Inactive", value: stats.inactive, change: stats.inactive > 0 ? INACTIVE_CHANGE : 0 },
    { label: "Categories", value: Object.keys(stats.byCategory).length, change: 0 },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getVendorsStatsData } from "./vendors-stats";
