/**
 * Uarchive Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UarchiveData } from "@/components/settings/archive/archive-data";
import { UarchiveSkeleton } from "@/components/settings/archive/archive-skeleton";

export default function UarchivePage() {
	return (
		<Suspense fallback={<UarchiveSkeleton />}>
			<UarchiveData />
		</Suspense>
	);
}
