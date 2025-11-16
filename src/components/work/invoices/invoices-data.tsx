import { notFound, redirect } from "next/navigation";
import { InvoicesKanban } from "@/components/work/invoices-kanban";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
import { WorkDataView } from "@/components/work/work-data-view";
import {
	getActiveCompanyId,
	isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

// Configuration constants
const MAX_INVOICES_PER_PAGE = 100; // Fetch only recent invoices initially

/**
 * Invoices Data - Async Server Component
 *
 * Fetches invoice data and renders table/kanban views.
 * Streams in after stats (slower query - includes joins).
 */
export async function InvoicesData() {
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
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard/welcome");
	}

	// Fetch only RECENT invoices for fast initial load
	const { data: invoicesRaw, error } = await supabase
		.from("invoices")
		.select(`
      *,
      customer:customers!customer_id(
        first_name,
        last_name,
        display_name,
        email
      )
    `)
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false })
		.limit(MAX_INVOICES_PER_PAGE);

	if (error) {
		const errorMessage =
			error.message || JSON.stringify(error) || "Unknown database error";
		throw new Error(`Failed to load invoices: ${errorMessage}`);
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
	const invoices: Invoice[] = (invoicesRaw || []).map((inv: any) => ({
		id: inv.id,
		invoiceNumber: inv.invoice_number,
		customer:
			inv.customer?.display_name ||
			`${inv.customer?.first_name || ""} ${inv.customer?.last_name || ""}`.trim() ||
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
	}));

	return (
		<WorkDataView
			kanban={<InvoicesKanban invoices={invoices} />}
			section="invoices"
			table={
				<InvoicesTable
					enableVirtualization={true}
					invoices={invoices}
					itemsPerPage={50}
				/>
			}
		/>
	);
}
