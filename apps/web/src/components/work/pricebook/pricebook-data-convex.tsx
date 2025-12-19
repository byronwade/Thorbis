"use client";

/**
 * Price Book Data (Convex Version)
 *
 * Client component that fetches price book items from Convex.
 * Provides real-time updates via Convex subscriptions.
 *
 * Migration from: pricebook-data.tsx (Supabase Server Component)
 */
import type { PriceBookItem } from "@/components/work/price-book-table";
import { PriceBookTable } from "@/components/work/price-book-table";
import { usePriceBookItems } from "@/lib/convex/hooks/price-book";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";

const PRICE_BOOK_PAGE_SIZE = 100;

/**
 * Loading skeleton for price book view
 */
function PriceBookLoadingSkeleton() {
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
function PriceBookError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Price Book</h3>
        <p className="text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function PriceBookEmpty() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No Price Book Items Yet</h3>
        <p className="text-muted-foreground mt-2">
          Add your first price book item to get started.
        </p>
      </div>
    </div>
  );
}

/**
 * Map Convex item type to table item type
 */
function mapItemType(type: string): "service" | "material" | "equipment" {
  if (type === "material" || type === "labor") return "material";
  if (type === "equipment") return "equipment";
  return "service";
}

/**
 * Price Book Data - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - No manual refresh needed
 * - Optimistic UI updates via mutations
 */
export function PricebookDataConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch price book items from Convex
  const priceBookResult = usePriceBookItems(
    activeCompanyId
      ? {
          companyId: activeCompanyId,
          isActive: true,
          limit: PRICE_BOOK_PAGE_SIZE,
        }
      : "skip"
  );

  // Loading state
  if (companyLoading || priceBookResult === undefined) {
    return <PriceBookLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return <PriceBookError message="Please select a company to view price book." />;
  }

  // Error state
  if (priceBookResult === null) {
    return <PriceBookError message="Failed to load price book. Please try again." />;
  }

  const { items: convexItems, total, hasMore } = priceBookResult;

  // Empty state
  if (convexItems.length === 0) {
    return <PriceBookEmpty />;
  }

  // Transform Convex records to table format
  // Note: Convex uses camelCase, table expects specific types
  const items: PriceBookItem[] = convexItems.map((item) => ({
    id: item._id,
    itemType: mapItemType(item.type),
    name: item.name,
    description: item.description,
    sku: item.sku,
    category: item.category || "General",
    subcategory: item.subcategory || null,
    cost: item.costPrice || 0,
    price: item.unitPrice,
    priceTier: undefined,
    markupPercent: item.costPrice ? Math.round(((item.unitPrice - item.costPrice) / item.costPrice) * 100) : 0,
    laborHours: item.laborHours,
    unit: "each",
    imageUrl: undefined,
    isActive: item.isActive,
    isFlatRate: false,
    supplierName: null,
    supplierSku: null,
    tags: item.tags || [],
    lastUpdated: item.updatedAt ? new Date(item.updatedAt) : undefined,
  }));

  return <PriceBookTable items={items} itemsPerPage={50} />;
}

/**
 * Re-export original component for gradual migration
 */
export { PricebookData } from "./pricebook-data";
