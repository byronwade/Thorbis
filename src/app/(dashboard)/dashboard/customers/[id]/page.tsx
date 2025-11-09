/**
 * Customer Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound } from "next/navigation";
import { getEnrichmentData } from "@/actions/customer-enrichment";
import { CustomerPageContent } from "@/components/customers/customer-page-content";
import { CustomerStatsBar } from "@/components/customers/customer-stats-bar";
import { StickyStatsBar } from "@/components/ui/sticky-stats-bar";
import { jobEnrichmentService } from "@/lib/services/job-enrichment";
import { propertyEnrichmentService } from "@/lib/services/property-enrichment";
import { createClient } from "@/lib/supabase/server";

// Configure page for full width with no sidebars
export const dynamic = "force-dynamic";

// Custom metadata for this page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: "Customer Details",
  };
}

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  // Get the active company ID (from company context)
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    console.error("[Customer Page] No active company ID");
    return notFound();
  }

  // Get user's membership for the ACTIVE company
  const { data: teamMember, error: teamMemberError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", activeCompanyId)
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
      console.error(
        "[Customer Page] Team member query error:",
        JSON.stringify(teamMemberError, null, 2)
      );
      console.error(
        "[Customer Page] Error object keys:",
        Object.keys(teamMemberError)
      );
      console.error("[Customer Page] Error message:", teamMemberError.message);
      console.error("[Customer Page] Error code:", teamMemberError.code);
      console.error("[Customer Page] User ID:", user.id);
    } catch (e) {
      console.error(
        "[Customer Page] Team member error (could not serialize):",
        teamMemberError
      );
      console.error("[Customer Page] User ID:", user.id);
    }
    return notFound();
  }

  if (!teamMember?.company_id) {
    // User doesn't have an active company membership
    // This typically happens when:
    // 1. User's membership was deactivated
    // 2. User was removed from their company
    // Note: Onboarding check happens in the layout, so users who reach this
    // page should already have completed onboarding

    console.error(
      "[Customer Page] User has no active company membership. User ID:",
      user.id
    );

    // Check if user has any team_members record at all for debugging
    const { data: anyMembership, error: checkError } = await supabase
      .from("team_members")
      .select("company_id, status")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("[Customer Page] Error checking membership:", checkError);
    } else if (anyMembership) {
      console.error(
        "[Customer Page] User has inactive team membership. Status:",
        anyMembership.status
      );
    } else {
      console.error("[Customer Page] User has no team_members record.");
    }

    // Show 404 instead of redirecting to avoid redirect loops
    // The dashboard layout handles onboarding redirects
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
    const { data: customerWithoutCompanyCheck, error: simpleError } =
      await supabase.from("customers").select("*").eq("id", id).single();

    if (simpleError) {
      console.error(
        "[Customer Page] Customer doesn't exist at all:",
        simpleError
      );
    } else if (customerWithoutCompanyCheck) {
      console.error(
        "[Customer Page] Customer exists but company_id mismatch:",
        {
          customerCompanyId: customerWithoutCompanyCheck.company_id,
          userCompanyId: teamMember.company_id,
        }
      );
    }

    return notFound();
  }

  if (!customer) {
    console.error(
      "[Customer Page] Customer not found. ID:",
      id,
      "Company ID:",
      teamMember.company_id
    );
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
  const enrichmentData = enrichmentResult.success
    ? enrichmentResult.data
    : null;

  // Enrich property data with external APIs
  const enrichedProperties = await Promise.all(
    (properties || []).map(async (property: any) => {
      try {
        console.log(
          `[Customer Page] Enriching property: ${property.address}, ${property.city}, ${property.state}`
        );

        // Get both property market data AND operational intelligence
        const [propertyEnrichment, operationalIntelligence] = await Promise.all(
          [
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
          ]
        );

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

  // Prepare customer data object
  const customerData = {
    customer,
    properties: enrichedProperties,
    jobs: jobs || [],
    invoices: invoices || [],
    activities: activities || [],
    equipment: equipment || [],
    attachments: attachments || [],
    paymentMethods: paymentMethods || [],
    enrichmentData,
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      {/* Sticky Stats Bar - Becomes compact on scroll */}
      <StickyStatsBar>
        <CustomerStatsBar customerId={id} metrics={metrics} />
      </StickyStatsBar>

      {/* Full-Width Content - No Padding */}
      <CustomerPageContent customerData={customerData} metrics={metrics} />
    </div>
  );
}
