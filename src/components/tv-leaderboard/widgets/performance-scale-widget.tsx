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
  if (score >= 85) {
    return "text-success";
  }
  if (score >= 70) {
    return "text-primary";
  }
  if (score >= 50) {
    return "text-warning";
  }
  return "text-destructive";
}

// Get performance level text
function getPerformanceLevel(score: number): { level: string; color: string } {
  if (score >= 90) {
    return { level: "Exceptional", color: "text-success" };
  }
  if (score >= 80) {
    return { level: "Excellent", color: "text-success" };
  }
  if (score >= 70) {
    return { level: "Good", color: "text-primary" };
  }
  if (score >= 60) {
    return { level: "Fair", color: "text-warning" };
  }
  return { level: "Needs Work", color: "text-destructive" };
}

export function PerformanceScaleWidget({
  data = DEFAULT_DATA,
}: PerformanceScaleWidgetProps) {
  const scoreChange = data.currentScore - data.previousScore;
  const scoreColor = getScoreColor(data.currentScore);
  const { level: performanceLevel, color: levelColor } = getPerformanceLevel(
    data.currentScore
  );
  const targetDiff = data.target - data.currentScore;
  const _progressPercent = (data.currentScore / data.target) * 100;

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
                <ResponsiveText
                  className="text-muted-foreground"
                  variant="caption"
                >
                  {data.metric}
                </ResponsiveText>
              </div>
            </ShowAt>
            <ShowAt stage="comfortable">
              <ResponsiveText className="font-semibold" variant="body">
                Performance
              </ResponsiveText>
            </ShowAt>
          </div>

          {/* Score change indicator */}
          <ShowAt stage="full-comfortable">
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                scoreChange >= 0
                  ? "bg-success/20 text-success"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              <TrendingUp
                className={`size-3 ${scoreChange < 0 ? "rotate-180" : ""}`}
              />
              {scoreChange >= 0 ? "+" : ""}
              {scoreChange}
            </div>
          </ShowAt>
        </div>

        {/* FULL Stage: Score with visual gauge */}
        <ShowAt stage="full">
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
            {/* Large score display */}
            <div className="text-center">
              <ResponsiveText
                className={cn("font-bold", scoreColor)}
                variant="display"
              >
                {data.currentScore}
              </ResponsiveText>
              <ResponsiveText
                className="text-muted-foreground"
                variant="caption"
              >
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
              <ResponsiveText
                className="text-muted-foreground"
                variant="caption"
              >
                Level
              </ResponsiveText>
              <ResponsiveText
                className={`font-bold ${levelColor}`}
                variant="body"
              >
                {performanceLevel}
              </ResponsiveText>
            </div>

            {/* Target info */}
            <div className="flex items-center justify-between rounded-lg bg-warning/10 p-1.5">
              <div className="flex items-center gap-1.5">
                <Target className="size-3.5 text-warning" />
                <ResponsiveText variant="caption">
                  Target: {data.target}
                </ResponsiveText>
              </div>
              <ResponsiveText
                className="font-bold text-warning"
                variant="caption"
              >
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
              <ResponsiveText
                className={cn("font-bold", scoreColor)}
                variant="display"
              >
                {data.currentScore}
              </ResponsiveText>
              <ResponsiveText className={levelColor} variant="caption">
                {performanceLevel}
              </ResponsiveText>
            </div>

            {/* Target */}
            <div className="flex items-center justify-between rounded-lg bg-warning/10 p-1.5">
              <ResponsiveText variant="caption">Target</ResponsiveText>
              <ResponsiveText className="font-bold" variant="caption">
                {data.target}
              </ResponsiveText>
            </div>
          </div>
        </ShowAt>

        {/* COMPACT Stage: Score with level only */}
        <ShowAt stage="compact">
          <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
            <ResponsiveText
              className={cn("font-bold", scoreColor)}
              variant="display"
            >
              {data.currentScore}
            </ResponsiveText>
            <ResponsiveText className={levelColor} variant="caption">
              {performanceLevel}
            </ResponsiveText>
          </div>
        </ShowAt>

        {/* TINY Stage: Just the score number */}
        <ShowAt stage="tiny">
          <div className="flex h-full items-center justify-center">
            <ResponsiveText
              className={cn("font-bold", scoreColor)}
              variant="display"
            >
              {data.currentScore}
            </ResponsiveText>
          </div>
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
