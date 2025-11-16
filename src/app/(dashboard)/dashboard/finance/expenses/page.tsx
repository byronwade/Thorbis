/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ExpensesData } from "@/components/finance/expenses/expenses-data";
import { ExpensesSkeleton } from "@/components/finance/expenses/expenses-skeleton";

export default function ExpensesPage() {
	return (
		<Suspense fallback={<ExpensesSkeleton />}>
			<ExpensesData />
		</Suspense>
	);
}
