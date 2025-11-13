/**
 * Job Header Section
 * Displays job information (status, dates, description, etc.)
 */

"use client";

import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type JobHeaderProps = {
  job: any;
  onUpdate?: (field: string, value: any) => void;
};

export function JobHeader({ job, onUpdate }: JobHeaderProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      quoted: "Quoted",
      scheduled: "Scheduled",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      on_hold: "On Hold",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Status and Priority */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Status</Label>
          <div className="mt-2">
            <Badge variant="outline" className="text-sm">
              {getStatusLabel(job.status)}
            </Badge>
          </div>
        </div>
        <div>
          <Label>Priority</Label>
          <div className="mt-2">
            <Badge variant="secondary" className="text-sm capitalize">
              {job.priority || "Normal"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Service Type and Job Type */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Service Type</Label>
          <p className="mt-2 text-sm">
            {job.service_type || job.job_type || "Not specified"}
          </p>
        </div>
        <div>
          <Label>Job Number</Label>
          <p className="mt-2 text-sm font-mono">
            {job.job_number || job.id.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <div>
          <Label>Description</Label>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground text-sm">
            {job.description}
          </p>
        </div>
      )}

      {/* Dates */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label className="flex items-center gap-2">
            <Calendar className="size-4" />
            Created
          </Label>
          <p className="mt-2 text-sm">{formatDate(job.created_at)}</p>
        </div>
        {job.scheduled_date && (
          <div>
            <Label className="flex items-center gap-2">
              <Calendar className="size-4" />
              Scheduled
            </Label>
            <p className="mt-2 text-sm">{formatDate(job.scheduled_date)}</p>
          </div>
        )}
        {job.completed_at && (
          <div>
            <Label className="flex items-center gap-2">
              <Calendar className="size-4" />
              Completed
            </Label>
            <p className="mt-2 text-sm">{formatDate(job.completed_at)}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div>
          <Label>Tags</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

