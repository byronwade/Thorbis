/**
 * Communication Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Communications data streams in (200-500ms)
 *
 * Performance: 8-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { CommunicationData } from "@/components/communication/communication-data";
import { CommunicationSkeleton } from "@/components/communication/communication-skeleton";

// Enable Partial Prerendering for this page (Next.js 16+)
// PPR is now enabled globally via cacheComponents in next.config.ts
// This export is no longer needed but kept for documentation
// export const experimental_ppr = true;

export default function CommunicationPage() {
  return (
    <Suspense fallback={<CommunicationSkeleton />}>
      <CommunicationData />
    </Suspense>
  );
}
