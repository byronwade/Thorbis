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
import { Area, AreaChart } from "recharts";
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

export function StatsCards({ stats, variant = "ticker", compact = false }: StatsCardsProps) {
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
      <div className="w-full border-b bg-background">
        {/* Stats Grid - Stock ticker style */}
        <div className={`grid w-full ${gridColsClass} divide-x`}>
          {stats.map((stat) => {
            const change = stat.change || 0;
            const isPositive = change > 0;
            const isNegative = change < 0;
            const isNeutral = change === 0;

            return (
              <div 
                className={cn(
                  "transition-all duration-300",
                  compact ? "px-3 py-2" : "px-4 py-3"
                )} 
                key={stat.label}
              >
                <div className="flex items-baseline gap-2">
                  <div className={cn(
                    "font-semibold text-foreground tabular-nums transition-all duration-300",
                    compact ? "text-lg" : "text-xl"
                  )}>
                    {stat.value}
                  </div>
                  {/* Stock ticker style change indicator */}
                  {change !== undefined && (
                    <div
                      className={cn(
                        "flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-medium text-xs tabular-nums",
                        isPositive &&
                          "bg-green-500/10 text-green-600 dark:text-green-500",
                        isNegative &&
                          "bg-red-500/10 text-red-600 dark:text-red-500",
                        isNeutral && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isPositive && <TrendingUp className="h-3 w-3" />}
                      {isNegative && <TrendingDown className="h-3 w-3" />}
                      {isNeutral && <Minus className="h-3 w-3" />}
                      {isPositive && "+"}
                      {change}%
                    </div>
                  )}
                </div>
                <div className={cn(
                  "text-muted-foreground transition-all duration-300",
                  compact ? "mt-0.5 text-xs" : "mt-1 text-sm"
                )}>
                  {stat.label}
                </div>
                {!compact && stat.changeLabel && (
                  <div className="mt-0.5 text-muted-foreground text-xs">
                    {stat.changeLabel}
                  </div>
                )}
              </div>
            );
          })}
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
                  <AreaChart
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
                  </AreaChart>
                </ChartContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
