"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  type KanbanItemBase,
  type KanbanMoveEvent,
} from "@/components/ui/shadcn-io/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  MapPin,
} from "lucide-react";

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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

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

function formatCurrency(cents: number | null | undefined) {
  if (cents === null || cents === undefined) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(cents / 100);
}

function formatScheduledRange(job: ExtendedJob) {
  if (!job.scheduledStart) {
    return null;
  }

  const start = new Date(job.scheduledStart);
  if (!job.scheduledEnd) {
    return dateFormatter.format(start);
  }

  const end = new Date(job.scheduledEnd);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return dateFormatter.format(start);
  }

  return `${dateFormatter.format(start)} → ${dateFormatter.format(end)}`;
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
          Updated {fullDateFormatter.format(new Date(job.updatedAt))}
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
  const columns = useMemo(() => JOB_STATUS_COLUMNS, []);
  const initialItems = useMemo(() => createItems(jobs), [jobs]);
  const [kanbanItems, setKanbanItems] = useState<JobsKanbanItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  const itemsRef = useRef<JobsKanbanItem[]>(initialItems);
  const previousItemsRef = useRef<JobsKanbanItem[]>(initialItems);

  useEffect(() => {
    const items = createItems(jobs);
    itemsRef.current = items;
    previousItemsRef.current = cloneItems(items);
    setKanbanItems(items);
  }, [jobs]);

  useEffect(() => {
    itemsRef.current = kanbanItems;
  }, [kanbanItems]);

  const handleDataChange = (nextItems: JobsKanbanItem[]) => {
    previousItemsRef.current = cloneItems(itemsRef.current);
    const normalized = nextItems.map((item) => ({
      ...item,
      job: {
        ...item.job,
        status: item.columnId as JobStatus,
      },
    }));
    itemsRef.current = normalized;
    setKanbanItems(normalized);
  };

  const handleItemMove = ({ item, fromColumnId, toColumnId }: KanbanMoveEvent<JobsKanbanItem>) => {
    if (fromColumnId === toColumnId) {
      return;
    }

    const previous = cloneItems(previousItemsRef.current);

    startTransition(() => {
      void (async () => {
        const { updateJobStatus } = await import("@/actions/jobs");
        const result = await updateJobStatus(item.job.id, toColumnId);

        if (!result.success) {
          itemsRef.current = previous;
          previousItemsRef.current = previous;
          setKanbanItems(previous);
          toast.error("Unable to move job", {
            description: result.error,
          });
          return;
        }

        previousItemsRef.current = cloneItems(itemsRef.current);
        toast.success(
          `Job ${item.job.jobNumber} moved to ${COLUMN_LABEL.get(
            toColumnId as JobStatus
          )}`
        );
      })();
    });
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, { count: number; total: number }>>(
      (acc, column) => {
        const columnItems = kanbanItems.filter(
          (item) => item.columnId === column.id
        );
        const total = columnItems.reduce(
          (sum, item) => sum + (item.job.totalAmount ?? 0),
          0
        );
        acc[column.id] = { count: columnItems.length, total };
        return acc;
      },
      {}
    );
  }, [columns, kanbanItems]);

  return (
    <KanbanProvider<JobsKanbanItem>
      className="pb-4"
      columns={columns}
      data={kanbanItems}
      onDataChange={handleDataChange}
      onItemMove={handleItemMove}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-md border border-border/70 bg-background/95 p-3 shadow-lg">
          <JobCardContent item={item} />
        </div>
      )}
    >
      {columns.map((column, columnIndex) => {
        const meta = columnMeta[column.id] ?? { count: 0, total: 0 };
        const showPending = isPending && columnIndex === 0;
        return (
          <KanbanBoard
            className="min-h-[320px] flex-1"
            column={column}
            key={column.id}
          >
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: column.accentColor }}
                />
                <span className="font-semibold text-sm text-foreground">
                  {column.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    className="rounded-full bg-muted px-2 py-0 text-xs font-medium text-muted-foreground"
                    variant="secondary"
                  >
                    {meta.count} jobs
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(meta.total)}
                  </span>
                </div>
              </div>
              {showPending && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  Updating…
                </span>
              )}
            </KanbanHeader>
            <KanbanCards<JobsKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-md border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No jobs in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <JobCardContent item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
  );
}

