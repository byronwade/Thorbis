"use client";

/**
 * Equipment Detail Toolbar Actions - Client Component
 *
 * Provides equipment-specific toolbar actions:
 * - Create Service Job
 * - View Maintenance Log
 * - Ellipsis menu with QR code/export/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { ClipboardList, Copy, Wrench } from "lucide-react";
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

export function EquipmentDetailToolbarActions() {
  const pathname = usePathname();
  const equipmentId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions - Standardized styling */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="sm" variant="outline">
              <a href={`/dashboard/work/new?equipmentId=${equipmentId}`}>
                <Wrench />
                <span className="hidden md:inline">Service Job</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create service job for this equipment</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="sm" variant="outline">
              <a
                href={`/dashboard/work/equipment/${equipmentId}?tab=maintenance`}
              >
                <ClipboardList />
                <span className="hidden lg:inline">Maintenance</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View maintenance log</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="sm" variant="outline">
              <a
                href={`/dashboard/work/equipment/new?cloneFrom=${equipmentId}`}
              >
                <Copy />
                <span className="hidden lg:inline">Copy</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate equipment record</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Separator and Import/Export */}
      <Separator className="h-8" orientation="vertical" />
      <ImportExportDropdown dataType="equipment" />
    </div>
  );
}
