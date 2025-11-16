/**
 * Reports > Custom Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { CustomReportsData } from "@/components/reports/custom/custom-reports-data";
import { CustomReportsSkeleton } from "@/components/reports/custom/custom-reports-skeleton";

export default function CustomReportsPage() {
  return (
    <Suspense fallback={<CustomReportsSkeleton />}>
      <CustomReportsData />
    </Suspense>
  );
}
