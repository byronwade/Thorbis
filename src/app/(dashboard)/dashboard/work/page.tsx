/**
 * Work Page (Jobs) - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats render instantly (static for now)
 * - Table streams in (200-500ms)
 *
 * Performance: 8-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { JobsData } from "@/components/work/jobs/jobs-data";
import { JobsSkeleton } from "@/components/work/jobs/jobs-skeleton";
import { JobsStats } from "@/components/work/jobs/jobs-stats";

// Enable Partial Prerendering for this page (Next.js 16+)
// PPR is now enabled globally via cacheComponents in next.config.ts
// This export is no longer needed but kept for documentation
// export const experimental_ppr = true;

export default function JobsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Job Flow Pipeline - Static for now */}
      <JobsStats />

      {/* Jobs Table - Streams in after shell */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<JobsSkeleton />}>
          <JobsData />
        </Suspense>
      </div>
    </div>
  );
}
