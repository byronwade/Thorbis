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
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { JobStatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import type { Job } from "@/lib/db/schema";
import { formatCurrency, formatDate } from "@/lib/formatters";

type JobsTableProps = {
  jobs: Job[];
  itemsPerPage?: number;
  onJobClick?: (job: Job) => void;
  showRefresh?: boolean;
};


export function JobsTable({
  jobs,
  itemsPerPage = 50,
  onJobClick,
  showRefresh = false,
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
      render: (job) => <JobStatusBadge status={job.status} />,
    },
    {
      key: "priority",
      header: "Priority",
      width: "w-28",
      shrink: true,
      hideOnMobile: true,
      render: (job) => <PriorityBadge priority={job.priority} />,
    },
    {
      key: "scheduledStart",
      header: "Scheduled",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (job) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatDate(job.scheduledStart, "short")}
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
          {formatCurrency(job.totalAmount || 0, { decimals: 2 })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (job) => (
        <RowActionsDropdown
          actions={[
            {
              label: "View Details",
              icon: Eye,
              href: `/dashboard/work/${job.id}`,
            },
            {
              label: "Edit Job",
              icon: Edit,
              href: `/dashboard/work/${job.id}/edit`,
            },
            {
              label: "Archive Job",
              icon: Archive,
              variant: "destructive",
              separatorBefore: true,
              onClick: async () => {
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
              },
            },
          ]}
        />
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
