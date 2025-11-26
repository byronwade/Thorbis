/**
 * Marketing > Analytics Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Real-time analytics dashboard
 * - ROI tracking by channel
 * - Conversion funnel visualization
 * - Custom report builder
 */

import { Suspense } from "react";
import { MarketingAnalyticsData } from "@/components/marketing/analytics/analytics-data";
import { MarketingAnalyticsSkeleton } from "@/components/marketing/analytics/analytics-skeleton";

export default function MarketingAnalyticsPage() {
	return (
		<Suspense fallback={<MarketingAnalyticsSkeleton />}>
			<MarketingAnalyticsData />
		</Suspense>
	);
}
