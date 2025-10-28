/**
 * Leaderboard Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static data visualization rendered on server
 * - Reduced JavaScript bundle size for TV displays
 */

import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

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

function TrendIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 font-medium text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
      {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

export function LeaderboardWidget({ data }: LeaderboardWidgetProps) {
  const { technicians } = data;
  const displayTechs = technicians.slice(0, 5);

  return (
    <div className="h-full overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-background/90 to-background/70 p-4 backdrop-blur-sm">
      <h3 className="mb-4 font-bold text-lg">Top Technicians</h3>
      <div className="space-y-2">
        {displayTechs.map((tech, idx) => (
          <div className="flex items-center gap-3 rounded-lg border border-primary/10 bg-primary/5 p-3" key={tech.id}>
            <div className="flex items-center gap-2 min-w-[80px]">
              {idx < 3 && (
                <Trophy
                  className={`size-4 ${
                    idx === 0
                      ? "text-yellow-500"
                      : idx === 1
                        ? "text-gray-400"
                        : "text-orange-600"
                  }`}
                />
              )}
              <span className="font-bold text-xl">{idx + 1}</span>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary text-sm">
              {tech.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold text-sm">{tech.name}</p>
              <TrendIndicator value={tech.stats.revenueChange} />
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">${tech.stats.revenue.toLocaleString()}</p>
              <p className="text-muted-foreground text-xs">{tech.stats.jobsCompleted} jobs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
