"use client";

/**
 * Properties Data (Convex Version)
 *
 * Client component that fetches property data from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: properties-data.tsx (Supabase Server Component)
 */
import { PropertiesTable } from "@/components/customers/properties-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { useProperties } from "@/lib/convex/hooks/properties";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const PROPERTIES_PAGE_SIZE = 100;

/**
 * Loading skeleton for properties view
 */
function PropertiesLoadingSkeleton() {
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
function PropertiesError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Properties</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function PropertiesEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Properties Yet</h3>
        <p className="text-muted-foreground mt-2">
          Add your first property to get started.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for PropertiesDataConvex
 */
interface PropertiesDataConvexProps {
  customerId?: string;
}

/**
 * Properties Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function PropertiesDataConvex({ customerId }: PropertiesDataConvexProps) {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch properties from Convex
  const propertiesResult = useProperties(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          limit: PROPERTIES_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || propertiesResult === undefined) {
    return <PropertiesLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <PropertiesError message="Please select a company to view properties." />;
  }

  // Error state
  if (propertiesResult === null) {
    return <PropertiesError message="Failed to load properties. Please try again." />;
  }

  const { properties: convexProperties, total, hasMore } = propertiesResult;

  // Empty state
  if (convexProperties.length === 0) {
    return <PropertiesEmpty />;
  }

  // Transform Convex records to table format
  // Note: Convex uses camelCase, table expects snake_case
  const properties = convexProperties.map((property) => ({
    id: property._id,
    name: property.name,
    address: property.address,
    address2: property.address2,
    city: property.city,
    state: property.state,
    zip_code: property.zipCode,
    type: property.type,
    square_footage: property.squareFootage,
    year_built: property.yearBuilt,
    customer_id: property.customerId,
    archived_at: property.archivedAt ? new Date(property.archivedAt).toISOString() : null,
    deleted_at: property.deletedAt ? new Date(property.deletedAt).toISOString() : null,
    // Enrichment data not included in list query
    enrichment: undefined,
    operationalIntelligence: undefined,
  }));

  return (
    <WorkDataView
      kanban={
        <div className="text-muted-foreground flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center">
          Property map view coming soon. Switch back to table mode to manage
          properties.
        </div>
      }
      section="properties"
      table={
        <PropertiesTable
          properties={properties}
          customerId={customerId}
        />
      }
    />
  );
}

/**
 * Re-export original component for gradual migration
 */
export { UpropertiesData as PropertiesData } from "./properties-data";
