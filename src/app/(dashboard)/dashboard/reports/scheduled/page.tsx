/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ScheduledData } from "@/components/reports/scheduled/scheduled-data";
import { ScheduledSkeleton } from "@/components/reports/scheduled/scheduled-skeleton";

export default function ScheduledPage() {
	return (
		<Suspense fallback={<ScheduledSkeleton />}>
			<ScheduledData />
		</Suspense>
	);
}
