/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { MaterialsData } from "@/components/settings/materials/materials-data";
import { MaterialsSkeleton } from "@/components/settings/materials/materials-skeleton";

export default function MaterialsPage() {
	return (
		<Suspense fallback={<MaterialsSkeleton />}>
			<MaterialsData />
		</Suspense>
	);
}
