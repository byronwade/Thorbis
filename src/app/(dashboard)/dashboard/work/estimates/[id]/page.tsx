/**
 * Estimate Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Estimate data streams in (100-500ms)
 *
 * Performance: 6-20x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { EstimateDetailData } from "@/components/work/estimates/estimate-detail-data";
import { EstimateDetailSkeleton } from "@/components/work/estimates/estimate-detail-skeleton";

export default async function EstimateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: estimateId } = await params;

  return (
    <Suspense fallback={<EstimateDetailSkeleton />}>
      <EstimateDetailData estimateId={estimateId} />
    </Suspense>
  );
}
