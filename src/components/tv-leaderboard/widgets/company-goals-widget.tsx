/**
 * Company Goals Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): All 3 metrics with progress bars and labels
 * - COMFORTABLE (200-400px): 2 metrics (Revenue + Avg Ticket), compact
 * - COMPACT (120-200px): Revenue metric only, percentage text
 * - TINY (<120px): Just the revenue percentage
 */

import { Target } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils/responsive-utils";
import {
  ResponsiveContent,
  ResponsiveIcon,
  ResponsiveText,
  ResponsiveWidgetWrapper,
  ShowAt,
} from "../responsive-widget-wrapper";

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
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-primary/10 to-primary/5">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center gap-2">
          <ResponsiveIcon>
            <Target className="text-primary" />
          </ResponsiveIcon>
          <ShowAt stage="full">
            <ResponsiveText variant="title">Company Goals</ResponsiveText>
          </ShowAt>
          <ShowAt stage="comfortable">
            <ResponsiveText className="font-semibold" variant="body">
              Goals
            </ResponsiveText>
          </ShowAt>
        </div>

        {/* FULL Stage: All 3 metrics */}
        <ShowAt stage="full">
          <div className="space-y-3">
            {/* Revenue */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Revenue</span>
                <span className="font-bold">
                  {formatCurrency(data.currentRevenue, "comfortable")} /{" "}
                  {formatCurrency(data.monthlyRevenue, "comfortable")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-foreground transition-all duration-500"
                  style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {formatPercentage(revenueProgress, "full")} achieved
              </p>
            </div>

            {/* Avg Ticket */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Avg Ticket</span>
                <span className="font-bold">
                  {formatCurrency(data.currentAvgTicket, "comfortable")} /{" "}
                  {formatCurrency(data.avgTicketGoal, "comfortable")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(ticketProgress, 100)}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {formatPercentage(ticketProgress, "full")} achieved
              </p>
            </div>

            {/* Rating */}
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
              <p className="text-muted-foreground text-xs">
                {formatPercentage(ratingProgress, "full")} achieved
              </p>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Top 2 metrics only */}
        <ShowAt stage="comfortable">
          <div className="space-y-2">
            {/* Revenue */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <ResponsiveText variant="caption">Revenue</ResponsiveText>
                <ResponsiveText className="font-bold" variant="caption">
                  {formatPercentage(revenueProgress, "comfortable")}
                </ResponsiveText>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-foreground transition-all"
                  style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Avg Ticket */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <ResponsiveText variant="caption">Avg Ticket</ResponsiveText>
                <ResponsiveText className="font-bold" variant="caption">
                  {formatPercentage(ticketProgress, "comfortable")}
                </ResponsiveText>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                  style={{ width: `${Math.min(ticketProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Revenue percentage only */}
        <ShowAt stage="compact">
          <div className="flex flex-col items-center justify-center gap-1">
            <ResponsiveText className="text-muted-foreground" variant="caption">
              Revenue
            </ResponsiveText>
            <ResponsiveText
              className="font-bold text-primary"
              variant="display"
            >
              {formatPercentage(revenueProgress, "compact")}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the number */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText
              className="font-bold text-primary"
              variant="display"
            >
              {Math.round(revenueProgress)}%
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
