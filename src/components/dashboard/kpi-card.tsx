import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KPICardTooltip } from "./kpi-card-client";

type KPICardProps = {
	title: string;
	value: string;
	change?: string;
	changeType?: "positive" | "negative" | "neutral" | "warning";
	icon: LucideIcon;
	description?: string;
	tooltip?: string;
};

export function KPICard({
	title,
	value,
	change,
	changeType = "neutral",
	icon: Icon,
	description,
	tooltip,
}: KPICardProps) {
	return (
		<Card className="transition-all duration-200 hover:shadow-md">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<div className="flex items-center gap-2">
					<CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
					{tooltip && <KPICardTooltip tooltip={tooltip} />}
				</div>
				<div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg">
					<Icon className="text-muted-foreground size-4" />
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="text-3xl font-bold tracking-tight">{value}</div>
				<div className="flex flex-col gap-0.5">
					{change && (
						<p
							className={cn(
								"text-xs font-medium",
								changeType === "positive" && "text-success dark:text-success",
								changeType === "negative" && "text-destructive dark:text-destructive",
								changeType === "neutral" && "text-muted-foreground",
								changeType === "warning" && "text-warning dark:text-warning"
							)}
						>
							{change}
						</p>
					)}
					{description && <p className="text-muted-foreground text-xs">{description}</p>}
				</div>
			</CardContent>
		</Card>
	);
}
