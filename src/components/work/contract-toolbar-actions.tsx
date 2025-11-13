/**
 * Contract Toolbar Actions
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

// Critical columns (always visible - shown for reference)
const CONTRACTS_CRITICAL_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const CONTRACTS_OPTIONAL_COLUMNS = [
  { key: "contractType", label: "Type" },
  { key: "signerName", label: "Signer" },
  { key: "date", label: "Created" },
  { key: "validUntil", label: "Valid Until" },
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
            columns={CONTRACTS_OPTIONAL_COLUMNS}
            criticalColumns={CONTRACTS_CRITICAL_COLUMNS}
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
