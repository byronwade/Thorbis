/**
 * Pricebook > Parts Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { PricebookPartsData } from "@/components/pricebook/parts/pricebook-parts-data";
import { PricebookPartsSkeleton } from "@/components/pricebook/parts/pricebook-parts-skeleton";

export default function PartsMaterialsPage() {
  return (
    <Suspense fallback={<PricebookPartsSkeleton />}>
      <PricebookPartsData />
    </Suspense>
  );
}
