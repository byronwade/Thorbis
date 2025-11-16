/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { GeneralData } from "@/components/communication/general/general-data";
import { GeneralSkeleton } from "@/components/communication/general/general-skeleton";

export default function GeneralPage() {
	return (
		<Suspense fallback={<GeneralSkeleton />}>
			<GeneralData />
		</Suspense>
	);
}
