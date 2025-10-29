"use client";

/**
 * Invoice Toolbar Actions - Client Component
 *
 * Provides invoice-specific toolbar actions used in AppToolbar
 * - Save invoice
 * - Preview
 * - Export to PDF
 * - Send via email
 *
 * Note: Invoice number and status are displayed in the toolbar title/subtitle,
 * not here to avoid duplication.
 */

import { Download, Eye, Mail, PanelRight, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInvoiceSidebarStore } from "@/lib/stores/invoice-sidebar-store";

// ============================================================================
// Invoice Toolbar Actions Component
// ============================================================================

export function InvoiceToolbarActions() {
  const [isSaving, setIsSaving] = useState(false);
  const toggleRightSidebar = useInvoiceSidebarStore((state) => state.toggle);
  const isRightSidebarOpen = useInvoiceSidebarStore((state) => state.isOpen);

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
    console.log("Preview invoice");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Save Button */}
      <Button
        disabled={isSaving}
        onClick={handleSave}
        size="sm"
        variant="default"
      >
        <Save className="mr-2 size-4" />
        {isSaving ? "Saving..." : "Save"}
      </Button>

      {/* Preview */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handlePreview} size="sm" variant="outline">
              <Eye className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Preview invoice</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Export PDF */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleExportPDF} size="sm" variant="outline">
              <Download className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export to PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Send Email */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleSendEmail} size="sm" variant="outline">
              <Mail className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send via email</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Right Sidebar Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleRightSidebar}
              size="sm"
              variant={isRightSidebarOpen ? "default" : "outline"}
            >
              <PanelRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isRightSidebarOpen ? "Hide" : "Show"} invoice customization
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
