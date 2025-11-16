/**
 * Price Book Utilities
 *
 * Shared helper functions for price book navigation and URL handling
 * Prevents duplication across components
 */

/**
 * Convert category name to URL-safe slug
 * Example: "Heat Pumps" -> "heat-pumps"
 */
export function categoryToSlug(name: string): string {
	return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Convert URL slug back to category name
 * Example: "heat-pumps" -> "Heat Pumps"
 */
export function slugToCategory(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Build category URL from navigation path
 * Example: ["HVAC", "Heating"] -> "/dashboard/work/pricebook/c/hvac/heating"
 */
export function buildCategoryUrl(path: string[]): string {
	if (path.length === 0) {
		return "/dashboard/work/pricebook";
	}
	return `/dashboard/work/pricebook/c/${path.map(categoryToSlug).join("/")}`;
}

/**
 * Parse category path from URL slug array
 * Example: ["hvac", "heating"] -> ["HVAC", "Heating"]
 */
export function parseCategoryPath(slugs: string[]): string[] {
	return slugs.map(slugToCategory);
}
