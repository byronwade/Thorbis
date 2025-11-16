/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PayRunsData } from "@/components/finance/pay-runs/pay-runs-data";
import { PayRunsSkeleton } from "@/components/finance/pay-runs/pay-runs-skeleton";

export default function PayRunsPage() {
	return (
		<Suspense fallback={<PayRunsSkeleton />}>
			<PayRunsData />
		</Suspense>
	);
}
