"use client";

/**
 * Invoices Stats (Convex Version)
 *
 * Client component that fetches invoice statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: invoices-stats.tsx (Supabase Server Component)
 */
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoiceStats } from "@/lib/convex/hooks/invoices";
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
 * Format currency for display
 */
function formatCurrency(amountInCents: number): string {
  return `$${(amountInCents / 100).toLocaleString()}`;
}

/**
 * InvoicesStatsConvex - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live stats
 * - Stats update automatically when invoices change
 */
export function InvoicesStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useInvoiceStats(
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
  const invoiceStats: StatCard[] = [
    {
      label: "Draft",
      value: stats.draft > 0
        ? `${stats.draft} (${formatCurrency(stats.totalAmount * (stats.draft / stats.total))})`
        : "0",
      change: 0,
    },
    {
      label: "Pending",
      value: formatCurrency(stats.totalOutstanding),
      change: 0,
    },
    {
      label: "Paid",
      value: formatCurrency(stats.totalPaid),
      change: 0, // Could be enhanced with period-over-period calculation
    },
    {
      label: "Overdue",
      value: stats.overdue > 0 ? formatCurrency(stats.totalOutstanding * (stats.overdue / (stats.sent + stats.viewed + stats.partial + stats.overdue))) : "$0",
      change: stats.overdue > 0 ? -stats.overdue : 0,
    },
    {
      label: "Total Invoices",
      value: stats.total,
      change: 0,
    },
  ];

  return <StatusPipeline compact stats={invoiceStats} />;
}

/**
 * Hook to get invoices stats data for toolbar integration
 */
export function useInvoicesStatsData(): StatCard[] | undefined {
  const { activeCompanyId } = useActiveCompany();

  const stats = useInvoiceStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  if (!stats) {
    return undefined;
  }

  return [
    {
      label: "Draft",
      value: stats.draft > 0 ? `${stats.draft}` : "0",
      change: 0,
    },
    {
      label: "Pending",
      value: formatCurrency(stats.totalOutstanding),
      change: 0,
    },
    {
      label: "Paid",
      value: formatCurrency(stats.totalPaid),
      change: 0,
    },
    {
      label: "Overdue",
      value: stats.overdue > 0 ? `${stats.overdue}` : "0",
      change: stats.overdue > 0 ? -stats.overdue : 0,
    },
    {
      label: "Total",
      value: stats.total,
      change: 0,
    },
  ];
}

/**
 * Re-export original component for gradual migration
 */
export { getInvoicesStatsData } from "./invoices-stats";
