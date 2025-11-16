/**
 * CustomersToolbarActions Component
 *
 * Toolbar actions for the customers page
 * - Comprehensive filter dropdown (archive + type + status + name + email + phone)
 * - Column visibility toggle
 * - Add New Customer button
 * - Import/Export
 */

import { UserPlus } from "lucide-react";
import { CustomersFilterDropdown } from "@/components/customers/customers-filter-dropdown";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Critical columns (always visible - shown for reference)
const CUSTOMERS_CRITICAL_COLUMNS = [{ key: "status", label: "Status" }];

// Optional columns (can be hidden)
const CUSTOMERS_OPTIONAL_COLUMNS = [
	{ key: "contact", label: "Contact" },
	{ key: "address", label: "Address" },
	{ key: "service", label: "Service" },
];

type CustomersToolbarActionsProps = {
	totalCount?: number;
	activeCount?: number;
	archivedCount?: number;
};

export function CustomersToolbarActions({
	totalCount = 0,
	activeCount,
	archivedCount,
}: CustomersToolbarActionsProps) {
	return (
		<BaseToolbarActions
			beforePrimaryAction={
				<div className="flex items-center gap-2">
					<CustomersFilterDropdown
						activeCount={activeCount}
						archivedCount={archivedCount}
						totalCount={totalCount}
					/>
					<ColumnVisibilityMenu
						columns={CUSTOMERS_OPTIONAL_COLUMNS}
						criticalColumns={CUSTOMERS_CRITICAL_COLUMNS}
						entity="customers"
					/>
				</div>
			}
			importExportDataType="customers"
			primaryAction={{
				href: "/dashboard/customers/new",
				label: "Add Customer",
				icon: <UserPlus className="mr-2 size-4" />,
			}}
			viewSwitcherSection={undefined} // Kanban disabled
		/>
	);
}
