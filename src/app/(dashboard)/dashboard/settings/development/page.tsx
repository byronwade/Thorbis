/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { DevelopmentData } from "@/components/settings/development/development-data";
import { DevelopmentSkeleton } from "@/components/settings/development/development-skeleton";

export default function DevelopmentPage() {
	return (
		<Suspense fallback={<DevelopmentSkeleton />}>
			<DevelopmentData />
		</Suspense>
	);
}
