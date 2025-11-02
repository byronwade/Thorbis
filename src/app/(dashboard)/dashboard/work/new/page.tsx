import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/work/job-form";
import { createClient } from "@/lib/supabase/server";

/**
 * New Job Page - Server Component
 *
 * Performance optimizations:
 * - Server Component handles initial data fetching (customers, properties)
 * - Form is client component for interactivity
 * - No sidebar or toolbar per layout config (priority: 77)
 * - Pre-fetch customers and properties for dropdown
 *
 * Layout Configuration:
 * - maxWidth: "4xl" (centered form)
 * - No sidebar, no toolbar
 * - Header only
 */

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{
    customerId?: string;
    propertyId?: string;
  }>;
}) {
  // Await searchParams in Next.js 16+
  const params = await searchParams;

  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Fetch customers and properties for the form dropdowns
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Please sign in to create a job</p>
      </div>
    );
  }

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember?.company_id) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          You must be part of a company to create jobs
        </p>
      </div>
    );
  }

  // Fetch customers for dropdown
  const { data: customers } = await supabase
    .from("customers")
    .select("id, first_name, last_name, email, phone, company_name, address, city, state, zip_code")
    .eq("company_id", teamMember.company_id)
    .is("deleted_at", null)
    .order("first_name", { ascending: true });

  // Fetch properties for dropdown
  const { data: propertiesRaw } = await supabase
    .from("properties")
    .select(`
      id,
      name,
      address,
      city,
      state,
      customer_id,
      customers!customer_id(first_name, last_name)
    `)
    .eq("company_id", teamMember.company_id)
    .order("address", { ascending: true });

  // Transform properties to match expected type (customers should be single object or null, not array)
  const properties = propertiesRaw?.map((property: any) => ({
    ...property,
    customers: Array.isArray(property.customers) && property.customers.length > 0
      ? property.customers[0]
      : null,
  }));

  // Fetch team members for assignment dropdown
  const { data: teamMembersRaw } = await supabase
    .from("team_members")
    .select(`
      user_id,
      users!user_id(id, first_name, last_name, email)
    `)
    .eq("company_id", teamMember.company_id)
    .eq("status", "active");

  // Transform team members to match expected type (users should be single object or null, not array)
  const teamMembers = teamMembersRaw?.map((member: any) => ({
    ...member,
    users: Array.isArray(member.users) && member.users.length > 0
      ? member.users[0]
      : null,
  }));

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl p-6">
          {/* Header with Back Button */}
          <div className="mb-8">
            <Button asChild className="mb-4" size="sm" variant="ghost">
              <Link href="/dashboard/work">
                <ArrowLeft className="mr-2 size-4" />
                Back to Work
              </Link>
            </Button>
            <h1 className="font-bold text-3xl tracking-tight">Create New Job</h1>
            <p className="mt-2 text-muted-foreground text-lg">
              {params.customerId && "Create a job for this customer"}
              {params.propertyId && "Create a job for this property"}
              {!(params.customerId || params.propertyId) &&
                "Create a new work order"}
            </p>
          </div>

          {/* Form */}
          <JobForm
            customers={customers || []}
            properties={properties || []}
            teamMembers={teamMembers || []}
            preselectedCustomerId={params.customerId}
            preselectedPropertyId={params.propertyId}
          />
        </div>
      </div>
    </div>
  );
}
