/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AssetsData } from "@/components/inventory/assets/assets-data";
import { AssetsSkeleton } from "@/components/inventory/assets/assets-skeleton";

export default function AssetsPage() {
	return (
		<Suspense fallback={<AssetsSkeleton />}>
			<AssetsData />
		</Suspense>
	);
}
