/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AiData } from "@/components/ai/main-data";
import { AiSkeleton } from "@/components/ai/main-skeleton";

export default function AiPage() {
	return (
		<Suspense fallback={<AiSkeleton />}>
			<AiData />
		</Suspense>
	);
}
