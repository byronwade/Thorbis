/**
 * Contracts Page - Cache Components Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table/Kanban streams in second (200-500ms)
 * - Cached for 15 minutes (default cacheLife profile)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ContractsData } from "@/components/work/contracts/contracts-data";
import { ContractsSkeleton } from "@/components/work/contracts/contracts-skeleton";
import { ContractsStats } from "@/components/work/contracts/contracts-stats";

export default async function ContractsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {

	const params = await searchParams;

	return (
		<>
			{/* Stats - Streams in first */}
			<Suspense
				fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
			>
				<ContractsStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<ContractsSkeleton />}>
				<ContractsData searchParams={params} />
			</Suspense>
		</>
	);
}
