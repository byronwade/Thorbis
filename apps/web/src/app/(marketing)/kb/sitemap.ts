/**
 * Knowledge Base Sitemap
 *
 * Dynamic sitemap generation for all published articles
 */

import type { MetadataRoute } from "next";
import { getKBArticles, getKBCategories } from "@/actions/kb";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [articlesResult, categoriesResult] = await Promise.all([
		getKBArticles({ limit: 1000 }), // Get all articles
		getKBCategories(),
	]);

	const articles =
		articlesResult.success && articlesResult.articles
			? articlesResult.articles
			: [];
	const categories = categoriesResult.success
		? categoriesResult.categories
		: [];

	// Generate sitemap entries for articles
	const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
		url: `${siteUrl}/kb/${article.category.slug}/${article.slug}`,
		lastModified: article.updated_at
			? new Date(String(article.updated_at))
			: article.published_at
				? new Date(String(article.published_at))
				: new Date(),
		changeFrequency: "weekly" as const,
		priority: article.featured ? 0.9 : 0.7,
	}));

	// Generate sitemap entries for categories
	const categoryEntries: MetadataRoute.Sitemap = (categories || [])
		.flatMap((cat) => [cat, ...(cat.children || [])])
		.map((category) => ({
			url: `${siteUrl}/kb/${category.slug}`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.8,
		}));

	// Add KB homepage
	const homepageEntry: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/kb`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1.0,
		},
	];

	return [...homepageEntry, ...categoryEntries, ...articleEntries];
}
