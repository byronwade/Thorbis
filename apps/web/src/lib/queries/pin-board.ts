/**
 * Pin Board Query Functions
 *
 * Cached query functions using React.cache() for deduplication.
 * Multiple components calling these functions will share the same DB query.
 */

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type PinBoardCategory = {
	id: string;
	company_id: string;
	name: string;
	slug: string;
	description: string | null;
	icon: string;
	color: string;
	sort_order: number;
	is_default: boolean;
	created_at: string;
	updated_at: string;
};

export type PinBoardPost = {
	id: string;
	company_id: string;
	category_id: string | null;
	title: string;
	content: string | null;
	excerpt: string | null;
	is_pinned: boolean;
	is_published: boolean;
	priority: number;
	version: number;
	created_by: string | null;
	updated_by: string | null;
	created_at: string;
	updated_at: string;
	published_at: string | null;
	category?: PinBoardCategory | null;
	author?: {
		id: string;
		full_name: string | null;
		avatar_url: string | null;
	} | null;
	attachments?: PinBoardAttachment[];
	view_count?: number;
	has_viewed?: boolean;
};

export type PinBoardAttachment = {
	id: string;
	post_id: string;
	company_id: string;
	file_name: string;
	file_type: string | null;
	file_size: number | null;
	file_url: string;
	description: string | null;
	sort_order: number;
	uploaded_by: string | null;
	created_at: string;
};

/**
 * Get all categories for a company
 */
export const getPinBoardCategories = cache(
	async (companyId: string): Promise<PinBoardCategory[]> => {
		const supabase = await createClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("pin_board_categories")
			.select("*")
			.eq("company_id", companyId)
			.order("sort_order", { ascending: true });

		if (error) {
			console.error("Failed to fetch pin board categories:", error);
			return [];
		}

		return data ?? [];
	},
);

/**
 * Get all published posts for a company with optional category filter
 * Pinned posts appear first, then sorted by created_at DESC
 */
export const getPinBoardPosts = cache(
	async (
		companyId: string,
		options?: {
			categorySlug?: string;
			limit?: number;
			includeUnpublished?: boolean;
		},
	): Promise<PinBoardPost[]> => {
		const supabase = await createClient();
		if (!supabase) return [];
		const {
			categorySlug,
			limit = 50,
			includeUnpublished = false,
		} = options ?? {};

		let query = supabase
			.from("pin_board_posts")
			.select(`
      *,
      category:pin_board_categories(id, name, slug, icon, color),
      attachments:pin_board_attachments(id, file_name, file_type, file_size, file_url, description)
    `)
			.eq("company_id", companyId)
			.order("is_pinned", { ascending: false })
			.order("created_at", { ascending: false })
			.limit(limit);

		if (!includeUnpublished) {
			query = query.eq("is_published", true);
		}

		if (categorySlug) {
			// Join with categories to filter by slug
			const { data: category } = await supabase
				.from("pin_board_categories")
				.select("id")
				.eq("company_id", companyId)
				.eq("slug", categorySlug)
				.single();

			if (category) {
				query = query.eq("category_id", category.id);
			}
		}

		const { data, error } = await query;

		if (error) {
			console.error("Failed to fetch pin board posts:", error);
			return [];
		}

		return (data ?? []) as PinBoardPost[];
	},
);

/**
 * Get a single post by ID with full details
 */
const getPinBoardPost = cache(
	async (companyId: string, postId: string): Promise<PinBoardPost | null> => {
		const supabase = await createClient();
		if (!supabase) return null;

		const { data, error } = await supabase
			.from("pin_board_posts")
			.select(`
      *,
      category:pin_board_categories(id, name, slug, icon, color),
      attachments:pin_board_attachments(id, file_name, file_type, file_size, file_url, description, sort_order)
    `)
			.eq("id", postId)
			.eq("company_id", companyId)
			.single();

		if (error) {
			console.error("Failed to fetch pin board post:", error);
			return null;
		}

		return data as PinBoardPost;
	},
);

/**
 * Get view statistics for posts
 */
const getPinBoardPostViews = cache(
	async (
		companyId: string,
		postIds: string[],
	): Promise<Record<string, number>> => {
		if (postIds.length === 0) return {};

		const supabase = await createClient();
		if (!supabase) return {};

		const { data, error } = await supabase
			.from("pin_board_views")
			.select("post_id")
			.eq("company_id", companyId)
			.in("post_id", postIds);

		if (error) {
			console.error("Failed to fetch pin board views:", error);
			return {};
		}

		// Count views per post
		const viewCounts: Record<string, number> = {};
		for (const view of data ?? []) {
			viewCounts[view.post_id] = (viewCounts[view.post_id] || 0) + 1;
		}

		return viewCounts;
	},
);

/**
 * Check which posts the current user has viewed
 */
const getUserViewedPosts = cache(
	async (
		companyId: string,
		userId: string,
		postIds: string[],
	): Promise<Set<string>> => {
		if (postIds.length === 0) return new Set();

		const supabase = await createClient();
		if (!supabase) return new Set();

		const { data, error } = await supabase
			.from("pin_board_views")
			.select("post_id")
			.eq("company_id", companyId)
			.eq("user_id", userId)
			.in("post_id", postIds);

		if (error) {
			console.error("Failed to fetch user viewed posts:", error);
			return new Set();
		}

		return new Set((data ?? []).map((v) => v.post_id));
	},
);

/**
 * Search posts by title or content
 */
const searchPinBoardPosts = cache(
	async (
		companyId: string,
		searchQuery: string,
		limit = 20,
	): Promise<PinBoardPost[]> => {
		const supabase = await createClient();
		if (!supabase) return [];

		const { data, error } = await supabase
			.from("pin_board_posts")
			.select(`
      *,
      category:pin_board_categories(id, name, slug, icon, color)
    `)
			.eq("company_id", companyId)
			.eq("is_published", true)
			.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
			.order("is_pinned", { ascending: false })
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("Failed to search pin board posts:", error);
			return [];
		}

		return (data ?? []) as PinBoardPost[];
	},
);

/**
 * Get post count by category
 */
export const getPinBoardCategoryStats = cache(
	async (companyId: string): Promise<Record<string, number>> => {
		const supabase = await createClient();
		if (!supabase) return {};

		const { data, error } = await supabase
			.from("pin_board_posts")
			.select("category_id")
			.eq("company_id", companyId)
			.eq("is_published", true);

		if (error) {
			console.error("Failed to fetch category stats:", error);
			return {};
		}

		const stats: Record<string, number> = { all: data?.length ?? 0 };
		for (const post of data ?? []) {
			if (post.category_id) {
				stats[post.category_id] = (stats[post.category_id] || 0) + 1;
			}
		}

		return stats;
	},
);
