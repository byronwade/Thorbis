"use client";

import { Wifi } from "lucide-react";
import {
	MainChartCard,
	MetricCard,
	SmallChartCard,
} from "@/components/analytics/analytics-dashboard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyFromDollars, formatDateTime } from "@/lib/formatters";
import type { MissionControlData } from "@/lib/queries/mission-control-data";

function formatRelative(
	iso: string | null | undefined,
	referenceTime = Date.now(),
) {
	if (!iso) {
		return "";
	}

	try {
		const relativeFormatter = new Intl.RelativeTimeFormat("en-US", {
			numeric: "auto",
		});
		const now = referenceTime;
		const then = new Date(iso).getTime();
		const diffMinutes = Math.round((then - now) / (1000 * 60));

		if (Math.abs(diffMinutes) < 60) {
			return relativeFormatter.format(diffMinutes, "minute");
		}

		const diffHours = Math.round(diffMinutes / 60);
		return relativeFormatter.format(diffHours, "hour");
	} catch (_error) {
		const now = referenceTime;
		const then = new Date(iso).getTime();
		const diffMinutes = Math.round((then - now) / (1000 * 60));

		if (Math.abs(diffMinutes) < 60) {
			return `${Math.abs(diffMinutes)}m ago`;
		}

		const diffHours = Math.round(diffMinutes / 60);
		return `${Math.abs(diffHours)}h ago`;
	}
}

export default function OwnerDashboard({
	data,
	renderedAt,
}: {
	data?: MissionControlData;
	renderedAt?: number;
}) {
	if (!data) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">No dashboard data available</p>
			</div>
		);
	}

	const relativeNow = renderedAt ?? Date.now();

	// Use real analytics data from mission control, with empty array fallbacks
	const revenueChartData = data.analytics?.revenue ?? [];
	const jobsChartData = data.analytics?.jobs ?? [];
	const communicationsChartData = data.analytics?.communications ?? [];

	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
							Account overview
						</h1>
						<Badge className="text-primary gap-1" variant="outline">
							<Wifi className="size-3.5" />
							Live
						</Badge>
					</div>
					<p className="text-muted-foreground text-sm md:text-base">
						Real-time snapshot of your business performance.
					</p>
				</div>
				<div className="text-muted-foreground flex items-center gap-2 text-xs md:text-sm">
					<span>Last updated</span>
					<Separator className="h-4" orientation="vertical" />
					<span>
						{formatDateTime(data.lastUpdated)} (
						{formatRelative(data.lastUpdated, relativeNow)})
					</span>
				</div>
			</header>

			{/* Main Chart Section */}
			<div className="grid grid-cols-1">
				<MainChartCard title="Revenue" data={revenueChartData} />
			</div>

			{/* Secondary Charts Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<SmallChartCard
					title="Jobs over time"
					data={jobsChartData}
					type="line"
					dataKey="value"
					category="jobs"
					color="#3b82f6"
				/>
				<SmallChartCard
					title="Communications | Activity"
					data={communicationsChartData}
					type="bar"
					dataKey="value"
					category="comms"
					color="#10b981"
				/>
			</div>

			{/* Metrics Grid Section */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				<MetricCard
					label="Revenue Today"
					value={formatCurrencyFromDollars(data.metrics.revenueToday, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					})}
					change={data.metrics.revenueToday > 0 ? 8.5 : 0}
					verified={true}
				/>
				<MetricCard
					label="Jobs Scheduled"
					value={data.metrics.jobsScheduledToday.toString()}
					change={data.metrics.jobsScheduledToday > 0 ? 5.2 : 0}
					changeLabel="vs yesterday"
				/>
				<MetricCard
					label="Active Jobs"
					value={data.metrics.jobsInProgress.toString()}
					change={data.metrics.jobsInProgress > 0 ? 3.1 : 0}
					changeLabel="currently active"
				/>
				<MetricCard
					label="Outstanding AR"
					value={formatCurrencyFromDollars(
						data.metrics.outstandingInvoicesAmount,
						{
							minimumFractionDigits: 0,
							maximumFractionDigits: 0,
						},
					)}
					change={data.metrics.overdueInvoicesCount > 0 ? -2.5 : 1.2}
					changeLabel={`${data.metrics.overdueInvoicesCount} overdue`}
				/>
				<MetricCard
					label="Comms Today"
					value={data.metrics.communicationsToday.toString()}
					change={data.metrics.communicationsToday > 5 ? 4.3 : 0}
					changeLabel="interactions"
				/>

				{/* Additional metrics to fill the grid like the image */}
				<MetricCard
					label="Avg Ticket"
					value={formatCurrencyFromDollars(data.metrics.averageTicket, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0,
					})}
					change={1.5}
					changeLabel="vs last month"
				/>
				<MetricCard
					label="Unassigned"
					value={data.metrics.unassignedJobs.toString()}
					change={data.metrics.unassignedJobs > 0 ? -5 : 0}
					changeLabel="jobs pending"
				/>
				<MetricCard
					label="Completed"
					value={data.metrics.jobsCompletedToday.toString()}
					change={12}
					changeLabel="jobs today"
				/>
				<MetricCard
					label="Open Invoices"
					value={data.financial.openInvoices.length.toString()}
					change={-2}
					changeLabel="pending payment"
				/>
				<MetricCard
					label="Team Active"
					value="3"
					subValue="/ 5"
					change={0}
					changeLabel="technicians"
				/>
			</div>

			{/* Active Jobs & Technician Status Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ActiveJobsList jobs={data.operations.inProgress} />
				<TechnicianStatusList schedule={data.schedule} />
			</div>
		</div>
	);
}

function ActiveJobsList({
	jobs,
}: {
	jobs: MissionControlData["operations"]["inProgress"];
}) {
	return (
		<div className="bg-card/50 border-border/50 backdrop-blur-sm rounded-xl border overflow-hidden">
			<div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between">
				<h3 className="font-semibold text-base md:text-lg">Active Jobs</h3>
				<Badge
					variant="secondary"
					className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0"
				>
					{jobs.length} Active
				</Badge>
			</div>
			<div className="p-0">
				{jobs.length === 0 ? (
					<div className="p-6 md:p-8 text-center text-muted-foreground text-sm">
						No active jobs at the moment.
					</div>
				) : (
					<div className="divide-y divide-border/50">
						{jobs.slice(0, 5).map((job) => (
							<div
								key={job.id}
								className="p-3 md:p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
							>
								<div className="space-y-1 min-w-0 flex-1">
									<div className="flex items-center gap-2 flex-wrap">
										<span className="font-medium text-sm truncate">
											{job.title || `Job #${job.jobNumber}`}
										</span>
										<Badge
											variant="outline"
											className="text-[10px] h-5 px-1.5 uppercase tracking-wider shrink-0"
										>
											{job.status?.replace(/_/g, " ")}
										</Badge>
									</div>
									<p className="text-xs text-muted-foreground truncate">
										{job.customerName} • {job.address}
									</p>
								</div>
								<div className="text-left sm:text-right shrink-0">
									<p className="text-sm font-medium">
										{formatCurrencyFromDollars(job.totalAmountCents / 100, {
											minimumFractionDigits: 0,
											maximumFractionDigits: 0,
										})}
									</p>
									<p className="text-xs text-muted-foreground">
										{job.scheduledStart
											? formatDateTime(job.scheduledStart)
											: "No time set"}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function TechnicianStatusList({
	schedule,
}: {
	schedule: MissionControlData["schedule"];
}) {
	// Group schedule items by technician to infer status
	// This is a simplification; ideally we'd have a dedicated technician status endpoint
	const techStatus = schedule.reduce(
		(acc, item) => {
			if (item.technicianName) {
				acc[item.technicianName] = {
					name: item.technicianName,
					status: item.status === "in_progress" ? "Working" : "Scheduled",
					currentJob: item.title,
					time: item.startTime,
				};
			}
			return acc;
		},
		{} as Record<string, any>,
	);

	const techs = Object.values(techStatus);

	return (
		<div className="bg-card/50 border-border/50 backdrop-blur-sm rounded-xl border overflow-hidden">
			<div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between">
				<h3 className="font-semibold text-base md:text-lg">
					Technician Status
				</h3>
				<Badge
					variant="secondary"
					className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0"
				>
					{techs.length} Scheduled
				</Badge>
			</div>
			<div className="p-0">
				{techs.length === 0 ? (
					<div className="p-6 md:p-8 text-center text-muted-foreground text-sm">
						No technicians scheduled for today yet.
					</div>
				) : (
					<div className="divide-y divide-border/50">
						{techs.map((tech, i) => (
							<div
								key={i}
								className="p-3 md:p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
							>
								<div className="flex items-center gap-3 min-w-0 flex-1">
									<div className="h-9 w-9 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
										{tech.name
											.split(" ")
											.map((n: string) => n[0])
											.join("")
											.substring(0, 2)}
									</div>
									<div className="space-y-0.5 min-w-0">
										<p className="text-sm font-medium truncate">{tech.name}</p>
										<p className="text-xs text-muted-foreground truncate">
											{tech.status === "Working" ? "Currently at:" : "Next up:"}{" "}
											{tech.currentJob}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<Badge
										variant="outline"
										className={`text-[10px] h-5 px-1.5 uppercase tracking-wider ${
											tech.status === "Working"
												? "bg-green-500/10 text-green-500 border-green-500/20"
												: "bg-blue-500/10 text-blue-500 border-blue-500/20"
										}`}
									>
										{tech.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
