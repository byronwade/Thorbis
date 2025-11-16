import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";

/**
 * Jobs Stats - Static Server Component
 *
 * Renders job statistics instantly.
 * TODO: Make this dynamic by fetching real stats from database
 */
export function JobsStats() {
	// Calculate job stats
	// TODO: Fetch real stats from database
	const jobStats: StatCard[] = [
		{
			label: "Scheduled",
			value: 18,
			change: 5.2,
			changeLabel: "vs last week",
		},
		{
			label: "En Route",
			value: 7,
			change: -2.1,
			changeLabel: "vs last week",
		},
		{
			label: "In Progress",
			value: 12,
			change: 8.3,
			changeLabel: "vs last week",
		},
		{
			label: "Completed",
			value: 24,
			change: 12.5,
			changeLabel: "vs last week",
		},
		{
			label: "Invoiced",
			value: 20,
			change: 3.7,
			changeLabel: "vs last week",
		},
	];

	return <StatusPipeline compact stats={jobStats} />;
}
