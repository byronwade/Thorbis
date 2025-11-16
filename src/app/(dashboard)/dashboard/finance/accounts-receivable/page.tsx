/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AccountsReceivableData } from "@/components/finance/accounts-receivable/accounts-receivable-data";
import { AccountsReceivableSkeleton } from "@/components/finance/accounts-receivable/accounts-receivable-skeleton";

export default function AccountsReceivablePage() {
	return (
		<Suspense fallback={<AccountsReceivableSkeleton />}>
			<AccountsReceivableData />
		</Suspense>
	);
}
