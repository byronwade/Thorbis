/**
 * Internal Analytics Dashboard Page
 *
 * Displays comprehensive internal API, action, and communication analytics.
 * Admin-only access for monitoring system health and performance.
 */

import { Suspense } from "react";
import { AnalyticsData } from "@/components/analytics/analytics-data";
import { InternalAnalyticsSkeleton } from "@/components/analytics/internal-analytics-skeleton";

// Force dynamic rendering - this page requires authentication and real-time data
export const dynamic = "force-dynamic";

export const metadata = {
	title: "Internal Analytics | Settings",
	description:
		"Monitor internal API calls, server actions, AI usage, and communication metrics",
};

export default function InternalAnalyticsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Internal Analytics</h1>
				<p className="text-muted-foreground">
					Monitor API calls, server actions, AI usage, and communication metrics
				</p>
			</div>

			<Suspense fallback={<InternalAnalyticsSkeleton />}>
				<AnalyticsData />
			</Suspense>
		</div>
	);
}
