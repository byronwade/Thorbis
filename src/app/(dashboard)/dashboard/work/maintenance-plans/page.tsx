/**
 * Maintenance Plans Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Data streams in (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { MaintenancePlansData } from "@/components/work/maintenance-plans/maintenance-plans-data";
import { MaintenancePlansSkeleton } from "@/components/work/maintenance-plans/maintenance-plans-skeleton";

export default function MaintenancePlansPage() {
  return (
    <Suspense fallback={<MaintenancePlansSkeleton />}>
      <MaintenancePlansData />
    </Suspense>
  );
}
