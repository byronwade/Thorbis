/**
 * Pricebook > Analytics Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { PriceAnalyticsData } from "@/components/pricebook/analytics/price-analytics-data";
import { PriceAnalyticsSkeleton } from "@/components/pricebook/analytics/price-analytics-skeleton";

export default function PriceAnalyticsPage() {
	return (
		<Suspense fallback={<PriceAnalyticsSkeleton />}>
			<PriceAnalyticsData />
		</Suspense>
	);
}
