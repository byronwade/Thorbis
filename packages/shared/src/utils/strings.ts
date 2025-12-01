/**
 * String Utilities
 *
 * Common string manipulation functions
 */

// ============================================================================
// Case Conversion
// ============================================================================

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, "");
}

/**
 * Convert string to snake_case
 */
export function toSnakeCase(str: string): string {
	return str
		.replace(/([A-Z])/g, "_$1")
		.toLowerCase()
		.replace(/^_/, "")
		.replace(/\s+/g, "_");
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
	return str
		.replace(/([A-Z])/g, "-$1")
		.toLowerCase()
		.replace(/^-/, "")
		.replace(/\s+/g, "-");
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
			return word.toUpperCase();
		})
		.replace(/\s+/g, "");
}

// ============================================================================
// String Manipulation
// ============================================================================

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(
	str: string | null | undefined,
	maxLength: number,
	suffix: string = "...",
): string {
	if (!str) {
		return "";
	}
	if (str.length <= maxLength) {
		return str;
	}
	return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string | null | undefined): string {
	if (!str) {
		return "";
	}
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string | null | undefined): string {
	if (!str) {
		return "";
	}
	return str
		.split(" ")
		.map((word) => capitalize(word))
		.join(" ");
}

/**
 * Remove all whitespace
 */
export function removeWhitespace(str: string | null | undefined): string {
	if (!str) {
		return "";
	}
	return str.replace(/\s+/g, "");
}

// ============================================================================
// Slug Generation
// ============================================================================

/**
 * Convert string to URL-safe slug
 */
export function toSlug(str: string | null | undefined): string {
	if (!str) {
		return "";
	}
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}




