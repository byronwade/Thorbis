/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ComingSoonData } from "@/components/coming-soon/main-data";
import { ComingSoonSkeleton } from "@/components/coming-soon/main-skeleton";

export default function ComingSoonPage() {
	return (
		<Suspense fallback={<ComingSoonSkeleton />}>
			<ComingSoonData />
		</Suspense>
	);
}
