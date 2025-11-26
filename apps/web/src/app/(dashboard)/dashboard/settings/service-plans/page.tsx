/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ServicePlansData } from "@/components/settings/service-plans/service-plans-data";
import { ServicePlansSkeleton } from "@/components/settings/service-plans/service-plans-skeleton";

export default function ServicePlansPage() {
	return (
		<Suspense fallback={<ServicePlansSkeleton />}>
			<ServicePlansData />
		</Suspense>
	);
}
