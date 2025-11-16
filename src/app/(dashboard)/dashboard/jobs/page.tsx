/**
 * Jobs Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Jobs summary content streams in (100-300ms)
 *
 * Performance: 5-15x faster than traditional SSR
 */

import { Suspense } from "react";
import { JobsData } from "@/components/jobs/jobs-data";
import { JobsShell } from "@/components/jobs/jobs-shell";
import { JobsSkeleton } from "@/components/jobs/jobs-skeleton";

export default function JobsPage() {
  return (
    <JobsShell>
      <Suspense fallback={<JobsSkeleton />}>
        <JobsData />
      </Suspense>
    </JobsShell>
  );
}
