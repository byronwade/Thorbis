"use client";

/**
 * PaymentsToolbarActions Component - Client Component
 *
 * Toolbar actions for the payments page
 * - View switcher
 * - Filter button
 * - Record Payment button
 * - Import/Export
 */

import { Filter } from "lucide-react";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { Button } from "@/components/ui/button";

export function PaymentsToolbarActions() {
  return (
    <BaseToolbarActions
      viewSwitcherSection="payments"
      beforePrimaryAction={
        <Button size="sm" variant="ghost">
          <Filter className="mr-2 size-4" />
          Filter
        </Button>
      }
      primaryAction={{
        href: "/dashboard/work/payments/new",
        label: "Record Payment",
      }}
      importExportDataType="payments"
    />
  );
}





