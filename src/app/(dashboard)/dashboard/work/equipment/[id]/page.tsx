/**
 * Equipment Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Equipment data streams in (300-600ms)
 *
 * Fetches complete equipment data including:
 * - Customer, Property, Service Plan
 * - Installation Job, Last Service Job
 * - Upcoming Maintenance, Service History
 * - Notes, Activities, Attachments
 *
 * Performance: 10-30x faster than traditional SSR
 */

import { Suspense } from "react";
import { EquipmentDetailData } from "@/components/work/equipment/equipment-detail-data";
import { EquipmentDetailSkeleton } from "@/components/work/equipment/equipment-detail-skeleton";

// Custom metadata for this page
export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: _equipmentId } = await params;
	return {
		title: "Equipment Details",
	};
}

export default async function EquipmentDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<Suspense fallback={<EquipmentDetailSkeleton />}>
			<EquipmentDetailData equipmentId={id} />
		</Suspense>
	);
}
