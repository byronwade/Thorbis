/**
 * Centralized SEO configuration and naming conventions for Thorbis.
 *
 * Every marketing surface should import utilities from this module instead of
 * re-declaring brand names, URLs, or title formats. This ensures that metadata
 * remains perfectly consistent when users bookmark pages, install the PWA, or
 * share links externally.
 */

export const SEO_BRAND = {
	/**
	 * Legal/company name used for organization level metadata.
	 */
	company: "Thorbis",
	/**
	 * Short product name shown in titles and app manifests.
	 */
	short: "Thorbis",
	/**
	 * Descriptive product label used when we need a longer phrase.
	 */
	product: "Thorbis Field Management Platform",
	/**
	 * Primary marketing tagline.
	 */
	tagline: "Modern Field Management System",
} as const;

export const SEO_URLS = {
	/**
	 * Canonical origin for the public marketing surface.
	 */
	site:
		process.env.NEXT_PUBLIC_SITE_URL ??
		process.env.NEXT_PUBLIC_BASE_URL ??
		"https://thorbis.com",
	/**
	 * Default social/OG image relative path. Use helpers below to make it absolute.
	 */
	defaultImagePath: "/og-image.jpg",
	/**
	 * Shared support contact surfaced in structured data.
	 */
	supportEmail: "support@thorbis.com",
} as const;

export const SEO_LOCALES = {
	default: "en_US",
	alternates: ["en_US"] as const,
} as const;

export const SEO_SOCIAL = {
	twitterHandle: "@thorbis",
	/**
	 * Social media profile URLs for Organization schema (Knowledge Graph).
	 * Used in structured data to help search engines understand brand presence.
	 */
	profiles: {
		facebook: "https://facebook.com/thorbis",
		linkedin: "https://linkedin.com/company/thorbis",
		youtube: "https://youtube.com/@thorbis",
		instagram: "https://instagram.com/thorbis",
		github: "https://github.com/thorbis",
	},
} as const;

export const SEO_KEYWORDS = [
	"field service management",
	"business management platform",
	"job scheduling software",
	"service technician software",
] as const;

export const SEO_COPY = {
	/**
	 * Baseline description used when a page does not provide its own copy.
	 */
	defaultDescription:
		"Modern business management platform for service companies. Manage customers, jobs, invoices, equipment, and more in one place.",
} as const;

type TitleOptions = {
	page: string;
	/**
	 * Optional higher level section. When provided it is rendered before the page.
	 */
	section?: string;
	/**
	 * By default every title is suffixed with the brand. Disable when building
	 * already-branded strings (e.g. App Store listings).
	 */
	includeBrand?: boolean;
};

/**
 * Build a consistently formatted document title.
 *
 * Example:
 * buildTitle({ page: "Pricing" }) => "Pricing | Thorbis"
 * buildTitle({ section: "Knowledge Base", page: "Getting Started" })
 *   => "Knowledge Base – Getting Started | Thorbis"
 */
export function buildTitle({
	page,
	section,
	includeBrand = true,
}: TitleOptions): string {
	const parts: string[] = [];

	if (section) {
		parts.push(toTitleCase(section.trim()));
	}

	parts.push(toTitleCase(page.trim()));

	const headline = parts.join(" – ");
	if (!includeBrand) {
		return headline;
	}

	return `${headline} | ${SEO_BRAND.short}`;
}

type CanonicalOptions = {
	/**
	 * Path relative to the site origin. Can optionally include query parameters.
	 */
	path?: string;
};

/**
 * Resolve a canonical URL by combining the site origin with a normalized path.
 */
export function buildCanonicalUrl({
	path = "/",
}: CanonicalOptions = {}): string {
	const normalized =
		path === "" || path === "/"
			? "/"
			: path.startsWith("/")
				? path
				: `/${path}`;

	return `${SEO_URLS.site}${normalized}`;
}

type ShareImageOptions = {
	/**
	 * Path to an image asset. Defaults to the standard marketing OG image.
	 */
	path?: string;
	/**
	 * Optional search params to compose dynamic images (e.g. ?title=...).
	 */
	query?: Record<string, string | number | undefined>;
};

/**
 * Generate an absolute URL for social images. Supports both static assets and
 * dynamic image endpoints.
 */
export function buildShareImageUrl({
	path = SEO_URLS.defaultImagePath,
	query,
}: ShareImageOptions = {}): string {
	const url = new URL(
		path.startsWith("http") ? path : `${SEO_URLS.site}${path}`,
	);

	if (query) {
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		});
	}

	return url.toString();
}

/**
 * Format a slug/identifier into a human-readable breadcrumb label.
 */
export function formatBreadcrumbLabel(input: string): string {
	return toTitleCase(input.replace(/[-_/]+/g, " "));
}

/**
 * Internal helper to convert strings into Title Case while keeping connectors
 * (of, and, the, for) in lower case when not the first word.
 */
function toTitleCase(value: string): string {
	const lower = value.toLowerCase();
	const words = lower.split(/\s+/).filter(Boolean);
	const keepLower = new Set(["and", "or", "for", "the", "of", "in", "to"]);

	return words
		.map((word, index) => {
			if (index > 0 && keepLower.has(word)) {
				return word;
			}

			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export type { TitleOptions, CanonicalOptions, ShareImageOptions };
