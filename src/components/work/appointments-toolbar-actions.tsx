/**
 * AppointmentsToolbarActions Component
 *
 * Toolbar actions for the appointments page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - New Appointment button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { AppointmentsFilterDropdown } from "@/components/work/appointments-filter-dropdown";

// Critical columns (always visible - shown for reference)
const APPOINTMENTS_CRITICAL_COLUMNS = [
	{ key: "start_time", label: "Date & Time" },
	{ key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const APPOINTMENTS_OPTIONAL_COLUMNS = [
	{ key: "customer", label: "Customer" },
	{ key: "assigned_user", label: "Assigned To" },
];

type AppointmentsToolbarActionsProps = {
	totalCount?: number;
	activeCount?: number;
	archivedCount?: number;
};

export function AppointmentsToolbarActions({
	totalCount = 0,
	activeCount,
	archivedCount,
}: AppointmentsToolbarActionsProps) {
	return (
		<BaseToolbarActions
			beforePrimaryAction={
				<div className="flex items-center gap-2">
					<AppointmentsFilterDropdown activeCount={activeCount} archivedCount={archivedCount} totalCount={totalCount} />
					<ColumnVisibilityMenu
						columns={APPOINTMENTS_OPTIONAL_COLUMNS}
						criticalColumns={APPOINTMENTS_CRITICAL_COLUMNS}
						entity="appointments"
					/>
				</div>
			}
			importExportDataType="appointments"
			primaryAction={{
				href: "/dashboard/work/appointments/new",
				label: "New Appointment",
			}}
			viewSwitcherSection={undefined} // Kanban disabled
		/>
	);
}
