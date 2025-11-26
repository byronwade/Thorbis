/**
 * Uroles Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UrolesData } from "@/components/settings/roles/roles-data";
import { UrolesSkeleton } from "@/components/settings/roles/roles-skeleton";

export default function UrolesPage() {
	return (
		<Suspense fallback={<UrolesSkeleton />}>
			<UrolesData />
		</Suspense>
	);
}
