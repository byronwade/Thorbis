"use client";

/**
 * Reports Step - Dashboard & Reports Preferences
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
	BarChart3,
	TrendingUp,
	DollarSign,
	Users,
	Calendar,
	Clock,
	Check,
	Star,
	Percent,
	Target,
	Mail,
	FileText,
} from "lucide-react";

interface ReportOption {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
}

const DASHBOARD_WIDGETS: ReportOption[] = [
	{ id: "revenue", title: "Revenue Overview", description: "Daily, weekly, monthly", icon: DollarSign },
	{ id: "jobs_today", title: "Today's Jobs", description: "Scheduled jobs", icon: Calendar },
	{ id: "outstanding_invoices", title: "Outstanding Invoices", description: "Unpaid invoices", icon: FileText },
	{ id: "team_performance", title: "Team Performance", description: "Jobs per tech", icon: Users },
	{ id: "customer_satisfaction", title: "Customer Satisfaction", description: "Ratings & feedback", icon: Star },
	{ id: "conversion_rate", title: "Estimate Conversion", description: "Won vs lost", icon: Percent },
];

const SCHEDULED_REPORTS = [
	{ id: "daily_summary", title: "Daily Summary", frequency: "Every morning" },
	{ id: "weekly_performance", title: "Weekly Performance", frequency: "Every Monday" },
	{ id: "monthly_financial", title: "Monthly Financial", frequency: "1st of month" },
];

export function ReportsStep() {
	const { data, updateData } = useOnboardingStore();
	const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
		data.dashboardWidgets || ["revenue", "jobs_today", "outstanding_invoices", "customer_satisfaction"]
	);
	const [selectedReports, setSelectedReports] = useState<string[]>(
		data.scheduledReports || ["daily_summary", "weekly_performance"]
	);

	const toggleWidget = (widgetId: string) => {
		const updated = selectedWidgets.includes(widgetId)
			? selectedWidgets.filter((w) => w !== widgetId)
			: [...selectedWidgets, widgetId];
		setSelectedWidgets(updated);
		updateData({ dashboardWidgets: updated });
	};

	const toggleReport = (reportId: string) => {
		const updated = selectedReports.includes(reportId)
			? selectedReports.filter((r) => r !== reportId)
			: [...selectedReports, reportId];
		setSelectedReports(updated);
		updateData({ scheduledReports: updated });
	};

	const selectRecommended = () => {
		const recommendedWidgets = ["revenue", "jobs_today", "outstanding_invoices", "customer_satisfaction"];
		const recommendedReports = ["daily_summary", "weekly_performance"];
		setSelectedWidgets(recommendedWidgets);
		setSelectedReports(recommendedReports);
		updateData({
			dashboardWidgets: recommendedWidgets,
			scheduledReports: recommendedReports,
		});
	};

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Customize your dashboard</h2>
				<p className="text-muted-foreground">
					Choose which metrics matter most. Your dashboard will adapt to show what you need.
				</p>
			</div>

			{/* Quick Action */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Target className="h-5 w-5 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						Optimized for most field service businesses
					</span>
				</div>
				<button
					onClick={selectRecommended}
					className="text-sm font-medium text-primary hover:underline"
				>
					Use recommended
				</button>
			</div>

			{/* Dashboard Widgets */}
			<div className="space-y-4">
				<span className="font-medium">Dashboard Widgets</span>
				<div className="grid gap-2 sm:grid-cols-2">
					{DASHBOARD_WIDGETS.map((widget) => {
						const Icon = widget.icon;
						const selected = selectedWidgets.includes(widget.id);

						return (
							<button
								key={widget.id}
								type="button"
								onClick={() => toggleWidget(widget.id)}
								className={cn(
									"flex items-center gap-3 rounded-lg p-3 text-left transition-colors",
									selected ? "bg-primary/10" : "bg-muted/40 hover:bg-muted/60"
								)}
							>
								<Icon className={cn(
									"h-5 w-5 flex-shrink-0",
									selected ? "text-primary" : "text-muted-foreground"
								)} />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium">{widget.title}</p>
									<p className="text-xs text-muted-foreground">
										{widget.description}
									</p>
								</div>
								{selected && (
									<Check className="h-4 w-4 text-primary flex-shrink-0" />
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Scheduled Reports */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Mail className="h-5 w-5 text-muted-foreground" />
					<span className="font-medium">Scheduled Email Reports</span>
				</div>

				{SCHEDULED_REPORTS.map((report) => {
					const enabled = selectedReports.includes(report.id);

					return (
						<div
							key={report.id}
							className={cn(
								"flex items-center gap-4 rounded-lg p-4 transition-colors",
								enabled ? "bg-primary/10" : "bg-muted/40"
							)}
						>
							<div className="flex-1">
								<p className="font-medium">{report.title}</p>
								<p className="text-sm text-muted-foreground">{report.frequency}</p>
							</div>
							<Switch
								checked={enabled}
								onCheckedChange={() => toggleReport(report.id)}
							/>
						</div>
					);
				})}
			</div>

			{/* Summary */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>{selectedWidgets.length} widgets selected</span>
				<span>{selectedReports.length} reports enabled</span>
			</div>
		</div>
	);
}
