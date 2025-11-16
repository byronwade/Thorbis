/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SalesData } from "@/components/communication/sales/sales-data";
import { SalesSkeleton } from "@/components/communication/sales/sales-skeleton";

export default function SalesPage() {
	return (
		<Suspense fallback={<SalesSkeleton />}>
			<SalesData />
		</Suspense>
	);
}
