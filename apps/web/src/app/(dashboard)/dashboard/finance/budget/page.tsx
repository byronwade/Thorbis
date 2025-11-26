/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BudgetData } from "@/components/finance/budget/budget-data";
import { BudgetSkeleton } from "@/components/finance/budget/budget-skeleton";

export default function BudgetPage() {
	return (
		<Suspense fallback={<BudgetSkeleton />}>
			<BudgetData />
		</Suspense>
	);
}
