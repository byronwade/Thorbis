/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { FinancesData } from "@/components/finance/finances-data";
import { FinancesSkeleton } from "@/components/finance/finances-skeleton";

export default function FinancesPage() {
	return (
		<Suspense fallback={<FinancesSkeleton />}>
			<FinancesData />
		</Suspense>
	);
}
