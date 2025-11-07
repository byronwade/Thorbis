/**
 * Invoice PDF Preview
 *
 * Clean, read-only preview of the invoice exactly as it will appear in PDF.
 * Styled to look like a professional business document.
 */

"use client";

export function InvoicePDFPreview({
  invoice,
  customer,
  company,
}: {
  invoice: any;
  customer: any;
  company: any;
}) {
  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const lineItems = invoice.line_items || [];

  return (
    <div
      className="mx-auto bg-white shadow-2xl"
      style={{
        width: "8.5in",
        minHeight: "11in",
        padding: "1in",
        fontFamily: "'Times New Roman', serif",
        fontSize: "11pt",
      }}
    >
      {/* Header */}
      <div className="mb-16 flex justify-between border-b-2 border-black pb-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold uppercase">{company.name}</h1>
          <p className="text-sm">{company.address}</p>
          <p className="text-sm">{company.city}, {company.state} {company.zip}</p>
          <p className="text-sm">{company.phone}</p>
          <p className="text-sm">{company.email}</p>
        </div>
        <div className="text-right">
          <h2 className="mb-4 text-5xl font-bold">INVOICE</h2>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-600">Invoice #:</span> <span className="font-mono font-semibold">{invoice.invoice_number}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span> {formatDate(invoice.created_at)}
            </div>
            <div>
              <span className="text-gray-600">Due:</span> <span className="font-semibold">{formatDate(invoice.due_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-12">
        <h3 className="mb-3 font-semibold uppercase text-gray-600 text-xs tracking-wider">Bill To</h3>
        <p className="font-semibold">{customer.first_name} {customer.last_name}</p>
        <p className="text-sm">{customer.billing_address}</p>
        <p className="text-sm">{customer.billing_city}, {customer.billing_state} {customer.billing_zip}</p>
        <p className="text-sm">{customer.email}</p>
        <p className="text-sm">{customer.phone}</p>
      </div>

      {/* Line Items */}
      <table className="mb-12 w-full">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="pb-2 text-left font-semibold uppercase text-xs">Description</th>
            <th className="w-20 pb-2 text-right font-semibold uppercase text-xs">Qty</th>
            <th className="w-28 pb-2 text-right font-semibold uppercase text-xs">Rate</th>
            <th className="w-32 pb-2 text-right font-semibold uppercase text-xs">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item: any, i: number) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-3 text-sm">{item.description}</td>
              <td className="py-3 text-right font-mono text-sm">{item.quantity}</td>
              <td className="py-3 text-right font-mono text-sm">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 text-right font-mono font-semibold text-sm">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-gray-400">
            <td colSpan={3} className="pt-3 pb-2 text-right font-semibold uppercase text-sm">Subtotal</td>
            <td className="pt-3 pb-2 text-right font-mono font-bold">{formatCurrency(invoice.subtotal || 0)}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-12 flex justify-end">
        <div className="w-96 space-y-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-mono">{formatCurrency(invoice.subtotal || 0)}</span>
          </div>
          {invoice.tax_amount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax</span>
              <span className="font-mono">{formatCurrency(invoice.tax_amount)}</span>
            </div>
          )}
          {invoice.discount_amount > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Discount</span>
              <span className="font-mono">-{formatCurrency(invoice.discount_amount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t-2 border-black pt-3">
            <span className="font-bold uppercase">Total</span>
            <span className="font-mono text-xl font-bold">{formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="mb-2 font-semibold uppercase text-xs">Notes</h3>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 border-t pt-4 text-center">
        <p className="text-muted-foreground text-sm">Thank you for your business!</p>
      </div>
    </div>
  );
}
