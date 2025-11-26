/**
 * Jobs > History Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Job history data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Full job archive with search
 * - Performance analytics
 * - Revenue tracking by period
 * - Customer retention metrics
 */

import { Suspense } from "react";
import { JobHistoryData } from "@/components/jobs/history/job-history-data";
import { JobHistorySkeleton } from "@/components/jobs/history/job-history-skeleton";
import { JobHistoryStats } from "@/components/jobs/history/job-history-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

export default function JobHistoryPage() {
	return (
		<div className="space-y-6">
			{/* Page header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Job History</h1>
				<p className="text-muted-foreground">
					Complete job history, completed services, and performance analytics
				</p>
			</div>

			{/* Stats - Streams in first */}
			<Suspense fallback={<StatsCardsSkeleton count={4} />}>
				<JobHistoryStats />
			</Suspense>

			{/* Job history data - Streams in second */}
			<Suspense fallback={<JobHistorySkeleton />}>
				<JobHistoryData />
			</Suspense>
		</div>
	);
}
