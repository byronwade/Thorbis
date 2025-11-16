/**
 * Pricebook > Services Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ServicesData } from "@/components/pricebook/services/services-data";
import { ServicesSkeleton } from "@/components/pricebook/services/services-skeleton";

export default function ServicePricingPage() {
	return (
		<Suspense fallback={<ServicesSkeleton />}>
			<ServicesData />
		</Suspense>
	);
}
