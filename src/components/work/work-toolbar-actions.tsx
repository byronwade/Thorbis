"use client";

/**
 * WorkToolbarActions Component - Client Component
 *
 * Toolbar actions for the work/jobs page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - New Job button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { JobsFilterDropdown } from "@/components/work/jobs-filter-dropdown";

// Define hideable columns for jobs
const JOBS_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "category", label: "Category" },
  { key: "equipment", label: "Equipment" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "assigned_user", label: "Assigned To" },
  { key: "scheduled_date", label: "Scheduled" },
];

interface WorkToolbarActionsProps {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
}

export function WorkToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: WorkToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <JobsFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu columns={JOBS_COLUMNS} entity="jobs" />
        </div>
      }
      importExportDataType="jobs"
      primaryAction={{
        href: "/dashboard/work/new",
        label: "New Job",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
