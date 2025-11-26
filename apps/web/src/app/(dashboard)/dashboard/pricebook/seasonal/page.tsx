/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SeasonalData } from "@/components/pricebook/seasonal/seasonal-data";
import { SeasonalSkeleton } from "@/components/pricebook/seasonal/seasonal-skeleton";

export default function SeasonalPage() {
	return (
		<Suspense fallback={<SeasonalSkeleton />}>
			<SeasonalData />
		</Suspense>
	);
}
