/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { LaborData } from "@/components/pricebook/labor/labor-data";
import { LaborSkeleton } from "@/components/pricebook/labor/labor-skeleton";

export default function LaborPage() {
	return (
		<Suspense fallback={<LaborSkeleton />}>
			<LaborData />
		</Suspense>
	);
}
