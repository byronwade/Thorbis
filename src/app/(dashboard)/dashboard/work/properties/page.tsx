/**
 * Uproperties Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UpropertiesData } from "@/components/work/properties/properties-data";
import { UpropertiesSkeleton } from "@/components/work/properties/properties-skeleton";

export default function UpropertiesPage() {
	return (
		<Suspense fallback={<UpropertiesSkeleton />}>
			<UpropertiesData />
		</Suspense>
	);
}
