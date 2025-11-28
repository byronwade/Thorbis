/**
 * Admin Formatters
 *
 * Re-export formatters from web app for shared component compatibility.
 */
export * from "@web/lib/formatters";

// Additional admin-specific formatters that aren't in web app

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(value: string | Date | null | undefined): string {
	if (!value) {
		return "—";
	}

	try {
		const date = typeof value === "string" ? new Date(value) : value;
		if (Number.isNaN(date.getTime())) {
			return "—";
		}

		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return "Today";
		}
		if (diffDays === 1) {
			return "Yesterday";
		}
		if (diffDays < 7) {
			return `${diffDays} days ago`;
		}
		if (diffDays < 30) {
			const weeks = Math.floor(diffDays / 7);
			return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
		}
		if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			return `${months} month${months > 1 ? "s" : ""} ago`;
		}
		const years = Math.floor(diffDays / 365);
		return `${years} year${years > 1 ? "s" : ""} ago`;
	} catch {
		return "—";
	}
}

/**
 * Format percentage values (admin-specific with decimals option)
 */
function formatPercent(value: number | null | undefined, options?: { decimals?: number }): string {
	if (value === null || value === undefined) {
		return "—";
	}
	const decimals = options?.decimals ?? 1;
	return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate and format rate as percentage
 */
export function formatRate(numerator: number, denominator: number, options?: { decimals?: number }): string {
	if (denominator === 0) {
		return "0%";
	}
	const rate = (numerator / denominator) * 100;
	return formatPercent(rate, options);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number | null | undefined, options?: { compact?: boolean; decimals?: number }): string {
	if (value === null || value === undefined) {
		return "—";
	}

	const decimals = options?.decimals ?? 0;

	if (options?.compact && value >= 1000) {
		return new Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(value);
	}

	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value);
}
