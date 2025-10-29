/**
 * Reporting Overview Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 */

export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporting & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business intelligence and data analytics dashboard
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Reports</h3>
          </div>
          <p className="text-3xl font-bold mt-2">142</p>
          <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Scheduled Reports</h3>
          </div>
          <p className="text-3xl font-bold mt-2">28</p>
          <p className="text-xs text-muted-foreground mt-1">Active schedules</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Data Sources</h3>
          </div>
          <p className="text-3xl font-bold mt-2">15</p>
          <p className="text-xs text-muted-foreground mt-1">Connected systems</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
          </div>
          <p className="text-3xl font-bold mt-2">5m</p>
          <p className="text-xs text-muted-foreground mt-1">Real-time data</p>
        </div>
      </div>

      {/* Quick Access Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">AI & Intelligence</h3>
          <p className="text-sm text-muted-foreground mb-4">
            AI performance metrics, conversation analytics, and sentiment analysis
          </p>
          <p className="text-xs font-medium text-blue-500">7 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Communication Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Phone calls, SMS, emails, and support ticket analytics
          </p>
          <p className="text-xs font-medium text-blue-500">10 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Financial Reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            P&L, revenue, expenses, cash flow, and profitability analysis
          </p>
          <p className="text-xs font-medium text-blue-500">12 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Operations & Jobs</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Job performance, schedule efficiency, and dispatch analytics
          </p>
          <p className="text-xs font-medium text-blue-500">10 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Team Performance</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Technician leaderboards, productivity, revenue, and ratings
          </p>
          <p className="text-xs font-medium text-blue-500">12 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Customer Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Acquisition, retention, churn, and customer lifetime value
          </p>
          <p className="text-xs font-medium text-blue-500">9 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Marketing & Growth</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Campaigns, leads, conversions, and ROI analysis
          </p>
          <p className="text-xs font-medium text-blue-500">9 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Predictive insights, trends, forecasting, and benchmarks
          </p>
          <p className="text-xs font-medium text-blue-500">6 reports available</p>
        </div>

        <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Export & Sharing</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Scheduled reports, templates, and data export options
          </p>
          <p className="text-xs font-medium text-blue-500">5 tools available</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">Monthly Revenue Analysis</p>
                <p className="text-sm text-muted-foreground">Generated 2 hours ago</p>
              </div>
              <button className="text-sm text-blue-500 hover:underline">View</button>
            </div>
            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">Technician Performance Q1</p>
                <p className="text-sm text-muted-foreground">Generated 5 hours ago</p>
              </div>
              <button className="text-sm text-blue-500 hover:underline">View</button>
            </div>
            <div className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">Customer Satisfaction Survey</p>
                <p className="text-sm text-muted-foreground">Generated yesterday</p>
              </div>
              <button className="text-sm text-blue-500 hover:underline">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
