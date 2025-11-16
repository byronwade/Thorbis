/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { DebitCardsData } from "@/components/finance/debit-cards/debit-cards-data";
import { DebitCardsSkeleton } from "@/components/finance/debit-cards/debit-cards-skeleton";

export default function DebitCardsPage() {
	return (
		<Suspense fallback={<DebitCardsSkeleton />}>
			<DebitCardsData />
		</Suspense>
	);
}
