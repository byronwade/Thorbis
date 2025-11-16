/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ConsumerFinancingData } from "@/components/settings/consumer-financing/consumer-financing-data";
import { ConsumerFinancingSkeleton } from "@/components/settings/consumer-financing/consumer-financing-skeleton";

export default function ConsumerFinancingPage() {
	return (
		<Suspense fallback={<ConsumerFinancingSkeleton />}>
			<ConsumerFinancingData />
		</Suspense>
	);
}
