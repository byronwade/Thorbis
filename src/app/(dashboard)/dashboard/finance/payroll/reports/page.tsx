/**
 * Finance > Payroll > Reports Page - Client Component
 *
 * Client-side features:
 * - Interactive state management and event handlers
 * - Form validation and user input handling
 * - Browser API access for enhanced UX
 */

import {
  BarChart3,
  Download,
  FileText,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const reportCategories = [
  {
    title: "Payroll Summary Reports",
    description: "Overview and summary analytics",
    reports: [
      {
        name: "Payroll Summary by Period",
        description: "Comprehensive overview of each pay period",
        icon: FileText,
      },
      {
        name: "Year-to-Date Summary",
        description: "Annual payroll totals and trends",
        icon: TrendingUp,
      },
      {
        name: "Department Breakdown",
        description: "Payroll costs by department or role",
        icon: PieChart,
      },
    ],
  },
  {
    title: "Employee Reports",
    description: "Individual employee analytics",
    reports: [
      {
        name: "Employee Earnings Statement",
        description: "Detailed earnings for each employee",
        icon: FileText,
      },
      {
        name: "Hours Worked Report",
        description: "Regular and overtime hours by employee",
        icon: BarChart3,
      },
      {
        name: "Pay Rate History",
        description: "Track compensation changes over time",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Tax & Compliance",
    description: "Tax reporting and compliance documents",
    reports: [
      {
        name: "Tax Withholding Summary",
        description: "Federal, state, and local tax withholdings",
        icon: FileText,
      },
      {
        name: "Quarterly Tax Report",
        description: "941 preparation and filing support",
        icon: FileText,
      },
      {
        name: "Year-End Tax Documents",
        description: "W-2 and 1099 preparation",
        icon: FileText,
      },
    ],
  },
  {
    title: "Time & Attendance",
    description: "Hours and attendance tracking",
    reports: [
      {
        name: "Timesheet Report",
        description: "Approved timesheets by period",
        icon: FileText,
      },
      {
        name: "Overtime Analysis",
        description: "Overtime trends and costs",
        icon: BarChart3,
      },
      {
        name: "Attendance Summary",
        description: "Employee attendance patterns",
        icon: BarChart3,
      },
    ],
  },
];

export default function PayrollReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl">Payroll Reports</h1>
        <p className="text-muted-foreground">
          Generate and download payroll analytics and reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">15</div>
            <p className="text-muted-foreground text-xs">
              Available report types
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">This Month</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">23</div>
            <p className="text-muted-foreground text-xs">Reports generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-lg">Payroll Summary</div>
            <p className="text-muted-foreground text-xs">12 times this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Scheduled</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">3</div>
            <p className="text-muted-foreground text-xs">Automated reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category) => (
          <div className="space-y-4" key={category.title}>
            <div>
              <h2 className="font-semibold text-lg">{category.title}</h2>
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.reports.map((report) => {
                const ReportIcon = report.icon;
                return (
                  <Card
                    className="transition-all hover:border-primary/50 hover:shadow-md"
                    key={report.name}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <ReportIcon className="size-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base">
                              {report.name}
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              {report.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" size="sm" variant="outline">
                        <Download className="mr-2 size-4" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automatically generated reports sent to your email
              </CardDescription>
            </div>
            <Button size="sm" variant="outline">
              Manage Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Bi-Weekly Payroll Summary</p>
                  <p className="text-muted-foreground text-sm">
                    Every 2nd Friday at 9:00 AM
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Monthly Tax Summary</p>
                  <p className="text-muted-foreground text-sm">
                    1st of every month at 8:00 AM
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Quarterly Compliance Report</p>
                  <p className="text-muted-foreground text-sm">
                    First day of quarter at 9:00 AM
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
