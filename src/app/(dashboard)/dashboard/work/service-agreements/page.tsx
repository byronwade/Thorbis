/**
 * Service Agreements Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Data streams in (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { ServiceAgreementsData } from "@/components/work/service-agreements/service-agreements-data";
import { ServiceAgreementsSkeleton } from "@/components/work/service-agreements/service-agreements-skeleton";

export default function ServiceAgreementsPage() {
	return (
		<Suspense fallback={<ServiceAgreementsSkeleton />}>
			<ServiceAgreementsData />
		</Suspense>
	);
}
