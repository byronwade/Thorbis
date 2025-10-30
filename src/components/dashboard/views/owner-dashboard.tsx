import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Users,
} from "lucide-react";
import { Suspense } from "react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/skeletons";

/**
 * Owner Dashboard - Server Component
 *
 * Focus: Business financials, profitability, growth metrics, and strategic overview
 * Target User: Business owner who needs high-level financial health and growth insights
 */

export default function OwnerDashboard() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-4xl tracking-tight">
            Business Overview
          </h1>
          <Badge className="text-purple-600" variant="outline">
            Owner View
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">{currentDate}</p>
      </div>

      {/* Critical Financial Alerts */}
      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="size-5" />
            Financial Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-white p-3 dark:border-red-800 dark:bg-red-950/50">
            <AlertTriangle className="mt-0.5 size-4 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-sm">Payroll Due in 3 Days</p>
              <p className="text-muted-foreground text-xs">
                $18,500 needed - Current balance: $45,230
              </p>
            </div>
            <Badge className="text-green-600" variant="outline">
              COVERED
            </Badge>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-white p-3 dark:border-yellow-800 dark:bg-yellow-950/50">
            <AlertTriangle className="mt-0.5 size-4 text-yellow-500" />
            <div className="flex-1">
              <p className="font-medium text-sm">Outstanding Invoices Aging</p>
              <p className="text-muted-foreground text-xs">
                $23,400 over 30 days - Collection needed
              </p>
            </div>
            <Badge className="text-yellow-600" variant="outline">
              ACTION NEEDED
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top Financial KPIs - 4 columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          change="+18.2% vs last month"
          changeType="positive"
          description="Cash in bank today"
          icon={DollarSign}
          title="Available Cash"
          tooltip="Actual cash available in your business bank account right now. This is what you can spend today."
          value="$45,230"
        />
        <KPICard
          change="+$8,400 this week"
          changeType="positive"
          icon={TrendingUp}
          title="Monthly Revenue"
          tooltip="Total revenue for the current month including completed jobs and outstanding invoices"
          value="$124,350"
        />
        <KPICard
          change="35% (Target: 30%)"
          changeType="positive"
          icon={BarChart3}
          title="Net Profit Margin"
          tooltip="Percentage of revenue that becomes profit after all expenses. Industry average is 25-30%."
          value="35%"
        />
        <KPICard
          change="+12 new this month"
          changeType="positive"
          icon={Users}
          title="Total Customers"
          tooltip="Total number of active customers in your database"
          value="2,847"
        />
      </div>

      {/* Profitability Breakdown */}
      <div className="space-y-3">
        <SectionHeader
          description="Where your money is going today"
          title="Today's Profitability"
          tooltip="Real-time breakdown of revenue vs expenses to understand profit margins"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Revenue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Revenue Today</p>
                    <p className="text-muted-foreground text-xs">
                      From 24 completed jobs
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$11,240</p>
                  <p className="text-green-600 text-xs">100%</p>
                </div>
              </div>

              {/* Labor Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Labor Cost</p>
                    <p className="text-muted-foreground text-xs">
                      Technician wages + overtime
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$2,400</p>
                  <p className="text-blue-600 text-xs">21.4%</p>
                </div>
              </div>

              {/* Materials */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <CreditCard className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Materials & Parts</p>
                    <p className="text-muted-foreground text-xs">
                      Cost of goods sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$3,100</p>
                  <p className="text-orange-600 text-xs">27.6%</p>
                </div>
              </div>

              {/* Overhead */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Calendar className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Overhead</p>
                    <p className="text-muted-foreground text-xs">
                      Rent, insurance, utilities
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$1,800</p>
                  <p className="text-purple-600 text-xs">16.0%</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* Net Profit */}
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-500">
                    <PiggyBank className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Net Profit Today</p>
                    <p className="text-muted-foreground text-xs">
                      After all expenses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-green-600">$3,940</p>
                  <p className="font-medium text-green-600 text-xs">
                    35.1% margin ✅
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart + Cash Flow Forecast */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-xl">Revenue Trend</h2>
            <p className="text-muted-foreground text-sm">
              Last 30 days performance
            </p>
          </div>
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-xl">Cash Flow Forecast</h2>
            <p className="text-muted-foreground text-sm">
              Next 30 days projection
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Expected Revenue
                  </span>
                  <span className="font-bold text-green-600">+$145,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Payroll (2x)
                  </span>
                  <span className="font-bold text-red-600">-$37,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Fixed Expenses
                  </span>
                  <span className="font-bold text-red-600">-$25,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Materials & Parts
                  </span>
                  <span className="font-bold text-red-600">-$42,000</span>
                </div>
                <div className="border-t" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    Projected Balance (30 days)
                  </span>
                  <span className="font-bold text-green-600 text-xl">
                    $86,230
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Business Growth Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-3xl">47</span>
                <span className="text-muted-foreground text-sm">
                  new customers
                </span>
              </div>
              <p className="text-muted-foreground text-xs">This month</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="text-green-600" variant="outline">
                  +24% vs last month
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-3xl">94%</span>
                <span className="text-muted-foreground text-sm">
                  retention rate
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Last 12 months</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="text-green-600" variant="outline">
                  Above industry avg (85%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Per Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-3xl">$2,847</span>
                <span className="text-muted-foreground text-sm">
                  lifetime value
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Average LTV</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="text-green-600" variant="outline">
                  +18% year over year
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
