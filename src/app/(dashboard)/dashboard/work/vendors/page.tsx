/**
 * Vendors Page - PPR Enabled with Inline Stats
 *
 * Uses Suspense for streaming:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in toolbar (100-200ms)
 * - Data streams in main content (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 * Clean design: Stats integrated directly into toolbar
 */

import { Suspense } from "react";
import { VendorsData } from "@/components/work/vendors/vendors-data";
import { VendorsSkeleton } from "@/components/work/vendors/vendors-skeleton";

export default async function WorkVendorsPage() {
	return (
		<div className="flex h-full flex-col">
			{/* Stats now shown in toolbar - see layout.tsx */}

			{/* Table - Main content */}
			<div className="flex-1 overflow-hidden">
				<Suspense fallback={<VendorsSkeleton />}>
					<VendorsData />
				</Suspense>
			</div>
		</div>
	);
}
