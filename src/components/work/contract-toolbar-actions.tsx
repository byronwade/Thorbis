"use client";

/**
 * Contract Toolbar Actions - Client Component
 *
 * Toolbar actions for the contracts page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - New Contract button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { ContractsFilterDropdown } from "@/components/work/contracts-filter-dropdown";

// Define hideable columns for contracts
const CONTRACTS_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
  { key: "value", label: "Value" },
  { key: "status", label: "Status" },
];

interface ContractToolbarActionsProps {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
}

export function ContractToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: ContractToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ContractsFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={CONTRACTS_COLUMNS}
            entity="contracts"
          />
        </div>
      }
      importExportDataType="contracts"
      primaryAction={{
        href: "/dashboard/work/contracts/new",
        label: "New Contract",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
