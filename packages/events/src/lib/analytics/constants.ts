export const EVENT_TYPES = {
	PAGE_VIEW: "page_view",
	CLICK: "click",
	FORM_SUBMIT: "form_submit",
	HOVER: "hover",
	SCROLL: "scroll",
	NAVIGATION: "navigation",
	CUSTOM: "custom",
} as const;

export const DB_NAME = "thorbis-analytics";
export const DB_VERSION = 1;
export const MAX_CACHE_SIZE = 1000;
export const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
