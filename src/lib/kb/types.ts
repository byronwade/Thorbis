/**
 * Knowledge Base Types
 *
 * Type definitions for the knowledge base system
 */

import type { KBArticle, KBCategory, KBTag } from "@/lib/db/schema";

/**
 * Article with populated relations
 */
export type KBArticleWithRelations = KBArticle & {
  category: KBCategory;
  tags: KBTag[];
  relatedArticles?: KBArticle[];
};

/**
 * Category with children and article count
 */
export type KBCategoryWithChildren = KBCategory & {
  children?: KBCategoryWithChildren[];
  articleCount?: number;
};

/**
 * Article frontmatter (from markdown files)
 */
export type KBArticleFrontmatter = {
  title: string;
  slug: string;
  excerpt?: string;
  category: string; // Category slug
  tags?: string[]; // Tag slugs
  featured?: boolean;
  published?: boolean;
  publishedAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  author?: string;
  featuredImage?: string;
  relatedArticles?: string[]; // Article slugs
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
};

/**
 * Category metadata (from _category.json files)
 */
export type KBCategoryMetadata = {
  title: string;
  description?: string;
  icon?: string;
  order?: number;
};

/**
 * Search result with ranking
 */
export interface KBSearchResult extends KBArticle {
  searchRank?: number;
  category: KBCategory;
  tags: KBTag[];
}

/**
 * Search filters
 */
export type KBSearchFilters = {
  query?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
};

/**
 * Feedback submission
 */
export type KBFeedbackSubmission = {
  articleId: string;
  helpful?: boolean;
  comment?: string;
  userEmail?: string;
};
