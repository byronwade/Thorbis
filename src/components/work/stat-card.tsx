type StatCardProps = {
  label: string;
  value: string | number;
  subtext: string;
  trend?: "up" | "down" | "neutral";
};

export function StatCard({ label, value, subtext, trend }: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-green-600 dark:text-green-500"
      : trend === "down"
        ? "text-red-600 dark:text-red-500"
        : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border/40 bg-card/30 p-4 backdrop-blur-sm transition-colors hover:bg-card/50">
      <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </div>
      <div className="font-semibold text-2xl tabular-nums tracking-tight">
        {value}
      </div>
      <div className={`text-xs ${trendColor}`}>{subtext}</div>
    </div>
  );
}
