"use client";

/**
 * ToolbarStats - Compact inline statistics for AppToolbar
 *
 * Shopify-inspired minimalistic design with green/red indicators
 * Designed to be integrated directly into the toolbar
 *
 * Features:
 * - Horizontal inline layout with subtle dividers
 * - Compact sizing optimized for toolbar height
 * - Green/red color coding for positive/negative changes
 * - Responsive: scrolls horizontally on mobile if needed
 */

import { TrendingDown, TrendingUp } from "lucide-react";
import type { StatCard } from "@/components/ui/stats-cards";
import { cn } from "@/lib/utils";

type ToolbarStatsProps = {
	stats: StatCard[];
	className?: string;
};

export function ToolbarStats({ stats, className }: ToolbarStatsProps) {
	if (!stats || stats.length === 0) {
		return null;
	}

	return (
		<div className={cn("ml-4 hidden items-center gap-4 overflow-x-auto md:flex", className)}>
			{stats.map((stat, index) => {
				const change = stat.change ?? null;
				const numericChange = change ?? 0;
				const isPositive = numericChange > 0;
				const isNegative = numericChange < 0;
				const hasChange = change !== null;

				return (
					<div
						className={cn("flex shrink-0 items-center gap-2", index > 0 && "border-border/40 border-l pl-4")}
						key={stat.label}
					>
						<div className="flex flex-col">
							<div className="flex items-baseline gap-1.5">
								<span className="font-semibold text-foreground text-sm tabular-nums">{stat.value}</span>
								{hasChange && (
									<span
										className={cn(
											"flex items-center gap-0.5 rounded px-1 py-0.5 font-medium text-xs tabular-nums",
											isPositive && "bg-success/10 text-success dark:text-success",
											isNegative && "bg-destructive/10 text-destructive dark:text-destructive"
										)}
									>
										{isPositive && <TrendingUp className="h-3 w-3" />}
										{isNegative && <TrendingDown className="h-3 w-3" />}
										{isPositive && "+"}
										{Math.abs(numericChange)}%
									</span>
								)}
							</div>
							<span className="text-muted-foreground text-xs">{stat.label}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
