/**
 * Payment Detail Data Component - OPTIMIZED Progressive Loading
 *
 * Performance Strategy:
 * 1. Load ONLY critical data on page load (payment + customer + invoice + job)
 * 2. Load secondary data on-demand when user opens tabs
 * 3. Use React Query for client-side caching and deduplication
 *
 * Initial Load: 1 query (payment with JOINs)
 * On-Demand: Activities, notes, attachments load when tabs are opened
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { PaymentPageContentOptimized } from "@/components/work/payments/payment-page-content-optimized";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { getUserRole } from "@/lib/auth/permissions";
import { generatePaymentStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type PaymentDetailDataProps = {
	paymentId: string;
};

export async function PaymentDetailDataOptimized({ paymentId }: PaymentDetailDataProps) {
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

	// Check for real errors (not "no rows found")
	const hasRealError =
		teamMemberError &&
		teamMemberError.code !== "PGRST116" &&
		Object.keys(teamMemberError).length > 0 &&
		teamMemberError.message;

	if (hasRealError || !teamMember?.company_id) {
		return notFound();
	}

	// ✅ OPTIMIZATION: Load ONLY critical data on initial page load
	// Activities, notes, attachments will load on-demand when user opens those tabs
	const { data: payment, error: paymentError } = await supabase
		.from("payments")
		.select(
			`
      *,
      customer:customers!customer_id(*),
      invoice:invoices!invoice_id(*),
      job:jobs!job_id(*),
      payment_plan_schedule:payment_plan_schedules!payment_plan_schedule_id(
        *,
        payment_plan:payment_plans!payment_plan_id(
          id,
          name,
          total_amount,
          number_of_payments,
          invoice:invoices!invoice_id(id, invoice_number)
        )
      ),
      financing_provider:financing_providers!financing_provider_id(
        id,
        name,
        provider_type,
        contact_email,
        contact_phone
      )
    `
		)
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
	const customer = Array.isArray(payment.customer) ? payment.customer[0] : payment.customer;
	const invoice = Array.isArray(payment.invoice) ? payment.invoice[0] : payment.invoice;
	const job = Array.isArray(payment.job) ? payment.job[0] : payment.job;
	const paymentPlanSchedule = Array.isArray(payment.payment_plan_schedule)
		? payment.payment_plan_schedule[0]
		: payment.payment_plan_schedule;
	const financingProvider = Array.isArray(payment.financing_provider)
		? payment.financing_provider[0]
		: payment.financing_provider;

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
		paymentPlanSchedule,
		financingProvider,
		userRole: userRole || "technician",
		// Activities, notes, attachments will be fetched on-demand by client components
	};

	// Generate stats for toolbar
	const stats = generatePaymentStats(metrics);

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<PaymentPageContentOptimized entityData={paymentData} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
