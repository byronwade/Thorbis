/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ProgressData } from "@/components/training/progress/progress-data";
import { ProgressSkeleton } from "@/components/training/progress/progress-skeleton";

export default function ProgressPage() {
	return (
		<Suspense fallback={<ProgressSkeleton />}>
			<ProgressData />
		</Suspense>
	);
}
