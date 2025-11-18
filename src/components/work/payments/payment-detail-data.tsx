/**
 * Payment Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all payment data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Team member (role check)
 * - Payment data (with customer, invoice, job)
 * - Payment plan schedule (if applicable)
 * - Financing provider (if applicable)
 * - Activity log
 * - Notes
 * - Attachments
 *
 * Total: 7 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { PaymentPageContent } from "@/components/work/payments/payment-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { getUserRole } from "@/lib/auth/permissions";
import { generatePaymentStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type PaymentDetailDataProps = {
	paymentId: string;
};

export async function PaymentDetailData({ paymentId }: PaymentDetailDataProps) {
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

	// Fetch payment with all related data
	const { data: payment, error: paymentError } = await supabase
		.from("payments")
		.select(
			`
      *,
      customer:customers!customer_id(*),
      invoice:invoices!invoice_id(*),
      job:jobs!job_id(*)
    `,
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
	const customer = Array.isArray(payment.customer)
		? payment.customer[0]
		: payment.customer;
	const invoice = Array.isArray(payment.invoice)
		? payment.invoice[0]
		: payment.invoice;
	const job = Array.isArray(payment.job) ? payment.job[0] : payment.job;

	// Fetch all related data
	const [
		{ data: paymentPlanSchedule },
		{ data: financingProvider },
		{ data: activities },
		{ data: notes },
		{ data: attachments },
	] = await Promise.all([
		// Fetch payment plan schedule if this is a plan payment
		payment.payment_plan_schedule_id
			? supabase
					.from("payment_plan_schedules")
					.select(
						`
            *,
            payment_plan:payment_plans!payment_plan_id(
              id,
              name,
              total_amount,
              number_of_payments,
              invoice:invoices!invoice_id(id, invoice_number)
            )
          `,
					)
					.eq("id", payment.payment_plan_schedule_id)
					.single()
			: Promise.resolve({ data: null, error: null }),

		// Fetch financing provider if using financing
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
		paymentPlanSchedule,
		financingProvider,
		activities: activities || [],
		notes: notes || [],
		attachments: attachments || [],
		userRole: userRole || "technician",
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
