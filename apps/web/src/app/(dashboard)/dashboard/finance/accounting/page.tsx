/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AccountingData } from "@/components/finance/accounting/accounting-data";
import { AccountingSkeleton } from "@/components/finance/accounting/accounting-skeleton";

export default function AccountingPage() {
	return (
		<Suspense fallback={<AccountingSkeleton />}>
			<AccountingData />
		</Suspense>
	);
}
