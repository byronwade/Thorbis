/**
 * Payment Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { PaymentPageContent } from "@/components/work/payments/payment-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paymentId } = await params;

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

  // Check if active company has completed onboarding
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    redirect("/dashboard/welcome");
  }

  // Get active company ID
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    redirect("/dashboard/welcome");
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

  if (paymentError || !payment) {
    return notFound();
  }

  if (payment.company_id !== activeCompanyId) {
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
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <PaymentPageContent entityData={paymentData} />
    </div>
  );
}
