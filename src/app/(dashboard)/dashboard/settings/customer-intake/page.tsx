/**
 * UcustomerUintake Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UcustomerUintakeData } from "@/components/settings/customer-intake/customer-intake-data";
import { UcustomerUintakeSkeleton } from "@/components/settings/customer-intake/customer-intake-skeleton";

export default function UcustomerUintakePage() {
  return (
    <Suspense fallback={<UcustomerUintakeSkeleton />}>
      <UcustomerUintakeData />
    </Suspense>
  );
}
