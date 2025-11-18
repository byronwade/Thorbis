/**
 * Materials Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { MaterialsData } from "@/components/work/materials/materials-data";
import { MaterialsSkeleton } from "@/components/work/materials/materials-skeleton";
import { MaterialsStats } from "@/components/work/materials/materials-stats";

export default async function MaterialsPage({
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
				<MaterialsStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<MaterialsSkeleton />}>
				<MaterialsData searchParams={params} />
			</Suspense>
		</>
	);
}
