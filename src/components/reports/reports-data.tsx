/**
 * Reports Data - Async Server Component
 *
 * Displays the main business intelligence analytics dashboard.
 * This component is wrapped in Suspense for PPR pattern.
 *
 * Production: Shows Coming Soon shell
 * Development: Shows full analytics dashboard
 */

import { BarChart3 } from "lucide-react";
import { AnalyticsOverview } from "@/components/reports/analytics-overview";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

const isProduction = process.env.NODE_ENV === "production";

export async function ReportsData() {
	// Show Coming Soon in production, full dashboard in development
	if (isProduction) {
		return (
			<ComingSoonShell
				description="Generate comprehensive reports, track KPIs, and gain actionable insights"
				icon={BarChart3}
				title="Business Intelligence"
			/>
		);
	}

	return <AnalyticsOverview />;
}
