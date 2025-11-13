/**
 * Customer Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound } from "next/navigation";
import { CustomerPageContent } from "@/components/customers/customer-page-content";
import { ToolbarActionsProvider } from "@/components/layout/toolbar-actions-provider";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { generateCustomerStats } from "@/lib/stats/utils";
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
    console.error(
      "[Customer Page] Full error object:",
      JSON.stringify(customerError, null, 2)
    );

    // Try to get more info about why it failed
    const { data: customerWithoutCompanyCheck, error: simpleError } =
      await supabase.from("customers").select("*").eq("id", id).single();

    if (simpleError) {
      console.error(
        "[Customer Page] Customer doesn't exist at all:",
        simpleError
      );
      console.error(
        "[Customer Page] Simple error details:",
        JSON.stringify(simpleError, null, 2)
      );
      // Customer doesn't exist - show 404
      return notFound();
    }
    if (customerWithoutCompanyCheck) {
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
            <h1 className="mb-2 font-semibold text-2xl">Access Denied</h1>
            <p className="mb-4 text-muted-foreground">
              This customer belongs to a different company. You can only access
              customers from your active company.
            </p>
            <p className="mb-6 text-muted-foreground text-sm">
              If you need to access this customer, please switch to the correct
              company using the company selector in the header.
            </p>
            <a
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
              href="/dashboard/customers"
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

  // Fetch related data for display (including missing entities for Customer 360° view)
  const [
    { data: properties },
    { data: jobs },
    { data: invoices },
    { data: estimates },
    { data: appointments },
    { data: contracts },
    { data: payments },
    { data: maintenancePlans },
    { data: serviceAgreements },
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
    // NEW: Fetch estimates for this customer
    supabase
      .from("estimates")
      .select("*")
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    // NEW: Fetch appointments/schedules for this customer
    supabase
      .from("schedules")
      .select(`
        *,
        job:jobs!job_id(id, job_number, title),
        property:properties!property_id(id, name, address)
      `)
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("scheduled_start", { ascending: false })
      .limit(10),
    // NEW: Fetch contracts for this customer (via jobs/estimates/invoices)
    supabase
      .from("contracts")
      .select(`
        *,
        job:jobs!job_id(id, job_number),
        estimate:estimates!estimate_id(id, estimate_number),
        invoice:invoices!invoice_id(id, invoice_number)
      `)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50), // Fetch more, will filter below
    // NEW: Fetch payments for this customer
    supabase
      .from("payments")
      .select(`
        *,
        invoice:invoices!invoice_id(id, invoice_number, total_amount)
      `)
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    // NEW: Fetch maintenance plans for this customer
    supabase
      .from("service_plans")
      .select(`
        *,
        property:properties!property_id(id, name, address)
      `)
      .eq("customer_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    // NEW: Fetch service agreements for this customer
    supabase
      .from("service_agreements")
      .select(`
        *,
        property:properties!property_id(id, name, address),
        contract:contracts!contract_id(id, contract_number)
      `)
      .eq("customer_id", id)
      .is("deleted_at", null)
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

  // Filter contracts that belong to this customer's jobs/estimates/invoices
  const customerJobIds = jobs?.map((j) => j.id) || [];
  const customerEstimateIds = estimates?.map((e) => e.id) || [];
  const customerInvoiceIds = invoices?.map((i) => i.id) || [];

  const filteredContracts =
    contracts
      ?.filter(
        (contract) =>
          (contract.job_id && customerJobIds.includes(contract.job_id)) ||
          (contract.estimate_id &&
            customerEstimateIds.includes(contract.estimate_id)) ||
          (contract.invoice_id &&
            customerInvoiceIds.includes(contract.invoice_id))
      )
      .slice(0, 10) || []; // Limit to 10 after filtering

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

  // Prepare customer data object with raw data (Customer 360° view with all related entities)
  // Client component will load enrichment in background
  const customerData = {
    customer,
    properties: properties || [], // Pass raw properties, enrichment loads client-side
    jobs: jobs || [],
    invoices: invoices || [],
    estimates: estimates || [], // NEW
    appointments: appointments || [], // NEW
    contracts: filteredContracts, // NEW - filtered to only this customer's contracts
    payments: payments || [], // NEW
    maintenancePlans: maintenancePlans || [], // NEW
    serviceAgreements: serviceAgreements || [], // NEW
    activities: activities || [],
    equipment: equipment || [],
    attachments: attachments || [],
    paymentMethods: paymentMethods || [],
    enrichmentData: null, // Loaded client-side for optimistic rendering
  };

  // Generate stats for toolbar
  const stats = generateCustomerStats(metrics);

  return (
    <ToolbarStatsProvider stats={stats}>
      <ToolbarActionsProvider actions={null}>
        <div className="flex h-full w-full flex-col overflow-auto">
          <div className="mx-auto w-full max-w-7xl">
            <CustomerPageContent
              customerData={customerData}
              metrics={metrics}
            />
          </div>
        </div>
      </ToolbarActionsProvider>
    </ToolbarStatsProvider>
  );
}
