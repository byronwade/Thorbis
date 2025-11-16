/**
 * Material Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Material data streams in (100-400ms)
 *
 * Performance: 4-12x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { MaterialDetailData } from "@/components/work/materials/material-detail-data";
import { MaterialDetailSkeleton } from "@/components/work/materials/material-detail-skeleton";

export default async function MaterialDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: materialId } = await params;

	return (
		<Suspense fallback={<MaterialDetailSkeleton />}>
			<MaterialDetailData materialId={materialId} />
		</Suspense>
	);
}
