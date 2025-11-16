/**
 * Settings Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell (header, search) renders instantly (5-20ms)
 * - Settings data streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { POSystemToggle } from "@/components/settings/po-system-toggle";
import { SettingsSearch } from "@/components/settings/settings-search";
import { SettingsSection } from "@/components/settings/settings-section";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSettingsOverviewData } from "@/lib/settings/overview-data";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

// Settings data component (async, streams in)
async function SettingsData({ searchParams }: PageProps) {
  const { q: searchQuery = "" } = await searchParams;
  const overview = await getSettingsOverviewData();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const sections = normalizedQuery
    ? overview.sections.filter((section) => {
        const matchesTitle = section.title
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesDescription = section.description
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesLink = section.links.some(
          (link) =>
            link.title.toLowerCase().includes(normalizedQuery) ||
            link.description.toLowerCase().includes(normalizedQuery)
        );
        return matchesTitle || matchesDescription || matchesLink;
      })
    : overview.sections;

  const generatedAtLabel = formatDistanceToNow(
    new Date(overview.meta.generatedAt),
    {
      addSuffix: true,
    }
  );
  const planStatus = overview.meta.subscriptionStatus ?? "unknown";
  const planBadgeVariant =
    planStatus === "active" || planStatus === "trialing"
      ? "default"
      : "destructive";
  const analyticsSection = overview.sections.find(
    (section) => section.slug === "analytics"
  );

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Workspace controls, advanced configuration, and telemetry
            </p>
          </div>
          <div className="w-full max-w-md">
            <Suspense fallback={null}>
              <SettingsSearch />
            </Suspense>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team</CardTitle>
              <CardDescription>Active workspace members</CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline gap-2">
              <span className="font-semibold text-3xl tracking-tight">
                {overview.meta.teamCount}
              </span>
              <span className="text-muted-foreground text-sm">active</span>
            </CardContent>
          </Card>
          <Card className="border-warning/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Alerts</CardTitle>
                <CardDescription>Clusters needing attention</CardDescription>
              </div>
              <Badge
                variant={
                  overview.meta.alerts.length ? "destructive" : "secondary"
                }
              >
                {overview.meta.alerts.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1.5 text-muted-foreground text-sm">
              {overview.meta.alerts.length ? (
                overview.meta.alerts.slice(0, 2).map((alert) => (
                  <div className="flex items-start gap-2" key={alert}>
                    <AlertCircle className="mt-0.5 size-4 text-warning" />
                    <span>{alert}</span>
                  </div>
                ))
              ) : (
                <p>All configuration clusters look healthy.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Plan status</CardTitle>
                <CardDescription>Billing + subscription</CardDescription>
              </div>
              <Badge variant={planBadgeVariant}>{planStatus}</Badge>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Last refreshed {generatedAtLabel}
            </CardContent>
          </Card>
          <POSystemToggle
            enabled={overview.meta.poSystemEnabled}
            lastEnabledAt={overview.meta.poSystemLastEnabledAt}
          />
        </div>
        {analyticsSection && analyticsSection.metrics.length > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Telemetry snapshot</CardTitle>
                <CardDescription>
                  Live signals from automation, activity, and communications
                </CardDescription>
              </div>
              <Badge variant="outline">Last 7 days</Badge>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {analyticsSection.metrics.slice(0, 3).map((metric) => (
                <div
                  className="rounded-xl border border-primary/20 bg-background/80 p-4 shadow-sm"
                  key={`${analyticsSection.slug}-${metric.key}-snapshot`}
                >
                  <p className="font-semibold text-primary text-xs uppercase tracking-wide">
                    {metric.label}
                  </p>
                  <p className="mt-1 font-semibold text-2xl tracking-tight">
                    {metric.value}
                  </p>
                  {metric.helper && (
                    <p className="text-muted-foreground text-sm">
                      {metric.helper}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </header>

      <div className="space-y-8">
        {sections.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center gap-3 text-center">
              <p className="font-semibold text-lg">
                No settings match “{searchQuery}”.
              </p>
              <p className="text-muted-foreground text-sm">
                Try another query or clear the search bar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <SettingsShell sections={sections}>
            {sections.map((section) => (
              <SettingsSection key={section.slug} section={section} />
            ))}
          </SettingsShell>
        )}
      </div>
    </div>
  );
}

// Loading skeleton
function SettingsSkeleton() {
  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-4xl tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Workspace controls, advanced configuration, and telemetry
            </p>
          </div>
          <div className="w-full max-w-md">
            <Suspense fallback={null}>
              <SettingsSearch />
            </Suspense>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div className="h-32 animate-pulse rounded-lg bg-muted" key={i} />
          ))}
        </div>
      </header>
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div className="h-48 animate-pulse rounded-lg bg-muted" key={i} />
        ))}
      </div>
    </div>
  );
}

export default function SettingsOverviewPage(props: PageProps) {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsData {...props} />
    </Suspense>
  );
}
