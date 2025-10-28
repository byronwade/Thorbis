/**
 * Company Goals Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static data visualization rendered on server
 * - Reduced JavaScript bundle size for TV displays
 */

import { Target } from "lucide-react";

type CompanyGoalsWidgetProps = {
  data: {
    monthlyRevenue: number;
    currentRevenue: number;
    avgTicketGoal: number;
    currentAvgTicket: number;
    customerRatingGoal: number;
    currentRating: number;
  };
};

export function CompanyGoalsWidget({ data }: CompanyGoalsWidgetProps) {
  const revenueProgress = (data.currentRevenue / data.monthlyRevenue) * 100;
  const ticketProgress = (data.currentAvgTicket / data.avgTicketGoal) * 100;
  const ratingProgress = (data.currentRating / data.customerRatingGoal) * 100;

  return (
    <div className="h-full overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
          <Target className="size-4 text-primary" />
        </div>
        <h3 className="font-bold text-lg">Company Goals</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Revenue</span>
            <span className="font-bold">
              ${data.currentRevenue.toLocaleString()} / ${data.monthlyRevenue.toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-foreground transition-all duration-500"
              style={{ width: `${Math.min(revenueProgress, 100)}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">{revenueProgress.toFixed(1)}% achieved</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Avg Ticket</span>
            <span className="font-bold">
              ${data.currentAvgTicket} / ${data.avgTicketGoal}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(ticketProgress, 100)}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">{ticketProgress.toFixed(1)}% achieved</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Rating</span>
            <span className="font-bold">
              {data.currentRating} / {data.customerRatingGoal}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
              style={{ width: `${Math.min(ratingProgress, 100)}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">{ratingProgress.toFixed(1)}% achieved</p>
        </div>
      </div>
    </div>
  );
}
