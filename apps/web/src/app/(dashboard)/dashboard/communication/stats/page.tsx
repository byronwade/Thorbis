/**
 * Communication Statistics Dashboard - Server Component with ISR
 *
 * Displays charts and statistics for all communication channels
 * Supports different report views via URL query parameters
 *
 * Uses ISR (Incremental Static Regeneration) instead of client-side polling:
 * - Data fetched server-side and cached
 * - Auto-revalidates every 5 minutes
 * - No client-side polling/setInterval
 *
 * Route: /dashboard/communication/stats
 */

import { Suspense } from "react";
import { getCommunicationStatsAction } from "@/actions/communication-stats-actions";
import { CommunicationStatsDashboard } from "@/components/communication/communication-stats-dashboard";
import { CommunicationStatsSkeleton } from "@/components/communication/communication-stats-skeleton";

// ISR: Revalidate every 5 minutes (replaces 5-minute client-side polling)
export const revalidate = 300;

type SearchParams = Promise<{
	report?: string;
}>;

async function StatsData({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const report = params?.report || "overview";

	// Fetch stats server-side
	const result = await getCommunicationStatsAction(30);

	if (!result.success || !result.data) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="text-lg font-semibold text-destructive">
						Error loading statistics
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						{result.error || "No data available"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<CommunicationStatsDashboard
			initialStats={result.data}
			initialReport={report}
		/>
	);
}

export default async function CommunicationStatsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<div className="flex w-full flex-col">
			<Suspense fallback={<CommunicationStatsSkeleton />}>
				<StatsData searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
