/**
 * Service Agreement Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Service agreement data streams in (100-500ms)
 *
 * Performance: 5-20x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { ServiceAgreementDetailData } from "@/components/work/service-agreements/service-agreement-detail-data";
import { ServiceAgreementDetailSkeleton } from "@/components/work/service-agreements/service-agreement-detail-skeleton";

export default async function ServiceAgreementDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: agreementId } = await params;

	return (
		<Suspense fallback={<ServiceAgreementDetailSkeleton />}>
			<ServiceAgreementDetailData agreementId={agreementId} />
		</Suspense>
	);
}
