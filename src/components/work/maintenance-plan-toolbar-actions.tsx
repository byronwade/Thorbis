"use client";

/**
 * Maintenance Plan Toolbar Actions - Client Component
 *
 * Provides maintenance plan-specific toolbar actions
 * - New plan button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function MaintenancePlanToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/maintenance-plans/new",
        label: "New Plan",
      }}
      importExportDataType="maintenance-plans"
    />
  );
}
