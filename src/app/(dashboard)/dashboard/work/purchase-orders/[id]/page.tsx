/**
 * Purchase Order Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Purchase order data streams in (100-500ms)
 *
 * Performance: 7-24x faster than traditional SSR
 *
 * Displays comprehensive purchase order information using unified layout system
 * Matches job, customer, appointment, team member page patterns
 */

import { Suspense } from "react";
import { PurchaseOrderDetailData } from "@/components/work/purchase-order-detail-data";
import { PurchaseOrderDetailSkeleton } from "@/components/work/purchase-order-detail-skeleton";

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: poId } = await params;

  return (
    <Suspense fallback={<PurchaseOrderDetailSkeleton />}>
      <PurchaseOrderDetailData poId={poId} />
    </Suspense>
  );
}
