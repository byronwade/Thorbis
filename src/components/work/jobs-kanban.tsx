"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { KanbanItemBase, KanbanMoveEvent } from "@/components/ui/shadcn-io/kanban";
import { EntityKanban, type ColumnMeta } from "@/components/ui/entity-kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/formatters";

type JobStatus =
  | "quoted"
  | "scheduled"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

type RelatedCustomer = {
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  company_name?: string | null;
};

type RelatedProperty = {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
};

type ExtendedJob = Job & {
  customers?: RelatedCustomer | null;
  properties?: RelatedProperty | null;
};

type JobsKanbanItem = KanbanItemBase & {
  job: ExtendedJob;
};

type JobsKanbanProps = {
  jobs: ExtendedJob[];
};

const JOB_STATUS_COLUMNS: Array<{
  id: JobStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "quoted", name: "Quoted", accentColor: "#6B7280" },
  { id: "scheduled", name: "Scheduled", accentColor: "#2563EB" },
  { id: "in_progress", name: "In Progress", accentColor: "#F97316" },
  { id: "on_hold", name: "On Hold", accentColor: "#F59E0B" },
  { id: "completed", name: "Completed", accentColor: "#22C55E" },
  { id: "cancelled", name: "Cancelled", accentColor: "#EF4444" },
];

const COLUMN_LABEL = new Map(JOB_STATUS_COLUMNS.map((column) => [column.id, column.name]));
const DEFAULT_STATUS: JobStatus = "quoted";

function resolveStatus(status: Job["status"] | null | undefined): JobStatus {
  if (!status) {
    return DEFAULT_STATUS;
  }

  const normalized = status as JobStatus;
  return COLUMN_LABEL.has(normalized) ? normalized : DEFAULT_STATUS;
}

function createItems(jobs: ExtendedJob[]): JobsKanbanItem[] {
  return jobs.map((job) => ({
    id: job.id,
    columnId: resolveStatus(job.status),
    job,
  }));
}

function cloneItems(items: JobsKanbanItem[]): JobsKanbanItem[] {
  return items.map((item) => ({
    ...item,
    job: {
      ...item.job,
      customers: item.job.customers
        ? { ...item.job.customers }
        : item.job.customers,
      properties: item.job.properties
        ? { ...item.job.properties }
        : item.job.properties,
    },
  }));
}

function formatScheduledRange(job: ExtendedJob) {
  if (!job.scheduledStart) {
    return null;
  }

  return formatDateRange(job.scheduledStart, job.scheduledEnd ?? undefined);
}

function getCustomerName(job: ExtendedJob) {
  const customer = job.customers;
  if (!customer) {
    return "Unassigned customer";
  }

  if (customer.display_name) {
    return customer.display_name;
  }

  const nameParts = [customer.first_name, customer.last_name].filter(Boolean);
  if (nameParts.length > 0) {
    return nameParts.join(" ");
  }

  return customer.company_name || "Unassigned customer";
}

function getPropertySummary(job: ExtendedJob) {
  const property = job.properties;
  if (!property) {
    return null;
  }

  const parts = [property.address];
  const cityState = [property.city, property.state].filter(Boolean).join(", ");
  if (cityState) {
    parts.push(cityState);
  }

  return parts.filter(Boolean).join(" • ");
}

function PriorityBadge({ priority }: { priority: Job["priority"] }) {
  const config: Record<
    NonNullable<Job["priority"]>,
    { label: string; className: string }
  > = {
    low: {
      label: "Low",
      className:
        "border-blue-200/60 bg-blue-50/60 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300",
    },
    medium: {
      label: "Medium",
      className:
        "border-amber-200/60 bg-amber-50/60 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300",
    },
    high: {
      label: "High",
      className:
        "border-orange-200/60 bg-orange-50/60 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300",
    },
    urgent: {
      label: "Urgent",
      className:
        "border-red-200/60 bg-red-50/60 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300",
    },
  };

  const key = (priority ?? "medium") as keyof typeof config;
  const { label, className } = config[key];

  return (
    <Badge className={cn("font-medium text-xs", className)} variant="outline">
      {label}
    </Badge>
  );
}

function JobCardContent({ item }: { item: JobsKanbanItem }) {
  const { job, columnId } = item;
  const scheduledRange = formatScheduledRange(job);
  const propertySummary = getPropertySummary(job);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Link
            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary"
            href={`/dashboard/work/${job.id}`}
          >
            {job.jobNumber}
          </Link>
          <h3 className="text-sm font-semibold leading-snug text-foreground">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {job.jobType && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary"
              >
                {job.jobType}
              </Badge>
            )}
            <PriorityBadge priority={job.priority} />
            {typeof job.aiPriorityScore === "number" && (
              <Badge
                variant="outline"
                className="border-dashed border-primary/40 bg-primary/5 text-primary"
              >
                AI Score {job.aiPriorityScore}
              </Badge>
            )}
          </div>
        </div>
        <span className="text-sm font-semibold text-foreground">
          {formatCurrency(job.totalAmount)}
        </span>
      </div>

      {job.description && (
        <p className="line-clamp-3 text-xs text-muted-foreground">
          {job.description}
        </p>
      )}

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            {getCustomerName(job)}
          </span>
        </div>

        {propertySummary && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <span>{propertySummary}</span>
          </div>
        )}

        {scheduledRange && (
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <span>{scheduledRange}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 text-[11px] tracking-wide text-muted-foreground">
        <span>
          Updated {formatDate(job.updatedAt, { preset: "short" })}
        </span>
        <span className="uppercase">
          {COLUMN_LABEL.get(columnId as JobStatus) ?? columnId}
        </span>
      </div>

      <div className="flex items-center justify-end pt-1">
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="gap-1 text-xs text-primary"
        >
          <Link href={`/dashboard/work/${job.id}`}>
            View
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function JobsKanban({ jobs }: JobsKanbanProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleItemMove = async ({
    item,
    fromColumnId,
    toColumnId,
  }: KanbanMoveEvent<JobsKanbanItem>) => {
    if (fromColumnId === toColumnId) {
      return;
    }

    startTransition(() => {
      void (async () => {
        const { updateJobStatus } = await import("@/actions/jobs");
        const result = await updateJobStatus(item.job.id, toColumnId);

        if (!result.success) {
          toast.error("Unable to move job", {
            description: result.error,
          });
          return;
        }

        toast.success(
          `Job ${item.job.jobNumber} moved to ${COLUMN_LABEL.get(
            toColumnId as JobStatus
          )}`
        );
      })();
    });
  };

  return (
    <EntityKanban<ExtendedJob, JobStatus>
      columns={JOB_STATUS_COLUMNS}
      data={jobs}
      entityName="jobs"
      mapToKanbanItem={(job) => ({
        id: job.id,
        columnId: resolveStatus(job.status),
        entity: job,
        job,
      })}
      updateEntityStatus={(job, newStatus) => ({
        ...job,
        status: newStatus,
      })}
      calculateColumnMeta={(columnId, items) => {
        const columnItems = items.filter((item) => item.columnId === columnId);
        const total = columnItems.reduce(
          (sum, item) => sum + ((item.entity as ExtendedJob).totalAmount ?? 0),
          0
        );
        return { count: columnItems.length, total };
      }}
      showTotals={true}
      formatTotal={(total) => formatCurrency(total)}
      onItemMove={handleItemMove}
      renderCard={(item) => <JobCardContent item={{ ...item, job: item.entity } as JobsKanbanItem} />}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-md border border-border/70 bg-background/95 p-3 shadow-lg">
          <JobCardContent item={{ ...item, job: item.entity } as JobsKanbanItem} />
        </div>
      )}
    />
  );
}

