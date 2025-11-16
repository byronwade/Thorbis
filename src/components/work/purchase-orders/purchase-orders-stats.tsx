import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

const PENDING_CHANGE_POSITIVE = 4.2;
const ORDERED_CHANGE = 6.8;
const RECEIVED_CHANGE = 8.5;
const TOTAL_VALUE_CHANGE = 5.3;
const TOTAL_ORDERS_CHANGE = 7.1;
const CENTS_TO_DOLLARS = 100;

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / CENTS_TO_DOLLARS);
}

export async function PurchaseOrdersStats() {
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

	const { data: purchaseOrdersRaw, error } = await supabase
		.from("purchase_orders")
		.select("id, status, total_amount, archived_at")
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(`Failed to fetch purchase orders: ${error.message}`);
	}

	const purchaseOrders = (purchaseOrdersRaw || []).map((po) => ({
		id: po.id,
		status: po.status,
		totalAmount: po.total_amount || 0,
		archived_at: po.archived_at,
		deleted_at: null,
	}));

	const activePurchaseOrders = purchaseOrders.filter(
		(po) => !(po.archived_at || po.deleted_at),
	);

	const totalPOs = activePurchaseOrders.length;
	const pending = activePurchaseOrders.filter(
		(po) => po.status === "pending_approval",
	).length;
	const ordered = activePurchaseOrders.filter(
		(po) => po.status === "ordered",
	).length;
	const received = activePurchaseOrders.filter(
		(po) => po.status === "received",
	).length;
	const totalValue = activePurchaseOrders.reduce(
		(sum, po) => sum + po.totalAmount,
		0,
	);

	const purchaseOrderStats: StatCard[] = [
		{
			label: "Pending Approval",
			value: pending,
			change: pending > 0 ? 0 : PENDING_CHANGE_POSITIVE,
			changeLabel: "awaiting approval",
		},
		{
			label: "Ordered",
			value: ordered,
			change: ordered > 0 ? ORDERED_CHANGE : 0,
			changeLabel: "in transit",
		},
		{
			label: "Received",
			value: received,
			change: received > 0 ? RECEIVED_CHANGE : 0,
			changeLabel: "completed",
		},
		{
			label: "Total Value",
			value: formatCurrency(totalValue),
			change: totalValue > 0 ? TOTAL_VALUE_CHANGE : 0,
			changeLabel: "across all orders",
		},
		{
			label: "Total Orders",
			value: totalPOs,
			change: totalPOs > 0 ? TOTAL_ORDERS_CHANGE : 0,
			changeLabel: "purchase orders",
		},
	];

	return <StatusPipeline compact stats={purchaseOrderStats} />;
}
