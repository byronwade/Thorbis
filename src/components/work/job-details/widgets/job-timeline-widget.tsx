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
  // Map job data to timeline dates
  const dates = {
    quoted: job.createdAt,
    scheduled: job.scheduledStart,
    inProgress: job.actualStart,
    completed: job.actualEnd,
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
        {job.scheduledStart && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled Start:</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(job.scheduledStart))}
            </span>
          </div>
        )}

        {job.scheduledEnd && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Scheduled End:</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(job.scheduledEnd))}
            </span>
          </div>
        )}

        {job.actualStart && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Actual Start:</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(job.actualStart))}
            </span>
          </div>
        )}

        {job.actualEnd && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completed:</span>
            <span className="font-medium text-green-600">
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(job.actualEnd))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
