/**
 * Top Performer Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Avatar, name, rank, all 3 metrics with trend
 * - COMFORTABLE (200-400px): Smaller avatar, name, revenue + jobs
 * - COMPACT (120-200px): Avatar + revenue only
 * - TINY (<120px): Just the revenue number
 */

import { Trophy, TrendingUp, Briefcase, Star } from "lucide-react";
import {
  ResponsiveWidgetWrapper,
  ResponsiveContent,
  ResponsiveText,
  ResponsiveIcon,
  ShowAt,
} from "../responsive-widget-wrapper";
import { formatCurrency, formatNumber, formatPercentage, getTrendClass } from "@/lib/utils/responsive-utils";

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
            <Trophy className="text-yellow-500" />
          </ResponsiveIcon>
          <ShowAt stage="full">
            <ResponsiveText variant="title">Top Performer</ResponsiveText>
          </ShowAt>
          <ShowAt stage="comfortable">
            <ResponsiveText variant="body" className="font-semibold">
              Top
            </ResponsiveText>
          </ShowAt>
        </div>

        {/* FULL Stage: Avatar, name, rank, all metrics */}
        <ShowAt stage="full">
          <div className="flex flex-col items-center gap-2 text-center">
            {/* Avatar */}
            <div className="flex size-16 items-center justify-center rounded-full border-4 border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-xl text-yellow-600">
              {data.avatar}
            </div>

            {/* Name and rank */}
            <div>
              <ResponsiveText variant="title" className="font-bold">
                {data.name}
              </ResponsiveText>
              <ResponsiveText variant="caption" className="text-muted-foreground">
                Rank #1
              </ResponsiveText>
            </div>

            {/* Metrics grid */}
            <div className="grid w-full grid-cols-3 gap-2">
              {/* Revenue */}
              <div className="rounded-lg bg-background/50 p-2">
                <ResponsiveText variant="caption" className="text-muted-foreground">
                  Revenue
                </ResponsiveText>
                <ResponsiveText variant="body" className="font-bold">
                  {formatCurrency(data.revenue, "comfortable")}
                </ResponsiveText>
                <span className={`inline-flex items-center gap-0.5 text-xs ${getTrendClass(data.revenueChange)}`}>
                  <TrendingUp className="size-3" />
                  {isPositive ? "+" : ""}
                  {formatPercentage(data.revenueChange, "full")}
                </span>
              </div>

              {/* Jobs */}
              <div className="rounded-lg bg-background/50 p-2">
                <ResponsiveText variant="caption" className="text-muted-foreground">
                  Jobs
                </ResponsiveText>
                <ResponsiveText variant="body" className="font-bold">
                  {formatNumber(data.jobsCompleted, "comfortable")}
                </ResponsiveText>
              </div>

              {/* Rating */}
              <div className="rounded-lg bg-background/50 p-2">
                <ResponsiveText variant="caption" className="text-muted-foreground">
                  Rating
                </ResponsiveText>
                <ResponsiveText variant="body" className="font-bold">
                  {data.customerRating.toFixed(1)}
                </ResponsiveText>
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Smaller avatar, name, top 2 metrics */}
        <ShowAt stage="comfortable">
          <div className="flex flex-col gap-2">
            {/* Avatar + Name */}
            <div className="flex items-center gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-sm text-yellow-600">
                {data.avatar}
              </div>
              <div className="flex-1 overflow-hidden">
                <ResponsiveText variant="body" className="truncate font-bold">
                  {data.name}
                </ResponsiveText>
                <ResponsiveText variant="caption" className="text-muted-foreground">
                  #1
                </ResponsiveText>
              </div>
            </div>

            {/* Top 2 metrics */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TrendingUp className="size-3 text-green-500" />
                  <ResponsiveText variant="caption">Revenue</ResponsiveText>
                </div>
                <ResponsiveText variant="body" className="font-bold">
                  {formatCurrency(data.revenue, "comfortable")}
                </ResponsiveText>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Briefcase className="size-3 text-blue-500" />
                  <ResponsiveText variant="caption">Jobs</ResponsiveText>
                </div>
                <ResponsiveText variant="body" className="font-bold">
                  {formatNumber(data.jobsCompleted, "comfortable")}
                </ResponsiveText>
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Avatar + Revenue only */}
        <ShowAt stage="compact">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 font-bold text-xs text-yellow-600">
              {data.avatar}
            </div>
            <ResponsiveText variant="display" className="font-bold text-yellow-500">
              {formatCurrency(data.revenue, "compact")}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the revenue number */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText variant="display" className="font-bold text-yellow-500">
              {formatCurrency(data.revenue, "tiny")}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
