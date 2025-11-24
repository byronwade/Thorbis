"use client";

/**
 * Reports Step - Dashboard & Reports Preferences
 *
 * Lets users choose what metrics matter most to them:
 * - Dashboard widgets
 * - Scheduled report preferences
 * - KPI goals
 */

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	BarChart3,
	TrendingUp,
	DollarSign,
	Users,
	Calendar,
	Clock,
	Sparkles,
	CheckCircle2,
	Star,
	Briefcase,
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
	category: "financial" | "operational" | "customer";
	recommended?: boolean;
}

const DASHBOARD_WIDGETS: ReportOption[] = [
	{
		id: "revenue",
		title: "Revenue Overview",
		description: "Daily, weekly, monthly revenue tracking",
		icon: DollarSign,
		category: "financial",
		recommended: true,
	},
	{
		id: "jobs_today",
		title: "Today's Jobs",
		description: "Scheduled jobs and completion status",
		icon: Calendar,
		category: "operational",
		recommended: true,
	},
	{
		id: "outstanding_invoices",
		title: "Outstanding Invoices",
		description: "Unpaid invoices and aging",
		icon: FileText,
		category: "financial",
		recommended: true,
	},
	{
		id: "team_performance",
		title: "Team Performance",
		description: "Jobs completed, revenue per tech",
		icon: Users,
		category: "operational",
	},
	{
		id: "customer_satisfaction",
		title: "Customer Satisfaction",
		description: "Reviews, ratings, and feedback",
		icon: Star,
		category: "customer",
		recommended: true,
	},
	{
		id: "conversion_rate",
		title: "Estimate Conversion",
		description: "Estimates won vs lost",
		icon: Percent,
		category: "financial",
	},
	{
		id: "avg_job_value",
		title: "Average Job Value",
		description: "Track ticket size trends",
		icon: TrendingUp,
		category: "financial",
	},
	{
		id: "response_time",
		title: "Response Time",
		description: "Time from inquiry to first contact",
		icon: Clock,
		category: "customer",
	},
];

const SCHEDULED_REPORTS: {
	id: string;
	title: string;
	description: string;
	frequency: string;
	recommended?: boolean;
}[] = [
	{
		id: "daily_summary",
		title: "Daily Summary",
		description: "Jobs completed, revenue, and key metrics",
		frequency: "Every morning at 6 AM",
		recommended: true,
	},
	{
		id: "weekly_performance",
		title: "Weekly Performance",
		description: "Comprehensive week-over-week analysis",
		frequency: "Every Monday at 8 AM",
		recommended: true,
	},
	{
		id: "monthly_financial",
		title: "Monthly Financial Report",
		description: "Revenue, expenses, profitability",
		frequency: "1st of each month",
	},
	{
		id: "quarterly_review",
		title: "Quarterly Business Review",
		description: "Trends, goals, and projections",
		frequency: "End of each quarter",
	},
];

export function ReportsStep() {
	const { data, updateData } = useOnboardingStore();
	const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
		data.dashboardWidgets || DASHBOARD_WIDGETS.filter((w) => w.recommended).map((w) => w.id)
	);
	const [selectedReports, setSelectedReports] = useState<string[]>(
		data.scheduledReports || SCHEDULED_REPORTS.filter((r) => r.recommended).map((r) => r.id)
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
		const recommendedWidgets = DASHBOARD_WIDGETS.filter((w) => w.recommended).map((w) => w.id);
		const recommendedReports = SCHEDULED_REPORTS.filter((r) => r.recommended).map((r) => r.id);
		setSelectedWidgets(recommendedWidgets);
		setSelectedReports(recommendedReports);
		updateData({
			dashboardWidgets: recommendedWidgets,
			scheduledReports: recommendedReports,
		});
	};

	const widgetsByCategory = {
		financial: DASHBOARD_WIDGETS.filter((w) => w.category === "financial"),
		operational: DASHBOARD_WIDGETS.filter((w) => w.category === "operational"),
		customer: DASHBOARD_WIDGETS.filter((w) => w.category === "customer"),
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Customize your dashboard</h2>
				<p className="text-sm text-muted-foreground">
					Choose which metrics matter most. Your dashboard will adapt to show what you need.
				</p>
			</div>

			{/* Info Card */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Data-driven decisions"
				description="Your dashboard is the first thing you see each morning. Choose metrics that help you take action."
				variant="tip"
			/>

			{/* Quick Action */}
			<div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
				<div className="flex items-center gap-3">
					<Target className="h-5 w-5 text-primary" />
					<div>
						<p className="font-medium">Use recommended setup</p>
						<p className="text-sm text-muted-foreground">
							Best for most field service businesses
						</p>
					</div>
				</div>
				<button
					onClick={selectRecommended}
					className="text-sm font-medium text-primary hover:underline"
				>
					Apply
				</button>
			</div>

			{/* Dashboard Widgets */}
			<div className="space-y-4">
				<h3 className="font-semibold">Dashboard Widgets</h3>

				{/* Financial */}
				<div className="space-y-2">
					<p className="text-sm text-muted-foreground flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Financial
					</p>
					<div className="grid gap-2 sm:grid-cols-2">
						{widgetsByCategory.financial.map((widget) => {
							const Icon = widget.icon;
							const selected = selectedWidgets.includes(widget.id);

							return (
								<button
									key={widget.id}
									type="button"
									onClick={() => toggleWidget(widget.id)}
									className={cn(
										"flex items-center gap-3 rounded-xl p-3 text-left transition-all",
										selected
											? "bg-primary/10 ring-1 ring-primary/30"
											: "bg-muted/30 hover:bg-muted/50"
									)}
								>
									<div className={cn(
										"flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
										selected ? "bg-primary text-primary-foreground" : "bg-muted"
									)}>
										<Icon className="h-4 w-4" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{widget.title}</p>
											{widget.recommended && (
												<Badge variant="secondary" className="text-xs">Rec</Badge>
											)}
										</div>
										<p className="text-xs text-muted-foreground truncate">
											{widget.description}
										</p>
									</div>
									{selected && (
										<CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Operational */}
				<div className="space-y-2">
					<p className="text-sm text-muted-foreground flex items-center gap-2">
						<Briefcase className="h-4 w-4" />
						Operational
					</p>
					<div className="grid gap-2 sm:grid-cols-2">
						{widgetsByCategory.operational.map((widget) => {
							const Icon = widget.icon;
							const selected = selectedWidgets.includes(widget.id);

							return (
								<button
									key={widget.id}
									type="button"
									onClick={() => toggleWidget(widget.id)}
									className={cn(
										"flex items-center gap-3 rounded-xl p-3 text-left transition-all",
										selected
											? "bg-primary/10 ring-1 ring-primary/30"
											: "bg-muted/30 hover:bg-muted/50"
									)}
								>
									<div className={cn(
										"flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
										selected ? "bg-primary text-primary-foreground" : "bg-muted"
									)}>
										<Icon className="h-4 w-4" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{widget.title}</p>
											{widget.recommended && (
												<Badge variant="secondary" className="text-xs">Rec</Badge>
											)}
										</div>
										<p className="text-xs text-muted-foreground truncate">
											{widget.description}
										</p>
									</div>
									{selected && (
										<CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Customer */}
				<div className="space-y-2">
					<p className="text-sm text-muted-foreground flex items-center gap-2">
						<Users className="h-4 w-4" />
						Customer
					</p>
					<div className="grid gap-2 sm:grid-cols-2">
						{widgetsByCategory.customer.map((widget) => {
							const Icon = widget.icon;
							const selected = selectedWidgets.includes(widget.id);

							return (
								<button
									key={widget.id}
									type="button"
									onClick={() => toggleWidget(widget.id)}
									className={cn(
										"flex items-center gap-3 rounded-xl p-3 text-left transition-all",
										selected
											? "bg-primary/10 ring-1 ring-primary/30"
											: "bg-muted/30 hover:bg-muted/50"
									)}
								>
									<div className={cn(
										"flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
										selected ? "bg-primary text-primary-foreground" : "bg-muted"
									)}>
										<Icon className="h-4 w-4" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{widget.title}</p>
											{widget.recommended && (
												<Badge variant="secondary" className="text-xs">Rec</Badge>
											)}
										</div>
										<p className="text-xs text-muted-foreground truncate">
											{widget.description}
										</p>
									</div>
									{selected && (
										<CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Scheduled Reports */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Mail className="h-5 w-5" />
					<h3 className="font-semibold">Scheduled Email Reports</h3>
				</div>

				<p className="text-sm text-muted-foreground">
					Get insights delivered to your inbox automatically.
				</p>

				{SCHEDULED_REPORTS.map((report) => {
					const enabled = selectedReports.includes(report.id);

					return (
						<div
							key={report.id}
							className={cn(
								"flex items-center gap-4 rounded-xl p-4 transition-colors",
								enabled ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/30"
							)}
						>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<p className="font-medium">{report.title}</p>
									{report.recommended && (
										<Badge variant="secondary" className="text-xs">Recommended</Badge>
									)}
								</div>
								<p className="text-sm text-muted-foreground">{report.description}</p>
								<p className="text-xs text-muted-foreground mt-1">
									{report.frequency}
								</p>
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
			<div className="rounded-xl bg-muted/30 p-4 space-y-2">
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
					Your Setup
				</p>
				<div className="flex items-center justify-between text-sm">
					<span>Dashboard widgets</span>
					<span className="font-semibold">{selectedWidgets.length} selected</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<span>Scheduled reports</span>
					<span className="font-semibold">{selectedReports.length} enabled</span>
				</div>
			</div>
		</div>
	);
}
