import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SettingsMetricCard } from "@/components/settings/settings-card";
import { SettingsQuickActions } from "@/components/settings/settings-quick-actions";
import type { SettingsOverviewSection } from "@/lib/settings/overview-data";
import { describeHealthStatus, getStatusColorClasses } from "@/lib/settings/status-utils";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  section: SettingsOverviewSection;
}

export function SettingsSection({ section }: SettingsSectionProps) {
  const statusColors = getStatusColorClasses(section.status);

  return (
    <section id={section.slug} className="scroll-mt-28 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary/10 p-3">
            <section.icon className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <p className="text-muted-foreground">{section.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Health</p>
          <p className={cn("font-semibold", statusColors.text)}>
            {describeHealthStatus(section.status)}
          </p>
        </div>
      </div>

      <Card className="border-muted-foreground/30">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Configuration summary</CardTitle>
            <CardDescription>{section.summary}</CardDescription>
          </div>
          <div className="min-w-[180px]">
            <p className="text-sm text-muted-foreground">Completion</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold">{section.progress}%</span>
              <Progress value={section.progress} className="h-2 flex-1" />
            </div>
          </div>
        </CardHeader>
        {section.quickActions.length > 0 && (
          <CardFooter className="flex flex-wrap gap-2">
            <SettingsQuickActions actions={section.quickActions} section={section.slug} />
          </CardFooter>
        )}
      </Card>

      {section.metrics.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {section.metrics.map((metric) => (
            <SettingsMetricCard key={`${section.slug}-${metric.key}`} metric={metric} />
          ))}
        </div>
      )}

      {section.checklist.length > 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Next best actions</CardTitle>
            <CardDescription>Quick tasks to improve this area</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {section.checklist.map((item) => (
                <li className="flex items-start gap-3" key={item.key}>
                  <div className="pt-0.5">
                    {item.completed ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={item.href}
                        className="font-medium text-sm text-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                      {!item.completed && (
                        <span className="text-xs text-muted-foreground">
                          {describeHealthStatus("warning")}
                        </span>
                      )}
                    </div>
                    {item.helper && (
                      <p className="text-sm text-muted-foreground">{item.helper}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {section.links.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deep links</CardTitle>
            <CardDescription>Jump directly into detailed settings pages</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start justify-between rounded-xl border px-4 py-3 transition hover:border-primary"
              >
                <div>
                  <p className="font-medium">{link.title}</p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ExternalLink className="mt-1 size-4 text-muted-foreground transition group-hover:text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  );
}

