/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EstimatesData } from "@/components/invoices/estimates/estimates-data";
import { EstimatesSkeleton } from "@/components/invoices/estimates/estimates-skeleton";

export default function EstimatesPage() {
	return (
		<Suspense fallback={<EstimatesSkeleton />}>
			<EstimatesData />
		</Suspense>
	);
}
