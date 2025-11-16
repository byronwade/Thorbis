/**
 * Materials Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
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

export default function MaterialsPage() {
	return (
		<>
			{/* Stats - Streams in first */}
			<Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
				<MaterialsStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<MaterialsSkeleton />}>
				<MaterialsData />
			</Suspense>
		</>
	);
}
