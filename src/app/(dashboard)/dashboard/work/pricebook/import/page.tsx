/**
 * Uimport Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UimportData } from "@/components/work/import/import-data";
import { UimportSkeleton } from "@/components/work/import/import-skeleton";

export default function UimportPage() {
  return (
    <Suspense fallback={<UimportSkeleton />}>
      <UimportData />
    </Suspense>
  );
}
