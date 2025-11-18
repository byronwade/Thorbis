import { notFound, redirect } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import {
	getActiveCompanyId,
	isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

/**
 * Invoices Stats - Async Server Component
 *
 * Fetches and calculates invoice statistics.
 * Streams in after shell renders (fast query - aggregates only).
 */
export async function InvoicesStats() {
	const supabase = await createServiceSupabaseClient();

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

	// Fetch only aggregated stats (fast!)
	const { data: invoicesRaw } = await supabase
		.from("invoices")
		.select(
			"status, total_amount, paid_amount, balance_amount, archived_at, deleted_at",
		)
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null);

	// Calculate invoice stats
	const activeInvoices = invoicesRaw?.filter((inv) => !inv.archived_at) || [];

	const draftInvoices = activeInvoices.filter((inv) => inv.status === "draft");
	const pendingInvoices = activeInvoices.filter(
		(inv) => inv.status === "sent" || inv.status === "partial",
	);
	const paidInvoices = activeInvoices.filter((inv) => inv.status === "paid");
	const overdueInvoices = activeInvoices.filter(
		(inv) => inv.status === "past_due",
	);

	const draftCount = draftInvoices.length;
	const pendingCount = pendingInvoices.length;
	const paidCount = paidInvoices.length;
	const overdueCount = overdueInvoices.length;

	const totalRevenue = paidInvoices.reduce(
		(sum, inv) => sum + (inv.paid_amount || 0),
		0,
	);
	const pendingRevenue = pendingInvoices.reduce(
		(sum, inv) => sum + (inv.balance_amount || inv.total_amount || 0),
		0,
	);
	const overdueRevenue = overdueInvoices.reduce(
		(sum, inv) => sum + (inv.balance_amount || inv.total_amount || 0),
		0,
	);
	const draftRevenue = draftInvoices.reduce(
		(sum, inv) => sum + (inv.total_amount || 0),
		0,
	);

	const invoiceStats: StatCard[] = [
		{
			label: "Draft",
			value:
				draftCount > 0
					? `${draftCount} ($${(draftRevenue / 100).toLocaleString()})`
					: "0",
			change: 0,
			changeLabel: draftCount > 0 ? "ready to send" : "no drafts",
		},
		{
			label: "Pending",
			value: `$${(pendingRevenue / 100).toLocaleString()}`,
			change: 0,
			changeLabel: `${pendingCount} invoice${pendingCount !== 1 ? "s" : ""}`,
		},
		{
			label: "Paid",
			value: `$${(totalRevenue / 100).toLocaleString()}`,
			change: paidCount > 0 ? 12.4 : 0,
			changeLabel: `${paidCount} invoice${paidCount !== 1 ? "s" : ""}`,
		},
		{
			label: "Overdue",
			value:
				overdueCount > 0 ? `$${(overdueRevenue / 100).toLocaleString()}` : "$0",
			change: overdueCount > 0 ? -15.2 : 0,
			changeLabel:
				overdueCount > 0
					? `${overdueCount} need${overdueCount === 1 ? "s" : ""} attention`
					: "all current",
		},
		{
			label: "Total Invoices",
			value: activeInvoices.length,
			change: 0,
			changeLabel: "active",
		},
	];

	return <StatusPipeline compact stats={invoiceStats} />;
}
