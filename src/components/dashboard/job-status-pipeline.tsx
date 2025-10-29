/**
 * Job Status Pipeline - Server Component
 * Stock ticker-style statistics with trend indicators
 *
 * Features:
 * - Stock ticker design with colored trend indicators
 * - Green for positive changes, red for negative
 * - Full-width seamless design
 * - Minimalistic and clean
 */

import { StatsCards, type StatCard } from "@/components/ui/stats-cards";

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

export function JobStatusPipeline() {
	return <StatsCards stats={jobStats} variant="ticker" />;
}
