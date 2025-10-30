/**
 * useWidgetScrollSpy Hook
 *
 * Tracks which widget is currently visible in the viewport using IntersectionObserver.
 * Returns the ID of the active (most visible) widget for navigation highlighting.
 *
 * Features:
 * - Automatic cleanup on unmount
 * - Configurable thresholds and margins
 * - Performance optimized with IntersectionObserver
 * - Handles dynamic widget addition/removal
 *
 * @param widgetIds - Array of widget IDs to observe
 * @param options - Configuration options for IntersectionObserver
 * @returns activeWidgetId - ID of currently visible widget (null if none)
 */

import { useEffect, useState } from "react";

interface ScrollSpyOptions {
  /**
   * Percentage of widget that must be visible to be considered "active"
   * Default: 0.5 (50%)
   */
  threshold?: number;

  /**
   * Margin around the root element (viewport)
   * Positive values expand the area, negative values shrink it
   * Format: "top right bottom left" (e.g., "-100px 0px -50% 0px")
   * Default: "-100px 0px -50% 0px" (accounts for header and footer)
   */
  rootMargin?: string;
}

export function useWidgetScrollSpy(
  widgetIds: string[],
  options: ScrollSpyOptions = {}
): string | null {
  const { threshold = 0.5, rootMargin = "-100px 0px -50% 0px" } = options;

  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);

  useEffect(() => {
    // Don't run if no widgets to observe
    if (widgetIds.length === 0) {
      setActiveWidgetId(null);
      return;
    }

    // Keep track of intersection ratios for all widgets
    const intersectionRatios = new Map<string, number>();

    // Create IntersectionObserver to track widget visibility
    const observer = new IntersectionObserver(
      (entries) => {
        // Update intersection ratios for all observed entries
        for (const entry of entries) {
          const widgetId = entry.target.id.replace("widget-", "");
          intersectionRatios.set(widgetId, entry.intersectionRatio);
        }

        // Find the widget with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleWidget: string | null = null;

        for (const [widgetId, ratio] of intersectionRatios) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleWidget = widgetId;
          }
        }

        // Only update if there's a widget that meets the threshold
        if (mostVisibleWidget && maxRatio >= threshold) {
          setActiveWidgetId(mostVisibleWidget);
        } else if (maxRatio === 0) {
          // No widgets are visible
          setActiveWidgetId(null);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all widget elements
    for (const widgetId of widgetIds) {
      const element = document.getElementById(`widget-${widgetId}`);
      if (element) {
        observer.observe(element);
      }
    }

    // Cleanup: disconnect observer on unmount or when widgetIds change
    return () => {
      observer.disconnect();
      intersectionRatios.clear();
    };
  }, [widgetIds, threshold, rootMargin]);

  return activeWidgetId;
}

/**
 * Alternative hook for simpler use cases where you just want to know
 * if a specific widget is visible
 */
export function useIsWidgetVisible(widgetId: string, threshold = 0.5): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById(`widget-${widgetId}`);
    if (!element) {
      setIsVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [widgetId, threshold]);

  return isVisible;
}
