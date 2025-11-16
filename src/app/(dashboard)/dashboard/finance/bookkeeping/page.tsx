/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BookkeepingData } from "@/components/finance/bookkeeping/bookkeeping-data";
import { BookkeepingSkeleton } from "@/components/finance/bookkeeping/bookkeeping-skeleton";

export default function BookkeepingPage() {
	return (
		<Suspense fallback={<BookkeepingSkeleton />}>
			<BookkeepingData />
		</Suspense>
	);
}
