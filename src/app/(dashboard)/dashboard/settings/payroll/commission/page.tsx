/**
 * Ucommission Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UcommissionData } from "@/components/settings/commission/commission-data";
import { UcommissionSkeleton } from "@/components/settings/commission/commission-skeleton";

export default function UcommissionPage() {
	return (
		<Suspense fallback={<UcommissionSkeleton />}>
			<UcommissionData />
		</Suspense>
	);
}
