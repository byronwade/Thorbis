/**
 * Formatting Utilities - Re-export from shared package
 *
 * This file maintains backward compatibility for existing imports.
 * New code should import directly from @stratos/shared/utils
 *
 * @deprecated Use @stratos/shared/utils for formatting functions
 */

// Re-export all formatting functions from shared package
export {
	formatCurrency,
	formatCurrencyFromDollars,
	formatDate,
	formatDateTime,
	formatTime,
	formatDateRange,
	formatPercentage,
	formatNumber,
	type CurrencyFormatOptions,
	type DateFormatPreset,
	type DateFormatOptions,
} from "@stratos/shared/utils/formatting";
