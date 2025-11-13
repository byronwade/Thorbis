/**
 * New Invoice Page
 *
 * Server Component that fetches data and renders InvoiceForm
 * Supports pre-filling from estimate via estimateId param
 */

import { redirect } from "next/navigation";
import { InvoiceForm } from "@/components/work/invoices/invoice-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewInvoicePage({
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

  // Fetch estimate if converting from estimate
  let estimate = null;
  const estimateId =
    typeof params.estimateId === "string" ? params.estimateId : undefined;

  if (estimateId) {
    const { data: estimateData } = await supabase
      .from("estimates")
      .select("*")
      .eq("id", estimateId)
      .eq("company_id", teamMember.company_id)
      .single();

    estimate = estimateData;
  }

  // Fetch customers
  const { data: customers } = await supabase
    .from("customers")
    .select(
      "id, first_name, last_name, display_name, email, phone, company_name"
    )
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, address, city, state, zip_code")
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch price book items
  const { data: priceBookItems } = await supabase
    .from("price_book_items")
    .select("id, name, description, unit_price, sku")
    .eq("company_id", teamMember.company_id)
    .eq("is_active", true)
    .order("name")
    .limit(100);

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6">
        <h1 className="font-bold text-3xl tracking-tight">
          {estimate ? "Convert Estimate to Invoice" : "Create New Invoice"}
        </h1>
        <p className="text-muted-foreground">
          {estimate
            ? `Converting estimate ${estimate.estimate_number} to invoice`
            : "Generate a professional invoice for your customer"}
        </p>
      </div>

      <InvoiceForm
        customers={customers || []}
        estimate={estimate}
        preselectedCustomerId={
          typeof params.customerId === "string" ? params.customerId : undefined
        }
        preselectedEstimateId={estimateId}
        priceBookItems={priceBookItems || []}
        properties={properties || []}
      />
    </div>
  );
}
