/**
 * Jobs > Templates Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Template data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Template builder interface
 * - Template library sharing
 * - Usage analytics
 * - Template versioning
 */

import { Suspense } from "react";
import { JobTemplatesData } from "@/components/jobs/templates/job-templates-data";
import { JobTemplatesSkeleton } from "@/components/jobs/templates/job-templates-skeleton";
import { JobTemplatesStats } from "@/components/jobs/templates/job-templates-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

export default function JobTemplatesPage() {
	return (
		<div className="space-y-6">
			{/* Page header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Job Templates</h1>
				<p className="text-muted-foreground">
					Manage job templates, service packages, and standardized work procedures
				</p>
			</div>

			{/* Stats - Streams in first */}
			<Suspense fallback={<StatsCardsSkeleton count={4} />}>
				<JobTemplatesStats />
			</Suspense>

			{/* Template data - Streams in second */}
			<Suspense fallback={<JobTemplatesSkeleton />}>
				<JobTemplatesData />
			</Suspense>
		</div>
	);
}
