import { notFound } from "next/navigation";
import { PaymentsKanban } from "@/components/work/payments-kanban";
import { PaymentsTable } from "@/components/work/payments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	getPaymentsPageData,
	PAYMENTS_PAGE_SIZE,
} from "@/lib/queries/payments";

export async function PaymentsData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { payments: paymentsRaw, totalCount } = await getPaymentsPageData(
		currentPage,
		PAYMENTS_PAGE_SIZE,
	);

	if (!paymentsRaw) {
		return notFound();
	}

	// Transform data for components
	const payments = paymentsRaw.map((payment) => ({
		id: payment.id,
		payment_number: payment.payment_number || "",
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
		archived_at: payment.archived_at,
		deleted_at: payment.deleted_at,
	}));

	return (
		<WorkDataView
			kanban={<PaymentsKanban payments={payments} />}
			section="payments"
			table={
				<PaymentsTable
					currentPage={currentPage}
					itemsPerPage={PAYMENTS_PAGE_SIZE}
					payments={payments}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
