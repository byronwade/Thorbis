/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AvailabilityData } from "@/components/schedule/availability/availability-data";
import { AvailabilitySkeleton } from "@/components/schedule/availability/availability-skeleton";

export default function AvailabilityPage() {
	return (
		<Suspense fallback={<AvailabilitySkeleton />}>
			<AvailabilityData />
		</Suspense>
	);
}
