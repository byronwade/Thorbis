"use client";

/**
 * Vendors Data (Convex Version)
 *
 * Client component that fetches vendor data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: vendors-data.tsx (Supabase Server Component)
 */
import { type Vendor, VendorTable } from "@/components/inventory/vendor-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useVendors } from "@/lib/convex/hooks/vendors";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const VENDORS_PAGE_SIZE = 100;

/**
 * Loading skeleton for vendors view
 */
function VendorsLoadingSkeleton() {
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
function VendorsError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Vendors</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function VendorsEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Vendors Yet</h3>
        <p className="text-muted-foreground mt-2">
          Add your first vendor to get started.
        </p>
      </div>
    </div>
  );
}

/**
 * Vendors Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function VendorsDataConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch vendors from Convex
  const vendorsResult = useVendors(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: VENDORS_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || vendorsResult === undefined) {
    return <VendorsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <VendorsError message="Please select a company to view vendors." />;
  }

  // Error state
  if (vendorsResult === null) {
    return <VendorsError message="Failed to load vendors. Please try again." />;
  }

  const { vendors: convexVendors, total, hasMore } = vendorsResult;

  // Empty state
  if (convexVendors.length === 0) {
    return <VendorsEmpty />;
  }

  // Transform Convex records to table format
  const vendors: Vendor[] = convexVendors.map((vendor) => ({
    id: vendor._id,
    name: vendor.name,
    display_name: vendor.displayName,
    vendor_number: vendor.vendorNumber,
    email: vendor.email,
    phone: vendor.phone,
    category: vendor.category,
    status: vendor.status,
    created_at: new Date(vendor._creationTime).toISOString(),
  }));

  return (
    <WorkDataView
      kanban={
        <div className="text-muted-foreground flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center">
          Vendor pipeline view coming soon. Switch back to table mode to manage
          vendors.
        </div>
      }
      section="vendors"
      table={
        <VendorTable basePath="/dashboard/work/vendors" vendors={vendors} />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { VendorsData } from "./vendors-data";
