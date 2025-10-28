/**
 * Settings > Reporting Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  BarChart3,
  Calendar,
  FileText,
  Mail,
  Settings,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every 1 hour
const reportingSections = [
  {
    title: "Report Templates",
    description: "Create and manage custom report templates",
    icon: FileText,
    href: "/dashboard/settings/reporting/templates",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Scheduled Reports",
    description: "Automate report generation and delivery",
    icon: Calendar,
    href: "/dashboard/settings/reporting/scheduled",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Report Distribution",
    description: "Configure who receives reports and how",
    icon: Mail,
    href: "/dashboard/settings/reporting/distribution",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Metrics & KPIs",
    description: "Define key performance indicators to track",
    icon: TrendingUp,
    href: "/dashboard/settings/reporting/metrics",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Dashboard Layouts",
    description: "Customize dashboard widgets and layouts",
    icon: BarChart3,
    href: "/dashboard/settings/reporting/dashboards",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export default function ReportingSettingsPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Reporting Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configure reports, metrics, and analytics preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportingSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link href={section.href} key={section.title}>
              <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="p-6">
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
              <p className="font-medium text-sm">Reporting Settings Overview</p>
              <p className="text-muted-foreground text-sm">
                Configure how reports are generated, scheduled, and delivered
                across your organization. Create custom report templates, define
                key performance indicators, set up automated report delivery,
                and customize dashboard layouts to track the metrics that matter
                most to your business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
