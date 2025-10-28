"use client";

import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type KPICardTooltipProps = {
  tooltip: string;
};

/**
 * Client-only tooltip wrapper for KPI cards
 * Separated to keep the main KPICard as a Server Component
 */
export function KPICardTooltip({ tooltip }: KPICardTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-3.5 cursor-help text-muted-foreground transition-colors hover:text-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
