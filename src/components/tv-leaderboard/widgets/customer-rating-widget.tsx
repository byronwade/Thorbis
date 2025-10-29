/**
 * Customer Rating Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Title, star icon, large rating with stars, trend
 * - COMFORTABLE (200-400px): Abbreviated title, rating, compact trend
 * - COMPACT (120-200px): Star + rating only
 * - TINY (<120px): Just the rating number
 */

import { Star, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveWidgetWrapper,
  ResponsiveContent,
  ResponsiveText,
  ResponsiveIcon,
  ShowAt,
  ResponsiveFlex,
} from "../responsive-widget-wrapper";
import { formatPercentage, getTrendClass } from "@/lib/utils/responsive-utils";

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
              <Star className="fill-yellow-500 text-yellow-500" />
            </ResponsiveIcon>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Short title */}
        <ShowAt stage="comfortable">
          <ResponsiveFlex className="justify-between">
            <ResponsiveText variant="body" className="font-medium text-muted-foreground">
              Rating
            </ResponsiveText>
            <ResponsiveIcon>
              <Star className="fill-yellow-500 text-yellow-500" />
            </ResponsiveIcon>
          </ResponsiveFlex>
        </ShowAt>

        {/* COMPACT Stage: Star only */}
        <ShowAt stage="compact">
          <div className="flex justify-center">
            <ResponsiveIcon>
              <Star className="fill-yellow-500 text-yellow-500" />
            </ResponsiveIcon>
          </div>
        </ShowAt>

        {/* Main rating value */}
        <div className="flex flex-col items-center justify-center @[120px]:items-start">
          <ResponsiveText variant="display" className="font-bold">
            {data.rating.toFixed(1)}
          </ResponsiveText>

          {/* Star display - only on FULL */}
          <ShowAt stage="full">
            <div className="mt-1 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${i < Math.floor(data.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
          </ShowAt>

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
