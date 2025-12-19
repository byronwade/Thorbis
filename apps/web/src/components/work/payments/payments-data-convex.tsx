"use client";

/**
 * Payments Data (Convex Version)
 *
 * Client component that fetches payment data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: payments-data.tsx (Supabase Server Component)
 */
import { PaymentsKanban } from "@/components/work/payments-kanban";
import { PaymentsTable } from "@/components/work/payments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { usePayments } from "@/lib/convex/hooks/payments";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const PAYMENTS_PAGE_SIZE = 50;

/**
 * Loading skeleton for payments view
 */
function PaymentsLoadingSkeleton() {
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
function PaymentsError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Payments</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function PaymentsEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Payments Yet</h3>
        <p className="text-muted-foreground mt-2">
          Payments will appear here once recorded.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for PaymentsDataConvex
 */
interface PaymentsDataConvexProps {
  searchParams?: { page?: string };
}

/**
 * Payments Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function PaymentsDataConvex({ searchParams }: PaymentsDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch payments from Convex
  const paymentsResult = usePayments(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: PAYMENTS_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || paymentsResult === undefined) {
    return <PaymentsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <PaymentsError message="Please select a company to view payments." />;
  }

  // Error state
  if (paymentsResult === null) {
    return <PaymentsError message="Failed to load payments. Please try again." />;
  }

  const { payments: convexPayments, total, hasMore } = paymentsResult;

  // Empty state
  if (convexPayments.length === 0) {
    return <PaymentsEmpty />;
  }

  // Transform Convex records to table format
  const payments = convexPayments.map((payment) => ({
    id: payment._id,
    payment_number: payment.paymentNumber || "",
    amount: payment.amount ?? 0,
    payment_method: payment.paymentMethod || "other",
    status: payment.status || "pending",
    processed_at: payment.processedAt ? new Date(payment.processedAt) : null,
    created_at: new Date(payment._creationTime),
    updated_at: new Date(payment._creationTime),
    customer: null, // Customer data not included in list query - fetch separately if needed
    invoice_id: payment.invoiceId,
    job_id: payment.jobId,
    customer_id: payment.customerId,
    company_id: payment.companyId,
    archived_at: payment.archivedAt ? new Date(payment.archivedAt).toISOString() : undefined,
    deleted_at: payment.deletedAt ? new Date(payment.deletedAt).toISOString() : undefined,
  }));

  return (
    <WorkDataView
      kanban={<PaymentsKanban payments={payments} />}
      section="payments"
      table={
        <PaymentsTable
          currentPage={currentPage}
          itemsPerPage={PAYMENTS_PAGE_SIZE}
          payments={payments}
          totalCount={total}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { PaymentsData } from "./payments-data";
