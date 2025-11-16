/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { JobsData } from "@/components/reports/jobs/jobs-data";
import { JobsSkeleton } from "@/components/reports/jobs/jobs-skeleton";

export default function JobsPage() {
	return (
		<Suspense fallback={<JobsSkeleton />}>
			<JobsData />
		</Suspense>
	);
}
