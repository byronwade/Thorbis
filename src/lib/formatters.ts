/**
 * Centralized Formatting Utilities
 *
 * Professional formatting functions following DRY principles.
 * Handles currency, dates, percentages, and other common formatting needs.
 *
 * Features:
 * - Type-safe with proper null/undefined handling
 * - Consistent formatting across the application
 * - Flexible options for different use cases
 * - Locale-aware formatting
 */

export type CurrencyFormatOptions = {
	/** Minimum fraction digits (default: 0) */
	minimumFractionDigits?: number;
	/** Maximum fraction digits (default: 2) */
	maximumFractionDigits?: number;
	/** Show zero as "$0.00" or "$0" (default: true) */
	showZero?: boolean;
	/** Decimal places (alias for maximumFractionDigits, for convenience) */
	decimals?: number;
};

export type DateFormatPreset =
	| "short" // "Jan 15, 2024"
	| "medium" // "Jan 15, 2024"
	| "long" // "January 15, 2024"
	| "full" // "Monday, January 15, 2024"
	| "table" // "Jan 15, 2024" (optimized for tables)
	| "time" // "2:30 PM"
	| "datetime"; // "Jan 15, 2024, 2:30 PM"

export type DateFormatOptions = {
	/** Preset format style */
	preset?: DateFormatPreset;
	/** Custom format options (overrides preset) */
	custom?: Intl.DateTimeFormatOptions;
};

/**
 * Format currency from cents to USD string
 *
 * @param cents - Amount in cents (can be null/undefined)
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "$1,234.56")
 *
 * @example
 * formatCurrency(123456) // "$1,234.56"
 * formatCurrency(null) // "$0.00"
 * formatCurrency(123456, { minimumFractionDigits: 0 }) // "$1,235"
 */
export function formatCurrency(
	cents: number | null | undefined,
	options: CurrencyFormatOptions = {},
): string {
	const {
		minimumFractionDigits = 0,
		maximumFractionDigits = options.decimals ?? 2,
		showZero = true,
		decimals,
	} = options;

	// Use decimals if provided, otherwise use maximumFractionDigits
	const finalMaxFractionDigits =
		decimals !== undefined ? decimals : maximumFractionDigits;
	const finalMinFractionDigits =
		decimals !== undefined ? decimals : minimumFractionDigits;

	if (cents === null || cents === undefined) {
		return showZero
			? new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}).format(0)
			: "$0.00";
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: finalMinFractionDigits,
		maximumFractionDigits: finalMaxFractionDigits,
	}).format(cents / 100);
}

/**
 * Format currency from dollars (not cents)
 *
 * @param amount - Amount in dollars (can be null/undefined)
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrencyFromDollars(1234.56) // "$1,234.56"
 * formatCurrencyFromDollars(null) // "$0.00"
 */
export function formatCurrencyFromDollars(
	amount: number | null | undefined,
	options: CurrencyFormatOptions = {},
): string {
	const {
		minimumFractionDigits = 0,
		maximumFractionDigits = options.decimals ?? 2,
		showZero = true,
		decimals,
	} = options;

	// Use decimals if provided, otherwise use maximumFractionDigits
	const finalMaxFractionDigits =
		decimals !== undefined ? decimals : maximumFractionDigits;
	const finalMinFractionDigits =
		decimals !== undefined ? decimals : minimumFractionDigits;

	if (amount === null || amount === undefined || Number.isNaN(amount)) {
		return showZero
			? new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}).format(0)
			: "$0.00";
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: finalMinFractionDigits,
		maximumFractionDigits: finalMaxFractionDigits,
	}).format(amount);
}

/**
 * Format date with flexible presets or custom options
 *
 * @param date - Date value (Date, number, string, or null)
 * @param options - Formatting options
 * @returns Formatted date string or "—" if null
 *
 * @example
 * formatDate(new Date()) // "Jan 15, 2024"
 * formatDate(new Date(), { preset: "long" }) // "January 15, 2024"
 * formatDate(null) // "—"
 */
export function formatDate(
	date: Date | number | string | null | undefined,
	options: DateFormatOptions | DateFormatPreset | string = {},
): string {
	if (!date) {
		return "—";
	}

	const dateObj =
		typeof date === "number" || typeof date === "string"
			? new Date(date)
			: date;

	if (Number.isNaN(dateObj.getTime())) {
		return "—";
	}

	// Handle backward compatibility: string format parameter
	let preset: DateFormatPreset = "table";
	let custom: Intl.DateTimeFormatOptions | undefined;

	if (typeof options === "string") {
		// Legacy format: formatDate(date, "short")
		preset = (options as DateFormatPreset) || "table";
	} else {
		preset = options.preset || "table";
		custom = options.custom;
	}

	// Preset configurations
	const presetConfigs: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
		short: {
			month: "short",
			day: "numeric",
			year: "numeric",
		},
		medium: {
			month: "short",
			day: "numeric",
			year: "numeric",
		},
		long: {
			month: "long",
			day: "numeric",
			year: "numeric",
		},
		full: {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		},
		table: {
			month: "short",
			day: "numeric",
			year: "numeric",
		},
		time: {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		},
		datetime: {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		},
	};

	const formatOptions = custom || presetConfigs[preset];

	return new Intl.DateTimeFormat("en-US", formatOptions).format(dateObj);
}

/**
 * Format date and time together
 *
 * @param date - Date value
 * @returns Formatted date + time string
 *
 * @example
 * formatDateTime(new Date()) // "Jan 15, 2024, 2:30 PM"
 */
export function formatDateTime(
	date: Date | number | string | null | undefined,
): string {
	return formatDate(date, { preset: "datetime" });
}

/**
 * Format time only (no date)
 *
 * @param date - Date value
 * @returns Formatted time string (e.g., "2:30 PM")
 *
 * @example
 * formatTime(new Date()) // "2:30 PM"
 */
export function formatTime(
	date: Date | number | string | null | undefined,
): string {
	return formatDate(date, { preset: "time" });
}

/**
 * Format date range (start → end)
 *
 * @param start - Start date
 * @param end - End date (optional)
 * @returns Formatted date range string
 *
 * @example
 * formatDateRange(new Date("2024-01-15"), new Date("2024-01-20")) // "Jan 15 → Jan 20, 2024"
 */
export function formatDateRange(
	start: Date | number | string | null | undefined,
	end?: Date | number | string | null | undefined,
): string {
	if (!start) {
		return "—";
	}

	const startDate =
		typeof start === "number" || typeof start === "string"
			? new Date(start)
			: start;

	if (Number.isNaN(startDate.getTime())) {
		return "—";
	}

	if (!end) {
		return formatDate(startDate, { preset: "short" });
	}

	const endDate =
		typeof end === "number" || typeof end === "string" ? new Date(end) : end;

	if (Number.isNaN(endDate.getTime())) {
		return formatDate(startDate, { preset: "short" });
	}

	// Check if same day
	const sameDay =
		startDate.getFullYear() === endDate.getFullYear() &&
		startDate.getMonth() === endDate.getMonth() &&
		startDate.getDate() === endDate.getDate();

	if (sameDay) {
		return formatDate(startDate, { preset: "short" });
	}

	// Format range
	const startFormatted = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	}).format(startDate);

	const endFormatted = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(endDate);

	return `${startFormatted} → ${endFormatted}`;
}

/**
 * Format percentage value
 *
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(45.5) // "46%"
 * formatPercentage(45.5, 1) // "45.5%"
 */
function formatPercentage(
	value: number | null | undefined,
	decimals = 0,
): string {
	if (value === null || value === undefined) {
		return "—";
	}

	return `${value.toFixed(decimals)}%`;
}

/**
 * Format hours (decimal to "Xh Ym" format)
 *
 * @param hours - Hours as decimal number
 * @returns Formatted hours string
 *
 * @example
 * formatHours(2.5) // "2h 30m"
 * formatHours(1.25) // "1h 15m"
 */
function formatHours(hours: number | null | undefined): string {
	if (hours === null || hours === undefined) {
		return "0h";
	}

	const wholeHours = Math.floor(hours);
	const minutes = Math.round((hours - wholeHours) * 60);

	if (minutes === 0) {
		return `${wholeHours}h`;
	}

	return `${wholeHours}h ${minutes}m`;
}

/**
 * Format number with thousand separators
 *
 * @param value - Number value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.56, 2) // "1,234.56"
 */
function formatNumber(
	value: number | null | undefined,
	decimals = 0,
): string {
	if (value === null || value === undefined) {
		return "0";
	}

	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value);
}
