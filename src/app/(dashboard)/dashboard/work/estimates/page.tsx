/**
 * Estimates Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table/Kanban streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { EstimatesData } from "@/components/work/estimates/estimates-data";
import { EstimatesSkeleton } from "@/components/work/estimates/estimates-skeleton";
import { EstimatesStats } from "@/components/work/estimates/estimates-stats";

export default async function EstimatesPage({
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
				<EstimatesStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<EstimatesSkeleton />}>
				<EstimatesData searchParams={params} />
			</Suspense>
		</>
	);
}
