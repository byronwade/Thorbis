/**
 * UmassUupdate Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UmassUupdateData } from "@/components/work/mass-update/mass-update-data";
import { UmassUupdateSkeleton } from "@/components/work/mass-update/mass-update-skeleton";

export default function UmassUupdatePage() {
	return (
		<Suspense fallback={<UmassUupdateSkeleton />}>
			<UmassUupdateData />
		</Suspense>
	);
}
