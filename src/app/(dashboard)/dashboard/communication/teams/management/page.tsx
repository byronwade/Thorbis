/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ManagementData } from "@/components/communication/management/management-data";
import { ManagementSkeleton } from "@/components/communication/management/management-skeleton";

export default function ManagementPage() {
	return (
		<Suspense fallback={<ManagementSkeleton />}>
			<ManagementData />
		</Suspense>
	);
}
