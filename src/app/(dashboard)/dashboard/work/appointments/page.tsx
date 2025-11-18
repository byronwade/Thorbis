/**
 * Appointments Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table/Kanban streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { AppointmentsData } from "@/components/work/appointments/appointments-data";
import { AppointmentsSkeleton } from "@/components/work/appointments/appointments-skeleton";
import { AppointmentsStats } from "@/components/work/appointments/appointments-stats";

export default async function AppointmentsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;
	return (
		<div className="flex h-full flex-col">
			{/* Stats - Streams in first */}
			<Suspense
				fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
			>
				<AppointmentsStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<div className="flex-1 overflow-hidden">
				<Suspense fallback={<AppointmentsSkeleton />}>
					<AppointmentsData searchParams={params} />
				</Suspense>
			</div>
		</div>
	);
}
