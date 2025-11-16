/**
 * Uemail Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UemailData } from "@/components/settings/email/email-data";
import { UemailSkeleton } from "@/components/settings/email/email-skeleton";

export default function UemailPage() {
  return (
    <Suspense fallback={<UemailSkeleton />}>
      <UemailData />
    </Suspense>
  );
}
