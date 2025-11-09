/**
 * Knowledge Base Search Utilities
 *
 * Full-text search implementation using PostgreSQL tsvector
 * Provides search ranking, autocomplete, and result highlighting
 */

import type { KBSearchResult, KBSearchFilters } from "./types";

/**
 * Build search query from filters
 */
export function buildSearchQuery(filters: KBSearchFilters): string {
  if (!filters.query) {
    return "";
  }

  // Convert to PostgreSQL tsquery format
  // Supports phrase search with quotes and AND/OR operators
  const query = filters.query.trim();

  // If query is wrapped in quotes, treat as phrase
  if (query.startsWith('"') && query.endsWith('"')) {
    const phrase = query.slice(1, -1).replace(/\s+/g, " <-> ");
    return `${phrase}:*`;
  }

  // Split into terms and add prefix matching
  const terms = query
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .map((term) => `${term}:*`);

  return terms.join(" & ");
}

/**
 * Format search result for display
 */
export function formatSearchResult(result: KBSearchResult): {
  title: string;
  excerpt: string;
  url: string;
  category: string;
  tags: string[];
} {
  return {
    title: result.title,
    excerpt: result.excerpt || "",
    url: `/kb/${result.category.slug}/${result.slug}`,
    category: result.category.title,
    tags: result.tags?.map((tag) => tag.name) || [],
  };
}

/**
 * Generate autocomplete suggestions from search query
 */
export function generateAutocompleteQuery(query: string): string {
  if (!query || query.length < 2) {
    return "";
  }

  // Use prefix matching for autocomplete
  const terms = query
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .map((term) => `${term}:*`);

  return terms.join(" & ");
}

