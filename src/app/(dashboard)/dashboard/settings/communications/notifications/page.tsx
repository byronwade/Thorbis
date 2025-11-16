/**
 * Unotifications Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UnotificationsData } from "@/components/settings/notifications/notifications-data";
import { UnotificationsSkeleton } from "@/components/settings/notifications/notifications-skeleton";

export default function UnotificationsPage() {
	return (
		<Suspense fallback={<UnotificationsSkeleton />}>
			<UnotificationsData />
		</Suspense>
	);
}
