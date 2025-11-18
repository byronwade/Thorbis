"use client";

/**
 * Team Member Stats Bar - Client Component
 * Stock ticker-style statistics for team member metrics
 *
 * Features:
 * - Permanent stats bar above team member details page
 * - Active Jobs, Hours This Month, Completion Rate, Availability
 * - Full-width seamless design
 * - Supports compact mode for sticky scrolling
 * - Matches Job Details design pattern
 */

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

type TeamMemberStatsBarProps = {
	metrics: {
		activeJobsCount: number; // Count of currently assigned jobs
		hoursThisMonth: number; // Total hours worked this month (decimal)
		completionRate: number; // Percentage of completed tasks
		availableHours: number; // Available hours this week
		totalTasksCompleted: number; // Total completed tasks
		totalTasks: number; // Total tasks assigned
		averageHoursPerMonth: number; // Average hours for comparison
	};
	memberName: string;
	status: "active" | "invited" | "suspended";
	compact?: boolean;
};

export function TeamMemberStatsBar({
	metrics,
	memberName,
	status,
	compact = false,
}: TeamMemberStatsBarProps) {
	const formatHours = (hours: number) => `${hours.toFixed(1)}h`;
	const formatPercentage = (value: number) => `${value.toFixed(0)}%`;

	// Calculate change vs last month for active jobs
	const jobsChange = metrics.activeJobsCount > 0 ? 12.5 : 0; // TODO: Calculate actual change

	// Calculate hours vs average
	const hoursVsAverage =
		metrics.averageHoursPerMonth > 0
			? (
					((metrics.hoursThisMonth - metrics.averageHoursPerMonth) /
						metrics.averageHoursPerMonth) *
					100
				).toFixed(0)
			: 0;

	// Calculate completion rate
	const completionRateCalc =
		metrics.totalTasks > 0
			? ((metrics.totalTasksCompleted / metrics.totalTasks) * 100).toFixed(0)
			: 0;

	// Availability status
	const availabilityStatus =
		metrics.availableHours > 0 ? "available" : "fully booked";

	const memberStats: StatCard[] = [
		{
			label: "Active Jobs",
			value: metrics.activeJobsCount.toString(),
			change: metrics.activeJobsCount > 0 ? Number(jobsChange) : undefined,
			changeLabel:
				metrics.activeJobsCount > 0
					? "currently assigned"
					: "no active assignments",
		},
		{
			label: "Hours This Month",
			value: formatHours(metrics.hoursThisMonth),
			change:
				metrics.averageHoursPerMonth > 0 ? Number(hoursVsAverage) : undefined,
			changeLabel:
				metrics.averageHoursPerMonth > 0
					? `vs ${formatHours(metrics.averageHoursPerMonth)} avg`
					: "first month",
		},
		{
			label: "Completion Rate",
			value: formatPercentage(metrics.completionRate),
			change: metrics.completionRate >= 90 ? Number(completionRateCalc) : 0,
			changeLabel: `${metrics.totalTasksCompleted} / ${metrics.totalTasks} tasks`,
		},
		{
			label: "Availability",
			value: formatHours(metrics.availableHours),
			change: metrics.availableHours > 0 ? undefined : 0,
			changeLabel: availabilityStatus,
		},
	];

	return <EntityStatsBar compact={compact} stats={memberStats} />;
}
