import { useMemo } from "react";
import type { Widget } from "../widget-types";
import type { Slide } from "../slide-types";
import { optimizeSlideDistribution } from "../slide-distributor";

/**
 * Hook to automatically distribute widgets across slides
 * Recalculates whenever widgets change
 */
export function useSlideDistribution(widgets: Widget[]): Slide[] {
  return useMemo(() => {
    if (widgets.length === 0) {
      return [];
    }
    return optimizeSlideDistribution(widgets);
  }, [widgets]);
}
