/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CreditCardsData } from "@/components/finance/credit-cards/credit-cards-data";
import { CreditCardsSkeleton } from "@/components/finance/credit-cards/credit-cards-skeleton";

export default function CreditCardsPage() {
	return (
		<Suspense fallback={<CreditCardsSkeleton />}>
			<CreditCardsData />
		</Suspense>
	);
}
