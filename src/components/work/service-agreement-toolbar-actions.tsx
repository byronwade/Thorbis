"use client";

/**
 * Service Agreement Toolbar Actions - Client Component
 *
 * Toolbar actions for the service agreements page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - New Agreement button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { ServiceAgreementsFilterDropdown } from "@/components/work/service-agreements-filter-dropdown";

// Define hideable columns for service agreements
const SERVICE_AGREEMENTS_COLUMNS = [
  { key: "customer", label: "Customer" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
  { key: "value", label: "Value" },
  { key: "status", label: "Status" },
];

interface ServiceAgreementToolbarActionsProps {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
}

export function ServiceAgreementToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: ServiceAgreementToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ServiceAgreementsFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={SERVICE_AGREEMENTS_COLUMNS}
            entity="service_agreements"
          />
        </div>
      }
      importExportDataType="service-agreements"
      primaryAction={{
        href: "/dashboard/work/service-agreements/new",
        label: "New Agreement",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
