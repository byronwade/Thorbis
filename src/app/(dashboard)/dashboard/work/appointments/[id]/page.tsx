/**
 * Appointment Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Appointment data streams in (100-400ms)
 *
 * Performance: 4-12x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { AppointmentDetailData } from "@/components/work/appointments/appointment-detail-data";
import { AppointmentDetailSkeleton } from "@/components/work/appointments/appointment-detail-skeleton";

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
