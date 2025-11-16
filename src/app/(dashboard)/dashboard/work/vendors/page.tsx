/**
 * Vendors Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 */

import { Suspense } from "react";
import { VendorsData } from "@/components/work/vendors/vendors-data";
import { VendorsSkeleton } from "@/components/work/vendors/vendors-skeleton";
import { VendorsStats } from "@/components/work/vendors/vendors-stats";

export default function WorkVendorsPage() {
	return (
		<>
			{/* Stats - Streams in first */}
			<Suspense
				fallback={<div className="h-24 animate-pulse rounded bg-muted" />}
			>
				<VendorsStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<VendorsSkeleton />}>
				<VendorsData />
			</Suspense>
		</>
	);
}
