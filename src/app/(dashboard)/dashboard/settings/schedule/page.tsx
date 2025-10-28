/**
 * Settings > Schedule Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Calendar, Clock, MapPin, Settings, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every 1 hour
const scheduleSections = [
  {
    title: "Calendar Settings",
    description: "Configure calendar view, business hours, and time zones",
    icon: Calendar,
    href: "/dashboard/settings/schedule/calendar",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Availability",
    description: "Set technician availability and working hours",
    icon: Clock,
    href: "/dashboard/settings/schedule/availability",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Service Areas",
    description: "Define service territories and travel time",
    icon: MapPin,
    href: "/dashboard/settings/schedule/service-areas",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Dispatch Rules",
    description: "Automatic job assignment and routing",
    icon: Zap,
    href: "/dashboard/settings/schedule/dispatch",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Team Scheduling",
    description: "Manage crew assignments and capacity",
    icon: Users,
    href: "/dashboard/settings/schedule/team",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export default function ScheduleSettingsPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Schedule Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure scheduling, dispatch, and availability settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scheduleSections.map((section) => {
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
              <p className="font-medium text-sm">Schedule Settings Overview</p>
              <p className="text-muted-foreground text-sm">
                These settings control how appointments are scheduled, assigned,
                and displayed. Configure your calendar view preferences, set
                technician availability, define service areas, and establish
                automatic dispatch rules to optimize your scheduling workflow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
