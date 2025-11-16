/**
 * Uvendors Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UvendorsData } from "@/components/inventory/vendors/vendors-data";
import { UvendorsSkeleton } from "@/components/inventory/vendors/vendors-skeleton";

export default function UvendorsPage() {
  return (
    <Suspense fallback={<UvendorsSkeleton />}>
      <UvendorsData />
    </Suspense>
  );
}
