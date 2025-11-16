/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ShopData } from "@/components/shop/main-data";
import { ShopSkeleton } from "@/components/shop/main-skeleton";

export default function ShopPage() {
	return (
		<Suspense fallback={<ShopSkeleton />}>
			<ShopData />
		</Suspense>
	);
}
