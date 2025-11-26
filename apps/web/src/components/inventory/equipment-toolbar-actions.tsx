"use client";

/**
 * Equipment Toolbar Actions - Client Component
 *
 * Toolbar actions for the equipment page
 * - Archive filter
 * - Column visibility toggle
 * - Add Equipment button
 * - Import/Export
 */

import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { useArchiveStore } from "@/lib/stores/archive-store";

// Define hideable columns for equipment
const EQUIPMENT_COLUMNS = [
	{ key: "assigned_to", label: "Assigned To" },
	{ key: "location", label: "Location" },
	{ key: "manufacturer", label: "Manufacturer" },
	{ key: "model", label: "Model" },
	{ key: "last_service", label: "Last Service" },
	{ key: "status", label: "Status" },
];

export function EquipmentToolbarActions({
	totalCount = 0,
}: {
	totalCount?: number;
}) {
	const _archiveFilter = useArchiveStore((state) => state.filters.equipment);

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
						entity="equipment"
						totalCount={totalCount}
					/>
					<ColumnVisibilityMenu
						columns={EQUIPMENT_COLUMNS}
						entity="equipment"
					/>
				</div>
			}
			importExportDataType="equipment"
			primaryAction={{
				href: "/dashboard/inventory/equipment/new",
				label: "Add Equipment",
			}}
		/>
	);
}
