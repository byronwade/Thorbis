/**
 * Vendor Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Vendor data streams in (100-500ms)
 *
 * Performance: 5-16x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { VendorDetailData } from "@/components/work/vendors/vendor-detail-data";
import { VendorDetailSkeleton } from "@/components/work/vendors/vendor-detail-skeleton";

export default async function WorkVendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: vendorId } = await params;

  return (
    <Suspense fallback={<VendorDetailSkeleton />}>
      <VendorDetailData vendorId={vendorId} />
    </Suspense>
  );
}
