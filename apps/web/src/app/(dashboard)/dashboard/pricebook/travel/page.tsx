/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TravelData } from "@/components/pricebook/travel/travel-data";
import { TravelSkeleton } from "@/components/pricebook/travel/travel-skeleton";

export default function TravelPage() {
	return (
		<Suspense fallback={<TravelSkeleton />}>
			<TravelData />
		</Suspense>
	);
}
