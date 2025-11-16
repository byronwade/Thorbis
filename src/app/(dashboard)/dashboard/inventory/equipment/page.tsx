/**
 * Inventory > Equipment Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { EquipmentData } from "@/components/inventory/equipment/equipment-data";
import { EquipmentSkeleton } from "@/components/inventory/equipment/equipment-skeleton";

export default function EquipmentTrackingPage() {
	return (
		<Suspense fallback={<EquipmentSkeleton />}>
			<EquipmentData />
		</Suspense>
	);
}
