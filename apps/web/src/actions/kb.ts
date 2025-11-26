/**
 * Knowledge Base Server Actions
 *
 * Server-side operations for the knowledge base including:
 * - Fetching articles with filtering and pagination
 * - Full-text search using PostgreSQL tsvector
 * - Category and tag management
 * - Article view tracking
 * - Feedback submission
 *
 * Performance optimizations:
 * - Server-side data fetching
 * - Efficient database queries with proper indexes
 * - RLS policies for public read access
 * - Full-text search with ranking
 */

"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type {
	KBArticleWithRelations,
	KBCategoryWithChildren,
	KBFeedbackSubmission,
	KBSearchFilters,
} from "@/lib/kb/types";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

// Constants
const DEFAULT_ARTICLES_LIMIT = 20;
const SEARCH_QUERY_SPLIT_REGEX = /\s+/;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const publicSupabase =
	supabaseUrl && supabaseAnonKey
		? createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
				auth: {
					persistSession: false,
					autoRefreshToken: false,
				},
			})
		: null;

type RawCategory = Database["public"]["Tables"]["kb_categories"]["Row"];
type RawArticle = Database["public"]["Tables"]["kb_articles"]["Row"] & {
	category?: RawCategory;
	tags?: Array<{ tag: Database["public"]["Tables"]["kb_tags"]["Row"] }>;
};
type RawArticleTag = { tag: Database["public"]["Tables"]["kb_tags"]["Row"] };

function normalizeCategory(raw: RawCategory): KBCategoryWithChildren {
	return {
		...raw,
		description: raw?.description ?? undefined,
		icon: raw?.icon ?? undefined,
	};
}

function normalizeArticle(raw: RawArticle): KBArticleWithRelations {
	return {
		...raw,
		excerpt: raw?.excerpt ?? undefined,
		featured_image: raw?.featured_image ?? undefined,
		author: raw?.author ?? undefined,
		published_at: raw?.published_at ?? undefined,
		updated_at: raw?.updated_at ?? undefined,
		metaTitle: raw?.metaTitle ?? undefined,
		metaDescription: raw?.metaDescription ?? undefined,
		keywords: raw?.keywords ?? undefined,
		tags: raw?.tags?.map((at: RawArticleTag) => at.tag) ?? [],
		category: raw?.category ? normalizeCategory(raw.category) : raw?.category,
	};
}

// ============================================================================
// GET ARTICLES
// ============================================================================

/**
 * Get all published articles with optional filters
 */
export async function getKBArticles(filters?: KBSearchFilters): Promise<{
	success: boolean;
	error?: string;
	articles?: KBArticleWithRelations[];
	total?: number;
}> {
	try {
		const supabase = publicSupabase;

		if (!supabase) {
			return { success: false, error: "Supabase configuration is missing" };
		}

		let query = supabase
			.from("kb_articles")
			.select(
				`
        *,
        category:kb_categories(*),
        tags:kb_article_tags(
          tag:kb_tags(*)
        )
      `,
				{ count: "exact" },
			)
			.eq("published", true)
			.order("published_at", { ascending: false });

		// Apply filters
		if (filters?.category) {
			query = query.eq("category.slug", filters.category);
		}

		if (filters?.featured !== undefined) {
			query = query.eq("featured", filters.featured);
		}

		// Limit and offset
		const limit = filters?.limit || DEFAULT_ARTICLES_LIMIT;
		const offset = filters?.offset || 0;
		query = query.range(offset, offset + limit - 1);

		const { data, error, count } = await query;

		if (error) {
			return { success: false, error: error.message };
		}

		const articles: KBArticleWithRelations[] =
			data?.map((article: RawArticle) => normalizeArticle(article)) ?? [];

		return {
			success: true,
			articles,
			total: count || 0,
		};
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to fetch articles" };
	}
}

/**
 * Get single article by slug and category
 */
export async function getKBArticle(
	categorySlug: string,
	articleSlug: string,
): Promise<{
	success: boolean;
	error?: string;
	article?: KBArticleWithRelations;
}> {
	try {
		const supabase = publicSupabase;

		if (!supabase) {
			return { success: false, error: "Supabase configuration is missing" };
		}

		// First get the category
		const { data: category, error: categoryError } = await supabase
			.from("kb_categories")
			.select("id")
			.eq("slug", categorySlug)
			.eq("is_active", true)
			.single();

		if (categoryError || !category) {
			return { success: false, error: "Category not found" };
		}

		// Get the article
		const { data, error } = await supabase
			.from("kb_articles")
			.select(
				`
        *,
        category:kb_categories(*),
        tags:kb_article_tags(
          tag:kb_tags(*)
        )
      `,
			)
			.eq("category_id", category.id)
			.eq("slug", articleSlug)
			.eq("published", true)
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		if (!data) {
			return { success: false, error: "Article not found" };
		}

		// Transform data
		const article = normalizeArticle(data);

		return { success: true, article };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to fetch article" };
	}
}

// ============================================================================
// GET CATEGORIES
// ============================================================================

/**
 * Get all active categories with children
 */
export async function getKBCategories(): Promise<{
	success: boolean;
	error?: string;
	categories?: KBCategoryWithChildren[];
}> {
	try {
		const supabase = publicSupabase;

		if (!supabase) {
			return { success: false, error: "Supabase configuration is missing" };
		}

		const { data, error } = await supabase
			.from("kb_categories")
			.select("*")
			.eq("is_active", true)
			.order("order", { ascending: true })
			.order("title", { ascending: true });

		if (error) {
			return { success: false, error: error.message };
		}

		// Build hierarchical structure
		const categoryMap = new Map<string, KBCategoryWithChildren>();
		const rootCategories: KBCategoryWithChildren[] = [];

		// First pass: create all categories
		if (data) {
			for (const cat of data) {
				categoryMap.set(cat.id, {
					...normalizeCategory(cat),
					children: [] as KBCategoryWithChildren[],
				});
			}
		}

		// Second pass: build hierarchy
		if (data) {
			for (const cat of data) {
				const category = categoryMap.get(cat.id);
				if (!category) {
					return;
				}

				if (cat.parent_id) {
					const parent = categoryMap.get(cat.parent_id);
					if (parent) {
						parent.children = parent.children || [];
						parent.children.push(category);
					}
				} else {
					rootCategories.push(category);
				}
			}
		}

		return { success: true, categories: rootCategories };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to fetch categories" };
	}
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search articles using full-text search
 */
export async function searchKBArticles(
	query: string,
	filters?: Omit<KBSearchFilters, "query">,
): Promise<{
	success: boolean;
	error?: string;
	articles?: KBArticleWithRelations[];
	total?: number;
}> {
	try {
		const supabase = publicSupabase;

		if (!supabase) {
			return { success: false, error: "Supabase configuration is missing" };
		}

		if (!query || query.trim().length === 0) {
			return { success: true, articles: [], total: 0 };
		}

		// Use PostgreSQL full-text search
		// Convert query to tsquery format
		const searchQuery = query
			.split(SEARCH_QUERY_SPLIT_REGEX)
			.map((term) => `${term}:*`)
			.join(" & ");

		// Direct query using text search
		const limit = filters?.limit || DEFAULT_ARTICLES_LIMIT;
		const offset = filters?.offset || 0;

		const { data, error, count } = await supabase
			.from("kb_articles")
			.select(
				`
        *,
        category:kb_categories(*),
        tags:kb_article_tags(
          tag:kb_tags(*)
        )
      `,
				{ count: "exact" },
			)
			.eq("published", true)
			.textSearch("search_vector", searchQuery, {
				type: "websearch",
				config: "english",
			})
			.order("view_count", { ascending: false })
			.limit(limit)
			.range(offset, offset + limit - 1);

		if (error) {
			return { success: false, error: error.message };
		}

		// Transform data
		const articles: KBArticleWithRelations[] =
			data?.map((article: RawArticle) => normalizeArticle(article)) ?? [];

		return {
			success: true,
			articles,
			total: count || 0,
		};
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to search articles" };
	}
}

// ============================================================================
// RELATED ARTICLES
// ============================================================================

/**
 * Get related articles for an article
 */
export async function getKBRelatedArticles(
	articleId: string,
	limit = 5,
): Promise<{
	success: boolean;
	error?: string;
	articles?: KBArticleWithRelations[];
}> {
	try {
		const supabase = publicSupabase;

		if (!supabase) {
			return { success: false, error: "Supabase configuration is missing" };
		}

		const { data, error } = await supabase
			.from("kb_article_related")
			.select(
				`
        related_article:kb_articles!kb_article_related_related_article_id_fkey(
          *,
          category:kb_categories(*),
          tags:kb_article_tags(
            tag:kb_tags(*)
          )
        )
      `,
			)
			.eq("article_id", articleId)
			.eq("related_article.published", true)
			.order("order", { ascending: true })
			.limit(limit);

		if (error) {
			return { success: false, error: error.message };
		}

		const articles: KBArticleWithRelations[] =
			data?.map((rel: any) => normalizeArticle(rel.related_article)) ?? [];

		return { success: true, articles };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to fetch related articles" };
	}
}

// ============================================================================
// VIEW TRACKING
// ============================================================================

/**
 * Increment article view count
 */
export async function incrementArticleViews(
	articleId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const { error } = await supabase.rpc("increment_kb_article_views", {
			article_id: articleId,
		});

		// Fallback if RPC doesn't exist - get current count and increment
		if (error) {
			const { data: article } = await supabase
				.from("kb_articles")
				.select("view_count")
				.eq("id", articleId)
				.single();

			if (article) {
				const { error: updateError } = await supabase
					.from("kb_articles")
					.update({ view_count: (article.view_count || 0) + 1 })
					.eq("id", articleId);

				if (updateError) {
					return { success: false, error: updateError.message };
				}
			}
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to increment views" };
	}
}

// ============================================================================
// FEEDBACK
// ============================================================================

/**
 * Submit feedback for an article
 */
export async function submitKBFeedback(
	feedback: KBFeedbackSubmission,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		if (!supabase) {
			return { success: false, error: "Database connection not available" };
		}

		const { error } = await supabase.from("kb_feedback").insert({
			article_id: feedback.articleId,
			helpful: feedback.helpful,
			comment: feedback.comment,
			user_email: feedback.userEmail,
		});

		if (error) {
			return { success: false, error: error.message };
		}

		// Update helpful/not helpful counts
		if (feedback.helpful !== undefined) {
			const { data: article } = await supabase
				.from("kb_articles")
				.select("helpful_count, not_helpful_count")
				.eq("id", feedback.articleId)
				.single();

			if (article) {
				const countField =
					feedback.helpful === true ? "helpful_count" : "not_helpful_count";
				const newCount = (article[countField] || 0) + 1;

				await supabase
					.from("kb_articles")
					.update({ [countField]: newCount })
					.eq("id", feedback.articleId);
			}
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, error: error.message };
		}
		return { success: false, error: "Failed to submit feedback" };
	}
}
