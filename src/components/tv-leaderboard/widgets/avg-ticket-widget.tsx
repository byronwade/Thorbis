/**
 * Avg Ticket Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static data visualization rendered on server
 * - Reduced JavaScript bundle size for TV displays
 */

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

type AvgTicketWidgetProps = {
  data: {
    value: number;
    change: number;
  };
};

export function AvgTicketWidget({ data }: AvgTicketWidgetProps) {
  const isPositive = data.change >= 0;

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-muted-foreground text-sm">Avg Ticket</h3>
        <DollarSign className="size-5 text-green-500" />
      </div>
      <div>
        <p className="font-bold text-3xl">${data.value}</p>
        <span className={`inline-flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          {isPositive ? "+" : ""}
          {data.change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
