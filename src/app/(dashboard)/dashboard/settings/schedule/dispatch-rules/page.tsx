/**
 * UdispatchUrules Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UdispatchUrulesData } from "@/components/settings/dispatch-rules/dispatch-rules-data";
import { UdispatchUrulesSkeleton } from "@/components/settings/dispatch-rules/dispatch-rules-skeleton";

export default function UdispatchUrulesPage() {
  return (
    <Suspense fallback={<UdispatchUrulesSkeleton />}>
      <UdispatchUrulesData />
    </Suspense>
  );
}
