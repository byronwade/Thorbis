"use client";

/**
 * Payments Stats (Convex Version)
 *
 * Client component that fetches payment statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: payments-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentStats } from "@/lib/convex/hooks/payments";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";

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
 * PaymentsStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when payments change
 */
export function PaymentsStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = usePaymentStats(
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
  const paymentStats: StatCard[] = [
    {
      label: "Completed",
      value: stats.completed,
      change: stats.completed > 0 ? 14.2 : 0,
    },
    {
      label: "Pending",
      value: stats.pending,
      change: stats.pending > 0 ? 0 : 6.5,
    },
    {
      label: "Refunded",
      value: stats.refunded,
      change: stats.refunded > 0 ? -4.1 : 3.2,
    },
    {
      label: "Failed",
      value: stats.failed,
      change: stats.failed > 0 ? -7.8 : 5.9,
    },
  ];

  return <StatusPipeline compact stats={paymentStats} />;
}

/**
 * Hook to get payments stats data for toolbar integration
 */
export function usePaymentsStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = usePaymentStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  return [
    { label: "Completed", value: stats.completed, change: stats.completed > 0 ? 14.2 : 0 },
    { label: "Pending", value: stats.pending, change: stats.pending > 0 ? 0 : 6.5 },
    { label: "Refunded", value: stats.refunded, change: stats.refunded > 0 ? -4.1 : 3.2 },
    { label: "Failed", value: stats.failed, change: stats.failed > 0 ? -7.8 : 5.9 },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getPaymentsStatsData } from "./payments-stats";
