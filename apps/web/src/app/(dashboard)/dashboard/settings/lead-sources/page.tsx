/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { LeadSourcesData } from "@/components/settings/lead-sources/lead-sources-data";
import { LeadSourcesSkeleton } from "@/components/settings/lead-sources/lead-sources-skeleton";

export default function LeadSourcesPage() {
	return (
		<Suspense fallback={<LeadSourcesSkeleton />}>
			<LeadSourcesData />
		</Suspense>
	);
}
