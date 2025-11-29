/**
 * Application Limits
 *
 * Centralized limits for file sizes, pagination, validation, etc.
 */

// ============================================================================
// File Size Limits (in bytes)
// ============================================================================

export const FILE_SIZE_LIMITS = {
	avatar: 5 * 1024 * 1024, // 5MB
	image: 20 * 1024 * 1024, // 20MB
	document: 100 * 1024 * 1024, // 100MB
	video: 250 * 1024 * 1024, // 250MB
	general: 250 * 1024 * 1024, // 250MB
	invoice: 20 * 1024 * 1024, // 20MB
	estimate: 20 * 1024 * 1024, // 20MB
	contract: 50 * 1024 * 1024, // 50MB
} as const;

// ============================================================================
// Pagination Limits
// ============================================================================

export const PAGINATION = {
	defaultPageSize: 50,
	minPageSize: 1,
	maxPageSize: 100,
	compactPageSize: 20,
	nestedPageSize: 10,
} as const;

// ============================================================================
// Validation Limits
// ============================================================================

export const VALIDATION_LIMITS = {
	name: {
		min: 2,
		max: 100,
	},
	companyName: {
		min: 2,
		max: 200,
	},
	phone: {
		minDigits: 10,
	},
	password: {
		min: 8,
		max: 100,
	},
	email: {
		max: 255,
	},
	description: {
		max: 5000,
	},
	notes: {
		max: 10000,
	},
} as const;

// ============================================================================
// Archive Limits
// ============================================================================

export const ARCHIVE_LIMITS = {
	min: 1,
	max: 100,
	default: 50,
} as const;

// ============================================================================
// Bulk Operation Limits
// ============================================================================

export const BULK_LIMITS = {
	maxItems: 1000,
	maxBatchSize: 100,
} as const;

// ============================================================================
// API Limits
// ============================================================================

export const API_LIMITS = {
	maxRequestSize: 10 * 1024 * 1024, // 10MB
	maxArrayLength: 1000,
	maxStringLength: 10000,
} as const;


