"use client";

/**
 * Apple Grid Layout - Client Component
 *
 * Client-side features:
 * - Dynamic viewport calculations
 * - Touch and drag interactions
 * - Responsive grid resizing
 * - Animation state management
 *
 * Performance optimizations:
 * - Viewport-aware rendering (no overflow)
 * - CSS Grid for optimal layout performance
 * - Transform-based animations (GPU accelerated)
 * - Memoized calculations to prevent unnecessary re-renders
 */

import { useMemo } from "react";
import { LazyMotionDiv as motion_div } from "@/components/lazy/framer-motion";

// Alias for backward compatibility
const motion = {
	div: motion_div,
};

import { cn } from "@/lib/utils";
import type { GridDimensions } from "./hooks/use-viewport-grid";

export type GridWidget = {
	id: string;
	size: WidgetGridSize;
	content: React.ReactNode;
};

export type WidgetGridSize = {
	cols: number; // Column span (1-6)
	rows: number; // Row span (1-5)
};

type AppleGridLayoutProps = {
	widgets: GridWidget[];
	dimensions: GridDimensions;
	viewIndex: number;
	isEditMode?: boolean;
	onWidgetClick?: (widgetId: string) => void;
};

/**
 * Calculate widget dimensions based on grid size
 */
function getWidgetStyle(
	widget: GridWidget,
	dimensions: GridDimensions,
): React.CSSProperties {
	const { cellWidth, cellHeight, gap } = dimensions;

	// Clamp widget size to grid dimensions
	const colSpan = Math.min(widget.size.cols, dimensions.cols);
	const rowSpan = Math.min(widget.size.rows, dimensions.rows);

	const width = cellWidth * colSpan + gap * (colSpan - 1);
	const height = cellHeight * rowSpan + gap * (rowSpan - 1);

	return {
		width: `${width}px`,
		height: `${height}px`,
		minWidth: `${width}px`,
		minHeight: `${height}px`,
		maxWidth: `${width}px`,
		maxHeight: `${height}px`,
	};
}

/**
 * Calculate grid template based on dimensions
 */
function getGridTemplate(dimensions: GridDimensions): React.CSSProperties {
	const { cols, rows, cellWidth, cellHeight, gap, padding } = dimensions;

	return {
		display: "grid",
		gridTemplateColumns: `repeat(${cols}, ${cellWidth}px)`,
		gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
		gap: `${gap}px`,
		padding: `${padding}px`,
		width: "100%",
		height: "100%",
	};
}

/**
 * Apple-style grid layout component
 * Renders widgets in a responsive grid that never exceeds viewport bounds
 */
export function AppleGridLayout({
	widgets,
	dimensions,
	viewIndex,
	isEditMode = false,
	onWidgetClick,
}: AppleGridLayoutProps) {
	// Memoize grid template to prevent recalculation
	const gridStyle = useMemo(() => getGridTemplate(dimensions), [dimensions]);

	// Filter widgets for current view
	const viewWidgets = useMemo(() => {
		const startIndex = viewIndex * dimensions.maxWidgetsPerView;
		return widgets.slice(startIndex, startIndex + dimensions.maxWidgetsPerView);
	}, [widgets, viewIndex, dimensions.maxWidgetsPerView]);

	return (
		<div className="relative size-full overflow-hidden">
			<div style={gridStyle}>
				{viewWidgets.map((widget, index) => (
					<motion.div
						animate={{ opacity: 1, scale: 1 }}
						className={cn(
							"relative overflow-hidden rounded-2xl",
							isEditMode && "cursor-pointer hover:ring-2 hover:ring-primary",
						)}
						exit={{ opacity: 0, scale: 0.95 }}
						initial={{ opacity: 0, scale: 0.95 }}
						key={widget.id}
						onClick={() => onWidgetClick?.(widget.id)}
						style={getWidgetStyle(widget, dimensions)}
						transition={{
							duration: 0.3,
							delay: index * 0.05,
							ease: [0.25, 0.1, 0.25, 1.0], // Apple's easing curve
						}}
					>
						{widget.content}
					</motion.div>
				))}
			</div>
		</div>
	);
}

/**
 * Helper to convert legacy widget sizes to grid sizes
 */
export function convertLegacySize(
	legacySize: "small" | "medium" | "large" | "full" | string,
): WidgetGridSize {
	switch (legacySize) {
		case "small":
		case "1x1":
			return { cols: 1, rows: 1 };
		case "medium":
			return { cols: 2, rows: 1 };
		case "large":
		case "2x2":
			return { cols: 2, rows: 2 };
		case "3x3":
			return { cols: 3, rows: 3 };
		case "full":
			return { cols: 4, rows: 4 }; // Will be clamped to grid size
		default:
			return { cols: 1, rows: 1 };
	}
}

/**
 * Calculate optimal widget size based on viewport
 * Ensures widget never exceeds available grid space
 */
export function constrainWidgetSize(
	requestedSize: WidgetGridSize,
	dimensions: GridDimensions,
): WidgetGridSize {
	return {
		cols: Math.min(requestedSize.cols, dimensions.cols),
		rows: Math.min(requestedSize.rows, dimensions.rows),
	};
}

/**
 * Calculate how many cells a widget occupies
 */
export function calculateWidgetCells(size: WidgetGridSize): number {
	return size.cols * size.rows;
}
