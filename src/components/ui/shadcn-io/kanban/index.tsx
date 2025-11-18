"use client";

import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	type PointerSensorOptions,
	type UniqueIdentifier,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type KanbanColumn = {
	id: string;
	name: string;
	accentColor?: string;
};

export type KanbanItemBase = {
	id: string;
	columnId: string;
	position?: number;
};

export type KanbanMoveEvent<T extends KanbanItemBase> = {
	item: T;
	fromColumnId: string;
	toColumnId: string;
	toIndex: number;
};

type KanbanProviderProps<T extends KanbanItemBase> = {
	columns: KanbanColumn[];
	data: T[];
	onDataChange?: (items: T[]) => void;
	onItemMove?: (event: KanbanMoveEvent<T>) => void | Promise<void>;
	getColumnId?: (item: T) => string;
	children: ReactNode;
	className?: string;
	pointerSensorOptions?: PointerSensorOptions;
	renderDragOverlay?: (item: T) => ReactNode;
};

type KanbanContextValue<T extends KanbanItemBase> = {
	columns: KanbanColumn[];
	getItems: (columnId: string) => T[];
	findItem: (
		id: UniqueIdentifier,
	) => { item: T; columnId: string; index: number } | null;
	activeItem: { item: T; columnId: string } | null;
};

const KanbanContext = createContext<KanbanContextValue<KanbanItemBase> | null>(
	null,
);

const KanbanColumnContext = createContext<KanbanColumn | null>(null);

const COLUMN_DROPPABLE_PREFIX = "kanban-column-";

function buildState<T extends KanbanItemBase>(
	columns: KanbanColumn[],
	data: T[],
	getColumnId: (item: T) => string,
) {
	const initialState = Object.fromEntries(
		columns.map((column) => [column.id, [] as T[]]),
	);

	return data.reduce<Record<string, T[]>>((state, item) => {
		const columnId = getColumnId(item);
		if (!state[columnId]) {
			state[columnId] = [];
		}

		state[columnId] = [...state[columnId], item];
		return state;
	}, initialState);
}

function flattenState<T extends KanbanItemBase>(
	columns: KanbanColumn[],
	state: Record<string, T[]>,
) {
	return columns.flatMap((column) => state[column.id] ?? []);
}

function cloneState<T extends KanbanItemBase>(
	state: Record<string, T[]>,
): Record<string, T[]> {
	return Object.fromEntries(
		Object.entries(state).map(([columnId, items]) => [columnId, items.slice()]),
	);
}

export function KanbanProvider<T extends KanbanItemBase>({
	columns,
	data,
	onDataChange,
	onItemMove,
	getColumnId,
	children,
	className,
	pointerSensorOptions,
	renderDragOverlay,
}: KanbanProviderProps<T>) {
	const columnIdGetter = useCallback(
		getColumnId ?? ((item: T) => item.columnId),
		[],
	);
	const [itemsByColumn, setItemsByColumn] = useState<Record<string, T[]>>(() =>
		buildState(columns, data, columnIdGetter),
	);
	const [activeItem, setActiveItem] = useState<{
		item: T;
		columnId: string;
	} | null>(null);
	const latestColumnsRef = useRef(columns);

	useEffect(() => {
		latestColumnsRef.current = columns;
	}, [columns]);

	useEffect(() => {
		setItemsByColumn(buildState(columns, data, columnIdGetter));
	}, [columns, data, columnIdGetter]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
			...pointerSensorOptions,
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const findItem = useCallback(
		(id: UniqueIdentifier) => {
			for (const column of latestColumnsRef.current) {
				const items = itemsByColumn[column.id] ?? [];
				const index = items.findIndex((item) => item.id === id);
				if (index !== -1) {
					return { columnId: column.id, item: items[index], index };
				}
			}

			return null;
		},
		[itemsByColumn],
	);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			const result = findItem(event.active.id);
			if (result) {
				setActiveItem({ item: result.item, columnId: result.columnId });
			}
		},
		[findItem],
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			setActiveItem(null);

			if (!over) {
				return;
			}

			const origin = findItem(active.id);
			if (!origin) {
				return;
			}

			let destinationColumnId: string | null = null;
			let destinationIndex: number | null = null;

			if (
				typeof over.id === "string" &&
				over.id.startsWith(COLUMN_DROPPABLE_PREFIX)
			) {
				destinationColumnId = over.id.replace(COLUMN_DROPPABLE_PREFIX, "");
				destinationIndex = (itemsByColumn[destinationColumnId] ?? []).length;
			} else {
				const destination = findItem(over.id);
				if (destination) {
					destinationColumnId = destination.columnId;
					const columnItems = itemsByColumn[destination.columnId] ?? [];
					destinationIndex = columnItems.findIndex(
						(item) => item.id === destination.item.id,
					);
				}
			}

			if (
				destinationColumnId === null ||
				destinationIndex === null ||
				(destinationColumnId === origin.columnId &&
					destinationIndex === origin.index)
			) {
				return;
			}

			const updatedState = cloneState(itemsByColumn);
			const originItems = updatedState[origin.columnId] ?? [];
			const [movedItem] = originItems.splice(origin.index, 1);
			updatedState[origin.columnId] = originItems;

			const destinationItems = updatedState[destinationColumnId] ?? [];
			const insertIndex =
				origin.columnId === destinationColumnId &&
				origin.index < destinationIndex
					? destinationIndex - 1
					: destinationIndex;

			const updatedItem = {
				...movedItem,
				columnId: destinationColumnId,
			};

			destinationItems.splice(insertIndex, 0, updatedItem);
			updatedState[destinationColumnId] = destinationItems;

			setItemsByColumn(updatedState);

			const flattened = flattenState(latestColumnsRef.current, updatedState);
			onDataChange?.(flattened);

			if (onItemMove) {
				onItemMove({
					item: updatedItem,
					fromColumnId: origin.columnId,
					toColumnId: destinationColumnId,
					toIndex: insertIndex,
				});
			}
		},
		[findItem, itemsByColumn, onDataChange, onItemMove],
	);

	const contextValue = useMemo<KanbanContextValue<T>>(
		() => ({
			columns,
			getItems: (columnId: string) => itemsByColumn[columnId] ?? [],
			findItem,
			activeItem,
		}),
		[columns, itemsByColumn, findItem, activeItem],
	);

	return (
		<KanbanContext.Provider
			value={contextValue as KanbanContextValue<KanbanItemBase>}
		>
			<DndContext
				collisionDetection={closestCorners}
				onDragCancel={() => setActiveItem(null)}
				onDragEnd={handleDragEnd}
				onDragStart={handleDragStart}
				sensors={sensors}
			>
				<div
					className={cn(
						"flex w-full gap-4 overflow-x-auto px-6 py-4 md:px-8 lg:px-10",
						className,
					)}
				>
					{children}
				</div>
				<DragOverlay>
					{activeItem ? (
						renderDragOverlay ? (
							renderDragOverlay(activeItem.item)
						) : (
							<Card className="border-border/70 bg-background/95 w-[280px] max-w-[320px] border p-3 shadow-lg">
								<p className="text-sm font-medium">
									{String(activeItem.item.id)}
								</p>
							</Card>
						)
					) : null}
				</DragOverlay>
			</DndContext>
		</KanbanContext.Provider>
	);
}

export function useKanbanContext<T extends KanbanItemBase>() {
	const context = useContext(KanbanContext) as KanbanContextValue<T> | null;

	if (!context) {
		throw new Error("useKanbanContext must be used within a KanbanProvider");
	}

	return context;
}

export type KanbanBoardProps = {
	column: KanbanColumn;
	children: ReactNode;
	className?: string;
};

export function KanbanBoard({ column, children, className }: KanbanBoardProps) {
	return (
		<KanbanColumnContext.Provider value={column}>
			<section
				aria-label={`${column.name} column`}
				className={cn(
					"kanban-column border-border/60 from-background via-background/60 to-muted/40 flex h-full min-w-[320px] flex-1 flex-col rounded-2xl border bg-gradient-to-b shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition hover:shadow-md",
					className,
				)}
			>
				{children}
			</section>
		</KanbanColumnContext.Provider>
	);
}

export type KanbanHeaderProps = {
	children: ReactNode;
	className?: string;
};

export function KanbanHeader({ children, className }: KanbanHeaderProps) {
	return (
		<header
			className={cn(
				"bg-background/90 sticky top-0 z-10 flex items-center justify-between gap-2 rounded-t-2xl px-4 py-3 backdrop-blur-sm",
				className,
			)}
		>
			{children}
		</header>
	);
}

export type KanbanCardsProps<T extends KanbanItemBase> = {
	columnId: string;
	children: (item: T, index: number) => ReactNode;
	emptyState?: ReactNode;
	className?: string;
	height?: string;
};

export function KanbanCards<T extends KanbanItemBase>({
	columnId,
	children,
	emptyState,
	className,
	height = "28rem",
}: KanbanCardsProps<T>) {
	const { getItems } = useKanbanContext<T>();
	const items = getItems(columnId);
	const { setNodeRef, isOver } = useDroppable({
		id: `${COLUMN_DROPPABLE_PREFIX}${columnId}`,
	});

	return (
		<SortableContext
			items={items.map((item) => item.id)}
			strategy={verticalListSortingStrategy}
		>
			<ScrollArea className="kanban-scroll flex-1">
				<div
					className={cn(
						"kanban-column-cards bg-muted/30 flex min-h-[120px] flex-col gap-3 rounded-2xl p-3 transition",
						isOver && "ring-primary/60 ring-2 ring-offset-2",
						className,
					)}
					data-drop-state={isOver ? "active" : "inactive"}
					ref={setNodeRef}
					style={{ minHeight: height }}
				>
					{items.length === 0 && emptyState}
					{items.map((item, index) => children(item, index))}
				</div>
			</ScrollArea>
		</SortableContext>
	);
}

export type KanbanCardProps = {
	itemId: UniqueIdentifier;
	children: ReactNode;
	className?: string;
};

export function KanbanCard({ itemId, children, className }: KanbanCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: itemId,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Card
			className={cn(
				"border-border/70 bg-background/95 focus-visible:ring-ring grid gap-3 rounded-xl border p-4 text-left shadow-sm ring-0 transition-all outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2",
				isDragging && "border-primary/60 scale-[1.01] opacity-80 shadow-lg",
				className,
			)}
			data-dragging={isDragging ? "" : undefined}
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			{children}
		</Card>
	);
}

export function useKanbanColumn() {
	const context = useContext(KanbanColumnContext);
	if (!context) {
		throw new Error("useKanbanColumn must be used within a KanbanBoard");
	}

	return context;
}
