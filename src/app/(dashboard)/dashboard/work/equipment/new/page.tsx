/**
 * New Equipment Page
 *
 * Server Component that fetches data and renders EquipmentForm
 */

import { redirect } from "next/navigation";
import { EquipmentForm } from "@/components/work/equipment/equipment-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewEquipmentPage({
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

  // Fetch properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, address, city, state")
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="font-bold text-3xl tracking-tight">Add New Equipment</h1>
        <p className="text-muted-foreground">
          Track equipment, warranties, and maintenance history
        </p>
      </div>

      <EquipmentForm
        customers={customers || []}
        preselectedCustomerId={
          typeof params.customerId === "string" ? params.customerId : undefined
        }
        preselectedPropertyId={
          typeof params.propertyId === "string" ? params.propertyId : undefined
        }
        properties={properties || []}
      />
    </div>
  );
}
