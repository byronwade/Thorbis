/**
 * Top Performer Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Avatar, name, rank, all 3 metrics with trend
 * - COMFORTABLE (200-400px): Smaller avatar, name, revenue + jobs
 * - COMPACT (120-200px): Avatar + revenue only
 * - TINY (<120px): Just the revenue number
 */

import { Briefcase, TrendingUp, Trophy } from "lucide-react";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  getTrendClass,
} from "@/lib/utils/responsive-utils";
import {
  ResponsiveContent,
  ResponsiveIcon,
  ResponsiveText,
  ResponsiveWidgetWrapper,
  ShowAt,
} from "../responsive-widget-wrapper";

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
  const isPositive = data.revenueChange >= 0;

  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center gap-2">
          <ResponsiveIcon>
            <Trophy className="text-warning" />
          </ResponsiveIcon>
          <ShowAt stage="full">
            <ResponsiveText variant="title">Top Performer</ResponsiveText>
          </ShowAt>
          <ShowAt stage="comfortable">
            <ResponsiveText className="font-semibold" variant="body">
              Top
            </ResponsiveText>
          </ShowAt>
        </div>

        {/* FULL Stage: Avatar, name, rank, all metrics */}
        <ShowAt stage="full">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 overflow-hidden text-center">
            {/* Avatar */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-3 border-warning/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-lg text-warning">
              {data.avatar}
            </div>

            {/* Name and rank */}
            <div className="min-h-0 overflow-hidden">
              <ResponsiveText className="truncate font-bold" variant="title">
                {data.name}
              </ResponsiveText>
              <ResponsiveText
                className="text-muted-foreground"
                variant="caption"
              >
                Rank #1
              </ResponsiveText>
            </div>

            {/* Metrics grid - more compact */}
            <div className="grid w-full grid-cols-3 gap-1.5 overflow-hidden">
              {/* Revenue */}
              <div className="min-h-0 overflow-hidden rounded-lg bg-background/50 p-1.5">
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  Revenue
                </ResponsiveText>
                <ResponsiveText className="truncate font-bold" variant="body">
                  {formatCurrency(data.revenue, "comfortable")}
                </ResponsiveText>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs ${getTrendClass(data.revenueChange)}`}
                >
                  <TrendingUp className="size-2.5" />
                  {isPositive ? "+" : ""}
                  {formatPercentage(data.revenueChange, "full")}
                </span>
              </div>

              {/* Jobs */}
              <div className="min-h-0 overflow-hidden rounded-lg bg-background/50 p-1.5">
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  Jobs
                </ResponsiveText>
                <ResponsiveText className="truncate font-bold" variant="body">
                  {formatNumber(data.jobsCompleted, "comfortable")}
                </ResponsiveText>
              </div>

              {/* Rating */}
              <div className="min-h-0 overflow-hidden rounded-lg bg-background/50 p-1.5">
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  Rating
                </ResponsiveText>
                <ResponsiveText className="truncate font-bold" variant="body">
                  {data.customerRating.toFixed(1)}
                </ResponsiveText>
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Smaller avatar, name, top 2 metrics */}
        <ShowAt stage="comfortable">
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 overflow-hidden">
            {/* Avatar + Name */}
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-warning/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-sm text-warning">
                {data.avatar}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <ResponsiveText className="truncate font-bold" variant="body">
                  {data.name}
                </ResponsiveText>
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  #1
                </ResponsiveText>
              </div>
            </div>

            {/* Top 2 metrics */}
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <div className="flex items-center gap-1">
                  <TrendingUp className="size-3 shrink-0 text-success" />
                  <ResponsiveText className="truncate" variant="caption">
                    Revenue
                  </ResponsiveText>
                </div>
                <ResponsiveText className="shrink-0 font-bold" variant="body">
                  {formatCurrency(data.revenue, "comfortable")}
                </ResponsiveText>
              </div>
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <div className="flex items-center gap-1">
                  <Briefcase className="size-3 shrink-0 text-primary" />
                  <ResponsiveText className="truncate" variant="caption">
                    Jobs
                  </ResponsiveText>
                </div>
                <ResponsiveText className="shrink-0 font-bold" variant="body">
                  {formatNumber(data.jobsCompleted, "comfortable")}
                </ResponsiveText>
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Avatar + Revenue only */}
        <ShowAt stage="compact">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-warning/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-warning text-xs">
              {data.avatar}
            </div>
            <ResponsiveText
              className="font-bold text-warning"
              variant="display"
            >
              {formatCurrency(data.revenue, "compact")}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the revenue number */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText
              className="font-bold text-warning"
              variant="display"
            >
              {formatCurrency(data.revenue, "tiny")}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
