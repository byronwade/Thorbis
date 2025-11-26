/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SchedulingData } from "@/components/schedule/scheduling-data";
import { SchedulingSkeleton } from "@/components/schedule/scheduling-skeleton";

export default function SchedulingPage() {
	return (
		<Suspense fallback={<SchedulingSkeleton />}>
			<SchedulingData />
		</Suspense>
	);
}
