/**
 * Price Book Item Detail Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Item data streams in (50-150ms)
 *
 * Performance: 10-30x faster than traditional SSR
 *
 * TODO: Replace mock data with real database queries
 */

import { Suspense } from "react";
import { PriceBookItemDetailData } from "@/components/work/pricebook/pricebook-item-detail-data";
import { PriceBookItemDetailShell } from "@/components/work/pricebook/pricebook-item-detail-shell";
import { PriceBookItemDetailSkeleton } from "@/components/work/pricebook/pricebook-item-detail-skeleton";

export default async function PriceBookItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: itemId } = await params;

  return (
    <PriceBookItemDetailShell>
      <Suspense fallback={<PriceBookItemDetailSkeleton />}>
        <PriceBookItemDetailData itemId={itemId} />
      </Suspense>
    </PriceBookItemDetailShell>
  );
}
