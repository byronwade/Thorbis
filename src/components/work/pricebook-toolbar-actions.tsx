"use client";

/**
 * Price Book Toolbar Actions - Client Component
 *
 * Provides quick actions for the price book page:
 * - View toggle (grid/table) - only shown at item level
 * - Add new item button
 * - Labor calculator quick access
 * - Export/import actions
 * - Bulk operations
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ViewToggle } from "@/components/pricebook/view-toggle";
import { Button } from "@/components/ui/button";
import { LaborCalculatorModal } from "@/components/work/labor-calculator-modal";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";

export function PriceBookToolbarActions() {
  const navigationPath = usePriceBookStore((state) => state.navigationPath);

  // Only show view toggle when we're deep enough to show items
  // (At root or shallow levels, we only show category cards)
  const showViewToggle = navigationPath.length >= 2;

  return (
    <div className="flex items-center gap-2">
      {showViewToggle && <ViewToggle />}
      <LaborCalculatorModal />
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/pricebook/new">
          <Plus className="mr-2 size-4" />
          Add Item
        </Link>
      </Button>
    </div>
  );
}
