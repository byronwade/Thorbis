"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WidgetRenderer } from "./widget-renderer";
import type { Widget } from "./widget-types";
import { WIDGET_SIZE_CLASSES } from "./widget-types";

type DraggableGridProps = {
	widgets: Widget[];
	onWidgetsChange: (widgets: Widget[]) => void;
	data: any;
	isEditMode: boolean;
};

type SortableWidgetProps = {
	widget: Widget;
	data: any;
	isEditMode: boolean;
	onRemove: () => void;
};

function SortableWidget({ widget, data, isEditMode, onRemove }: SortableWidgetProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: widget.id,
		disabled: !isEditMode,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			className={cn("relative h-full", WIDGET_SIZE_CLASSES[widget.size])}
			ref={setNodeRef}
			style={style}
			{...attributes}
		>
			{isEditMode && (
				<div className="absolute top-2 right-2 z-10 flex gap-2">
					<Button className="cursor-grab active:cursor-grabbing" size="icon" variant="secondary" {...listeners}>
						<GripVertical className="size-4" />
					</Button>
					<Button onClick={onRemove} size="icon" variant="destructive">
						<X className="size-4" />
					</Button>
				</div>
			)}
			<WidgetRenderer data={data} widget={widget} />
		</div>
	);
}

export function DraggableGrid({ widgets, onWidgetsChange, data, isEditMode }: DraggableGridProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = widgets.findIndex((w) => w.id === active.id);
			const newIndex = widgets.findIndex((w) => w.id === over.id);
			onWidgetsChange(arrayMove(widgets, oldIndex, newIndex));
		}
	}

	function handleRemove(widgetId: string) {
		onWidgetsChange(widgets.filter((w) => w.id !== widgetId));
	}

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
			<SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
				<div className="grid h-full w-full auto-rows-[minmax(80px,1fr)] grid-cols-4 gap-6 p-6">
					{widgets.map((widget) => (
						<SortableWidget
							data={data}
							isEditMode={isEditMode}
							key={widget.id}
							onRemove={() => {
								handleRemove(widget.id);
							}}
							widget={widget}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
