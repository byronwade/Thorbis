import type { Metadata } from "next";
import {
	buildCanonicalUrl,
	buildShareImageUrl,
	buildTitle,
	SEO_BRAND,
	SEO_COPY,
	SEO_KEYWORDS,
	SEO_LOCALES,
	SEO_SOCIAL,
	SEO_URLS,
} from "./config";
import {
	createBreadcrumbSchema,
	createFAQSchema,
	createOrganizationSchema,
	createServiceSchema,
	createSoftwareApplicationSchema,
	createWebsiteSchema,
} from "./structured-data";

export type SEOConfig = {
	title: string;
	section?: string;
	description: string;
	path?: string;
	image?: string;
	imageAlt?: string;
	type?: "website" | "article" | "profile";
	publishedTime?: string;
	modifiedTime?: string;
	authors?: string[];
	tags?: string[];
	keywords?: string[];
	noindex?: boolean;
	nofollow?: boolean;
	canonical?: string;
	/**
	 * Override brand suffix behaviour. Defaults to true for marketing pages.
	 */
	includeBrand?: boolean;
	/**
	 * Locale string (e.g. en_US). Defaults to SEO_LOCALES.default.
	 */
	locale?: string;
	/**
	 * Provide hreflang alternates (language code => path or absolute url).
	 */
	languageAlternates?: Record<string, string>;
	/**
	 * Override application name for manifests (defaults to brand short name).
	 */
	appName?: string;
	/**
	 * Select twitter card type.
	 */
	twitterCard?: "summary" | "summary_large_image";
};

/**
 * Generate comprehensive metadata for any page
 */
export function generateMetadata(config: SEOConfig): Metadata {
	const {
		title,
		section,
		description,
		path = "",
		image,
		imageAlt,
		type = "website",
		publishedTime,
		modifiedTime,
		authors,
		tags,
		keywords,
		noindex = false,
		nofollow = false,
		canonical,
		includeBrand = true,
		locale = SEO_LOCALES.default,
		languageAlternates,
		appName,
		twitterCard = "summary_large_image",
	} = config;

	const fullTitle =
		includeBrand || section
			? buildTitle({ page: title, section, includeBrand })
			: title;
	const url = canonical || buildCanonicalUrl({ path });
	const fullImage = buildShareImageUrl(image ? { path: image } : undefined);
	const combinedKeywords = Array.from(
		new Set([...(keywords ?? []), ...SEO_KEYWORDS]),
	).filter(Boolean);
	const alternatesLanguages = languageAlternates
		? Object.fromEntries(
				Object.entries(languageAlternates).map(([lang, href]) => [
					lang,
					href.startsWith("http") ? href : buildCanonicalUrl({ path: href }),
				]),
			)
		: undefined;
	const alternateLocales = alternatesLanguages
		? Object.keys(alternatesLanguages).filter(
				(lang) => lang !== locale && lang !== SEO_LOCALES.default,
			)
		: undefined;
	const resolvedAppName = appName ?? SEO_BRAND.short;
	const resolvedImageAlt = imageAlt ?? title;

	return {
		metadataBase: new URL(SEO_URLS.site),
		title: fullTitle,
		description,
		keywords: combinedKeywords.length ? combinedKeywords.join(", ") : undefined,
		authors: authors?.map((author) => ({ name: author })),
		creator: SEO_BRAND.company,
		publisher: SEO_BRAND.company,
		applicationName: resolvedAppName,
		robots: {
			index: !noindex,
			follow: !nofollow,
			googleBot: {
				index: !noindex,
				follow: !nofollow,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		openGraph: {
			type: type === "article" ? "article" : "website",
			url,
			title: fullTitle,
			description,
			siteName: SEO_BRAND.company,
			images: [
				{
					url: fullImage,
					width: 1200,
					height: 630,
					alt: resolvedImageAlt,
				},
			],
			locale,
			alternateLocale: alternateLocales,
			...(type === "article" && {
				publishedTime,
				modifiedTime,
				authors,
				tags,
				section: "Business Management",
			}),
		},
		twitter: {
			card: twitterCard,
			site: SEO_SOCIAL.twitterHandle,
			creator: SEO_SOCIAL.twitterHandle,
			title: fullTitle,
			description,
			images: [fullImage],
		},
		alternates: {
			canonical: url,
			languages: alternatesLanguages,
		},
		other: {
			"apple-mobile-web-app-title": resolvedAppName,
			"application-name": resolvedAppName,
		},
	};
}

export const siteUrl = SEO_URLS.site;
export const siteName = SEO_BRAND.company;
const siteDescription = SEO_COPY.defaultDescription;
const siteImage = buildShareImageUrl();
const twitterHandle = SEO_SOCIAL.twitterHandle;
export const generateOrganizationStructuredData = createOrganizationSchema;
const generateWebSiteStructuredData = createWebsiteSchema;
export const generateBreadcrumbStructuredData = createBreadcrumbSchema;
export const generateFAQStructuredData = createFAQSchema;
const generateSoftwareApplicationStructuredData =
	createSoftwareApplicationSchema;
export const generateServiceStructuredData = createServiceSchema;
