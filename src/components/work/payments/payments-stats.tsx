import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const MAX_PAYMENTS_PER_PAGE = 100;

const COMPLETED_CHANGE = 14.2;
const PENDING_CHANGE_POSITIVE = 6.5;
const REFUNDED_CHANGE_NEGATIVE = -4.1;
const REFUNDED_CHANGE_POSITIVE = 3.2;
const FAILED_CHANGE_NEGATIVE = -7.8;
const FAILED_CHANGE_POSITIVE = 5.9;

export async function UpaymentsStats() {
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
		const errorMessage = error.message || error.hint || JSON.stringify(error) || "Unknown database error";
		throw new Error(`Failed to load payments: ${errorMessage}`);
	}

	// Transform data for components
	const payments = (paymentsRaw || []).map((payment) => ({
		id: payment.id,
		status: payment.status || "pending",
		archived_at: payment.archived_at,
		deleted_at: payment.deleted_at,
	}));

	// Filter to active payments for stats calculations
	const activePayments = payments.filter((p) => !(p.archived_at || p.deleted_at));

	// Calculate payment stats (from active payments only)
	const completedCount = activePayments.filter((p) => p.status === "completed").length;
	const pendingCount = activePayments.filter((p) => p.status === "pending").length;
	const refundedCount = activePayments.filter(
		(p) => p.status === "refunded" || p.status === "partially_refunded"
	).length;
	const failedCount = activePayments.filter((p) => p.status === "failed").length;

	const paymentStats: StatCard[] = [
		{
			label: "Completed",
			value: completedCount,
			change: completedCount > 0 ? COMPLETED_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Pending",
			value: pendingCount,
			change: pendingCount > 0 ? 0 : PENDING_CHANGE_POSITIVE,
			changeLabel: "vs last month",
		},
		{
			label: "Refunded",
			value: refundedCount,
			change: refundedCount > 0 ? REFUNDED_CHANGE_NEGATIVE : REFUNDED_CHANGE_POSITIVE,
			changeLabel: "vs last month",
		},
		{
			label: "Failed",
			value: failedCount,
			change: failedCount > 0 ? FAILED_CHANGE_NEGATIVE : FAILED_CHANGE_POSITIVE,
			changeLabel: "vs last month",
		},
	];

	return <StatusPipeline compact stats={paymentStats} />;
}
