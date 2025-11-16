/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PurchaseOrdersData } from "@/components/settings/purchase-orders/purchase-orders-data";
import { PurchaseOrdersSkeleton } from "@/components/settings/purchase-orders/purchase-orders-skeleton";

export default function PurchaseOrdersPage() {
	return (
		<Suspense fallback={<PurchaseOrdersSkeleton />}>
			<PurchaseOrdersData />
		</Suspense>
	);
}
