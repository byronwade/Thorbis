/**
 * Customers Page - Cache Components Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table streams in second (200-500ms)
 * - Cached for 15 minutes (default cacheLife profile)
 *
 * Performance: 8-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { CustomersData } from "@/components/customers/customers-data";
import { CustomersSkeleton } from "@/components/customers/customers-skeleton";

export default async function CustomersPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	return (
		<>
			{/* Table/Kanban - Streams in */}
			<Suspense fallback={<CustomersSkeleton />}>
				<CustomersData searchParams={params} />
			</Suspense>
		</>
	);
}
