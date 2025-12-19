"use client";

/**
 * Invoices Data (Convex Version)
 *
 * Client component that fetches invoice data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: invoices-data.tsx (Supabase Server Component)
 */
import { InvoicesKanban } from "@/components/work/invoices-kanban";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useInvoices } from "@/lib/convex/hooks/invoices";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const INVOICES_PAGE_SIZE = 50;

/**
 * Loading skeleton for invoices view
 */
function InvoicesLoadingSkeleton() {
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
function InvoicesError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Invoices</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function InvoicesEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Invoices Yet</h3>
        <p className="text-muted-foreground mt-2">
          Get started by creating your first invoice.
        </p>
      </div>
    </div>
  );
}

/**
 * Map Convex status to display status
 */
function mapStatus(convexStatus: string): "paid" | "pending" | "draft" | "overdue" {
  switch (convexStatus) {
    case "draft":
      return "draft";
    case "sent":
    case "viewed":
    case "partial":
      return "pending";
    case "paid":
      return "paid";
    case "overdue":
      return "overdue";
    default:
      return "pending";
  }
}

/**
 * Props for InvoicesDataConvex
 */
interface InvoicesDataConvexProps {
  searchParams?: { page?: string };
}

/**
 * Invoices Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function InvoicesDataConvex({ searchParams }: InvoicesDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch invoices from Convex
  const invoicesResult = useInvoices(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: INVOICES_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || invoicesResult === undefined) {
    return <InvoicesLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <InvoicesError message="Please select a company to view invoices." />;
  }

  // Error state
  if (invoicesResult === null) {
    return <InvoicesError message="Failed to load invoices. Please try again." />;
  }

  const { invoices: convexInvoices, total, hasMore } = invoicesResult;

  // Empty state
  if (convexInvoices.length === 0) {
    return <InvoicesEmpty />;
  }

  // Transform Convex records to table format
  const invoices: Invoice[] = convexInvoices.map((inv) => ({
    id: inv._id,
    invoiceNumber: inv.invoiceNumber,
    customer: "Customer", // Customer name not included in list query - fetch separately if needed
    date: new Date(inv._creationTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    dueDate: inv.dueDate
      ? new Date(inv.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-",
    amount: inv.totalAmount,
    status: mapStatus(inv.status),
    archived_at: inv.archivedAt ? new Date(inv.archivedAt).toISOString() : undefined,
    deleted_at: inv.deletedAt ? new Date(inv.deletedAt).toISOString() : undefined,
  }));

  return (
    <WorkDataView
      kanban={<InvoicesKanban invoices={invoices} />}
      section="invoices"
      table={
        <InvoicesTable
          currentPage={currentPage}
          enableVirtualization={false}
          invoices={invoices}
          itemsPerPage={INVOICES_PAGE_SIZE}
          totalCount={total}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { InvoicesData } from "./invoices-data";
