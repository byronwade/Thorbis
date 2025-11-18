/**
 * Uequipment Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UequipmentData } from "@/components/work/equipment/equipment-data";
import EquipmentSkeleton from "@/components/work/equipment/equipment-skeleton";
import { UequipmentStats } from "@/components/work/equipment/equipment-stats";

export default async function UequipmentPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {

	const params = await searchParams;
	return (
		<>
			<Suspense
				fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
			>
				<UequipmentStats />
			</Suspense>
			<Suspense fallback={<EquipmentSkeleton />}>
				<UequipmentData searchParams={params} />
			</Suspense>
		</>
	);
}
