"use client";

/**
 * Service Agreement Toolbar Actions - Client Component
 *
 * Provides service agreement-specific toolbar actions
 * - New agreement button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function ServiceAgreementToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/service-agreements/new",
        label: "New Agreement",
      }}
      importExportDataType="service-agreements"
    />
  );
}
