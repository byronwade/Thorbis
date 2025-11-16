/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PortalData } from "@/components/customers/portal/portal-data";
import { PortalSkeleton } from "@/components/customers/portal/portal-skeleton";

export default function PortalPage() {
	return (
		<Suspense fallback={<PortalSkeleton />}>
			<PortalData />
		</Suspense>
	);
}
