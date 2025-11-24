/**
 * Escapes special regex characters in a string to make it safe for use in RegExp
 * @param str - The string to escape
 * @returns The escaped string safe for use in a regex pattern
 */
export function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a case-insensitive regex from a search term, safely escaping special characters
 * @param searchTerm - The search term to convert to a regex
 * @returns A RegExp object safe for searching
 */
export function createSafeSearchRegex(searchTerm: string): RegExp {
	const escaped = escapeRegex(searchTerm);
	return new RegExp(escaped, 'gi');
}
