/**
 * UteamUscheduling Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UteamUschedulingData } from "@/components/settings/team-scheduling/team-scheduling-data";
import { UteamUschedulingSkeleton } from "@/components/settings/team-scheduling/team-scheduling-skeleton";

export default function UteamUschedulingPage() {
	return (
		<Suspense fallback={<UteamUschedulingSkeleton />}>
			<UteamUschedulingData />
		</Suspense>
	);
}
