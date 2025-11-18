/**
 * Server-Side Category Tree Functions
 *
 * Functions for fetching and building category trees on the server.
 * Uses server-side Supabase client with session management.
 */

import { createClient as createServerClient } from "@/lib/supabase/server";
import {
	buildCategoryTree,
	type DatabaseCategory,
} from "./category-tree-shared";

/**
 * Fetch all categories for the current user's company (server-side)
 */
export async function fetchCategoriesServer(): Promise<DatabaseCategory[]> {
	const supabase = await createServerClient();

	if (!supabase) {
		return [];
	}

	const { data: categories, error } = await supabase
		.from("price_book_categories")
		.select(
			"id, name, slug, parent_id, path, level, sort_order, item_count, descendant_item_count",
		)
		.eq("is_active", true)
		.order("level", { ascending: true })
		.order("sort_order", { ascending: true });

	if (error) {
		return [];
	}

	return categories || [];
}

/**
 * Fetch and build complete category tree (server-side)
 */
export async function getCategoryTree() {
	const categories = await fetchCategoriesServer();
	return buildCategoryTree(categories);
}
