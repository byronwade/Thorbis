import { notFound } from "next/navigation";
import { PaymentsKanban } from "@/components/work/payments-kanban";
import { PaymentsTable } from "@/components/work/payments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const MAX_PAYMENTS_PER_PAGE = 100;

export async function UpaymentsData() {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch payments from payments table
	const { data: paymentsRaw, error } = await supabase
		.from("payments")
		.select(`
      *,
      customers!customer_id(first_name, last_name, display_name)
    `)
		.eq("company_id", activeCompanyId)
		.order("processed_at", { ascending: false })
		.order("created_at", { ascending: false })
		.limit(MAX_PAYMENTS_PER_PAGE);

	if (error) {
		const errorMessage =
			error.message ||
			error.hint ||
			JSON.stringify(error) ||
			"Unknown database error";
		throw new Error(`Failed to load payments: ${errorMessage}`);
	}

	// Transform data for components
	const payments = (paymentsRaw || []).map((payment) => ({
		id: payment.id,
		payment_number: payment.payment_number,
		amount: payment.amount ?? 0,
		payment_method: payment.payment_method || "other",
		status: payment.status || "pending",
		processed_at: payment.processed_at ? new Date(payment.processed_at) : null,
		created_at: new Date(payment.created_at),
		updated_at: new Date(payment.updated_at),
		customer: Array.isArray(payment.customers)
			? payment.customers[0]
			: payment.customers,
		invoice_id: payment.invoice_id,
		job_id: payment.job_id,
		customer_id: payment.customer_id,
		company_id: payment.company_id,
		description: payment.description,
		transaction_id: payment.transaction_id,
		processor: payment.processor,
		archived_at: payment.archived_at,
		deleted_at: payment.deleted_at,
	}));

	return (
		<WorkDataView
			kanban={<PaymentsKanban payments={payments} />}
			section="payments"
			table={
				<div>
					<PaymentsTable itemsPerPage={50} payments={payments} />
				</div>
			}
		/>
	);
}
