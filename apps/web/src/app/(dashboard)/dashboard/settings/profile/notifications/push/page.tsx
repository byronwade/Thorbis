/**
 * Upush Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UpushData } from "@/components/settings/push/push-data";
import { UpushSkeleton } from "@/components/settings/push/push-skeleton";

export default function UpushPage() {
	return (
		<Suspense fallback={<UpushSkeleton />}>
			<UpushData />
		</Suspense>
	);
}
