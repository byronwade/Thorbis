/**
 * Invoices Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Fetches real data from Supabase
 * - Uses established DataTablePageHeader pattern
 * - Follows consistent design system with other pages
 * - ISR revalidation every 5 minutes for invoice updates
 */

import { Download, FileText, Plus, Send, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'; // Force dynamic rendering

// Helper to format date
function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Map database status to component status
function mapStatus(dbStatus: string): Invoice["status"] {
  const statusMap: Record<string, Invoice["status"]> = {
    paid: "paid",
    partial: "pending",
    sent: "pending",
    draft: "draft",
    overdue: "overdue",
  };
  return statusMap[dbStatus] || "draft";
}

export default async function InvoicesPage() {
  // Fetch real invoices from Supabase
  const supabase = await createClient();
  
  if (!supabase) {
    return <div>Error: Could not connect to database</div>;
  }

  const { data: invoicesData, error } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      status,
      total_amount,
      paid_amount,
      created_at,
      due_date,
      customers:customer_id (
        company_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10000); // Fetch all invoices (increase if you have more)

  if (error) {
    console.error("Error fetching invoices:", error);
    return <div>Error loading invoices</div>;
  }

  // Debug logging
  console.log("📊 Fetched invoices count:", invoicesData?.length || 0);
  console.log("📊 First 3 invoice numbers:", invoicesData?.slice(0, 3).map((i: any) => i.invoice_number));

  // Transform database data to component format
  const invoices: Invoice[] = (invoicesData || []).map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number || "N/A",
    customer: inv.customers?.company_name || "Unknown Customer",
    date: formatDate(inv.created_at),
    dueDate: formatDate(inv.due_date),
    amount: inv.total_amount || 0,
    status: mapStatus(inv.status),
  }));

  // Calculate stats from real data
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="flex h-full flex-col">
      <DataTablePageHeader
        actions={
          <>
            <Button size="sm" variant="outline">
              <Upload className="mr-2 size-4" />
              Import
            </Button>
            <Button size="sm" variant="outline">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Send className="mr-2 size-4" />
              Send Batch
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard/invoices/create">
                <Plus className="mr-2 size-4" />
                New Invoice
              </Link>
            </Button>
          </>
        }
        description="Manage billing, payments, and financial transactions"
        stats={
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    Total Invoiced
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  ${(totalAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {totalInvoices} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-success">
                  ${(paidAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {invoices.filter((inv) => inv.status === "paid").length}{" "}
                  invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-warning">
                  ${(pendingAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {
                    invoices.filter((inv) => inv.status === "pending")
                      .length
                  }{" "}
                  invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl text-destructive">
                  ${(overdueAmount / 100).toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  {
                    invoices.filter((inv) => inv.status === "overdue")
                      .length
                  }{" "}
                  invoices
                </p>
              </CardContent>
            </Card>
          </div>
        }
        title="Invoices"
      />

      <div className="flex-1 overflow-auto">
        <InvoicesTable invoices={invoices} itemsPerPage={50} enableVirtualization={true} />
      </div>
    </div>
  );
}
