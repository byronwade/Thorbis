"use client";

/**
 * Contract Detail Toolbar Actions - Client Component
 *
 * Provides contract-specific toolbar actions:
 * - Send for Signature
 * - Download PDF
 * - Ellipsis menu with copy/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { Copy, Download, Mail } from "lucide-react";
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

export function ContractDetailToolbarActions() {
  const pathname = usePathname();
  const contractId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions - Standardized styling */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              <Mail />
              <span className="hidden md:inline">Send</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send for signature</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              <Download />
              <span className="hidden lg:inline">PDF</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download PDF</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="sm" variant="outline">
              <a href={`/dashboard/work/contracts/new?cloneFrom=${contractId}`}>
                <Copy />
                <span className="hidden lg:inline">Copy</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate contract</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Separator and Import/Export */}
      <Separator className="h-8" orientation="vertical" />
      <ImportExportDropdown dataType="contracts" />
    </div>
  );
}
