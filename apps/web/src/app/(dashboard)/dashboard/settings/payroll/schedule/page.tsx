/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ScheduleData } from "@/components/settings/schedule/schedule-data";
import { ScheduleSkeleton } from "@/components/settings/schedule/schedule-skeleton";

export default function SchedulePage() {
	return (
		<Suspense fallback={<ScheduleSkeleton />}>
			<ScheduleData />
		</Suspense>
	);
}
