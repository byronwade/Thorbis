/**
 * Uavailability Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UavailabilityData } from "@/components/settings/availability/availability-data";
import { UavailabilitySkeleton } from "@/components/settings/availability/availability-skeleton";

export default function UavailabilityPage() {
	return (
		<Suspense fallback={<UavailabilitySkeleton />}>
			<UavailabilityData />
		</Suspense>
	);
}
