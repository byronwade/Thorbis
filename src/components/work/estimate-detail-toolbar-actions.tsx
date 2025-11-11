"use client";

/**
 * Estimate Detail Toolbar Actions - Client Component
 *
 * Provides estimate-specific toolbar actions for detail pages:
 * - Save estimate
 * - Preview
 * - Export to PDF
 * - Send via email
 * - Ellipsis menu with export/import
 */

import { Download, Eye, Mail, Save } from "lucide-react";
import { useState } from "react";
import { ImportExportDropdown } from "@/components/data/import-export-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function EstimateDetailToolbarActions() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export to PDF");
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending
    console.log("Send email");
  };

  const handlePreview = () => {
    // TODO: Implement preview
    console.log("Preview estimate");
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Primary Action - Save */}
      <Button
        className="gap-2 font-medium"
        disabled={isSaving}
        onClick={handleSave}
        size="sm"
        variant="default"
      >
        <Save className="size-4" />
        {isSaving ? "Saving..." : "Save"}
      </Button>

      <Separator className="h-6" orientation="vertical" />

      {/* Secondary Actions Group */}
      <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-8 shrink-0 hover:bg-background"
                onClick={handlePreview}
                size="icon"
                variant="ghost"
              >
                <Eye className="size-4" />
                <span className="sr-only">Preview estimate</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview estimate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-8 shrink-0 hover:bg-background"
                onClick={handleExportPDF}
                size="icon"
                variant="ghost"
              >
                <Download className="size-4" />
                <span className="sr-only">Export to PDF</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export to PDF</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-8 shrink-0 hover:bg-background"
                onClick={handleSendEmail}
                size="icon"
                variant="ghost"
              >
                <Mail className="size-4" />
                <span className="sr-only">Send via email</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send via email</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Ellipsis Menu - Export/Import & More */}
      <Separator className="h-6" orientation="vertical" />
      <ImportExportDropdown dataType="estimates" />
    </div>
  );
}

