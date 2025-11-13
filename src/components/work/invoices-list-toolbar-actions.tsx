/**
 * Invoices List Toolbar Actions
 *
 * Toolbar actions for the invoices list page
 * - Comprehensive filter dropdown (archive + status + amount + customer + invoice#)
 * - Column visibility toggle
 * - View switcher (table only - kanban disabled)
 * - New Invoice button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { InvoicesFilterDropdown } from "@/components/work/invoices-filter-dropdown";

// Critical columns (always visible - shown for reference)
const INVOICES_CRITICAL_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "dueDate", label: "Due Date" },
  { key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const INVOICES_OPTIONAL_COLUMNS = [
  { key: "date", label: "Date" }, // Created date - optional, less critical than due date
];

type InvoicesListToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

export function InvoicesListToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: InvoicesListToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <InvoicesFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={INVOICES_OPTIONAL_COLUMNS}
            criticalColumns={INVOICES_CRITICAL_COLUMNS}
            entity="invoices"
          />
        </div>
      }
      importExportDataType="invoices"
      primaryAction={{
        href: "/dashboard/invoices/create",
        label: "New Invoice",
      }}
      viewSwitcherSection={undefined} // Disable view switcher (no kanban for invoices)
    />
  );
}
