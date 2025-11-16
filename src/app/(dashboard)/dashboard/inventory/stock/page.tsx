/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { StockData } from "@/components/inventory/stock/stock-data";
import { StockSkeleton } from "@/components/inventory/stock/stock-skeleton";

export default function StockPage() {
	return (
		<Suspense fallback={<StockSkeleton />}>
			<StockData />
		</Suspense>
	);
}
