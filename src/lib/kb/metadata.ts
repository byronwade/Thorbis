/**
 * Knowledge Base Metadata Utilities
 *
 * Generates SEO metadata, structured data, and Open Graph tags
 * for knowledge base articles and pages
 */

import type { Metadata } from "next";
import { SEO_URLS } from "@/lib/seo/config";
import {
  generateMetadata as generateSEOMetadata,
  siteName,
} from "@/lib/seo/metadata";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from "@/lib/seo/structured-data";
import type { KBArticleWithRelations } from "./types";

/**
 * Generate metadata for an article page
 */
export function generateArticleMetadata(
  article: KBArticleWithRelations
): Metadata {
  const title = article.metaTitle || article.title;
  const description =
    article.metaDescription ||
    article.excerpt ||
    `${article.title} - ${siteName}`;
  const path = `/kb/${article.category.slug}/${article.slug}`;
  const image = article.featured_image
    ? article.featured_image.startsWith("http")
      ? article.featured_image
      : `${SEO_URLS.site}${article.featured_image}`
    : undefined;

  return generateSEOMetadata({
    title,
    section: article.category.title,
    description,
    path,
    image,
    type: "article",
    publishedTime: article.published_at
      ? new Date(article.published_at).toISOString()
      : undefined,
    modifiedTime: article.updated_at
      ? new Date(article.updated_at).toISOString()
      : undefined,
    authors: article.author ? [article.author] : undefined,
    tags: article.tags?.map((tag: { name: string }) => tag.name) || [],
    keywords: Array.isArray(article.keywords) ? article.keywords : undefined,
    canonical: `${SEO_URLS.site}${path}`,
    imageAlt: article.title,
  });
}

/**
 * Generate structured data (JSON-LD) for an article
 */
export function generateArticleStructuredData(
  article: KBArticleWithRelations
): object {
  const url = `${SEO_URLS.site}/kb/${article.category.slug}/${article.slug}`;
  const words = article.content
    ? article.content.trim().split(/\s+/).length
    : undefined;
  const readMinutes =
    typeof words === "number"
      ? Math.max(1, Math.round(words / 220))
      : undefined;
  const toISOString = (value?: string | Date | null) => {
    if (!value) {
      return undefined;
    }
    const date =
      value instanceof Date ? value : new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  };

  return createArticleSchema({
    title: article.title,
    description: article.excerpt || article.metaDescription || "",
    url,
    image: article.featured_image,
    publishedTime:
      toISOString(article.published_at) ?? toISOString(article.createdAt),
    modifiedTime:
      toISOString(article.updated_at) ?? toISOString(article.createdAt),
    authorName: article.author || siteName,
    tags: Array.isArray(article.keywords) ? article.keywords : undefined,
    section: article.category.title,
    wordCount: words,
    estimatedReadTime: readMinutes ? `PT${readMinutes}M` : undefined,
  });
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  category: { slug: string; title: string },
  article?: { slug: string; title: string }
): object {
  const items = [
    { name: "Home", url: SEO_URLS.site },
    { name: "Knowledge Base", url: `${SEO_URLS.site}/kb` },
    { name: category.title, url: `${SEO_URLS.site}/kb/${category.slug}` },
  ];

  if (article) {
    items.push({
      name: article.title,
      url: `${SEO_URLS.site}/kb/${category.slug}/${article.slug}`,
    });
  }

  return createBreadcrumbSchema(items);
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  questions: Array<{ question: string; answer: string }>
): object {
  return createFAQSchema(questions);
}

/**
 * Generate metadata for KB homepage
 */
export function generateKBHomeMetadata(): Metadata {
  return generateSEOMetadata({
    title: "Knowledge Base",
    description: `Find answers, guides, and documentation for ${siteName}. Learn how to use all features and get the most out of your account.`,
    path: "/kb",
    section: "Resources",
    imageAlt: "Thorbis knowledge base home",
    keywords: [
      "documentation",
      "help center",
      "user guides",
      "tutorials",
      "support",
      "knowledge base",
      "how to",
      "faq",
    ],
  });
}

/**
 * Generate metadata for category page
 */
export function generateCategoryMetadata(category: {
  title: string;
  description?: string;
  slug: string;
}): Metadata {
  return generateSEOMetadata({
    title: `${category.title} - Knowledge Base`,
    description:
      category.description ||
      `Articles and guides about ${category.title.toLowerCase()} in the ${siteName} knowledge base.`,
    path: `/kb/${category.slug}`,
    section: "Knowledge Base",
    imageAlt: `${category.title} knowledge base resources`,
    keywords: [
      category.title.toLowerCase(),
      "documentation",
      "guides",
      "tutorials",
      "help",
    ],
  });
}
