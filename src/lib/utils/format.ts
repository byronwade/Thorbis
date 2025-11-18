/**
 * Centralized Formatting Utilities
 *
 * Unified formatting functions for currency, dates, phone numbers, and more.
 * Replaces duplicate implementations scattered across components.
 */

/**
 * Format currency from cents to dollars
 * @param cents - Amount in cents
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
	cents: number,
	options?: {
		decimals?: number;
		showSymbol?: boolean;
		currency?: string;
	},
): string {
	const { decimals = 2, showSymbol = true, currency = "USD" } = options ?? {};

	const formatter = new Intl.NumberFormat("en-US", {
		style: showSymbol ? "currency" : "decimal",
		currency,
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});

	return formatter.format(cents / 100);
}

/**
 * Format currency from dollars (not cents)
 * @param amount - Amount in dollars
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrencyFromDollars(
	amount: number | null | undefined,
	options?: {
		decimals?: number;
		showSymbol?: boolean;
		currency?: string;
	},
): string {
	if (amount == null || Number.isNaN(amount)) {
		return "$0";
	}

	const { decimals = 2, showSymbol = true, currency = "USD" } = options ?? {};

	const formatter = new Intl.NumberFormat("en-US", {
		style: showSymbol ? "currency" : "decimal",
		currency,
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});

	return formatter.format(amount);
}

/**
 * Format currency with compact notation (K/M abbreviations)
 * @param value - Amount in dollars
 * @param stage - Responsive stage
 * @returns Formatted currency string (e.g., "$1.2K", "$5M")
 */
export function formatCurrencyCompact(
	value: number,
	stage: "full" | "comfortable" | "compact" | "tiny" = "full",
): string {
	if (stage === "tiny" || stage === "compact") {
		// Ultra-compact: use K/M abbreviations
		if (value >= 1_000_000) {
			return `$${(value / 1_000_000).toFixed(1)}M`;
		}
		if (value >= 1000) {
			return `$${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}K`;
		}
		return `$${value.toFixed(0)}`;
	}

	if (stage === "comfortable") {
		// Compact with commas
		if (value >= 1_000_000) {
			return `$${(value / 1_000_000).toFixed(1)}M`;
		}
		if (value >= 1000) {
			return `$${value.toLocaleString()}`;
		}
		return `$${value.toFixed(2)}`;
	}

	// Full: complete with commas
	return `$${value.toLocaleString()}`;
}

/**
 * Format date with various format options
 * @param date - Date string, Date object, or null
 * @param format - Format type: 'short', 'long', 'datetime', 'time', or 'iso'
 * @param fallback - Fallback text when date is null/undefined (default: "—")
 * @returns Formatted date string
 */
export function formatDate(
	date: string | Date | null | undefined,
	format: "short" | "long" | "datetime" | "time" | "iso" = "short",
	fallback = "—",
): string {
	if (!date) {
		return fallback;
	}

	const dateObj = typeof date === "string" ? new Date(date) : date;

	if (Number.isNaN(dateObj.getTime())) {
		return fallback;
	}

	switch (format) {
		case "short": {
			// "Jan 15, 2024"
			return new Intl.DateTimeFormat("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}).format(dateObj);
		}

		case "long": {
			// "January 15, 2024"
			return new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			}).format(dateObj);
		}

		case "datetime": {
			// "Jan 15, 2024 · 2:30 PM"
			const dateFormatter = new Intl.DateTimeFormat("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			const timeFormatter = new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit",
			});
			return `${dateFormatter.format(dateObj)} · ${timeFormatter.format(dateObj)}`;
		}

		case "time": {
			// "2:30 PM"
			return new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit",
			}).format(dateObj);
		}

		case "iso": {
			// ISO string format
			return dateObj.toISOString();
		}

		default:
			return dateObj.toLocaleDateString("en-US");
	}
}

/**
 * Format date with time (convenience function)
 * @param date - Date string, Date object, or null
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted date with time string
 */
export function formatDateTime(
	date: string | Date | null | undefined,
	fallback = "—",
): string {
	return formatDate(date, "datetime", fallback);
}

/**
 * Format time only (convenience function)
 * @param date - Date string, Date object, or null
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted time string
 */
export function formatTime(
	date: string | Date | null | undefined,
	fallback = "—",
): string {
	return formatDate(date, "time", fallback);
}

/**
 * Format relative time (e.g., "2 hours ago", "Just now")
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Relative time string
 */
export function formatRelativeTime(
	date: Date | string,
	options?: {
		includeSeconds?: boolean;
		maxDays?: number;
	},
): string {
	const { includeSeconds = false, maxDays = 7 } = options ?? {};
	const dateObj = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - dateObj.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	const diffHours = Math.floor(diffMs / 3_600_000);
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (includeSeconds && diffMins < 1) {
		const diffSecs = Math.floor(diffMs / 1000);
		if (diffSecs < 10) {
			return "Just now";
		}
		return `${diffSecs}s ago`;
	}

	if (diffMins < 1) {
		return "Just now";
	}
	if (diffMins < 60) {
		return `${diffMins}m ago`;
	}
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	if (diffDays < maxDays) {
		return `${diffDays}d ago`;
	}

	// Fall back to short date format
	return formatDate(dateObj, "short");
}

/**
 * Format phone number to (XXX) XXX-XXXX format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, "");
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
	}
	if (cleaned.length === 11 && cleaned[0] === "1") {
		return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
	}
	return phone;
}

/**
 * Format number with locale-specific formatting
 * @param value - Number to format
 * @param options - Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
	value: number,
	options?: {
		minimumFractionDigits?: number;
		maximumFractionDigits?: number;
		useGrouping?: boolean;
	},
): string {
	const {
		minimumFractionDigits = 0,
		maximumFractionDigits = 2,
		useGrouping = true,
	} = options ?? {};

	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits,
		maximumFractionDigits,
		useGrouping,
	}).format(value);
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "45.5%")
 */
export function formatPercentage(value: number, decimals = 1): string {
	return `${value.toFixed(decimals)}%`;
}

/**
 * Format percentage with compact notation for responsive widgets
 * @param value - Percentage value
 * @param stage - Responsive stage
 * @returns Formatted percentage string
 */
export function formatPercentageCompact(
	value: number,
	stage: "full" | "comfortable" | "compact" | "tiny" = "full",
): string {
	if (stage === "tiny" || stage === "compact") {
		return `${Math.round(value)}%`;
	}
	return `${value.toFixed(1)}%`;
}
