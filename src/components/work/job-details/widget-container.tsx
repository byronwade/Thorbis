"use client";

/**
 * Widget Container - Client Component
 *
 * Wraps each widget with drag-and-drop functionality and styling.
 *
 * Client-side features:
 * - Drag handle for repositioning
 * - Resize handles for adjusting size
 * - Collapse/expand functionality
 * - Remove widget action
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Maximize2, Minimize2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type JobWidget, useJobDetailsLayoutStore } from "@/lib/stores/job-details-layout-store";
import { cn } from "@/lib/utils";

// ============================================================================
// Props Types
// ============================================================================

type WidgetContainerProps = {
	widget: JobWidget;
	isEditMode: boolean;
	isDragging?: boolean;
	children: React.ReactNode;
};

const DRAG_OPACITY = 0.5;

// ============================================================================
// Widget Container Component
// ============================================================================

export function WidgetContainer({
	widget,
	isEditMode,
	isDragging = false,
	children,
}: WidgetContainerProps) {
	const removeWidget = useJobDetailsLayoutStore((state) => state.removeWidget);
	const resizeWidget = useJobDetailsLayoutStore((state) => state.resizeWidget);

	// Setup sortable functionality
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSortableDragging,
	} = useSortable({
		id: widget.id,
		disabled: !(isEditMode && widget.isDraggable),
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isSortableDragging ? DRAG_OPACITY : 1,
	};

	// Check if widget is currently full width
	const isFullWidth = widget.size.width >= 2;

	// ============================================================================
	// Handlers
	// ============================================================================

	function handleRemove() {
		removeWidget(widget.id);
	}

	function handleResize() {
		// Toggle between half-width (1) and full-width (2)
		const newWidth = isFullWidth ? 1 : 2;
		resizeWidget(widget.id, { width: newWidth, height: widget.size.height });
	}

	// ============================================================================
	// Render
	// ============================================================================

	return (
		<div
			className={cn(
				"bg-card flex h-full flex-col rounded-lg border transition-all duration-200",
				isEditMode && "ring-primary/20 hover:ring-primary/40 ring-2",
				isDragging && "shadow-2xl",
				isSortableDragging && "ring-dashed ring-primary/50 scale-95 opacity-30 ring-2"
			)}
			ref={setNodeRef}
			style={style}
		>
			{/* Header */}
			<div className="flex flex-shrink-0 items-center justify-between gap-2 border-b px-4 py-2">
				{/* Left side: Drag handle + Title */}
				<div className="flex flex-1 items-center gap-2">
					{isEditMode && widget.isDraggable ? (
						<div
							{...attributes}
							{...listeners}
							className="cursor-grab touch-none active:cursor-grabbing"
						>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<GripVertical className="text-muted-foreground size-4" />
									</TooltipTrigger>
									<TooltipContent>
										<p>Drag to reposition</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					) : null}

					<div className="flex min-w-0 flex-1 items-center gap-2">
						<div className="min-w-0 flex-1">
							<h3 className="truncate text-sm font-semibold">{widget.title}</h3>
							{widget.description ? (
								<p className="text-muted-foreground truncate text-xs">{widget.description}</p>
							) : null}
						</div>
						{isEditMode ? (
							<Badge className="shrink-0 text-xs" variant={isFullWidth ? "default" : "secondary"}>
								{isFullWidth ? "Full" : "Half"}
							</Badge>
						) : null}
					</div>
				</div>

				{/* Right side: Actions */}
				{isEditMode ? (
					<div className="flex items-center gap-1">
						{/* Resize */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="text-muted-foreground hover:bg-primary/10 hover:text-primary size-7 p-0"
										onClick={handleResize}
										size="sm"
										variant="ghost"
									>
										{isFullWidth ? (
											<Minimize2 className="size-4" />
										) : (
											<Maximize2 className="size-4" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{isFullWidth ? "Resize to half width" : "Resize to full width"}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{/* Remove */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="text-destructive hover:bg-destructive/10 hover:text-destructive size-7 p-0"
										onClick={handleRemove}
										size="sm"
										variant="ghost"
									>
										<X className="size-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Remove widget</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				) : null}
			</div>

			{/* Widget Content */}
			<div className="flex-1 overflow-auto p-4">{children}</div>
		</div>
	);
}
