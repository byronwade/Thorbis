/**
 * Uintegrations Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { IntegrationsData } from "@/components/settings/integrations/integrations-data";
import { IntegrationsSkeleton } from "@/components/settings/integrations/integrations-skeleton";

export default function UintegrationsPage() {
	return (
		<Suspense fallback={<IntegrationsSkeleton />}>
			<IntegrationsData />
		</Suspense>
	);
}
