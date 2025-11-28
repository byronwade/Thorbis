"use client";

/**
 * Reports Toolbar Actions
 *
 * Toolbar actions for the reports/analytics pages including
 * create report, export, schedule, and notifications.
 */

import { Bell, Calendar, Download, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./export-dialog";
import { NotificationPreferencesDialog } from "./notification-preferences-dialog";
import { ScheduleReportDialog } from "./schedule-report-dialog";

interface ReportsToolbarActionsProps {
	reportType?: "revenue" | "jobs" | "financial" | "team" | "customers";
	reportTitle?: string;
	showCreateButton?: boolean;
	showRefresh?: boolean;
	onRefresh?: () => void;
}

export function ReportsToolbarActions({
	reportType = "financial",
	reportTitle = "Report",
	showCreateButton = true,
	showRefresh = false,
	onRefresh,
}: ReportsToolbarActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{showRefresh && (
				<Button variant="ghost" size="icon" onClick={onRefresh}>
					<RefreshCw className="h-4 w-4" />
				</Button>
			)}

			<NotificationPreferencesDialog
				reportType={reportType}
				reportTitle={reportTitle}
				trigger={
					<Button variant="ghost" size="icon">
						<Bell className="h-4 w-4" />
					</Button>
				}
			/>

			<ScheduleReportDialog
				reportType={reportType}
				reportTitle={reportTitle}
				trigger={
					<Button variant="outline" size="sm">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule
					</Button>
				}
			/>

			<ExportDialog
				reportType={reportType}
				reportTitle={reportTitle}
				trigger={
					<Button variant="outline" size="sm">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				}
			/>

			{showCreateButton && (
				<Button size="sm" asChild>
					<Link href="/dashboard/reports/builder">
						<Plus className="mr-2 h-4 w-4" />
						Create Report
					</Link>
				</Button>
			)}
		</div>
	);
}

/**
 * Simplified toolbar for report detail pages
 */
function ReportDetailToolbarActions({
	reportType = "financial",
	reportTitle = "Report",
}: {
	reportType?: "revenue" | "jobs" | "financial" | "team" | "customers";
	reportTitle?: string;
}) {
	return (
		<div className="flex items-center gap-2">
			<NotificationPreferencesDialog
				reportType={reportType}
				reportTitle={reportTitle}
				trigger={
					<Button variant="ghost" size="icon">
						<Bell className="h-4 w-4" />
					</Button>
				}
			/>

			<ScheduleReportDialog
				reportType={reportType}
				reportTitle={reportTitle}
				trigger={
					<Button variant="outline" size="sm">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule
					</Button>
				}
			/>

			<ExportDialog reportType={reportType} reportTitle={reportTitle} />
		</div>
	);
}
