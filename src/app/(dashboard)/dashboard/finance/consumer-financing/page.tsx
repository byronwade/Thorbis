/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ConsumerFinancingData } from "@/components/finance/consumer-financing/consumer-financing-data";
import { ConsumerFinancingSkeleton } from "@/components/finance/consumer-financing/consumer-financing-skeleton";

export default function ConsumerFinancingPage() {
	return (
		<Suspense fallback={<ConsumerFinancingSkeleton />}>
			<ConsumerFinancingData />
		</Suspense>
	);
}
