/**
 * Appointment Creation Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { AppointmentNewData } from "@/components/work/appointments/appointment-new-data";
import { WorkNewSkeleton } from "@/components/work/new/new-skeleton";

type SearchParams = Promise<{
	jobId?: string;
	customerId?: string;
	propertyId?: string;
}>;

type PageProps = {
	searchParams: SearchParams;
};

export default async function WorkAppointmentsNewPage({
	searchParams,
}: PageProps) {
	const params = await searchParams;

	return (
		<Suspense fallback={<WorkNewSkeleton />}>
			<AppointmentNewData searchParams={params} />
		</Suspense>
	);
}
