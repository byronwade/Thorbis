import type { Slide } from "./slide-types";
import type { Widget } from "./widget-types";
import { getWidgetCellCount } from "./widget-types";

const GRID_CAPACITY = 16; // 4x4 grid = 16 cells

/**
 * Distributes widgets across slides based on grid capacity
 * Tries to pack widgets efficiently while respecting size constraints
 */
export function distributeWidgetsToSlides(widgets: Widget[]): Slide[] {
	if (widgets.length === 0) {
		return [];
	}

	const slides: Slide[] = [];
	let currentSlide: Widget[] = [];
	let currentCapacity = GRID_CAPACITY;

	// Sort widgets by size (largest first) for better packing
	const sortedWidgets = [...widgets].sort(
		(a, b) => getWidgetCellCount(b.size) - getWidgetCellCount(a.size)
	);

	for (const widget of sortedWidgets) {
		const widgetCells = getWidgetCellCount(widget.size);

		// Full-page widgets get their own slide
		if (widgetCells === GRID_CAPACITY) {
			// Save current slide if it has widgets
			if (currentSlide.length > 0) {
				slides.push(createSlide(currentSlide, slides.length));
				currentSlide = [];
				currentCapacity = GRID_CAPACITY;
			}

			// Create dedicated slide for full widget
			slides.push(createSlide([widget], slides.length));
			continue;
		}

		// Check if widget fits in current slide
		if (widgetCells <= currentCapacity) {
			currentSlide.push(widget);
			currentCapacity -= widgetCells;
		} else {
			// Start new slide
			slides.push(createSlide(currentSlide, slides.length));
			currentSlide = [widget];
			currentCapacity = GRID_CAPACITY - widgetCells;
		}
	}

	// Add remaining widgets to final slide
	if (currentSlide.length > 0) {
		slides.push(createSlide(currentSlide, slides.length));
	}

	return slides;
}

/**
 * Creates a slide object with proper ID and position
 */
function createSlide(widgets: Widget[], position: number): Slide {
	return {
		id: `slide-${position + 1}-${Date.now()}`,
		widgets,
		position,
	};
}

/**
 * Calculates optimal slide distribution to balance widget count across slides
 * Avoids single widget on last slide when possible
 */
export function optimizeSlideDistribution(widgets: Widget[]): Slide[] {
	const slides = distributeWidgetsToSlides(widgets);

	// If last slide has only 1 widget and it's not full-size, try to rebalance
	if (slides.length > 1) {
		const lastSlide = slides.at(-1);
		const secondLastSlide = slides.at(-2);

		if (
			lastSlide.widgets.length === 1 &&
			getWidgetCellCount(lastSlide.widgets[0].size) < GRID_CAPACITY
		) {
			// Try to move one widget from second-last to last slide
			const lastWidget = secondLastSlide.widgets.at(-1);
			const lastWidgetCells = getWidgetCellCount(lastWidget.size);
			const singleWidgetCells = getWidgetCellCount(lastSlide.widgets[0].size);

			// Only rebalance if both widgets fit together
			if (lastWidgetCells + singleWidgetCells <= GRID_CAPACITY) {
				secondLastSlide.widgets.pop();
				lastSlide.widgets.unshift(lastWidget);
			}
		}
	}

	return slides;
}

/**
 * Redistributes widgets when a widget is added, removed, or resized
 */
export function redistributeWidgets(currentSlides: Slide[], allWidgets: Widget[]): Slide[] {
	// Flatten current widgets and merge with new widgets
	const existingWidgetIds = new Set(currentSlides.flatMap((s) => s.widgets.map((w) => w.id)));
	const newWidgets = allWidgets.filter((w) => !existingWidgetIds.has(w.id));
	const allCurrentWidgets = [...currentSlides.flatMap((s) => s.widgets), ...newWidgets];

	// Re-distribute everything
	return optimizeSlideDistribution(allCurrentWidgets);
}

/**
 * Checks if a widget can fit in a specific slide
 */
export function canWidgetFitInSlide(slide: Slide, widget: Widget): boolean {
	const currentUsage = slide.widgets.reduce((sum, w) => sum + getWidgetCellCount(w.size), 0);
	const widgetCells = getWidgetCellCount(widget.size);
	return currentUsage + widgetCells <= GRID_CAPACITY;
}

/**
 * Moves a widget from one slide to another
 */
export function moveWidgetBetweenSlides(
	slides: Slide[],
	widgetId: string,
	targetSlideId: string
): Slide[] {
	const newSlides = slides.map((slide) => ({
		...slide,
		widgets: [...slide.widgets],
	}));

	// Find source and target slides
	const sourceSlide = newSlides.find((s) => s.widgets.some((w) => w.id === widgetId));
	const targetSlide = newSlides.find((s) => s.id === targetSlideId);

	if (!(sourceSlide && targetSlide)) {
		return slides;
	}

	// Find the widget
	const widgetIndex = sourceSlide.widgets.findIndex((w) => w.id === widgetId);
	if (widgetIndex === -1) {
		return slides;
	}

	const widget = sourceSlide.widgets[widgetIndex];

	// Check if widget can fit in target slide
	if (!canWidgetFitInSlide(targetSlide, widget)) {
		return slides;
	}

	// Move the widget
	sourceSlide.widgets.splice(widgetIndex, 1);
	targetSlide.widgets.push(widget);

	// Remove empty slides
	return newSlides.filter((slide) => slide.widgets.length > 0);
}

/**
 * Removes empty slides and renumbers remaining slides
 */
export function cleanupSlides(slides: Slide[]): Slide[] {
	return slides
		.filter((slide) => slide.widgets.length > 0)
		.map((slide, index) => ({
			...slide,
			position: index,
		}));
}
