/**
 * Activity Timeline Settings Store - Zustand State Management
 *
 * Manages user preferences for activity timeline display:
 * - Density/compactness (text-only, small, medium, large)
 * - Filter preferences
 * - Persisted to localStorage
 *
 * Uses Zustand (NOT React Context) following project standards
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Density options for timeline display
export type TimelineDensity = "text-only" | "small" | "medium" | "large";

type ActivityTimelineStore = {
  // Density/compactness setting
  density: TimelineDensity;
  setDensity: (density: TimelineDensity) => void;

  // Show/hide elements based on density
  showIcons: boolean;
  showAvatars: boolean;
  showAttachmentPreviews: boolean;
  showMetadata: boolean;

  // Spacing values (in Tailwind classes)
  itemSpacing: string;
  iconSize: string;
  textSize: string;
  avatarSize: string;

  // Apply density settings
  applyDensity: (density: TimelineDensity) => void;
};

// Density presets
const DENSITY_PRESETS: Record<
  TimelineDensity,
  {
    showIcons: boolean;
    showAvatars: boolean;
    showAttachmentPreviews: boolean;
    showMetadata: boolean;
    itemSpacing: string;
    iconSize: string;
    textSize: string;
    avatarSize: string;
    // PERFORMANCE: Skip hydration to prevent SSR mismatches
    // Allows Next.js to generate static pages without Zustand errors
    skipHydration: true;
  }
> = {
  "text-only": {
    showIcons: false,
    showAvatars: false,
    showAttachmentPreviews: false,
    showMetadata: false,
    itemSpacing: "space-y-1",
    iconSize: "size-0",
    textSize: "text-xs",
    avatarSize: "size-0",
    skipHydration: true as const,
  },
  small: {
    showIcons: true,
    showAvatars: false,
    showAttachmentPreviews: false,
    showMetadata: false,
    itemSpacing: "space-y-2",
    iconSize: "size-4",
    textSize: "text-sm",
    avatarSize: "size-6",
    skipHydration: true as const,
  },
  medium: {
    showIcons: true,
    showAvatars: true,
    showAttachmentPreviews: true,
    showMetadata: true,
    itemSpacing: "space-y-3",
    iconSize: "size-4",
    textSize: "text-sm",
    avatarSize: "size-8",
    skipHydration: true as const,
  },
  large: {
    showIcons: true,
    showAvatars: true,
    showAttachmentPreviews: true,
    showMetadata: true,
    itemSpacing: "space-y-8",
    iconSize: "size-6",
    textSize: "text-lg",
    avatarSize: "size-12",
    skipHydration: true as const,
  },
};

export const useActivityTimelineStore = create<ActivityTimelineStore>()(
  persist(
    (set) => ({
      // Default to medium density
      density: "medium",
      ...DENSITY_PRESETS.medium,

      setDensity: (density) => set({ density }),

      applyDensity: (density) => {
        const preset = DENSITY_PRESETS[density];
        set({
          density,
          ...preset,
        });
      },
    }),
    {
      name: "activity-timeline-settings",
      partialize: (state) => ({
        density: state.density,
      }),
    }
  )
);
