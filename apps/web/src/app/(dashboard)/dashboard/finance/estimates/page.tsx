/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EstimatesData } from "@/components/finance/estimates/estimates-data";
import { EstimatesSkeleton } from "@/components/finance/estimates/estimates-skeleton";

export default function EstimatesPage() {
	return (
		<Suspense fallback={<EstimatesSkeleton />}>
			<EstimatesData />
		</Suspense>
	);
}
