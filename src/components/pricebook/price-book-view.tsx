"use client";

/**
 * Price Book View Component
 *
 * Handles switching between grid and table views:
 * - Reads viewMode from Zustand store
 * - Renders grid or table accordingly
 * - Passes through all props to child components
 */

import type { PriceBookItem } from "@/components/work/price-book-table";
import { PriceBookTable } from "@/components/work/price-book-table";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";
import { PriceBookCardGrid } from "./price-book-card-grid";

type PriceBookViewProps = {
  items: PriceBookItem[];
  itemsPerPage?: number;
};

export function PriceBookView({
  items,
  itemsPerPage = 50,
}: PriceBookViewProps) {
  const viewMode = usePriceBookStore((state) => state.viewMode);

  if (viewMode === "grid") {
    return (
      <div className="px-6 py-6">
        <PriceBookCardGrid
          emptyMessage="No items found in this category"
          items={items}
        />
      </div>
    );
  }

  return <PriceBookTable items={items} itemsPerPage={itemsPerPage} />;
}
