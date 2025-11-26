/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { OvertimeData } from "@/components/settings/overtime/overtime-data";
import { OvertimeSkeleton } from "@/components/settings/overtime/overtime-skeleton";

export default function OvertimePage() {
	return (
		<Suspense fallback={<OvertimeSkeleton />}>
			<OvertimeData />
		</Suspense>
	);
}
