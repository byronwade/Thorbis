"use client";

/**
 * Estimate Toolbar Actions - Client Component
 *
 * Provides estimate-specific toolbar actions
 * - New estimate button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function EstimateToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/estimates/new",
        label: "New Estimate",
      }}
      importExportDataType="estimates"
    />
  );
}
