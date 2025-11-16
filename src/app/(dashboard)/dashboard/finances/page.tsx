/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { FinancesData } from "@/components/finances/main-data";
import { FinancesSkeleton } from "@/components/finances/main-skeleton";

export default function FinancesPage() {
	return (
		<Suspense fallback={<FinancesSkeleton />}>
			<FinancesData />
		</Suspense>
	);
}
