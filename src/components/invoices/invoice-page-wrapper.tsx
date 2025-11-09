/**
 * Invoice Page Wrapper
 *
 * Client component wrapper that manages:
 * - View mode state (preview/edit)
 * - Main content area
 * - Right business sidebar
 *
 * Layout structure matches customer page pattern
 */

"use client";

import { useState } from "react";
import { InvoiceMainContent } from "./invoice-main-content";
import { InvoicePreviewToggle } from "./invoice-preview-toggle";
import { InvoiceSidebarBusiness } from "./invoice-sidebar-business";

interface InvoicePageWrapperProps {
  invoice: any;
  customer: any;
  company: any;
  payments: any[];
}

export function InvoicePageWrapper({
  invoice,
  customer,
  company,
  payments,
}: InvoicePageWrapperProps) {
  const [mode, setMode] = useState<"edit" | "preview">("preview"); // Default to preview

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    window.open(`/api/invoices/${invoice.id}/pdf`, "_blank");
  };

  const handleUpdate = (content: any) => {
    // TODO: Call server action to save content
    console.log("Invoice updated:", content);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <InvoicePreviewToggle
          mode={mode}
          onExportPDF={handleExportPDF}
          onModeChange={setMode}
        />
        <InvoiceMainContent
          company={company}
          customer={customer}
          invoice={invoice}
          mode={mode}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Right Sidebar - Business Logic */}
      <InvoiceSidebarBusiness
        invoice={invoice}
        lineItems={invoice.line_items || []}
        payments={payments}
      />
    </div>
  );
}
