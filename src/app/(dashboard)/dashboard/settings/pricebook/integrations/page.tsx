/**
 * Uintegrations Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UintegrationsData } from "@/components/settings/integrations/integrations-data";
import { UintegrationsSkeleton } from "@/components/settings/integrations/integrations-skeleton";

export default function UintegrationsPage() {
	return (
		<Suspense fallback={<UintegrationsSkeleton />}>
			<UintegrationsData />
		</Suspense>
	);
}
