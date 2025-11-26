/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TimeTrackingData } from "@/components/finance/time-tracking/time-tracking-data";
import { TimeTrackingSkeleton } from "@/components/finance/time-tracking/time-tracking-skeleton";

export default function TimeTrackingPage() {
	return (
		<Suspense fallback={<TimeTrackingSkeleton />}>
			<TimeTrackingData />
		</Suspense>
	);
}
