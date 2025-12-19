"use client";

/**
 * Price Book Stats (Convex Version)
 *
 * Client component that fetches price book statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceBookStats } from "@/lib/convex/hooks/price-book";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

const ACTIVE_CHANGE = 5.2;
const SERVICE_CHANGE = 3.8;
const MATERIAL_CHANGE = 7.1;

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
 * PriceBookStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when price book items change
 */
export function PriceBookStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = usePriceBookStats(
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
  const priceBookStats: StatCard[] = [
    {
      label: "Total Items",
      value: stats.total,
      change: stats.total > 0 ? ACTIVE_CHANGE : 0,
    },
    {
      label: "Active",
      value: stats.active,
      change: stats.active > 0 ? ACTIVE_CHANGE : 0,
    },
    {
      label: "Services",
      value: stats.byType.service,
      change: stats.byType.service > 0 ? SERVICE_CHANGE : 0,
    },
    {
      label: "Materials",
      value: stats.byType.material,
      change: stats.byType.material > 0 ? MATERIAL_CHANGE : 0,
    },
    {
      label: "Categories",
      value: Object.keys(stats.byCategory || {}).length,
      change: 0,
    },
  ];

  return <StatusPipeline compact stats={priceBookStats} />;
}

/**
 * Hook to get price book stats data for toolbar integration
 */
export function usePriceBookStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = usePriceBookStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  return [
    { label: "Total Items", value: stats.total, change: stats.total > 0 ? ACTIVE_CHANGE : 0 },
    { label: "Active", value: stats.active, change: stats.active > 0 ? ACTIVE_CHANGE : 0 },
    { label: "Services", value: stats.byType.service, change: stats.byType.service > 0 ? SERVICE_CHANGE : 0 },
    { label: "Materials", value: stats.byType.material, change: stats.byType.material > 0 ? MATERIAL_CHANGE : 0 },
    { label: "Categories", value: Object.keys(stats.byCategory || {}).length, change: 0 },
  ];
}
