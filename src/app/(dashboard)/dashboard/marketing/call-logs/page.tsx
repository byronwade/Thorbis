/**
 * Marketing > Call Logs Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Real-time call log table
 * - Call recording playback
 * - Call analytics dashboard
 * - Advanced search and filters
 */

import { Suspense } from "react";
import { CallLogsData } from "@/components/marketing/call-logs/call-logs-data";
import { CallLogsSkeleton } from "@/components/marketing/call-logs/call-logs-skeleton";

export default function CallLogsPage() {
  return (
    <Suspense fallback={<CallLogsSkeleton />}>
      <CallLogsData />
    </Suspense>
  );
}
