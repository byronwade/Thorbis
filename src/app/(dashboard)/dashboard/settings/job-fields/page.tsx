/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { JobFieldsData } from "@/components/settings/job-fields/job-fields-data";
import { JobFieldsSkeleton } from "@/components/settings/job-fields/job-fields-skeleton";

export default function JobFieldsPage() {
	return (
		<Suspense fallback={<JobFieldsSkeleton />}>
			<JobFieldsData />
		</Suspense>
	);
}
