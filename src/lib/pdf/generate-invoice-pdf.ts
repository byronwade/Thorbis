/**
 * Invoice PDF Generation Service
 *
 * Generates PDF from invoice TipTap content using @react-pdf/renderer
 * This is a server-side utility function, not a component
 */

import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { InvoicePDFDocument } from "@/components/invoices/invoice-pdf-renderer";

export async function generateInvoicePDFBuffer(
  content: any,
  customization?: any
): Promise<Buffer> {
  // Create the PDF document element
  const pdfElement = createElement(InvoicePDFDocument, { content, customization });

  // Render to buffer
  const buffer = await renderToBuffer(pdfElement as any);

  return Buffer.from(buffer);
}
