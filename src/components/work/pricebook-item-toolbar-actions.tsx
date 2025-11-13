"use client";

/**
 * Price Book Item Toolbar Actions - Client Component
 *
 * Provides actions for individual price book item pages:
 * - Edit button
 * - More dropdown (duplicate, add to invoice, deactivate, delete)
 */

import {
  Archive,
  Copy,
  Edit,
  MoreVertical,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PriceBookItemToolbarActions() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const itemId = segments[segments.length - 1];

  return (
    <div className="flex items-center gap-1.5">
      {/* Primary Action - Edit */}
      <Button asChild className="gap-2 font-medium" size="sm" variant="default">
        <Link href={`/dashboard/work/pricebook/${itemId}/edit`}>
          <Edit className="size-4" />
          Edit
        </Link>
      </Button>

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className="gap-2 hover:bg-muted"
                  size="sm"
                  variant="ghost"
                >
                  <MoreVertical className="size-4" />
                  <span className="hidden sm:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
            className="text-warning dark:text-warning"
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

      {/* Ellipsis Menu - Export/Import & More */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="pricebook" />
    </div>
  );
}
