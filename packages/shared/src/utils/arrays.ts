/**
 * Array Utilities
 *
 * Common array manipulation functions
 */

// ============================================================================
// Array Operations
// ============================================================================

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
	return Array.from(new Set(array));
}

/**
 * Remove duplicates by key
 */
export function uniqueBy<T, K extends keyof T>(
	array: T[],
	key: K,
): T[] {
	const seen = new Set<T[K]>();
	return array.filter((item) => {
		const value = item[key];
		if (seen.has(value)) {
			return false;
		}
		seen.add(value);
		return true;
	});
}

/**
 * Group array by key
 */
export function groupBy<T, K extends keyof T>(
	array: T[],
	key: K,
): Record<string, T[]> {
	return array.reduce((acc, item) => {
		const groupKey = String(item[key]);
		if (!acc[groupKey]) {
			acc[groupKey] = [];
		}
		acc[groupKey].push(item);
		return acc;
	}, {} as Record<string, T[]>);
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

/**
 * Flatten nested array
 */
export function flatten<T>(array: (T | T[])[]): T[] {
	return array.flat();
}

/**
 * Sort array by key
 */
export function sortBy<T, K extends keyof T>(
	array: T[],
	key: K,
	direction: "asc" | "desc" = "asc",
): T[] {
	return [...array].sort((a, b) => {
		const aVal = a[key];
		const bVal = b[key];

		if (aVal < bVal) {
			return direction === "asc" ? -1 : 1;
		}
		if (aVal > bVal) {
			return direction === "asc" ? 1 : -1;
		}
		return 0;
	});
}

