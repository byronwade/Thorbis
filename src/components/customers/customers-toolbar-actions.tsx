"use client";

/**
 * CustomersToolbarActions Component
 *
 * Toolbar actions for the customers page
 * - View switcher (table/kanban)
 * - Add New Customer button
 * - Import Customers
 * - Export Customers
 */

import { UserPlus } from "lucide-react";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function CustomersToolbarActions() {
  return (
    <BaseToolbarActions
      viewSwitcherSection="customers"
      primaryAction={{
        href: "/dashboard/customers/new",
        label: "Add Customer",
        icon: <UserPlus className="mr-2 size-4" />,
      }}
      importExportDataType="customers"
    />
  );
}
