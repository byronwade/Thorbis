/**
 * Robots.txt Generator
 *
 * Programmatic robots.txt generation for SEO
 */

import type { MetadataRoute } from "next";
import { SEO_URLS } from "@/lib/seo/config";

const siteUrl = SEO_URLS.site;

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/dashboard/",
					"/_next/",
					"/static/",
					"*.json",
					"/contracts/sign/",
					"/contracts/download/",
				],
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: [
					"/api/",
					"/dashboard/",
					"/contracts/sign/",
					"/contracts/download/",
				],
			},
		],
		sitemap: [
			`${siteUrl}/sitemap.xml`,
			`${siteUrl}/seo/thorbis-sitemap.xml`,
			`${siteUrl}/kb/sitemap.xml`,
			`${siteUrl}/feed`,
		],
	};
}
