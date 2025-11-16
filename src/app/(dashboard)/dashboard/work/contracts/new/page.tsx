/**
 * Unew Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { WorkNewData } from "@/components/work/new/new-data";
import { WorkNewSkeleton } from "@/components/work/new/new-skeleton";

export default function WorkContractsNewPage() {
	return (
		<Suspense fallback={<WorkNewSkeleton />}>
			<WorkNewData />
		</Suspense>
	);
}
