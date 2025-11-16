/**
 * Invoices Page - Redirect to Work Invoices
 *
 * This page redirects to /dashboard/work/invoices to avoid duplication.
 * The canonical invoices page is in the work section.
 *
 * Performance: Instant redirect (< 5ms)
 */

import { redirect } from "next/navigation";

export default function InvoicesPage() {
  // Redirect to the canonical invoices page in the work section
  redirect("/dashboard/work/invoices");
}
