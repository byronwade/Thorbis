/**
 * Weekly Stats Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static data visualization rendered on server
 * - Reduced JavaScript bundle size for TV displays
 */

import { Calendar, DollarSign, Briefcase, Star } from "lucide-react";

type WeeklyStatsWidgetProps = {
  data: {
    revenue: number;
    jobs: number;
    avgTicket: number;
    rating: number;
  };
};

export function WeeklyStatsWidget({ data }: WeeklyStatsWidgetProps) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-background/90 to-background/70 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="size-5 text-primary" />
        <h3 className="font-bold text-lg">This Week's Performance</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <DollarSign className="size-4" />
            Revenue
          </div>
          <p className="mt-1 font-bold text-2xl">${data.revenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Briefcase className="size-4" />
            Jobs
          </div>
          <p className="mt-1 font-bold text-2xl">{data.jobs}</p>
        </div>
        <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <DollarSign className="size-4" />
            Avg Ticket
          </div>
          <p className="mt-1 font-bold text-2xl">${data.avgTicket}</p>
        </div>
        <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Star className="size-4" />
            Rating
          </div>
          <p className="mt-1 font-bold text-2xl">{data.rating}</p>
        </div>
      </div>
    </div>
  );
}
