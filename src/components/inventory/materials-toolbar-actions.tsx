"use client";

/**
 * Materials Toolbar Actions - Client Component
 *
 * Toolbar actions for the materials page
 * - Archive filter
 * - Column visibility toggle
 * - Add Material button
 * - Import/Export
 */

import { useArchiveStore } from "@/lib/stores/archive-store";
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define hideable columns for materials
const MATERIALS_COLUMNS = [
  { key: "category", label: "Category" },
  { key: "quantity", label: "Quantity" },
  { key: "unit", label: "Unit" },
  { key: "supplier", label: "Supplier" },
  { key: "cost", label: "Cost" },
];

export function MaterialsToolbarActions({
  totalCount = 0,
}: {
  totalCount?: number;
}) {
  const archiveFilter = useArchiveStore((state) => state.filters.materials);

  // Calculate counts (will be passed from page)
  const activeCount = totalCount; // TODO: Get actual counts from page
  const archivedCount = 0; // TODO: Get actual counts from page

  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ArchiveFilterSelect
            activeCount={activeCount}
            archivedCount={archivedCount}
            entity="materials"
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={MATERIALS_COLUMNS}
            entity="materials"
          />
        </div>
      }
      importExportDataType="materials"
      primaryAction={{
        href: "/dashboard/inventory/materials/new",
        label: "Add Material",
      }}
    />
  );
}
