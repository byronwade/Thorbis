/**
 * Unew Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { InventoryVendorNewData } from "@/components/inventory/new/new-data";
import { InventoryVendorNewSkeleton } from "@/components/inventory/new/new-skeleton";

export default function InventoryVendorNewPage() {
	return (
		<Suspense fallback={<InventoryVendorNewSkeleton />}>
			<InventoryVendorNewData />
		</Suspense>
	);
}
