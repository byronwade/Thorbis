/**
 * Invoice Editor Wrapper - Client Component
 *
 * Main content for invoice page - managed by layout system.
 * The toolbar and right sidebar are rendered by the layout system.
 *
 * This component just handles:
 * - Invoice data state
 * - Inline editing
 * - Auto-save functionality
 *
 * Performance:
 * - Client Component for interactivity
 * - Debounced auto-save
 * - Optimistic updates
 */

"use client";

import { useCallback, useState } from "react";
import { InvoiceActivityLog } from "./invoice-activity-log";
import { InvoiceHeader } from "./invoice-header";
import { InvoiceLineItems } from "./invoice-line-items";
import { InvoiceOverdueBanner } from "./invoice-overdue-banner";
import { InvoiceParties } from "./invoice-parties";
import { InvoicePaymentManagement } from "./invoice-payment-management";
import { InvoiceProgressPayments } from "./invoice-progress-payments";
import { InvoiceTerms } from "./invoice-terms";
import { InvoiceTotals } from "./invoice-totals";

// Type definitions (matching database schema)
type Invoice = {
  id: string;
  company_id: string;
  job_id: string | null;
  customer_id: string;
  invoice_number: string;
  title: string;
  description: string | null;
  status: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  due_date: string | null;
  line_items: any;
  terms: string | null;
  notes: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_zip: string | null;
  company_name: string | null;
};

type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  tax_id: string | null;
};

interface InvoiceEditorWrapperProps {
  invoice: Invoice & {
    customer?: Customer | null;
    job?: { id: string; job_number: string; title: string } | null;
  };
  customer: Customer | null;
  company: Company | null;
  job?: { id: string; job_number: string; title: string } | null;
  property?: any | null;
  paymentMethods?: any[];
  activities?: any[];
}

export function InvoiceEditorWrapper({
  invoice: initialInvoice,
  customer,
  company,
  job,
  property,
  paymentMethods = [],
  activities = [],
}: InvoiceEditorWrapperProps) {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [showQuickPayment, setShowQuickPayment] = useState(false);

  // Update invoice field
  const updateField = useCallback((field: string, value: any) => {
    setInvoice((prev: Invoice) => ({ ...prev, [field]: value }));
  }, []);

  // Quick payment handler
  const handleQuickPayment = useCallback(() => {
    setShowQuickPayment(true);
    // Scroll to payment section
    const paymentSection = document.getElementById("payment-management");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Layout system handles toolbar, sidebars, padding, and max-width
  // Mix of constrained and full-width sections
  return (
    <>
      {/* Constrained Width Sections */}
      <div className="space-y-6">
        {/* Overdue Banner - Prominent Alert */}
        <InvoiceOverdueBanner
          balanceAmount={invoice.balance_amount}
          dueDate={invoice.due_date}
          onQuickPay={handleQuickPayment}
        />

        {/* Invoice Header */}
        <InvoiceHeader invoice={invoice} job={job} onUpdate={updateField} />

        {/* Business, Customer, and Property Info */}
        <InvoiceParties
          company={company}
          customer={customer}
          invoice={invoice}
          property={property}
        />

        {/* Line Items */}
        <InvoiceLineItems
          lineItems={invoice.line_items || []}
          onUpdate={(items) => updateField("line_items", items)}
        />

        {/* Totals */}
        <InvoiceTotals invoice={invoice} />

        {/* Terms and Notes */}
        <InvoiceTerms
          notes={invoice.notes}
          onUpdate={updateField}
          terms={invoice.terms}
        />

        {/* Payment Management - Cards on file and payment dialog */}
        <div id="payment-management">
          <InvoicePaymentManagement
            autoOpen={showQuickPayment}
            invoice={invoice}
            paymentMethods={paymentMethods}
          />
        </div>
      </div>

      {/* Progress Payments Datatable - Collapsible Card */}
      <InvoiceProgressPayments invoice={invoice} />

      {/* Constrained Width Sections */}
      <div className="w-full">
        {/* Activity Log */}
        <InvoiceActivityLog activities={activities} />
      </div>
    </>
  );
}
