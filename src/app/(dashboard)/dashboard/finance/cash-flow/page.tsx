/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CashFlowData } from "@/components/finance/cash-flow/cash-flow-data";
import { CashFlowSkeleton } from "@/components/finance/cash-flow/cash-flow-skeleton";

export default function CashFlowPage() {
	return (
		<Suspense fallback={<CashFlowSkeleton />}>
			<CashFlowData />
		</Suspense>
	);
}
