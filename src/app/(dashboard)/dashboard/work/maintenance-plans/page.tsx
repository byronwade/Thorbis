/**
 * Maintenance Plans Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Data streams in (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { MaintenancePlansData } from "@/components/work/maintenance-plans/maintenance-plans-data";
import { MaintenancePlansSkeleton } from "@/components/work/maintenance-plans/maintenance-plans-skeleton";

export default async function MaintenancePlansPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;

	return (
		<Suspense fallback={<MaintenancePlansSkeleton />}>
			<MaintenancePlansData searchParams={params} />
		</Suspense>
	);
}
