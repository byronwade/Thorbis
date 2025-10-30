/**
 * Invoice Details Page - Server Component
 *
 * Performance optimizations:
 * - Server Component (no "use client" - uses params prop)
 * - Static content rendered on server
 * - Uses established AppToolbar pattern (configured via toolbar-config.tsx)
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 *
 * Features:
 * - BlockNote-based invoice editor
 * - Custom invoice blocks (header, line items, totals)
 * - Customizable design (colors, fonts, spacing)
 * - Preset templates
 * - Export to PDF
 */

import { InvoiceEditorClient } from "@/components/invoices/invoice-editor-client";

// ============================================================================
// Mock Data (Replace with real database queries)
// ============================================================================

const mockInvoice = {
  id: "1",
  invoiceNumber: "INV-2025-001",
  invoiceDate: "2025-01-31",
  dueDate: "2025-02-28",
  status: "draft",
  customerId: "customer-1",
  customerName: "John Smith",
  customerEmail: "john.smith@example.com",
  customerAddress: "123 Main Street",
  customerCity: "San Francisco, CA 94102",
  customerPhone: "(555) 123-4567",
  companyName: "Thorbis",
  companyAddress: "456 Business Ave",
  companyCity: "San Francisco, CA 94103",
  companyPhone: "(555) 987-6543",
  companyEmail: "billing@thorbis.com",
  lineItems: [
    {
      id: "1",
      description: "HVAC Installation Services",
      quantity: 1,
      rate: 2500,
      amount: 2500,
    },
    {
      id: "2",
      description: "Equipment - 3-Ton AC Unit",
      quantity: 1,
      rate: 3500,
      amount: 3500,
    },
    {
      id: "3",
      description: "Labor - Installation (8 hours)",
      quantity: 8,
      rate: 125,
      amount: 1000,
    },
  ],
  subtotal: 7000,
  taxRate: 8.5,
  taxAmount: 595,
  total: 7595,
  notes: "Payment due within 30 days. Thank you for your business!",
  paymentTerms: "Net 30",
  createdAt: new Date("2025-01-31"),
  updatedAt: new Date("2025-01-31"),
};

// ============================================================================
// Page Component
// ============================================================================

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: invoiceId } = await params;

  // ============================================================================
  // Data Fetching (Server-side)
  // ============================================================================

  // In production, replace with real database query
  const invoice = mockInvoice;

  // ============================================================================
  // Render
  // ============================================================================
  // Note: AppToolbar automatically renders based on route configuration
  // See src/lib/toolbar-config.tsx for invoice toolbar configuration

  return (
    <div className="py-6">
      {/* Invoice Editor */}
      <InvoiceEditorClient invoice={invoice} invoiceId={invoiceId} />
    </div>
  );
}
