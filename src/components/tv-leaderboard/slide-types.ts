import type { Widget } from "./widget-types";

export type Slide = {
  id: string;
  widgets: Widget[];
  position: number;
};

export type SlideSettings = {
  autoRotate: boolean;
  rotationInterval: number;
  pauseOnInteraction: boolean;
  inactivityTimeout: number;
};

export type SlideState = {
  slides: Slide[];
  currentSlide: number;
  settings: SlideSettings;
};

export const DEFAULT_SLIDE_SETTINGS: SlideSettings = {
  autoRotate: true,
  rotationInterval: 30_000, // 30 seconds
  pauseOnInteraction: true,
  inactivityTimeout: 10_000, // 10 seconds
};

export const STORAGE_KEY_SLIDES = "tv-leaderboard-slides";
export const STORAGE_KEY_SETTINGS = "tv-leaderboard-settings";
