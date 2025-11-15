import {
  Bell,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSettingsOverviewData } from "@/lib/settings/overview-data";
import { cn } from "@/lib/utils";

type CommunicationsSectionKey =
  | "email"
  | "sms"
  | "phone"
  | "notifications"
  | "templates";

const METRIC_CARD_COUNT = 3;

export const revalidate = 3600;

const communicationsSections: Array<{
  key: CommunicationsSectionKey;
  title: string;
  description: string;
  icon: typeof Mail;
  href: string;
  color: string;
  bgColor: string;
}> = [
  {
    key: "email",
    title: "Email",
    description: "Configure SMTP, sender identity, and tracking",
    icon: Mail,
    href: "/dashboard/settings/communications/email",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "sms",
    title: "SMS & Text",
    description: "Provision numbers, campaigns, and auto-responses",
    icon: MessageSquare,
    href: "/dashboard/settings/communications/sms",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    key: "phone",
    title: "Phone & Voice",
    description: "Manage routing strategy, voicemail, and IVR",
    icon: Phone,
    href: "/dashboard/settings/communications/phone",
    color: "text-accent-foreground",
    bgColor: "bg-accent/10",
  },
  {
    key: "notifications",
    title: "Notifications",
    description: "Control customer and internal notification defaults",
    icon: Bell,
    href: "/dashboard/settings/communications/notifications",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    key: "templates",
    title: "Templates",
    description: "Centralize email and SMS templates for automation",
    icon: FileText,
    href: "/dashboard/settings/communications/templates",
    color: "text-accent-foreground",
    bgColor: "bg-accent/10",
  },
];

export default async function CommunicationsSettingsPage() {
  const overview = await getSettingsOverviewData();
  const communicationsSection = overview.sections.find(
    (section) => section.slug === "communications"
  );

  if (!communicationsSection) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">
            Communications Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure how you communicate with customers and your team
          </p>
        </div>
        <p className="text-muted-foreground">
          Communication metrics are unavailable right now. Please try again
          later.
        </p>
      </div>
    );
  }

  const readinessPercent = communicationsSection.progress;
  const metrics = communicationsSection.metrics.slice(0, METRIC_CARD_COUNT);
  const checklistMap = Object.fromEntries(
    communicationsSection.checklist.map((item) => [item.key, item])
  );
  const metricMap = Object.fromEntries(
    communicationsSection.metrics.map((metric) => [metric.key, metric])
  );

  const sectionStatusMap: Record<
    CommunicationsSectionKey,
    { configured: boolean; statusLabel: string; helperText: string }
  > = {
    email: {
      configured: checklistMap.smtp?.completed ?? false,
      statusLabel: checklistMap.smtp?.completed
        ? "SMTP connected"
        : "Not configured",
      helperText: checklistMap.smtp?.completed
        ? "Outbound email is branded"
        : "Connect branded SMTP or sender identity",
    },
    sms: {
      configured: checklistMap.sms?.completed ?? false,
      statusLabel: checklistMap.sms?.completed
        ? "Messaging ready"
        : "Missing number",
      helperText: checklistMap.sms?.completed
        ? "10DLC registration in progress"
        : "Provision an SMS number to enable texting",
    },
    phone: {
      configured: Number(metricMap["phone-numbers"]?.value ?? "0") > 0,
      statusLabel: `${metricMap["phone-numbers"]?.value ?? "0"} numbers`,
      helperText: metricMap["phone-numbers"]?.helper ?? "No active numbers",
    },
    notifications: {
      configured:
        (metricMap["notification-backlog"]?.status ?? "warning") === "ready",
      statusLabel: `${metricMap["notification-backlog"]?.value ?? "0"} pending`,
      helperText: `${metricMap["notification-backlog"]?.helper ?? "Queue size"}`,
    },
    templates: {
      configured: true,
      statusLabel: "Managed via Templates",
      helperText: "Keep branding consistent across channels",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">
          Communications Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configure how you communicate with customers and your team
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Channel readiness</CardTitle>
            <CardDescription>
              Compliance, numbers, and queue health pulled from Supabase
            </CardDescription>
          </div>
          <Badge variant="outline">{communicationsSection.summary}</Badge>
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
              {
                communicationsSection.checklist.filter((item) => item.completed)
                  .length
              }{" "}
              of {communicationsSection.checklist.length} readiness steps
              complete
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key metrics</CardTitle>
          <CardDescription>
            Live telemetry from messaging brands, campaigns, and queues
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              className="rounded-xl border border-border/60 p-4"
              key={metric.key}
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
        {communicationsSections.map((section) => {
          const Icon = section.icon;
          const meta = sectionStatusMap[section.key];
          return (
            <Link href={section.href} key={section.title}>
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-lg",
                        section.bgColor
                      )}
                    >
                      <Icon className={cn("size-6", section.color)} />
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
                      className={cn(
                        meta.configured
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100"
                          : "border-amber-200 text-amber-600 dark:border-amber-400 dark:text-amber-200"
                      )}
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
              <p className="font-medium text-sm">
                Communication Settings Overview
              </p>
              <p className="text-muted-foreground text-sm">
                These settings control how your business communicates with
                customers and team members. Configure email addresses,
                signatures, SMS auto-responses, phone greetings, and automated
                notifications. Changes here affect how all outbound
                communications are sent and displayed to recipients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
