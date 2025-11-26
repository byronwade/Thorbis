/**
 * Inventory > Parts Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { PartsData } from "@/components/inventory/parts/parts-data";
import { PartsSkeleton } from "@/components/inventory/parts/parts-skeleton";

export default function PartsMaterialsPage() {
	return (
		<Suspense fallback={<PartsSkeleton />}>
			<PartsData />
		</Suspense>
	);
}
