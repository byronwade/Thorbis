/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TaxData } from "@/components/finance/tax/tax-data";
import { TaxSkeleton } from "@/components/finance/tax/tax-skeleton";

export default function TaxPage() {
	return (
		<Suspense fallback={<TaxSkeleton />}>
			<TaxData />
		</Suspense>
	);
}
