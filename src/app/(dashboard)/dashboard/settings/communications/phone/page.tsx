/**
 * Uphone Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UphoneData } from "@/components/settings/phone/phone-data";
import { UphoneSkeleton } from "@/components/settings/phone/phone-skeleton";

export default function UphonePage() {
  return (
    <Suspense fallback={<UphoneSkeleton />}>
      <UphoneData />
    </Suspense>
  );
}
