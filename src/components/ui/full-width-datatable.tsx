"use client";

/**
 * FullWidthDataTable - Universal Table Component
 * Enterprise-grade table with design system variants for consistent UX
 *
 * DESIGN SYSTEM VARIANTS:
 * - full: Main list pages (50 items/page, full features, standard padding)
 * - compact: Detail view tables (20 items/page, streamlined, reduced padding)
 * - nested: Deeply nested tables (10 items/page, minimal, tight spacing)
 *
 * FEATURES:
 * - Full-width responsive layout
 * - Row selection with checkboxes
 * - Bulk actions toolbar
 * - Search filtering (client-side or server-side)
 * - Pagination with server-side support
 * - Virtual scrolling for 1,000+ rows (auto-detected)
 * - Unread/status highlighting
 * - Hover effects and transitions
 * - Custom column rendering
 * - Column reordering (drag-and-drop)
 * - Column visibility toggling
 * - Sortable columns
 * - Archive status support
 *
 * PERFORMANCE:
 * - Automatically uses virtualization for datasets > 1000 rows
 * - React.cache() compatible for query deduplication
 * - Optimized re-renders with Zustand state management
 * - 60fps scrolling in virtual mode
 *
 * DESIGN SYSTEM:
 * - Consistent spacing, colors, and typography across variants
 * - Unified row height, cell padding, and gap sizes
 * - Standardized hover states and selection highlighting
 * - Accessibility-first design (ARIA labels, keyboard navigation)
 *
 * @example Full variant (main lists)
 * <FullWidthDataTable
 *   variant="full"
 *   data={customers}
 *   columns={columns}
 *   getItemId={(c) => c.id}
 *   entity="customers"
 * />
 *
 * @example Compact variant (detail views)
 * <FullWidthDataTable
 *   variant="compact"
 *   data={jobPayments}
 *   columns={columns}
 *   getItemId={(p) => p.id}
 * />
 *
 * @example Nested variant (deeply nested)
 * <FullWidthDataTable
 *   variant="nested"
 *   data={invoiceLineItems}
 *   columns={columns}
 *   getItemId={(i) => i.id}
 *   showPagination={false}
 * />
 */

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	horizontalListSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
	Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	getColumnWidthClass,
	renderCustomColumn,
} from "@/lib/datatable/custom-column-renderer";
import { useCustomColumnsStore } from "@/lib/stores/custom-columns-store";
import { useDataTableColumnsStore } from "@/lib/stores/datatable-columns-store";
import { cn } from "@/lib/utils";

/**
 * Table display variants for different use cases
 * - full: Full-featured table for main list pages (default)
 * - compact: Streamlined table for detail views and nested tables
 * - nested: Extra compact for deeply nested views (minimal padding)
 */
export type TableVariant = "full" | "compact" | "nested";

/**
 * Column definition for table display
 */
export type ColumnDef<T> = {
	/** Unique identifier for the column */
	key: string;
	/** Column header text */
	header: string;
	/** Custom render function for cell content */
	render: (item: T) => React.ReactNode;
	/** Column width class (e.g., "w-48", "flex-1", "w-32") */
	width?: string;
	/** Whether the column should shrink */
	shrink?: boolean;
	/** Text alignment */
	align?: "left" | "center" | "right";
	/** Hide column on mobile */
	hideOnMobile?: boolean;
	/** Enable sorting for this column (Excel-style click header) */
	sortable?: boolean;
	/** Custom sort function (default: string comparison) */
	sortFn?: (a: T, b: T) => number;
	/** Allow column to be hidden via Column Visibility Menu */
	hideable?: boolean;
};

export type BulkAction = {
	/** Action label */
	label: string;
	/** Action icon */
	icon: React.ReactNode;
	/** Action handler */
	onClick: (selectedIds: Set<string>) => void;
	/** Variant style */
	variant?: "default" | "destructive" | "outline" | "ghost";
};

// Sortable Column Header Component
function SortableColumnHeader<T>({
	column,
	isSorted,
	sortDirection,
	onSort,
	colIndex,
	totalColumns,
}: {
	column: ColumnDef<T>;
	isSorted: boolean;
	sortDirection: "asc" | "desc";
	onSort: (key: string) => void;
	colIndex: number;
	totalColumns: number;
}) {
	const [mouseDownPos, setMouseDownPos] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: column.key,
	});

	const widthClass = column.width || "flex-1";
	const shrinkClass = column.shrink ? "shrink-0" : "";
	const alignClass =
		column.align === "right"
			? "justify-end text-right"
			: column.align === "center"
				? "justify-center text-center"
				: "justify-start text-left";
	const hideClass = column.hideOnMobile ? "hidden md:flex" : "flex";
	const cellBorder =
		colIndex < totalColumns - 1 ? "border-r border-border/30" : "";

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	// Track mouse down position
	const handleMouseDown = (e: React.MouseEvent) => {
		setMouseDownPos({ x: e.clientX, y: e.clientY });
	};

	// Handle click for sorting - only if it was a click (not a drag)
	const handleClick = (e: React.MouseEvent) => {
		if (!(column.sortable && mouseDownPos)) {
			return;
		}

		// Calculate movement since mouse down
		const deltaX = Math.abs(e.clientX - mouseDownPos.x);
		const deltaY = Math.abs(e.clientY - mouseDownPos.y);

		// If movement was less than 5px, treat it as a click (not a drag)
		if (deltaX < 5 && deltaY < 5) {
			onSort(column.key);
		}

		setMouseDownPos(null);
	};

	return (
		<div
			className={`${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} group/header relative flex min-w-0 cursor-grab items-center gap-1.5 overflow-hidden px-2 ${isDragging ? "opacity-40" : "transition-all active:cursor-grabbing"}`}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<span className="font-medium">{column.header}</span>
			{column.sortable &&
				(isSorted ? (
					sortDirection === "asc" ? (
						<ArrowUp className="size-3 shrink-0" />
					) : (
						<ArrowDown className="size-3 shrink-0" />
					)
				) : (
					<ArrowUpDown className="size-3 shrink-0 opacity-40 transition-opacity group-hover/header:opacity-60" />
				))}
		</div>
	);
}

/**
 * Props for FullWidthDataTable component
 */
export type FullWidthDataTableProps<T> = {
	/** Array of data items to display */
	data: T[];
	/** Column definitions */
	columns: ColumnDef<T>[];
	/** Function to extract unique ID from item */
	getItemId: (item: T) => string;

	// === DESIGN SYSTEM ===
	/** Table display variant (full: main lists, compact: detail views, nested: deeply nested) */
	variant?: TableVariant;

	// === ROW HIGHLIGHTING ===
	/** Function to determine if row should be highlighted (e.g., unread) */
	isHighlighted?: (item: T) => boolean;
	/** Function to get highlight background class */
	getHighlightClass?: (item: T) => string;

	// === INTERACTIONS ===
	/** Handler when row is clicked */
	onRowClick?: (item: T) => void;
	/** Bulk actions to show when items are selected */
	bulkActions?: BulkAction[];
	/** Enable row selection */
	enableSelection?: boolean;

	// === SEARCH & FILTERING ===
	/** Search placeholder text */
	searchPlaceholder?: string;
	/** Function to filter items based on search query */
	searchFilter?: (item: T, query: string) => boolean;
	/** Initial search query from server (for server-side search) */
	initialSearchQuery?: string;
	/** Enable server-driven search (updates query string instead of client filtering) */
	serverSearch?: boolean;
	/** Query parameter name to use for server search */
	searchParamKey?: string;
	/** Debounce (ms) before triggering server search */
	searchDebounceMs?: number;

	// === EMPTY STATE ===
	/** Empty state message */
	emptyMessage?: string;
	/** Empty state icon */
	emptyIcon?: React.ReactNode;
	/** Empty state action button (e.g., "Add Job") */
	emptyAction?: React.ReactNode;

	// === REFRESH ===
	/** Show refresh button (default: false for automatic updates) */
	showRefresh?: boolean;
	/** Refresh handler */
	onRefresh?: () => void;

	// === PAGINATION ===
	/** Show pagination */
	showPagination?: boolean;
	/** Items per page (default 50 for full, 20 for compact, 10 for nested) */
	itemsPerPage?: number;
	/** Total count from server (for accurate pagination display with server-side pagination) */
	totalCount?: number;
	/** Current page (for server-side pagination, passed from URL params) */
	currentPageFromServer?: number;
	/** Data is already paginated on the server (skip client-side slicing) */
	serverPagination?: boolean;

	// === TOOLBAR ===
	/** Custom toolbar actions (rendered on right side) */
	toolbarActions?: React.ReactNode;
	/** Remove padding from toolbar (useful when embedded in accordions) */
	noPadding?: boolean;

	// === ROW CUSTOMIZATION ===
	/** Custom row className */
	getRowClassName?: (item: T) => string;

	// === VIRTUALIZATION ===
	/** Enable virtual scrolling (auto: true if data.length > 1000, false otherwise) */
	enableVirtualization?: boolean | "auto";
	/** Row height for virtualization (auto-calculated based on variant) */
	virtualRowHeight?: number;
	/** Overscan for virtualization (default: 5) */
	virtualOverscan?: number;

	// === COLUMN MANAGEMENT ===
	/** Entity type for column visibility persistence (e.g., "appointments", "jobs") */
	entity?: string;

	// === ARCHIVE SUPPORT ===
	/** Show archived items (default: true) */
	showArchived?: boolean;
	/** Function to determine if item is archived */
	isArchived?: (item: T) => boolean;
};

/**
 * Design system configuration for table variants
 */
const VARIANT_CONFIG = {
	full: {
		// Main list tables - full features
		itemsPerPage: 50,
		virtualRowHeight: 60,
		toolbarPadding: "px-4 py-2 sm:px-4",
		headerPadding: "px-4 py-2",
		rowPadding: "px-3 py-1.5 sm:px-4 sm:py-2",
		cellPadding: "px-2",
		headerTextSize: "text-xs",
		cellTextSize: "text-sm",
		headerBg: "bg-muted dark:bg-muted",
		rowBg: "bg-card",
		rowBgAlt: "bg-card/70",
		rowHover: "table-row-hover", // Use new utility with inset glow
		borderColor: "border-border-subtle", // Use subtle border color for hairlines
		gapSize: "gap-4 sm:gap-6",
		showPagination: true,
		showSearch: true,
	},
	compact: {
		// Detail view tables - streamlined
		itemsPerPage: 20,
		virtualRowHeight: 48,
		toolbarPadding: "px-4 py-3 sm:px-6",
		headerPadding: "px-3 py-1.5",
		rowPadding: "px-2 py-1 sm:px-3 sm:py-1.5",
		cellPadding: "px-1.5",
		headerTextSize: "text-[11px]",
		cellTextSize: "text-xs",
		headerBg: "bg-muted/80 dark:bg-muted/60",
		rowBg: "bg-background",
		rowBgAlt: "bg-muted/20 dark:bg-muted/10",
		rowHover: "table-row-hover", // Use new utility
		borderColor: "border-border-subtle", // Use subtle border
		gapSize: "gap-3 sm:gap-4",
		showPagination: true,
		showSearch: true,
	},
	nested: {
		// Deeply nested tables - minimal
		itemsPerPage: 10,
		virtualRowHeight: 40,
		toolbarPadding: "px-2 py-1",
		headerPadding: "px-2 py-1",
		rowPadding: "px-1.5 py-0.5 sm:px-2 sm:py-1",
		cellPadding: "px-1",
		headerTextSize: "text-[10px]",
		cellTextSize: "text-[11px]",
		headerBg: "bg-muted/60 dark:bg-muted/40",
		rowBg: "bg-background",
		rowBgAlt: "bg-muted/10 dark:bg-muted/5",
		rowHover: "table-row-hover", // Use new utility
		borderColor: "border-border-subtle", // Use subtle border
		gapSize: "gap-2 sm:gap-3",
		showPagination: false,
		showSearch: false,
	},
} as const;

export function FullWidthDataTable<T>({
	data = [] as T[],
	columns,
	getItemId,
	variant = "full",
	isHighlighted,
	getHighlightClass,
	onRowClick,
	bulkActions = [],
	searchPlaceholder = "Search...",
	searchFilter,
	emptyMessage = "No items found",
	emptyIcon,
	emptyAction,
	showRefresh = false,
	onRefresh,
	showPagination,
	itemsPerPage,
	totalCount,
	currentPageFromServer = 1,
	serverPagination = false,
	toolbarActions,
	enableSelection = true,
	getRowClassName,
	enableVirtualization = "auto",
	virtualRowHeight,
	virtualOverscan = 5,
	entity,
	showArchived = true,
	isArchived,
	initialSearchQuery = "",
	serverSearch = false,
	searchParamKey = "search",
	searchDebounceMs = 300,
	noPadding = false,
	onSelectionChange,
}: FullWidthDataTableProps<T> & {
	onSelectionChange?: (selectedIds: Set<string>) => void;
}) {
	// Get variant configuration
	const config = VARIANT_CONFIG[variant];

	// Apply variant defaults if not explicitly provided
	const effectiveItemsPerPage = itemsPerPage ?? config.itemsPerPage;
	const effectiveVirtualRowHeight = virtualRowHeight ?? config.virtualRowHeight;
	const effectiveShowPagination = showPagination ?? config.showPagination;
	const effectiveShowSearch =
		(searchFilter || serverSearch) && config.showSearch;
	const router = useRouter();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? "");
	// Use page from server (no hydration mismatch)
	const [currentPage, setCurrentPage] = useState(currentPageFromServer);
	const lastServerSearchRef = useRef(initialSearchQuery ?? "");
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [toolbarHeight, setToolbarHeight] = useState(50); // Default fallback
	const lastSelectedIndexRef = useRef<number | null>(null); // Track last clicked index for Shift+Click

	// Client-only state to prevent hydration mismatch
	const [isClient, setIsClient] = useState(false);

	// Sorting state
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	// Column visibility and ordering from Zustand store
	const _isColumnVisible = useDataTableColumnsStore(
		(state) => state.isColumnVisible,
	);
	const getColumnOrder = useDataTableColumnsStore(
		(state) => state.getColumnOrder,
	);
	const setColumnOrder = useDataTableColumnsStore(
		(state) => state.setColumnOrder,
	);
	const initializeEntity = useDataTableColumnsStore(
		(state) => state.initializeEntity,
	);

	// Subscribe to column visibility state to trigger re-renders when columns are toggled
	const columnVisibilityState = useDataTableColumnsStore((state) =>
		entity ? state.entities[entity] : null,
	);

	// Subscribe to column order state to trigger re-renders when columns are reordered
	const columnOrderState = useDataTableColumnsStore((state) =>
		entity ? state.columnOrder[entity] : null,
	);

	// Set client flag after mount to prevent hydration issues
	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		setCurrentPage(currentPageFromServer);
	}, [currentPageFromServer]);

	useEffect(() => {
		const normalized = initialSearchQuery ?? "";
		setSearchQuery(normalized);
		lastServerSearchRef.current = normalized;
	}, [initialSearchQuery]);

	// Custom columns from Zustand store - use stable selector
	const allCustomColumns = useCustomColumnsStore((state) => state.columns);
	const customColumns = useMemo(
		() => (entity ? allCustomColumns[entity] || [] : []),
		[allCustomColumns, entity],
	);

	// Measure toolbar height dynamically
	useEffect(() => {
		const measureToolbar = () => {
			if (toolbarRef.current) {
				const height = toolbarRef.current.offsetHeight;
				setToolbarHeight(height);
			}
		};

		// Measure on mount and when window resizes
		measureToolbar();
		window.addEventListener("resize", measureToolbar);

		// Small delay to ensure toolbar is fully rendered
		const timer = setTimeout(measureToolbar, 100);

		return () => {
			window.removeEventListener("resize", measureToolbar);
			clearTimeout(timer);
		};
	}, []); // Re-measure when toolbar content changes

	useEffect(() => {
		if (!serverSearch) {
			return;
		}
		if (searchQuery === lastServerSearchRef.current) {
			return;
		}
		const handler = setTimeout(() => {
			if (typeof window === "undefined") {
				return;
			}
			const params = new URLSearchParams(window.location.search);
			if (searchQuery) {
				params.set(searchParamKey, searchQuery);
			} else {
				params.delete(searchParamKey);
			}
			params.set("page", "1");
			const queryString = params.toString();
			router.push(queryString ? `?${queryString}` : "?", { scroll: false });
			lastServerSearchRef.current = searchQuery;
		}, searchDebounceMs);
		return () => clearTimeout(handler);
	}, [searchQuery, serverSearch, searchParamKey, router, searchDebounceMs]);

	// Merge predefined columns with custom columns
	const allColumns = useMemo(() => {
		if (!entity) {
			return columns;
		}

		// Convert custom columns to ColumnDef format
		const customColumnDefs: ColumnDef<T>[] = customColumns.map((col) => ({
			key: col.id,
			header: col.label,
			width: getColumnWidthClass(col.width),
			sortable: col.sortable,
			hideable: true, // Custom columns are always hideable
			render: (item: T) => renderCustomColumn(item, col.fieldPath, col.format),
		}));

		return [...columns, ...customColumnDefs];
	}, [columns, customColumns, entity]);

	// Initialize entity with columns on mount (client-side only)
	useEffect(() => {
		if (isClient && entity && allColumns.length > 0) {
			initializeEntity(
				entity,
				allColumns.map((col) => col.key),
			);
		}
		// ESLint disable: initializeEntity is a Zustand action with stable reference
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isClient, entity, allColumns]);

	// Get ordered columns based on stored order (only on client to prevent hydration issues)
	const orderedColumns = useMemo(() => {
		// Always use default order on server or when entity is not provided
		if (!(isClient && entity)) {
			return allColumns;
		}

		const storedOrder = columnOrderState || getColumnOrder(entity);
		if (!storedOrder || storedOrder.length === 0) {
			return allColumns;
		}

		// Create a map of columns by key for quick lookup
		const columnMap = new Map(allColumns.map((col) => [col.key, col]));

		// Order columns based on stored order, add any new columns at the end
		const ordered: ColumnDef<T>[] = [];
		const usedKeys = new Set<string>();

		// Add columns in stored order
		for (const key of storedOrder) {
			const column = columnMap.get(key);
			if (column) {
				ordered.push(column);
				usedKeys.add(key);
			}
		}

		// Add any new columns that weren't in the stored order
		for (const column of allColumns) {
			if (!usedKeys.has(column.key)) {
				ordered.push(column);
			}
		}

		return ordered;
	}, [isClient, allColumns, entity, columnOrderState, getColumnOrder]);

	// Filter columns based on visibility (only if entity is provided)
	const visibleColumns = useMemo(() => {
		if (!entity) {
			return orderedColumns;
		}

		// Read visibility directly from the state object for better reactivity
		const filtered = orderedColumns.filter((col) => {
			if (!col.hideable) {
				return true;
			}
			const visible = columnVisibilityState?.[col.key] ?? true;
			return visible;
		});

		// Ensure at least one column has flex-1 for intelligent spacing
		// If no columns have flex-1, assign it to the first column without a specific width
		const hasFlexColumn = filtered.some(
			(col) => col.width === "flex-1" || !col.width,
		);

		if (!hasFlexColumn && filtered.length > 0) {
			// Find the first column that doesn't have a fixed width or is the longest content column
			const flexibleColumnIndex = filtered.findIndex(
				(col) =>
					!col.width || col.width === "flex-1" || !col.width.startsWith("w-"),
			);

			if (flexibleColumnIndex !== -1) {
				// Clone the column and set flex-1
				filtered[flexibleColumnIndex] = {
					...filtered[flexibleColumnIndex],
					width: "flex-1",
				};
			}
		}

		return filtered;
	}, [orderedColumns, entity, columnVisibilityState]);

	// Filter data based on search query and archived status
	const filteredData = useMemo(() => {
		let filtered = data;

		// Filter by search query
		if (searchQuery && searchFilter) {
			filtered = filtered.filter((item) =>
				searchFilter(item, searchQuery.toLowerCase()),
			);
		}

		// Filter archived items if showArchived is false
		if (!showArchived && isArchived) {
			filtered = filtered.filter((item) => !isArchived(item));
		}

		return filtered;
	}, [data, searchQuery, searchFilter, showArchived, isArchived]);

	// Sort data - CRITICAL: archived items ALWAYS at bottom
	const sortedData = useMemo(() => {
		if (!sortBy) {
			return filteredData;
		}

		const column = allColumns.find((c) => c.key === sortBy);
		if (!column?.sortable) {
			return filteredData;
		}

		// Separate active and archived items
		const active = filteredData.filter((item) => !isArchived?.(item));
		const archived = filteredData.filter((item) => isArchived?.(item));

		// Sort active items
		const sortedActive = [...active].sort((a, b) => {
			if (column.sortFn) {
				const result = column.sortFn(a, b);
				return sortDirection === "asc" ? result : -result;
			}

			// Default: string comparison
			const aVal = String((a as any)[sortBy] ?? "");
			const bVal = String((b as any)[sortBy] ?? "");
			const comparison = aVal.localeCompare(bVal);
			return sortDirection === "asc" ? comparison : -comparison;
		});

		// ALWAYS put archived at bottom
		return [...sortedActive, ...archived];
	}, [filteredData, sortBy, sortDirection, allColumns, isArchived]);

	// DISABLED: Virtualization removed - pagination only
	// Always use pagination, never virtualization
	const useVirtualization = false;

	// Virtual scrolling setup (only when virtualization is enabled)
	const rowVirtualizer = useVirtualizer({
		count: useVirtualization ? sortedData.length : 0,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => effectiveVirtualRowHeight,
		overscan: virtualOverscan,
		enabled: useVirtualization,
	});

	// Paginate data (only when not virtualizing)
	const paginatedData = useMemo(() => {
		if (useVirtualization) {
			return sortedData;
		}
		if (!effectiveShowPagination || serverPagination) {
			// Data already represents the correct slice (either virtualized or server-paginated)
			return sortedData;
		}
		const start = (currentPage - 1) * effectiveItemsPerPage;
		const end = start + effectiveItemsPerPage;
		return sortedData.slice(start, end);
	}, [
		sortedData,
		currentPage,
		effectiveItemsPerPage,
		effectiveShowPagination,
		serverPagination,
		useVirtualization,
	]);

	// Get virtual items OUTSIDE of useMemo so it re-renders on scroll
	const virtualItems = useVirtualization
		? rowVirtualizer.getVirtualItems()
		: [];

	// Display data: either virtual items or paginated items
	const displayData = useMemo(() => {
		if (useVirtualization) {
			return virtualItems.map((virtualItem) => ({
				item: sortedData[virtualItem.index],
				virtualItem,
			}));
		}
		return paginatedData.map((item) => ({ item, virtualItem: null }));
	}, [useVirtualization, virtualItems, sortedData, paginatedData]);

	// Use totalCount from server if provided, otherwise calculate from client data
	const totalPages = Math.ceil(
		(totalCount || sortedData.length) / effectiveItemsPerPage,
	);

	// Selection handlers
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = new Set(paginatedData.map(getItemId));
			setSelectedIds(allIds);
		} else {
			setSelectedIds(new Set());
		}
	};

	const handleSelectItem = (
		id: string,
		index: number,
		event?: React.MouseEvent | React.KeyboardEvent
	) => {
		const newSelected = new Set(selectedIds);

		// Check if Shift key is held for range selection
		const isShiftHeld = event && "shiftKey" in event && event.shiftKey;

		if (isShiftHeld && lastSelectedIndexRef.current !== null) {
			// Range selection: select all items between last selected and current
			const start = Math.min(lastSelectedIndexRef.current, index);
			const end = Math.max(lastSelectedIndexRef.current, index);

			// Select all items in range
			for (let i = start; i <= end; i++) {
				const item = paginatedData[i];
				if (item) {
					newSelected.add(getItemId(item));
				}
			}
		} else {
			// Normal toggle selection
			if (newSelected.has(id)) {
				newSelected.delete(id);
			} else {
				newSelected.add(id);
			}
		}

		// Update last selected index (anchor point)
		lastSelectedIndexRef.current = index;
		setSelectedIds(newSelected);
	};

	// Notify parent of selection changes
	useEffect(() => {
		onSelectionChange?.(selectedIds);
	}, [selectedIds, onSelectionChange]);

	const handleRowClick = (item: T, event: React.MouseEvent) => {
		// Prevent row click if clicking on checkbox or action buttons
		const target = event.target as HTMLElement;
		if (
			target.closest("[data-no-row-click]") ||
			target.closest("button") ||
			target.closest('[role="checkbox"]')
		) {
			return;
		}
		onRowClick?.(item);
	};

	const updatePageInQuery = (newPage: number) => {
		if (typeof window === "undefined") {
			return;
		}
		const params = new URLSearchParams(window.location.search);
		params.set("page", String(newPage));
		const queryString = params.toString();
		router.push(queryString ? `?${queryString}` : "?", { scroll: false });
	};

	const handlePreviousPage = () => {
		const newPage = Math.max(1, currentPage - 1);
		setCurrentPage(newPage);
		updatePageInQuery(newPage);
	};

	const handleNextPage = () => {
		const newPage = Math.min(totalPages, currentPage + 1);
		setCurrentPage(newPage);
		updatePageInQuery(newPage);
	};

	const isAllSelected =
		selectedIds.size === paginatedData.length && paginatedData.length > 0;

	// Sort handler - click once = asc, twice = desc, third = clear
	const handleSort = (columnKey: string) => {
		if (sortBy === columnKey) {
			// Already sorting by this column
			if (sortDirection === "asc") {
				setSortDirection("desc");
			} else {
				// Clear sort
				setSortBy(null);
				setSortDirection("asc");
			}
		} else {
			// New column
			setSortBy(columnKey);
			setSortDirection("asc");
		}
	};

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5, // 5px movement required to start drag
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor),
	);

	// Track active drag column for overlay
	const [activeColumn, setActiveColumn] = useState<{
		column: ColumnDef<T>;
		width: number;
		align: "left" | "center" | "right";
	} | null>(null);

	// Handle drag start
	const handleDragStart = (event: DragStartEvent) => {
		const column = orderedColumns.find((col) => col.key === event.active.id);
		if (column) {
			// Get the actual width of the column being dragged
			// Try to get the element from the active item
			let width = 150; // Default fallback
			try {
				const element = event.active.rect?.current?.initial;
				if (element?.width) {
					width = element.width;
				}
			} catch (_error) {}

			const align = column.align || "left";
			setActiveColumn({ column, width, align });
		} else {
			setActiveColumn(null);
		}
	};

	// Handle drag end for column reordering
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!(entity && over) || active.id === over.id) {
			setActiveColumn(null);
			return;
		}

		// Get current order from store
		const currentOrder = getColumnOrder(entity);

		if (!currentOrder) {
			setActiveColumn(null);
			return;
		}

		const oldIndex = currentOrder.indexOf(active.id as string);
		const newIndex = currentOrder.indexOf(over.id as string);

		if (oldIndex === -1 || newIndex === -1) {
			setActiveColumn(null);
			return;
		}

		// Create new order by moving the column
		const newOrder = [...currentOrder];
		const [removed] = newOrder.splice(oldIndex, 1);
		newOrder.splice(newIndex, 0, removed);

		// Save to store - this will trigger a re-render via columnOrderState subscription
		setColumnOrder(entity, newOrder);
		setActiveColumn(null);
	};

	return (
		<div className="bg-background relative flex h-full flex-1 flex-col overflow-hidden">
			<div
				className="momentum-scroll flex-1 overflow-x-auto overflow-y-auto"
				ref={scrollContainerRef}
			>
				{/* Sticky Top Toolbar */}
				<div
					className={cn(
						"bg-background dark:bg-background sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b-hairline border-border-subtle sm:gap-2",
						config.borderColor,
						noPadding ? "px-0 py-0" : config.toolbarPadding,
					)}
					ref={toolbarRef}
				>
					{/* Left Section - Search */}
					<div className="flex items-center gap-1.5 sm:gap-2">
						{effectiveShowSearch && (
							<div className="relative">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
								<Input
									className="focus:ring-primary/20 h-10 md:h-9 w-full sm:w-64 md:w-96 pl-9 text-base md:text-sm transition-all duration-200 focus:ring-2"
									onChange={(e) => {
										setSearchQuery(e.target.value);
										setCurrentPage(1); // Reset to first page on search
									}}
									placeholder={searchPlaceholder}
									value={searchQuery}
								/>
							</div>
						)}
					</div>

					{/* Middle Section - Bulk Actions */}
					{selectedIds.size > 0 && bulkActions.length > 0 && (
						<>
							<div className="bg-border/50 mx-2 h-5 w-px" />
							<div className="flex flex-wrap items-center gap-2">
								{bulkActions.map((action, index) => (
									<Button
										className={cn(
											"transition-all duration-200 hover:scale-105 active:scale-95",
											action.variant === "destructive" &&
												"text-white hover:text-white dark:text-white",
										)}
										key={index}
										onClick={() => action.onClick(selectedIds)}
										size="sm"
										variant={action.variant || "outline"}
									>
										{action.icon}
										<span className="ml-2 hidden sm:inline">
											{action.label}
										</span>
									</Button>
								))}
								<div className="bg-border/50 mx-1 h-5 w-px" />
								<span className="text-muted-foreground text-xs font-medium tabular-nums">
									{selectedIds.size} selected
								</span>
							</div>
						</>
					)}

					{/* Right Section - Toolbar Actions & Pagination */}
					<div className="ml-auto flex flex-wrap items-center gap-2">
						{showRefresh && (
							<Button
								className="h-10 w-10 md:h-9 md:w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95"
								onClick={onRefresh}
								size="icon"
								title="Refresh"
								variant="ghost"
							>
								<RefreshCw className="h-5 w-5 md:h-4 md:w-4" />
							</Button>
						)}

						{toolbarActions}

						{effectiveShowPagination && !useVirtualization && (
							<>
								<div className="bg-border/50 h-5 w-px" />
								<div className="flex items-center gap-1 md:gap-2">
									<Button
										className="h-10 w-10 md:h-9 md:w-9 p-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
										disabled={currentPage === 1}
										onClick={handlePreviousPage}
										size="icon"
										variant="ghost"
									>
										<ChevronLeft className="h-5 w-5 md:h-4 md:w-4" />
									</Button>
									<span className="text-muted-foreground text-xs font-medium text-nowrap tabular-nums">
										<span className="hidden sm:inline">
											{(currentPage - 1) * effectiveItemsPerPage + 1}-
											{Math.min(
												currentPage * effectiveItemsPerPage,
												totalCount || filteredData.length,
											)}{" "}
											of{" "}
										</span>
										{(totalCount || filteredData.length).toLocaleString()}
									</span>
									<Button
										className="h-10 w-10 md:h-9 md:w-9 p-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
										disabled={currentPage === totalPages}
										onClick={handleNextPage}
										size="icon"
										variant="ghost"
									>
										<ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
									</Button>
								</div>
							</>
						)}
						{useVirtualization && (
							<>
								<div className="bg-border/50 h-5 w-px" />
								<span className="text-muted-foreground text-xs text-nowrap">
									{filteredData.length.toLocaleString()} rows (virtualized)
								</span>
							</>
						)}
					</div>
				</div>

				{/* Table Header - Excel Style with Drag & Drop */}
				{paginatedData.length > 0 &&
					(isClient && entity ? (
						<DndContext
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							sensors={sensors}
						>
							<div
								className={cn(
									"sticky z-20 flex min-w-max items-center border-b-hairline border-border-subtle font-semibold",
									config.headerBg,
									config.borderColor,
									config.gapSize,
									config.headerPadding,
									config.headerTextSize,
									"text-foreground",
								)}
								style={{ top: `${toolbarHeight}px` }}
							>
								{/* Select All Checkbox */}
								{enableSelection && (
									<div className="flex w-8 shrink-0 items-center justify-center">
										<Checkbox
											aria-label="Select all"
											checked={isAllSelected}
											onCheckedChange={handleSelectAll}
										/>
									</div>
								)}

								{/* Column Headers with Drag & Drop */}
								<SortableContext
									items={visibleColumns.map((col) => col.key)}
									strategy={horizontalListSortingStrategy}
								>
									{visibleColumns.map((column, colIndex) => {
										const isSorted = sortBy === column.key;

										return (
											<SortableColumnHeader
												colIndex={colIndex}
												column={column}
												isSorted={isSorted}
												key={column.key}
												onSort={handleSort}
												sortDirection={sortDirection}
												totalColumns={visibleColumns.length}
											/>
										);
									})}
								</SortableContext>
							</div>
							<DragOverlay dropAnimation={null}>
								{activeColumn ? (
									<div
										className={`border-primary/40 bg-background/95 text-foreground ring-primary/30 flex cursor-grabbing items-center gap-1.5 overflow-hidden border px-2 py-2 text-xs font-medium shadow-2xl ring-2 backdrop-blur-sm ${
											activeColumn.align === "right"
												? "justify-end text-right"
												: activeColumn.align === "center"
													? "justify-center text-center"
													: "justify-start text-left"
										}`}
										style={{ width: `${activeColumn.width}px` }}
									>
										<span className="truncate">
											{activeColumn.column.header}
										</span>
										{activeColumn.column.sortable && (
											<ArrowUpDown className="size-3 shrink-0 opacity-50" />
										)}
									</div>
								) : null}
							</DragOverlay>
						</DndContext>
					) : (
						<div
							className={cn(
								"sticky z-20 flex min-w-max items-center border-b-hairline border-border-subtle font-semibold",
								config.headerBg,
								config.borderColor,
								config.gapSize,
								config.headerPadding,
								config.headerTextSize,
								"text-foreground",
							)}
							style={{ top: `${toolbarHeight}px` }}
						>
							{/* Select All Checkbox */}
							{enableSelection && (
								<div className="flex w-8 shrink-0 items-center justify-center">
									<Checkbox
										aria-label="Select all"
										checked={isAllSelected}
										onCheckedChange={handleSelectAll}
									/>
								</div>
							)}

							{/* Column Headers - Non-draggable */}
							{visibleColumns.map((column, colIndex) => {
								const widthClass = column.width || "flex-1";
								const shrinkClass = column.shrink ? "shrink-0" : "";
								const alignClass =
									column.align === "right"
										? "justify-end text-right"
										: column.align === "center"
											? "justify-center text-center"
											: "justify-start text-left";
								const hideClass = column.hideOnMobile
									? "hidden md:flex"
									: "flex";
								const cellBorder =
									colIndex < visibleColumns.length - 1
										? "border-r border-border/30"
										: "";

								const isSorted = sortBy === column.key;

								return (
									<div
										className={`${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} min-w-0 overflow-hidden px-2`}
										key={column.key}
									>
										{column.sortable ? (
											<button
												className="hover:text-foreground flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-100"
												onClick={() => handleSort(column.key)}
												type="button"
											>
												<span className="font-medium">{column.header}</span>
												{isSorted ? (
													sortDirection === "asc" ? (
														<ArrowUp className="size-3 shrink-0" />
													) : (
														<ArrowDown className="size-3 shrink-0" />
													)
												) : (
													<ArrowUpDown className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-60" />
												)}
											</button>
										) : (
											<span className="font-medium">{column.header}</span>
										)}
									</div>
								);
							})}
						</div>
					))}

				{/* Table Content */}
				{paginatedData.length === 0 ? (
					<div className="flex min-h-[50vh] items-center justify-center px-4 py-12 md:min-h-[60vh]">
						<div className="mx-auto w-full max-w-md space-y-4 text-center">
							<div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
								{emptyIcon}
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-semibold">{emptyMessage}</h3>
								{searchQuery && (
									<p className="text-muted-foreground text-sm">
										No results found for "{searchQuery}". Try adjusting your
										search terms.
									</p>
								)}
								{!searchQuery && (
									<>
										<p className="text-muted-foreground text-sm">
											Get started by creating your first item.
										</p>
										{emptyAction && (
											<div className="flex justify-center pt-2">
												{emptyAction}
											</div>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				) : useVirtualization ? (
					/* Virtual scrolling mode */
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize() + (filteredData.length > 10 ? 120 : 0)}px`, // Add 120px for end message if > 10 rows
							width: "100%",
							position: "relative",
						}}
					>
						{displayData.map(({ item, virtualItem }) => {
							if (!virtualItem) {
								return null;
							}

							const itemId = getItemId(item);
							const isSelected = selectedIds.has(itemId);
							const highlighted = isHighlighted?.(item);
							const isEvenRow = virtualItem.index % 2 === 0;
							const archived = isArchived?.(item);

							// Excel-like styling
							const highlightClass = highlighted
								? getHighlightClass?.(item) ||
									"bg-primary/30 dark:bg-primary/10"
								: "";
							const customRowClass = getRowClassName?.(item) || "";
							const excelRowClass = isEvenRow
								? "bg-background"
								: "bg-muted/30 dark:bg-muted/20";
							const selectedClass = isSelected
								? "bg-blue-50 dark:bg-blue-950/50 selected-inset"
								: "";
							const archivedClass = archived
								? "opacity-60 pointer-events-auto cursor-not-allowed bg-muted/40 line-through"
								: "";

							return (
								<div
									className={cn(
										"group border-border-subtle absolute top-0 left-0 flex w-full min-w-max items-center gap-4 border-b-hairline px-3 py-1.5 transition-smooth sm:gap-6 sm:px-4 sm:py-2",
										!archived &&
											"hover:bg-accent/80 dark:hover:bg-accent/60 cursor-pointer",
										excelRowClass,
										highlightClass,
										selectedClass,
										customRowClass,
										archivedClass,
									)}
									data-index={virtualItem.index}
									key={`virtual-${itemId}-${virtualItem.index}`}
									onClick={(e) => handleRowClick(item, e)}
									ref={rowVirtualizer.measureElement}
									style={{
										transform: `translateY(${virtualItem.start}px)`,
									}}
								>
									{/* Selection Checkbox */}
									{enableSelection && (
										<div
											className="touch-target flex items-center justify-center"
											data-no-row-click
											onClick={(e) => {
												e.stopPropagation();
												handleSelectItem(itemId, virtualItem.index, e);
											}}
										>
											<Checkbox
												aria-label={`Select item ${itemId}`}
												checked={isSelected}
												className="pointer-events-none"
											/>
										</div>
									)}

									{/* Columns */}
									{visibleColumns.map((column, colIndex) => {
										const widthClass = column.width || "flex-1";
										const shrinkClass = column.shrink ? "shrink-0" : "";
										const alignClass =
											column.align === "right"
												? "justify-end text-right"
												: column.align === "center"
													? "justify-center text-center"
													: "justify-start text-left";
										const hideClass = column.hideOnMobile
											? "hidden md:flex"
											: "flex";
										// Excel-like cell borders
										const cellBorder =
											colIndex < visibleColumns.length - 1
												? "border-r border-border/30"
												: "";

										return (
											<div
												className={`${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} min-w-0 items-center overflow-hidden px-2`}
												key={column.key}
											>
												{column.render(item)}
											</div>
										);
									})}
								</div>
							);
						})}

						{/* End of Data Message - Virtualization Mode */}
						{sortedData.length > 10 && (
							<div
								className="border-border/50 from-muted/30 to-muted/50 flex flex-col items-center justify-center gap-3 border-t-2 bg-gradient-to-b py-8 text-center backdrop-blur-sm"
								style={{
									position: "absolute",
									top: `${rowVirtualizer.getTotalSize()}px`,
									left: 0,
									right: 0,
									height: "120px",
								}}
							>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
									<span className="text-foreground text-lg font-semibold">
										All Data Loaded
									</span>
								</div>
								<p className="text-muted-foreground text-sm">
									Showing {(totalCount || filteredData.length).toLocaleString()}{" "}
									total rows
								</p>
							</div>
						)}
					</div>
				) : (
					/* Regular pagination mode */
					<>
						{displayData.map(({ item }, rowIndex) => {
							const itemId = getItemId(item);
							const isSelected = selectedIds.has(itemId);
							const highlighted = isHighlighted?.(item);
							const isEvenRow = rowIndex % 2 === 0;

							// Modern clean styling with variant support
							const highlightClass = highlighted
								? getHighlightClass?.(item) ||
									"bg-primary/30 dark:bg-primary/10"
								: "";
							const customRowClass = getRowClassName?.(item) || "";
							const variantRowClass = isEvenRow
								? config.rowBg
								: config.rowBgAlt;
							const selectedClass = isSelected
								? "bg-blue-50 dark:bg-blue-950/50 selected-inset"
								: "";

							return (
								<div
									className={cn(
										"group flex min-w-max cursor-pointer items-center border-b-hairline transition-smooth",
										config.borderColor,
										config.rowHover,
										config.gapSize,
										config.rowPadding,
										variantRowClass,
										highlightClass,
										selectedClass,
										customRowClass,
									)}
									key={itemId}
									onClick={(e) => handleRowClick(item, e)}
								>
									{/* Selection Checkbox */}
									{enableSelection && (
										<div
											className="flex w-8 shrink-0 items-center justify-center"
											data-no-row-click
											onClick={(e) => {
												e.stopPropagation();
												handleSelectItem(itemId, rowIndex, e);
											}}
										>
											<Checkbox
												aria-label={`Select item ${itemId}`}
												checked={isSelected}
												className="pointer-events-none"
											/>
										</div>
									)}

									{/* Columns */}
									{visibleColumns.map((column, colIndex) => {
										const widthClass = column.width || "flex-1";
										const shrinkClass = column.shrink ? "shrink-0" : "";
										const alignClass =
											column.align === "right"
												? "justify-end text-right"
												: column.align === "center"
													? "justify-center text-center"
													: "justify-start text-left";
										const hideClass = column.hideOnMobile
											? "hidden md:flex"
											: "flex";
										// Subtle cell dividers
										const cellBorder =
											colIndex < visibleColumns.length - 1 ? "border-r" : "";

										return (
											<div
												className={cn(
													"min-w-0 items-center overflow-hidden",
													hideClass,
													widthClass,
													shrinkClass,
													alignClass,
													cellBorder,
													config.borderColor,
													config.cellPadding,
													config.cellTextSize,
												)}
												key={column.key}
											>
												{column.render(item)}
											</div>
										);
									})}
								</div>
							);
						})}

						{/* End of Data Message - Pagination Mode */}
						{filteredData.length > 10 && (
							<div className="border-border/50 from-muted/30 to-muted/50 flex flex-col items-center justify-center gap-3 border-t-2 bg-gradient-to-b py-8 text-center backdrop-blur-sm">
								{currentPage === totalPages ? (
									<>
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
											<span className="text-foreground text-lg font-semibold">
												All Data Loaded
											</span>
										</div>
										<p className="text-muted-foreground text-sm">
											Page {currentPage} of {totalPages} •{" "}
											{(totalCount || filteredData.length).toLocaleString()}{" "}
											total rows
										</p>
									</>
								) : (
									<>
										<div className="flex items-center gap-2">
											<span className="text-foreground text-lg font-semibold">
												Page {currentPage} of {totalPages}
											</span>
										</div>
										<p className="text-muted-foreground text-sm">
											Use pagination controls above to view more data
										</p>
									</>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
