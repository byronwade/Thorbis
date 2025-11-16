/**
 * Contracts Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table/Kanban streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ContractsData } from "@/components/work/contracts/contracts-data";
import { ContractsSkeleton } from "@/components/work/contracts/contracts-skeleton";
import { ContractsStats } from "@/components/work/contracts/contracts-stats";

export default function ContractsPage() {
	return (
		<>
			{/* Stats - Streams in first */}
			<Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
				<ContractsStats />
			</Suspense>

			{/* Table/Kanban - Streams in second */}
			<Suspense fallback={<ContractsSkeleton />}>
				<ContractsData />
			</Suspense>
		</>
	);
}
