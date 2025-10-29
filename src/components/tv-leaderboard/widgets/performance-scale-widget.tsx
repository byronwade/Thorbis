/**
 * Performance Scale Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Score with gauge, level, and target info
 * - COMFORTABLE (200-400px): Score with level and target
 * - COMPACT (120-200px): Score with level only
 * - TINY (<120px): Just the score number
 */

import { Gauge, Target, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPercentage } from "@/lib/utils/responsive-utils";

import {
  ResponsiveContent,
  ResponsiveIcon,
  ResponsiveText,
  ResponsiveWidgetWrapper,
  ShowAt,
} from "../responsive-widget-wrapper";

type PerformanceScaleData = {
  currentScore: number; // 0-100
  previousScore: number;
  target: number;
  label: string;
  metric: string;
};

type PerformanceScaleWidgetProps = {
  data?: PerformanceScaleData;
};

const DEFAULT_DATA: PerformanceScaleData = {
  currentScore: 78,
  previousScore: 72,
  target: 85,
  label: "Team Performance",
  metric: "Overall Score",
};

// Get color based on score
function getScoreColor(score: number): string {
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-blue-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

// Get performance level text
function getPerformanceLevel(score: number): { level: string; color: string } {
  if (score >= 90) return { level: "Exceptional", color: "text-green-500" };
  if (score >= 80) return { level: "Excellent", color: "text-green-500" };
  if (score >= 70) return { level: "Good", color: "text-blue-500" };
  if (score >= 60) return { level: "Fair", color: "text-orange-500" };
  return { level: "Needs Work", color: "text-red-500" };
}

export function PerformanceScaleWidget({ data = DEFAULT_DATA }: PerformanceScaleWidgetProps) {
  const scoreChange = data.currentScore - data.previousScore;
  const scoreColor = getScoreColor(data.currentScore);
  const { level: performanceLevel, color: levelColor } = getPerformanceLevel(data.currentScore);
  const targetDiff = data.target - data.currentScore;
  const progressPercent = (data.currentScore / data.target) * 100;

  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-background/90 to-background/70">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ResponsiveIcon>
              <Gauge className="text-primary" />
            </ResponsiveIcon>
            <ShowAt stage="full">
              <div>
                <ResponsiveText variant="title">{data.label}</ResponsiveText>
                <ResponsiveText variant="caption" className="text-muted-foreground">
                  {data.metric}
                </ResponsiveText>
              </div>
            </ShowAt>
            <ShowAt stage="comfortable">
              <ResponsiveText variant="body" className="font-semibold">
                Performance
              </ResponsiveText>
            </ShowAt>
          </div>

          {/* Score change indicator */}
          <ShowAt stage="full-comfortable">
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                scoreChange >= 0
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              <TrendingUp className={`size-3 ${scoreChange < 0 ? "rotate-180" : ""}`} />
              {scoreChange >= 0 ? "+" : ""}
              {scoreChange}
            </div>
          </ShowAt>
        </div>

        {/* FULL Stage: Score with visual gauge */}
        <ShowAt stage="full">
          <div className="flex flex-1 flex-col justify-center gap-4">
            {/* Large score display */}
            <div className="text-center">
              <ResponsiveText variant="display" className={cn("font-bold", scoreColor)}>
                {data.currentScore}
              </ResponsiveText>
              <ResponsiveText variant="caption" className="text-muted-foreground">
                out of 100
              </ResponsiveText>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-3 overflow-hidden rounded-full bg-background/50">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(data.currentScore, 100)}%`,
                    backgroundColor: scoreColor,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Performance level */}
            <div className="rounded-lg bg-background/50 p-2 text-center">
              <ResponsiveText variant="caption" className="text-muted-foreground">
                Level
              </ResponsiveText>
              <ResponsiveText variant="body" className={`font-bold ${levelColor}`}>
                {performanceLevel}
              </ResponsiveText>
            </div>

            {/* Target info */}
            <div className="flex items-center justify-between rounded-lg bg-orange-500/10 p-2">
              <div className="flex items-center gap-1.5">
                <Target className="size-3.5 text-orange-500" />
                <ResponsiveText variant="caption">Target: {data.target}</ResponsiveText>
              </div>
              <ResponsiveText variant="caption" className="font-bold text-orange-500">
                {targetDiff > 0 ? `${targetDiff} to go` : "Met!"}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Score with level and target */}
        <ShowAt stage="comfortable">
          <div className="flex flex-1 flex-col justify-center gap-2">
            {/* Score */}
            <div className="text-center">
              <ResponsiveText variant="display" className={cn("font-bold", scoreColor)}>
                {data.currentScore}
              </ResponsiveText>
              <ResponsiveText variant="caption" className={levelColor}>
                {performanceLevel}
              </ResponsiveText>
            </div>

            {/* Target */}
            <div className="flex items-center justify-between rounded-lg bg-orange-500/10 p-1.5">
              <ResponsiveText variant="caption">Target</ResponsiveText>
              <ResponsiveText variant="caption" className="font-bold">
                {data.target}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Score with level only */}
        <ShowAt stage="compact">
          <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
            <ResponsiveText variant="display" className={cn("font-bold", scoreColor)}>
              {data.currentScore}
            </ResponsiveText>
            <ResponsiveText variant="caption" className={levelColor}>
              {performanceLevel}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the score number */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText variant="display" className={cn("font-bold", scoreColor)}>
              {data.currentScore}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
