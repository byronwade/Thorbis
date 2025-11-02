/**
 * Settings > Automation Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Bot, Filter, GitBranch, Settings, Workflow, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every 1 hour
const automationSections = [
  {
    title: "Workflow Automation",
    description: "Create automated workflows for common tasks",
    icon: Workflow,
    href: "/dashboard/settings/automation/workflows",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    badge: "Beta",
  },
  {
    title: "Triggers & Actions",
    description: "Set up event-based automation rules",
    icon: Zap,
    href: "/dashboard/settings/automation/triggers",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    badge: "Beta",
  },
  {
    title: "AI Automation",
    description: "Smart automation powered by AI",
    icon: Bot,
    href: "/dashboard/settings/automation/ai",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    badge: "Beta",
  },
  {
    title: "Conditional Logic",
    description: "Build complex automation with conditions",
    icon: GitBranch,
    href: "/dashboard/settings/automation/logic",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    badge: "Beta",
  },
  {
    title: "Data Filters",
    description: "Filter and route data automatically",
    icon: Filter,
    href: "/dashboard/settings/automation/filters",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    badge: "Beta",
  },
];

export default function AutomationSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-4xl tracking-tight">
            Automation Settings
          </h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <p className="mt-2 text-muted-foreground">
          Configure automated workflows and business rules
        </p>
      </div>

      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <div className="space-y-1">
            <p className="font-medium text-blue-700 text-sm dark:text-blue-400">
              Automation Beta Program
            </p>
            <p className="text-muted-foreground text-sm">
              Automation features are currently in beta. We're actively
              developing new automation capabilities and would love your
              feedback. Some features may change as we improve the system based
              on user input.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automationSections.map((section) => {
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold group-hover:text-primary">
                          {section.title}
                        </h3>
                        {section.badge && (
                          <Badge className="text-xs" variant="secondary">
                            {section.badge}
                          </Badge>
                        )}
                      </div>
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
              <p className="font-medium text-sm">
                Automation Settings Overview
              </p>
              <p className="text-muted-foreground text-sm">
                Automate repetitive tasks and create intelligent workflows that
                save time and reduce errors. Set up triggers that respond to
                events, create multi-step workflows, use AI to make smart
                decisions, and build complex automation with conditional logic.
                Automation can handle customer follow-ups, job assignments,
                notifications, and much more.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg">Popular Automation Examples</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border p-4">
              <h4 className="mb-1 font-medium text-sm">Auto-assign new jobs</h4>
              <p className="text-muted-foreground text-xs">
                Automatically assign jobs to available technicians based on
                location, skills, and availability
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-1 font-medium text-sm">Follow-up reminders</h4>
              <p className="text-muted-foreground text-xs">
                Send automatic follow-up messages to customers 3 days after job
                completion
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-1 font-medium text-sm">
                Escalate overdue invoices
              </h4>
              <p className="text-muted-foreground text-xs">
                Automatically escalate invoices that are 30+ days overdue to the
                collections team
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-1 font-medium text-sm">Update job status</h4>
              <p className="text-muted-foreground text-xs">
                Change job status to "Complete" when technician marks all tasks
                as done and customer signature is received
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
