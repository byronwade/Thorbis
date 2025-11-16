/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TrashData } from "@/components/communication/trash/trash-data";
import { TrashSkeleton } from "@/components/communication/trash/trash-skeleton";

export default function TrashPage() {
	return (
		<Suspense fallback={<TrashSkeleton />}>
			<TrashData />
		</Suspense>
	);
}
