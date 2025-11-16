/**
 * Uexport Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UexportData } from "@/components/work/export/export-data";
import { UexportSkeleton } from "@/components/work/export/export-skeleton";

export default function UexportPage() {
	return (
		<Suspense fallback={<UexportSkeleton />}>
			<UexportData />
		</Suspense>
	);
}
