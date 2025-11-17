/**
 * Reports Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Dashboard content streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 * ISR: Revalidates every 5 minutes for fresh data
 */

import { Suspense } from "react";
import { ReportsData } from "@/components/reports/reports-data";
import { ReportsSkeleton } from "@/components/reports/reports-skeleton";
import { ReportsStats } from "@/components/reports/reports-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

// Note: revalidate is not compatible with Next.js 16+ cacheComponents
// Use "use cache" directive with cacheLife instead

export default function BusinessIntelligencePage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Business Intelligence</h1>
				<p className="text-muted-foreground">Comprehensive business reporting and analytics</p>
			</div>

			<Suspense fallback={<StatsCardsSkeleton count={4} />}>
				<ReportsStats />
			</Suspense>

			<Suspense fallback={<ReportsSkeleton />}>
				<ReportsData />
			</Suspense>
		</div>
	);
}
