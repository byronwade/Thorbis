/**
 * Reporting Overview Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 *
 * Shows Coming Soon component in production, normal page in development
 */

import { ReportingComingSoon } from "@/components/reporting/reporting-coming-soon";

export default function ReportingPage() {
  // Show Coming Soon in production, normal page in development
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  if (isProduction) {
    return <ReportingComingSoon />;
  }

  // Development - show normal page
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Reporting & Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Comprehensive business intelligence and data analytics dashboard
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground text-sm">
              Total Reports
            </h3>
          </div>
          <p className="mt-2 font-bold text-3xl">142</p>
          <p className="mt-1 text-muted-foreground text-xs">+12 this month</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground text-sm">
              Scheduled Reports
            </h3>
          </div>
          <p className="mt-2 font-bold text-3xl">28</p>
          <p className="mt-1 text-muted-foreground text-xs">Active schedules</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground text-sm">
              Data Sources
            </h3>
          </div>
          <p className="mt-2 font-bold text-3xl">15</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Connected systems
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground text-sm">
              Last Updated
            </h3>
          </div>
          <p className="mt-2 font-bold text-3xl">5m</p>
          <p className="mt-1 text-muted-foreground text-xs">Real-time data</p>
        </div>
      </div>

      {/* Quick Access Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">AI & Intelligence</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            AI performance metrics, conversation analytics, and sentiment
            analysis
          </p>
          <p className="font-medium text-blue-500 text-xs">
            7 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">
            Communication Analytics
          </h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Phone calls, SMS, emails, and support ticket analytics
          </p>
          <p className="font-medium text-blue-500 text-xs">
            10 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Financial Reports</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            P&L, revenue, expenses, cash flow, and profitability analysis
          </p>
          <p className="font-medium text-blue-500 text-xs">
            12 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Operations & Jobs</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Job performance, schedule efficiency, and dispatch analytics
          </p>
          <p className="font-medium text-blue-500 text-xs">
            10 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Team Performance</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Technician leaderboards, productivity, revenue, and ratings
          </p>
          <p className="font-medium text-blue-500 text-xs">
            12 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Customer Analytics</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Acquisition, retention, churn, and customer lifetime value
          </p>
          <p className="font-medium text-blue-500 text-xs">
            9 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Marketing & Growth</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Campaigns, leads, conversions, and ROI analysis
          </p>
          <p className="font-medium text-blue-500 text-xs">
            9 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Advanced Analytics</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Predictive insights, trends, forecasting, and benchmarks
          </p>
          <p className="font-medium text-blue-500 text-xs">
            6 reports available
          </p>
        </div>

        <div className="cursor-pointer rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
          <h3 className="mb-2 font-semibold text-lg">Export & Sharing</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Scheduled reports, templates, and data export options
          </p>
          <p className="font-medium text-blue-500 text-xs">5 tools available</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="font-semibold text-lg">Recent Reports</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b py-3 last:border-0">
              <div>
                <p className="font-medium">Monthly Revenue Analysis</p>
                <p className="text-muted-foreground text-sm">
                  Generated 2 hours ago
                </p>
              </div>
              <button className="text-blue-500 text-sm hover:underline">
                View
              </button>
            </div>
            <div className="flex items-center justify-between border-b py-3 last:border-0">
              <div>
                <p className="font-medium">Technician Performance Q1</p>
                <p className="text-muted-foreground text-sm">
                  Generated 5 hours ago
                </p>
              </div>
              <button className="text-blue-500 text-sm hover:underline">
                View
              </button>
            </div>
            <div className="flex items-center justify-between border-b py-3 last:border-0">
              <div>
                <p className="font-medium">Customer Satisfaction Survey</p>
                <p className="text-muted-foreground text-sm">
                  Generated yesterday
                </p>
              </div>
              <button className="text-blue-500 text-sm hover:underline">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
