"use client";

/**
 * JobsTable Component
 * Full-width Gmail-style table for displaying jobs
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status and priority badges
 * - Click to view job details
 */

import {
  Archive,
  Briefcase,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import type { Job } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

type JobsTableProps = {
  jobs: Job[];
  itemsPerPage?: number;
  onJobClick?: (job: Job) => void;
  showRefresh?: boolean;
};

function formatCurrency(cents: number | null): string {
  if (cents === null) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date | number | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    {
      className: string;
      label: string;
    }
  > = {
    quoted: {
      className:
        "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
      label: "Quoted",
    },
    scheduled: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
      label: "Scheduled",
    },
    in_progress: {
      className: "border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600",
      label: "In Progress",
    },
    completed: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Completed",
    },
    cancelled: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Cancelled",
    },
  };

  const config = variants[status] || {
    className: "border-border/50 bg-background text-muted-foreground",
    label: status,
  };

  return (
    <Badge
      className={cn("font-medium text-xs", config.className)}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
}

function getPriorityBadge(priority: string) {
  const variants: Record<string, { className: string; label: string }> = {
    low: {
      className:
        "border-blue-200/50 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
      label: "Low",
    },
    medium: {
      className:
        "border-yellow-200/50 bg-yellow-50/50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400",
      label: "Medium",
    },
    high: {
      className:
        "border-orange-200/50 bg-orange-50/50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400",
      label: "High",
    },
    urgent: {
      className:
        "border-red-200/50 bg-red-50/50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",
      label: "Urgent",
    },
  };

  const config = variants[priority] || {
    className: "border-border/50 bg-background text-muted-foreground",
    label: priority,
  };

  return (
    <Badge
      className={cn("font-medium text-xs", config.className)}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
}

export function JobsTable({
  jobs,
  itemsPerPage = 50,
  onJobClick,
  showRefresh = true,
}: JobsTableProps) {
  const columns: ColumnDef<Job>[] = [
    {
      key: "jobNumber",
      header: "Job Number",
      width: "w-36",
      shrink: true,
      render: (job) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/${job.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {job.jobNumber}
        </Link>
      ),
    },
    {
      key: "title",
      header: "Title",
      width: "flex-1",
      render: (job) => (
        <div className="min-w-0">
          <div className="truncate font-medium leading-tight">{job.title}</div>
          {job.description && (
            <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
              {job.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (job) => getStatusBadge(job.status),
    },
    {
      key: "priority",
      header: "Priority",
      width: "w-28",
      shrink: true,
      hideOnMobile: true,
      render: (job) => getPriorityBadge(job.priority),
    },
    {
      key: "scheduledStart",
      header: "Scheduled",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (job) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatDate(job.scheduledStart)}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (job) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(job.totalAmount)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (job) => (
        <div data-no-row-click>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/${job.id}`}>
                  <Eye className="mr-2 size-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/${job.id}/edit`}>
                  <Edit className="mr-2 size-4" />
                  Edit Job
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  if (
                    !confirm(
                      "Archive this job? It can be restored within 90 days."
                    )
                  ) {
                    return;
                  }
                  const { archiveJob } = await import("@/actions/jobs");
                  const result = await archiveJob(job.id);
                  if (result.success) {
                    window.location.reload();
                  }
                }}
              >
                <Archive className="mr-2 size-4" />
                Archive Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Archive Selected",
      icon: <Archive className="h-4 w-4" />,
      onClick: async (selectedIds) => {
        if (
          !confirm(
            `Archive ${selectedIds.size} job(s)? They can be restored within 90 days.`
          )
        ) {
          return;
        }

        // Import dynamically to avoid circular dependencies
        const { archiveJob } = await import("@/actions/jobs");

        let archived = 0;
        for (const id of selectedIds) {
          const result = await archiveJob(id);
          if (result.success) archived++;
        }

        if (archived > 0) {
          window.location.reload(); // Reload to show updated list
        }
      },
      variant: "destructive",
    },
  ];

  // Search filter function with AI tags
  const searchFilter = (job: Job, query: string) => {
    const searchStr = query.toLowerCase();

    // Parse AI tags for searching
    const aiTags = job.aiTags
      ? typeof job.aiTags === "string"
        ? JSON.parse(job.aiTags)
        : job.aiTags
      : [];
    const aiCategories = job.aiCategories
      ? typeof job.aiCategories === "string"
        ? JSON.parse(job.aiCategories)
        : job.aiCategories
      : [];
    const aiEquipment = job.aiEquipment
      ? typeof job.aiEquipment === "string"
        ? JSON.parse(job.aiEquipment)
        : job.aiEquipment
      : [];

    return (
      job.jobNumber.toLowerCase().includes(searchStr) ||
      job.title.toLowerCase().includes(searchStr) ||
      job.status.toLowerCase().includes(searchStr) ||
      job.priority.toLowerCase().includes(searchStr) ||
      (job.description?.toLowerCase() || "").includes(searchStr) ||
      (job.aiServiceType?.toLowerCase() || "").includes(searchStr) ||
      aiTags.some((tag: string) => tag.toLowerCase().includes(searchStr)) ||
      aiCategories.some((cat: string) =>
        cat.toLowerCase().includes(searchStr)
      ) ||
      aiEquipment.some((eq: string) => eq.toLowerCase().includes(searchStr))
    );
  };

  const handleRowClick = (job: Job) => {
    if (onJobClick) {
      onJobClick(job);
    } else {
      window.location.href = `/dashboard/work/${job.id}`;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAddJob = () => {
    window.location.href = "/dashboard/work/new";
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={jobs}
      emptyAction={
        <Button onClick={handleAddJob} size="sm">
          <Plus className="mr-2 size-4" />
          Add Job
        </Button>
      }
      emptyIcon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
      emptyMessage="No jobs found"
      enableSelection={true}
      getItemId={(job) => job.id}
      itemsPerPage={itemsPerPage}
      onRefresh={handleRefresh}
      onRowClick={handleRowClick}
      searchFilter={searchFilter}
      searchPlaceholder="Search jobs by customer, category, equipment, service type..."
      showRefresh={showRefresh}
    />
  );
}
