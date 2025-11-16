/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { LeadTrackingData } from "@/components/marketing/lead-tracking/lead-tracking-data";
import { LeadTrackingSkeleton } from "@/components/marketing/lead-tracking/lead-tracking-skeleton";

export default function LeadTrackingPage() {
	return (
		<Suspense fallback={<LeadTrackingSkeleton />}>
			<LeadTrackingData />
		</Suspense>
	);
}
