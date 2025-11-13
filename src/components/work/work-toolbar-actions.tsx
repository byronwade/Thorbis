/**
 * WorkToolbarActions Component
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

// Critical columns (always visible - shown for reference)
const JOBS_CRITICAL_COLUMNS = [
  { key: "status", label: "Status" },
  { key: "totalAmount", label: "Amount" },
];

// Optional columns (can be hidden)
const JOBS_OPTIONAL_COLUMNS = [
  { key: "priority", label: "Priority" },
  { key: "scheduledStart", label: "Scheduled" },
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
          <ColumnVisibilityMenu
            columns={JOBS_OPTIONAL_COLUMNS}
            criticalColumns={JOBS_CRITICAL_COLUMNS}
            entity="jobs"
          />
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
