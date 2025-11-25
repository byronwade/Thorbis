/**
 * New Job Page - PPR Enabled
 *
 * Creates a new job/work order with optional pre-filled data from:
 * - Schedule (date, startTime, assignTo)
 * - Properties (propertyId)
 * - Customers (customerId)
 * - Equipment (equipmentId)
 * - Team members (teamMemberId)
 * - Clone from existing job (cloneFrom)
 */

import { Suspense } from "react";
import { JobNewData } from "@/components/work/jobs/job-new-data";
import { WorkNewSkeleton } from "@/components/work/new/new-skeleton";

type SearchParams = Promise<{
	date?: string;
	startTime?: string;
	assignTo?: string;
	propertyId?: string;
	customerId?: string;
	equipmentId?: string;
	teamMemberId?: string;
	cloneFrom?: string;
}>;

type PageProps = {
	searchParams: SearchParams;
};

export default async function WorkNewPage({ searchParams }: PageProps) {
	const params = await searchParams;

	return (
		<Suspense fallback={<WorkNewSkeleton />}>
			<JobNewData searchParams={params} />
		</Suspense>
	);
}
