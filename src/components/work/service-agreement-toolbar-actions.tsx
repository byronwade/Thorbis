/**
 * Service Agreement Toolbar Actions
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

// Critical columns (always visible - shown for reference)
const SERVICE_AGREEMENTS_CRITICAL_COLUMNS = [
  { key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const SERVICE_AGREEMENTS_OPTIONAL_COLUMNS = [
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "value", label: "Value" },
];

type ServiceAgreementToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

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
            columns={SERVICE_AGREEMENTS_OPTIONAL_COLUMNS}
            criticalColumns={SERVICE_AGREEMENTS_CRITICAL_COLUMNS}
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
