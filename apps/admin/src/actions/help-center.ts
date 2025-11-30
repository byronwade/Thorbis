"use server";

/**
 * Help Center Actions
 *
 * Server actions for managing knowledge base articles and categories.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface KBArticle {
	id: string;
	title: string;
	slug: string;
	excerpt?: string;
	category_id: string;
	category_name?: string;
	published: boolean;
	featured: boolean;
	view_count: number;
	helpful_count: number;
	not_helpful_count: number;
	author?: string;
	created_at: string;
	updated_at: string;
	published_at?: string;
}

export interface KBCategory {
	id: string;
	title: string;
	slug: string;
	description?: string;
	icon?: string;
	parent_id?: string;
	order: number;
	is_active: boolean;
	article_count?: number;
}

export interface HelpCenterStats {
	total_articles: number;
	published_articles: number;
	total_views: number;
	total_categories: number;
}

/**
 * Get knowledge base articles
 */
export async function getKBArticles(limit: number = 50, published?: boolean) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		let query = webDb
			.from("kb_articles")
			.select(`
				*,
				kb_categories!inner (
					title,
					slug
				)
			`)
			.order("updated_at", { ascending: false });

		if (published !== undefined) {
			query = query.eq("published", published);
		}

		const { data, error } = await query.limit(limit);

		if (error) {
			console.error("Failed to fetch KB articles:", error);
			return { error: "Failed to fetch articles" };
		}

		const articles: KBArticle[] = (data || []).map((article: any) => ({
			id: article.id,
			title: article.title,
			slug: article.slug,
			excerpt: article.excerpt || undefined,
			category_id: article.category_id,
			category_name: (article.kb_categories as any)?.title || undefined,
			published: article.published,
			featured: article.featured,
			view_count: article.view_count || 0,
			helpful_count: article.helpful_count || 0,
			not_helpful_count: article.not_helpful_count || 0,
			author: article.author || undefined,
			created_at: article.created_at,
			updated_at: article.updated_at,
			published_at: article.published_at || undefined,
		}));

		return { data: articles };
	} catch (error) {
		console.error("Failed to get KB articles:", error);
		return { error: error instanceof Error ? error.message : "Failed to get articles" };
	}
}

/**
 * Get knowledge base categories
 */
export async function getKBCategories() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		const { data: categories, error } = await webDb
			.from("kb_categories")
			.select(`
				*,
				kb_articles!inner (
					id
				)
			`)
			.order("order", { ascending: true });

		if (error) {
			console.error("Failed to fetch KB categories:", error);
			return { error: "Failed to fetch categories" };
		}

		// Count articles per category
		const categoriesWithCounts: KBCategory[] = (categories || []).map((category: any) => ({
			id: category.id,
			title: category.title,
			slug: category.slug,
			description: category.description || undefined,
			icon: category.icon || undefined,
			parent_id: category.parent_id || undefined,
			order: category.order || 0,
			is_active: category.is_active,
			article_count: Array.isArray(category.kb_articles) ? category.kb_articles.length : 0,
		}));

		return { data: categoriesWithCounts };
	} catch (error) {
		console.error("Failed to get KB categories:", error);
		return { error: error instanceof Error ? error.message : "Failed to get categories" };
	}
}

/**
 * Get help center statistics
 */
export async function getHelpCenterStats(): Promise<{ data?: HelpCenterStats; error?: string }> {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		const [articlesResult, categoriesResult] = await Promise.all([
			webDb.from("kb_articles").select("id, published, view_count"),
			webDb.from("kb_categories").select("id").eq("is_active", true),
		]);

		const articles = articlesResult.data || [];
		const categories = categoriesResult.data || [];

		const publishedArticles = articles.filter((a) => a.published).length;
		const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0);

		return {
			data: {
				total_articles: articles.length,
				published_articles: publishedArticles,
				total_views: totalViews,
				total_categories: categories.length,
			},
		};
	} catch (error) {
		console.error("Failed to get help center stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to get stats" };
	}
}

