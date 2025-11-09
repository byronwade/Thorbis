import type { MetadataRoute } from "next";

import { getKBArticles, getKBCategories } from "@/actions/kb";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://thorbis.com";

export async function GET(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/kb`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const [articlesResult, categoriesResult] = await Promise.all([
      getKBArticles({ limit: 1000 }),
      getKBCategories(),
    ]);

    const articles =
      articlesResult.success && articlesResult.articles
        ? articlesResult.articles
        : [];
    const categories = categoriesResult.success
      ? categoriesResult.categories || []
      : [];

    const kbArticles: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${siteUrl}/kb/${article.category.slug}/${article.slug}`,
      lastModified: article.updatedAt
        ? new Date(article.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: article.featured ? 0.8 : 0.7,
    }));

    const kbCategories: MetadataRoute.Sitemap = categories
      .flatMap((cat) => [cat, ...(cat.children || [])])
      .map((category) => ({
        url: `${siteUrl}/kb/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }));

    return [...staticPages, ...kbCategories, ...kbArticles];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

