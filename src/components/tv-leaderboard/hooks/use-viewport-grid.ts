/**
 * Viewport Grid Hook - Apple-style grid calculation
 *
 * Calculates optimal grid dimensions based on viewport size
 * Ensures all widgets fit within viewport bounds without scrolling
 * Similar to iOS home screen grid system
 */

import { useCallback, useEffect, useState } from "react";

export type GridDimensions = {
	cols: number;
	rows: number;
	cellWidth: number;
	cellHeight: number;
	gap: number;
	padding: number;
	viewportWidth: number;
	viewportHeight: number;
	maxWidgetsPerView: number;
};

export type GridBreakpoint = {
	minWidth: number;
	cols: number;
	rows: number;
	gap: number;
	padding: number;
};

// Apple-style breakpoints for different screen sizes
const GRID_BREAKPOINTS: GridBreakpoint[] = [
	// Mobile portrait (like iPhone)
	{ minWidth: 0, cols: 2, rows: 4, gap: 12, padding: 16 },
	// Mobile landscape / Small tablet
	{ minWidth: 640, cols: 3, rows: 3, gap: 16, padding: 20 },
	// Tablet portrait (like iPad)
	{ minWidth: 768, cols: 4, rows: 4, gap: 20, padding: 24 },
	// Tablet landscape
	{ minWidth: 1024, cols: 5, rows: 4, gap: 24, padding: 32 },
	// Desktop / TV
	{ minWidth: 1280, cols: 6, rows: 4, gap: 28, padding: 40 },
	// Large TV
	{ minWidth: 1920, cols: 8, rows: 5, gap: 32, padding: 48 },
];

/**
 * Calculate optimal grid dimensions based on viewport size
 */
function calculateGridDimensions(viewportWidth: number, viewportHeight: number): GridDimensions {
	// Find appropriate breakpoint
	const breakpoint = [...GRID_BREAKPOINTS].reverse().find((bp) => viewportWidth >= bp.minWidth) || GRID_BREAKPOINTS[0];

	const { cols, rows, gap, padding } = breakpoint;

	// Calculate available space (viewport - padding - gaps)
	const availableWidth = viewportWidth - padding * 2 - gap * (cols - 1);
	const availableHeight = viewportHeight - padding * 2 - gap * (rows - 1);

	// Calculate cell dimensions
	const cellWidth = Math.floor(availableWidth / cols);
	const cellHeight = Math.floor(availableHeight / rows);

	// Maximum widgets per view is cols * rows
	const maxWidgetsPerView = cols * rows;

	return {
		cols,
		rows,
		cellWidth,
		cellHeight,
		gap,
		padding,
		viewportWidth,
		viewportHeight,
		maxWidgetsPerView,
	};
}

/**
 * Hook to track viewport dimensions and calculate grid layout
 */
export function useViewportGrid() {
	const [dimensions, setDimensions] = useState<GridDimensions>(() => {
		// Server-side default
		if (typeof window === "undefined") {
			return calculateGridDimensions(1920, 1080);
		}
		return calculateGridDimensions(window.innerWidth, window.innerHeight);
	});

	const updateDimensions = useCallback(() => {
		const newDimensions = calculateGridDimensions(window.innerWidth, window.innerHeight);
		setDimensions(newDimensions);
	}, []);

	useEffect(() => {
		// Update on mount
		updateDimensions();

		// Update on resize with debounce
		let timeoutId: NodeJS.Timeout;
		const handleResize = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(updateDimensions, 100);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(timeoutId);
		};
	}, [updateDimensions]);

	return dimensions;
}

/**
 * Calculate how many views are needed for given number of widgets
 */
export function calculateViewCount(widgetCount: number, maxWidgetsPerView: number): number {
	return Math.ceil(widgetCount / maxWidgetsPerView);
}

/**
 * Get widgets for a specific view
 */
export function getWidgetsForView<T>(widgets: T[], viewIndex: number, maxWidgetsPerView: number): T[] {
	const startIndex = viewIndex * maxWidgetsPerView;
	const endIndex = startIndex + maxWidgetsPerView;
	return widgets.slice(startIndex, endIndex);
}
