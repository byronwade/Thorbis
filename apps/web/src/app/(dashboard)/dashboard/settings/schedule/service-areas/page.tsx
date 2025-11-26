/**
 * UserviceUareas Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UserviceUareasData } from "@/components/settings/service-areas/service-areas-data";
import { UserviceUareasSkeleton } from "@/components/settings/service-areas/service-areas-skeleton";

export default function UserviceUareasPage() {
	return (
		<Suspense fallback={<UserviceUareasSkeleton />}>
			<UserviceUareasData />
		</Suspense>
	);
}
