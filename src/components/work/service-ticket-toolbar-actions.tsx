"use client";

/**
 * Service Ticket Toolbar Actions - Client Component
 *
 * Provides service ticket-specific toolbar actions
 * - New ticket button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function ServiceTicketToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/service-tickets/new",
        label: "New Ticket",
      }}
      importExportDataType="service-tickets"
    />
  );
}
