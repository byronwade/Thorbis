/**
 * Finance > Payroll > Settings Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  Bell,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 900; // Revalidate every 15 minutes

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const settingsSections = [
  {
    title: "Company Settings",
    description: "Business information and tax settings",
    icon: Building2,
    items: [
      {
        name: "Company Profile",
        description: "Business name, EIN, and contact details",
        icon: Building2,
        href: "#",
      },
      {
        name: "Tax Settings",
        description: "Federal, state, and local tax configuration",
        icon: FileText,
        href: "#",
      },
      {
        name: "Banking Information",
        description: "ACH transfer and direct deposit setup",
        icon: CreditCard,
        href: "#",
      },
    ],
  },
  {
    title: "Pay Schedule",
    description: "Configure pay periods and schedules",
    icon: Calendar,
    items: [
      {
        name: "Pay Frequency",
        description: "Weekly, bi-weekly, semi-monthly, or monthly",
        icon: Calendar,
        href: "#",
      },
      {
        name: "Pay Periods",
        description: "Define start and end dates for pay periods",
        icon: Clock,
        href: "#",
      },
      {
        name: "Holidays & PTO",
        description: "Paid time off and holiday calendar",
        icon: Calendar,
        href: "#",
      },
    ],
  },
  {
    title: "Employee Defaults",
    description: "Default settings for new employees",
    icon: Users,
    items: [
      {
        name: "Compensation",
        description: "Default pay rates and salary ranges",
        icon: CreditCard,
        href: "#",
      },
      {
        name: "Benefits",
        description: "Health insurance, 401k, and other benefits",
        icon: Shield,
        href: "#",
      },
      {
        name: "Deductions",
        description: "Standard deductions and withholdings",
        icon: FileText,
        href: "#",
      },
    ],
  },
  {
    title: "Time Tracking",
    description: "Configure time entry and approval",
    icon: Clock,
    items: [
      {
        name: "Timesheet Settings",
        description: "Approval workflows and submission deadlines",
        icon: Clock,
        href: "#",
      },
      {
        name: "Overtime Rules",
        description: "Calculate and approve overtime hours",
        icon: Clock,
        href: "#",
      },
      {
        name: "Break Policies",
        description: "Lunch breaks and rest period rules",
        icon: Clock,
        href: "#",
      },
    ],
  },
  {
    title: "Notifications",
    description: "Email and alert preferences",
    icon: Bell,
    items: [
      {
        name: "Payroll Alerts",
        description: "Get notified about upcoming pay runs",
        icon: Bell,
        href: "#",
      },
      {
        name: "Approval Notifications",
        description: "Alerts for pending timesheet approvals",
        icon: Bell,
        href: "#",
      },
      {
        name: "Compliance Reminders",
        description: "Tax filing and reporting deadlines",
        icon: Bell,
        href: "#",
      },
    ],
  },
  {
    title: "Compliance & Security",
    description: "Legal requirements and data protection",
    icon: Shield,
    items: [
      {
        name: "Access Control",
        description: "Manage who can view and edit payroll",
        icon: Shield,
        href: "#",
      },
      {
        name: "Audit Logs",
        description: "Track all payroll changes and actions",
        icon: FileText,
        href: "#",
      },
      {
        name: "Data Retention",
        description: "Configure record keeping policies",
        icon: FileText,
        href: "#",
      },
    ],
  },
];

export default function PayrollSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl">Payroll Settings</h1>
        <p className="text-muted-foreground">
          Configure payroll preferences and company settings
        </p>
      </div>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Overview of your payroll settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Pay Frequency</p>
              <p className="font-semibold">Semi-Monthly</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                Overtime Threshold
              </p>
              <p className="font-semibold">40 hours/week</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Active Employees</p>
              <p className="font-semibold">4</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Direct Deposit</p>
              <p className="font-semibold">Enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div className="space-y-4" key={section.title}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <SectionIcon className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{section.title}</h2>
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link href={item.href} key={item.name}>
                      <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                              <ItemIcon className="size-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-base">
                                {item.name}
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs">
                                {item.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base text-blue-700 dark:text-blue-400">
              Need Help Configuring Payroll?
            </CardTitle>
          </div>
          <CardDescription>
            Our payroll specialists can help you set up your payroll system
            correctly and ensure compliance with all regulations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/help/payroll-setup">
              <span className="text-blue-600 text-sm underline hover:text-blue-700">
                View Setup Guide
              </span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact">
              <span className="text-blue-600 text-sm underline hover:text-blue-700">
                Contact Support
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
