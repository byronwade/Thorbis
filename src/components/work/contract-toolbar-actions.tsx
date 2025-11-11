"use client";

/**
 * Contract Toolbar Actions - Client Component
 *
 * Provides contract-specific toolbar actions
 * - New contract button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function ContractToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/contracts/new",
        label: "New Contract",
      }}
      importExportDataType="contracts"
    />
  );
}
