"use client";

import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Check, MoreVertical, UserPlus, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSchedule } from "@/hooks/use-schedule";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { cn } from "@/lib/utils";
import { NoTechniciansEmptyState } from "./empty-states";
import type { Job } from "./schedule-types";

/**
 * ServiceTitan-style Timeline Dispatch Board
 * - Technician lanes (rows)
 * - Hourly columns (24-hour view with dimmed after-hours)
 * - Current time indicator (blue line)
 * - Overlap detection and stacking
 * - View scaling (day/week/month)
 */

const HOUR_WIDTH = 100; // Width of each hour column in pixels
const LANE_HEIGHT = 120; // Compact lane height
const SIDEBAR_WIDTH = 200; // Compact sidebar
const JOB_HEIGHT = 80; // Height of job pill
const JOB_STACK_OFFSET = 8; // Vertical offset for overlapping jobs

const technicianStatusColors = {
  available: "bg-emerald-500",
  "on-job": "bg-amber-500",
  "on-break": "bg-amber-500",
  offline: "bg-slate-400",
};

const statusColors: Record<Job["status"], string> = {
  scheduled: "bg-blue-500/90 hover:bg-blue-500 border-blue-600",
  dispatched: "bg-sky-500/90 hover:bg-sky-500 border-sky-600",
  arrived: "bg-indigo-500/90 hover:bg-indigo-500 border-indigo-600",
  "in-progress": "bg-amber-500/90 hover:bg-amber-500 border-amber-600",
  completed: "bg-emerald-500/90 hover:bg-emerald-500 border-emerald-600",
  closed: "bg-emerald-700/90 hover:bg-emerald-700 border-emerald-800",
  cancelled: "bg-slate-500/90 hover:bg-slate-500 border-slate-600",
};

type JobWithPosition = {
  job: Job;
  left: number;
  width: number;
  top: number; // For stacking overlaps
  lane: number; // Which overlap lane (0 = bottom)
};

// Detect overlapping jobs and assign lanes
function detectOverlapsAndAssignLanes(
  jobs: Array<{ job: Job; left: number; width: number }>
): JobWithPosition[] {
  const positioned: JobWithPosition[] = [];

  jobs.forEach(({ job, left, width }) => {
    const right = left + width;

    // Find all jobs this one overlaps with
    const overlapping = positioned.filter((p) => {
      const pRight = p.left + p.width;
      return !(right <= p.left || left >= pRight);
    });

    // Find the first available lane
    let lane = 0;
    const usedLanes = new Set(overlapping.map((p) => p.lane));
    while (usedLanes.has(lane)) {
      lane++;
    }

    positioned.push({
      job,
      left,
      width,
      top: lane * JOB_STACK_OFFSET,
      lane,
    });
  });

  return positioned;
}

// Draggable Job Component with Quick Actions (memoized for performance)
const DraggableJob = memo(function DraggableJob({
  job,
  left,
  width,
  top,
  isSelected,
  onSelect,
  onComplete,
  onCancel,
  onAssign,
}: {
  job: Job;
  left: number;
  width: number;
  top: number;
  isSelected: boolean;
  onSelect: () => void;
  onComplete: (jobId: string) => void;
  onCancel: (jobId: string) => void;
  onAssign: (jobId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: job.id,
      data: { job },
    });

  const style = {
    left: `${left}px`,
    width: `${width}px`,
    top: `${8 + top}px`,
    height: `${JOB_HEIGHT}px`,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  const startTime =
    job.startTime instanceof Date ? job.startTime : new Date(job.startTime);
  const endTime =
    job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
  const duration = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  );
  const hasMultipleAssignments = job.assignments.length > 1;

  return (
    <div
      className="absolute"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          "group relative flex h-full cursor-grab flex-col justify-between rounded-lg border p-2.5 shadow-md transition-all hover:scale-[1.03] hover:shadow-xl active:cursor-grabbing",
          statusColors[job.status],
          job.isUnassigned &&
            "border-red-600 bg-red-500/90 ring-1 ring-red-400 hover:bg-red-500",
          isSelected &&
            "scale-[1.03] ring-2 ring-white ring-offset-2 ring-offset-blue-500",
          isDragging && "shadow-2xl"
        )}
        onClick={onSelect}
      >
        {/* Quick Actions Menu (visible on hover) */}
        <div className="-top-2 -right-2 absolute z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                className="size-6 rounded-full bg-white p-0 shadow-lg hover:bg-white/90"
                size="sm"
                variant="ghost"
              >
                <MoreVertical className="size-3 text-slate-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              {job.isUnassigned && (
                <>
                  <DropdownMenuItem onClick={() => onAssign(job.id)}>
                    <UserPlus className="mr-2 size-4" />
                    Assign Technician
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {job.status === "scheduled" && (
                <DropdownMenuItem onClick={() => onComplete(job.id)}>
                  <Check className="mr-2 size-4" />
                  Mark Complete
                </DropdownMenuItem>
              )}
              {job.status === "in-progress" && (
                <DropdownMenuItem onClick={() => onComplete(job.id)}>
                  <Check className="mr-2 size-4" />
                  Complete Job
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onCancel(job.id)}
              >
                <X className="mr-2 size-4" />
                Cancel Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Priority Indicator */}
        {job.priority === "urgent" && (
          <div className="absolute top-1 right-1 size-2 animate-pulse rounded-full bg-red-400 ring-2 ring-white/50" />
        )}
        {job.priority === "high" && (
          <div className="absolute top-1 right-1 size-2 rounded-full bg-orange-400 ring-2 ring-white/50" />
        )}

        {/* Job Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-1 flex-1 font-bold text-white text-xs leading-tight">
              {job.title}
            </p>
            <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 font-mono text-[9px] text-white">
              {duration}m
            </span>
          </div>
          <p className="line-clamp-1 font-medium text-[10px] text-white/90">
            {job.customer.name}
          </p>
          {job.location.address.street && (
            <p className="line-clamp-1 text-[9px] text-white/70">
              {job.location.address.street}
            </p>
          )}
        </div>

        {/* Job Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="font-mono font-semibold text-[10px] text-white/90">
              {format(startTime, "h:mm a")}
            </span>
            {hasMultipleAssignments && (
              <div className="-space-x-1 flex">
                {job.assignments.slice(0, 3).map((assignment, idx) => (
                  <div
                    className="flex size-4 items-center justify-center rounded-full bg-white/30 font-bold text-[8px] text-white ring-1 ring-white/50"
                    key={idx}
                    title={assignment.displayName}
                  >
                    {assignment.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                ))}
              </div>
            )}
          </div>
          {job.isUnassigned && (
            <span className="rounded bg-white/25 px-1.5 py-0.5 font-bold text-[8px] text-white uppercase tracking-wide">
              Unassigned
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Technician Lane Component (memoized for performance with many lanes)
const TechnicianLane = memo(function TechnicianLane({
  technician,
  jobs,
  height,
  selectedJobId,
  onSelectJob,
  onCompleteJob,
  onCancelJob,
  onAssignJob,
}: {
  technician: { id: string; name: string; role: string; status: string };
  jobs: JobWithPosition[];
  height: number;
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onCompleteJob: (jobId: string) => void;
  onCancelJob: (jobId: string) => void;
  onAssignJob: (jobId: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: technician.id,
  });

  return (
    <div
      className="relative border-border/30 border-b"
      ref={setNodeRef}
      style={{ height }}
    >
      {jobs.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <span className="text-muted-foreground/60 text-xs">
            No appointments
          </span>
        </div>
      ) : (
        jobs.map(({ job, left, width, top }) => (
          <DraggableJob
            isSelected={selectedJobId === job.id}
            job={job}
            key={job.id}
            left={left}
            onAssign={onAssignJob}
            onCancel={onCancelJob}
            onComplete={onCompleteJob}
            onSelect={() => onSelectJob(job.id)}
            top={top}
            width={width}
          />
        ))
      )}
    </div>
  );
});

export function TimelineViewV2() {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    technicians,
    getJobsForTechnician,
    selectJob,
    selectedJobId,
    moveJob,
    updateJob,
    isLoading,
    error,
  } = useSchedule();
  const { currentDate } = useScheduleViewStore();

  // Quick action handlers (memoized)
  const handleCompleteJob = useCallback(
    (jobId: string) => {
      updateJob(jobId, { status: "completed" });
    },
    [updateJob]
  );

  const handleCancelJob = useCallback(
    (jobId: string) => {
      updateJob(jobId, { status: "cancelled" });
    },
    [updateJob]
  );

  const handleAssignJob = useCallback((jobId: string) => {
    // TODO: Open assign technician dialog
    console.log("Assign job:", jobId);
  }, []);

  // Generate 24-hour slots (midnight to midnight)
  const hourlySlots = useMemo(() => {
    const slots: Date[] = [];
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);

    for (let hour = 0; hour < 24; hour++) {
      const slot = new Date(dayStart);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }
    return slots;
  }, [currentDate]);

  // Calculate time range for the full day
  const timeRange = useMemo(() => {
    const start = hourlySlots[0];
    const end = new Date(hourlySlots[hourlySlots.length - 1]);
    end.setHours(end.getHours() + 1);
    return { start, end };
  }, [hourlySlots]);

  const totalWidth = hourlySlots.length * HOUR_WIDTH;

  // Calculate current time position (blue line)
  const currentTimePosition = useMemo(() => {
    const now = new Date();
    // Only show if viewing today
    const isToday = now.toDateString() === currentDate.toDateString();
    if (!isToday || now < timeRange.start || now > timeRange.end) {
      return null;
    }
    const totalMinutes =
      (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60);
    const currentMinutes =
      (now.getTime() - timeRange.start.getTime()) / (1000 * 60);
    return (currentMinutes / totalMinutes) * totalWidth;
  }, [timeRange, totalWidth, currentDate]);

  // Group jobs by technician, calculate positions, and detect overlaps
  const technicianLanes = useMemo(() => {
    return technicians.map((tech) => {
      const jobs = getJobsForTechnician(tech.id).filter((job) => {
        const jobStart =
          job.startTime instanceof Date
            ? job.startTime
            : new Date(job.startTime);
        const jobEnd =
          job.endTime instanceof Date ? job.endTime : new Date(job.endTime);
        return jobStart <= timeRange.end && jobEnd >= timeRange.start;
      });

      const jobPositions = jobs.map((job) => {
        const jobStart =
          job.startTime instanceof Date
            ? job.startTime
            : new Date(job.startTime);
        const jobEnd =
          job.endTime instanceof Date ? job.endTime : new Date(job.endTime);

        const clampedStart =
          jobStart < timeRange.start ? timeRange.start : jobStart;
        const clampedEnd = jobEnd > timeRange.end ? timeRange.end : jobEnd;

        const startMinutes =
          (clampedStart.getTime() - timeRange.start.getTime()) / (1000 * 60);
        const endMinutes =
          (clampedEnd.getTime() - timeRange.start.getTime()) / (1000 * 60);
        const durationMinutes = endMinutes - startMinutes;

        const left = (startMinutes / 60) * HOUR_WIDTH;
        const width = (durationMinutes / 60) * HOUR_WIDTH;

        return {
          job,
          left: Math.max(0, left),
          width: Math.max(50, width),
        };
      });

      // Detect overlaps and assign stacking lanes
      const positionedJobs = detectOverlapsAndAssignLanes(jobPositions);
      const maxLane = Math.max(0, ...positionedJobs.map((p) => p.lane));
      const laneHeight = LANE_HEIGHT + maxLane * JOB_STACK_OFFSET;

      return {
        technician: tech,
        jobs: positionedJobs,
        height: laneHeight,
      };
    });
  }, [technicians, getJobsForTechnician, timeRange]);

  // Handle drag end (memoized)
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const jobId = active.id as string;
      const targetTechnicianId = over.id as string;

      // Find the job
      const job = technicianLanes
        .flatMap((lane) => lane.jobs)
        .find((j) => j.job.id === jobId)?.job;

      if (!job) return;

      // Calculate new time based on drop position
      // For now, just move to the target technician
      // TODO: Calculate exact time from drop coordinates
      moveJob(jobId, targetTechnicianId, job.startTime, job.endTime);
    },
    [technicianLanes, moveJob]
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to current time when viewing today
  useEffect(() => {
    if (currentTimePosition !== null && scrollContainerRef.current) {
      // Center the current time in the viewport
      const container = scrollContainerRef.current;
      container.scrollLeft = Math.max(
        0,
        currentTimePosition - container.clientWidth / 2
      );
    }
  }, [currentDate, currentTimePosition]);

  // NOW we can do conditional returns after all hooks are declared
  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-muted-foreground">Loading schedule...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-destructive">Error loading schedule</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <NoTechniciansEmptyState
        onAddTechnician={() => {
          // TODO: Navigate to add technician
        }}
      />
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        {/* Hour Header */}
        <div className="sticky top-0 z-30 flex shrink-0 border-b bg-background shadow-sm">
          {/* Sidebar spacer */}
          <div
            className="shrink-0 border-r bg-muted/50"
            style={{ width: SIDEBAR_WIDTH }}
          >
            <div className="flex h-10 items-center px-3">
              <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                Technicians
              </span>
            </div>
          </div>

          {/* Hour columns */}
          <div className="flex overflow-x-auto">
            {hourlySlots.map((slot, index) => {
              const hour = slot.getHours();
              const isBusinessHours = hour >= 7 && hour < 19;
              return (
                <div
                  className={cn(
                    "flex h-10 shrink-0 items-center justify-center border-r",
                    isBusinessHours ? "bg-background" : "bg-muted/40"
                  )}
                  key={index}
                  style={{ width: HOUR_WIDTH }}
                >
                  <span
                    className={cn(
                      "font-medium text-xs",
                      isBusinessHours
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(slot, "ha")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technician Lanes */}
        <div className="flex flex-1 overflow-auto">
          {/* Sidebar */}
          <div
            className="sticky left-0 z-20 shrink-0 border-r bg-background"
            style={{ width: SIDEBAR_WIDTH }}
          >
            {technicianLanes.map(({ technician, jobs, height }) => (
              <div
                className="flex flex-col border-b bg-muted/5"
                key={technician.id}
                style={{ height }}
              >
                <div className="flex items-center gap-2.5 p-3">
                  <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 font-bold text-primary text-xs ring-1 ring-primary/20">
                    {technician.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                    <div
                      className={cn(
                        "-bottom-0.5 -right-0.5 absolute size-2.5 rounded-full ring-2 ring-background",
                        technicianStatusColors[technician.status]
                      )}
                      title={technician.status}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-semibold text-xs leading-tight">
                      {technician.name}
                    </h4>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {technician.role}
                    </p>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                      {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Grid */}
          <div
            className="relative flex-1 overflow-x-auto"
            ref={scrollContainerRef}
          >
            <div
              className="relative"
              style={{ width: totalWidth, minHeight: "100%" }}
            >
              {/* Hour Column Backgrounds */}
              <div className="absolute inset-0 flex">
                {hourlySlots.map((slot, index) => {
                  const hour = slot.getHours();
                  const isBusinessHours = hour >= 7 && hour < 19;
                  return (
                    <div
                      className={cn(
                        "shrink-0 border-border/30 border-r",
                        isBusinessHours
                          ? index % 2 === 0
                            ? "bg-background"
                            : "bg-muted/10"
                          : "bg-muted/30"
                      )}
                      key={index}
                      style={{ width: HOUR_WIDTH }}
                    />
                  );
                })}
              </div>

              {/* Current Time Indicator (Blue Line) */}
              {currentTimePosition !== null && (
                <div
                  className="absolute top-0 z-20 h-full w-0.5 bg-blue-500 shadow-lg"
                  style={{ left: currentTimePosition }}
                >
                  <div className="-left-1.5 -top-1.5 absolute size-3 rounded-full bg-blue-500 ring-2 ring-blue-200" />
                  <div className="-top-7 -translate-x-1/2 absolute left-1/2 whitespace-nowrap rounded-md bg-blue-500 px-2 py-1 font-medium text-white text-xs shadow-lg">
                    {format(new Date(), "h:mm a")}
                  </div>
                </div>
              )}

              {/* Technician Lanes with Jobs (virtualization-ready) */}
              {technicianLanes.map(({ technician, jobs, height }) => (
                <TechnicianLane
                  height={height}
                  jobs={jobs}
                  key={technician.id}
                  onAssignJob={handleAssignJob}
                  onCancelJob={handleCancelJob}
                  onCompleteJob={handleCompleteJob}
                  onSelectJob={selectJob}
                  selectedJobId={selectedJobId}
                  technician={technician}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
