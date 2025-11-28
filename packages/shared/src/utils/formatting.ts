/**
 * Formatting Utilities
 *
 * Centralized formatting functions for currency, dates, phone numbers, etc.
 */

import { CURRENCY_FORMATS, DATE_FORMATS, PHONE_FORMATS } from "../constants";

// ============================================================================
// Currency Formatting
// ============================================================================

export type CurrencyFormatOptions = {
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
	showZero?: boolean;
	decimals?: number;
};

/**
 * Format currency from cents to USD string
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

	const finalMaxFractionDigits =
		decimals !== undefined ? decimals : maximumFractionDigits;
	const finalMinFractionDigits =
		decimals !== undefined ? decimals : minimumFractionDigits;

	if (cents === null || cents === undefined) {
		return showZero
			? new Intl.NumberFormat(CURRENCY_FORMATS.defaultLocale, {
					style: "currency",
					currency: CURRENCY_FORMATS.defaultCurrency,
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
				}).format(0)
			: "$0.00";
	}

	return new Intl.NumberFormat(CURRENCY_FORMATS.defaultLocale, {
		style: "currency",
		currency: CURRENCY_FORMATS.defaultCurrency,
		minimumFractionDigits: finalMinFractionDigits,
		maximumFractionDigits: finalMaxFractionDigits,
	}).format(cents / 100);
}

/**
 * Format currency from dollars (not cents)
 */
export function formatCurrencyFromDollars(
	amount: number | null | undefined,
	options: CurrencyFormatOptions = {},
): string {
	if (amount === null || amount === undefined) {
		return formatCurrency(0, options);
	}
	return formatCurrency(Math.round(amount * 100), options);
}

// ============================================================================
// Date Formatting
// ============================================================================

export type DateFormatPreset =
	| "short"
	| "medium"
	| "long"
	| "full"
	| "table"
	| "time"
	| "datetime";

export type DateFormatOptions = {
	preset?: DateFormatPreset;
	custom?: Intl.DateTimeFormatOptions;
};

/**
 * Format date with preset or custom options
 */
export function formatDate(
	date: Date | string | null | undefined,
	options: DateFormatOptions = {},
): string {
	if (!date) {
		return "";
	}

	const dateObj = typeof date === "string" ? new Date(date) : date;

	if (isNaN(dateObj.getTime())) {
		return "";
	}

	const { preset = "medium", custom } = options;

	if (custom) {
		return new Intl.DateTimeFormat("en-US", custom).format(dateObj);
	}

	const presets: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
		short: { month: "short", day: "numeric", year: "numeric" },
		medium: { month: "short", day: "numeric", year: "numeric" },
		long: { month: "long", day: "numeric", year: "numeric" },
		full: {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		},
		table: { month: "short", day: "numeric", year: "numeric" },
		time: { hour: "numeric", minute: "2-digit", hour12: true },
		datetime: {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		},
	};

	return new Intl.DateTimeFormat("en-US", presets[preset]).format(dateObj);
}

/**
 * Format date and time together
 */
export function formatDateTime(
	date: Date | string | null | undefined,
): string {
	return formatDate(date, { preset: "datetime" });
}

/**
 * Format time only (no date)
 */
export function formatTime(
	date: Date | string | null | undefined,
): string {
	return formatDate(date, { preset: "time" });
}

/**
 * Format date range (start → end)
 */
export function formatDateRange(
	start: Date | string | null | undefined,
	end?: Date | string | null | undefined,
): string {
	if (!start) {
		return "";
	}

	const startDate = typeof start === "string" ? new Date(start) : start;
	if (isNaN(startDate.getTime())) {
		return "";
	}

	if (!end) {
		return formatDate(startDate, { preset: "short" });
	}

	const endDate = typeof end === "string" ? new Date(end) : end;
	if (isNaN(endDate.getTime())) {
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

// ============================================================================
// Phone Number Formatting
// ============================================================================

/**
 * Format phone number for display
 */
export function formatPhone(phone: string | null | undefined): string {
	if (!phone) {
		return "";
	}

	// Remove all non-digit characters
	const digits = phone.replace(/\D/g, "");

	// Format US numbers: (XXX) XXX-XXXX
	if (digits.length === 10) {
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
	}

	// Format with country code: +X (XXX) XXX-XXXX
	if (digits.length === 11 && digits[0] === "1") {
		return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	}

	// Return as-is if doesn't match expected format
	return phone;
}

// ============================================================================
// Percentage Formatting
// ============================================================================

/**
 * Format percentage
 */
export function formatPercentage(
	value: number | null | undefined,
	decimals: number = 1,
): string {
	if (value === null || value === undefined) {
		return "0%";
	}

	return new Intl.NumberFormat("en-US", {
		style: "percent",
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value / 100);
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with commas
 */
export function formatNumber(
	value: number | null | undefined,
	decimals: number = 0,
): string {
	if (value === null || value === undefined) {
		return "0";
	}

	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value);
}

