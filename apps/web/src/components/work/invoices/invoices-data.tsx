import { notFound, redirect } from "next/navigation";
import { InvoicesKanban } from "@/components/work/invoices-kanban";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
import { WorkDataView } from "@/components/work/work-data-view";
import {
	getActiveCompanyId,
	isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import {
	getInvoicesPageData,
	INVOICES_PAGE_SIZE,
} from "@/lib/queries/invoices";

/**
 * Invoices Data - Async Server Component
 *
 * Fetches invoice data and renders table/kanban views.
 * Streams in after stats (slower query - includes joins).
 */
export async function InvoicesData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	// Check if active company has completed onboarding
	const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

	if (!isOnboardingComplete) {
		redirect("/dashboard");
	}

	// Get active company ID
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard");
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { invoices: invoicesRaw, totalCount } = await getInvoicesPageData(
		currentPage,
		INVOICES_PAGE_SIZE,
	);

	if (!invoicesRaw) {
		return notFound();
	}

	// Map database statuses to display statuses
	const mapStatus = (
		dbStatus: string,
	): "paid" | "pending" | "draft" | "overdue" => {
		switch (dbStatus) {
			case "draft":
				return "draft";
			case "sent":
				return "pending";
			case "partial":
				return "pending";
			case "paid":
				return "paid";
			case "past_due":
				return "overdue";
			default:
				return "pending";
		}
	};

	// Transform for table component
	const invoices: Invoice[] = invoicesRaw.map((inv: any) => {
		const customer = Array.isArray(inv.customers)
			? inv.customers[0]
			: inv.customers;
		return {
			id: inv.id,
			invoiceNumber: inv.invoice_number,
			customer:
				customer?.display_name ||
				`${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
				"Unknown Customer",
			date: new Date(inv.created_at).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
			dueDate: inv.due_date
				? new Date(inv.due_date).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: "-",
			amount: inv.total_amount,
			status: mapStatus(inv.status),
			archived_at: inv.archived_at,
			deleted_at: inv.deleted_at,
		};
	});

	return (
		<WorkDataView
			kanban={<InvoicesKanban invoices={invoices} />}
			section="invoices"
			table={
				<InvoicesTable
					currentPage={currentPage}
					enableVirtualization={false}
					invoices={invoices}
					itemsPerPage={INVOICES_PAGE_SIZE}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
