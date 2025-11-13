"use client";

/**
 * Property Detail Toolbar Actions - Client Component
 *
 * Provides property-specific toolbar actions:
 * - New Job
 * - Schedule
 * - Ellipsis menu with export/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { Briefcase, Calendar, MapPin } from "lucide-react";
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

export function PropertyDetailToolbarActions() {
  const pathname = usePathname();
  const propertyId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-1.5">
      {/* Quick Actions */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
              <a href={`/dashboard/work/new?propertyId=${propertyId}`}>
                <Briefcase className="size-3.5" />
                <span className="hidden md:inline">New Job</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new job for this property</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
              <a href={`/dashboard/schedule?propertyId=${propertyId}`}>
                <Calendar className="size-3.5" />
                <span className="hidden lg:inline">Schedule</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View property schedule</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="h-8 gap-1.5" size="sm" variant="outline">
              <MapPin className="size-3.5" />
              <span className="hidden lg:inline">Map</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View on map</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Ellipsis Menu */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="customers" />
    </div>
  );
}
