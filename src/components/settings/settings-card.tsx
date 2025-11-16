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
    <Card className="h-full border-muted-foreground/20">
      <CardContent className="space-y-2 pt-6">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {metric.label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-2xl tracking-tight">
            {metric.value}
          </span>
          {typeof metric.trend === "number" && (
            <span
              className={cn(
                "font-medium text-xs",
                metric.trend >= 0 ? "text-success" : "text-destructive"
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
              "inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-xs",
              statusColors?.text,
              statusColors?.border,
              statusColors?.background
            )}
          >
            {describeHealthStatus(metric.status)}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
