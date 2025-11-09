/**
 * Knowledge Base Metadata Utilities
 *
 * Generates SEO metadata, structured data, and Open Graph tags
 * for knowledge base articles and pages
 */

import type { Metadata } from "next";
import type { KBArticleWithRelations } from "./types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
const siteName = "Thorbis";

/**
 * Generate metadata for an article page
 */
export function generateArticleMetadata(
  article: KBArticleWithRelations
): Metadata {
  const title = article.metaTitle || article.title;
  const description =
    article.metaDescription || article.excerpt || `${article.title} - ${siteName}`;
  const url = `${siteUrl}/kb/${article.category.slug}/${article.slug}`;
  const image = article.featuredImage
    ? `${siteUrl}${article.featuredImage}`
    : `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags?.map((tag: { name: string }) => tag.name) || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    keywords: Array.isArray(article.keywords)
      ? article.keywords.join(", ")
      : undefined,
  };
}

/**
 * Generate structured data (JSON-LD) for an article
 */
export function generateArticleStructuredData(
  article: KBArticleWithRelations
): object {
  const url = `${siteUrl}/kb/${article.category.slug}/${article.slug}`;
  const image = article.featuredImage
    ? `${siteUrl}${article.featuredImage}`
    : `${siteUrl}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.metaDescription,
    image: image,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      "@type": "Person",
      name: article.author || siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: article.category.title,
    keywords: Array.isArray(article.keywords)
      ? article.keywords.join(", ")
      : undefined,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  category: { slug: string; title: string },
  article?: { slug: string; title: string }
): object {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Knowledge Base",
      item: `${siteUrl}/kb`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: category.title,
      item: `${siteUrl}/kb/${category.slug}`,
    },
  ];

  if (article) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: article.title,
      item: `${siteUrl}/kb/${category.slug}/${article.slug}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  questions: Array<{ question: string; answer: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * Generate metadata for KB homepage
 */
export function generateKBHomeMetadata(): Metadata {
  return {
    title: `Knowledge Base - ${siteName}`,
    description: `Find answers, guides, and documentation for ${siteName}. Learn how to use all features and get the most out of your account.`,
    openGraph: {
      title: `Knowledge Base - ${siteName}`,
      description: `Find answers, guides, and documentation for ${siteName}`,
      url: `${siteUrl}/kb`,
      siteName,
    },
  };
}

/**
 * Generate metadata for category page
 */
export function generateCategoryMetadata(
  category: { title: string; description?: string; slug: string }
): Metadata {
  return {
    title: `${category.title} - Knowledge Base - ${siteName}`,
    description:
      category.description ||
      `Articles and guides about ${category.title.toLowerCase()} in the ${siteName} knowledge base.`,
    openGraph: {
      title: `${category.title} - Knowledge Base`,
      description: category.description,
      url: `${siteUrl}/kb/${category.slug}`,
      siteName,
    },
  };
}

