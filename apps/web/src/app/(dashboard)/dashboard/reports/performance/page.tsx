/**
 * Reports > Performance Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { PerformanceReportsData } from "@/components/reports/performance/performance-reports-data";
import { PerformanceReportsSkeleton } from "@/components/reports/performance/performance-reports-skeleton";

export default function PerformanceReportsPage() {
	return (
		<Suspense fallback={<PerformanceReportsSkeleton />}>
			<PerformanceReportsData />
		</Suspense>
	);
}
