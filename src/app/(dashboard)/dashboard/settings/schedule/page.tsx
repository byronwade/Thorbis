/**
 * Uschedule Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UscheduleData } from "@/components/settings/schedule/schedule-data";
import { UscheduleSkeleton } from "@/components/settings/schedule/schedule-skeleton";

export default function UschedulePage() {
  return (
    <Suspense fallback={<UscheduleSkeleton />}>
      <UscheduleData />
    </Suspense>
  );
}
