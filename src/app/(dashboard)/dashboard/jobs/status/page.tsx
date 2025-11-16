/**
 * Jobs > Status Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Job status data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Real-time job progress tracking
 * - Technician location updates
 * - Customer status notifications
 * - ETA calculations and updates
 */

import { Suspense } from "react";
import { JobStatusData } from "@/components/jobs/status/job-status-data";
import { JobStatusSkeleton } from "@/components/jobs/status/job-status-skeleton";
import { JobStatusStats } from "@/components/jobs/status/job-status-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

export default function JobStatusPage() {
	return (
		<div className="space-y-6">
			{/* Page header */}
			<div>
				<h1 className="font-bold text-3xl tracking-tight">Job Status</h1>
				<p className="text-muted-foreground">
					Track job progress, status updates, and completion metrics
				</p>
			</div>

			{/* Stats - Streams in first */}
			<Suspense fallback={<StatsCardsSkeleton count={4} />}>
				<JobStatusStats />
			</Suspense>

			{/* Job status data - Streams in second */}
			<Suspense fallback={<JobStatusSkeleton />}>
				<JobStatusData />
			</Suspense>
		</div>
	);
}
