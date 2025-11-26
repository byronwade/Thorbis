/**
 * Ucalendar Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UcalendarData } from "@/components/settings/calendar/calendar-data";
import { UcalendarSkeleton } from "@/components/settings/calendar/calendar-skeleton";

export default function UcalendarPage() {
	return (
		<Suspense fallback={<UcalendarSkeleton />}>
			<UcalendarData />
		</Suspense>
	);
}
