/**
 * View Pagination Hook - Apple-style view management
 *
 * Manages multiple views when widgets exceed viewport capacity
 * Automatically creates new views as widgets are added
 * Similar to iOS home screen pagination
 */

import { useCallback, useMemo } from "react";
import { calculateWidgetCells, convertLegacySize } from "../apple-grid-layout";
import type { Widget } from "../widget-types";
import type { GridDimensions } from "./use-viewport-grid";

export type View = {
  id: string;
  index: number;
  widgets: Widget[];
  usedCells: number;
  availableCells: number;
  isFull: boolean;
};

/**
 * Calculate views based on widgets and grid dimensions
 */
export function useViewPagination(
  widgets: Widget[],
  dimensions: GridDimensions
) {
  // Calculate views and distribute widgets
  const views = useMemo(
    () => distributeWidgetsToViews(widgets, dimensions),
    [widgets, dimensions]
  );

  // Get widgets for a specific view
  const getViewWidgets = useCallback(
    (viewIndex: number): Widget[] => {
      const view = views.find((v) => v.index === viewIndex);
      return view?.widgets || [];
    },
    [views]
  );

  // Check if widget can fit in a specific view
  const canFitInView = useCallback(
    (widget: Widget, viewIndex: number): boolean => {
      const view = views.find((v) => v.index === viewIndex);
      if (!view) return false;

      const widgetSize = convertLegacySize(widget.size);
      const widgetCells = calculateWidgetCells(widgetSize);

      return widgetCells <= view.availableCells;
    },
    [views]
  );

  // Find the best view for a new widget
  const findBestViewForWidget = useCallback(
    (widget: Widget): number => {
      const widgetSize = convertLegacySize(widget.size);
      const widgetCells = calculateWidgetCells(widgetSize);

      // Try to fit in existing views first
      for (const view of views) {
        if (widgetCells <= view.availableCells) {
          return view.index;
        }
      }

      // Create new view
      return views.length;
    },
    [views]
  );

  return {
    views,
    viewCount: views.length,
    getViewWidgets,
    canFitInView,
    findBestViewForWidget,
  };
}

/**
 * Distribute widgets across views based on grid capacity
 */
function distributeWidgetsToViews(
  widgets: Widget[],
  dimensions: GridDimensions
): View[] {
  if (widgets.length === 0) {
    return [];
  }

  const maxCellsPerView = dimensions.maxWidgetsPerView;
  const views: View[] = [];
  let currentView: Widget[] = [];
  let currentUsedCells = 0;

  // Sort widgets by size (largest first) for optimal packing
  const sortedWidgets = [...widgets].sort((a, b) => {
    const sizeA = convertLegacySize(a.size);
    const sizeB = convertLegacySize(b.size);
    return calculateWidgetCells(sizeB) - calculateWidgetCells(sizeA);
  });

  for (const widget of sortedWidgets) {
    const widgetSize = convertLegacySize(widget.size);
    const widgetCells = calculateWidgetCells(widgetSize);

    // Check if widget fits in current view
    if (currentUsedCells + widgetCells <= maxCellsPerView) {
      currentView.push(widget);
      currentUsedCells += widgetCells;
    } else {
      // Save current view and start new one
      if (currentView.length > 0) {
        views.push(createView(currentView, views.length, maxCellsPerView));
      }
      currentView = [widget];
      currentUsedCells = widgetCells;
    }
  }

  // Add remaining widgets to final view
  if (currentView.length > 0) {
    views.push(createView(currentView, views.length, maxCellsPerView));
  }

  return views;
}

/**
 * Create a view object with metadata
 */
function createView(widgets: Widget[], index: number, maxCells: number): View {
  const usedCells = widgets.reduce((sum, widget) => {
    const size = convertLegacySize(widget.size);
    return sum + calculateWidgetCells(size);
  }, 0);

  return {
    id: `view-${index + 1}`,
    index,
    widgets,
    usedCells,
    availableCells: maxCells - usedCells,
    isFull: usedCells >= maxCells,
  };
}

/**
 * Optimize view distribution to balance widgets across views
 */
export function optimizeViewDistribution(views: View[]): View[] {
  if (views.length <= 1) return views;

  // If last view has very few cells used, try to rebalance
  const lastView = views[views.length - 1];
  const secondLastView = views[views.length - 2];

  if (lastView.usedCells < lastView.availableCells * 0.3 && views.length > 1) {
    // Try to move some widgets from second-last view
    const widgetsToMove = secondLastView.widgets.slice(-2);
    const cellsToMove = widgetsToMove.reduce(
      (sum, w) => sum + calculateWidgetCells(convertLegacySize(w.size)),
      0
    );

    // Only move if it doesn't overflow the last view
    if (
      cellsToMove + lastView.usedCells <=
      lastView.availableCells + lastView.usedCells
    ) {
      secondLastView.widgets = secondLastView.widgets.slice(0, -2);
      lastView.widgets = [...widgetsToMove, ...lastView.widgets];

      // Recalculate used cells
      secondLastView.usedCells -= cellsToMove;
      secondLastView.availableCells += cellsToMove;
      lastView.usedCells += cellsToMove;
      lastView.availableCells -= cellsToMove;
    }
  }

  return views;
}
