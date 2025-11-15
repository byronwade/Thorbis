import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, MapPin, Settings, Users, Zap } from "lucide-react";
import Link from "next/link";
import { getScheduleOverview } from "@/actions/settings";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const revalidate = 3600;

type ScheduleSectionKey =
  | "calendar"
  | "availability"
  | "serviceAreas"
  | "dispatch"
  | "team";

const scheduleSections: Array<{
  key: ScheduleSectionKey;
  title: string;
  description: string;
  icon: typeof Calendar;
  href: string;
  color: string;
  bgColor: string;
}> = [
  {
    key: "calendar",
    title: "Calendar Settings",
    description: "Configure calendar view, business hours, and time zones",
    icon: Calendar,
    href: "/dashboard/settings/schedule/calendar",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "availability",
    title: "Availability",
    description: "Set technician availability and working hours",
    icon: Clock,
    href: "/dashboard/settings/schedule/availability",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    key: "serviceAreas",
    title: "Service Areas",
    description: "Define service territories and travel time",
    icon: MapPin,
    href: "/dashboard/settings/schedule/service-areas",
    color: "text-accent-foreground",
    bgColor: "bg-accent/10",
  },
  {
    key: "dispatch",
    title: "Dispatch Rules",
    description: "Automatic job assignment and routing",
    icon: Zap,
    href: "/dashboard/settings/schedule/dispatch-rules",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    key: "team",
    title: "Team Scheduling",
    description: "Manage crew assignments and capacity",
    icon: Users,
    href: "/dashboard/settings/schedule/team-scheduling",
    color: "text-accent-foreground",
    bgColor: "bg-accent/10",
  },
];

const formatUpdatedLabel = (timestamp: string | null) =>
  timestamp
    ? `Updated ${formatDistanceToNow(new Date(timestamp), { addSuffix: true })}`
    : "Never configured";

const capitalize = (value: string | null) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export default async function ScheduleSettingsPage() {
  const overviewResult = await getScheduleOverview();

  if (!overviewResult.success) {
    throw new Error(overviewResult.error ?? "Failed to load schedule overview");
  }

  if (!overviewResult.data) {
    throw new Error("Failed to load schedule overview");
  }

  const overview = overviewResult.data;
  const readinessPercent = overview.readinessScore;

  const metrics = [
    {
      label: "Service areas",
      value: overview.serviceAreas.total
        ? `${overview.serviceAreas.active}/${overview.serviceAreas.total}`
        : "0",
      helper: overview.serviceAreas.total
        ? "Active / total coverage zones"
        : "No territories defined",
    },
    {
      label: "Dispatch automation",
      value: overview.dispatchRules.total.toString(),
      helper: overview.dispatchRules.active
        ? `${overview.dispatchRules.active} active rules`
        : "Automation disabled",
    },
    {
      label: "Crew guardrails",
      value: overview.teamRules.configured
        ? `${overview.teamRules.maxJobsPerDay ?? overview.teamRules.maxJobsPerWeek ?? 0} jobs`
        : "None",
      helper: overview.teamRules.configured
        ? overview.teamRules.requireBreaks
          ? "Breaks enforced"
          : "Breaks optional"
        : "Set workload + break policies",
    },
  ];

  const sectionStatusMap: Record<
    ScheduleSectionKey,
    { configured: boolean; statusLabel: string; helperText: string }
  > = {
    calendar: {
      configured: overview.calendar.configured,
      statusLabel: overview.calendar.configured
        ? `${capitalize(overview.calendar.defaultView ?? "week")} view`
        : "Not configured",
      helperText: overview.calendar.configured
        ? formatUpdatedLabel(overview.calendar.updatedAt)
        : "Set default view, start day, and colors",
    },
    availability: {
      configured: overview.availability.configured,
      statusLabel: overview.availability.configured
        ? "Default hours set"
        : "Missing work hours",
      helperText: overview.availability.configured
        ? formatUpdatedLabel(overview.availability.updatedAt)
        : "Configure working hours & buffers",
    },
    serviceAreas: {
      configured: overview.serviceAreas.total > 0,
      statusLabel: overview.serviceAreas.total
        ? `${overview.serviceAreas.active}/${overview.serviceAreas.total} active`
        : "No territories",
      helperText: overview.serviceAreas.total
        ? "Coverage rules enforce travel limits"
        : "Define regions to control travel time",
    },
    dispatch: {
      configured: overview.dispatchRules.total > 0,
      statusLabel: overview.dispatchRules.total
        ? `${overview.dispatchRules.active} active`
        : "No automation",
      helperText: overview.dispatchRules.total
        ? overview.dispatchRules.updatedAt
          ? formatUpdatedLabel(overview.dispatchRules.updatedAt)
          : "Rules configured"
        : "Create a rule to auto-assign jobs",
    },
    team: {
      configured: overview.teamRules.configured,
      statusLabel: overview.teamRules.configured
        ? `${overview.teamRules.maxJobsPerDay ?? overview.teamRules.maxJobsPerWeek ?? 0} jobs/day`
        : "No guardrails",
      helperText: overview.teamRules.configured
        ? overview.teamRules.allowOvertime
          ? "Overtime allowed"
          : "Overtime blocked"
        : "Set crew workload & breaks",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">Schedule Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure scheduling, dispatch, availability, and guardrails with live
          telemetry from Supabase.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Schedule readiness</CardTitle>
            <CardDescription>
              Snapshot of automation, coverage, and crew guardrails
            </CardDescription>
          </div>
          <Badge variant="outline">
            {formatDistanceToNow(new Date(overview.generatedAt), {
              addSuffix: true,
            })}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-medium text-muted-foreground text-sm">
              Completion
            </p>
            <p className="font-semibold text-4xl">{readinessPercent}%</p>
          </div>
          <div className="flex-1 space-y-2">
            <Progress value={readinessPercent} />
            <p className="text-muted-foreground text-xs">
              {overview.stepsCompleted} of {overview.totalSteps} readiness steps
              complete
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key metrics</CardTitle>
          <CardDescription>
            Real-time counts pulled directly from schedule tables
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              className="rounded-xl border border-border/60 p-4"
              key={metric.label}
            >
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                {metric.label}
              </p>
              <p className="mt-1 font-semibold text-2xl">{metric.value}</p>
              <p className="text-muted-foreground text-sm">{metric.helper}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scheduleSections.map((section) => {
          const Icon = section.icon;
          const meta = sectionStatusMap[section.key];

          return (
            <Link href={section.href} key={section.title}>
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex size-12 items-center justify-center rounded-lg ${section.bgColor}`}
                    >
                      <Icon className={`size-6 ${section.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold group-hover:text-primary">
                        {section.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm">
                        {meta.statusLabel}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {meta.helperText}
                      </p>
                    </div>
                    <Badge
                      className={
                        meta.configured
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100"
                          : "border-amber-200 text-amber-600 dark:border-amber-400 dark:text-amber-200"
                      }
                      variant={meta.configured ? "secondary" : "outline"}
                    >
                      {meta.configured ? "Ready" : "Needs action"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Settings className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Telemetry-aware scheduling</p>
              <p className="text-muted-foreground text-sm">
                These controls pull live defaults, coverage zones, guardrails,
                and dispatch logic from Supabase. Adjusting any setting
                revalidates this dashboard, so you always see the current state
                of your schedule automation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
