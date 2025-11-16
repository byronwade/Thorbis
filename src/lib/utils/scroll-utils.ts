/**
 * Scroll Utility Functions
 *
 * Helper functions for smooth scrolling and widget position calculations
 * Used by Widget Navigator and Mini-Navigator components
 */

/**
 * Smoothly scrolls to a widget by ID
 *
 * @param widgetId - The widget ID (without "widget-" prefix)
 * @param options - ScrollIntoView options
 * @returns boolean - True if widget was found and scrolled to, false otherwise
 */
export function scrollToWidget(
	widgetId: string,
	options: ScrollIntoViewOptions = {
		behavior: "smooth",
		block: "start",
		inline: "nearest",
	},
): boolean {
	const element = document.getElementById(`widget-${widgetId}`);

	if (!element) {
		return false;
	}

	element.scrollIntoView(options);
	return true;
}

/**
 * Gets the position information for a widget
 *
 * @param widgetId - The widget ID (without "widget-" prefix)
 * @returns Position object with top, bottom, height, and percentage from top
 */
export function getWidgetPosition(widgetId: string): {
	top: number;
	bottom: number;
	height: number;
	percentageFromTop: number;
} | null {
	const element = document.getElementById(`widget-${widgetId}`);

	if (!element) {
		return null;
	}

	const rect = element.getBoundingClientRect();
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const documentHeight = document.documentElement.scrollHeight;

	const top = rect.top + scrollTop;
	const bottom = top + rect.height;
	const percentageFromTop = (top / documentHeight) * 100;

	return {
		top,
		bottom,
		height: rect.height,
		percentageFromTop,
	};
}

/**
 * Gets all widget positions sorted by their vertical position
 *
 * @param widgetIds - Array of widget IDs
 * @returns Array of widget positions with IDs
 */
export function getAllWidgetPositions(widgetIds: string[]): Array<{
	id: string;
	top: number;
	bottom: number;
	height: number;
	percentageFromTop: number;
}> {
	const positions = widgetIds
		.map((id) => {
			const position = getWidgetPosition(id);
			return position ? { id, ...position } : null;
		})
		.filter((p): p is NonNullable<typeof p> => p !== null);

	// Sort by vertical position (top to bottom)
	return positions.sort((a, b) => a.top - b.top);
}

/**
 * Calculates the scroll percentage of the entire page
 *
 * @returns number - Percentage scrolled (0-100)
 */
export function getScrollPercentage(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;

	if (scrollHeight === clientHeight) {
		return 0; // No scrolling possible
	}

	return (scrollTop / (scrollHeight - clientHeight)) * 100;
}

/**
 * Checks if a widget is currently in the viewport
 *
 * @param widgetId - The widget ID (without "widget-" prefix)
 * @param threshold - Percentage of widget that must be visible (0-1)
 * @returns boolean - True if widget is visible, false otherwise
 */
export function isWidgetInViewport(widgetId: string, threshold = 0.5): boolean {
	const element = document.getElementById(`widget-${widgetId}`);

	if (!element) {
		return false;
	}

	const rect = element.getBoundingClientRect();
	const windowHeight =
		window.innerHeight || document.documentElement.clientHeight;

	// Calculate how much of the element is visible
	const visibleHeight =
		Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
	const visiblePercentage = visibleHeight / rect.height;

	return visiblePercentage >= threshold;
}

/**
 * Scrolls to the next widget in the list
 *
 * @param currentWidgetId - Current widget ID
 * @param widgetIds - Array of all widget IDs in order
 * @returns boolean - True if scrolled to next widget, false if at end
 */
export function scrollToNextWidget(
	currentWidgetId: string,
	widgetIds: string[],
): boolean {
	const currentIndex = widgetIds.indexOf(currentWidgetId);

	if (currentIndex === -1 || currentIndex === widgetIds.length - 1) {
		return false; // Widget not found or already at last widget
	}

	const nextWidgetId = widgetIds[currentIndex + 1];
	return scrollToWidget(nextWidgetId);
}

/**
 * Scrolls to the previous widget in the list
 *
 * @param currentWidgetId - Current widget ID
 * @param widgetIds - Array of all widget IDs in order
 * @returns boolean - True if scrolled to previous widget, false if at start
 */
export function scrollToPreviousWidget(
	currentWidgetId: string,
	widgetIds: string[],
): boolean {
	const currentIndex = widgetIds.indexOf(currentWidgetId);

	if (currentIndex <= 0) {
		return false; // Widget not found or already at first widget
	}

	const previousWidgetId = widgetIds[currentIndex - 1];
	return scrollToWidget(previousWidgetId);
}
