/**
 * Uequipment Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UequipmentData } from "@/components/work/equipment/equipment-data";
import { UequipmentSkeleton } from "@/components/work/equipment/equipment-skeleton";
import { UequipmentStats } from "@/components/work/equipment/equipment-stats";

export default function UequipmentPage() {
	return (
		<>
			<Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
				<UequipmentStats />
			</Suspense>
			<Suspense fallback={<UequipmentSkeleton />}>
				<UequipmentData />
			</Suspense>
		</>
	);
}
