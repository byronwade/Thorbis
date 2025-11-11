"use client";

/**
 * Invoices List Toolbar Actions - Client Component
 *
 * Toolbar actions for the invoices list page
 * - View switcher (table/kanban)
 * - New Invoice button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function InvoicesListToolbarActions() {
  return (
    <BaseToolbarActions
      viewSwitcherSection="invoices"
      primaryAction={{
        href: "/dashboard/work/invoices/new",
        label: "New Invoice",
      }}
      importExportDataType="invoices"
    />
  );
}

