"use client";

export const dynamic = "force-dynamic";

import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePageLayout } from "@/hooks/use-page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PayrollOverviewPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl">Payroll Overview</h1>
        <p className="text-muted-foreground">
          Manage employee payroll, time tracking, and compensation
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">24</div>
            <p className="text-muted-foreground text-xs">
              4 pending timesheets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">This Period</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">$42,350</div>
            <p className="text-muted-foreground text-xs">
              +12% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">1,847</div>
            <p className="text-muted-foreground text-xs">This pay period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Next Pay Run</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">3 days</div>
            <p className="text-muted-foreground text-xs">Friday, Nov 1st</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/finance/payroll/employees">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Employee Management
                  </CardTitle>
                  <CardDescription className="text-xs">
                    View and manage employee profiles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/finance/payroll/time-tracking">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Time Tracking</CardTitle>
                  <CardDescription className="text-xs">
                    Review and approve timesheets
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/finance/payroll/pay-runs">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Pay Runs</CardTitle>
                  <CardDescription className="text-xs">
                    Process payroll and payments
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/finance/payroll/reports">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Reports</CardTitle>
                  <CardDescription className="text-xs">
                    View payroll analytics and reports
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/finance/payroll/settings">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Settings</CardTitle>
                  <CardDescription className="text-xs">
                    Configure payroll preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Alert */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base text-yellow-700 dark:text-yellow-400">
              Action Required
            </CardTitle>
          </div>
          <CardDescription>
            4 timesheets need approval before the next pay run on Friday, Nov
            1st
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
