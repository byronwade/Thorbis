/**
 * Average Ticket Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Title, icon, large currency, full trend
 * - COMFORTABLE (200-400px): Abbreviated title, currency, compact trend
 * - COMPACT (120-200px): Icon + currency only
 * - TINY (<120px): Just the currency value
 */

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveWidgetWrapper,
  ResponsiveContent,
  ResponsiveText,
  ResponsiveIcon,
  ShowAt,
  ResponsiveFlex,
} from "../responsive-widget-wrapper";
import { formatCurrency, formatPercentage, getTrendClass } from "@/lib/utils/responsive-utils";

type AvgTicketWidgetProps = {
  data: {
    value: number;
    change: number;
  };
};

export function AvgTicketWidget({ data }: AvgTicketWidgetProps) {
  const isPositive = data.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-green-500/10 to-green-500/5">
      <ResponsiveContent className="flex flex-col justify-between">
        {/* FULL Stage: Complete title */}
        <ShowAt stage="full">
          <div className="flex items-center justify-between">
            <ResponsiveText variant="title">Average Ticket</ResponsiveText>
            <ResponsiveIcon>
              <DollarSign className="text-green-500" />
            </ResponsiveIcon>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Abbreviated title */}
        <ShowAt stage="comfortable">
          <ResponsiveFlex className="justify-between">
            <ResponsiveText variant="body" className="font-medium text-muted-foreground">
              Avg Ticket
            </ResponsiveText>
            <ResponsiveIcon>
              <DollarSign className="text-green-500" />
            </ResponsiveIcon>
          </ResponsiveFlex>
        </ShowAt>

        {/* COMPACT Stage: Icon only */}
        <ShowAt stage="compact">
          <div className="flex justify-center">
            <ResponsiveIcon>
              <DollarSign className="text-green-500" />
            </ResponsiveIcon>
          </div>
        </ShowAt>

        {/* Main currency value */}
        <div className="flex flex-col items-center justify-center @[120px]:items-start">
          <ResponsiveText variant="display" className="font-bold">
            {/* Show with $ on all sizes */}
            <span className="hidden @[120px]:inline">{formatCurrency(data.value, "comfortable")}</span>
            <span className="@[120px]:hidden">{formatCurrency(data.value, "tiny")}</span>
          </ResponsiveText>

          {/* Trend indicator */}
          <div className="mt-1">
            {/* FULL + COMFORTABLE: Full trend */}
            <ShowAt stage="full-comfortable">
              <span className={`inline-flex items-center gap-1 text-sm ${getTrendClass(data.change)}`}>
                <TrendIcon className="size-4" />
                {isPositive ? "+" : ""}
                {formatPercentage(data.change, "comfortable")}
              </span>
            </ShowAt>

            {/* COMPACT: Compact trend */}
            <ShowAt stage="compact">
              <span className={`text-xs ${getTrendClass(data.change)}`}>
                {isPositive ? "↑" : "↓"}
                {formatPercentage(data.change, "compact")}
              </span>
            </ShowAt>
          </div>
        </div>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
