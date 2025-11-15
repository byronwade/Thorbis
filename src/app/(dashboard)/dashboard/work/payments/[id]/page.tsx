/**
 * Payment Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { PaymentPageContent } from "@/components/work/payments/payment-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { getUserRole } from "@/lib/auth/permissions";
import { generatePaymentStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paymentId } = await params;

  console.log("[Payment Details] Loading payment:", paymentId);

  const supabase = await createClient();

  if (!supabase) {
    console.error("[Payment Details] No supabase client");
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[Payment Details] No authenticated user");
    return notFound();
  }

  console.log("[Payment Details] User authenticated:", user.id);

  // Check if active company has completed onboarding (has payment)
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    console.log(
      "[Payment Details] Company onboarding incomplete for user:",
      user.id,
      "- redirecting to onboarding"
    );
    // Redirect to onboarding if company hasn't completed setup
    redirect("/dashboard/welcome");
  }

  // Get active company ID (from cookie or first available)
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    console.log(
      "[Payment Details] No active company found for user:",
      user.id,
      "- redirecting to onboarding"
    );
    // Redirect to onboarding if user doesn't have an active company
    redirect("/dashboard/welcome");
  }

  console.log("[Payment Details] Active company:", activeCompanyId);

  // Verify user has access to the active company and get their role
  const { data: teamMember, error: teamMemberError } = await supabase
    .from("team_members")
    .select("company_id, role")
    .eq("user_id", user.id)
    .eq("company_id", activeCompanyId)
    .eq("status", "active")
    .maybeSingle();

  // Get user's role for role-based UI
  const userRole = await getUserRole(supabase, user.id, activeCompanyId);
  console.log("[Payment Details] User role:", userRole);

  // Check for real errors (not "no rows found")
  const hasRealError =
    teamMemberError &&
    teamMemberError.code !== "PGRST116" &&
    Object.keys(teamMemberError).length > 0 &&
    teamMemberError.message;

  if (hasRealError) {
    console.error(
      "[Payment Details] Error fetching team member:",
      teamMemberError
    );
    return notFound();
  }

  if (!teamMember?.company_id) {
    console.error(
      "[Payment Details] User doesn't have access to active company:",
      activeCompanyId
    );
    // Show 404 instead of redirecting to avoid redirect loops
    // The dashboard layout handles onboarding redirects
    return notFound();
  }

  // Fetch payment with all related data
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select(`
      *,
      customer:customers!customer_id(*),
      invoice:invoices!invoice_id(*),
      job:jobs!job_id(*)
    `)
    .eq("id", paymentId)
    .is("deleted_at", null)
    .single();

  if (paymentError) {
    console.error("[Payment Details] Error fetching payment:", paymentError);
    return notFound();
  }

  if (!payment) {
    console.error("[Payment Details] Payment not found:", paymentId);
    return notFound();
  }

  if (payment.company_id !== activeCompanyId) {
    console.error(
      "[Payment Details] Payment company mismatch:",
      `Payment company: ${payment.company_id}, Active company: ${activeCompanyId}`
    );
    return notFound();
  }

  // Get related data
  const customer = Array.isArray(payment.customer)
    ? payment.customer[0]
    : payment.customer;
  const invoice = Array.isArray(payment.invoice)
    ? payment.invoice[0]
    : payment.invoice;
  const job = Array.isArray(payment.job) ? payment.job[0] : payment.job;

  // Fetch all related data (including payment plan and financing provider)
  const [
    { data: paymentPlanSchedule },
    { data: financingProvider },
    { data: activities },
    { data: notes },
    { data: attachments },
  ] = await Promise.all([
    // NEW: Fetch payment plan schedule if this is a plan payment
    payment.payment_plan_schedule_id
      ? supabase
          .from("payment_plan_schedules")
          .select(`
            *,
            payment_plan:payment_plans!payment_plan_id(
              id,
              name,
              total_amount,
              number_of_payments,
              invoice:invoices!invoice_id(id, invoice_number)
            )
          `)
          .eq("id", payment.payment_plan_schedule_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // NEW: Fetch financing provider if using financing
    payment.financing_provider_id
      ? supabase
          .from("financing_providers")
          .select("id, name, provider_type, contact_email, contact_phone")
          .eq("id", payment.financing_provider_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "payment")
      .eq("entity_id", paymentId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notes")
      .select("*")
      .eq("entity_type", "payment")
      .eq("entity_id", paymentId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "payment")
      .eq("entity_id", paymentId)
      .order("created_at", { ascending: false }),
  ]);

  // Calculate metrics
  const metrics = {
    amount: payment.amount || 0,
    status: payment.status || "pending",
    paymentMethod: payment.payment_method || "unknown",
    paymentType: payment.payment_type || "payment",
    createdAt: payment.created_at,
    processedAt: payment.processed_at,
    refundedAmount: payment.refunded_amount || 0,
  };

  const paymentData = {
    payment,
    customer,
    invoice,
    job,
    paymentPlanSchedule, // NEW
    financingProvider, // NEW
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
    userRole: userRole || "technician", // User's role for role-based UI
  };

  // Generate stats for toolbar
  const stats = generatePaymentStats(metrics);

  return (
    <ToolbarStatsProvider stats={stats}>
      <div className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <PaymentPageContent entityData={paymentData} />
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
