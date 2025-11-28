/**
 * Application Defaults
 *
 * Centralized default values used throughout the application
 */

// ============================================================================
// Time Defaults
// ============================================================================

export const TIME_DEFAULTS = {
	confirmationTokenTTLHours: 24,
	permanentDeleteBufferDays: 90,
	sessionTimeoutMinutes: 30,
	refreshTokenTTLDays: 7,
} as const;

// Convenience export for common use case
export const PERMANENT_DELETE_BUFFER_DAYS = TIME_DEFAULTS.permanentDeleteBufferDays;

// ============================================================================
// Date Range Defaults
// ============================================================================

export const DATE_RANGE_DEFAULTS = {
	"7days": 7,
	"30days": 30,
	"90days": 90,
} as const;

export type DateRangeKey = keyof typeof DATE_RANGE_DEFAULTS;

// ============================================================================
// Status Defaults
// ============================================================================

export const STATUS_DEFAULTS = {
	customer: "active",
	job: "scheduled",
	invoice: "draft",
	estimate: "draft",
	priority: "medium",
} as const;

// ============================================================================
// Country/Region Defaults
// ============================================================================

export const COUNTRY_DEFAULTS = {
	us: {
		code: "1",
		nationalNumberDigits: 10,
		extendedNumberDigits: 11,
	},
} as const;

// ============================================================================
// Table Defaults
// ============================================================================

export const TABLE_DEFAULTS = {
	itemsPerPage: 50,
	compactItemsPerPage: 20,
	nestedItemsPerPage: 10,
	virtualRowHeight: {
		full: 60,
		compact: 48,
		nested: 40,
	},
	virtualOverscan: 5,
} as const;

// ============================================================================
// Search Defaults
// ============================================================================

export const SEARCH_DEFAULTS = {
	debounceMs: 300,
	minQueryLength: 2,
	maxResults: 100,
} as const;

// ============================================================================
// Rate Limiting Defaults
// ============================================================================

export const RATE_LIMIT_DEFAULTS = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 100,
} as const;

