/**
 * Purchase Order Toolbar Actions
 *
 * Toolbar actions for the purchase orders page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - New Purchase Order button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { PurchaseOrdersFilterDropdown } from "@/components/work/purchase-orders-filter-dropdown";

// Critical columns (always visible - shown for reference)
const PURCHASE_ORDERS_CRITICAL_COLUMNS = [
  { key: "vendor", label: "Vendor" },
  { key: "totalAmount", label: "Amount" },
  { key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const PURCHASE_ORDERS_OPTIONAL_COLUMNS = [
  { key: "priority", label: "Priority" },
  { key: "expectedDelivery", label: "Expected Delivery" },
];

interface PurchaseOrderToolbarActionsProps {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
}

export function PurchaseOrderToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: PurchaseOrderToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <PurchaseOrdersFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={PURCHASE_ORDERS_OPTIONAL_COLUMNS}
            criticalColumns={PURCHASE_ORDERS_CRITICAL_COLUMNS}
            entity="purchase_orders"
          />
        </div>
      }
      importExportDataType="purchase-orders"
      primaryAction={{
        href: "/dashboard/work/purchase-orders/new",
        label: "New Purchase Order",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
