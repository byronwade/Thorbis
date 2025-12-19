"use client";

/**
 * Estimates Stats (Convex Version)
 *
 * Client component that fetches estimate statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: estimates-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useEstimateStats } from "@/lib/convex/hooks/estimates";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

const CENTS_PER_DOLLAR = 100;

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
 * Format currency for display
 */
function formatCurrency(amountInCents: number): string {
  return `$${(amountInCents / CENTS_PER_DOLLAR).toLocaleString()}`;
}

/**
 * EstimatesStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when estimates change
 */
export function EstimatesStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useEstimateStats(
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
  const estimateStats: StatCard[] = [
    {
      label: "Draft",
      value: stats.draft,
      change: 0,
    },
    {
      label: "Sent",
      value: formatCurrency(
        stats.totalValue * (stats.sent / (stats.total || 1))
      ),
      change: 0,
    },
    {
      label: "Accepted",
      value: formatCurrency(stats.acceptedValue),
      change: stats.conversionRate,
    },
    {
      label: "Declined",
      value: stats.declined,
      change: stats.declined > 0 ? -stats.declined : 0,
    },
    {
      label: "Total Value",
      value: formatCurrency(stats.totalValue),
      change: 0,
    },
  ];

  return <StatusPipeline compact stats={estimateStats} />;
}

/**
 * Hook to get estimates stats data for toolbar integration
 */
export function useEstimatesStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = useEstimateStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  return [
    { label: "Draft", value: stats.draft, change: 0 },
    {
      label: "Sent",
      value: formatCurrency(stats.totalValue * (stats.sent / (stats.total || 1))),
      change: 0,
    },
    { label: "Accepted", value: formatCurrency(stats.acceptedValue), change: stats.conversionRate },
    { label: "Declined", value: stats.declined, change: stats.declined > 0 ? -stats.declined : 0 },
    { label: "Total Value", value: formatCurrency(stats.totalValue), change: 0 },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getEstimatesStatsData } from "./estimates-stats";
