"use client";

import { BarChart3 } from "lucide-react";
import { ToolbarStatsButton } from "@/components/ui/toolbar-stats-button";
import { useWorkPageStats } from "@/hooks/use-work-page-stats";

type WorkStatsButtonClientProps = {
	page: string;
};

/**
 * Client-side compact stats button for work pages
 * Fetches and displays stats in a compact popover button
 */
export function WorkStatsButtonClient({ page }: WorkStatsButtonClientProps) {
	const { stats, isLoading } = useWorkPageStats(page);

	// Show skeleton while loading
	if (isLoading) {
		return (
			<div className="flex items-center gap-1.5">
				<BarChart3 className="h-4 w-4 text-muted-foreground animate-pulse" />
				<div className="h-4 w-8 animate-pulse rounded bg-muted" />
			</div>
		);
	}

	// No stats available
	if (!stats || stats.length === 0) {
		return null;
	}

	return <ToolbarStatsButton stats={stats} />;
}
