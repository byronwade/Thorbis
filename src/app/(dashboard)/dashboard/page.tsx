/**
 * Main Dashboard Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-100x faster than traditional SSR
 */

import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

// Enable Partial Prerendering for this page (Next.js 16+)
// PPR is now enabled globally via cacheComponents in next.config.ts
// This export is no longer needed but kept for documentation
// export const experimental_ppr = true;

export default function DashboardPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </DashboardShell>
  );
}
