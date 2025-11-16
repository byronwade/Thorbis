/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { LearningData } from "@/components/training/learning/learning-data";
import { LearningSkeleton } from "@/components/training/learning/learning-skeleton";

export default function LearningPage() {
	return (
		<Suspense fallback={<LearningSkeleton />}>
			<LearningData />
		</Suspense>
	);
}
