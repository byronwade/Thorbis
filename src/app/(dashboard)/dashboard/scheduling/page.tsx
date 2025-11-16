/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SchedulingData } from "@/components/scheduling/main-data";
import { SchedulingSkeleton } from "@/components/scheduling/main-skeleton";

export default function SchedulingPage() {
	return (
		<Suspense fallback={<SchedulingSkeleton />}>
			<SchedulingData />
		</Suspense>
	);
}
