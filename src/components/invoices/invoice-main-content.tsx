/**
 * Invoice Main Content
 *
 * Conditionally renders either:
 * - PDF Preview (default): Shows invoice as customer will see it
 * - Edit Mode: Editable Tiptap document
 *
 * Controlled by parent component's mode state
 */

"use client";

import { InvoicePDFPreview } from "./invoice-pdf-preview";

type ViewMode = "edit" | "preview";

interface InvoiceMainContentProps {
  invoice: any;
  customer: any;
  company: any;
  mode: ViewMode;
  onUpdate?: (content: any) => void;
}

export function InvoiceMainContent({
  invoice,
  customer,
  company,
  mode,
  onUpdate,
}: InvoiceMainContentProps) {
  // Always show PDF preview for now (edit mode removed - all editing happens in sidebar)
  return (
    <div className="mx-auto" style={{ maxWidth: "8.5in" }}>
      <InvoicePDFPreview invoice={invoice} customer={customer} company={company} />
    </div>
  );
}
