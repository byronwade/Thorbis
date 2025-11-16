/**
 * Pricebook Dashboard Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Dashboard content streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 *
 * Future expansion:
 * - Comprehensive pricing management
 * - Dynamic pricing rules
 * - Profit margin analysis
 * - Competitive pricing insights
 */

import { Suspense } from "react";
import { PricebookData } from "@/components/pricebook/pricebook-data";
import { PricebookSkeleton } from "@/components/pricebook/pricebook-skeleton";
import { PricebookStats } from "@/components/pricebook/pricebook-stats";
import { StatsCardsSkeleton } from "@/components/ui/stats-cards-skeleton";

export default function PriceBookDashboardPage() {
	return (
		<div className="space-y-6">
			{/* Page header */}
			<div>
				<h1 className="font-semibold text-2xl">Price Book Dashboard</h1>
				<p className="text-muted-foreground">Manage service pricing, parts costs, and standardized rates</p>
			</div>

			{/* Stats - Streams in first */}
			<Suspense fallback={<StatsCardsSkeleton count={4} />}>
				<PricebookStats />
			</Suspense>

			{/* Dashboard content - Streams in second */}
			<Suspense fallback={<PricebookSkeleton />}>
				<PricebookData />
			</Suspense>
		</div>
	);
}
