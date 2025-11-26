/**
 * Sitemap Utilities
 *
 * Provides utilities for generating dynamic sitemaps with accurate
 * modification dates based on file system or git history.
 */

import { readdirSync, statSync } from "fs";
import { join } from "path";

type PageInfo = {
	path: string;
	lastModified: Date;
	priority: number;
	changeFrequency:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
};

/**
 * Page priority configuration
 * Higher = more important
 */
export const PAGE_PRIORITIES: Record<string, number> = {
	"/": 1.0,
	"/pricing": 0.9,
	"/features": 0.9,
	"/demo": 0.8,
	"/waitlist": 0.8,
	"/contact": 0.7,
	"/industries": 0.7,
	"/vs": 0.7,
	"/roi": 0.6,
	"/switch": 0.6,
	"/reviews": 0.6,
	"/implementation": 0.5,
	"/integrations": 0.6,
	"/kb": 0.7,
	"/blog": 0.7,
	"/about": 0.5,
	"/careers": 0.5,
	"/partners": 0.5,
	"/press": 0.4,
	"/privacy": 0.3,
	"/terms": 0.3,
	"/security": 0.4,
};

/**
 * Change frequency based on content type
 */
export const CHANGE_FREQUENCIES: Record<string, PageInfo["changeFrequency"]> = {
	"/": "daily",
	"/pricing": "weekly",
	"/features": "weekly",
	"/demo": "monthly",
	"/waitlist": "weekly",
	"/contact": "monthly",
	"/industries": "monthly",
	"/vs": "monthly",
	"/roi": "monthly",
	"/switch": "monthly",
	"/reviews": "weekly",
	"/implementation": "monthly",
	"/integrations": "monthly",
	"/kb": "daily",
	"/blog": "daily",
	"/about": "monthly",
	"/careers": "weekly",
	"/partners": "monthly",
	"/press": "monthly",
	"/privacy": "yearly",
	"/terms": "yearly",
	"/security": "monthly",
};

/**
 * Get priority for a given path
 */
export function getPagePriority(path: string): number {
	// Exact match
	if (PAGE_PRIORITIES[path]) {
		return PAGE_PRIORITIES[path];
	}

	// Check prefix matches
	const segments = path.split("/").filter(Boolean);
	if (segments.length > 0) {
		const prefix = `/${segments[0]}`;
		if (PAGE_PRIORITIES[prefix]) {
			// Reduce priority slightly for subpages
			return Math.max(0.3, PAGE_PRIORITIES[prefix] - 0.1);
		}
	}

	// Default priority
	return 0.5;
}

/**
 * Get change frequency for a given path
 */
export function getChangeFrequency(path: string): PageInfo["changeFrequency"] {
	// Exact match
	if (CHANGE_FREQUENCIES[path]) {
		return CHANGE_FREQUENCIES[path];
	}

	// Check prefix matches
	const segments = path.split("/").filter(Boolean);
	if (segments.length > 0) {
		const prefix = `/${segments[0]}`;
		if (CHANGE_FREQUENCIES[prefix]) {
			return CHANGE_FREQUENCIES[prefix];
		}
	}

	// Default
	return "monthly";
}

/**
 * Get file modification time
 * Falls back to current date if file doesn't exist
 */
export function getFileModifiedDate(filePath: string): Date {
	try {
		const stats = statSync(filePath);
		return stats.mtime;
	} catch {
		return new Date();
	}
}

/**
 * Scan a directory for page files and return their info
 */
export function scanPagesDirectory(
	baseDir: string,
	basePath: string = "",
): PageInfo[] {
	const pages: PageInfo[] = [];

	try {
		const entries = readdirSync(baseDir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(baseDir, entry.name);

			if (entry.isDirectory()) {
				// Skip special directories
				if (entry.name.startsWith("_") || entry.name.startsWith(".")) {
					continue;
				}

				// Handle route groups (folders in parentheses)
				const isRouteGroup =
					entry.name.startsWith("(") && entry.name.endsWith(")");
				const subPath = isRouteGroup ? basePath : `${basePath}/${entry.name}`;

				// Recursively scan subdirectories
				pages.push(...scanPagesDirectory(fullPath, subPath));
			} else if (entry.name === "page.tsx" || entry.name === "page.ts") {
				// Found a page file
				const pagePath = basePath || "/";
				pages.push({
					path: pagePath,
					lastModified: getFileModifiedDate(fullPath),
					priority: getPagePriority(pagePath),
					changeFrequency: getChangeFrequency(pagePath),
				});
			}
		}
	} catch {
		// Directory doesn't exist or can't be read
	}

	return pages;
}

/**
 * Content freshness categories based on last modified date
 */
export type ContentFreshness = "fresh" | "recent" | "stale" | "outdated";

export function getContentFreshness(lastModified: Date): ContentFreshness {
	const now = new Date();
	const daysDiff = Math.floor(
		(now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (daysDiff <= 7) return "fresh";
	if (daysDiff <= 30) return "recent";
	if (daysDiff <= 90) return "stale";
	return "outdated";
}

/**
 * Generate sitemap-friendly date string (YYYY-MM-DD format)
 */
export function formatSitemapDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

/**
 * Calculate sitemap index for large sites
 * Returns array of sitemap segments
 */
export function calculateSitemapSegments(
	totalUrls: number,
	maxUrlsPerSitemap: number = 50000,
): number {
	return Math.ceil(totalUrls / maxUrlsPerSitemap);
}
