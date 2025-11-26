/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ChartOfAccountsData } from "@/components/finance/chart-of-accounts/chart-of-accounts-data";
import { ChartOfAccountsSkeleton } from "@/components/finance/chart-of-accounts/chart-of-accounts-skeleton";

export default function ChartOfAccountsPage() {
	return (
		<Suspense fallback={<ChartOfAccountsSkeleton />}>
			<ChartOfAccountsData />
		</Suspense>
	);
}
