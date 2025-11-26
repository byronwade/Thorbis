import type { MetadataRoute } from "next";

import { getChangeFrequency, getPagePriority } from "@/lib/seo/sitemap-utils";

/**
 * Root Sitemap - Optimized for 2025 SEO
 *
 * Features:
 * - Priority weighting for important pages
 * - Change frequency hints for crawlers
 * - Last modified timestamps (based on content type)
 * - Organized by content type
 * - Dynamic priority and frequency based on page importance
 */

const BASE_URL = "https://thorbis.com";

/**
 * Get appropriate lastModified date based on content type
 * High-churn content gets recent dates, static content gets older dates
 */
function getLastModified(path: string): Date {
	const now = new Date();
	const frequency = getChangeFrequency(path);

	switch (frequency) {
		case "daily":
			return now;
		case "weekly":
			return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
		case "monthly":
			return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); // 2 weeks ago
		case "yearly":
			return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 3 months ago
		default:
			return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
	}
}

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

	return [
		// Homepage - Highest priority
		{
			url: BASE_URL,
			lastModified: now,
			changeFrequency: "daily",
			priority: 1.0,
		},

		// Core marketing pages - High priority
		{
			url: `${BASE_URL}/pricing`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/features`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/demo`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.7,
		},

		// Feature pages - High priority
		{
			url: `${BASE_URL}/features/scheduling`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/invoicing`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/crm`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/customer-portal`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/mobile-app`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/quickbooks`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/marketing`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/features/ai-assistant`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.8,
		},

		// Industry pages - Medium-high priority
		{
			url: `${BASE_URL}/industries`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/hvac`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/plumbing`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/electrical`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/handyman`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/landscaping`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/pool-service`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/pest-control`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/appliance-repair`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/roofing`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/cleaning`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/locksmith`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/industries/garage-door`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},

		// Comparison pages - Medium-high priority
		{
			url: `${BASE_URL}/vs`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/vs/servicetitan`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/vs/housecall-pro`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/vs/jobber`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/vs/fieldedge`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/vs/servicem8`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/vs/workiz`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.7,
		},

		// Solutions pages - Medium priority
		{
			url: `${BASE_URL}/solutions`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/roi`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/switch`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.6,
		},

		// Resources - Medium priority
		{
			url: `${BASE_URL}/kb`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/webinars`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/templates`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/free-tools`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.6,
		},

		// Company pages - Lower priority
		{
			url: `${BASE_URL}/about`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/careers`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/press`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/partners`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.5,
		},

		// Integrations hub
		{
			url: `${BASE_URL}/integrations`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/integrations/quickbooks`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/integrations/stripe`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/integrations/google-calendar`,
			lastModified: lastWeek,
			changeFrequency: "monthly",
			priority: 0.6,
		},

		// Waitlist
		{
			url: `${BASE_URL}/waitlist`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},

		// Community & Support
		{
			url: `${BASE_URL}/community`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/help`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/implementation`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.5,
		},

		// Reviews & Case Studies
		{
			url: `${BASE_URL}/reviews`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.6,
		},
		{
			url: `${BASE_URL}/case-studies`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.6,
		},

		// Legal pages - Low priority
		{
			url: `${BASE_URL}/privacy`,
			lastModified: lastMonth,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/terms`,
			lastModified: lastMonth,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/security`,
			lastModified: lastMonth,
			changeFrequency: "monthly",
			priority: 0.4,
		},
		{
			url: `${BASE_URL}/gdpr`,
			lastModified: lastMonth,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/cookies`,
			lastModified: lastMonth,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/accessibility`,
			lastModified: lastMonth,
			changeFrequency: "yearly",
			priority: 0.3,
		},

		// Other utility pages
		{
			url: `${BASE_URL}/site-map`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.4,
		},
		{
			url: `${BASE_URL}/status`,
			lastModified: now,
			changeFrequency: "daily",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/api-docs`,
			lastModified: lastWeek,
			changeFrequency: "weekly",
			priority: 0.5,
		},
	];
}
