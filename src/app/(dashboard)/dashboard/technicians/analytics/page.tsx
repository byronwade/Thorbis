/**
 * Technicians > Analytics Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { TechnicianAnalyticsData } from "@/components/technicians/analytics/technician-analytics-data";
import { TechnicianAnalyticsSkeleton } from "@/components/technicians/analytics/technician-analytics-skeleton";

export default function TechnicianAnalyticsPage() {
	return (
		<Suspense fallback={<TechnicianAnalyticsSkeleton />}>
			<TechnicianAnalyticsData />
		</Suspense>
	);
}
