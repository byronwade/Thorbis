/**
 * New Estimate Page
 *
 * Server Component that fetches data and renders EstimateForm
 */

import { redirect } from "next/navigation";
import { EstimateForm } from "@/components/work/estimates/estimate-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewEstimatePage({
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
          Create New Estimate
        </h1>
        <p className="text-muted-foreground">
          Generate a professional estimate for your customer
        </p>
      </div>

      <EstimateForm
        customers={customers || []}
        preselectedCustomerId={
          typeof params.customerId === "string" ? params.customerId : undefined
        }
        preselectedJobId={
          typeof params.jobId === "string" ? params.jobId : undefined
        }
        priceBookItems={priceBookItems || []}
        properties={properties || []}
      />
    </div>
  );
}
