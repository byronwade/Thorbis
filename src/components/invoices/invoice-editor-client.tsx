"use client";

/**
 * Invoice Editor Client - Client Component
 *
 * Wraps the invoice editor for the main content area.
 * Customization controls are in the right sidebar (invoice-sidebar-right.tsx)
 * which is managed at the layout level.
 *
 * Performance optimizations:
 * - Zustand for state management
 * - Selective re-renders
 * - Auto-save functionality
 */

import { InvoiceBuilder } from "./invoice-builder";

// ============================================================================
// Props Types
// ============================================================================

interface InvoiceEditorClientProps {
  invoiceId: string;
  invoice: {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    customerCity: string;
    customerPhone: string;
    companyName: string;
    companyAddress: string;
    companyCity: string;
    companyPhone: string;
    companyEmail: string;
    lineItems: Array<{
      id: string;
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes: string;
    paymentTerms: string;
  };
}

// ============================================================================
// Invoice Editor Client Component
// ============================================================================

export function InvoiceEditorClient({
  invoiceId,
  invoice,
}: InvoiceEditorClientProps) {
  return <InvoiceBuilder invoice={invoice} />;
}
