/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { GasCardsData } from "@/components/settings/gas-cards/gas-cards-data";
import { GasCardsSkeleton } from "@/components/settings/gas-cards/gas-cards-skeleton";

export default function GasCardsPage() {
	return (
		<Suspense fallback={<GasCardsSkeleton />}>
			<GasCardsData />
		</Suspense>
	);
}
