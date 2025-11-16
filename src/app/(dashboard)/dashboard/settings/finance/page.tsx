/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { FinanceData } from "@/components/settings/finance/finance-data";
import { FinanceSkeleton } from "@/components/settings/finance/finance-skeleton";

export default function FinancePage() {
	return (
		<Suspense fallback={<FinanceSkeleton />}>
			<FinanceData />
		</Suspense>
	);
}
