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
					<CardTitle className="font-medium text-muted-foreground text-sm">{title}</CardTitle>
					{tooltip && <KPICardTooltip tooltip={tooltip} />}
				</div>
				<div className="flex size-9 items-center justify-center rounded-lg bg-muted/50">
					<Icon className="size-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="font-bold text-3xl tracking-tight">{value}</div>
				<div className="flex flex-col gap-0.5">
					{change && (
						<p
							className={cn(
								"font-medium text-xs",
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
