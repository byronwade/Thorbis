"use client";

/**
 * Equipment Toolbar Actions - Client Component
 *
 * Provides equipment inventory-specific toolbar actions
 * - Add equipment button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function EquipmentToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/inventory/equipment/new",
        label: "Add Equipment",
      }}
      importExportDataType="equipment"
    />
  );
}
