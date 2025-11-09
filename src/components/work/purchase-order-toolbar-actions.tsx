"use client";

/**
 * Purchase Order Toolbar Actions - Client Component
 *
 * Provides purchase order-specific toolbar actions
 * - New PO button
 * - Import/Export actions
 */

import { Plus } from "lucide-react";
import Link from "next/link";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";

export function PurchaseOrderToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard/work/purchase-orders/new">
          <Plus className="mr-2 size-4" />
          New Purchase Order
        </Link>
      </Button>
      <ImportExportDropdown dataType="purchase-orders" />
    </div>
  );
}
