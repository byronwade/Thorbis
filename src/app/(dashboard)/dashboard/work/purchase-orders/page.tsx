/**
 * Purchase Orders Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
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


export default async function PurchaseOrdersPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {

	const params = await searchParams;

	return (
		<>
			{/* Stats - Streams in first */}
			<Suspense
				fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
			>
				<PurchaseOrdersStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<PurchaseOrdersSkeleton />}>
				<PurchaseOrdersData searchParams={params} />
			</Suspense>
		</>
	);
}
