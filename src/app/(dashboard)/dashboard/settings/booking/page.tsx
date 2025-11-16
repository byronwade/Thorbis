/**
 * Ubooking Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UbookingData } from "@/components/settings/booking/booking-data";
import { UbookingSkeleton } from "@/components/settings/booking/booking-skeleton";

export default function UbookingPage() {
	return (
		<Suspense fallback={<UbookingSkeleton />}>
			<UbookingData />
		</Suspense>
	);
}
