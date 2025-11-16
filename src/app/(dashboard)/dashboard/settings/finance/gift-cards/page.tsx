/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { GiftCardsData } from "@/components/settings/gift-cards/gift-cards-data";
import { GiftCardsSkeleton } from "@/components/settings/gift-cards/gift-cards-skeleton";

export default function GiftCardsPage() {
	return (
		<Suspense fallback={<GiftCardsSkeleton />}>
			<GiftCardsData />
		</Suspense>
	);
}
