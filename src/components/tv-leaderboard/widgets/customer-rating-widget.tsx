/**
 * Customer Rating Widget - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - Static data visualization rendered on server
 * - Reduced JavaScript bundle size for TV displays
 */

import { Star, TrendingUp, TrendingDown } from "lucide-react";

type CustomerRatingWidgetProps = {
  data: {
    rating: number;
    change: number;
  };
};

export function CustomerRatingWidget({ data }: CustomerRatingWidgetProps) {
  const isPositive = data.change >= 0;

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-muted-foreground text-sm">Customer Rating</h3>
        <Star className="size-5 text-yellow-500" />
      </div>
      <div>
        <p className="font-bold text-3xl">{data.rating}</p>
        <span className={`inline-flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          {isPositive ? "+" : ""}
          {data.change.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
