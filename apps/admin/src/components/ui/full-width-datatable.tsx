"use client";

/**
 * FullWidthDataTable - Universal Table Component for Admin
 * Enterprise-grade table with design system variants
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
import { Button, Checkbox, Input, cn } from "@stratos/ui";
import {
	getColumnWidthClass,
	renderCustomColumn,
} from "@/lib/datatable/custom-column-renderer";
import { useCustomColumnsStore } from "@/lib/stores/custom-columns-store";
import { useDataTableColumnsStore } from "@/lib/stores/datatable-columns-store";

export type TableVariant = "full" | "compact" | "nested";

export type ColumnDef<T> = {
	key: string;
	header: string;
	render: (item: T) => React.ReactNode;
	width?: string;
	shrink?: boolean;
	align?: "left" | "center" | "right";
	hideOnMobile?: boolean;
	sortable?: boolean;
	sortFn?: (a: T, b: T) => number;
	hideable?: boolean;
};

export type BulkAction = {
	label: string;
	icon: React.ReactNode;
	onClick: (selectedIds: Set<string>) => void;
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

	const handleMouseDown = (e: React.MouseEvent) => {
		setMouseDownPos({ x: e.clientX, y: e.clientY });
	};

	const handleClick = (e: React.MouseEvent) => {
		if (!(column.sortable && mouseDownPos)) {
			return;
		}

		const deltaX = Math.abs(e.clientX - mouseDownPos.x);
		const deltaY = Math.abs(e.clientY - mouseDownPos.y);

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
	data: T[];
	columns: ColumnDef<T>[];
	getItemId: (item: T) => string;
	variant?: TableVariant;
	isHighlighted?: (item: T) => boolean;
	getHighlightClass?: (item: T) => string;
	onRowClick?: (item: T) => void;
	bulkActions?: BulkAction[];
	enableSelection?: boolean;
	searchPlaceholder?: string;
	searchFilter?: (item: T, query: string) => boolean;
	initialSearchQuery?: string;
	serverSearch?: boolean;
	searchParamKey?: string;
	searchDebounceMs?: number;
	emptyMessage?: string;
	emptyIcon?: React.ReactNode;
	emptyAction?: React.ReactNode;
	showRefresh?: boolean;
	onRefresh?: () => void;
	showPagination?: boolean;
	itemsPerPage?: number;
	totalCount?: number;
	currentPageFromServer?: number;
	serverPagination?: boolean;
	toolbarActions?: React.ReactNode;
	noPadding?: boolean;
	getRowClassName?: (item: T) => string;
	enableVirtualization?: boolean | "auto";
	virtualRowHeight?: number;
	virtualOverscan?: number;
	entity?: string;
	showArchived?: boolean;
	isArchived?: (item: T) => boolean;
};

const VARIANT_CONFIG = {
	full: {
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
		rowHover: "hover:bg-accent/50",
		borderColor: "border-border/50",
		gapSize: "gap-4 sm:gap-6",
		showPagination: true,
		showSearch: true,
	},
	compact: {
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
		rowHover: "hover:bg-accent/40",
		borderColor: "border-border/40",
		gapSize: "gap-3 sm:gap-4",
		showPagination: true,
		showSearch: true,
	},
	nested: {
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
		rowHover: "hover:bg-accent/30",
		borderColor: "border-border/30",
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
	const config = VARIANT_CONFIG[variant];

	const effectiveItemsPerPage = itemsPerPage ?? config.itemsPerPage;
	const effectiveVirtualRowHeight = virtualRowHeight ?? config.virtualRowHeight;
	const effectiveShowPagination = showPagination ?? config.showPagination;
	const effectiveShowSearch =
		(searchFilter || serverSearch) && config.showSearch;
	const router = useRouter();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState(initialSearchQuery ?? "");
	const [currentPage, setCurrentPage] = useState(currentPageFromServer);
	const lastServerSearchRef = useRef(initialSearchQuery ?? "");
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [toolbarHeight, setToolbarHeight] = useState(50);
	const lastSelectedIndexRef = useRef<number | null>(null);

	const [isClient, setIsClient] = useState(false);
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

	const columnVisibilityState = useDataTableColumnsStore((state) =>
		entity ? state.entities[entity] : null,
	);

	const columnOrderState = useDataTableColumnsStore((state) =>
		entity ? state.columnOrder[entity] : null,
	);

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

	const allCustomColumns = useCustomColumnsStore((state) => state.columns);
	const customColumns = useMemo(
		() => (entity ? allCustomColumns[entity] || [] : []),
		[allCustomColumns, entity],
	);

	useEffect(() => {
		const measureToolbar = () => {
			if (toolbarRef.current) {
				const height = toolbarRef.current.offsetHeight;
				setToolbarHeight(height);
			}
		};

		measureToolbar();
		window.addEventListener("resize", measureToolbar);
		const timer = setTimeout(measureToolbar, 100);

		return () => {
			window.removeEventListener("resize", measureToolbar);
			clearTimeout(timer);
		};
	}, []);

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

	const allColumns = useMemo(() => {
		if (!entity) {
			return columns;
		}

		const customColumnDefs: ColumnDef<T>[] = customColumns.map((col) => ({
			key: col.id,
			header: col.label,
			width: getColumnWidthClass(col.width),
			sortable: col.sortable,
			hideable: true,
			render: (item: T) => renderCustomColumn(item, col.fieldPath, col.format),
		}));

		return [...columns, ...customColumnDefs];
	}, [columns, customColumns, entity]);

	useEffect(() => {
		if (isClient && entity && allColumns.length > 0) {
			initializeEntity(
				entity,
				allColumns.map((col) => col.key),
			);
		}
	}, [isClient, entity, allColumns, initializeEntity]);

	const orderedColumns = useMemo(() => {
		if (!(isClient && entity)) {
			return allColumns;
		}

		const storedOrder = columnOrderState || getColumnOrder(entity);
		if (!storedOrder || storedOrder.length === 0) {
			return allColumns;
		}

		const columnMap = new Map(allColumns.map((col) => [col.key, col]));
		const ordered: ColumnDef<T>[] = [];
		const usedKeys = new Set<string>();

		for (const key of storedOrder) {
			const column = columnMap.get(key);
			if (column) {
				ordered.push(column);
				usedKeys.add(key);
			}
		}

		for (const column of allColumns) {
			if (!usedKeys.has(column.key)) {
				ordered.push(column);
			}
		}

		return ordered;
	}, [isClient, allColumns, entity, columnOrderState, getColumnOrder]);

	const visibleColumns = useMemo(() => {
		if (!entity) {
			return orderedColumns;
		}

		const filtered = orderedColumns.filter((col) => {
			if (!col.hideable) {
				return true;
			}
			const visible = columnVisibilityState?.[col.key] ?? true;
			return visible;
		});

		const hasFlexColumn = filtered.some(
			(col) => col.width === "flex-1" || !col.width,
		);

		if (!hasFlexColumn && filtered.length > 0) {
			const flexibleColumnIndex = filtered.findIndex(
				(col) =>
					!col.width || col.width === "flex-1" || !col.width.startsWith("w-"),
			);

			if (flexibleColumnIndex !== -1) {
				filtered[flexibleColumnIndex] = {
					...filtered[flexibleColumnIndex],
					width: "flex-1",
				};
			}
		}

		return filtered;
	}, [orderedColumns, entity, columnVisibilityState]);

	const filteredData = useMemo(() => {
		let filtered = data;

		if (searchQuery && searchFilter) {
			filtered = filtered.filter((item) =>
				searchFilter(item, searchQuery.toLowerCase()),
			);
		}

		if (!showArchived && isArchived) {
			filtered = filtered.filter((item) => !isArchived(item));
		}

		return filtered;
	}, [data, searchQuery, searchFilter, showArchived, isArchived]);

	const sortedData = useMemo(() => {
		if (!sortBy) {
			return filteredData;
		}

		const column = allColumns.find((c) => c.key === sortBy);
		if (!column?.sortable) {
			return filteredData;
		}

		const active = filteredData.filter((item) => !isArchived?.(item));
		const archived = filteredData.filter((item) => isArchived?.(item));

		const sortedActive = [...active].sort((a, b) => {
			if (column.sortFn) {
				const result = column.sortFn(a, b);
				return sortDirection === "asc" ? result : -result;
			}

			const aVal = String((a as any)[sortBy] ?? "");
			const bVal = String((b as any)[sortBy] ?? "");
			const comparison = aVal.localeCompare(bVal);
			return sortDirection === "asc" ? comparison : -comparison;
		});

		return [...sortedActive, ...archived];
	}, [filteredData, sortBy, sortDirection, allColumns, isArchived]);

	const useVirtualization = false;

	const rowVirtualizer = useVirtualizer({
		count: useVirtualization ? sortedData.length : 0,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => effectiveVirtualRowHeight,
		overscan: virtualOverscan,
		enabled: useVirtualization,
	});

	const paginatedData = useMemo(() => {
		if (useVirtualization) {
			return sortedData;
		}
		if (!effectiveShowPagination || serverPagination) {
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

	const virtualItems = useVirtualization
		? rowVirtualizer.getVirtualItems()
		: [];

	const displayData = useMemo(() => {
		if (useVirtualization) {
			return virtualItems.map((virtualItem) => ({
				item: sortedData[virtualItem.index],
				virtualItem,
			}));
		}
		return paginatedData.map((item) => ({ item, virtualItem: null }));
	}, [useVirtualization, virtualItems, sortedData, paginatedData]);

	const totalPages = Math.ceil(
		(totalCount || sortedData.length) / effectiveItemsPerPage,
	);

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
		event?: React.MouseEvent | React.KeyboardEvent,
	) => {
		const newSelected = new Set(selectedIds);
		const isShiftHeld = event && "shiftKey" in event && event.shiftKey;

		if (isShiftHeld && lastSelectedIndexRef.current !== null) {
			const start = Math.min(lastSelectedIndexRef.current, index);
			const end = Math.max(lastSelectedIndexRef.current, index);

			for (let i = start; i <= end; i++) {
				const item = paginatedData[i];
				if (item) {
					newSelected.add(getItemId(item));
				}
			}
		} else {
			if (newSelected.has(id)) {
				newSelected.delete(id);
			} else {
				newSelected.add(id);
			}
		}

		lastSelectedIndexRef.current = index;
		setSelectedIds(newSelected);
	};

	useEffect(() => {
		onSelectionChange?.(selectedIds);
	}, [selectedIds, onSelectionChange]);

	const handleRowClick = (item: T, event: React.MouseEvent) => {
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

	const handleSort = (columnKey: string) => {
		if (sortBy === columnKey) {
			if (sortDirection === "asc") {
				setSortDirection("desc");
			} else {
				setSortBy(null);
				setSortDirection("asc");
			}
		} else {
			setSortBy(columnKey);
			setSortDirection("asc");
		}
	};

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
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

	const [activeColumn, setActiveColumn] = useState<{
		column: ColumnDef<T>;
		width: number;
		align: "left" | "center" | "right";
	} | null>(null);

	const handleDragStart = (event: DragStartEvent) => {
		const column = orderedColumns.find((col) => col.key === event.active.id);
		if (column) {
			let width = 150;
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

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!(entity && over) || active.id === over.id) {
			setActiveColumn(null);
			return;
		}

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

		const newOrder = [...currentOrder];
		const [removed] = newOrder.splice(oldIndex, 1);
		newOrder.splice(newIndex, 0, removed);

		setColumnOrder(entity, newOrder);
		setActiveColumn(null);
	};

	return (
		<div className="bg-background relative flex h-full flex-1 flex-col overflow-hidden">
			<div
				className="flex-1 overflow-x-auto overflow-y-auto"
				ref={scrollContainerRef}
			>
				{/* Sticky Top Toolbar */}
				<div
					className={cn(
						"bg-background dark:bg-background sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b sm:gap-2",
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
										setCurrentPage(1);
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
										<span className="ml-2 hidden sm:inline">{action.label}</span>
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
					</div>
				</div>

				{/* Table Header */}
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
									"sticky z-20 flex min-w-max items-center border-b font-semibold",
									config.headerBg,
									config.borderColor,
									config.gapSize,
									config.headerPadding,
									config.headerTextSize,
									"text-foreground",
								)}
								style={{ top: `${toolbarHeight}px` }}
							>
								{enableSelection && (
									<div className="flex w-8 shrink-0 items-center justify-center">
										<Checkbox
											aria-label="Select all"
											checked={isAllSelected}
											onCheckedChange={handleSelectAll}
										/>
									</div>
								)}

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
								"sticky z-20 flex min-w-max items-center border-b font-semibold",
								config.headerBg,
								config.borderColor,
								config.gapSize,
								config.headerPadding,
								config.headerTextSize,
								"text-foreground",
							)}
							style={{ top: `${toolbarHeight}px` }}
						>
							{enableSelection && (
								<div className="flex w-8 shrink-0 items-center justify-center">
									<Checkbox
										aria-label="Select all"
										checked={isAllSelected}
										onCheckedChange={handleSelectAll}
									/>
								</div>
							)}

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
				) : (
					<>
						{displayData.map(({ item }, rowIndex) => {
							const itemId = getItemId(item);
							const isSelected = selectedIds.has(itemId);
							const highlighted = isHighlighted?.(item);
							const isEvenRow = rowIndex % 2 === 0;

							const highlightClass = highlighted
								? getHighlightClass?.(item) ||
									"bg-primary/30 dark:bg-primary/10"
								: "";
							const customRowClass = getRowClassName?.(item) || "";
							const variantRowClass = isEvenRow ? config.rowBg : config.rowBgAlt;
							const selectedClass = isSelected
								? "bg-blue-50 dark:bg-blue-950/50"
								: "";

							return (
								<div
									className={cn(
										"group flex min-w-max cursor-pointer items-center border-b transition-colors",
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

						{/* End of Data Message */}
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
