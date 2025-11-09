"use client";

/**
 * Gantt Job Block Component
 * Renders a job as a block in the time grid
 */

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateDuration, formatDuration } from "@/lib/schedule-utils";
import type { Job } from "./schedule-types";

type GanttJobBlockProps = {
  job: Job;
  isSelected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
};

const statusColors = {
  scheduled: "bg-blue-500/90 hover:bg-blue-500",
  "in-progress": "bg-amber-500/90 hover:bg-amber-500",
  completed: "bg-green-500/90 hover:bg-green-500",
  cancelled: "bg-red-500/90 hover:bg-red-500",
};

const priorityBorderColors = {
  low: "border-l-slate-500",
  medium: "border-l-blue-500",
  high: "border-l-orange-500",
  urgent: "border-l-red-500",
};

export function GanttJobBlock({
  job,
  isSelected,
  onClick,
  style,
}: GanttJobBlockProps) {
  const duration = calculateDuration(job.startTime, job.endTime);

  return (
    <div
      className={cn(
        "group relative flex min-h-[60px] cursor-pointer flex-col gap-1 rounded-md border-l-4 px-2 py-1.5 text-white shadow-sm transition-all",
        statusColors[job.status],
        priorityBorderColors[job.priority],
        isSelected && "ring-2 ring-primary ring-offset-1",
        onClick && "hover:shadow-md"
      )}
      onClick={onClick}
      style={style}
      title={`${job.title} - ${job.customer.name}`}
    >
      {/* Job Title */}
      <p className="line-clamp-1 font-semibold text-xs leading-tight">
        {job.title}
      </p>

      {/* Customer Name */}
      <p className="line-clamp-1 text-[10px] opacity-90">
        {job.customer.name}
      </p>

      {/* Duration */}
      <div className="mt-auto flex items-center gap-1 text-[10px] opacity-80">
        <Clock className="size-2.5" />
        <span className="font-medium">{formatDuration(duration)}</span>
      </div>

      {/* Priority Indicator */}
      <div
        className={cn(
          "absolute right-1 top-1 size-1.5 rounded-full",
          priorityBorderColors[job.priority].replace("border-l-", "bg-")
        )}
      />
    </div>
  );
}

