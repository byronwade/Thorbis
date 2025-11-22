"use client";

/**
 * Common Column Definitions - Reusable Patterns
 *
 * Shared column definitions and hooks to reduce duplication across tables.
 * Use these for consistent rendering of common data types (dates, status, actions, etc.)
 *
 * @example
 * import { useDateColumn, useActionsColumn } from "@/lib/datatable/common-columns";
 *
 * const columns: ColumnDef<Customer>[] = [
 *   { key: "name", header: "Name", render: (c) => c.name },
 *   useDateColumn<Customer>("created_at", "Created", (c) => c.created_at),
 *   useActionsColumn<Customer>((c) => `/customers/${c.id}`)
 * ];
 */

import { Archive, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ColumnDef } from "@/components/ui/full-width-datatable";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import {
	CustomerStatusBadge,
	JobStatusBadge,
	PriorityBadge,
} from "@/components/ui/status-badge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";

/**
 * Hook: Date Column
 *
 * Creates a column for date fields with consistent formatting
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract date value from item
 * @param options - Optional configuration
 *
 * @example
 * useDateColumn<Job>("scheduled_date", "Scheduled", (job) => job.scheduled_date)
 */
function useDateColumn<T>(
	key: string,
	header: string,
	getValue: (item: T) => string | Date | null | undefined,
	options: {
		/** Show time in addition to date */
		includeTime?: boolean;
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "w-32",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? true,
		render: (item) => {
			const value = getValue(item);
			if (!value)
				return <span className="text-muted-foreground text-xs">—</span>;

			const formatted = options.includeTime
				? formatDateTime(value)
				: formatDate(value);

			return <span className="text-xs tabular-nums">{formatted}</span>;
		},
		sortFn: (a, b) => {
			const aVal = getValue(a);
			const bVal = getValue(b);
			if (!aVal) return 1;
			if (!bVal) return -1;
			return new Date(aVal).getTime() - new Date(bVal).getTime();
		},
	};
}

/**
 * Hook: Currency Column
 *
 * Creates a column for currency fields with consistent formatting
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract currency value from item
 * @param options - Optional configuration
 *
 * @example
 * useCurrencyColumn<Invoice>("total", "Total", (invoice) => invoice.total)
 */
function useCurrencyColumn<T>(
	key: string,
	header: string,
	getValue: (item: T) => number | null | undefined,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
		/** Text alignment */
		align?: "left" | "center" | "right";
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "w-28",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? false,
		align: options.align || "right",
		render: (item) => {
			const value = getValue(item);
			if (value === null || value === undefined) {
				return <span className="text-muted-foreground text-xs">—</span>;
			}

			return (
				<span className="text-xs font-medium tabular-nums">
					{formatCurrency(value)}
				</span>
			);
		},
		sortFn: (a, b) => {
			const aVal = getValue(a) ?? 0;
			const bVal = getValue(b) ?? 0;
			return aVal - bVal;
		},
	};
}

/**
 * Hook: Job Status Column
 *
 * Creates a column for job status with badge rendering
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract status from item
 * @param options - Optional configuration
 *
 * @example
 * useJobStatusColumn<Job>("status", "Status", (job) => job.status)
 */
function useJobStatusColumn<T>(
	key: string,
	header: string,
	getValue: (item: T) => string | null | undefined,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "w-32",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? false,
		render: (item) => {
			const value = getValue(item);
			if (!value)
				return <span className="text-muted-foreground text-xs">—</span>;

			return <JobStatusBadge status={value} />;
		},
	};
}

/**
 * Hook: Customer Status Column
 *
 * Creates a column for customer status with badge rendering
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract status from item
 * @param options - Optional configuration
 *
 * @example
 * useCustomerStatusColumn<Customer>("status", "Status", (customer) => customer.status)
 */
export function useCustomerStatusColumn<T>(
	key: string,
	header: string,
	getValue: (item: T) => "active" | "inactive" | "prospect" | null | undefined,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "w-28",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? false,
		render: (item) => {
			const value = getValue(item);
			if (!value)
				return <span className="text-muted-foreground text-xs">—</span>;

			return <CustomerStatusBadge status={value} />;
		},
	};
}

/**
 * Hook: Priority Column
 *
 * Creates a column for priority with badge rendering
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract priority from item
 * @param options - Optional configuration
 *
 * @example
 * usePriorityColumn<Job>("priority", "Priority", (job) => job.priority)
 */
function usePriorityColumn<T>(
	key: string,
	header: string,
	getValue: (
		item: T,
	) => "low" | "medium" | "high" | "urgent" | null | undefined,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "w-24",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? true,
		render: (item) => {
			const value = getValue(item);
			if (!value)
				return <span className="text-muted-foreground text-xs">—</span>;

			return <PriorityBadge priority={value} />;
		},
		sortFn: (a, b) => {
			const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
			const aVal = getValue(a);
			const bVal = getValue(b);
			const aPriority = aVal ? priorityOrder[aVal] : 0;
			const bPriority = bVal ? priorityOrder[bVal] : 0;
			return aPriority - bPriority;
		},
	};
}

/**
 * Hook: Actions Column
 *
 * Creates a column for row actions (view, edit, archive, delete)
 *
 * @param getViewHref - Function to get view link
 * @param getEditHref - Function to get edit link (optional)
 * @param onArchive - Archive handler (optional)
 * @param onDelete - Delete handler (optional)
 * @param options - Optional configuration
 *
 * @example
 * useActionsColumn<Customer>(
 *   (customer) => `/customers/${customer.id}`,
 *   (customer) => `/customers/${customer.id}/edit`,
 *   handleArchive,
 *   handleDelete
 * )
 */
function useActionsColumn<T>(
	getViewHref: (item: T) => string,
	getEditHref?: (item: T) => string,
	onArchive?: (item: T) => void,
	onDelete?: (item: T) => void,
	options: {
		/** Column width */
		width?: string;
		/** Hide on mobile */
		hideOnMobile?: boolean;
		/** Additional custom actions */
		customActions?: Array<{
			label: string;
			icon: React.ReactNode;
			onClick: (item: T) => void;
		}>;
	} = {},
): ColumnDef<T> {
	return {
		key: "actions",
		header: "",
		width: options.width || "w-10",
		hideOnMobile: options.hideOnMobile ?? false,
		align: "right",
		render: (item) => {
			const actions = [
				{
					label: "View",
					icon: <Eye className="h-4 w-4" />,
					href: getViewHref(item),
				},
			];

			if (getEditHref) {
				actions.push({
					label: "Edit",
					icon: <Edit className="h-4 w-4" />,
					href: getEditHref(item),
				});
			}

			if (onArchive) {
				actions.push({
					label: "Archive",
					icon: <Archive className="h-4 w-4" />,
					onClick: () => onArchive(item),
				});
			}

			if (onDelete) {
				actions.push({
					label: "Delete",
					icon: <Trash2 className="h-4 w-4" />,
					onClick: () => onDelete(item),
					variant: "destructive" as const,
				});
			}

			// Add custom actions
			if (options.customActions) {
				for (const customAction of options.customActions) {
					actions.push({
						label: customAction.label,
						icon: customAction.icon,
						onClick: () => customAction.onClick(item),
					});
				}
			}

			return <RowActionsDropdown actions={actions} />;
		},
	};
}

/**
 * Hook: Link Column
 *
 * Creates a column that links to a detail page
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getLabel - Function to get link label
 * @param getHref - Function to get link href
 * @param options - Optional configuration
 *
 * @example
 * useLinkColumn<Customer>(
 *   "name",
 *   "Customer",
 *   (customer) => customer.name,
 *   (customer) => `/customers/${customer.id}`
 * )
 */
function useLinkColumn<T>(
	key: string,
	header: string,
	getLabel: (item: T) => string | React.ReactNode,
	getHref: (item: T) => string,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
		/** Show icon */
		icon?: React.ReactNode;
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "flex-1",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? false,
		render: (item) => {
			const label = getLabel(item);
			const href = getHref(item);

			return (
				<Link
					className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
					href={href}
				>
					{options.icon}
					{typeof label === "string" ? (
						<span className="truncate">{label}</span>
					) : (
						label
					)}
				</Link>
			);
		},
	};
}

/**
 * Hook: Text Column
 *
 * Creates a simple text column with consistent styling
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract value from item
 * @param options - Optional configuration
 *
 * @example
 * useTextColumn<Customer>("email", "Email", (customer) => customer.email)
 */
function useTextColumn<T>(
	key: string,
	header: string,
	getValue: (item: T) => string | null | undefined,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
		/** Text alignment */
		align?: "left" | "center" | "right";
		/** Truncate text */
		truncate?: boolean;
		/** Font weight */
		fontWeight?: "normal" | "medium" | "semibold" | "bold";
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "flex-1",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? false,
		align: options.align || "left",
		render: (item) => {
			const value = getValue(item);
			if (!value)
				return <span className="text-muted-foreground text-xs">—</span>;

			const fontWeightClass = options.fontWeight
				? {
						normal: "font-normal",
						medium: "font-medium",
						semibold: "font-semibold",
						bold: "font-bold",
					}[options.fontWeight]
				: "";

			return (
				<span
					className={`text-xs ${options.truncate ? "truncate" : ""} ${fontWeightClass}`}
				>
					{value}
				</span>
			);
		},
	};
}

/**
 * Hook: Number Column
 *
 * Creates a column for numeric values with consistent formatting
 *
 * @param key - Column key (field name)
 * @param header - Column header text
 * @param getValue - Function to extract number from item
 * @param options - Optional configuration
 *
 * @example
 * useNumberColumn<Invoice>("invoice_number", "#", (invoice) => invoice.invoice_number)
 */
function useNumberColumn<T>(
	key: string,
	header: string,
	getValue: (item: T) => number | null | undefined,
	options: {
		/** Column width */
		width?: string;
		/** Sortable */
		sortable?: boolean;
		/** Hide on mobile */
		hideOnMobile?: boolean;
		/** Text alignment */
		align?: "left" | "center" | "right";
		/** Number format (e.g., "#,##0") */
		format?: "decimal" | "integer" | "percent";
		/** Prefix (e.g., "#") */
		prefix?: string;
		/** Suffix (e.g., "%") */
		suffix?: string;
	} = {},
): ColumnDef<T> {
	return {
		key,
		header,
		width: options.width || "w-24",
		sortable: options.sortable ?? true,
		hideOnMobile: options.hideOnMobile ?? false,
		align: options.align || "right",
		render: (item) => {
			const value = getValue(item);
			if (value === null || value === undefined) {
				return <span className="text-muted-foreground text-xs">—</span>;
			}

			let formatted = "";
			if (options.format === "decimal") {
				formatted = value.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				});
			} else if (options.format === "percent") {
				formatted = `${value.toFixed(1)}%`;
			} else {
				formatted = value.toLocaleString();
			}

			const display = `${options.prefix || ""}${formatted}${options.suffix || ""}`;

			return (
				<span className="text-xs font-medium tabular-nums">{display}</span>
			);
		},
		sortFn: (a, b) => {
			const aVal = getValue(a) ?? 0;
			const bVal = getValue(b) ?? 0;
			return aVal - bVal;
		},
	};
}
