/**
 * Job Details Widget - Server Component
 *
 * Core job information and notes
 */

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";
import { formatDate } from "@/lib/formatters";

interface JobDetailsWidgetProps {
  job: Job;
}

export function JobDetailsWidget({ job }: JobDetailsWidgetProps) {
  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-muted-foreground text-xs">Job Number</div>
          <div className="font-medium text-sm">{job.jobNumber}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Status</div>
          <Badge className="text-xs" variant="outline">
            {job.status.replace("_", " ")}
          </Badge>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Job Type</div>
          <div className="font-medium text-sm capitalize">{job.jobType}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Priority</div>
          <Badge
            className="text-xs"
            variant={
              job.priority === "high"
                ? "destructive"
                : job.priority === "medium"
                  ? "secondary"
                  : "outline"
            }
          >
            {job.priority}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Schedule */}
      <div>
        <h4 className="mb-2 font-semibold text-xs">Schedule</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Scheduled Start</span>
            <span className="font-medium">
              {formatDate(job.scheduledStart)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Scheduled End</span>
            <span className="font-medium">{formatDate(job.scheduledEnd)}</span>
          </div>
          {job.actualStart ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Actual Start</span>
              <span className="font-medium">{formatDate(job.actualStart)}</span>
            </div>
          ) : null}
          {job.actualEnd ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Actual End</span>
              <span className="font-medium">{formatDate(job.actualEnd)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h4 className="mb-2 font-semibold text-xs">Description</h4>
        <p className="text-muted-foreground text-xs">{job.description}</p>
      </div>

      {/* Notes */}
      {job.notes ? (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 font-semibold text-xs">Notes</h4>
            <div className="rounded-md bg-muted p-2 text-xs">{job.notes}</div>
          </div>
        </>
      ) : null}
    </div>
  );
}
