import { PriceBookItemForm } from "@/components/work/price-book-item-form";
// import { getSupabaseClient } from "@/lib/db";

/**
 * New Price Book Item Page - Server Component
 *
 * Performance optimizations:
 * - Server Component handles initial data fetching
 * - Form is client component for interactivity
 * - Pre-fetch supplier list, categories, etc. on server
 * - Uses AppToolbar for consistent UI with breadcrumbs
 */

export default async function NewPriceBookItemPage() {
  // TODO: Fetch data to populate form dropdowns
  // const supabase = await getSupabaseClient();
  // const { data: suppliers } = await supabase
  //   .from("supplier_integrations")
  //   .select("*");
  // const { data: categories } = await supabase
  //   .from("price_book_items")
  //   .select("category")
  //   .order("category");

  return (
    <div className="mx-auto max-w-4xl p-6">
      <PriceBookItemForm />
    </div>
  );
}
