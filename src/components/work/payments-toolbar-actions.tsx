"use client";

/**
 * PaymentsToolbarActions Component - Client Component
 *
 * Toolbar actions for the payments page
 * - Comprehensive filter dropdown (archive + status + method + amount + customer + reference#)
 * - Column visibility toggle
 * - Record Payment button
 * - Import/Export
 */

import { PaymentsFilterDropdown } from "@/components/work/payments-filter-dropdown";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define hideable columns for payments
const PAYMENTS_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "invoice", label: "Invoice" },
  { key: "amount", label: "Amount" },
  { key: "payment_method", label: "Payment Method" },
  { key: "status", label: "Status" },
  { key: "processed_at", label: "Processed At" },
];

type PaymentsToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

export function PaymentsToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: PaymentsToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <PaymentsFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={PAYMENTS_COLUMNS}
            entity="payments"
          />
        </div>
      }
      importExportDataType="payments"
      primaryAction={{
        href: "/dashboard/work/payments/new",
        label: "Record Payment",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
