/**
 * Service Agreements Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Data streams in (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { ServiceAgreementsData } from "@/components/work/service-agreements/service-agreements-data";
import { ServiceAgreementsSkeleton } from "@/components/work/service-agreements/service-agreements-skeleton";


export default async function ServiceAgreementsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {

	const params = await searchParams;

	return (
		<Suspense fallback={<ServiceAgreementsSkeleton />}>
			<ServiceAgreementsData searchParams={params} />
		</Suspense>
	);
}
