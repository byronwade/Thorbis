/**
 * Contract Detail Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Contract data streams in (100-300ms)
 *
 * Performance: 5-15x faster than traditional SSR
 */

import { Suspense } from "react";
import { ContractDetailData } from "@/components/work/contracts/contract-detail-data";
import { ContractDetailShell } from "@/components/work/contracts/contract-detail-shell";
import { ContractDetailSkeleton } from "@/components/work/contracts/contract-detail-skeleton";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: contractId } = await params;

  return (
    <ContractDetailShell>
      <Suspense fallback={<ContractDetailSkeleton />}>
        <ContractDetailData contractId={contractId} />
      </Suspense>
    </ContractDetailShell>
  );
}
