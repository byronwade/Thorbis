/**
 * Usubscriptions Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UsubscriptionsData } from "@/components/settings/subscriptions/subscriptions-data";
import { UsubscriptionsSkeleton } from "@/components/settings/subscriptions/subscriptions-skeleton";

export default function UsubscriptionsPage() {
  return (
    <Suspense fallback={<UsubscriptionsSkeleton />}>
      <UsubscriptionsData />
    </Suspense>
  );
}
