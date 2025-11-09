"use client";

/**
 * Week Time Grid Component
 * Renders a week view with days as columns and hourly rows
 */

import { useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { GanttJobBlock } from "./gantt-job-block";
import type { Job } from "./schedule-types";
import { cn } from "@/lib/utils";

type WeekTimeGridProps = {
  date: Date;
  startHour?: number;
  endHour?: number;
  jobs: Job[];
  selectedJobId?: string;
  onJobClick?: (jobId: string) => void;
  dayWidth?: number; // Width of each day column in pixels
};

export function WeekTimeGrid({
  date,
  startHour = 7,
  endHour = 19,
  jobs,
  selectedJobId,
  onJobClick,
  dayWidth = 150,
}: WeekTimeGridProps) {
  // Generate week days (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Start on Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [date]);

  // Generate hourly rows
  const hours = useMemo(() => {
    return Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
  }, [startHour, endHour]);

  // Filter jobs that overlap with the week
  const weekStart = weekDays[0];
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekDays[6]);
  weekEnd.setHours(23, 59, 59, 999);

  const visibleJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const jobStart = new Date(job.startTime);
        const jobEnd = new Date(job.endTime);
        return jobStart <= weekEnd && jobEnd >= weekStart;
      }),
    [jobs, weekStart, weekEnd]
  );

  // Calculate job positions
  const getJobPosition = (job: Job) => {
    const jobStart = new Date(job.startTime);
    const jobEnd = new Date(job.endTime);
    const jobDay = jobStart.getDay(); // 0 = Sunday, 6 = Saturday
    const jobHour = jobStart.getHours();
    const jobMinutes = jobStart.getMinutes();
    const jobEndHour = jobEnd.getHours();
    const jobEndMinutes = jobEnd.getMinutes();

    // Calculate which day column
    const dayIndex = jobDay;
    const left = dayIndex * dayWidth;

    // Calculate vertical position (hour row) - 60px per hour
    const hourRow = jobHour - startHour;
    const minuteOffset = jobMinutes / 60; // Fraction of hour
    const top = hourRow * 60 + minuteOffset * 60;

    // Calculate height
    const durationHours = jobEndHour - jobHour;
    const durationMinutes = jobEndMinutes - jobMinutes;
    const totalMinutes = durationHours * 60 + durationMinutes;
    const height = (totalMinutes / 60) * 60; // Convert to pixels (60px per hour)

    return {
      left,
      top: Math.max(0, top),
      width: dayWidth - 4, // Leave some padding
      height: Math.max(20, height), // Minimum height
      spansMultipleDays: !isSameDay(jobStart, jobEnd),
    };
  };

  return (
    <div className="flex h-full flex-col">
      {/* Day Headers */}
      <div className="flex border-b bg-background">
        {weekDays.map((day, index) => (
          <div
            className="border-r px-2 py-2 text-center"
            key={index}
            style={{ width: dayWidth }}
          >
            <div className="font-semibold text-xs">{format(day, "EEE")}</div>
            <div className="text-muted-foreground text-[10px]">
              {format(day, "MMM d")}
            </div>
          </div>
        ))}
      </div>

      {/* Scrollable Grid */}
      <div className="relative flex-1 overflow-auto">
        <div className="relative" style={{ width: dayWidth * 7 }}>
          {/* Day Columns Background */}
          <div className="absolute inset-0 flex">
            {weekDays.map((_, dayIndex) => (
              <div
                className="border-r"
                key={dayIndex}
                style={{ width: dayWidth }}
              >
                {/* Hour Rows */}
                {hours.map((hour, hourIndex) => (
                  <div
                    className={cn(
                      "border-b",
                      hourIndex % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}
                    key={hourIndex}
                    style={{ height: "60px" }}
                  >
                    {hourIndex === 0 && (
                      <div className="px-2 py-1 text-[10px] text-muted-foreground">
                        {hour}:00
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Job Blocks */}
          <div className="relative">
            {visibleJobs.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    No jobs scheduled for this week
                  </p>
                </div>
              </div>
            ) : (
              visibleJobs.map((job) => {
                const position = getJobPosition(job);
                return (
                  <div
                    className="absolute"
                    key={job.id}
                    style={{
                      left: `${position.left + 2}px`,
                      top: `${position.top}px`,
                      width: `${position.width}px`,
                      height: `${position.height}px`,
                    }}
                  >
                    <GanttJobBlock
                      job={job}
                      isSelected={selectedJobId === job.id}
                      onClick={() => onJobClick?.(job.id)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

