/**
 * Invoice Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all invoice data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Invoice data
 * - Customer data
 * - Company data
 * - Job data
 * - Property data
 * - Estimate data (workflow timeline)
 * - Contract data (workflow timeline)
 * - Payment methods
 * - Invoice payments
 * - Activity log
 * - Notes
 * - Attachments
 * - Communications
 *
 * Total: 14 queries (optimized with Promise.all)
 */

import { notFound, redirect } from "next/navigation";
import { InvoicePageContent } from "@/components/invoices/invoice-page-content";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { getActiveCompanyId, isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { generateInvoiceStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type InvoiceDetailDataProps = {
	invoiceId: string;
};

export async function InvoiceDetailData({ invoiceId }: InvoiceDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get current user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	// Check if active company has completed onboarding (has payment)
	const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

	if (!isOnboardingComplete) {
		// User hasn't completed onboarding or doesn't have an active company with payment
		// Redirect to onboarding for better UX
		redirect("/dashboard/welcome");
	}

	// Get active company ID
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		// Should not happen if onboarding is complete, but handle gracefully
		redirect("/dashboard/welcome");
	}

	// Fetch invoice
	const { data: invoice, error: invoiceError } = await supabase
		.from("invoices")
		.select("*")
		.eq("id", invoiceId)
		.single();

	if (invoiceError || !invoice) {
		return notFound();
	}

	// Verify company access
	if (invoice.company_id !== activeCompanyId) {
		return notFound();
	}

	// Fetch related data in parallel (including estimate and contract for workflow timeline)
	const [
		{ data: customer },
		{ data: company },
		{ data: job },
		{ data: property },
		{ data: estimate },
		{ data: contract },
		{ data: paymentMethods },
		{ data: invoicePayments },
		{ data: activities },
		{ data: notes },
		{ data: attachments },
	] = await Promise.all([
		// Fetch customer with full details
		supabase.from("customers").select("*").eq("id", invoice.customer_id).single(),

		// Fetch company
		supabase.from("companies").select("*").eq("id", activeCompanyId).single(),

		// Fetch job (if linked)
		invoice.job_id
			? supabase
					.from("jobs")
					.select("id, job_number, title, property_id")
					.eq("id", invoice.job_id)
					.single()
			: Promise.resolve({ data: null, error: null }),

		// Fetch property (if job has one)
		invoice.job_id
			? supabase
					.from("jobs")
					.select("property_id")
					.eq("id", invoice.job_id)
					.single()
					.then(async ({ data: jobData }) => {
						if (jobData?.property_id) {
							return supabase.from("properties").select("*").eq("id", jobData.property_id).single();
						}
						return { data: null, error: null };
					})
			: Promise.resolve({ data: null, error: null }),

		// Fetch estimate that generated this invoice (for workflow timeline)
		supabase
			.from("estimates")
			.select("id, estimate_number, created_at, status")
			.eq("id", invoice.converted_from_estimate_id || "")
			.maybeSingle(),

		// Fetch contract related to this invoice (for workflow timeline)
		supabase
			.from("contracts")
			.select("id, contract_number, created_at, status, signed_at")
			.eq("invoice_id", invoiceId)
			.is("deleted_at", null)
			.maybeSingle(),

		// Fetch customer payment methods
		supabase
			.from("customer_payment_methods")
			.select("*")
			.eq("customer_id", invoice.customer_id)
			.eq("is_active", true)
			.order("is_default", { ascending: false }),

		// Fetch payments applied to this invoice via invoice_payments junction table
		supabase
			.from("invoice_payments")
			.select(
				`
        id,
        amount_applied,
        applied_at,
        notes,
        payment:payments!payment_id (
          id,
          payment_number,
          amount,
          payment_method,
          payment_type,
          status,
          card_brand,
          card_last4,
          check_number,
          reference_number,
          processor_name,
          receipt_url,
          receipt_number,
          refunded_amount,
          refund_reason,
          processed_at,
          completed_at,
          notes
        )
      `
			)
			.eq("invoice_id", invoiceId)
			.order("applied_at", { ascending: false }),

		// Fetch activity log for this invoice
		supabase
			.from("activity_log")
			.select(
				`
        *,
        user:users!user_id(
          id,
          email,
          first_name,
          last_name
        )
      `
			)
			.eq("entity_type", "invoice")
			.eq("entity_id", invoiceId)
			.order("created_at", { ascending: false })
			.limit(50),

		// Fetch notes for this invoice
		supabase
			.from("notes")
			.select("*")
			.eq("entity_type", "invoice")
			.eq("entity_id", invoiceId)
			.is("deleted_at", null)
			.order("created_at", { ascending: false }),

		// Fetch attachments for this invoice
		supabase
			.from("attachments")
			.select("*")
			.eq("entity_type", "invoice")
			.eq("entity_id", invoiceId)
			.order("created_at", { ascending: false }),
	]);

	const invoiceCommunicationFilters: string[] = [`invoice_id.eq.${invoiceId}`];
	if (invoice.customer_id) {
		invoiceCommunicationFilters.push(`customer_id.eq.${invoice.customer_id}`);
	}
	if (invoice.job_id) {
		invoiceCommunicationFilters.push(`job_id.eq.${invoice.job_id}`);
	}

	let invoiceCommunicationsQuery = supabase
		.from("communications")
		.select(
			`
        *,
        customer:customers!customer_id(id, first_name, last_name)
      `
		)
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false })
		.limit(50);

	if (invoiceCommunicationFilters.length > 1) {
		invoiceCommunicationsQuery = invoiceCommunicationsQuery.or(
			invoiceCommunicationFilters.join(",")
		);
	} else {
		invoiceCommunicationsQuery = invoiceCommunicationsQuery.eq("invoice_id", invoiceId);
	}

	const { data: invoiceCommunications, error: invoiceCommunicationsError } =
		await invoiceCommunicationsQuery;

	if (invoiceCommunicationsError) {
		// TODO: Handle error case
	}

	const communications =
		(invoiceCommunications || []).filter((record, index, self) => {
			if (!record?.id) {
				return false;
			}
			return self.findIndex((entry) => entry.id === record.id) === index;
		}) ?? [];

	// Calculate metrics for stats bar
	const metrics = {
		totalAmount: invoice.total_amount || 0,
		paidAmount: invoice.paid_amount || 0,
		balanceAmount: invoice.balance_amount || 0,
		dueDate: invoice.due_date,
		status: invoice.status,
		createdAt: invoice.created_at,
	};

	// Generate stats for toolbar
	const stats = generateInvoiceStats(metrics);

	const invoiceData = {
		invoice,
		customer,
		company,
		job,
		property,
		estimate, // for workflow timeline
		contract, // for workflow timeline
		paymentMethods: paymentMethods || [],
		invoicePayments: invoicePayments || [],
		notes: notes || [],
		activities: activities || [],
		attachments: attachments || [],
		communications,
	};

	return (
		<ToolbarStatsProvider stats={stats}>
			<div className="flex h-full w-full flex-col overflow-auto">
				<div className="mx-auto w-full max-w-7xl">
					<InvoicePageContent entityData={invoiceData} metrics={metrics} />
				</div>
			</div>
		</ToolbarStatsProvider>
	);
}
