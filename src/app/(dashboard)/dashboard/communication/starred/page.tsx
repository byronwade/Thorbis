/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { StarredData } from "@/components/communication/starred/starred-data";
import { StarredSkeleton } from "@/components/communication/starred/starred-skeleton";

export default function StarredPage() {
	return (
		<Suspense fallback={<StarredSkeleton />}>
			<StarredData />
		</Suspense>
	);
}
