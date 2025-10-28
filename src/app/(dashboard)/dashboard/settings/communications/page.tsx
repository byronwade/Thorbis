/**
 * Settings > Communications Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Bell,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every 1 hour
const communicationsSections = [
  {
    title: "Email",
    description: "Configure email addresses, signatures, and tracking",
    icon: Mail,
    href: "/dashboard/settings/communications/email",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "SMS & Text",
    description: "Set up text messaging and auto-responses",
    icon: MessageSquare,
    href: "/dashboard/settings/communications/sms",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Phone & Voice",
    description: "Manage phone system and voicemail settings",
    icon: Phone,
    href: "/dashboard/settings/communications/phone",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Notifications",
    description: "Control customer and team notification preferences",
    icon: Bell,
    href: "/dashboard/settings/communications/notifications",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Templates",
    description: "Create and manage message templates",
    icon: FileText,
    href: "/dashboard/settings/communications/templates",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export default function CommunicationsSettingsPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Communications Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configure how you communicate with customers and your team
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {communicationsSections.map((section) => {
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
