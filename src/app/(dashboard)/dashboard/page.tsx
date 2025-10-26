"use client";

import { Calendar, DollarSign, Info, Phone, TrendingUp } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { CallActivityChart } from "@/components/dashboard/call-activity-chart";
import { JobStatusPipeline } from "@/components/dashboard/job-status-pipeline";
import { KPICard } from "@/components/dashboard/kpi-card";
import { OperationalAlerts } from "@/components/dashboard/operational-alerts";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline";
import { TechnicianPerformance } from "@/components/dashboard/technician-performance";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePageLayout } from "@/hooks/use-page-layout";

function SectionHeader({
  title,
  description,
  tooltip,
}: {
  title: string;
  description?: string;
  tooltip?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <h2 className="font-semibold text-xl">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export default function DashboardPage() {
  // Configure layout: 7xl width, no toolbar, no sidebar
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: false,
    showSidebar: false,
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-bold text-3xl tracking-tight">Today at a Glance</h1>
        <p className="text-lg text-muted-foreground">{currentDate}</p>
      </div>

      {/* Top KPIs - 4 columns */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="space-y-4">
        <SectionHeader
          description="Where your jobs are in the workflow"
          title="Job Flow"
          tooltip="Track jobs as they move through each stage: Scheduled → En Route → In Progress → Completed → Invoiced"
        />
        <JobStatusPipeline />
      </div>

      {/* Revenue Chart + Activity Feed - 2 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Bottom row - 3 equal columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ScheduleTimeline />
        <CallActivityChart />
        <TechnicianPerformance />
      </div>
    </div>
  );
}
