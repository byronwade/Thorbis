"use client";

/**
 * Month Time Grid Component
 * Renders a calendar month view with days as columns
 */

import {
  addDays,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GanttJobBlock } from "./gantt-job-block";
import type { Job } from "./schedule-types";

type MonthTimeGridProps = {
  date: Date;
  jobs: Job[];
  selectedJobId?: string;
  onJobClick?: (jobId: string) => void;
  dayWidth?: number; // Width of each day column in pixels
};

export function MonthTimeGrid({
  date,
  jobs,
  selectedJobId,
  onJobClick,
  dayWidth = 120,
}: MonthTimeGridProps) {
  // Generate calendar days (6 weeks to fill the grid)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
    const days: Date[] = [];

    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(addDays(startDate, i));
    }

    return days;
  }, [date]);

  // Filter jobs that overlap with the month
  const monthStart = startOfMonth(date);
  monthStart.setHours(0, 0, 0, 0);
  const monthEnd = endOfMonth(date);
  monthEnd.setHours(23, 59, 59, 999);

  const visibleJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const jobStart = new Date(job.startTime);
        const jobEnd = new Date(job.endTime);
        return jobStart <= monthEnd && jobEnd >= monthStart;
      }),
    [jobs, monthStart, monthEnd]
  );

  // Group jobs by day
  const jobsByDay = useMemo(() => {
    const grouped = new Map<number, Job[]>();
    visibleJobs.forEach((job) => {
      const jobStart = new Date(job.startTime);
      const dayKey = jobStart.getDate();
      if (!grouped.has(dayKey)) {
        grouped.set(dayKey, []);
      }
      grouped.get(dayKey)!.push(job);
    });
    return grouped;
  }, [visibleJobs]);

  // Week day headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex h-full flex-col">
      {/* Week Day Headers */}
      <div className="flex border-b bg-background">
        {weekDays.map((day) => (
          <div
            className="border-r px-2 py-2 text-center"
            key={day}
            style={{ width: dayWidth }}
          >
            <div className="font-semibold text-xs">{day}</div>
          </div>
        ))}
      </div>

      {/* Scrollable Grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative" style={{ width: dayWidth * 7 }}>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, new Date());
              const dayJobs = jobsByDay.get(day.getDate()) || [];

              return (
                <div
                  className={cn(
                    "flex min-h-[100px] flex-col border-r border-b",
                    !isCurrentMonth && "bg-muted/30",
                    isToday && "bg-primary/5"
                  )}
                  key={index}
                  style={{ width: dayWidth }}
                >
                  {/* Day Number */}
                  <div
                    className={cn(
                      "flex h-8 items-center justify-center border-b px-2 text-xs",
                      isToday &&
                        "bg-primary font-semibold text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  {/* Jobs for this day */}
                  <div className="flex-1 space-y-1 overflow-y-auto p-1">
                    {dayJobs.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-[10px] text-muted-foreground">
                          No jobs
                        </div>
                      </div>
                    ) : (
                      <>
                        {dayJobs.slice(0, 3).map((job) => (
                          <GanttJobBlock
                            isSelected={selectedJobId === job.id}
                            job={job}
                            key={job.id}
                            onClick={() => onJobClick?.(job.id)}
                          />
                        ))}
                        {dayJobs.length > 3 && (
                          <div className="px-1 text-[10px] text-muted-foreground">
                            +{dayJobs.length - 3} more
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
