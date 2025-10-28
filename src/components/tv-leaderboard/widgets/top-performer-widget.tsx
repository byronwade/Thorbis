/**
 * Top Performer Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static data visualization rendered on server
 * - Reduced JavaScript bundle size for TV displays
 */

import { Trophy, TrendingUp } from "lucide-react";

type TopPerformerWidgetProps = {
  data: {
    name: string;
    avatar: string;
    revenue: number;
    revenueChange: number;
    jobsCompleted: number;
    customerRating: number;
  };
};

export function TopPerformerWidget({ data }: TopPerformerWidgetProps) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="size-6 text-yellow-500" />
        <h3 className="font-bold text-lg">Top Performer</h3>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-20 items-center justify-center rounded-full border-4 border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-2xl text-yellow-600">
          {data.avatar}
        </div>
        <div>
          <h4 className="font-bold text-xl">{data.name}</h4>
          <p className="text-muted-foreground text-sm">Rank #1</p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-background/50 p-2">
            <p className="text-muted-foreground text-xs">Revenue</p>
            <p className="font-bold text-lg">${data.revenue.toLocaleString()}</p>
            <span className="inline-flex items-center gap-1 text-green-500 text-xs">
              <TrendingUp className="size-3" />+{data.revenueChange.toFixed(1)}%
            </span>
          </div>
          <div className="rounded-lg bg-background/50 p-2">
            <p className="text-muted-foreground text-xs">Jobs</p>
            <p className="font-bold text-lg">{data.jobsCompleted}</p>
          </div>
          <div className="rounded-lg bg-background/50 p-2">
            <p className="text-muted-foreground text-xs">Rating</p>
            <p className="font-bold text-lg">{data.customerRating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
