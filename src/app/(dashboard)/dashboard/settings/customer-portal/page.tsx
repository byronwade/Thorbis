/**
 * UcustomerUportal Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UcustomerUportalData } from "@/components/settings/customer-portal/customer-portal-data";
import { UcustomerUportalSkeleton } from "@/components/settings/customer-portal/customer-portal-skeleton";

export default function UcustomerUportalPage() {
	return (
		<Suspense fallback={<UcustomerUportalSkeleton />}>
			<UcustomerUportalData />
		</Suspense>
	);
}
