"use client";

/**
 * Maintenance Plan Detail Toolbar Actions - Client Component
 *
 * Provides maintenance plan-specific toolbar actions:
 * - View Schedule
 * - Copy Plan
 * - Ellipsis menu with activate/pause/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { Calendar, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MaintenancePlanDetailToolbarActions() {
  const pathname = usePathname();
  const planId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-1.5">
      {/* Quick Actions */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
              <a href={`/dashboard/schedule?planId=${planId}`}>
                <Calendar className="size-3.5" />
                <span className="hidden md:inline">Schedule</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View plan schedule</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
              <a
                href={`/dashboard/work/maintenance-plans/new?cloneFrom=${planId}`}
              >
                <Copy className="size-3.5" />
                <span className="hidden lg:inline">Copy</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate plan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Ellipsis Menu */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="maintenance-plans" />
    </div>
  );
}
