"use client";

import { CommunicationSidebar } from "@/components/communication/communication-sidebar";
import { getCommunicationReportsSidebarConfig } from "@/lib/communication/communication-reports-sidebar-config";
import type { ComponentProps } from "react";

/**
 * CommunicationReportsSidebar - Sidebar for communication statistics and reports
 * 
 * Displays different report types users can view:
 * - Overview reports (Dashboard, Activity Summary)
 * - Channel Analytics (Email, SMS, Calls)
 * - Performance Metrics (Response Times, Team Performance, Trends)
 * - Distribution reports (Channel Distribution, Time Series)
 */
export function CommunicationReportsSidebar(
	props: ComponentProps<typeof CommunicationSidebar>
) {
	const config = getCommunicationReportsSidebarConfig();

	return <CommunicationSidebar config={config} {...props} />;
}







