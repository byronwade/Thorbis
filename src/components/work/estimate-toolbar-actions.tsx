/**
 * Estimate Toolbar Actions
 *
 * Toolbar actions for the estimates page
 * - Comprehensive filter dropdown (archive + status + amount + customer + estimate#)
 * - Column visibility toggle
 * - New Estimate button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { EstimatesFilterDropdown } from "@/components/work/estimates-filter-dropdown";

// Critical columns (always visible - shown for reference)
const ESTIMATES_CRITICAL_COLUMNS = [
	{ key: "customer", label: "Customer" },
	{ key: "amount", label: "Amount" },
	{ key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const ESTIMATES_OPTIONAL_COLUMNS = [
	{ key: "date", label: "Date" },
	{ key: "validUntil", label: "Valid Until" },
];

type EstimateToolbarActionsProps = {
	totalCount?: number;
	activeCount?: number;
	archivedCount?: number;
};

export function EstimateToolbarActions({ totalCount = 0, activeCount, archivedCount }: EstimateToolbarActionsProps) {
	return (
		<BaseToolbarActions
			beforePrimaryAction={
				<div className="flex items-center gap-2">
					<EstimatesFilterDropdown activeCount={activeCount} archivedCount={archivedCount} totalCount={totalCount} />
					<ColumnVisibilityMenu
						columns={ESTIMATES_OPTIONAL_COLUMNS}
						criticalColumns={ESTIMATES_CRITICAL_COLUMNS}
						entity="estimates"
					/>
				</div>
			}
			importExportDataType="estimates"
			primaryAction={{
				href: "/dashboard/work/estimates/new",
				label: "New Estimate",
			}}
			viewSwitcherSection={undefined} // Kanban disabled
		/>
	);
}
