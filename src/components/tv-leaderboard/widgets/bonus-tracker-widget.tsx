/**
 * Bonus Tracker Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): All metrics with progress bar and 3 stats
 * - COMFORTABLE (200-400px): Current bonus + target with progress
 * - COMPACT (120-200px): Current bonus with percentage
 * - TINY (<120px): Just the current bonus amount
 */

import { DollarSign, Target, Users } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils/responsive-utils";
import {
  ResponsiveContent,
  ResponsiveIcon,
  ResponsiveText,
  ResponsiveWidgetWrapper,
  ShowAt,
} from "../responsive-widget-wrapper";

type BonusTrackerData = {
  currentBonus: number;
  targetBonus: number;
  teamMembers: number;
  bonusPerPerson: number;
  daysRemaining: number;
  progress: number; // 0-100
};

type BonusTrackerWidgetProps = {
  data?: BonusTrackerData;
};

const DEFAULT_DATA: BonusTrackerData = {
  currentBonus: 12_500,
  targetBonus: 20_000,
  teamMembers: 12,
  bonusPerPerson: 1042,
  daysRemaining: 14,
  progress: 62.5,
};

export function BonusTrackerWidget({
  data = DEFAULT_DATA,
}: BonusTrackerWidgetProps) {
  const bonusPerPerson = Math.round(data.currentBonus / data.teamMembers);
  const remaining = data.targetBonus - data.currentBonus;

  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-background/80">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ResponsiveIcon>
              <DollarSign className="text-green-500" />
            </ResponsiveIcon>
            <ShowAt stage="full">
              <ResponsiveText variant="title">Team Bonus Pool</ResponsiveText>
            </ShowAt>
            <ShowAt stage="comfortable">
              <ResponsiveText className="font-semibold" variant="body">
                Bonus
              </ResponsiveText>
            </ShowAt>
          </div>
          <ShowAt stage="full-comfortable">
            <div className="rounded-full bg-green-500/20 px-2 py-0.5 text-green-500 text-xs">
              {data.daysRemaining}d
            </div>
          </ShowAt>
        </div>

        {/* FULL Stage: All metrics with progress bar and stats */}
        <ShowAt stage="full">
          <div className="flex flex-col gap-3">
            {/* Main metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  Current Bonus
                </ResponsiveText>
                <ResponsiveText
                  className="font-bold text-green-500"
                  variant="display"
                >
                  {formatCurrency(data.currentBonus, "comfortable")}
                </ResponsiveText>
              </div>
              <div className="space-y-1">
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  Target
                </ResponsiveText>
                <ResponsiveText className="font-bold" variant="display">
                  {formatCurrency(data.targetBonus, "comfortable")}
                </ResponsiveText>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold text-green-500">
                  {formatPercentage(data.progress, "full")}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-background/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(data.progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-background/50 p-2">
                <Users className="size-3.5 text-primary" />
                <div>
                  <ResponsiveText
                    className="text-muted-foreground"
                    variant="caption"
                  >
                    Team
                  </ResponsiveText>
                  <ResponsiveText className="font-bold" variant="body">
                    {data.teamMembers}
                  </ResponsiveText>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-background/50 p-2">
                <DollarSign className="size-3.5 text-green-500" />
                <div>
                  <ResponsiveText
                    className="text-muted-foreground"
                    variant="caption"
                  >
                    Each
                  </ResponsiveText>
                  <ResponsiveText
                    className="font-bold text-green-500"
                    variant="body"
                  >
                    ${bonusPerPerson}
                  </ResponsiveText>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-background/50 p-2">
                <Target className="size-3.5 text-orange-500" />
                <div>
                  <ResponsiveText
                    className="text-muted-foreground"
                    variant="caption"
                  >
                    Left
                  </ResponsiveText>
                  <ResponsiveText
                    className="font-bold text-orange-500"
                    variant="body"
                  >
                    ${(remaining / 1000).toFixed(0)}k
                  </ResponsiveText>
                </div>
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Current + Target with progress */}
        <ShowAt stage="comfortable">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <ResponsiveText variant="caption">Current</ResponsiveText>
              <ResponsiveText
                className="font-bold text-green-500"
                variant="body"
              >
                {formatCurrency(data.currentBonus, "comfortable")}
              </ResponsiveText>
            </div>
            <div className="space-y-1">
              <div className="relative h-1.5 overflow-hidden rounded-full bg-background/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                  style={{ width: `${Math.min(data.progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between">
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  {formatPercentage(data.progress, "comfortable")}
                </ResponsiveText>
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  {formatCurrency(data.targetBonus, "comfortable")}
                </ResponsiveText>
              </div>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Current bonus with percentage */}
        <ShowAt stage="compact">
          <div className="flex flex-col items-center justify-center gap-1">
            <ResponsiveText className="text-muted-foreground" variant="caption">
              Bonus
            </ResponsiveText>
            <ResponsiveText
              className="font-bold text-green-500"
              variant="display"
            >
              {formatCurrency(data.currentBonus, "compact")}
            </ResponsiveText>
            <ResponsiveText className="text-muted-foreground" variant="caption">
              {formatPercentage(data.progress, "compact")}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the current bonus */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText
              className="font-bold text-green-500"
              variant="display"
            >
              {formatCurrency(data.currentBonus, "tiny")}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
