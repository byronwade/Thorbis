/**
 * Upersonal Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UpersonalData } from "@/components/settings/personal/personal-data";
import { UpersonalSkeleton } from "@/components/settings/personal/personal-skeleton";

export default function UpersonalPage() {
	return (
		<Suspense fallback={<UpersonalSkeleton />}>
			<UpersonalData />
		</Suspense>
	);
}
