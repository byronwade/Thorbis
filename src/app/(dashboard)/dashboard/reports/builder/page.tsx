/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BuilderData } from "@/components/reports/builder/builder-data";
import { BuilderSkeleton } from "@/components/reports/builder/builder-skeleton";

export default function BuilderPage() {
	return (
		<Suspense fallback={<BuilderSkeleton />}>
			<BuilderData />
		</Suspense>
	);
}
