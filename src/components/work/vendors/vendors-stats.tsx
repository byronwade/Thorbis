import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { formatCurrency } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/server";

const PERCENTAGE_MULTIPLIER = 100;
const _MONTHS_IN_YEAR = 12;

export async function VendorsStats() {
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

	const { data: vendorsRaw, error } = await supabase
		.from("vendors")
		.select("id, status")
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null);

	if (error) {
		throw new Error(`Failed to fetch vendors: ${error.message}`);
	}

	const vendors = vendorsRaw || [];
	const totalVendors = vendors.length;
	const activeVendors = vendors.filter((v) => v.status === "active").length;
	const inactiveVendors = vendors.filter((v) => v.status === "inactive").length;

	const { data: purchaseOrders } = await supabase
		.from("purchase_orders")
		.select("id, vendor_id, total_amount, status, created_at")
		.eq("company_id", activeCompanyId)
		.is("deleted_at", null);

	const poRows =
		(purchaseOrders as Array<{
			id: string;
			vendor_id: string | null;
			total_amount: number | null;
			status: string | null;
			created_at: string;
		}>) || [];

	const twelveMonthsAgo = new Date();
	twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

	const spendLast12Months = poRows
		.filter((po) => new Date(po.created_at).getTime() >= twelveMonthsAgo.getTime())
		.reduce((sum, po) => sum + (po.total_amount || 0), 0);

	const engagedVendors = new Set(
		poRows
			.filter((po) => po.vendor_id && new Date(po.created_at) >= twelveMonthsAgo)
			.map((po) => po.vendor_id as string)
	).size;

	const openStatuses = ["draft", "pending_approval", "approved", "ordered", "partially_received"];
	const openPurchaseOrders = poRows.filter((po) =>
		openStatuses.includes((po.status || "").toLowerCase())
	);
	const openPOValue = openPurchaseOrders.reduce((sum, po) => sum + (po.total_amount || 0), 0);

	const activePercentage =
		totalVendors > 0 ? Math.round((activeVendors / totalVendors) * PERCENTAGE_MULTIPLIER) : 0;

	const vendorStats: StatCard[] = [
		{
			label: "Total Vendors",
			value: totalVendors,
			change: activePercentage,
			changeLabel: "active in network",
		},
		{
			label: "Active Vendors",
			value: activeVendors,
			change: inactiveVendors,
			changeLabel: "inactive on file",
		},
		{
			label: "12-mo Spend",
			value: formatCurrency(spendLast12Months),
			change: engagedVendors,
			changeLabel: "vendors used",
		},
		{
			label: "Open PO Value",
			value: formatCurrency(openPOValue),
			change: openPurchaseOrders.length,
			changeLabel: "POs in flight",
		},
	];

	return <StatusPipeline compact stats={vendorStats} />;
}
