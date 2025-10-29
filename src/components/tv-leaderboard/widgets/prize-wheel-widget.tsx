/**
 * Prize Wheel Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Current winner with prize details
 * - COMFORTABLE (200-400px): Winner with prize value
 * - COMPACT (120-200px): Winner name only
 * - TINY (<120px): Prize value only
 *
 * Note: Converted to Server Component. Interactive spinning removed for performance.
 */

import { Gift, Trophy } from "lucide-react";
import {
  ResponsiveWidgetWrapper,
  ResponsiveContent,
  ResponsiveText,
  ResponsiveIcon,
  ShowAt,
} from "../responsive-widget-wrapper";

type PrizeOption = {
  id: string;
  label: string;
  value?: string;
  winner?: string;
};

type PrizeWheelWidgetProps = {
  currentPrize?: PrizeOption;
};

const DEFAULT_PRIZE: PrizeOption = {
  id: "1",
  label: "$100 Bonus",
  value: "$100",
  winner: "Sarah J.",
};

export function PrizeWheelWidget({ currentPrize = DEFAULT_PRIZE }: PrizeWheelWidgetProps) {
  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-background/80">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center gap-2">
          <ResponsiveIcon>
            <Gift className="text-purple-500" />
          </ResponsiveIcon>
          <ShowAt stage="full">
            <ResponsiveText variant="title">Prize Winner</ResponsiveText>
          </ShowAt>
          <ShowAt stage="comfortable">
            <ResponsiveText variant="body" className="font-semibold">
              Prize
            </ResponsiveText>
          </ShowAt>
        </div>

        {/* FULL Stage: Winner with full details */}
        <ShowAt stage="full">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            {/* Trophy icon */}
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20">
              <Trophy className="size-8 text-purple-500" />
            </div>

            {/* Winner name */}
            <div>
              <ResponsiveText variant="caption" className="text-muted-foreground">
                Winner
              </ResponsiveText>
              <ResponsiveText variant="title" className="font-bold text-purple-500">
                {currentPrize.winner}
              </ResponsiveText>
            </div>

            {/* Prize */}
            <div className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <ResponsiveText variant="body" className="font-bold text-white">
                {currentPrize.label}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Winner with prize value */}
        <ShowAt stage="comfortable">
          <div className="flex flex-1 flex-col justify-center gap-3">
            {/* Winner */}
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-purple-500" />
              <ResponsiveText variant="body" className="font-bold">
                {currentPrize.winner}
              </ResponsiveText>
            </div>

            {/* Prize */}
            <div className="rounded-lg bg-purple-500/20 p-2 text-center">
              <ResponsiveText variant="body" className="font-bold text-purple-500">
                {currentPrize.label}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Winner name only */}
        <ShowAt stage="compact">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <Trophy className="size-6 text-purple-500" />
            <ResponsiveText variant="body" className="font-bold text-purple-500">
              {currentPrize.winner}
            </ResponsiveText>
            <ResponsiveText variant="caption" className="text-muted-foreground">
              {currentPrize.value || currentPrize.label}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Prize value only */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText variant="display" className="font-bold text-purple-500">
              {currentPrize.value || "🎁"}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
