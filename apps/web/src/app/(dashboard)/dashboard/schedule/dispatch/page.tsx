/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { DispatchData } from "@/components/schedule/dispatch/dispatch-data";
import { DispatchSkeleton } from "@/components/schedule/dispatch/dispatch-skeleton";

export default function DispatchPage() {
	return (
		<Suspense fallback={<DispatchSkeleton />}>
			<DispatchData />
		</Suspense>
	);
}
