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
 * - Server Component fetches data before rendering
 * - PriceBookTable component is client-side for interactions
 * - Better SEO and initial page load performance
 */

import { notFound } from "next/navigation";
import type { PriceBookItem } from "@/components/work/price-book-table";
import { PriceBookTable } from "@/components/work/price-book-table";
import { createClient } from "@/lib/supabase/server";

export default async function PriceBookPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  try {
    // Fetch price book items from Supabase
    const { data: rawItems, error } = await supabase
      .from("price_book_items")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching price book items:", error);
      // Return empty state instead of throwing
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 font-semibold text-lg">
              Failed to load price book items
            </h3>
            <p className="text-muted-foreground text-sm">{error.message}</p>
          </div>
        </div>
      );
    }

    // Transform database items to PriceBookItem format
    const items: PriceBookItem[] = (rawItems || []).map((item: any) => ({
      id: item.id,
      itemType: item.item_type || "service",
      name: item.name || "",
      description: item.description,
      sku: item.sku || "",
      category: item.category || "General",
      subcategory: item.subcategory || null,
      cost: item.cost || 0,
      price: item.price || 0,
      priceTier: item.price_tier,
      markupPercent: item.markup_percent || 0,
      laborHours: item.labor_hours,
      unit: item.unit || "each",
      imageUrl: item.image_url,
      isActive: item.is_active ?? true,
      isFlatRate: item.is_flat_rate ?? false,
      supplierName: item.supplier_name,
      supplierSku: item.supplier_sku,
      tags: item.tags || [],
      lastUpdated: item.updated_at ? new Date(item.updated_at) : undefined,
    }));

    return <PriceBookTable items={items} itemsPerPage={50} />;
  } catch (error) {
    console.error("Unexpected error in PriceBookPage:", error);
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="mb-2 font-semibold text-lg">Something went wrong</h3>
          <p className="text-muted-foreground text-sm">
            {error instanceof Error
              ? error.message
              : "Failed to load price book"}
          </p>
        </div>
      </div>
    );
  }
}
