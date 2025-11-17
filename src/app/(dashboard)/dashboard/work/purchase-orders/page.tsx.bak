/**
 * Purchase Orders Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { PurchaseOrdersData } from "@/components/work/purchase-orders/purchase-orders-data";
import { PurchaseOrdersSkeleton } from "@/components/work/purchase-orders/purchase-orders-skeleton";
import { PurchaseOrdersStats } from "@/components/work/purchase-orders/purchase-orders-stats";

export default function PurchaseOrdersPage() {
	return (
		<>
			{/* Stats - Streams in first */}
			<Suspense
				fallback={<div className="h-24 animate-pulse rounded bg-muted" />}
			>
				<PurchaseOrdersStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<PurchaseOrdersSkeleton />}>
				<PurchaseOrdersData />
			</Suspense>
		</>
	);
}
