"use client";

import { BarChart3 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { StatCard } from "@/lib/layout/unified-layout-config";
import { cn } from "@/lib/utils";

type ToolbarStatsButtonProps = {
	stats: StatCard[];
	/** Primary stat to show in badge (defaults to first stat) */
	primaryStatIndex?: number;
	/** Compact mode - only show icon without badge */
	compact?: boolean;
};

/**
 * ToolbarStatsButton - Compact stats display with popover
 *
 * Ultra-compact alternative to inline stats that saves toolbar space.
 * Shows a small button with optional badge, expands to full stats on click.
 *
 * Features:
 * - Minimalistic design (icon + optional badge)
 * - Hover preview of primary stat
 * - Click to expand full stats in popover
 * - Responsive (auto-hides badge on mobile)
 *
 * Example:
 * ```tsx
 * <ToolbarStatsButton stats={[
 *   { label: "Total", value: "124", trend: { value: 12, direction: "up" } },
 *   { label: "Active", value: "89" },
 *   { label: "Pending", value: "35" }
 * ]} />
 * ```
 */
export function ToolbarStatsButton({
	stats,
	primaryStatIndex = 0,
	compact = false,
}: ToolbarStatsButtonProps) {
	const [open, setOpen] = useState(false);

	if (!stats || stats.length === 0) {
		return null;
	}

	const primaryStat = stats[primaryStatIndex];
	const hasTrend = Boolean(primaryStat?.trend);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"h-8 gap-1.5 px-2 transition-all duration-200",
						"hover:bg-primary/10 hover:text-primary",
						"data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
					)}
					title={`${primaryStat?.label}: ${primaryStat?.value}`}
				>
					<BarChart3 className="h-4 w-4" />
					{!compact && primaryStat && (
						<>
							<span className="hidden text-xs font-medium tabular-nums sm:inline">
								{primaryStat.value}
							</span>
							{hasTrend && primaryStat.trend && (
								<span
									className={cn(
										"hidden text-xs font-medium tabular-nums lg:inline",
										primaryStat.trend.direction === "up"
											? "text-success"
											: primaryStat.trend.direction === "down"
												? "text-destructive"
												: "text-muted-foreground",
									)}
								>
									{primaryStat.trend.direction === "up" && "+"}
									{primaryStat.trend.value}
									{primaryStat.trend.suffix || "%"}
								</span>
							)}
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-4" align="start" sideOffset={8}>
				<div className="space-y-3">
					<div className="flex items-center justify-between border-b pb-2">
						<h4 className="text-sm font-semibold">Statistics</h4>
						<span className="text-muted-foreground text-xs">
							{stats.length} {stats.length === 1 ? "metric" : "metrics"}
						</span>
					</div>

					<div className="grid gap-3">
						{stats.map((stat, index) => (
							<div
								key={index}
								className={cn(
									"rounded-lg border p-3 transition-colors",
									index === primaryStatIndex
										? "border-primary/50 bg-primary/5"
										: "border-border/50 hover:border-border",
								)}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0 flex-1">
										<p className="text-muted-foreground truncate text-xs font-medium">
											{stat.label}
										</p>
										<p className="mt-1 truncate text-lg font-semibold tabular-nums">
											{stat.value}
										</p>
									</div>

									{stat.trend && (
										<div
											className={cn(
												"flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
												stat.trend.direction === "up"
													? "bg-success/10 text-success"
													: stat.trend.direction === "down"
														? "bg-destructive/10 text-destructive"
														: "bg-muted text-muted-foreground",
											)}
										>
											<span>
												{stat.trend.direction === "up" && "↑"}
												{stat.trend.direction === "down" && "↓"}
												{stat.trend.direction === "neutral" && "→"}
											</span>
											<span className="tabular-nums">
												{stat.trend.value}
												{stat.trend.suffix || "%"}
											</span>
										</div>
									)}
								</div>

								{stat.description && (
									<p className="text-muted-foreground mt-2 text-xs leading-relaxed">
										{stat.description}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
