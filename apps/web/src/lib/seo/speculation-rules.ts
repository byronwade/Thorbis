/**
 * Speculation Rules API Configuration
 *
 * Enables near-instant page navigation through prefetching and prerendering.
 * Works in Chromium browsers (Chrome, Edge), safely ignored by others.
 *
 * @see https://developer.chrome.com/docs/web-platform/prerender-pages
 */

import { SEO_URLS } from "./config";

/**
 * Generate speculation rules for prefetching/prerendering
 * These tell the browser to start loading pages before the user clicks
 */
export function generateSpeculationRules() {
	return {
		prefetch: [
			{
				source: "document",
				where: {
					and: [
						{ href_matches: "/*" },
						{ not: { href_matches: "/api/*" } },
						{ not: { href_matches: "/dashboard/*" } },
						{ not: { selector_matches: "[data-no-prefetch]" } },
					],
				},
				eagerness: "moderate",
			},
		],
		prerender: [
			{
				source: "document",
				where: {
					and: [
						{
							or: [
								{ href_matches: "/pricing" },
								{ href_matches: "/features" },
								{ href_matches: "/features/*" },
								{ href_matches: "/industries" },
								{ href_matches: "/industries/*" },
								{ href_matches: "/vs/*" },
								{ href_matches: "/demo" },
								{ href_matches: "/waitlist" },
							],
						},
						{ not: { selector_matches: "[data-no-prerender]" } },
					],
				},
				eagerness: "moderate",
			},
		],
	};
}

/**
 * Generate the script tag content for speculation rules
 */
export function getSpeculationRulesScript(): string {
	return JSON.stringify(generateSpeculationRules());
}

/**
 * High-priority pages to always prerender on hover
 */
export const PRERENDER_PRIORITY_PAGES = [
	"/pricing",
	"/demo",
	"/waitlist",
	"/features",
	"/industries",
] as const;

/**
 * Pages to exclude from speculation (dynamic/authenticated)
 */
export const SPECULATION_EXCLUDE_PATTERNS = [
	"/api/*",
	"/dashboard/*",
	"/auth/*",
	"/admin/*",
] as const;
