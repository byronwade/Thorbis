/**
 * Service Ticket Toolbar Actions
 *
 * Toolbar actions for the service tickets page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - New ticket button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { ServiceTicketsFilterDropdown } from "@/components/work/service-tickets-filter-dropdown";

// Define hideable columns for service tickets
const SERVICE_TICKETS_COLUMNS = [
	{ key: "customer", label: "Customer" },
	{ key: "priority", label: "Priority" },
	{ key: "status", label: "Status" },
	{ key: "assigned_user", label: "Assigned To" },
	{ key: "created_at", label: "Created" },
];

type ServiceTicketToolbarActionsProps = {
	totalCount?: number;
	activeCount?: number;
	archivedCount?: number;
};

export function ServiceTicketToolbarActions({
	totalCount = 0,
	activeCount,
	archivedCount,
}: ServiceTicketToolbarActionsProps) {
	return (
		<BaseToolbarActions
			beforePrimaryAction={
				<div className="flex items-center gap-2">
					<ServiceTicketsFilterDropdown
						activeCount={activeCount}
						archivedCount={archivedCount}
						totalCount={totalCount}
					/>
					<ColumnVisibilityMenu columns={SERVICE_TICKETS_COLUMNS} entity="service_tickets" />
				</div>
			}
			importExportDataType="service-tickets"
			primaryAction={{
				href: "/dashboard/work/service-tickets/new",
				label: "New Ticket",
			}}
			viewSwitcherSection={undefined} // Kanban disabled
		/>
	);
}
