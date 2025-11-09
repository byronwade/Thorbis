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
import { jobEnrichmentService } from "@/lib/services/job-enrichment";
import { getEnrichmentData } from "@/actions/customer-enrichment";

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
    console.error("[Customer Page] Supabase client not initialized");
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("[Customer Page] Auth error:", authError);
    return notFound();
  }

  if (!user) {
    console.error("[Customer Page] No authenticated user");
    return notFound();
  }

  // Get user's company
  const { data: teamMember, error: teamMemberError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  // Check for real errors (not "no rows found")
  // maybeSingle shouldn't return errors for no rows, but check anyway
  const hasRealError =
    teamMemberError &&
    teamMemberError.code !== "PGRST116" &&
    Object.keys(teamMemberError).length > 0;

  if (hasRealError) {
    // Log error with proper serialization
    try {
      console.error("[Customer Page] Team member query error:", JSON.stringify(teamMemberError, null, 2));
      console.error("[Customer Page] Error object keys:", Object.keys(teamMemberError));
      console.error("[Customer Page] Error message:", teamMemberError.message);
      console.error("[Customer Page] Error code:", teamMemberError.code);
      console.error("[Customer Page] User ID:", user.id);
    } catch (e) {
      console.error("[Customer Page] Team member error (could not serialize):", teamMemberError);
      console.error("[Customer Page] User ID:", user.id);
    }
    return notFound();
  }

  if (!teamMember?.company_id) {
    console.error("[Customer Page] User has no active company membership. User ID:", user.id);
    
    // Check if user has any team_members record at all
    const { data: anyMembership, error: checkError } = await supabase
      .from("team_members")
      .select("company_id, status")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    
    if (checkError && checkError.code !== "PGRST116") {
      console.error("[Customer Page] Error checking membership:", checkError);
    } else if (anyMembership) {
      console.error("[Customer Page] User has team membership but status is:", anyMembership.status);
    } else {
      console.error("[Customer Page] User has no team_members record at all");
    }
    
    return notFound();
  }

  // First, try a simple query to check if customer exists
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("company_id", teamMember.company_id)
    .is("deleted_at", null)
    .single();

  if (customerError) {
    console.error("[Customer Page] Customer query error:", customerError);
    console.error("[Customer Page] Customer ID:", id);
    console.error("[Customer Page] Company ID:", teamMember.company_id);
    
    // Try to get more info about why it failed
    const { data: customerWithoutCompanyCheck, error: simpleError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();
    
    if (simpleError) {
      console.error("[Customer Page] Customer doesn't exist at all:", simpleError);
    } else if (customerWithoutCompanyCheck) {
      console.error("[Customer Page] Customer exists but company_id mismatch:", {
        customerCompanyId: customerWithoutCompanyCheck.company_id,
        userCompanyId: teamMember.company_id,
      });
    }
    
    return notFound();
  }

  if (!customer) {
    console.error("[Customer Page] Customer not found. ID:", id, "Company ID:", teamMember.company_id);
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

  // Get enrichment data (cached if available)
  const enrichmentResult = await getEnrichmentData(id);
  const enrichmentData = enrichmentResult.success ? enrichmentResult.data : null;

  // Enrich property data with external APIs
  const enrichedProperties = await Promise.all(
    (properties || []).map(async (property: any) => {
      try {
        console.log(
          `[Customer Page] Enriching property: ${property.address}, ${property.city}, ${property.state}`
        );

        // Get both property market data AND operational intelligence
        const [propertyEnrichment, operationalIntelligence] = await Promise.all([
          // Property market data (value, taxes, etc.)
          propertyEnrichmentService
            .enrichProperty(
              property.address,
              property.city,
              property.state,
              property.zip_code
            )
            .catch((e) => {
              console.warn(
                `[Customer Page] Property enrichment failed for ${property.id}:`,
                e
              );
              return null;
            }),
          // Operational intelligence (weather, building, location, etc.)
          jobEnrichmentService
            .enrichJob({
              id: property.id,
              address: property.address,
              address2: property.address2 || undefined,
              city: property.city,
              state: property.state,
              zipCode: property.zip_code,
              lat: property.lat || undefined,
              lon: property.lon || undefined,
            })
            .catch((e) => {
              console.warn(
                `[Customer Page] Operational intelligence failed for ${property.id}:`,
                e
              );
              return null;
            }),
        ]);

        return {
          ...property,
          enrichment: propertyEnrichment,
          operationalIntelligence,
        };
      } catch (error) {
        console.error(
          `[Customer Page] Failed to enrich property ${property.id}:`,
          error
        );
        return {
          ...property,
          enrichment: null,
          operationalIntelligence: null,
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
        enrichmentData={enrichmentData}
        initialMode={mode || "view"}
      />
    </div>
  );
}
