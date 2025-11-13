"use client";

/**
 * Purchase Order Detail Toolbar Actions - Client Component
 *
 * Provides PO-specific toolbar actions:
 * - Send to Vendor
 * - Download PDF
 * - Ellipsis menu with receive/copy/archive
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

export function PurchaseOrderDetailToolbarActions() {
  const pathname = usePathname();
  const poId = pathname.split("/").pop();

  return (
    <div className="flex items-center gap-1.5">
      {/* Quick Actions */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="h-8 gap-1.5" size="sm" variant="outline">
              <Mail className="size-3.5" />
              <span className="hidden md:inline">Send</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send to vendor</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="h-8 gap-1.5" size="sm" variant="outline">
              <Download className="size-3.5" />
              <span className="hidden lg:inline">PDF</span>
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
              <a href={`/dashboard/work/purchase-orders/new?cloneFrom=${poId}`}>
                <Copy className="size-3.5" />
                <span className="hidden lg:inline">Copy</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate purchase order</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Ellipsis Menu */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="purchase-orders" />
    </div>
  );
}
