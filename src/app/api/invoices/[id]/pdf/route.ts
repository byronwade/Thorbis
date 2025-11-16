/**
 * Invoice PDF Generation API Route
 *
 * Generates and serves invoice PDFs
 *
 * Usage: GET /api/invoices/[id]/pdf
 * Returns: PDF file
 */

import { renderToBuffer } from "@react-pdf/renderer";
import { type NextRequest, NextResponse } from "next/server";
import { InvoicePDFDocument } from "@/lib/pdf/invoice-pdf-generator";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;

    // Fetch invoice with customer and company details
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Unable to connect to database" },
        { status: 500 }
      );
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          display_name,
          email,
          phone,
          company_name,
          billing_address,
          billing_city,
          billing_state,
          billing_zip
        ),
        company:companies!company_id(
          id,
          name,
          email,
          phone,
          address_line1,
          address_line2,
          city,
          state,
          postal_code
        )
      `
      )
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Normalize customer and company data
    const customer = Array.isArray(invoice.customer)
      ? invoice.customer[0]
      : invoice.customer;
    const company = Array.isArray(invoice.company)
      ? invoice.company[0]
      : invoice.company;

    if (!(customer && company)) {
      return NextResponse.json(
        { error: "Invoice data incomplete" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfDocument = InvoicePDFDocument({ invoice, customer, company });
    const pdfBuffer = await renderToBuffer(pdfDocument);

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
