/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BonusesData } from "@/components/settings/bonuses/bonuses-data";
import { BonusesSkeleton } from "@/components/settings/bonuses/bonuses-skeleton";

export default function BonusesPage() {
	return (
		<Suspense fallback={<BonusesSkeleton />}>
			<BonusesData />
		</Suspense>
	);
}
