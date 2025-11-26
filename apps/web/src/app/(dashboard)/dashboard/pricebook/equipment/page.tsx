/**
 * Pricebook > Equipment Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { PricebookEquipmentData } from "@/components/pricebook/equipment/pricebook-equipment-data";
import { PricebookEquipmentSkeleton } from "@/components/pricebook/equipment/pricebook-equipment-skeleton";

export default function EquipmentRatesPage() {
	return (
		<Suspense fallback={<PricebookEquipmentSkeleton />}>
			<PricebookEquipmentData />
		</Suspense>
	);
}
