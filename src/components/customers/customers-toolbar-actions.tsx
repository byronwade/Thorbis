"use client";

/**
 * CustomersToolbarActions Component - Client Component
 *
 * Toolbar actions for the customers page
 * - Comprehensive filter dropdown (archive + type + status + name + email + phone)
 * - Column visibility toggle
 * - Add New Customer button
 * - Import/Export
 */

import { UserPlus } from "lucide-react";
import { CustomersFilterDropdown } from "@/components/work/customers-filter-dropdown";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define hideable columns for customers
const CUSTOMERS_COLUMNS = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "total_jobs", label: "Total Jobs" },
];

type CustomersToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

export function CustomersToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: CustomersToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <CustomersFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={CUSTOMERS_COLUMNS}
            entity="customers"
          />
        </div>
      }
      importExportDataType="customers"
      primaryAction={{
        href: "/dashboard/customers/new",
        label: "Add Customer",
        icon: <UserPlus className="mr-2 size-4" />,
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
