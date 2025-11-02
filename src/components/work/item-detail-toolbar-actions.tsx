"use client";

/**
 * Item Detail Toolbar Actions - Client Component
 *
 * Provides quick actions for price book item detail pages:
 * - Back to Price Book button
 * - Edit item button
 * - Actions dropdown (Duplicate, Archive, Delete)
 *
 * Follows existing AppToolbar pattern - no custom headers!
 */

import {
  Archive,
  ArrowLeft,
  Copy,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ItemDetailToolbarActionsProps = {
  /** Item ID for edit/delete operations */
  itemId: string;
  /** Whether item is currently active */
  isActive?: boolean;
};

export function ItemDetailToolbarActions({
  itemId,
  isActive = true,
}: ItemDetailToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Back to Price Book */}
      <Button asChild size="sm" variant="outline">
        <Link href="/dashboard/work/pricebook">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Link>
      </Button>

      {/* Edit Item */}
      <Button asChild size="sm" variant="default">
        <Link href={`/dashboard/work/pricebook/${itemId}/edit`}>
          <Edit className="mr-2 size-4" />
          Edit
        </Link>
      </Button>

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <MoreVertical className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              // TODO: Implement duplicate
              console.log("Duplicate item:", itemId);
            }}
          >
            <Copy className="mr-2 size-4" />
            Duplicate Item
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // TODO: Implement archive/activate toggle
              console.log(isActive ? "Archive" : "Activate", itemId);
            }}
          >
            <Archive className="mr-2 size-4" />
            {isActive ? "Archive" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              // TODO: Implement delete with confirmation
              console.log("Delete item:", itemId);
            }}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
