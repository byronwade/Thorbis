"use client";

/**
 * View Toggle Component
 *
 * Allows switching between grid and table views:
 * - Grid view (default) - Visual cards
 * - Table view - Compact data table
 * - Persists user preference in Zustand store
 */

import { Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";
import { cn } from "@/lib/utils";

export function ViewToggle() {
  const viewMode = usePriceBookStore((state) => state.viewMode);
  const setViewMode = usePriceBookStore((state) => state.setViewMode);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 rounded-md border p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn("size-8 p-0", viewMode === "grid" && "bg-accent")}
              onClick={() => setViewMode("grid")}
              size="sm"
              variant="ghost"
            >
              <Grid3x3 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grid View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn("size-8 p-0", viewMode === "table" && "bg-accent")}
              onClick={() => setViewMode("table")}
              size="sm"
              variant="ghost"
            >
              <List className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Table View</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
