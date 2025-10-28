/**
 * Revenue Chart Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Custom CSS bar chart (no heavy chart library)
 * - CSS transitions handle animations (no JavaScript)
 * - Reduced JavaScript bundle size
 */

import { TrendingUp } from "lucide-react";

type RevenueChartWidgetProps = {
  data: {
    trend: Array<{ day: string; revenue: number }>;
  };
};

export function RevenueChartWidget({ data }: RevenueChartWidgetProps) {
  const maxRevenue = Math.max(...data.trend.map((d) => d.revenue));

  return (
    <div className="h-full overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-background/90 to-background/70 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="size-5 text-green-500" />
        <h3 className="font-bold text-lg">Revenue Trend</h3>
      </div>

      <div className="flex h-[calc(100%-3rem)] items-end gap-2">
        {data.trend.map((item, idx) => {
          const height = (item.revenue / maxRevenue) * 100;
          return (
            <div className="flex flex-1 flex-col items-center gap-2" key={idx}>
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-green-500 to-green-400 transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">{item.day}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
