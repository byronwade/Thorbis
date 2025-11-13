"use client";

/**
 * Estimate Toolbar Actions - Client Component
 *
 * Toolbar actions for the estimates page
 * - Comprehensive filter dropdown (archive + status + amount + customer + estimate#)
 * - Column visibility toggle
 * - New Estimate button
 * - Import/Export
 */

import { EstimatesFilterDropdown } from "@/components/work/estimates-filter-dropdown";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define hideable columns for estimates
const ESTIMATES_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "valid_until", label: "Valid Until" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "project", label: "Project" },
];

type EstimateToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

export function EstimateToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: EstimateToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <EstimatesFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={ESTIMATES_COLUMNS}
            entity="estimates"
          />
        </div>
      }
      importExportDataType="estimates"
      primaryAction={{
        href: "/dashboard/work/estimates/new",
        label: "New Estimate",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
