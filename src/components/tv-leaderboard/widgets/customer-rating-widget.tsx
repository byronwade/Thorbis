/**
 * Customer Rating Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Title, star icon, large rating with stars, trend
 * - COMFORTABLE (200-400px): Abbreviated title, rating, compact trend
 * - COMPACT (120-200px): Star + rating only
 * - TINY (<120px): Just the rating number
 */

import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { formatPercentage, getTrendClass } from "@/lib/utils/responsive-utils";
import {
  ResponsiveContent,
  ResponsiveFlex,
  ResponsiveIcon,
  ResponsiveText,
  ResponsiveWidgetWrapper,
  ShowAt,
} from "../responsive-widget-wrapper";

type CustomerRatingWidgetProps = {
  data: {
    rating: number;
    change: number;
  };
};

export function CustomerRatingWidget({ data }: CustomerRatingWidgetProps) {
  const isPositive = data.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
      <ResponsiveContent className="flex flex-col justify-between">
        {/* FULL Stage: Full title */}
        <ShowAt stage="full">
          <div className="flex items-center justify-between">
            <ResponsiveText variant="title">Customer Rating</ResponsiveText>
            <ResponsiveIcon>
              <Star className="fill-yellow-500 text-warning" />
            </ResponsiveIcon>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Short title */}
        <ShowAt stage="comfortable">
          <ResponsiveFlex className="justify-between">
            <ResponsiveText
              className="font-medium text-muted-foreground"
              variant="body"
            >
              Rating
            </ResponsiveText>
            <ResponsiveIcon>
              <Star className="fill-yellow-500 text-warning" />
            </ResponsiveIcon>
          </ResponsiveFlex>
        </ShowAt>

        {/* COMPACT Stage: Star only */}
        <ShowAt stage="compact">
          <div className="flex justify-center">
            <ResponsiveIcon>
              <Star className="fill-yellow-500 text-warning" />
            </ResponsiveIcon>
          </div>
        </ShowAt>

        {/* Main rating value */}
        <div className="flex flex-col @[120px]:items-start items-center justify-center">
          <ResponsiveText className="font-bold" variant="display">
            {data.rating.toFixed(1)}
          </ResponsiveText>

          {/* Star display - only on FULL */}
          <ShowAt stage="full">
            <div className="mt-1 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  className={`size-3 ${i < Math.floor(data.rating) ? "fill-yellow-500 text-warning" : "text-muted-foreground"}`}
                  key={i}
                />
              ))}
            </div>
          </ShowAt>

          {/* Trend indicator */}
          <div className="mt-1">
            {/* FULL + COMFORTABLE: Full trend */}
            <ShowAt stage="full-comfortable">
              <span
                className={`inline-flex items-center gap-1 text-sm ${getTrendClass(data.change)}`}
              >
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
