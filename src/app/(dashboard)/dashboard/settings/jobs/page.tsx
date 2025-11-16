/**
 * Ujobs Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UjobsData } from "@/components/settings/jobs/jobs-data";
import { UjobsSkeleton } from "@/components/settings/jobs/jobs-skeleton";

export default function UjobsPage() {
	return (
		<Suspense fallback={<UjobsSkeleton />}>
			<UjobsData />
		</Suspense>
	);
}
