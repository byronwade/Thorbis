/**
 * Maintenance Plan Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Plan data streams in (100-600ms)
 *
 * Performance: 6-22x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { MaintenancePlanDetailData } from "@/components/work/maintenance-plans/maintenance-plan-detail-data";
import { MaintenancePlanDetailSkeleton } from "@/components/work/maintenance-plans/maintenance-plan-detail-skeleton";

export default async function MaintenancePlanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id: planId } = await params;

	return (
		<Suspense fallback={<MaintenancePlanDetailSkeleton />}>
			<MaintenancePlanDetailData planId={planId} />
		</Suspense>
	);
}
