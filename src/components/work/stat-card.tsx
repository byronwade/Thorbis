type StatCardProps = {
	label: string;
	value: string | number;
	subtext: string;
	trend?: "up" | "down" | "neutral";
};

export function StatCard({ label, value, subtext, trend }: StatCardProps) {
	const trendColor =
		trend === "up"
			? "text-success dark:text-success"
			: trend === "down"
				? "text-destructive dark:text-destructive"
				: "text-muted-foreground";

	return (
		<div className="border-border/40 bg-card/30 hover:bg-card/50 flex flex-col gap-1.5 rounded-lg border p-4 backdrop-blur-sm transition-colors">
			<div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
				{label}
			</div>
			<div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
			<div className={`text-xs ${trendColor}`}>{subtext}</div>
		</div>
	);
}
