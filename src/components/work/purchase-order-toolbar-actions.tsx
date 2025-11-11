"use client";

/**
 * Purchase Order Toolbar Actions - Client Component
 *
 * Provides purchase order-specific toolbar actions
 * - New PO button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function PurchaseOrderToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/purchase-orders/new",
        label: "New Purchase Order",
      }}
      importExportDataType="purchase-orders"
    />
  );
}
