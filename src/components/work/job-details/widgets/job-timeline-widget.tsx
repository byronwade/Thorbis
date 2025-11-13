/**
 * Job Timeline Widget - Server Component
 *
 * Visual representation of job progress through stages.
 * Shows quoted → scheduled → in progress → completed timeline.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Reuses JobProcessIndicator component
 * - Static rendering for better performance
 */

import { JobProcessIndicator } from "@/components/work/job-process-indicator";
import type { Job } from "@/lib/db/schema";

interface JobTimelineWidgetProps {
  job: Job;
}

export function JobTimelineWidget({ job }: JobTimelineWidgetProps) {
  const toDate = (value: unknown): Date | null => {
    if (!value) return null;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  // Map job data to timeline dates
  const dates = {
    quoted: toDate(job.createdAt),
    scheduled: toDate(job.scheduledStart),
    inProgress: toDate(job.actualStart),
    completed: toDate(job.actualEnd),
  };

  return (
    <div className="space-y-4">
      <JobProcessIndicator
        currentStatus={
          job.status as
            | "quoted"
            | "scheduled"
            | "in_progress"
            | "completed"
            | "cancelled"
        }
        dates={dates}
      />

      {/* Additional timeline details */}
      <div className="space-y-2 text-sm">
        {toDate(job.scheduledStart) && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled Start:</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(toDate(job.scheduledStart)!)}
            </span>
          </div>
        )}

        {toDate(job.scheduledEnd) && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled End:</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(toDate(job.scheduledEnd)!)}
            </span>
          </div>
        )}

        {toDate(job.actualStart) && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Actual Start:</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(toDate(job.actualStart)!)}
            </span>
          </div>
        )}

        {toDate(job.actualEnd) && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completed:</span>
            <span className="font-medium text-success">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(toDate(job.actualEnd)!)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
