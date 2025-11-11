"use client";

/**
 * Materials Toolbar Actions - Client Component
 *
 * Provides materials inventory-specific toolbar actions
 * - Add material button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function MaterialsToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/inventory/materials/new",
        label: "Add Material",
      }}
      importExportDataType="materials"
    />
  );
}
