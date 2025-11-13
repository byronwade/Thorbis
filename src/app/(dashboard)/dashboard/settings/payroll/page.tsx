/**
 * Settings > Payroll Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  AlertCircle,
  BadgeDollarSign,
  Calendar,
  Clock,
  Layers,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every 1 hour

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const payrollSections = [
  {
    title: "Commission",
    subtitle: "Configure commission structures and payout timing",
    icon: BadgeDollarSign,
    href: "/dashboard/settings/payroll/commission",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Materials",
    subtitle: "Manage material cost deductions and handling",
    icon: Layers,
    href: "/dashboard/settings/payroll/materials",
    color: "text-accent-foreground",
    bgColor: "bg-accent/10",
  },
  {
    title: "Callbacks",
    subtitle: "Set callback deductions and warranty work rates",
    icon: AlertCircle,
    href: "/dashboard/settings/payroll/callbacks",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Bonuses",
    subtitle: "Configure performance bonuses and incentives",
    icon: TrendingUp,
    href: "/dashboard/settings/payroll/bonuses",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Overtime",
    subtitle: "Set overtime rules and premium pay rates",
    icon: Clock,
    href: "/dashboard/settings/payroll/overtime",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Deductions",
    subtitle: "Manage equipment deductions and reimbursements",
    icon: Wallet,
    href: "/dashboard/settings/payroll/deductions",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Schedule",
    subtitle: "Configure payroll timing and approval workflow",
    icon: Calendar,
    href: "/dashboard/settings/payroll/schedule",
    color: "text-accent-foreground",
    bgColor: "bg-accent/10",
  },
];

export default function PayrollSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-4xl tracking-tight">Payroll Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure commission structures, deductions, bonuses, and payroll
          policies
        </p>
      </div>

      {/* Warning Banner */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="space-y-1">
            <p className="font-medium text-sm text-warning dark:text-warning">
              Important: Payroll Policy Configuration
            </p>
            <p className="text-muted-foreground text-sm">
              These settings define company-wide payroll policies. Changes
              affect how all technicians are compensated. Individual employee
              rates and overrides are managed in their profile pages.
            </p>
          </div>
        </CardContent>
      </Card>

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
              <p className="text-muted-foreground text-sm">Commission Type</p>
              <p className="font-semibold">Tiered Structure</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Direct Deposit</p>
              <p className="font-semibold">Enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {payrollSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link href={section.href} key={section.title}>
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${section.bgColor}`}
                    >
                      <Icon className={`size-5 ${section.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {section.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-base text-primary dark:text-primary">
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
              <span className="text-primary text-sm underline hover:text-primary">
                View Setup Guide
              </span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact">
              <span className="text-primary text-sm underline hover:text-primary">
                Contact Support
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
