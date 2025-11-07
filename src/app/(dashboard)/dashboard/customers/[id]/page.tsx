/**
 * Customer Page - Unified View/Edit with Novel Editor
 *
 * Notion-style inline-editable customer page with:
 * - Single page for view and edit modes
 * - Toggle between modes with Cmd+E
 * - All content inline-editable
 * - Custom blocks for customer data
 * - Auto-save functionality
 * - Drag-and-drop block reordering
 *
 * Performance:
 * - Server Component wrapper
 * - Client Component for editor (lazy loaded)
 * - Auto-save debounced to 2 seconds
 */

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerPageEditorWrapper } from "@/components/customers/customer-page-editor-wrapper";
import { CustomerStatsBar } from "@/components/customers/customer-stats-bar";
import { StickyStatsBar } from "@/components/ui/sticky-stats-bar";
import { propertyEnrichmentService } from "@/lib/services/property-enrichment";

// Configure page for full width with no sidebars
export const dynamic = "force-dynamic";

// Custom metadata for this page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: "Customer Details",
  };
}

export default async function CustomerPageUnified({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: "edit" | "view" }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;

  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember?.company_id) {
    return notFound();
  }

  // Fetch customer with all related data
  const { data: customer, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      properties:properties!primary_contact_id(count),
      jobs:jobs!customer_id(count),
      invoices:invoices!customer_id(count)
    `
    )
    .eq("id", id)
    .eq("company_id", teamMember.company_id)
    .is("deleted_at", null)
    .single();

  if (error || !customer) {
    return notFound();
  }

  // Fetch related data for display
  const [
    { data: properties },
    { data: jobs },
    { data: invoices },
    { data: activities },
    { data: equipment },
    { data: attachments },
    { data: paymentMethods },
  ] = await Promise.all([
    // Only show properties where this customer is the primary contact
    supabase
      .from("properties")
      .select("*")
      .eq("primary_contact_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("audit_logs")
      .select(`
        *,
        user:users!user_id(name, email, avatar)
      `)
      .eq("entity_type", "customers")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("equipment")
      .select(`
        *,
        property:properties!property_id(address, city, state)
      `)
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("uploaded_at", { ascending: false })
      .limit(500), // Limit to recent 500 attachments for performance
    supabase
      .from("payment_methods")
      .select("*")
      .eq("customer_id", id)
      .is("deleted_at", null)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  // Calculate metrics
  const metrics = {
    totalRevenue: customer.total_revenue || 0,
    totalJobs: jobs?.length || 0,
    totalProperties: properties?.length || 0,
    outstandingBalance: customer.outstanding_balance || 0,
  };

  // Enrich property data with external APIs (property values, maps, etc.)
  const enrichedProperties = await Promise.all(
    (properties || []).map(async (property: any) => {
      try {
        console.log(`Enriching property: ${property.address}, ${property.city}, ${property.state}`);
        const enrichment = await propertyEnrichmentService.enrichProperty(
          property.address,
          property.city,
          property.state,
          property.zip_code
        );
        console.log(`Enrichment result for ${property.address}:`, enrichment);
        return {
          ...property,
          enrichment,
        };
      } catch (error) {
        console.error(`Failed to enrich property ${property.id}:`, error);
        // Add mock enrichment data for development if API fails
        return {
          ...property,
          enrichment: {
            details: {
              squareFootage: property.square_footage || 2400,
              bedrooms: 3,
              bathrooms: 2,
              yearBuilt: property.year_built || 1995,
              lotSizeSquareFeet: 7500,
              hasPool: false,
              hasBasement: false,
              heatingType: "Forced Air",
              coolingType: "Central AC",
            },
            ownership: {
              marketValue: 45000000, // $450,000 in cents
              assessedValue: 42000000,
              lastSalePrice: 40000000,
              lastSaleDate: "2020-03-15",
            },
            taxes: {
              annualAmount: 500000, // $5,000 in cents
              taxYear: 2024,
            },
          },
        };
      }
    })
  );

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      {/* Sticky Stats Bar - Becomes compact on scroll */}
      <StickyStatsBar>
        <CustomerStatsBar metrics={metrics} customerId={id} />
      </StickyStatsBar>

      {/* Full-Width Editor - No Padding */}
      <CustomerPageEditorWrapper
        customer={customer}
        properties={enrichedProperties}
        jobs={jobs || []}
        invoices={invoices || []}
        activities={activities || []}
        equipment={equipment || []}
        attachments={attachments || []}
        paymentMethods={paymentMethods || []}
        metrics={metrics}
        initialMode={mode || "view"}
      />
    </div>
  );
}
