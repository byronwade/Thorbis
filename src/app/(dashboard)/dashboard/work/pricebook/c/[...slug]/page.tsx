/**
 * Price Book Category Drill-Down Page - Server Component
 *
 * URL Structure:
 * - /pricebook/c/hvac → HVAC category
 * - /pricebook/c/hvac/heating → HVAC > Heating
 * - /pricebook/c/hvac/heating/furnaces → HVAC > Heating > Furnaces
 *
 * Performance optimizations:
 * - Server Component by default
 * - URL-based navigation (shareable/bookmarkable)
 * - Syncs with Zustand store for UI consistency
 */

import { notFound } from "next/navigation";
import { CategoryNavigationSync } from "@/components/pricebook/category-navigation-sync";
import { DrillDownView } from "@/components/pricebook/drill-down-view";
import { getCategoryTree } from "@/lib/pricebook/category-tree-server";
import { getCategoriesAtPath } from "@/lib/pricebook/category-tree-shared";
import { createClient } from "@/lib/supabase/server";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  if (!supabase) {
    throw new Error("Database connection not available");
  }

  // Decode URL segments to category names
  const categoryPath = slug.map((segment) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  // Build the category path string (e.g., "HVAC > Heating > Furnaces")
  const categoryPathString = categoryPath.join(" › ");

  // Validate category exists in database
  const { data: category, error: categoryError } = await supabase
    .from("price_book_categories")
    .select("id")
    .eq("path", categoryPathString)
    .eq("is_active", true)
    .single();

  if (categoryError || !category) {
    notFound();
  }

  // Fetch price book items for this category
  const { data: items, error: itemsError } = await supabase
    .from("price_book_items")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (itemsError) {
    console.error("Error fetching price book items:", itemsError);
    throw new Error(`Failed to load price book items: ${itemsError.message}`);
  }

  // Fetch full category tree and get subcategories at current path
  const fullTree = await getCategoryTree();
  const subcategories = getCategoriesAtPath(fullTree, categoryPath);

  return (
    <>
      {/* Client component to sync URL with Zustand store */}
      <CategoryNavigationSync categoryPath={categoryPath} />

      {/* Server component renders content with subcategories */}
      <DrillDownView
        categories={subcategories}
        items={items || []}
        itemsPerPage={50}
      />
    </>
  );
}
