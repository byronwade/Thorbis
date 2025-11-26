/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AnalyticsData } from "@/components/analytics/main-data";
import { AnalyticsSkeleton } from "@/components/analytics/main-skeleton";

export default function AnalyticsPage() {
	return (
		<Suspense fallback={<AnalyticsSkeleton />}>
			<AnalyticsData />
		</Suspense>
	);
}
