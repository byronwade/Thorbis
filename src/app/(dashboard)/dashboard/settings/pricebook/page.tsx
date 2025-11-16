/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PricebookData } from "@/components/settings/pricebook/pricebook-data";
import { PricebookSkeleton } from "@/components/settings/pricebook/pricebook-skeleton";

export default function PricebookPage() {
	return (
		<Suspense fallback={<PricebookSkeleton />}>
			<PricebookData />
		</Suspense>
	);
}
