import { PriceBookItemForm } from "@/components/work/price-book-item-form";

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
  // const suppliers = await db.select().from(supplierIntegrations);
  // const categories = await db.select().from(priceBookItems).groupBy('category');

  return (
    <div className="mx-auto max-w-4xl p-6">
      <PriceBookItemForm />
    </div>
  );
}
