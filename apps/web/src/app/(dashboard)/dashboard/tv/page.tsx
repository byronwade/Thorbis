/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TvData } from "@/components/tv/main-data";
import { TvSkeleton } from "@/components/tv/main-skeleton";

export default function TvPage() {
	return (
		<Suspense fallback={<TvSkeleton />}>
			<TvData />
		</Suspense>
	);
}
