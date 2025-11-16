/**
 * PaymentsToolbarActions Component
 *
 * Toolbar actions for the payments page
 * - Comprehensive filter dropdown (archive + status + method + amount + customer + reference#)
 * - Column visibility toggle
 * - Record Payment button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { PaymentsFilterDropdown } from "@/components/work/payments-filter-dropdown";

// Critical columns (always visible - shown for reference)
const PAYMENTS_CRITICAL_COLUMNS = [
	{ key: "customer", label: "Customer" },
	{ key: "amount", label: "Amount" },
	{ key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const PAYMENTS_OPTIONAL_COLUMNS = [
	{ key: "payment_method", label: "Method" },
	{ key: "processed_at", label: "Date" },
];

type PaymentsToolbarActionsProps = {
	totalCount?: number;
	activeCount?: number;
	archivedCount?: number;
};

export function PaymentsToolbarActions({ totalCount = 0, activeCount, archivedCount }: PaymentsToolbarActionsProps) {
	return (
		<BaseToolbarActions
			beforePrimaryAction={
				<div className="flex items-center gap-2">
					<PaymentsFilterDropdown activeCount={activeCount} archivedCount={archivedCount} totalCount={totalCount} />
					<ColumnVisibilityMenu
						columns={PAYMENTS_OPTIONAL_COLUMNS}
						criticalColumns={PAYMENTS_CRITICAL_COLUMNS}
						entity="payments"
					/>
				</div>
			}
			importExportDataType="payments"
			primaryAction={{
				href: "/dashboard/work/payments/new",
				label: "Record Payment",
			}}
			viewSwitcherSection={undefined} // Kanban disabled
		/>
	);
}
