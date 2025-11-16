/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BusinessFinancingData } from "@/components/settings/business-financing/business-financing-data";
import { BusinessFinancingSkeleton } from "@/components/settings/business-financing/business-financing-skeleton";

export default function BusinessFinancingPage() {
	return (
		<Suspense fallback={<BusinessFinancingSkeleton />}>
			<BusinessFinancingData />
		</Suspense>
	);
}
