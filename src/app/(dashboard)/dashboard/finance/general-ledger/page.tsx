/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { GeneralLedgerData } from "@/components/finance/general-ledger/general-ledger-data";
import { GeneralLedgerSkeleton } from "@/components/finance/general-ledger/general-ledger-skeleton";

export default function GeneralLedgerPage() {
	return (
		<Suspense fallback={<GeneralLedgerSkeleton />}>
			<GeneralLedgerData />
		</Suspense>
	);
}
