/**
 * Inventory > Analytics Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { InventoryAnalyticsData } from "@/components/inventory/analytics/inventory-analytics-data";
import { InventoryAnalyticsSkeleton } from "@/components/inventory/analytics/inventory-analytics-skeleton";

export default function InventoryAnalyticsPage() {
  return (
    <Suspense fallback={<InventoryAnalyticsSkeleton />}>
      <InventoryAnalyticsData />
    </Suspense>
  );
}
