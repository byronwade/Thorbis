"use client";

/**
 * Service Agreement Detail Toolbar Actions - Client Component
 *
 * Provides service agreement-specific toolbar actions:
 * - Download PDF
 * - View Schedule
 * - Ellipsis menu with renew/copy/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { Calendar, Copy, Download } from "lucide-react";
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

export function ServiceAgreementDetailToolbarActions() {
  const pathname = usePathname();
  const agreementId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-1.5">
      {/* Quick Actions */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="h-8 gap-1.5" size="sm" variant="outline">
              <Download className="size-3.5" />
              <span className="hidden md:inline">PDF</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
              <a href={`/dashboard/schedule?agreementId=${agreementId}`}>
                <Calendar className="size-3.5" />
                <span className="hidden lg:inline">Schedule</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View agreement schedule</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild className="h-8 gap-1.5" size="sm" variant="outline">
              <a
                href={`/dashboard/work/service-agreements/new?cloneFrom=${agreementId}`}
              >
                <Copy className="size-3.5" />
                <span className="hidden lg:inline">Copy</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate agreement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Ellipsis Menu */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="service-agreements" />
    </div>
  );
}
