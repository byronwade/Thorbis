"use client";

/**
 * ToolbarStatsInline - Ultra-compact inline statistics for AppToolbar
 *
 * Merges seamlessly into the toolbar row between title and actions.
 * Mobile-responsive with intelligent overflow handling.
 *
 * Features:
 * - Single-line compact layout
 * - Automatic overflow to scrolling on mobile
 * - Minimal visual weight
 * - Color-coded trend indicators
 */

import { TrendingDown, TrendingUp } from "lucide-react";
import type { StatCard } from "./types";
import { cn } from "./utils";

type ToolbarStatsInlineProps = {
	stats: StatCard[];
	className?: string;
};

export function ToolbarStatsInline({
	stats,
	className,
}: ToolbarStatsInlineProps) {
	if (!stats || stats.length === 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"ml-auto mr-auto flex items-center gap-4 overflow-x-auto lg:gap-6",
				className,
			)}
		>
			{stats.map((stat, index) => {
				const change = stat.change ?? null;
				const numericChange = change ?? 0;
				const isPositive = numericChange > 0;
				const isNegative = numericChange < 0;
				const hasChange = change !== null;

				return (
					<div
						className={cn(
							"flex shrink-0 items-center gap-2",
							index > 0 && "border-border/40 border-l pl-4 lg:pl-6",
						)}
						key={stat.label}
					>
						<div className="flex flex-col">
							<div className="flex items-baseline gap-1.5">
								<span className="text-foreground text-sm font-semibold tabular-nums">
									{typeof stat.value === "number"
										? stat.value.toLocaleString()
										: stat.value}
								</span>
								{hasChange && (
									<span
										className={cn(
											"flex items-center gap-0.5 rounded px-1 py-0.5 text-xs font-medium tabular-nums",
											isPositive &&
												"bg-success/10 text-success dark:text-success",
											isNegative &&
												"bg-destructive/10 text-destructive dark:text-destructive",
										)}
									>
										{isPositive && <TrendingUp className="h-3 w-3" />}
										{isNegative && <TrendingDown className="h-3 w-3" />}
										{isPositive && "+"}
										{Math.abs(numericChange)}%
									</span>
								)}
							</div>
							<span className="text-muted-foreground text-xs">
								{stat.label}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
