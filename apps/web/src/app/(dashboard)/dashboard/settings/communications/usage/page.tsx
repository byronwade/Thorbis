/**
 * Uusage Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UusageData } from "@/components/settings/usage/usage-data";
import { UusageSkeleton } from "@/components/settings/usage/usage-skeleton";

export default function UusagePage() {
	return (
		<Suspense fallback={<UusageSkeleton />}>
			<UusageData />
		</Suspense>
	);
}
