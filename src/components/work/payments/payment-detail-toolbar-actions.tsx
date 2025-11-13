"use client";

/**
 * Payment Detail Toolbar Actions - Client Component
 *
 * Provides payment-specific toolbar actions:
 * - Download Receipt
 * - Send Receipt
 * - Ellipsis menu with refund/archive
 *
 * Design: Clean, compact, outline buttons
 */

import { Download, Mail, Printer } from "lucide-react";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PaymentDetailToolbarActions() {
  return (
    <div className="flex items-center gap-2">
      {/* Quick Actions - Standardized styling */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              <Download />
              <span className="hidden md:inline">Receipt</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download receipt</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              <Mail />
              <span className="hidden lg:inline">Email</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Email receipt to customer</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              <Printer />
              <span className="hidden lg:inline">Print</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Print receipt</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Separator and Import/Export */}
      <Separator className="h-8" orientation="vertical" />
      <ImportExportDropdown dataType="payments" />
    </div>
  );
}
