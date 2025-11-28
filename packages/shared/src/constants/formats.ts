/**
 * Format Strings and Patterns
 *
 * Centralized format strings, regex patterns, and formatting constants
 */

// ============================================================================
// Regex Patterns
// ============================================================================

export const REGEX_PATTERNS = {
	// Phone number (E.164 format)
	phoneE164: /^\+?[1-9]\d{1,14}$/,
	// US ZIP code
	zipCode: /^\d{5}(-\d{4})?$/,
	// Email
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	// URL
	url: /^https?:\/\/.+/,
	// UUID
	uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
	// Alphanumeric with spaces and hyphens
	slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
	// Currency (cents)
	currencyCents: /^\d+$/,
} as const;

// ============================================================================
// Date/Time Formats
// ============================================================================

export const DATE_FORMATS = {
	iso: "YYYY-MM-DDTHH:mm:ss.SSSZ",
	date: "YYYY-MM-DD",
	time: "HH:mm:ss",
	dateTime: "YYYY-MM-DD HH:mm:ss",
	displayDate: "MMM DD, YYYY",
	displayDateTime: "MMM DD, YYYY HH:mm",
	displayTime: "h:mm A",
} as const;

// ============================================================================
// Currency Formats
// ============================================================================

export const CURRENCY_FORMATS = {
	defaultLocale: "en-US",
	defaultCurrency: "USD",
	displayFormat: {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	},
} as const;

// ============================================================================
// Phone Number Formats
// ============================================================================

export const PHONE_FORMATS = {
	us: {
		display: "(XXX) XXX-XXXX",
		e164: "+1XXXXXXXXXX",
		national: "XXXXXXXXXX",
	},
} as const;

// ============================================================================
// File Extension Patterns
// ============================================================================

export const FILE_EXTENSIONS = {
	images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"],
	documents: [
		".pdf",
		".doc",
		".docx",
		".xls",
		".xlsx",
		".ppt",
		".pptx",
		".txt",
		".csv",
	],
	videos: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
	audio: [".mp3", ".wav", ".ogg", ".m4a", ".aac"],
} as const;

// ============================================================================
// MIME Type Patterns
// ============================================================================

export const MIME_TYPES = {
	images: [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		"image/bmp",
	],
	documents: [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"text/plain",
		"text/csv",
	],
	videos: [
		"video/mp4",
		"video/avi",
		"video/quicktime",
		"video/x-msvideo",
		"video/webm",
	],
} as const;

