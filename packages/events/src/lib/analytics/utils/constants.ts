export const DB_NAME = "thorbis-analytics";
export const DB_VERSION = 1;

export const MAX_CACHE_SIZE = 1000;
export const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const STORAGE_KEY = "thorbis_analytics";
export const SESSION_KEY = "thorbis_current_session";

export const ONE_DAY = 24 * 60 * 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_MINUTE = 60 * 1000;

export const PERFORMANCE_THRESHOLDS = {
	GOOD: 1000, // 1 second
	ACCEPTABLE: 3000, // 3 seconds
	POOR: 5000, // 5 seconds
} as const;

export const EVENT_TYPES = {
	CLICK: "click",
	SCROLL: "scroll",
	HOVER: "hover",
	NAVIGATION: "navigation",
	FORM: "form",
	CUSTOM: "custom",
	ERROR: "error",
	PAGE_VIEW: "page_view",
} as const;

export type PerformanceThreshold = keyof typeof PERFORMANCE_THRESHOLDS;
export type EventType = keyof typeof EVENT_TYPES;
