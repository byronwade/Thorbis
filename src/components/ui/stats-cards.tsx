"use client";

/**
 * StatsCards - Reusable Statistics Component
 * Two variants:
 * - "chart": Area charts (default, for pages that need visual trends)
 * - "ticker": Stock ticker style with colored trend indicators (cleaner, better for most cases)
 *
 * Features:
 * - Full-width seamless design
 * - Minimalistic and clean
 * - Reusable across all pages
 */

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Area, LazyAreaChart } from "@/components/lazy/chart";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type StatCard = {
  label: string;
  value: number | string;
  change?: number; // Percentage change (e.g., +5.2 or -3.1)
  changeLabel?: string; // Optional label like "vs last week"
  // Legacy chart support
  percentage?: number;
  color?: string;
  data?: Array<{ value: number }>;
};

export type StatsCardsProps = {
  stats: StatCard[];
  variant?: "chart" | "ticker";
  compact?: boolean;
};

function TickerStat({ stat, compact }: { stat: StatCard; compact: boolean }) {
  const change = stat.change ?? null;
  const numericChange = change ?? 0;
  const isPositive = numericChange > 0;
  const isNegative = numericChange < 0;
  const isNeutral = numericChange === 0;

  // Format value if it's a number with commas
  const formattedValue =
    typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value;

  return (
    <div
      className={cn(
        "group cursor-default transition-all duration-200 hover:bg-muted/10 dark:hover:bg-muted/5",
        compact ? "px-4 py-2" : "px-5 py-3"
      )}
    >
      <div className="flex items-baseline gap-2">
        <div
          className={cn(
            "font-semibold text-foreground tabular-nums tracking-tight transition-all duration-200",
            compact ? "text-base leading-tight" : "text-xl leading-tight"
          )}
        >
          {formattedValue}
        </div>
        {change !== null && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded px-1 py-0.5 font-medium text-[10px] tabular-nums shadow-sm",
              isPositive && "bg-success/10 text-success ring-1 ring-success/20",
              isNegative &&
                "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
              isNeutral &&
                "bg-muted/50 text-muted-foreground ring-1 ring-border/50"
            )}
          >
            {isPositive && <TrendingUp className="h-2.5 w-2.5" />}
            {isNegative && <TrendingDown className="h-2.5 w-2.5" />}
            {isNeutral && <Minus className="h-2.5 w-2.5" />}
            {isPositive && "+"}
            {Math.abs(numericChange)}%
          </div>
        )}
      </div>
      <div
        className={cn(
          "font-medium text-muted-foreground/70 uppercase tracking-wide transition-all duration-200",
          compact
            ? "mt-0.5 text-[10px] leading-tight"
            : "mt-1 text-xs leading-tight"
        )}
      >
        {stat.label}
      </div>
      {!compact && stat.changeLabel && (
        <div className="mt-0.5 text-[10px] text-muted-foreground/60 leading-tight">
          {stat.changeLabel}
        </div>
      )}
    </div>
  );
}

export function StatsCards({
  stats,
  variant = "ticker",
  compact = false,
}: StatsCardsProps) {
  // Dynamically determine grid columns based on number of stats
  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }[stats.length] || "grid-cols-5";

  if (variant === "ticker") {
    return (
      <div className="w-full border-border/30 border-b bg-background dark:bg-background">
        {/* Stats Grid - Stock ticker style */}
        <div
          className={cn("grid w-full divide-x divide-border/30", gridColsClass)}
        >
          {stats.map((stat) => (
            <TickerStat compact={compact} key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    );
  }

  // Chart variant (legacy)
  return (
    <div className="w-full border-b bg-background">
      {/* Stats Grid with inline area charts */}
      <div className={`grid w-full ${gridColsClass} divide-x`}>
        {stats.map((stat) => (
          <div className="group relative overflow-hidden" key={stat.label}>
            {/* Content with padding */}
            <div className="relative z-10 px-4 py-3">
              <div className="flex items-baseline gap-2">
                <div className="font-semibold text-foreground text-xl tabular-nums">
                  {stat.value}
                </div>
                {stat.percentage !== undefined && (
                  <div className="text-muted-foreground text-xs">
                    {stat.percentage}%
                  </div>
                )}
              </div>
              <div className="mt-0.5 text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>

            {/* Full-width chart positioned absolutely */}
            {stat.data && stat.color && (
              <div className="absolute inset-x-0 bottom-0 h-12">
                <ChartContainer
                  className="h-full w-full"
                  config={{
                    value: {
                      label: stat.label,
                      color: stat.color,
                    },
                  }}
                >
                  <LazyAreaChart
                    data={stat.data}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${stat.label}`}
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={stat.color}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor={stat.color}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="value"
                      fill={`url(#gradient-${stat.label})`}
                      fillOpacity={1}
                      stroke={stat.color}
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LazyAreaChart>
                </ChartContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
