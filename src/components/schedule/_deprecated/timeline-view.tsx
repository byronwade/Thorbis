"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type GanttFeature,
  GanttFeatureList,
  GanttFeatureRow,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  type GanttStatus,
  GanttTimeline,
  GanttToday,
  type Range,
} from "@/components/ui/shadcn-io/gantt";
import { cn } from "@/lib/utils";
import { type Job, mockTechnicians } from "./schedule-types";

type ViewMode = "hourly" | "daily" | "weekly" | "monthly";

// Status color mapping
const statusColorMap: Record<Job["status"], string> = {
  scheduled: "#3b82f6",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const priorityBorderColors = {
  low: "border-slate-500",
  medium: "border-blue-500",
  high: "border-orange-500",
  urgent: "border-red-500",
};

const technicianStatusColors = {
  available: "bg-green-500",
  "on-job": "bg-amber-500",
  "on-break": "bg-orange-500",
  offline: "bg-slate-500",
};

// Convert time string (HH:MM) to Date based on view mode
function timeStringToDate(
  timeStr: string,
  viewMode: ViewMode,
  dayOffset = 0
): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();

  // Set to start of today
  date.setHours(0, 0, 0, 0);

  if (viewMode === "hourly") {
    // For hourly view: all jobs stay on today but use actual hour/minute times
    // The high zoom level will spread them out horizontally within the day
    date.setHours(hours, minutes, 0, 0);
  } else {
    // For daily/weekly/monthly: use actual dates
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hours, minutes, 0, 0);
  }

  return date;
}

// Convert Job to GanttFeature
function jobToGanttFeature(
  job: Job,
  technicianId: string,
  viewMode: ViewMode,
  dayOffset = 0
): GanttFeature {
  const status: GanttStatus = {
    id: job.status,
    name: job.status,
    color: statusColorMap[job.status],
  };

  return {
    id: job.id,
    name: job.title,
    startAt: timeStringToDate(job.startTime, viewMode, dayOffset),
    endAt: timeStringToDate(job.endTime, viewMode, dayOffset),
    status,
    // Don't use lane since we're creating separate rows per technician
  };
}

// Get Gantt range based on view mode
function getGanttRange(viewMode: ViewMode): Range {
  switch (viewMode) {
    case "hourly":
      return "daily"; // Use daily range for hourly view (hack)
    case "daily":
    case "weekly":
      return "daily";
    case "monthly":
      return "monthly";
    default:
      return "daily";
  }
}

// Get zoom level based on view mode
function getZoomLevel(viewMode: ViewMode): number {
  switch (viewMode) {
    case "hourly":
      return 2000; // Extremely high zoom to spread hours across the timeline
    case "daily":
      return 150;
    case "weekly":
      return 100;
    case "monthly":
      return 80;
    default:
      return 150;
  }
}

// Component that has access to Gantt context for scrolling
function TimelineContent({
  viewMode,
  ganttData,
  onScrollToToday,
}: {
  viewMode: ViewMode;
  ganttData: Array<{
    technician: import("./schedule-types").Technician;
    features: GanttFeature[];
  }>;
  onScrollToToday: () => void;
}) {
  return (
    <>
      <GanttSidebar>
        <GanttSidebarGroup name="Technicians">
          {ganttData.map(({ technician }) => (
            <div
              className="border-border/50 border-b last:border-b-0"
              key={technician.id}
            >
              <div className="flex items-start gap-3 p-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                  {technician.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-semibold text-xs">
                      {technician.name}
                    </h4>
                    <div
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        technicianStatusColors[technician.status]
                      )}
                    />
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {technician.role}
                  </p>
                  <Badge className="mt-1 text-[10px]" variant="outline">
                    {technician.jobs.length}{" "}
                    {technician.jobs.length === 1 ? "job" : "jobs"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </GanttSidebarGroup>
      </GanttSidebar>

      <GanttTimeline>
        {viewMode === "hourly" ? (
          <div className="flex h-[60px] w-max divide-x divide-border/50 border-b bg-background">
            {Array.from({ length: 13 }, (_, i) => i + 7).map((hour) => {
              const hourWidth = 2000 / 24; // Zoom level divided by 24 hours
              return (
                <div
                  className="flex items-center justify-center px-4 font-semibold text-foreground text-xs"
                  key={hour}
                  style={{ minWidth: `${hourWidth}px` }}
                >
                  {hour === 12
                    ? "12 PM"
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
                </div>
              );
            })}
          </div>
        ) : (
          <GanttHeader />
        )}
        <GanttFeatureList>
          {ganttData.map(({ technician, features }) => (
            <GanttFeatureRow features={features} key={technician.id}>
              {(feature) => {
                const job = technician.jobs.find(
                  (j: Job) => j.id === feature.id
                );
                if (!job) {
                  return null;
                }

                return (
                  <div className="flex h-full w-full flex-col gap-0.5 px-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="line-clamp-1 flex-1 font-semibold text-[10px] leading-tight">
                        {job.title}
                      </p>
                      <div
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          priorityBorderColors[job.priority].replace(
                            "border-",
                            "bg-"
                          )
                        )}
                      />
                    </div>
                    <p className="line-clamp-1 text-[9px] text-muted-foreground">
                      {job.customer}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-[9px]">
                      <Clock className="size-2.5" />
                      <span className="font-medium">
                        {job.startTime} - {job.endTime}
                      </span>
                    </div>
                  </div>
                );
              }}
            </GanttFeatureRow>
          ))}
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </>
  );
}

export function TimelineView() {
  const [viewMode, setViewMode] = useState<ViewMode>("hourly");
  const [mounted, setMounted] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Maintain scroll position when switching views
  useEffect(() => {
    if (!mounted) return;

    // Small delay to allow Gantt to render
    const timer = setTimeout(() => {
      scrollToDate(currentViewDate);
    }, 100);

    return () => clearTimeout(timer);
  }, [viewMode, mounted]);

  // Track scroll position to update currentViewDate
  useEffect(() => {
    if (!mounted) return;

    const ganttElement = document.querySelector(".gantt");
    if (!ganttElement) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = ganttElement.scrollLeft;
        const columnWidth = 50;
        const zoomLevel = getZoomLevel(viewMode);
        const parsedColumnWidth = (columnWidth * zoomLevel) / 100;

        const now = new Date();
        const timelineStart = new Date(now.getFullYear(), 0, 1);

        if (viewMode === "hourly") {
          // Calculate which date/time is currently visible
          const totalDaysFraction = scrollLeft / parsedColumnWidth;
          const days = Math.floor(totalDaysFraction);
          const dayFraction = totalDaysFraction - days;

          const viewDate = new Date(timelineStart);
          viewDate.setDate(viewDate.getDate() + days);

          const minutesInDay = dayFraction * 24 * 60;
          const hours = Math.floor(minutesInDay / 60);
          const minutes = Math.floor(minutesInDay % 60);
          viewDate.setHours(hours, minutes, 0, 0);

          setCurrentViewDate(viewDate);
        } else if (viewMode === "daily" || viewMode === "weekly") {
          const days = Math.floor(scrollLeft / parsedColumnWidth);
          const viewDate = new Date(timelineStart);
          viewDate.setDate(viewDate.getDate() + days);
          setCurrentViewDate(viewDate);
        } else {
          // Monthly
          const monthsFraction = scrollLeft / parsedColumnWidth;
          const months = Math.floor(monthsFraction);
          const monthFraction = monthsFraction - months;

          const viewDate = new Date(timelineStart);
          viewDate.setMonth(viewDate.getMonth() + months);

          const daysInMonth = new Date(
            viewDate.getFullYear(),
            viewDate.getMonth() + 1,
            0
          ).getDate();
          const day = Math.floor(monthFraction * daysInMonth) + 1;
          viewDate.setDate(day);

          setCurrentViewDate(viewDate);
        }
      }, 150); // Debounce delay
    };

    ganttElement.addEventListener("scroll", handleScroll);
    return () => {
      ganttElement.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [mounted, viewMode]);

  // Function to scroll to a specific date
  const scrollToDate = (targetDate: Date) => {
    const ganttElement = document.querySelector(".gantt");
    if (!ganttElement) return;

    const columnWidth = 50; // Default Gantt column width
    const zoomLevel = getZoomLevel(viewMode);
    const parsedColumnWidth = (columnWidth * zoomLevel) / 100;

    // Timeline starts at Jan 1st of the target date's year
    const timelineStart = new Date(targetDate.getFullYear(), 0, 1);

    if (viewMode === "hourly") {
      // For hourly view: scroll to exact time within the date
      const startOfDate = new Date(targetDate);
      startOfDate.setHours(0, 0, 0, 0);

      // Calculate days from timeline start to target date
      const daysToDate = Math.floor(
        (startOfDate.getTime() - timelineStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Calculate time within day as fraction
      const hour = targetDate.getHours();
      const minute = targetDate.getMinutes();
      const minutesSinceMidnight = hour * 60 + minute;
      const dayFraction = minutesSinceMidnight / (24 * 60);

      // Total scroll = (days to date * column width) + (fraction of day * column width)
      const scrollPosition =
        daysToDate * parsedColumnWidth + dayFraction * parsedColumnWidth;
      ganttElement.scrollLeft = scrollPosition;
    } else if (viewMode === "daily" || viewMode === "weekly") {
      // For daily/weekly: scroll to start of date
      const startOfDate = new Date(targetDate);
      startOfDate.setHours(0, 0, 0, 0);

      // Calculate difference in days from timeline start
      const daysDifference = Math.floor(
        (startOfDate.getTime() - timelineStart.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Scroll position = days * column width
      const scrollPosition = daysDifference * parsedColumnWidth;
      ganttElement.scrollLeft = scrollPosition;
    } else {
      // For monthly view: scroll to target month
      // Calculate difference in months from timeline start
      const monthsDifference =
        (targetDate.getFullYear() - timelineStart.getFullYear()) * 12 +
        (targetDate.getMonth() - timelineStart.getMonth());

      // For monthly view, each column is a month
      // Add partial offset for current day within the month
      const dayOfMonth = targetDate.getDate();
      const daysInMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0
      ).getDate();
      const monthFraction = dayOfMonth / daysInMonth;

      const scrollPosition =
        monthsDifference * parsedColumnWidth +
        monthFraction * parsedColumnWidth;
      ganttElement.scrollLeft = scrollPosition;
    }
  };

  // Function to scroll to today's position
  const scrollToToday = () => {
    const now = new Date();
    setCurrentViewDate(now);
    scrollToDate(now);
  };

  // Group technicians and convert jobs to GanttFeatures
  // For daily/weekly/monthly views, we'll spread jobs across multiple days
  const ganttData = mockTechnicians.map((tech) => {
    const features = tech.jobs.map((job, index) => {
      if (viewMode === "hourly") {
        // Single day view - all jobs on "today"
        return jobToGanttFeature(job, tech.id, viewMode, 0);
      }
      if (viewMode === "daily") {
        // Spread jobs across 7 days
        const dayOffset = index % 7;
        return jobToGanttFeature(job, tech.id, viewMode, dayOffset);
      }
      if (viewMode === "weekly") {
        // Spread jobs across 14 days (2 weeks)
        const dayOffset = index % 14;
        return jobToGanttFeature(job, tech.id, viewMode, dayOffset);
      }
      // Monthly: spread jobs across 30 days
      const dayOffset = index % 30;
      return jobToGanttFeature(job, tech.id, viewMode, dayOffset);
    });

    return {
      technician: tech,
      features,
    };
  });

  if (!mounted) {
    // Return a loading skeleton that matches the structure
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b bg-background p-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground text-sm">
              View:
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="default">
                Hourly
              </Button>
              <Button size="sm" variant="outline">
                Daily
              </Button>
              <Button size="sm" variant="outline">
                Weekly
              </Button>
              <Button size="sm" variant="outline">
                Monthly
              </Button>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Today
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted-foreground">Loading schedule...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between border-b bg-background p-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground text-sm">
            View:
          </span>
          <div className="flex gap-1">
            <Button
              onClick={() => setViewMode("hourly")}
              size="sm"
              variant={viewMode === "hourly" ? "default" : "outline"}
            >
              Hourly
            </Button>
            <Button
              onClick={() => setViewMode("daily")}
              size="sm"
              variant={viewMode === "daily" ? "default" : "outline"}
            >
              Daily
            </Button>
            <Button
              onClick={() => setViewMode("weekly")}
              size="sm"
              variant={viewMode === "weekly" ? "default" : "outline"}
            >
              Weekly
            </Button>
            <Button
              onClick={() => setViewMode("monthly")}
              size="sm"
              variant={viewMode === "monthly" ? "default" : "outline"}
            >
              Monthly
            </Button>
          </div>
        </div>
        <Button onClick={scrollToToday} size="sm" variant="outline">
          Today
        </Button>
      </div>

      <GanttProvider
        range={getGanttRange(viewMode)}
        zoom={getZoomLevel(viewMode)}
      >
        <TimelineContent
          ganttData={ganttData}
          onScrollToToday={scrollToToday}
          viewMode={viewMode}
        />
      </GanttProvider>
    </div>
  );
}
