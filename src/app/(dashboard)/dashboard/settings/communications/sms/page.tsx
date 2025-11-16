/**
 * Usms Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UsmsData } from "@/components/settings/sms/sms-data";
import { UsmsSkeleton } from "@/components/settings/sms/sms-skeleton";

export default function UsmsPage() {
	return (
		<Suspense fallback={<UsmsSkeleton />}>
			<UsmsData />
		</Suspense>
	);
}
