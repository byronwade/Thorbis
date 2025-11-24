/**
 * Jobs Report Data - Async Server Component
 *
 * Displays comprehensive job performance analytics including
 * completion rates, technician performance, and job type analysis.
 */

import { getJobPerformanceReport } from "@/lib/queries/analytics";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
	Briefcase,
	CheckCircle,
	Clock,
	TrendingUp,
	Users,
} from "lucide-react";
import { ExportButton } from "@/components/reports/export-button";

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

function formatDuration(minutes: number): string {
	if (minutes < 60) return `${Math.round(minutes)}m`;
	const hours = Math.floor(minutes / 60);
	const mins = Math.round(minutes % 60);
	return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatWeek(weekStr: string): string {
	const date = new Date(weekStr);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function JobsData() {
	const companyId = await getActiveCompanyId();

	if (!companyId) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">Please select a company to view reports</p>
			</div>
		);
	}

	const data = await getJobPerformanceReport(companyId, 90);

	return (
		<div className="space-y-6">
			{/* Header with Export */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Jobs Performance</h2>
					<p className="text-muted-foreground">Completion rates, technician performance, and job analysis</p>
				</div>
				<ExportButton reportType="jobs" days={90} />
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<SummaryCard
					title="Total Jobs"
					value={data.summary.totalJobs.toString()}
					subtitle={`${data.summary.completedJobs} completed`}
					icon={<Briefcase className="size-4 text-blue-500" />}
				/>
				<SummaryCard
					title="Completion Rate"
					value={formatPercent(data.summary.completionRate)}
					icon={<CheckCircle className="size-4 text-green-500" />}
					trend={data.summary.completionRate >= 90 ? "positive" : data.summary.completionRate >= 75 ? "neutral" : "negative"}
				/>
				<SummaryCard
					title="First-Time Fix Rate"
					value={formatPercent(data.summary.firstTimeFixRate)}
					subtitle={`${formatPercent(data.summary.callbackRate)} callback rate`}
					icon={<TrendingUp className="size-4 text-emerald-500" />}
					trend={data.summary.firstTimeFixRate >= 85 ? "positive" : "neutral"}
				/>
				<SummaryCard
					title="Avg Duration"
					value={formatDuration(data.summary.averageDuration)}
					icon={<Clock className="size-4 text-orange-500" />}
				/>
			</div>

			{/* Jobs by Status */}
			<Card>
				<CardHeader>
					<CardTitle>Jobs by Status</CardTitle>
					<CardDescription>Distribution of jobs across different statuses</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data.byStatus.map((status) => (
							<div key={status.status} className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<StatusBadge status={status.status} />
										<span className="text-sm font-medium capitalize">
											{status.status.replace(/_/g, " ")}
										</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{status.count} ({formatPercent(status.percentage)})
									</span>
								</div>
								<Progress value={status.percentage} className="h-2" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* By Technician */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="size-5" />
							Performance by Technician
						</CardTitle>
						<CardDescription>Job metrics by team member</CardDescription>
					</CardHeader>
					<CardContent>
						{data.byTechnician.length === 0 ? (
							<p className="text-muted-foreground py-8 text-center">No technician data available</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Technician</TableHead>
										<TableHead className="text-right">Jobs</TableHead>
										<TableHead className="text-right">Avg Time</TableHead>
										<TableHead className="text-right">FTF Rate</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.byTechnician.slice(0, 10).map((tech) => (
										<TableRow key={tech.id}>
											<TableCell className="font-medium">{tech.name}</TableCell>
											<TableCell className="text-right">{tech.jobsCompleted}</TableCell>
											<TableCell className="text-right">{formatDuration(tech.avgDuration)}</TableCell>
											<TableCell className="text-right">
												<Badge variant={tech.firstTimeFixRate >= 90 ? "default" : tech.firstTimeFixRate >= 75 ? "secondary" : "destructive"}>
													{formatPercent(tech.firstTimeFixRate)}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>

				{/* By Job Type */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Briefcase className="size-5" />
							Performance by Job Type
						</CardTitle>
						<CardDescription>Metrics by service category</CardDescription>
					</CardHeader>
					<CardContent>
						{data.byJobType.length === 0 ? (
							<p className="text-muted-foreground py-8 text-center">No job type data available</p>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Job Type</TableHead>
										<TableHead className="text-right">Count</TableHead>
										<TableHead className="text-right">Avg Revenue</TableHead>
										<TableHead className="text-right">Completion</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.byJobType.slice(0, 10).map((type) => (
										<TableRow key={type.jobType}>
											<TableCell className="font-medium capitalize">{type.jobType}</TableCell>
											<TableCell className="text-right">{type.count}</TableCell>
											<TableCell className="text-right">{formatCurrency(type.avgRevenue)}</TableCell>
											<TableCell className="text-right">
												<Badge variant={type.completionRate >= 90 ? "default" : "secondary"}>
													{formatPercent(type.completionRate)}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Weekly Trends */}
			<Card>
				<CardHeader>
					<CardTitle>Weekly Trends</CardTitle>
					<CardDescription>Job volume by week</CardDescription>
				</CardHeader>
				<CardContent>
					{data.trendsWeekly.length === 0 ? (
						<p className="text-muted-foreground py-8 text-center">No trend data available</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Week Starting</TableHead>
									<TableHead className="text-right">Completed</TableHead>
									<TableHead className="text-right">Scheduled</TableHead>
									<TableHead className="text-right">Cancelled</TableHead>
									<TableHead className="text-right">Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.trendsWeekly.slice(-12).map((week) => (
									<TableRow key={week.week}>
										<TableCell className="font-medium">{formatWeek(week.week)}</TableCell>
										<TableCell className="text-right text-green-600">{week.completed}</TableCell>
										<TableCell className="text-right text-blue-600">{week.scheduled}</TableCell>
										<TableCell className="text-right text-red-600">{week.cancelled}</TableCell>
										<TableCell className="text-right font-medium">
											{week.completed + week.scheduled + week.cancelled}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function SummaryCard({
	title,
	value,
	subtitle,
	icon,
	trend,
}: {
	title: string;
	value: string;
	subtitle?: string;
	icon: React.ReactNode;
	trend?: "positive" | "negative" | "neutral";
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{subtitle && (
					<p className={`text-xs ${
						trend === "positive" ? "text-green-600" :
						trend === "negative" ? "text-red-600" :
						"text-muted-foreground"
					}`}>
						{subtitle}
					</p>
				)}
			</CardContent>
		</Card>
	);
}

function StatusBadge({ status }: { status: string }) {
	const colors: Record<string, string> = {
		completed: "bg-green-500",
		scheduled: "bg-blue-500",
		in_progress: "bg-yellow-500",
		cancelled: "bg-red-500",
		pending: "bg-gray-500",
	};

	return (
		<div className={`size-3 rounded-full ${colors[status] || "bg-gray-400"}`} />
	);
}
