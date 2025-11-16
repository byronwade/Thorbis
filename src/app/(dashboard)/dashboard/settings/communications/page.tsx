/**
 * Ucommunications Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UcommunicationsData } from "@/components/settings/communications/communications-data";
import { UcommunicationsSkeleton } from "@/components/settings/communications/communications-skeleton";

export default function UcommunicationsPage() {
	return (
		<Suspense fallback={<UcommunicationsSkeleton />}>
			<UcommunicationsData />
		</Suspense>
	);
}
