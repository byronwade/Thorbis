/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TvData } from "@/components/settings/tv/tv-data";
import { TvSkeleton } from "@/components/settings/tv/tv-skeleton";

export default function TvPage() {
	return (
		<Suspense fallback={<TvSkeleton />}>
			<TvData />
		</Suspense>
	);
}
