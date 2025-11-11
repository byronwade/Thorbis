/**
 * Customer Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound } from "next/navigation";
import { CustomerPageContent } from "@/components/customers/customer-page-content";
import { CustomerStatsBar } from "@/components/customers/customer-stats-bar";
import { StickyStatsBar } from "@/components/ui/sticky-stats-bar";
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
    console.error("[Customer Page] Error code:", customerError.code);
    console.error("[Customer Page] Error message:", customerError.message);
    console.error("[Customer Page] Error details:", customerError.details);
    console.error("[Customer Page] Error hint:", customerError.hint);
    console.error("[Customer Page] Customer ID:", id);
    console.error("[Customer Page] Company ID:", teamMember.company_id);
    console.error("[Customer Page] Full error object:", JSON.stringify(customerError, null, 2));

    // Try to get more info about why it failed
    const { data: customerWithoutCompanyCheck, error: simpleError } =
      await supabase.from("customers").select("*").eq("id", id).single();

    if (simpleError) {
      console.error(
        "[Customer Page] Customer doesn't exist at all:",
        simpleError
      );
      console.error("[Customer Page] Simple error details:", JSON.stringify(simpleError, null, 2));
      // Customer doesn't exist - show 404
      return notFound();
    } else if (customerWithoutCompanyCheck) {
      console.error(
        "[Customer Page] Customer exists but company_id mismatch:",
        {
          customerCompanyId: customerWithoutCompanyCheck.company_id,
          userCompanyId: teamMember.company_id,
        }
      );
      // Customer exists but belongs to different company
      // Show a helpful error message instead of 404
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="mb-2 text-2xl font-semibold">Access Denied</h1>
            <p className="mb-4 text-muted-foreground">
              This customer belongs to a different company. You can only access customers from your active company.
            </p>
            <p className="mb-6 text-muted-foreground text-sm">
              If you need to access this customer, please switch to the correct company using the company selector in the header.
            </p>
            <a
              href="/dashboard/customers"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              Back to Customers
            </a>
          </div>
        </div>
      );
    }

    // Unknown error
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

  // PERFORMANCE OPTIMIZATION: Don't await enrichment data
  // Load enrichment client-side for instant page render
  // Enrichment is optional and shouldn't block page load

  // Prepare customer data object with raw data
  // Client component will load enrichment in background
  const customerData = {
    customer,
    properties: properties || [], // Pass raw properties, enrichment loads client-side
    jobs: jobs || [],
    invoices: invoices || [],
    activities: activities || [],
    equipment: equipment || [],
    attachments: attachments || [],
    paymentMethods: paymentMethods || [],
    enrichmentData: null, // Loaded client-side for optimistic rendering
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
