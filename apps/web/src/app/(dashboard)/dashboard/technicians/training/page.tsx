/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TrainingData } from "@/components/technicians/training/training-data";
import { TrainingSkeleton } from "@/components/technicians/training/training-skeleton";

export default function TrainingPage() {
	return (
		<Suspense fallback={<TrainingSkeleton />}>
			<TrainingData />
		</Suspense>
	);
}
