/**
 * Appointment Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Appointment data streams in (100-400ms)
 */

import { Suspense } from "react";
import { AppointmentDetailData } from "@/components/appointments/appointment-detail-data";
import { AppointmentDetailSkeleton } from "@/components/appointments/appointment-detail-skeleton";

export default async function AppointmentDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: appointmentId } = await params;

	return (
		<Suspense fallback={<AppointmentDetailSkeleton />}>
			<AppointmentDetailData appointmentId={appointmentId} />
		</Suspense>
	);
}
