"use client";

/**
 * Estimates Data (Convex Version)
 *
 * Client component that fetches estimate data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: estimates-data.tsx (Supabase Server Component)
 */
import { EstimatesKanban } from "@/components/work/estimates-kanban";
import {
  type Estimate,
  EstimatesTable,
} from "@/components/work/estimates-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useEstimates } from "@/lib/convex/hooks/estimates";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const ESTIMATES_PAGE_SIZE = 50;

/**
 * Loading skeleton for estimates view
 */
function EstimatesLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Error state component
 */
function EstimatesError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Estimates</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EstimatesEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Estimates Yet</h3>
        <p className="text-muted-foreground mt-2">
          Get started by creating your first estimate.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for EstimatesDataConvex
 */
interface EstimatesDataConvexProps {
  searchParams?: { page?: string };
}

/**
 * Estimates Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function EstimatesDataConvex({ searchParams }: EstimatesDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch estimates from Convex
  const estimatesResult = useEstimates(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: ESTIMATES_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || estimatesResult === undefined) {
    return <EstimatesLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <EstimatesError message="Please select a company to view estimates." />;
  }

  // Error state
  if (estimatesResult === null) {
    return <EstimatesError message="Failed to load estimates. Please try again." />;
  }

  const { estimates: convexEstimates, total, hasMore } = estimatesResult;

  // Empty state
  if (convexEstimates.length === 0) {
    return <EstimatesEmpty />;
  }

  // Transform Convex records to table format
  const estimates: Estimate[] = convexEstimates.map((est) => ({
    id: est._id,
    estimateNumber: est.estimateNumber,
    customer: "Customer", // Customer name not included in list query - fetch separately if needed
    project: est.title,
    date: new Date(est._creationTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    validUntil: est.validUntil
      ? new Date(est.validUntil).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    amount: est.totalAmount || 0,
    status: est.status as "accepted" | "sent" | "draft" | "declined",
    archived_at: est.archivedAt ? new Date(est.archivedAt).toISOString() : undefined,
    deleted_at: est.deletedAt ? new Date(est.deletedAt).toISOString() : undefined,
  }));

  return (
    <WorkDataView
      kanban={<EstimatesKanban estimates={estimates} />}
      section="estimates"
      table={
        <EstimatesTable
          estimates={estimates}
          itemsPerPage={ESTIMATES_PAGE_SIZE}
          totalCount={total}
          currentPage={currentPage}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { EstimatesData } from "./estimates-data";
