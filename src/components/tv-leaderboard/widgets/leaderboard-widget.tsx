/**
 * Leaderboard Widget - Fully Responsive
 *
 * Responsive stages:
 * - FULL (>400px): Top 5 technicians with full details (rank, avatar, name, trend, revenue, jobs)
 * - COMFORTABLE (200-400px): Top 3 technicians with compact layout
 * - COMPACT (120-200px): Top 1 technician with minimal info
 * - TINY (<120px): Just #1's revenue
 */

import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveWidgetWrapper,
  ResponsiveContent,
  ResponsiveText,
  ResponsiveIcon,
  ShowAt,
} from "../responsive-widget-wrapper";
import { formatCurrency, formatNumber, getAdaptiveCount, getTrendClass } from "@/lib/utils/responsive-utils";

type Technician = {
  id: string;
  name: string;
  avatar: string;
  stats: {
    revenue: number;
    revenueChange: number;
    jobsCompleted: number;
    jobsChange: number;
    avgTicket: number;
    avgTicketChange: number;
    customerRating: number;
    ratingChange: number;
  };
};

type LeaderboardWidgetProps = {
  data: {
    technicians: Technician[];
  };
};

function TrophyIcon({ rank }: { rank: number }) {
  if (rank >= 3) return null;
  const colors = ["text-yellow-500", "text-gray-400", "text-orange-600"];
  return <Trophy className={`size-3.5 ${colors[rank]}`} />;
}

export function LeaderboardWidget({ data }: LeaderboardWidgetProps) {
  const { technicians } = data;

  return (
    <ResponsiveWidgetWrapper className="bg-gradient-to-br from-primary/10 to-primary/5">
      <ResponsiveContent className="flex flex-col gap-3">
        {/* Header - adapts across stages */}
        <div className="flex items-center gap-2">
          <ResponsiveIcon>
            <Trophy className="text-yellow-500" />
          </ResponsiveIcon>
          <ShowAt stage="full">
            <ResponsiveText variant="title">Top Technicians</ResponsiveText>
          </ShowAt>
          <ShowAt stage="comfortable">
            <ResponsiveText variant="body" className="font-semibold">
              Leaders
            </ResponsiveText>
          </ShowAt>
        </div>

        {/* FULL Stage: Top 5 technicians with full details */}
        <ShowAt stage="full">
          <div className="space-y-2">
            {technicians.slice(0, 5).map((tech, idx) => {
              const isPositive = tech.stats.revenueChange >= 0;
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;

              return (
                <div className="flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-2" key={tech.id}>
                  {/* Rank + Trophy */}
                  <div className="flex items-center gap-1.5 w-10">
                    <TrophyIcon rank={idx} />
                    <ResponsiveText variant="body" className="font-bold">
                      {idx + 1}
                    </ResponsiveText>
                  </div>

                  {/* Avatar */}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary text-xs">
                    {tech.avatar}
                  </div>

                  {/* Name + Trend */}
                  <div className="flex-1 min-w-0">
                    <ResponsiveText variant="body" className="truncate font-semibold">
                      {tech.name}
                    </ResponsiveText>
                    <span className={`inline-flex items-center gap-0.5 text-xs ${getTrendClass(tech.stats.revenueChange)}`}>
                      <TrendIcon className="size-3" />
                      {isPositive ? "+" : ""}
                      {tech.stats.revenueChange.toFixed(1)}%
                    </span>
                  </div>

                  {/* Revenue + Jobs */}
                  <div className="text-right">
                    <ResponsiveText variant="body" className="font-bold">
                      {formatCurrency(tech.stats.revenue, "comfortable")}
                    </ResponsiveText>
                    <ResponsiveText variant="caption" className="text-muted-foreground">
                      {formatNumber(tech.stats.jobsCompleted, "comfortable")} jobs
                    </ResponsiveText>
                  </div>
                </div>
              );
            })}
          </div>
        </ShowAt>

        {/* COMFORTABLE Stage: Top 3 technicians compact */}
        <ShowAt stage="comfortable">
          <div className="space-y-2">
            {technicians.slice(0, 3).map((tech, idx) => (
              <div className="flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-1.5" key={tech.id}>
                {/* Rank */}
                <div className="flex items-center gap-1 w-8">
                  <TrophyIcon rank={idx} />
                  <ResponsiveText variant="caption" className="font-bold">
                    {idx + 1}
                  </ResponsiveText>
                </div>

                {/* Avatar */}
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary text-[10px]">
                  {tech.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <ResponsiveText variant="caption" className="truncate font-semibold">
                    {tech.name}
                  </ResponsiveText>
                </div>

                {/* Revenue */}
                <ResponsiveText variant="caption" className="font-bold">
                  {formatCurrency(tech.stats.revenue, "comfortable")}
                </ResponsiveText>
              </div>
            ))}
          </div>
        </ShowAt>

        {/* COMPACT Stage: Top 1 only */}
        <ShowAt stage="compact">
          {technicians[0] && (
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-1">
                <Trophy className="size-3 text-yellow-500" />
                <ResponsiveText variant="caption" className="font-bold">
                  #1
                </ResponsiveText>
              </div>
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 font-bold text-primary text-[10px]">
                {technicians[0].avatar}
              </div>
              <ResponsiveText variant="body" className="font-bold">
                {formatCurrency(technicians[0].stats.revenue, "compact")}
              </ResponsiveText>
            </div>
          )}
        </ShowAt>

        {/* TINY Stage: Just #1's revenue */}
        <ShowAt stage="tiny">
          {technicians[0] && (
            <div className="flex h-full items-center justify-center">
              <ResponsiveText variant="display" className="font-bold text-yellow-500">
                {formatCurrency(technicians[0].stats.revenue, "tiny")}
              </ResponsiveText>
            </div>
          )}
        </ShowAt>
      </ResponsiveContent>
    </ResponsiveWidgetWrapper>
  );
}
