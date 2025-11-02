"use client";

/**
 * Price Book Item Toolbar Actions - Client Component
 *
 * Provides actions for individual price book item pages:
 * - Edit button
 * - More dropdown (duplicate, add to invoice, deactivate, delete)
 */

import { Archive, Copy, Edit, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PriceBookItemToolbarActions() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const itemId = segments[segments.length - 1];

  return (
    <div className="flex items-center gap-1">
      <Button asChild size="sm" variant="default">
        <Link href={`/dashboard/work/pricebook/${itemId}/edit`}>
          <Edit className="mr-2 size-4" />
          Edit
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log("Duplicate")}>
            <Copy className="mr-2 size-4" />
            Duplicate Item
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Add to invoice")}>
            <ShoppingCart className="mr-2 size-4" />
            Add to Invoice
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-orange-600 dark:text-orange-400"
            onClick={() => console.log("Toggle active")}
          >
            <Archive className="mr-2 size-4" />
            Deactivate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => console.log("Delete")}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
