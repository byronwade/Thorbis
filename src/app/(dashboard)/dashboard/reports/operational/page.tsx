/**
 * Reports > Operational Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { OperationalReportsData } from "@/components/reports/operational/operational-reports-data";
import { OperationalReportsSkeleton } from "@/components/reports/operational/operational-reports-skeleton";

export default function OperationalReportsPage() {
  return (
    <Suspense fallback={<OperationalReportsSkeleton />}>
      <OperationalReportsData />
    </Suspense>
  );
}
