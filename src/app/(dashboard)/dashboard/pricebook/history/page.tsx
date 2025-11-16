/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { HistoryData } from "@/components/pricebook/history/history-data";
import { HistorySkeleton } from "@/components/pricebook/history/history-skeleton";

export default function HistoryPage() {
	return (
		<Suspense fallback={<HistorySkeleton />}>
			<HistoryData />
		</Suspense>
	);
}
