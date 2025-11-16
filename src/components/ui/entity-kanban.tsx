/**
 * EntityKanban - Generic Kanban Component
 *
 * Reusable kanban board component that handles common kanban logic.
 * Replaces individual kanban components (JobsKanban, InvoicesKanban, etc.)
 *
 * Features:
 * - Column definitions with status mapping
 * - Drag and drop functionality
 * - Column metadata (counts, totals)
 * - Custom card rendering
 * - Optional status change handler
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	type KanbanColumn,
	KanbanHeader,
	type KanbanItemBase,
	type KanbanMoveEvent,
	KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";

export type ColumnMeta = {
	count: number;
	total?: number;
	value?: number;
};

export type EntityKanbanProps<TEntity, TStatus extends string> = {
	/** Entity data array */
	data: TEntity[];

	/** Column definitions */
	columns: Array<{
		id: TStatus;
		name: string;
		accentColor: string;
	}>;

	/** Map entity to kanban item */
	mapToKanbanItem: (entity: TEntity) => KanbanItemBase & { entity: TEntity };

	/** Update entity status when moved */
	updateEntityStatus?: (entity: TEntity, newStatus: TStatus) => TEntity;

	/** Render card component */
	renderCard: (item: KanbanItemBase & { entity: TEntity }) => React.ReactNode;

	/** Render drag overlay */
	renderDragOverlay?: (item: KanbanItemBase & { entity: TEntity }) => React.ReactNode;

	/** Calculate column metadata (count, totals) */
	calculateColumnMeta?: (columnId: TStatus, items: (KanbanItemBase & { entity: TEntity })[]) => ColumnMeta;

	/** Handle item move event */
	onItemMove?: (event: KanbanMoveEvent<KanbanItemBase & { entity: TEntity }>) => void | Promise<void>;

	/** Entity name for empty states (e.g., "jobs", "invoices") */
	entityName?: string;

	/** Custom empty state message */
	emptyStateMessage?: (columnName: string) => string;

	/** Show totals in column headers */
	showTotals?: boolean;

	/** Format total value */
	formatTotal?: (total: number) => string;
};

export function EntityKanban<TEntity, TStatus extends string>({
	data,
	columns,
	mapToKanbanItem,
	updateEntityStatus,
	renderCard,
	renderDragOverlay,
	calculateColumnMeta,
	onItemMove,
	entityName = "items",
	emptyStateMessage,
	showTotals = false,
	formatTotal,
}: EntityKanbanProps<TEntity, TStatus>) {
	const [items, setItems] = useState<(KanbanItemBase & { entity: TEntity })[]>(() => data.map(mapToKanbanItem));

	useEffect(() => {
		setItems(data.map(mapToKanbanItem));
	}, [data, mapToKanbanItem]);

	const handleDataChange = (next: (KanbanItemBase & { entity: TEntity })[]) => {
		if (updateEntityStatus) {
			setItems(
				next.map((item) => ({
					...item,
					entity: updateEntityStatus(item.entity, item.columnId as TStatus),
				}))
			);
		} else {
			setItems(next);
		}
	};

	const defaultCalculateColumnMeta = (
		columnId: TStatus,
		items: (KanbanItemBase & { entity: TEntity })[]
	): ColumnMeta => {
		const columnItems = items.filter((item) => item.columnId === columnId);
		return { count: columnItems.length };
	};

	const getColumnMeta = calculateColumnMeta || defaultCalculateColumnMeta;

	const columnMetaMap = useMemo(() => {
		const meta: Record<string, ColumnMeta> = {};
		columns.forEach((column) => {
			meta[column.id] = getColumnMeta(column.id, items);
		});
		return meta;
	}, [columns, items, getColumnMeta]);

	const kanbanColumns: KanbanColumn[] = useMemo(
		() =>
			columns.map((col) => ({
				id: col.id,
				name: col.name,
				accentColor: col.accentColor,
			})),
		[columns]
	);

	const defaultEmptyState = (columnName: string) => `No ${entityName} in ${columnName}`;

	const getEmptyStateMessage = emptyStateMessage || defaultEmptyState;

	return (
		<KanbanProvider<KanbanItemBase & { entity: TEntity }>
			className="pb-4"
			columns={kanbanColumns}
			data={items}
			onDataChange={handleDataChange}
			onItemMove={onItemMove}
			renderDragOverlay={
				renderDragOverlay ||
				((item) => (
					<div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
						{renderCard(item)}
					</div>
				))
			}
		>
			{columns.map((column) => {
				const meta = columnMetaMap[column.id] ?? { count: 0 };
				return (
					<KanbanBoard
						className="min-h-[300px] flex-1"
						column={kanbanColumns.find((c) => c.id === column.id)!}
						key={column.id}
					>
						<KanbanHeader>
							<div className="flex items-center gap-2">
								<span
									aria-hidden="true"
									className="h-2.5 w-2.5 rounded-full"
									style={{ backgroundColor: column.accentColor }}
								/>
								<span className="font-semibold text-foreground text-sm">{column.name}</span>
								<Badge
									className="rounded-full bg-muted px-2 py-0 font-medium text-muted-foreground text-xs"
									variant="secondary"
								>
									{meta.count} {entityName}
								</Badge>
								{showTotals && meta.total !== undefined && formatTotal && (
									<span className="text-muted-foreground text-xs">{formatTotal(meta.total)}</span>
								)}
								{showTotals && meta.value !== undefined && formatTotal && (
									<span className="text-muted-foreground text-xs">{formatTotal(meta.value)}</span>
								)}
							</div>
						</KanbanHeader>
						<KanbanCards<KanbanItemBase & { entity: TEntity }>
							className="min-h-[200px]"
							columnId={column.id}
							emptyState={
								<div className="rounded-xl border border-border/60 border-dashed bg-background/60 p-4 text-center text-muted-foreground text-xs">
									{getEmptyStateMessage(column.name)}
								</div>
							}
						>
							{(item) => (
								<KanbanCard itemId={item.id} key={item.id}>
									{renderCard(item)}
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				);
			})}
		</KanbanProvider>
	);
}
