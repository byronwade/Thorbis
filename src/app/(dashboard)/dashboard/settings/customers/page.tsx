/**
 * Settings > Customers Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import { Bell, Settings, Shield, Star, Tag, UserCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 3600; // Revalidate every 1 hour
const customerSections = [
  {
    title: "Customer Preferences",
    description: "Default settings for customer profiles and fields",
    icon: UserCircle,
    href: "/dashboard/settings/customers/preferences",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Loyalty & Rewards",
    description: "Customer loyalty programs and point systems",
    icon: Star,
    href: "/dashboard/settings/customers/loyalty",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Customer Notifications",
    description: "How customers receive updates and alerts",
    icon: Bell,
    href: "/dashboard/settings/customers/notifications",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Privacy & Consent",
    description: "GDPR, data retention, and consent management",
    icon: Shield,
    href: "/dashboard/settings/customers/privacy",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Custom Fields",
    description: "Add custom fields to customer profiles",
    icon: Tag,
    href: "/dashboard/settings/customers/custom-fields",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export default function CustomersSettingsPage() {  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Customer Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure customer management preferences and features
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customerSections.map((section) => {
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
              <p className="font-medium text-sm">Customer Settings Overview</p>
              <p className="text-muted-foreground text-sm">
                These settings control how customer data is managed, stored, and
                used throughout the system. Configure default preferences, set
                up loyalty programs, manage notifications, ensure privacy
                compliance, and customize customer profile fields to match your
                business needs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
