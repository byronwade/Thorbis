/**
 * Table Presets - Common Configurations
 *
 * Pre-configured table setups for common use cases.
 * Use these presets to quickly create tables with best-practice defaults.
 *
 * @example
 * import { TablePresets } from "@/lib/datatable/table-presets";
 *
 * <FullWidthDataTable
 *   {...TablePresets.fullList({
 *     entity: "customers",
 *     enableSelection: true
 *   })}
 *   data={customers}
 *   columns={columns}
 *   getItemId={(c) => c.id}
 * />
 */

import type { FullWidthDataTableProps } from "@/components/ui/full-width-datatable";

/**
 * Configuration options for table presets
 */
export type TablePresetOptions = {
	/** Entity type for column visibility persistence */
	entity?: string;
	/** Enable row selection with checkboxes */
	enableSelection?: boolean;
	/** Show refresh button */
	showRefresh?: boolean;
	/** Enable search functionality */
	enableSearch?: boolean;
	/** Search placeholder text */
	searchPlaceholder?: string;
	/** Enable server-side pagination */
	serverPagination?: boolean;
	/** Enable server-side search */
	serverSearch?: boolean;
	/** Custom items per page (overrides variant default) */
	itemsPerPage?: number;
	/** Show pagination controls */
	showPagination?: boolean;
	/** Remove toolbar padding */
	noPadding?: boolean;
};

/**
 * Table Presets for common use cases
 */
export const TablePresets = {
	/**
	 * Full List Table - Main Pages
	 *
	 * Use for primary list pages (Customers, Jobs, Invoices, etc.)
	 * - 50 items per page
	 * - Full features (search, pagination, selection, bulk actions)
	 * - Standard spacing and padding
	 *
	 * @example
	 * <FullWidthDataTable
	 *   {...TablePresets.fullList({ entity: "customers" })}
	 *   data={customers}
	 *   columns={columns}
	 *   getItemId={(c) => c.id}
	 *   bulkActions={bulkActions}
	 * />
	 */
	fullList: <T>(
		options: TablePresetOptions = {},
	): Partial<FullWidthDataTableProps<T>> => ({
		variant: "full",
		enableSelection: options.enableSelection ?? true,
		showRefresh: options.showRefresh ?? false,
		showPagination: options.showPagination ?? true,
		itemsPerPage: options.itemsPerPage ?? 50,
		serverPagination: options.serverPagination ?? false,
		serverSearch: options.serverSearch ?? false,
		searchPlaceholder: options.searchPlaceholder ?? "Search...",
		entity: options.entity,
		noPadding: options.noPadding ?? false,
	}),

	/**
	 * Compact Table - Detail Views
	 *
	 * Use for detail view tables (Job payments, Customer invoices, etc.)
	 * - 20 items per page
	 * - Streamlined features
	 * - Reduced spacing
	 *
	 * @example
	 * <FullWidthDataTable
	 *   {...TablePresets.compact()}
	 *   data={jobPayments}
	 *   columns={columns}
	 *   getItemId={(p) => p.id}
	 * />
	 */
	compact: <T>(
		options: TablePresetOptions = {},
	): Partial<FullWidthDataTableProps<T>> => ({
		variant: "compact",
		enableSelection: options.enableSelection ?? false,
		showRefresh: options.showRefresh ?? false,
		showPagination: options.showPagination ?? true,
		itemsPerPage: options.itemsPerPage ?? 20,
		serverPagination: options.serverPagination ?? false,
		serverSearch: options.serverSearch ?? false,
		searchPlaceholder: options.searchPlaceholder ?? "Search...",
		entity: options.entity,
		noPadding: options.noPadding ?? false,
	}),

	/**
	 * Nested Table - Deep Nesting
	 *
	 * Use for deeply nested tables (Invoice line items, etc.)
	 * - 10 items per page
	 * - Minimal features
	 * - Tight spacing
	 * - No pagination by default (small datasets)
	 * - No search by default
	 *
	 * @example
	 * <FullWidthDataTable
	 *   {...TablePresets.nested()}
	 *   data={invoiceLineItems}
	 *   columns={columns}
	 *   getItemId={(i) => i.id}
	 * />
	 */
	nested: <T>(
		options: TablePresetOptions = {},
	): Partial<FullWidthDataTableProps<T>> => ({
		variant: "nested",
		enableSelection: options.enableSelection ?? false,
		showRefresh: options.showRefresh ?? false,
		showPagination: options.showPagination ?? false,
		itemsPerPage: options.itemsPerPage ?? 10,
		serverPagination: options.serverPagination ?? false,
		serverSearch: options.serverSearch ?? false,
		entity: options.entity,
		noPadding: options.noPadding ?? true,
	}),

	/**
	 * Server-Paginated Table
	 *
	 * Use for server-side pagination and search
	 * - Server handles pagination
	 * - Server handles search
	 * - Pass totalCount and currentPage from server
	 *
	 * @example
	 * <FullWidthDataTable
	 *   {...TablePresets.serverPaginated({ entity: "jobs" })}
	 *   data={jobs}
	 *   columns={columns}
	 *   getItemId={(j) => j.id}
	 *   totalCount={totalCount}
	 *   currentPageFromServer={currentPage}
	 *   initialSearchQuery={searchQuery}
	 * />
	 */
	serverPaginated: <T>(
		options: TablePresetOptions = {},
	): Partial<FullWidthDataTableProps<T>> => ({
		variant: "full",
		enableSelection: options.enableSelection ?? true,
		showRefresh: options.showRefresh ?? false,
		showPagination: options.showPagination ?? true,
		itemsPerPage: options.itemsPerPage ?? 50,
		serverPagination: true,
		serverSearch: true,
		searchPlaceholder: options.searchPlaceholder ?? "Search...",
		entity: options.entity,
		noPadding: options.noPadding ?? false,
	}),

	/**
	 * Simple Read-Only Table
	 *
	 * Use for simple data display (no interactions)
	 * - No selection
	 * - No bulk actions
	 * - No refresh
	 * - Pagination only if needed
	 *
	 * @example
	 * <FullWidthDataTable
	 *   {...TablePresets.readOnly()}
	 *   data={reportData}
	 *   columns={columns}
	 *   getItemId={(d) => d.id}
	 * />
	 */
	readOnly: <T>(
		options: TablePresetOptions = {},
	): Partial<FullWidthDataTableProps<T>> => ({
		variant: options.itemsPerPage ? "full" : "compact",
		enableSelection: false,
		showRefresh: false,
		showPagination:
			options.showPagination ?? (options.itemsPerPage ? true : false),
		itemsPerPage: options.itemsPerPage ?? 20,
		serverPagination: options.serverPagination ?? false,
		serverSearch: false,
		entity: options.entity,
		noPadding: options.noPadding ?? false,
	}),

	/**
	 * Modal/Dialog Table
	 *
	 * Use for tables inside modals or dialogs
	 * - Compact variant
	 * - No padding
	 * - Limited items
	 *
	 * @example
	 * <FullWidthDataTable
	 *   {...TablePresets.modal()}
	 *   data={selectableItems}
	 *   columns={columns}
	 *   getItemId={(i) => i.id}
	 * />
	 */
	modal: <T>(
		options: TablePresetOptions = {},
	): Partial<FullWidthDataTableProps<T>> => ({
		variant: "compact",
		enableSelection: options.enableSelection ?? true,
		showRefresh: false,
		showPagination: options.showPagination ?? false,
		itemsPerPage: options.itemsPerPage ?? 10,
		serverPagination: false,
		serverSearch: false,
		searchPlaceholder: options.searchPlaceholder ?? "Search...",
		noPadding: true,
	}),
};

/**
 * Helper to merge preset with custom props
 *
 * @example
 * const props = mergePreset(
 *   TablePresets.fullList({ entity: "customers" }),
 *   { onRowClick: handleCustomerClick }
 * );
 */
function mergePreset<T>(
	preset: Partial<FullWidthDataTableProps<T>>,
	customProps: Partial<FullWidthDataTableProps<T>>,
): Partial<FullWidthDataTableProps<T>> {
	return {
		...preset,
		...customProps,
	};
}
