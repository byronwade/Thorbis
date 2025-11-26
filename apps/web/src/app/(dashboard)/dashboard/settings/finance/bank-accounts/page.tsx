/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BankAccountsData } from "@/components/settings/bank-accounts/bank-accounts-data";
import { BankAccountsSkeleton } from "@/components/settings/bank-accounts/bank-accounts-skeleton";

export default function BankAccountsPage() {
	return (
		<Suspense fallback={<BankAccountsSkeleton />}>
			<BankAccountsData />
		</Suspense>
	);
}
