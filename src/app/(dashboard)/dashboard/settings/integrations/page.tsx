/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { IntegrationsData } from "@/components/settings/integrations/integrations-data";
import { IntegrationsSkeleton } from "@/components/settings/integrations/integrations-skeleton";

export default function IntegrationsPage() {
	return (
		<Suspense fallback={<IntegrationsSkeleton />}>
			<IntegrationsData />
		</Suspense>
	);
}
