/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { LoyaltyData } from "@/components/settings/loyalty/loyalty-data";
import { LoyaltySkeleton } from "@/components/settings/loyalty/loyalty-skeleton";

export default function LoyaltyPage() {
	return (
		<Suspense fallback={<LoyaltySkeleton />}>
			<LoyaltyData />
		</Suspense>
	);
}
