import { notFound } from "next/navigation";
import type { PriceBookItem } from "@/components/work/price-book-table";
import { PriceBookTable } from "@/components/work/price-book-table";
import { createClient } from "@/lib/supabase/server";

export async function PricebookData() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Fetch price book items from Supabase
  const { data: rawItems, error } = await supabase
    .from("price_book_items")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load price book items: ${error.message}`);
  }

  // Transform database items to PriceBookItem format
  // biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
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
}
