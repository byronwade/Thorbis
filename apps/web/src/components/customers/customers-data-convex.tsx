"use client";

/**
 * Customers Data (Convex Version)
 *
 * Client component that fetches customer data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: customers-data.tsx (Supabase Server Component)
 */
import { useMemo } from "react";
import { CustomersKanban } from "@/components/customers/customers-kanban";
import {
  type Customer,
  CustomersTable,
} from "@/components/customers/customers-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useCustomers } from "@/lib/convex/hooks/customers";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const CUSTOMERS_PAGE_SIZE = 50;

/**
 * Loading skeleton for customers view
 */
function CustomersLoadingSkeleton() {
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
function CustomersError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Customers</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function CustomersEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Customers Yet</h3>
        <p className="text-muted-foreground mt-2">
          Get started by adding your first customer.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for CustomersDataConvex
 */
interface CustomersDataConvexProps {
  searchParams?: { page?: string };
}

/**
 * Customers Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function CustomersDataConvex({ searchParams }: CustomersDataConvexProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch customers from Convex
  const customersResult = useCustomers(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: CUSTOMERS_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || customersResult === undefined) {
    return <CustomersLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <CustomersError message="Please select a company to view customers." />;
  }

  // Error state (Convex returns undefined on error, but we can check for issues)
  if (customersResult === null) {
    return <CustomersError message="Failed to load customers. Please try again." />;
  }

  const { customers: convexCustomers, total, hasMore } = customersResult;

  // Empty state
  if (convexCustomers.length === 0) {
    return <CustomersEmpty />;
  }

  // Transform Convex records to table format
  const customers: Customer[] = convexCustomers.map((c) => ({
    id: c._id,
    name: c.displayName,
    contact: `${c.firstName} ${c.lastName}`,
    email: c.email,
    phone: c.phone,
    address: c.address || "",
    city: c.city || "",
    state: c.state || "",
    zipCode: c.zipCode || "",
    status:
      c.status === "active"
        ? "active"
        : c.status === "inactive"
          ? "inactive"
          : "prospect",
    lastService: c.lastJobDate
      ? new Date(c.lastJobDate).toLocaleDateString()
      : "None",
    nextService: "None scheduled", // TODO: Add next job lookup
    totalValue: c.totalRevenue || 0,
    archived_at: c.archivedAt ? new Date(c.archivedAt).toISOString() : undefined,
    deleted_at: c.deletedAt ? new Date(c.deletedAt).toISOString() : undefined,
  }));

  return (
    <WorkDataView
      kanban={<CustomersKanban customers={customers} />}
      section="customers"
      table={
        <CustomersTable
          customers={customers}
          itemsPerPage={CUSTOMERS_PAGE_SIZE}
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
export { CustomersData } from "./customers-data";
