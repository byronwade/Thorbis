"use client";

/**
 * Maintenance Plan Toolbar Actions - Client Component
 *
 * Toolbar actions for the maintenance plans page
 * - Archive filter
 * - Column visibility toggle
 * - New Plan button
 * - Import/Export
 */

import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { useArchiveStore } from "@/lib/stores/archive-store";

// Define hideable columns for maintenance plans
const MAINTENANCE_PLANS_COLUMNS = [
	{ key: "customer", label: "Customer" },
	{ key: "equipment", label: "Equipment" },
	{ key: "frequency", label: "Frequency" },
	{ key: "next_service", label: "Next Service" },
	{ key: "status", label: "Status" },
];

export function MaintenancePlanToolbarActions({ totalCount = 0 }: { totalCount?: number }) {
	const _archiveFilter = useArchiveStore((state) => state.filters.maintenance_plans);

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
						entity="maintenance_plans"
						totalCount={totalCount}
					/>
					<ColumnVisibilityMenu columns={MAINTENANCE_PLANS_COLUMNS} entity="maintenance_plans" />
				</div>
			}
			importExportDataType="maintenance-plans"
			primaryAction={{
				href: "/dashboard/work/maintenance-plans/new",
				label: "New Plan",
			}}
		/>
	);
}
