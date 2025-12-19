"use client";

/**
 * Purchase Orders Stats (Convex Version)
 *
 * Client component that fetches purchase order statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { usePurchaseOrderStats } from "@/lib/convex/hooks/purchase-orders";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { formatCurrency } from "@/lib/formatters";

const PENDING_CHANGE = 3.5;
const APPROVED_CHANGE = 8.2;
const ORDERED_CHANGE = 5.1;

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
 * PurchaseOrdersStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when purchase orders change
 */
export function PurchaseOrdersStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = usePurchaseOrderStats(
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
  const purchaseOrderStats: StatCard[] = [
    {
      label: "Total POs",
      value: stats.total,
      change: stats.total > 0 ? 0 : 0,
    },
    {
      label: "Pending Approval",
      value: stats.byStatus.pending_approval || 0,
      change: (stats.byStatus.pending_approval || 0) > 0 ? PENDING_CHANGE : 0,
    },
    {
      label: "Approved",
      value: stats.byStatus.approved || 0,
      change: (stats.byStatus.approved || 0) > 0 ? APPROVED_CHANGE : 0,
    },
    {
      label: "Ordered",
      value: stats.byStatus.ordered || 0,
      change: (stats.byStatus.ordered || 0) > 0 ? ORDERED_CHANGE : 0,
    },
    {
      label: "Total Value",
      value: formatCurrency(stats.totalValue / 100),
      change: 0,
    },
  ];

  return <StatusPipeline compact stats={purchaseOrderStats} />;
}

/**
 * Hook to get purchase order stats data for toolbar integration
 */
export function usePurchaseOrdersStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = usePurchaseOrderStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  return [
    { label: "Total POs", value: stats.total, change: 0 },
    { label: "Pending Approval", value: stats.byStatus.pending_approval || 0, change: (stats.byStatus.pending_approval || 0) > 0 ? PENDING_CHANGE : 0 },
    { label: "Approved", value: stats.byStatus.approved || 0, change: (stats.byStatus.approved || 0) > 0 ? APPROVED_CHANGE : 0 },
    { label: "Ordered", value: stats.byStatus.ordered || 0, change: (stats.byStatus.ordered || 0) > 0 ? ORDERED_CHANGE : 0 },
    { label: "Total Value", value: formatCurrency(stats.totalValue / 100), change: 0 },
  ];
}
