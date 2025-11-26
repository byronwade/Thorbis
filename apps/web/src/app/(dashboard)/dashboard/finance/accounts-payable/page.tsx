/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AccountsPayableData } from "@/components/finance/accounts-payable/accounts-payable-data";
import { AccountsPayableSkeleton } from "@/components/finance/accounts-payable/accounts-payable-skeleton";

export default function AccountsPayablePage() {
	return (
		<Suspense fallback={<AccountsPayableSkeleton />}>
			<AccountsPayableData />
		</Suspense>
	);
}
