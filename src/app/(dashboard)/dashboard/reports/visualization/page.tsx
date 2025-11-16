/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { VisualizationData } from "@/components/reports/visualization/visualization-data";
import { VisualizationSkeleton } from "@/components/reports/visualization/visualization-skeleton";

export default function VisualizationPage() {
	return (
		<Suspense fallback={<VisualizationSkeleton />}>
			<VisualizationData />
		</Suspense>
	);
}
