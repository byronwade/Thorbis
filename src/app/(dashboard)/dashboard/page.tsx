import { Suspense } from "react";
import { Calendar, DollarSign, Phone, TrendingUp } from "lucide-react";
import { RecentCompanyPosts } from "@/components/communication/recent-company-posts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { CallActivityChart } from "@/components/dashboard/call-activity-chart";
import { JobStatusPipeline } from "@/components/dashboard/job-status-pipeline";
import { KPICard } from "@/components/dashboard/kpi-card";
import { OperationalAlerts } from "@/components/dashboard/operational-alerts";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline";
import { SectionHeader } from "@/components/dashboard/section-header";
import { TechnicianPerformance } from "@/components/dashboard/technician-performance";

export const revalidate = 300; // Revalidate every 5 minutes
import {
  ChartSkeleton,
  KPICardSkeleton,
  TableSkeleton,
} from "@/components/ui/skeletons";

/**
 * Main Dashboard Page - Server Component with Streaming
 *
 * Performance optimizations:
 * - Server Component by default for optimal performance
 * - Suspense boundaries for progressive rendering
 * - Static content rendered on server
 * - Only interactive components are client-side
 * - Reduced JavaScript bundle size
 * - Streaming SSR for instant page loads
 */
export default function DashboardPage() {
  // Server-side date formatting - no hydration issues
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header with better hierarchy */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-4xl tracking-tight">Today</h1>
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1">
            <div className="size-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-muted-foreground text-xs font-medium">Live</span>
          </div>
        </div>
        <p className="text-muted-foreground text-lg">{currentDate}</p>
      </div>

      {/* Top KPIs - 4 columns with enhanced spacing */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          change="+18.2% vs yesterday"
          changeType="positive"
          description="Goal: $12,500"
          icon={DollarSign}
          title="Today's Revenue"
          tooltip="Total revenue from completed and invoiced jobs today. This includes all payments received and outstanding invoices."
          value="$11,240"
        />
        <KPICard
          change="+3 from yesterday"
          changeType="positive"
          icon={Calendar}
          title="Jobs Completed"
          tooltip="Number of service calls your team has successfully completed today. Higher is better!"
          value="24"
        />
        <KPICard
          change="+12.5% this week"
          changeType="positive"
          icon={TrendingUp}
          title="Avg. Ticket Value"
          tooltip="Average revenue per job. Track this to understand if you're upselling effectively and pricing appropriately."
          value="$468"
        />
        <KPICard
          change="65 of 88 calls booked"
          changeType="positive"
          icon={Phone}
          title="Booking Rate"
          tooltip="Percentage of inbound calls that converted into scheduled jobs. Industry average is 60-70%."
          value="73.9%"
        />
      </div>

      {/* Alerts - 1 column */}
      <OperationalAlerts />

      {/* Job Pipeline - 1 column */}
      <div className="space-y-3">
        <SectionHeader
          description="Where your jobs are in the workflow"
          title="Job Flow"
          tooltip="Track jobs as they move through each stage: Scheduled → En Route → In Progress → Completed → Invoiced"
        />
        <JobStatusPipeline />
      </div>

      {/* Revenue Chart + Activity Feed - 2 columns with Streaming */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div>
            <h2 className="font-semibold text-xl">Revenue Overview</h2>
            <p className="text-muted-foreground text-sm">Last 7 days performance</p>
          </div>
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="space-y-3 lg:col-span-1">
          <div>
            <h2 className="font-semibold text-xl">Recent Activity</h2>
            <p className="text-muted-foreground text-sm">Latest updates</p>
          </div>
          <Suspense fallback={<TableSkeleton rows={5} />}>
            <ActivityFeed />
          </Suspense>
        </div>
      </div>

      {/* Recent Company Posts - Full width */}
      <div className="space-y-3">
        <div>
          <h2 className="font-semibold text-xl">Company Updates</h2>
          <p className="text-muted-foreground text-sm">Recent announcements and posts</p>
        </div>
        <RecentCompanyPosts limit={3} />
      </div>

      {/* Bottom row - 3 equal columns with Streaming */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-base">Schedule</h2>
            <p className="text-muted-foreground text-xs">Upcoming appointments</p>
          </div>
          <Suspense fallback={<TableSkeleton rows={3} />}>
            <ScheduleTimeline />
          </Suspense>
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-base">Call Activity</h2>
            <p className="text-muted-foreground text-xs">Inbound call trends</p>
          </div>
          <Suspense fallback={<ChartSkeleton height="h-[200px]" />}>
            <CallActivityChart />
          </Suspense>
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-base">Top Performers</h2>
            <p className="text-muted-foreground text-xs">Today's technicians</p>
          </div>
          <Suspense fallback={<TableSkeleton rows={3} />}>
            <TechnicianPerformance />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
