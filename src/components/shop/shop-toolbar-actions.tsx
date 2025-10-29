/**
 * Shop Toolbar Actions - Client Component
 *
 * Client-side features:
 * - Shopping cart button with counter
 * - Interactive toolbar actions
 */

"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShopToolbarActions() {
  return (
    <div className="flex items-center gap-3">
      <Button>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Cart (0)
      </Button>
    </div>
  );
}
