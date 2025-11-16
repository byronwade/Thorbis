"use client";

/**
 * FullWidthDataTable - Reusable Component
 * Gmail-style full-width table layout for all datatables
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with checkboxes
 * - Bulk actions toolbar
 * - Search filtering
 * - Pagination OR Virtual Scrolling (auto-detected)
 * - Unread/status highlighting
 * - Hover effects
 * - Custom column rendering
 *
 * PERFORMANCE:
 * - Automatically uses virtualization for datasets > 1000 rows
 * - Can be forced on/off with enableVirtualization prop
 * - Virtual scrolling renders only ~20 visible rows for 60fps performance
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
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
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
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getColumnWidthClass, renderCustomColumn } from "@/lib/datatable/custom-column-renderer";
import { useCustomColumnsStore } from "@/lib/stores/custom-columns-store";
import { useDataTableColumnsStore } from "@/lib/stores/datatable-columns-store";

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
	variant?: "default" | "destructive" | "ghost";
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

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.key });

	const widthClass = column.width || "flex-1";
	const shrinkClass = column.shrink ? "shrink-0" : "";
	const alignClass =
		column.align === "right"
			? "justify-end text-right"
			: column.align === "center"
				? "justify-center text-center"
				: "justify-start text-left";
	const hideClass = column.hideOnMobile ? "hidden md:flex" : "flex";
	const cellBorder = colIndex < totalColumns - 1 ? "border-r border-border/30" : "";

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

export type FullWidthDataTableProps<T> = {
	/** Array of data items to display */
	data: T[];
	/** Column definitions */
	columns: ColumnDef<T>[];
	/** Function to extract unique ID from item */
	getItemId: (item: T) => string;
	/** Function to determine if row should be highlighted (e.g., unread) */
	isHighlighted?: (item: T) => boolean;
	/** Function to get highlight background class */
	getHighlightClass?: (item: T) => string;
	/** Handler when row is clicked */
	onRowClick?: (item: T) => void;
	/** Bulk actions to show when items are selected */
	bulkActions?: BulkAction[];
	/** Search placeholder text */
	searchPlaceholder?: string;
	/** Function to filter items based on search query */
	searchFilter?: (item: T, query: string) => boolean;
	/** Empty state message */
	emptyMessage?: string;
	/** Empty state icon */
	emptyIcon?: React.ReactNode;
	/** Empty state action button (e.g., "Add Job") */
	emptyAction?: React.ReactNode;
	/** Show refresh button (default: false for automatic updates) */
	showRefresh?: boolean;
	/** Refresh handler */
	onRefresh?: () => void;
	/** Show pagination */
	showPagination?: boolean;
	/** Items per page (default 50) */
	itemsPerPage?: number;
	/** Custom toolbar actions (rendered on right side) */
	toolbarActions?: React.ReactNode;
	/** Enable row selection */
	enableSelection?: boolean;
	/** Custom row className */
	getRowClassName?: (item: T) => string;
	/** Enable virtual scrolling (auto: true if data.length > 1000, false otherwise) */
	enableVirtualization?: boolean | "auto";
	/** Row height for virtualization (default: 60px) */
	virtualRowHeight?: number;
	/** Overscan for virtualization (default: 5) */
	virtualOverscan?: number;
	/** Entity type for column visibility persistence (e.g., "appointments", "jobs") */
	entity?: string;
	/** Show archived items (default: true) */
	showArchived?: boolean;
	/** Function to determine if item is archived */
	isArchived?: (item: T) => boolean;
};

export function FullWidthDataTable<T>({
	data,
	columns,
	getItemId,
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
	showPagination = true,
	itemsPerPage = 50,
	toolbarActions,
	enableSelection = true,
	getRowClassName,
	enableVirtualization = "auto",
	virtualRowHeight = 60,
	virtualOverscan = 5,
	entity,
	showArchived = true,
	isArchived,
}: FullWidthDataTableProps<T>) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [toolbarHeight, setToolbarHeight] = useState(50); // Default fallback

	// Client-only state to prevent hydration mismatch
	const [isClient, setIsClient] = useState(false);

	// Sorting state
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	// Column visibility and ordering from Zustand store
	const _isColumnVisible = useDataTableColumnsStore((state) => state.isColumnVisible);
	const getColumnOrder = useDataTableColumnsStore((state) => state.getColumnOrder);
	const setColumnOrder = useDataTableColumnsStore((state) => state.setColumnOrder);
	const initializeEntity = useDataTableColumnsStore((state) => state.initializeEntity);

	// Subscribe to column visibility state to trigger re-renders when columns are toggled
	const columnVisibilityState = useDataTableColumnsStore((state) => (entity ? state.entities[entity] : null));

	// Subscribe to column order state to trigger re-renders when columns are reordered
	const columnOrderState = useDataTableColumnsStore((state) => (entity ? state.columnOrder[entity] : null));

	// Set client flag after mount to prevent hydration issues
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Custom columns from Zustand store - use stable selector
	const allCustomColumns = useCustomColumnsStore((state) => state.columns);
	const customColumns = useMemo(() => (entity ? allCustomColumns[entity] || [] : []), [allCustomColumns, entity]);

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
				allColumns.map((col) => col.key)
			);
		}
	}, [isClient, entity, allColumns, initializeEntity]);

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
		const hasFlexColumn = filtered.some((col) => col.width === "flex-1" || !col.width);

		if (!hasFlexColumn && filtered.length > 0) {
			// Find the first column that doesn't have a fixed width or is the longest content column
			const flexibleColumnIndex = filtered.findIndex(
				(col) => !col.width || col.width === "flex-1" || !col.width.startsWith("w-")
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
			filtered = filtered.filter((item) => searchFilter(item, searchQuery.toLowerCase()));
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

	// Determine if virtualization should be used
	const useVirtualization = useMemo(() => {
		if (enableVirtualization === "auto") {
			// Auto-enable virtualization for datasets > 1000 rows
			return sortedData.length > 1000;
		}
		return enableVirtualization === true;
	}, [enableVirtualization, sortedData.length]);

	// Virtual scrolling setup (only when virtualization is enabled)
	const rowVirtualizer = useVirtualizer({
		count: useVirtualization ? sortedData.length : 0,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => virtualRowHeight,
		overscan: virtualOverscan,
		enabled: useVirtualization,
	});

	// Paginate data (only when not virtualizing)
	const paginatedData = useMemo(() => {
		if (useVirtualization) {
			return sortedData;
		}
		if (!showPagination) {
			// Return all data for virtualization
			return sortedData;
		}
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return sortedData.slice(start, end);
	}, [sortedData, currentPage, itemsPerPage, showPagination, useVirtualization]);

	// Get virtual items OUTSIDE of useMemo so it re-renders on scroll
	const virtualItems = useVirtualization ? rowVirtualizer.getVirtualItems() : [];

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

	const totalPages = Math.ceil(sortedData.length / itemsPerPage);

	// Selection handlers
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = new Set(paginatedData.map(getItemId));
			setSelectedIds(allIds);
		} else {
			setSelectedIds(new Set());
		}
	};

	const handleSelectItem = (id: string) => {
		const newSelected = new Set(selectedIds);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedIds(newSelected);
	};

	const handleRowClick = (item: T, event: React.MouseEvent) => {
		// Prevent row click if clicking on checkbox or action buttons
		const target = event.target as HTMLElement;
		if (target.closest("[data-no-row-click]") || target.closest("button") || target.closest('[role="checkbox"]')) {
			return;
		}
		onRowClick?.(item);
	};

	const handlePreviousPage = () => {
		setCurrentPage((prev) => Math.max(1, prev - 1));
	};

	const handleNextPage = () => {
		setCurrentPage((prev) => Math.min(totalPages, prev + 1));
	};

	const isAllSelected = selectedIds.size === paginatedData.length && paginatedData.length > 0;

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
		useSensor(KeyboardSensor)
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
			} catch (_error) {
				console.error("Error:", _error);
			}

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
		<div className="relative flex h-full flex-col overflow-hidden bg-background">
			<div className="momentum-scroll flex-1 overflow-auto" ref={scrollContainerRef}>
				{/* Sticky Top Toolbar */}
				<div
					className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-border/30 border-b bg-background px-4 py-2 sm:gap-2 sm:px-4 dark:bg-background"
					ref={toolbarRef}
				>
					{/* Left Section - Selection & Actions */}
					<div className="flex items-center gap-1.5 sm:gap-2">
						{enableSelection && (
							<div className="touch-target flex items-center justify-center">
								<Checkbox aria-label="Select all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
							</div>
						)}

						{showRefresh && (
							<Button
								className="touch-target transition-all duration-200 hover:scale-105 active:scale-95"
								onClick={onRefresh}
								size="icon"
								title="Refresh"
								variant="ghost"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						)}

						{/* Bulk Actions */}
						{selectedIds.size > 0 && bulkActions.length > 0 && (
							<>
								<div className="mx-1.5 hidden h-4 w-px bg-border md:block" />
								<div className="flex flex-wrap items-center gap-1.5">
									{bulkActions.map((action, index) => (
										<Button
											className="shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
											key={index}
											onClick={() => action.onClick(selectedIds)}
											size="sm"
											variant={action.variant || "ghost"}
										>
											{action.icon}
											<span className="ml-2 hidden sm:inline">{action.label}</span>
										</Button>
									))}
									<span className="ml-1 font-medium text-muted-foreground text-xs">{selectedIds.size} selected</span>
								</div>
							</>
						)}
					</div>

					{/* Right Section - Search & Pagination */}
					<div className="ml-auto flex flex-wrap items-center gap-2">
						{toolbarActions}

						{searchFilter && (
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground transition-colors" />
								<Input
									className="h-9 w-64 pl-9 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 md:w-96"
									onChange={(e) => {
										setSearchQuery(e.target.value);
										setCurrentPage(1); // Reset to first page on search
									}}
									placeholder={searchPlaceholder}
									value={searchQuery}
								/>
							</div>
						)}

						{showPagination && !useVirtualization && (
							<>
								<div className="hidden h-4 w-px bg-border md:block" />
								<div className="flex items-center gap-2">
									<Button
										className="transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
										disabled={currentPage === 1}
										onClick={handlePreviousPage}
										size="icon"
										variant="ghost"
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<span className="text-nowrap font-medium text-muted-foreground text-xs tabular-nums">
										{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
										of {filteredData.length.toLocaleString()}
									</span>
									<Button
										className="transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
										disabled={currentPage === totalPages}
										onClick={handleNextPage}
										size="icon"
										variant="ghost"
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</>
						)}
						{useVirtualization && (
							<>
								<div className="hidden h-4 w-px bg-border md:block" />
								<span className="text-nowrap text-muted-foreground text-xs">
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
								className="sticky z-20 flex items-center gap-4 border-border/30 border-b bg-muted px-4 py-2 font-semibold text-foreground text-xs sm:gap-6 sm:px-4 dark:bg-muted"
								style={{ top: `${toolbarHeight}px` }}
							>
								{/* Spacer for checkbox */}
								{enableSelection && <div className="w-8 shrink-0" />}

								{/* Column Headers with Drag & Drop */}
								<SortableContext items={visibleColumns.map((col) => col.key)} strategy={horizontalListSortingStrategy}>
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
										className={`flex cursor-grabbing items-center gap-1.5 overflow-hidden border border-primary/40 bg-background/95 px-2 py-2 font-medium text-foreground text-xs shadow-2xl ring-2 ring-primary/30 backdrop-blur-sm ${
											activeColumn.align === "right"
												? "justify-end text-right"
												: activeColumn.align === "center"
													? "justify-center text-center"
													: "justify-start text-left"
										}`}
										style={{ width: `${activeColumn.width}px` }}
									>
										<span className="truncate">{activeColumn.column.header}</span>
										{activeColumn.column.sortable && <ArrowUpDown className="size-3 shrink-0 opacity-50" />}
									</div>
								) : null}
							</DragOverlay>
						</DndContext>
					) : (
						<div
							className="sticky z-20 flex items-center gap-4 border-border/30 border-b bg-muted px-4 py-2 font-semibold text-foreground text-xs sm:gap-6 sm:px-4 dark:bg-muted"
							style={{ top: `${toolbarHeight}px` }}
						>
							{/* Spacer for checkbox */}
							{enableSelection && <div className="w-8 shrink-0" />}

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
								const hideClass = column.hideOnMobile ? "hidden md:flex" : "flex";
								const cellBorder = colIndex < visibleColumns.length - 1 ? "border-r border-border/30" : "";

								const isSorted = sortBy === column.key;

								return (
									<div
										className={`${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} min-w-0 overflow-hidden px-2`}
										key={column.key}
									>
										{column.sortable ? (
											<button
												className="flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:text-foreground active:scale-100"
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
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
								{emptyIcon}
							</div>
							<div className="space-y-2">
								<h3 className="font-semibold text-lg">{emptyMessage}</h3>
								{searchQuery && (
									<p className="text-muted-foreground text-sm">
										No results found for "{searchQuery}". Try adjusting your search terms.
									</p>
								)}
								{!searchQuery && (
									<>
										<p className="text-muted-foreground text-sm">Get started by creating your first item.</p>
										{emptyAction && <div className="flex justify-center pt-2">{emptyAction}</div>}
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
							const highlightClass = highlighted ? getHighlightClass?.(item) || "bg-primary/30 dark:bg-primary/10" : "";
							const customRowClass = getRowClassName?.(item) || "";
							const excelRowClass = isEvenRow ? "bg-background" : "bg-muted/30 dark:bg-muted/20";
							const selectedClass = isSelected ? "bg-blue-50 dark:bg-blue-950/50" : "";
							const archivedClass = archived
								? "opacity-60 pointer-events-auto cursor-not-allowed bg-muted/40 line-through"
								: "";

							return (
								<div
									className={`group absolute top-0 left-0 flex w-full items-center gap-4 border-border/50 border-b px-3 py-1.5 transition-all duration-150 sm:gap-6 sm:px-4 sm:py-2 ${archived ? "" : "cursor-pointer hover:bg-accent/80 dark:hover:bg-accent/60"} ${excelRowClass} ${highlightClass} ${selectedClass} ${customRowClass} ${archivedClass}`}
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
										<div className="touch-target flex items-center justify-center" data-no-row-click>
											<Checkbox
												aria-label={`Select item ${itemId}`}
												checked={isSelected}
												onCheckedChange={() => handleSelectItem(itemId)}
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
										const hideClass = column.hideOnMobile ? "hidden md:flex" : "flex";
										// Excel-like cell borders
										const cellBorder = colIndex < visibleColumns.length - 1 ? "border-r border-border/30" : "";

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
								className="flex flex-col items-center justify-center gap-3 border-border/50 border-t-2 bg-gradient-to-b from-muted/30 to-muted/50 py-8 text-center backdrop-blur-sm"
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
									<span className="font-semibold text-foreground text-lg">All Data Loaded</span>
								</div>
								<p className="text-muted-foreground text-sm">Showing all {filteredData.length.toLocaleString()} rows</p>
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

							// Modern clean styling
							const highlightClass = highlighted ? getHighlightClass?.(item) || "bg-primary/30 dark:bg-primary/10" : "";
							const customRowClass = getRowClassName?.(item) || "";
							const excelRowClass = isEvenRow ? "bg-card" : "bg-card/70";
							const selectedClass = isSelected ? "bg-blue-50 dark:bg-blue-950/50" : "";

							return (
								<div
									className={`group hover:-translate-y-[1px] flex cursor-pointer items-center gap-4 border-border/30 border-b px-4 py-2.5 transition-all duration-200 hover:bg-muted/25 hover:shadow-sm active:translate-y-0 sm:gap-6 sm:px-4 dark:hover:bg-muted/20 ${excelRowClass} ${highlightClass} ${selectedClass} ${customRowClass}`}
									key={itemId}
									onClick={(e) => handleRowClick(item, e)}
								>
									{/* Selection Checkbox */}
									{enableSelection && (
										<div className="flex w-8 shrink-0 items-center justify-center" data-no-row-click>
											<Checkbox
												aria-label={`Select item ${itemId}`}
												checked={isSelected}
												onCheckedChange={() => handleSelectItem(itemId)}
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
										const hideClass = column.hideOnMobile ? "hidden md:flex" : "flex";
										// Subtle cell dividers
										const cellBorder = colIndex < visibleColumns.length - 1 ? "border-r border-border/20" : "";

										return (
											<div
												className={`${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} min-w-0 items-center overflow-hidden px-2 text-sm`}
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
							<div className="flex flex-col items-center justify-center gap-3 border-border/50 border-t-2 bg-gradient-to-b from-muted/30 to-muted/50 py-8 text-center backdrop-blur-sm">
								{currentPage === totalPages ? (
									<>
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
											<span className="font-semibold text-foreground text-lg">All Data Loaded</span>
										</div>
										<p className="text-muted-foreground text-sm">
											Page {currentPage} of {totalPages} • {filteredData.length.toLocaleString()} total rows
										</p>
									</>
								) : (
									<>
										<div className="flex items-center gap-2">
											<span className="font-semibold text-foreground text-lg">
												Page {currentPage} of {totalPages}
											</span>
										</div>
										<p className="text-muted-foreground text-sm">Use pagination controls above to view more data</p>
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
