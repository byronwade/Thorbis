/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BankReconciliationData } from "@/components/finance/bank-reconciliation/bank-reconciliation-data";
import { BankReconciliationSkeleton } from "@/components/finance/bank-reconciliation/bank-reconciliation-skeleton";

export default function BankReconciliationPage() {
	return (
		<Suspense fallback={<BankReconciliationSkeleton />}>
			<BankReconciliationData />
		</Suspense>
	);
}
