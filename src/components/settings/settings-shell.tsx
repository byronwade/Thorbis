import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { SettingsOverviewSection } from "@/lib/settings/overview-data";
import { describeHealthStatus, getStatusColorClasses } from "@/lib/settings/status-utils";
import { cn } from "@/lib/utils";

interface SettingsShellProps {
  sections: SettingsOverviewSection[];
  children: ReactNode;
}

export function SettingsShell({ sections, children }: SettingsShellProps) {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
      <aside className="mb-10 lg:mb-0">
        <div className="lg:sticky lg:top-28 space-y-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Settings clusters
            </p>
            <nav className="mt-3 space-y-2">
              {sections.map((section) => {
                const statusColors = getStatusColorClasses(section.status);
                return (
                  <a
                    key={section.slug}
                    href={`#${section.slug}`}
                    className="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg border bg-muted p-1">
                        <section.icon className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{section.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {describeHealthStatus(section.status)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs font-semibold",
                        statusColors.text,
                        statusColors.background,
                        statusColors.border
                      )}
                      variant="outline"
                    >
                      {section.progress}%
                    </Badge>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
      <div className="space-y-12">{children}</div>
    </div>
  );
}

