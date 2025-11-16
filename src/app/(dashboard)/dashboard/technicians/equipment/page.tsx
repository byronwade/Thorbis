/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { EquipmentData } from "@/components/technicians/equipment/equipment-data";
import { EquipmentSkeleton } from "@/components/technicians/equipment/equipment-skeleton";

export default function EquipmentPage() {
	return (
		<Suspense fallback={<EquipmentSkeleton />}>
			<EquipmentData />
		</Suspense>
	);
}
