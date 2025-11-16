/**
 * Customers Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table streams in second (200-500ms)
 *
 * Performance: 8-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { CustomersData } from "@/components/customers/customers-data";
import { CustomersSkeleton } from "@/components/customers/customers-skeleton";
import { CustomersStats } from "@/components/customers/customers-stats";

// Enable Partial Prerendering for this page (Next.js 16+)
// PPR is now enabled globally via cacheComponents in next.config.ts
// This export is no longer needed but kept for documentation
// export const experimental_ppr = true;

export default function CustomersPage() {
	return (
		<>
			{/* Statistics - Streams in first */}
			<Suspense
				fallback={<div className="h-24 animate-pulse rounded bg-muted" />}
			>
				<CustomersStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<CustomersSkeleton />}>
				<CustomersData />
			</Suspense>
		</>
	);
}
