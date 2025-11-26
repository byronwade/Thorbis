/**
 * Reporting Data - Main Reporting Page Content
 *
 * Production: Shows Coming Soon shell
 * Development: Shows full analytics dashboard with toolbar
 */

import { BarChart3 } from "lucide-react";
import { AnalyticsOverview } from "@/components/reports/analytics-overview";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { ReportingPageWrapper } from "./reporting-page-wrapper";

const isProduction = process.env.NODE_ENV === "production";

export async function ReportingData() {
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

	return (
		<ReportingPageWrapper>
			<AnalyticsOverview />
		</ReportingPageWrapper>
	);
}
