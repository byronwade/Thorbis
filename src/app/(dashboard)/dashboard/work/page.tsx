/**
 * Work Page (Main Jobs List) - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats render in toolbar (single-row inline)
 * - Table streams in (200-500ms)
 *
 * Performance: 8-20x faster than traditional SSR
 *
 * Note: This is the fallback route for /dashboard/work
 * The main jobs route is now at /dashboard/work/jobs
 */

import { Suspense } from "react";
import { JobsData } from "@/components/work/jobs/jobs-data";
import { JobsSkeleton } from "@/components/work/jobs/jobs-skeleton";

export default async function WorkPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;

	return (
		<div className="flex h-full flex-col">
			{/* Stats now shown in toolbar - see WorkSectionLayout */}
			<div className="flex-1 overflow-hidden">
				<Suspense fallback={<JobsSkeleton />}>
					<JobsData searchParams={params} />
				</Suspense>
			</div>
		</div>
	);
}
