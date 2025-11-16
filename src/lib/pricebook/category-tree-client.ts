/**
 * Client-Side Category Tree Functions
 *
 * Functions for fetching and building category trees on the client.
 * Uses browser-side Supabase client.
 */

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import {
  buildCategoryTree,
  type DatabaseCategory,
} from "./category-tree-shared";

/**
 * Fetch all categories for the current user's company (client-side)
 */
export async function fetchCategoriesClient(): Promise<DatabaseCategory[]> {
  const supabase = createBrowserClient();

  if (!supabase) {
    return [];
  }

  const { data: categories, error } = await supabase
    .from("price_book_categories")
    .select(
      "id, name, slug, parent_id, path, level, sort_order, item_count, descendant_item_count"
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
 * Fetch and build complete category tree (client-side)
 */
export async function getCategoryTreeClient() {
  const categories = await fetchCategoriesClient();
  return buildCategoryTree(categories);
}
