import { Card, CardContent } from "@/components/ui/card";
import type { SettingsMetricDatum } from "@/lib/settings/overview-data";
import {
	describeHealthStatus,
	formatTrendDelta,
	getStatusColorClasses,
} from "@/lib/settings/status-utils";
import { cn } from "@/lib/utils";

type SettingsMetricCardProps = {
	metric: SettingsMetricDatum;
};

export function SettingsMetricCard({ metric }: SettingsMetricCardProps) {
	const statusColors = metric.status
		? getStatusColorClasses(metric.status)
		: null;

	return (
		<Card className="border-muted-foreground/20 h-full">
			<CardContent className="space-y-2 pt-6">
				<p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
					{metric.label}
				</p>
				<div className="flex items-baseline gap-2">
					<span className="text-2xl font-semibold tracking-tight">
						{metric.value}
					</span>
					{typeof metric.trend === "number" && (
						<span
							className={cn(
								"text-xs font-medium",
								metric.trend >= 0 ? "text-success" : "text-destructive",
							)}
						>
							{formatTrendDelta(metric.trend)}
						</span>
					)}
				</div>
				{metric.helper && (
					<p className="text-muted-foreground text-sm leading-relaxed">
						{metric.helper}
					</p>
				)}
				{metric.status && (
					<span
						className={cn(
							"inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
							statusColors?.text,
							statusColors?.border,
							statusColors?.background,
						)}
					>
						{describeHealthStatus(metric.status)}
					</span>
				)}
			</CardContent>
		</Card>
	);
}
