/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SchedulesData } from "@/components/training/schedules/schedules-data";
import { SchedulesSkeleton } from "@/components/training/schedules/schedules-skeleton";

export default function SchedulesPage() {
	return (
		<Suspense fallback={<SchedulesSkeleton />}>
			<SchedulesData />
		</Suspense>
	);
}
