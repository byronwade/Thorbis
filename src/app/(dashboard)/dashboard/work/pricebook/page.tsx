/**
 * Work > Pricebook Page - Server Component
 *
 * Enhanced with industry best practices:
 * - ServiceTitan-style organization (Services, Materials, Equipment)
 * - Hierarchical categories with subcategories
 * - Good/Better/Best pricing tiers
 * - Flat-rate pricing indicators
 * - Labor hours for services
 * - Image thumbnails for items
 *
 * Performance optimizations:
 * - Server Component calculates statistics before rendering
 * - Only PriceBookTable component is client-side for interactions
 * - Better SEO and initial page load performance
 */

import { CategoryNavigationSync } from "@/components/pricebook/category-navigation-sync";
import { notFound } from "next/navigation";
import { DrillDownView } from "@/components/pricebook/drill-down-view";
import { getCategoryTree } from "@/lib/pricebook/category-tree-server";
import { createClient } from "@/lib/supabase/server";

export default async function PriceBookPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  if (!supabase) {
    throw new Error("Database connection not available");
  }

  // Fetch price book items from Supabase
  const { data: items, error } = await supabase
    .from("price_book_items")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching price book items:", error);
    throw new Error(`Failed to load price book items: ${error.message}`);
  }

  // Fetch category tree
  const categories = await getCategoryTree();

  return (
    <>
      {/* Sync root level (empty path) with Zustand store */}
      <CategoryNavigationSync categoryPath={[]} />

      {/* Render drill-down view with categories */}
      <DrillDownView
        categories={categories}
        items={items || []}
        itemsPerPage={50}
      />
    </>
  );
}
