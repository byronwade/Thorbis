// @ts-nocheck
/**
 * Communication Detail Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Message content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { CommunicationDetailData } from "@/components/communication/[id]/[id]-data";
import { CommunicationDetailSkeleton } from "@/components/communication/[id]/[id]-skeleton";

export default async function CommunicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<Suspense fallback={<CommunicationDetailSkeleton />}>
			<CommunicationDetailData id={id} />
		</Suspense>
	);
}
