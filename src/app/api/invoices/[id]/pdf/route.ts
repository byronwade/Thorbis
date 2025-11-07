/**
 * Invoice PDF Generation API Route
 *
 * Generates a PDF from an invoice's TipTap content
 * Returns the PDF as a downloadable file
 *
 * Security:
 * - Validates user has access to invoice
 * - Uses RLS policies
 * - Company-scoped
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;

    // Get Supabase client
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      return NextResponse.json({ error: "No company found" }, { status: 403 });
    }

    // Get invoice with full data
    const { data: invoice } = await supabase
      .from("invoices")
      .select(`
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          email,
          phone,
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
          website,
          tax_id
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Verify invoice belongs to user's company (RLS should handle this but double-check)
    if (invoice.company_id !== teamMember.company_id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get customization settings (TODO: Load from user preferences or invoice settings)
    const customization = {
      colors: {
        primary: "#3b82f6",
        text: "#000000",
        mutedText: "#666666",
        heading: "#1f2937",
        border: "#e5e7eb",
        tableHeader: "#f3f4f6",
        notesBg: "#f9fafb",
      },
      typography: {
        bodyFont: "Helvetica",
        headingFont: "Helvetica-Bold",
        bodySize: 10,
        headingSize: 24,
      },
      spacing: {
        pagePadding: 48,
      },
    };

    // Generate PDF content from page_content or create default
    const content = invoice.page_content || {
      type: "doc",
      content: [
        // Generate default structure from invoice data
      ],
    };

    // Generate PDF using service function
    const { generateInvoicePDFBuffer } = await import("@/lib/pdf/generate-invoice-pdf");
    const pdfBuffer = await generateInvoicePDFBuffer(content, customization);

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
