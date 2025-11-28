/**
 * Time Constants
 *
 * Centralized time-related constants for calculations
 */

// ============================================================================
// Time Units (in milliseconds)
// ============================================================================

export const TIME_UNITS = {
	millisecond: 1,
	second: 1000,
	minute: 60 * 1000,
	hour: 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	week: 7 * 24 * 60 * 60 * 1000,
	month: 30 * 24 * 60 * 60 * 1000,
	year: 365 * 24 * 60 * 60 * 1000,
} as const;

// Convenience export for common use case
export const MILLISECONDS_IN_DAY = TIME_UNITS.day;

// ============================================================================
// Time Units (in seconds)
// ============================================================================

export const TIME_UNITS_SECONDS = {
	second: 1,
	minute: 60,
	hour: 60 * 60,
	day: 24 * 60 * 60,
	week: 7 * 24 * 60 * 60,
	month: 30 * 24 * 60 * 60,
	year: 365 * 24 * 60 * 60,
} as const;

// ============================================================================
// Byte Units
// ============================================================================

export const BYTE_UNITS = {
	byte: 1,
	kilobyte: 1024,
	megabyte: 1024 * 1024,
	gigabyte: 1024 * 1024 * 1024,
	terabyte: 1024 * 1024 * 1024 * 1024,
} as const;

// ============================================================================
// Common Time Durations
// ============================================================================

export const DURATIONS = {
	millisecondsPerSecond: 1000,
	secondsPerMinute: 60,
	minutesPerHour: 60,
	hoursPerDay: 24,
	daysPerWeek: 7,
	daysPerMonth: 30,
	daysPerYear: 365,
} as const;

