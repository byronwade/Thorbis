/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PerformanceData } from "@/components/technicians/performance/performance-data";
import { PerformanceSkeleton } from "@/components/technicians/performance/performance-skeleton";

export default function PerformancePage() {
	return (
		<Suspense fallback={<PerformanceSkeleton />}>
			<PerformanceData />
		</Suspense>
	);
}
