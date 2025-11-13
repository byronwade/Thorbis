"use client";

/**
 * Hourly Time Grid Component
 * Renders hourly columns with job blocks positioned by time
 */

import { useEffect, useMemo, useRef } from "react";
import {
  formatHourLabel,
  getCurrentTimePosition,
  jobOverlapsRange,
} from "@/lib/schedule-gantt-utils";
import { cn } from "@/lib/utils";
import { GanttJobBlock } from "./gantt-job-block";
import type { Job } from "./schedule-types";

type HourlyTimeGridProps = {
  date: Date;
  startHour?: number;
  endHour?: number;
  jobs: Job[];
  selectedJobId?: string;
  onJobClick?: (jobId: string) => void;
  hourWidth?: number; // Width of each hour column in pixels
};

export function HourlyTimeGrid({
  date,
  startHour = 7,
  endHour = 19,
  jobs,
  selectedJobId,
  onJobClick,
  hourWidth = 120,
}: HourlyTimeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate hourly slots
  const hourlySlots = useMemo(() => {
    const slots: Date[] = [];
    const dayStart = new Date(date);
    dayStart.setHours(startHour, 0, 0, 0);
    dayStart.setMinutes(0, 0, 0);

    for (let hour = startHour; hour <= endHour; hour++) {
      const slot = new Date(dayStart);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }
    return slots;
  }, [date, startHour, endHour]);

  // Calculate time range
  const timeRange = useMemo(() => {
    const start = hourlySlots[0];
    const end = new Date(hourlySlots[hourlySlots.length - 1]);
    end.setHours(end.getHours() + 1);
    return { start, end };
  }, [hourlySlots]);

  const totalWidth = hourlySlots.length * hourWidth;

  // Get current time position
  const currentTimePosition = useMemo(
    () => getCurrentTimePosition(timeRange.start, timeRange.end, totalWidth),
    [timeRange.start, timeRange.end, totalWidth]
  );

  // Filter jobs that overlap with the time range
  const visibleJobs = useMemo(
    () =>
      jobs.filter((job) =>
        jobOverlapsRange(
          job.startTime,
          job.endTime,
          timeRange.start,
          timeRange.end
        )
      ),
    [jobs, timeRange]
  );

  // Calculate job positions
  const jobPositions = useMemo(() => {
    return visibleJobs.map((job) => {
      const jobStart = new Date(job.startTime);
      const jobEnd = new Date(job.endTime);

      // Clamp job times to visible range
      const clampedStart =
        jobStart < timeRange.start ? timeRange.start : jobStart;
      const clampedEnd = jobEnd > timeRange.end ? timeRange.end : jobEnd;

      // Calculate position and width
      const startMinutes =
        (clampedStart.getTime() - timeRange.start.getTime()) / (1000 * 60);
      const endMinutes =
        (clampedEnd.getTime() - timeRange.start.getTime()) / (1000 * 60);
      const durationMinutes = endMinutes - startMinutes;

      const left = (startMinutes / 60) * hourWidth;
      const width = (durationMinutes / 60) * hourWidth;

      return {
        job,
        left: Math.max(0, left),
        width: Math.max(30, width), // Minimum width of 30px
      };
    });
  }, [visibleJobs, timeRange, hourWidth]);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current && currentTimePosition !== null) {
      const scrollLeft =
        currentTimePosition - scrollContainerRef.current.clientWidth / 2;
      scrollContainerRef.current.scrollLeft = Math.max(0, scrollLeft);
    }
  }, [currentTimePosition]);

  return (
    <div className="flex h-full flex-col">
      {/* Time Header */}
      <div className="flex border-b bg-background">
        {hourlySlots.map((slot, index) => (
          <div
            className="border-r px-2 py-2 text-center"
            key={index}
            style={{ width: hourWidth }}
          >
            <div className="font-semibold text-xs">{formatHourLabel(slot)}</div>
          </div>
        ))}
      </div>

      {/* Scrollable Grid */}
      <div
        className="relative flex-1 overflow-x-auto overflow-y-hidden"
        ref={scrollContainerRef}
      >
        <div
          className="relative h-full"
          ref={gridRef}
          style={{ width: totalWidth }}
        >
          {/* Hour Columns Background */}
          <div className="absolute inset-0 flex">
            {hourlySlots.map((_, index) => (
              <div
                className={cn(
                  "border-r",
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
                key={index}
                style={{ width: hourWidth }}
              />
            ))}
          </div>

          {/* Current Time Indicator */}
          {currentTimePosition !== null && (
            <div
              className="absolute top-0 z-10 h-full w-0.5 bg-destructive"
              style={{ left: currentTimePosition }}
            >
              <div className="-left-1.5 -top-1.5 absolute size-3 rounded-full bg-destructive" />
            </div>
          )}

          {/* Job Blocks */}
          <div className="relative h-full">
            {jobPositions.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    No jobs scheduled for this time period
                  </p>
                </div>
              </div>
            ) : (
              jobPositions.map(({ job, left, width }) => (
                <div
                  className="absolute top-2"
                  key={job.id}
                  style={{
                    left: `${left}px`,
                    width: `${width}px`,
                  }}
                >
                  <GanttJobBlock
                    isSelected={selectedJobId === job.id}
                    job={job}
                    onClick={() => onJobClick?.(job.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
