/**
 * Daily Stats Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): All 4 metrics in 2x2 grid with icons and labels
 * - COMFORTABLE (200-400px): Top 2 metrics (Revenue + Jobs) with icons
 * - COMPACT (120-200px): Revenue only with label
 * - TINY (<120px): Just the revenue number
 */

import { Calendar, DollarSign, Briefcase, Star } from "lucide-react";
import {
  ResponsiveWidgetWrapper,
  ResponsiveContent,
  ResponsiveText,
  ResponsiveIcon,
  ShowAt,
} from "../responsive-widget-wrapper";
import { formatCurrency, formatNumber } from "@/lib/utils/responsive-utils";

type DailyStatsWidgetProps = {
  data: {
    revenue: number;
    jobs: number;
    avgTicket: number;
    rating: number;
  };
};

export function DailyStatsWidget({ data }: DailyStatsWidgetProps) {
  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-green-500/10 to-green-500/5">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center gap-2">
          <ResponsiveIcon>
            <Calendar className="text-green-500" />
          </ResponsiveIcon>
          <ShowAt stage="full">
            <ResponsiveText variant="title">Today's Performance</ResponsiveText>
          </ShowAt>
          <ShowAt stage="comfortable">
            <ResponsiveText variant="body" className="font-semibold">
              Today
            </ResponsiveText>
          </ShowAt>
        </div>

        {/* FULL Stage: All 4 metrics in 2x2 grid */}
        <ShowAt stage="full">
          <div className="grid flex-1 grid-cols-2 gap-2">
            {/* Revenue */}
            <div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <DollarSign className="size-3.5" />
                Revenue
              </div>
              <ResponsiveText variant="display" className="mt-1 font-bold">
                {formatCurrency(data.revenue, "comfortable")}
              </ResponsiveText>
            </div>

            {/* Jobs */}
            <div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Briefcase className="size-3.5" />
                Jobs
              </div>
              <ResponsiveText variant="display" className="mt-1 font-bold">
                {formatNumber(data.jobs, "comfortable")}
              </ResponsiveText>
            </div>

            {/* Avg Ticket */}
            <div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <DollarSign className="size-3.5" />
                Avg Ticket
              </div>
              <ResponsiveText variant="display" className="mt-1 font-bold">
                {formatCurrency(data.avgTicket, "comfortable")}
              </ResponsiveText>
            </div>

            {/* Rating */}
            <div className="flex flex-col justify-center rounded-lg border border-primary/10 bg-primary/5 p-2">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Star className="size-3.5" />
                Rating
              </div>
              <ResponsiveText variant="display" className="mt-1 font-bold">
                {data.rating.toFixed(1)}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Top 2 metrics only */}
        <ShowAt stage="comfortable">
          <div className="space-y-2">
            {/* Revenue */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-green-500" />
                <ResponsiveText variant="caption">Revenue</ResponsiveText>
              </div>
              <ResponsiveText variant="body" className="font-bold">
                {formatCurrency(data.revenue, "comfortable")}
              </ResponsiveText>
            </div>

            {/* Jobs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Briefcase className="size-3.5 text-blue-500" />
                <ResponsiveText variant="caption">Jobs</ResponsiveText>
              </div>
              <ResponsiveText variant="body" className="font-bold">
                {formatNumber(data.jobs, "comfortable")}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Revenue only */}
        <ShowAt stage="compact">
          <div className="flex flex-col items-center justify-center gap-1">
            <ResponsiveText variant="caption" className="text-muted-foreground">
              Revenue
            </ResponsiveText>
            <ResponsiveText variant="display" className="font-bold text-green-500">
              {formatCurrency(data.revenue, "compact")}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the number */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText variant="display" className="font-bold text-green-500">
              {formatCurrency(data.revenue, "tiny")}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
