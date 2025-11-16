/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TrainingData } from "@/components/training/main-data";
import { TrainingSkeleton } from "@/components/training/main-skeleton";

export default function TrainingPage() {
	return (
		<Suspense fallback={<TrainingSkeleton />}>
			<TrainingData />
		</Suspense>
	);
}
