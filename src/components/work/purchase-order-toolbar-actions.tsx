"use client";

/**
 * Purchase Order Toolbar Actions - Client Component
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

// Define hideable columns for purchase orders
const PURCHASE_ORDERS_COLUMNS = [
  { key: "vendor", label: "Vendor" },
  { key: "order_date", label: "Order Date" },
  { key: "delivery_date", label: "Delivery Date" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
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
            columns={PURCHASE_ORDERS_COLUMNS}
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
