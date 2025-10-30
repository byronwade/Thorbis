import { useMemo } from "react";
import { optimizeSlideDistribution } from "../slide-distributor";
import type { Slide } from "../slide-types";
import type { Widget } from "../widget-types";

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
