/**
 * New Payment Page
 *
 * Server Component that fetches data and renders PaymentForm
 */

import { redirect } from "next/navigation";
import { PaymentForm } from "@/components/work/payments/payment-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  if (!supabase) {
    redirect("/login");
  }

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember) {
    redirect("/");
  }

  // Fetch customers
  const { data: customers } = await supabase
    .from("customers")
    .select("id, first_name, last_name, display_name, email")
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch unpaid/partially paid invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, customer_id, total_amount, paid_amount, status"
    )
    .eq("company_id", teamMember.company_id)
    .in("status", ["pending", "sent", "overdue", "partial"])
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="font-bold text-3xl tracking-tight">Record Payment</h1>
        <p className="text-muted-foreground">
          Process and record customer payment for an invoice
        </p>
      </div>

      <PaymentForm
        customers={customers || []}
        invoices={invoices || []}
        preselectedCustomerId={
          typeof params.customerId === "string" ? params.customerId : undefined
        }
        preselectedInvoiceId={
          typeof params.invoiceId === "string" ? params.invoiceId : undefined
        }
      />
    </div>
  );
}
