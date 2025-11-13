"use client";

/**
 * Job Toolbar Client Wrapper
 *
 * Manages edit mode state and passes it to child components
 */

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { Job, Property, User } from "@/lib/db/schema";
import type { PropertyEnrichment } from "@/lib/services/property-enrichment";
import { JobProcessIndicator } from "../job-process-indicator";
import { JobToolbar } from "./job-toolbar";
import { WidgetGrid } from "./widget-grid";

interface JobToolbarClientProps {
  job: Job;
  property?: Property;
  customer?: User;
  propertyEnrichment?: PropertyEnrichment | null;
  invoices?: unknown[];
  estimates?: unknown[];
  photos?: unknown[];
  documents?: unknown[];
  communications?: unknown[];
}

export function JobToolbarClient({
  job,
  property,
  customer,
  propertyEnrichment,
  invoices,
  estimates,
  photos,
  documents,
  communications,
}: JobToolbarClientProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const jobNumber = job.jobNumber != null ? String(job.jobNumber) : "Job";
  const jobStatus = (job.status ?? "quoted") as string;
  const toDate = (value: unknown): Date | null => {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const jobRaw = job as unknown as Record<string, unknown>;
  const getTimelineDate = (
    primary: Date | string | null | undefined,
    fallbackKey: string
  ) => toDate(primary ?? jobRaw[fallbackKey]);

  const timelineDates = {
    quoted: getTimelineDate(job.createdAt, "created_at"),
    scheduled: getTimelineDate(job.scheduledStart, "scheduled_start"),
    inProgress: getTimelineDate(job.actualStart, "actual_start"),
    completed: getTimelineDate(job.actualEnd, "actual_end"),
  };

  return (
    <div className="space-y-6">
      {/* Toolbar with Edit Toggle */}
      <JobToolbar
        isEditMode={isEditMode}
        jobNumber={jobNumber}
        jobTitle={(job.title || "Untitled Job") as string}
        jobType={(job.jobType || "service") as string}
        onToggleEditMode={setIsEditMode}
        status={jobStatus}
      />

      <Separator />

      {/* Process Timeline */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 font-semibold text-lg">Project Timeline</h2>
        <JobProcessIndicator
          currentStatus={jobStatus as never}
          dates={timelineDates}
        />
      </div>

      <Separator />

      {/* Widget Grid */}
      <WidgetGrid
        communications={communications}
        customer={customer}
        documents={documents}
        estimates={estimates}
        invoices={invoices}
        job={job}
        photos={photos}
        property={property}
        propertyEnrichment={propertyEnrichment}
      />
    </div>
  );
}
