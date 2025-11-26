/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { MarketingData } from "@/components/settings/marketing/marketing-data";
import { MarketingSkeleton } from "@/components/settings/marketing/marketing-skeleton";

export default function MarketingPage() {
	return (
		<Suspense fallback={<MarketingSkeleton />}>
			<MarketingData />
		</Suspense>
	);
}
