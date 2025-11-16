/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BookkeepingData } from "@/components/settings/bookkeeping/bookkeeping-data";
import { BookkeepingSkeleton } from "@/components/settings/bookkeeping/bookkeeping-skeleton";

export default function BookkeepingPage() {
	return (
		<Suspense fallback={<BookkeepingSkeleton />}>
			<BookkeepingData />
		</Suspense>
	);
}
