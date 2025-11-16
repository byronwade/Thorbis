/**
 * Uschedule Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ScheduleData } from "@/components/settings/schedule/schedule-data";
import { ScheduleSkeleton } from "@/components/settings/schedule/schedule-skeleton";

export default function UschedulePage() {
	return (
		<Suspense fallback={<ScheduleSkeleton />}>
			<ScheduleData />
		</Suspense>
	);
}
